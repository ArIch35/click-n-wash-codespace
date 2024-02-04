import { RequestHandler, Router } from 'express';
import { Between, FindOperator, ILike } from 'typeorm';
import { ValidationError } from 'yup';
import getDb from '../db';
import Laundromat, {
  analyticsLaundromatSchema,
  createLaundromatSchema,
  updateLaundromatSchema,
} from '../entities/laundromat';
import WashingMachine from '../entities/washing-machine';
import StatusError from '../utils/error-with-status';
import formatDate from '../utils/format-date';
import {
  MESSAGE_FORBIDDEN_NOT_OWNER,
  MESSAGE_NOT_FOUND,
  MESSAGE_OK,
  MESSAGE_SERVER_ERROR,
  customMessage,
} from '../utils/http-return-messages';
import {
  STATUS_BAD_REQUEST,
  STATUS_CONFLICT,
  STATUS_FORBIDDEN,
  STATUS_NOT_FOUND,
  STATUS_OK,
  STATUS_SERVER_ERROR,
} from '../utils/http-status-codes';

interface TimeSlot {
  start: Date;
  end: Date;
}

interface washingMachineTimeSlots {
  washingMachine: WashingMachine;
  timeSlots: TimeSlot[];
}

interface Chart {
  name: string;
  label: string;
  color: string;
}

interface LaundromatAnalytics {
  laundromat: Laundromat;
  analytics: {
    date: string;
    revenue: number;
    totalFinishedContracts: number;
    totalOngoingContracts: number;
    totalCancelledContracts: number;
  }[];
  series: Chart[];
}

const router: Router = Router();

router.get('/', (async (req, res) => {
  try {
    const uid = res.locals.uid as string;
    const onlyOwned = req.query.onlyOwned === 'true';
    const name = req.query.name as string | undefined;
    const city = req.query.city as string | undefined;
    const price = (req.query.price as string | undefined)?.split(',');

    const laundromats = await getDb().laundromatRepository.find({
      where: {
        ...(onlyOwned ? { owner: { id: uid } } : {}),
        ...filterConditionBuilder(name, city, price?.[0], price?.[1]),
      },
      relations: { washingMachines: true },
    });
    return res.status(STATUS_OK).json(laundromats);
  } catch (error) {
    console.log(error);
    return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
  }
}) as RequestHandler);

const filterConditionBuilder = (
  name?: string,
  city?: string,
  priceFrom?: string,
  priceTo?: string,
) => {
  const filterCondition: { [key: string]: FindOperator<string> | string } = {};
  if (name) {
    filterCondition.name = ILike(`%${name}%`);
  }
  if (city) {
    filterCondition.city = ILike(`%${city}%`);
  }
  if (priceFrom && priceTo) {
    filterCondition.price = Between(priceFrom, priceTo);
  }
  return filterCondition;
};

router.get('/filter-params', (async (_, res) => {
  try {
    const cities = (
      await getDb()
        .laundromatRepository.createQueryBuilder('laundromat')
        .select('laundromat.city')
        .distinct(true)
        .getRawMany()
    ).map((city: { laundromat_city: string }) => city.laundromat_city);
    const maxPrice = (await getDb().laundromatRepository.maximum('price')) || 0;
    const minPrice = (await getDb().laundromatRepository.minimum('price')) || 0;
    return res.status(STATUS_OK).json({ cities, maxPrice, minPrice });
  } catch (error) {
    return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
  }
}) as RequestHandler);

router.get('/:id', (async (req, res) => {
  try {
    const laundromat = await getDb().laundromatRepository.findOne({
      where: { id: req.params.id },
      relations: { washingMachines: { contracts: true } },
    });
    if (!laundromat) {
      return res.status(STATUS_NOT_FOUND).json(MESSAGE_NOT_FOUND);
    }
    return res.status(STATUS_OK).json(laundromat);
  } catch (error) {
    return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
  }
}) as RequestHandler);

router.get('/:id/occupied-slots', (async (req, res) => {
  try {
    const laundromat = await getDb().laundromatRepository.findOne({
      where: { id: req.params.id },
      relations: { washingMachines: { contracts: true } },
    });
    if (!laundromat) {
      return res.status(STATUS_NOT_FOUND).json(MESSAGE_NOT_FOUND);
    }

    const laundromatTimeSlots: washingMachineTimeSlots[] = [];
    laundromat.washingMachines?.forEach((washingMachine) => {
      const timeSlots: TimeSlot[] = [];
      washingMachine.contracts
        ?.filter((contract) => contract.status === 'ongoing')
        .forEach((contract) => {
          timeSlots.push({
            start: contract.startDate,
            end: contract.endDate,
          });
        });
      laundromatTimeSlots.push({
        washingMachine,
        timeSlots,
      });
    });
    return res.status(STATUS_OK).json(Array.from(laundromatTimeSlots));
  } catch (error) {
    return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
  }
}) as RequestHandler);

router.get('/:id/analytics', (async (req, res) => {
  try {
    const validated = await analyticsLaundromatSchema.validate(
      {
        startDate: new Date(req.query.startDate as string),
        endDate: new Date(req.query.endDate as string),
        span: req.query.span as string,
      },
      { strict: true },
    );
    validated.startDate.setHours(0, 0, 0, 0);
    validated.endDate.setHours(23, 59, 59, 999);
    const laundromat = await getDb().laundromatRepository.findOne({
      where: { id: req.params.id },
      relations: { washingMachines: { contracts: true } },
    });
    if (!laundromat) {
      return res.status(STATUS_NOT_FOUND).json(MESSAGE_NOT_FOUND);
    }

    const laundromatAnalytics: LaundromatAnalytics = {
      laundromat,
      analytics: [],
      series: [
        { name: 'totalFinishedContracts', label: 'Finished Contracts', color: 'blue' },
        { name: 'totalOngoingContracts', label: 'Ongoing Contracts', color: 'green' },
        { name: 'totalCancelledContracts', label: 'Cancelled Contracts', color: 'red' },
      ],
    };

    let currentStartDate = new Date(validated.startDate);
    while (currentStartDate <= validated.endDate) {
      const currentEndDate = new Date(currentStartDate);
      switch (validated.span) {
        case 'day':
          currentEndDate.setDate(currentEndDate.getDate() + 1);
          break;
        case 'week':
          currentEndDate.setDate(currentEndDate.getDate() + 7);
          break;
        case 'month':
          currentEndDate.setMonth(currentEndDate.getMonth() + 1);
          break;
        case 'year':
          currentEndDate.setFullYear(currentEndDate.getFullYear() + 1);
          break;
      }

      const revenue = laundromat.washingMachines
        ?.flatMap(
          (washingMachine) =>
            washingMachine.contracts?.filter(
              (contract) =>
                contract.startDate >= currentStartDate &&
                contract.startDate < currentEndDate &&
                contract.status === 'finished',
            ),
        )
        .reduce((acc, contract) => acc + (contract?.price || 0), 0);

      const totalFinishedContracts = laundromat.washingMachines?.flatMap(
        (washingMachine) =>
          washingMachine.contracts?.filter(
            (contract) =>
              contract.startDate >= currentStartDate &&
              contract.startDate < currentEndDate &&
              contract.status === 'finished',
          ),
      ).length;

      const totalOngoingContracts = laundromat.washingMachines?.flatMap(
        (washingMachine) =>
          washingMachine.contracts?.filter(
            (contract) =>
              contract.startDate >= currentStartDate &&
              contract.startDate < currentEndDate &&
              contract.status === 'ongoing',
          ),
      ).length;

      const totalCancelledContracts = laundromat.washingMachines?.flatMap(
        (washingMachine) =>
          washingMachine.contracts?.filter(
            (contract) =>
              contract.startDate >= currentStartDate &&
              contract.startDate < currentEndDate &&
              contract.status === 'cancelled',
          ),
      ).length;

      laundromatAnalytics.analytics.push({
        date: `${formatDate(currentStartDate)} - ${formatDate(
          new Date(currentEndDate.getTime() - 1),
        )}`,
        revenue: revenue || 0,
        totalFinishedContracts: totalFinishedContracts || 0,
        totalOngoingContracts: totalOngoingContracts || 0,
        totalCancelledContracts: totalCancelledContracts || 0,
      });

      currentStartDate = currentEndDate;
    }

    return res.status(STATUS_OK).json(laundromatAnalytics);
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return res.status(STATUS_BAD_REQUEST).json(customMessage(false, error.errors.join(', ')));
    } else if (error instanceof StatusError) {
      return res.status(error.status).json(customMessage(false, error.message));
    }
    return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
  }
}) as RequestHandler);

router.post('/', (async (req, res) => {
  try {
    const validated = await createLaundromatSchema.validate(req.body, {
      abortEarly: false,
      strict: true,
    });

    // Check whether the owner exists and is a vendor
    const uid = res.locals.uid as string;
    const user = await getDb().userRepository.findOne({ where: { id: uid } });
    if (!user) {
      return res.status(STATUS_BAD_REQUEST).json(customMessage(false, 'User does not exist'));
    }
    if (!user.isAlsoVendor) {
      return res.status(STATUS_FORBIDDEN).json(customMessage(false, 'User is not a vendor'));
    }

    const laundromat = getDb().laundromatRepository.create({
      ...validated,
      owner: user,
    });

    const result = await getDb().laundromatRepository.save(laundromat);
    return res.status(STATUS_OK).json(result);
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return res.status(STATUS_BAD_REQUEST).json(customMessage(false, error.errors.join(', ')));
    } else if (error instanceof StatusError) {
      return res.status(error.status).json(customMessage(false, error.message));
    }
    return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
  }
}) as RequestHandler);

router.put('/:id', (async (req, res) => {
  try {
    const validated = await updateLaundromatSchema.validate(req.body, {
      abortEarly: false,
      strict: true,
    });

    const laundromatExists = await getDb().laundromatRepository.findOne({
      where: { id: req.params.id },
      relations: { owner: true },
    });
    if (!laundromatExists) {
      return res.status(STATUS_NOT_FOUND).json(MESSAGE_NOT_FOUND);
    }

    // Check whether the owner of the laundromat is the same as the user and is a vendor
    const uid = res.locals.uid as string;
    if (laundromatExists.owner.id !== uid) {
      return res.status(STATUS_FORBIDDEN).json(MESSAGE_FORBIDDEN_NOT_OWNER);
    }
    if (!laundromatExists.owner.isAlsoVendor) {
      return res.status(STATUS_FORBIDDEN).json(customMessage(false, 'User is not a vendor'));
    }

    getDb().laundromatRepository.merge(laundromatExists, validated);
    const result = await getDb().laundromatRepository.save(laundromatExists);
    return res.status(STATUS_OK).json(result);
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return res.status(STATUS_BAD_REQUEST).json(customMessage(false, error.errors.join(', ')));
    } else if (error instanceof StatusError) {
      return res.status(error.status).json(customMessage(false, error.message));
    }
    return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
  }
}) as RequestHandler);

router.delete('/:id', (async (req, res) => {
  try {
    const laundromatExists = await getDb().laundromatRepository.findOne({
      where: { id: req.params.id },
      relations: { owner: true, washingMachines: true },
    });
    if (!laundromatExists) {
      return res.status(STATUS_NOT_FOUND).json(MESSAGE_NOT_FOUND);
    }

    // Check whether the owner of the laundromat is the same as the user and is a vendor
    const uid = res.locals.uid as string;
    if (laundromatExists.owner.id !== uid) {
      return res.status(STATUS_FORBIDDEN).json(MESSAGE_FORBIDDEN_NOT_OWNER);
    }
    if (!laundromatExists.owner.isAlsoVendor) {
      return res.status(STATUS_FORBIDDEN).json(customMessage(false, 'User is not a vendor'));
    }

    // Check whether the laundromat still has washing machines
    if (laundromatExists.washingMachines && laundromatExists.washingMachines.length > 0) {
      return res
        .status(STATUS_CONFLICT)
        .json(customMessage(false, 'Laundromat still has washing machines'));
    }

    await getDb().laundromatRepository.softDelete({ id: req.params.id });
    return res.status(STATUS_OK).json(MESSAGE_OK);
  } catch (error: unknown) {
    return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
  }
}) as RequestHandler);

export default router;
