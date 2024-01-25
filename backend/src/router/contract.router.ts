import { RequestHandler, Router } from 'express';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { ValidationError } from 'yup';
import getDb from '../db';
import Contract, {
  bulkCancelContractSchema,
  createContractSchema,
  finalizeContract,
  reportContractSchema,
  updateContractSchema,
} from '../entities/contract';
import Notification from '../interfaces/notification';
import StatusError from '../utils/error-with-status';
import {
  MESSAGE_FORBIDDEN_NOT_OWNER,
  MESSAGE_NOT_FOUND,
  MESSAGE_SERVER_ERROR,
  customMessage,
} from '../utils/http-return-messages';
import {
  STATUS_BAD_REQUEST,
  STATUS_FORBIDDEN,
  STATUS_NOT_FOUND,
  STATUS_OK,
  STATUS_SERVER_ERROR,
} from '../utils/http-status-codes';
import propertiesRemover from '../utils/properties-remover';
import sendNotification from '../utils/send-notification';

const router: Router = Router();

let currentTime = new Date().getTime();

/**
 * Sorts contracts based on their status and start date.
 * Ongoing contracts are sorted based on the time difference between their start date and the current time.
 * Non-ongoing contracts are sorted based on their status.
 * @param a - The first contract to compare.
 * @param b - The second contract to compare.
 * @returns A negative value if `a` should be sorted before `b`, a positive value if `a` should be sorted after `b`,
 *          or 0 if `a` and `b` have the same sorting order.
 */
const sortBasedOnStatus = (a: Contract, b: Contract) => {
  if (a.status === 'ongoing' && b.status === 'ongoing') {
    const aTimeDifference = Math.abs(a.startDate.getTime() - currentTime);
    const bTimeDifference = Math.abs(b.startDate.getTime() - currentTime);
    return aTimeDifference - bTimeDifference;
  } else if (a.status === 'ongoing') {
    return -1;
  } else if (b.status === 'ongoing') {
    return 1;
  }

  return 0;
};

router.get('/', (async (_, res) => {
  const id = res.locals.uid as string;
  try {
    const contracts = await getDb().contractRepository.find({
      where: { user: { id } },
      relations: { washingMachine: { laundromat: true } },
      order: { startDate: 'DESC' },
      withDeleted: true,
    });
    currentTime = new Date().getTime();
    contracts.sort(sortBasedOnStatus);
    return res.status(STATUS_OK).json(contracts);
  } catch (error) {
    return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
  }
}) as RequestHandler);

router.get('/:id', (async (req, res) => {
  const id = res.locals.uid as string;
  try {
    const contract = await getDb().contractRepository.findOne({
      where: { id: req.params.id, user: { id } },
      relations: { washingMachine: true },
      withDeleted: true,
    });
    if (!contract) {
      return res.status(STATUS_NOT_FOUND).json(MESSAGE_NOT_FOUND);
    }
    return res.status(STATUS_OK).json(contract);
  } catch (error) {
    return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
  }
}) as RequestHandler);

router.post('/', (async (req, res) => {
  try {
    const validated = await createContractSchema.validate(req.body, { abortEarly: false });

    // Check whether user exists
    const uid = res.locals.uid as string;
    const user = await getDb().userRepository.findOne({
      where: { id: uid },
    });
    if (!user) {
      return res.status(STATUS_BAD_REQUEST).json(customMessage(false, 'User does not exist'));
    }

    // Check whether washing machine exists
    const washingMachine = await getDb().washingMachineRepository.findOne({
      where: { id: validated.washingMachine },
      relations: { laundromat: { owner: true } },
    });
    if (!washingMachine) {
      return res
        .status(STATUS_BAD_REQUEST)
        .json(customMessage(false, 'Washing machine does not exist'));
    }

    const contract = getDb().contractRepository.create({
      ...validated,
      price: washingMachine.laundromat.price,
      user,
      washingMachine,
    });
    await finalizeContract(contract);
    const title = 'Incoming Booking!';
    const message = `Washing machine ${washingMachine.name} in laundromat ${
      washingMachine.laundromat.name
    } has been booked from ${contract.startDate.toLocaleString()} to ${contract.endDate.toLocaleString()}`;
    const notification: Notification = {
      title,
      message,
      color: 'green',
      autoClose: false,
    };
    sendNotification(contract.washingMachine.laundromat.owner.id, notification);
    const newMessage = getDb().messageRepository.create({
      name: title,
      content: message,
      to: washingMachine.laundromat.owner,
      forVendor: true,
    });
    await getDb().messageRepository.save(newMessage);
    const contractWithReducedData = propertiesRemover<Contract>(contract, [
      'washingMachine.laundromat.owner',
    ]);
    return res.status(STATUS_OK).json(contractWithReducedData);
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return res.status(STATUS_BAD_REQUEST).json(customMessage(false, error.errors.join(', ')));
    } else if (error instanceof StatusError) {
      return res.status(error.status).json(customMessage(false, error.message));
    }
    return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
  }
}) as RequestHandler);

router.post('/bulkcancel', (async (req, res) => {
  try {
    const validated = await bulkCancelContractSchema.validate(req.body, { abortEarly: false });
    const id = res.locals.uid as string;

    const contracts = await getDb().contractRepository.find({
      where: [
        {
          washingMachine: { laundromat: { id: validated.laundromat, owner: { id } } },
          status: 'ongoing',
          endDate: MoreThanOrEqual(validated.startDate),
        },
        {
          washingMachine: { laundromat: { id: validated.laundromat, owner: { id } } },
          status: 'ongoing',
          startDate: LessThanOrEqual(validated.endDate),
        },
      ],
      relations: { user: true, washingMachine: { laundromat: { owner: true } } },
    });

    const cancelContract = async (contract: Contract) => {
      await finalizeContract(contract, true);
      const title = 'Your booking has been cancelled!';
      const message = `A booking for washing machine ${
        contract.washingMachine.name
      } in laundromat ${
        contract.washingMachine.laundromat.name
      } from ${contract.startDate.toLocaleString()} to ${contract.endDate.toLocaleString()} has been cancelled`;
      const notification: Notification = {
        title,
        message,
        color: 'blue',
        autoClose: false,
      };
      sendNotification(contract.user.id, notification);
      const newMessage = getDb().messageRepository.create({
        name: title,
        content: message,
        to: contract.user,
        forVendor: false,
      });
      await getDb().messageRepository.save(newMessage);
    };

    await Promise.all(contracts.map(cancelContract));
    return res
      .status(STATUS_OK)
      .json(customMessage(true, `${contracts.length} contracts cancelled`));
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return res.status(STATUS_BAD_REQUEST).json(customMessage(false, error.errors.join(', ')));
    } else if (error instanceof StatusError) {
      return res.status(error.status).json(customMessage(false, error.message));
    }
    return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
  }
}) as RequestHandler);

router.post('/:id/report', (async (req, res) => {
  try {
    const validated = await reportContractSchema.validate(req.body, { abortEarly: false });
    const uid = res.locals.uid as string;

    // Check whether contract exists
    const contract = await getDb().contractRepository.findOne({
      where: { id: req.params.id },
      relations: { user: true, washingMachine: { laundromat: { owner: true } } },
    });
    if (!contract) {
      return res.status(STATUS_NOT_FOUND).json(MESSAGE_NOT_FOUND);
    }

    // Check whether the user in contract is the same as the user
    if (uid !== contract.user.id) {
      return res.status(STATUS_FORBIDDEN).json(MESSAGE_FORBIDDEN_NOT_OWNER);
    }
    const title = `Contract #${contract.id} - Problem Reported!`;
    const message = `A problem has been reported for washing machine ${
      contract.washingMachine.name
    } in laundromat ${
      contract.washingMachine.laundromat.name
    } from ${contract.startDate.toLocaleString()} to ${contract.endDate.toLocaleString()}`;
    const notification: Notification = {
      title,
      message,
      color: 'red',
      autoClose: false,
    };
    sendNotification(contract.washingMachine.laundromat.owner.id, notification);
    const newMessage = getDb().messageRepository.create({
      name: title,
      content: `${message}\n\nReason: ${validated.reason}\n\nDescription: ${validated.description}`,
      to: contract.washingMachine.laundromat.owner,
      forVendor: true,
    });
    await getDb().messageRepository.save(newMessage);
    return res
      .status(STATUS_OK)
      .json(customMessage(true, `Report for contract #${contract.id} sent`));
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
    await updateContractSchema.validate(req.body, { abortEarly: false });
    const uid = res.locals.uid as string;

    // Check whether contract exists
    const contract = await getDb().contractRepository.findOne({
      where: { id: req.params.id },
      relations: { user: true, washingMachine: { laundromat: { owner: true } } },
    });
    if (!contract) {
      return res.status(STATUS_NOT_FOUND).json(MESSAGE_NOT_FOUND);
    }

    const isWmOwner = contract.washingMachine.laundromat.owner.id === uid;

    // Check whether the user in contract is the same as the user
    if (uid !== contract.user.id && !isWmOwner) {
      return res.status(STATUS_FORBIDDEN).json(MESSAGE_FORBIDDEN_NOT_OWNER);
    }

    // Check whether the contract is ongoing
    if (contract.status !== 'ongoing' && !isWmOwner) {
      return res.status(STATUS_FORBIDDEN).json(customMessage(false, 'Contract is not ongoing'));
    }

    await finalizeContract(contract, true);
    const title = isWmOwner
      ? 'Booking Canccellation!'
      : 'Someone has cancelled a booking for your washing machine!';
    const message = `A booking for washing machine ${contract.washingMachine.name} in laundromat ${
      contract.washingMachine.laundromat.name
    } from ${contract.startDate.toLocaleString()} to ${contract.endDate.toLocaleString()} has been cancelled`;
    const notification: Notification = {
      title,
      message,
      color: 'red',
      autoClose: false,
    };
    sendNotification(
      isWmOwner ? contract.user.id : contract.washingMachine.laundromat.owner.id,
      notification,
    );
    const newMessage = getDb().messageRepository.create({
      name: title,
      content: message,
      to: isWmOwner ? contract.user : contract.washingMachine.laundromat.owner,
      forVendor: !isWmOwner,
    });
    await getDb().messageRepository.save(newMessage);
    return res.status(STATUS_OK).json(contract);
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return res.status(STATUS_BAD_REQUEST).json(customMessage(false, error.errors.join(', ')));
    } else if (error instanceof StatusError) {
      return res.status(error.status).json(customMessage(false, error.message));
    }
    return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
  }
}) as RequestHandler);

router.delete('/*', (_req, res) => {
  return res.status(STATUS_FORBIDDEN).json(customMessage(false, 'Contract cannot be deleted'));
});

export default router;
