import { RequestHandler, Router } from 'express';
import { ValidationError } from 'yup';
import getDb from '../db';
import {
  createWashingMaschineSchema,
  updateWashingMaschineSchema,
} from '../entities/washing-machine';
import StatusError from '../utils/error-with-status';
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

const router: Router = Router();

router.get('/', (async (_, res) => {
  try {
    const washingMachines = await getDb().washingMachineRepository.find();
    return res.status(STATUS_OK).json(washingMachines);
  } catch (error) {
    return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
  }
}) as RequestHandler);

router.get('/:id', (async (req, res) => {
  try {
    const washingMachine = await getDb().washingMachineRepository.findOne({
      where: { id: req.params.id },
    });
    if (!washingMachine) {
      return res.status(STATUS_NOT_FOUND).json(MESSAGE_NOT_FOUND);
    }
    return res.status(STATUS_OK).json(washingMachine);
  } catch (error) {
    return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
  }
}) as RequestHandler);

router.get('/:id/occupied-slots', (async (req, res) => {
  try {
    const contracts = await getDb().contractRepository.find({
      where: {
        status: 'ongoing',
        washingMachine: { id: req.params.id },
      },
    });
    console.log(contracts);
    const occupiedTimeSlots = contracts.map((contract) => {
      return {
        start: new Date(contract.startDate.getTime()),
        end: new Date(contract.endDate.getTime()),
      };
    });
    return res.status(STATUS_OK).json(occupiedTimeSlots);
  } catch (error) {
    return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
  }
}) as RequestHandler);

router.post('/', (async (req, res) => {
  try {
    const validated = await createWashingMaschineSchema.validate(req.body, {
      abortEarly: false,
      strict: true,
    });

    // Check whether laundromat exists and belongs to the user
    const uid = res.locals.uid as string;
    const laundromat = await getDb().laundromatRepository.findOne({
      where: { id: validated.laundromat, owner: { id: uid } },
    });
    if (!laundromat) {
      return res
        .status(STATUS_BAD_REQUEST)
        .json(customMessage(false, 'Laundromat does not exist or does not belong to user'));
    }

    const washingMachine = getDb().washingMachineRepository.create({
      ...validated,
      laundromat,
    });

    const result = await getDb().washingMachineRepository.save(washingMachine);
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
    const validated = await updateWashingMaschineSchema.validate(req.body, {
      abortEarly: false,
      strict: true,
    });

    const washingMachineExists = await getDb().washingMachineRepository.findOne({
      where: { id: req.params.id },
      relations: { laundromat: { owner: true } },
    });
    if (!washingMachineExists) {
      return res.status(STATUS_NOT_FOUND).json(MESSAGE_NOT_FOUND);
    }

    // Check whether the owner of the laundromat is the same as the user
    const uid = res.locals.uid as string;
    if (washingMachineExists.laundromat.owner.id !== uid) {
      return res.status(STATUS_FORBIDDEN).json(MESSAGE_FORBIDDEN_NOT_OWNER);
    }

    getDb().washingMachineRepository.merge(washingMachineExists, validated);
    const result = await getDb().washingMachineRepository.save(washingMachineExists);
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
    const washingMachineExists = await getDb().washingMachineRepository.findOne({
      where: { id: req.params.id },
      relations: { laundromat: { owner: true } },
    });
    if (!washingMachineExists) {
      return res.status(STATUS_NOT_FOUND).json(MESSAGE_NOT_FOUND);
    }

    // Check whether the owner of the laundromat is the same as the user
    const uid = res.locals.uid as string;
    if (washingMachineExists.laundromat.owner.id !== uid) {
      return res.status(STATUS_FORBIDDEN).json(MESSAGE_FORBIDDEN_NOT_OWNER);
    }

    // Check whether the washing machine has any reservations
    const reservations = await getDb().contractRepository.find({
      where: {
        washingMachine: {
          id: req.params.id,
        },
        status: 'ongoing',
      },
    });
    if (reservations.length > 0) {
      return res
        .status(STATUS_CONFLICT)
        .json(
          customMessage(false, `Washing machine has ${reservations.length} ongoing reservations`),
        );
    }

    await getDb().washingMachineRepository.softDelete({ id: req.params.id });
    return res.status(STATUS_OK).json(MESSAGE_OK);
  } catch (error: unknown) {
    return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
  }
}) as RequestHandler);

export default router;
