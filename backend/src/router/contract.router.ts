import { RequestHandler, Router } from 'express';
import { ValidationError } from 'yup';
import getDb from '../db';
import { createContractSchema, finalizeContract, updateContractSchema } from '../entities/contract';
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
import sendNotification from '../utils/send-notification';

const router: Router = Router();

router.get('/', (async (_, res) => {
  const id = res.locals.uid as string;
  try {
    const contracts = await getDb().contractRepository.find({
      where: { user: { id } },
      relations: { washingMachine: { laundromat: true } },
      withDeleted: true,
    });
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
    const notification: Notification = {
      title: 'Someone has booked your washing machine!',
      message: `Washing machine ${washingMachine.name} in laundromat ${
        washingMachine.laundromat.name
      } has been booked from ${contract.startDate.toLocaleString()} to ${contract.endDate.toLocaleString()}`,
      color: 'green',
      autoClose: false,
    };
    sendNotification(contract.washingMachine.laundromat.owner.id, notification);
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

    // Check whether the user in contract is the same as the user
    if (uid !== contract.user.id) {
      return res.status(STATUS_FORBIDDEN).json(MESSAGE_FORBIDDEN_NOT_OWNER);
    }

    // Check whether the contract is ongoing
    if (contract.status !== 'ongoing') {
      return res.status(STATUS_FORBIDDEN).json(customMessage(false, 'Contract is not ongoing'));
    }

    await finalizeContract(contract, true);
    const notification: Notification = {
      title: 'Someone has cancelled a booking for your washing machine!',
      message: `A booking for washing machine ${contract.washingMachine.name} in laundromat ${
        contract.washingMachine.laundromat.name
      } from ${contract.startDate.toLocaleString()} to ${contract.endDate.toLocaleString()} has been cancelled`,
      color: 'blue',
      autoClose: false,
    };
    sendNotification(contract.washingMachine.laundromat.owner.id, notification);
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
