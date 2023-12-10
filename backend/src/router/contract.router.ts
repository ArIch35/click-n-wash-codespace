import { RequestHandler, Router } from 'express';
import { ValidationError } from 'yup';
import getDb from '../db';
import { createContractSchema, updateContractSchema } from '../entities/contract';
import {
  MESSAGE_FORBIDDEN_NOT_OWNER,
  MESSAGE_NOT_FOUND,
  MESSAGE_SERVER_ERROR,
  MESSAGE_VALUE_UNDEFINED,
  customMessage,
} from '../utils/http-return-messages';
import {
  STATUS_BAD_REQUEST,
  STATUS_FORBIDDEN,
  STATUS_NOT_FOUND,
  STATUS_OK,
  STATUS_SERVER_ERROR,
} from '../utils/http-status-codes';

const router: Router = Router();

router.get('/', (async (_, res) => {
  try {
    const contracts = await getDb().contractRepository.find();
    return res.status(STATUS_OK).json(contracts);
  } catch (error) {
    return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
  }
}) as RequestHandler);

router.get('/:id', (async (req, res) => {
  try {
    const contract = await getDb().contractRepository.findOne({
      where: { id: req.params.id },
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
    const uid = res.locals.uid as string | undefined;
    const user = await getDb().userRepository.findOne({
      where: { id: uid },
    });
    if (!user) {
      return res.status(STATUS_NOT_FOUND).json(MESSAGE_NOT_FOUND);
    }

    // Check whether washing machine exists
    const washingMachine = await getDb().washingMachineRepository.findOne({
      where: { id: validated.washingMachine },
      relations: ['laundromat', 'laundromat.owner'],
    });
    if (!washingMachine) {
      return res.status(STATUS_NOT_FOUND).json(MESSAGE_NOT_FOUND);
    }

    // Check whether user credit is sufficient
    if (user.credit < washingMachine.laundromat.price) {
      return res.status(STATUS_FORBIDDEN).json(customMessage(false, 'Insufficient credit'));
    }

    const contract = getDb().contractRepository.create({
      ...validated,
      price: washingMachine.laundromat.price,
      user,
      washingMachine,
    });

    await getDb().entityManager.transaction(async (transactionalEntityManager) => {
      // Update user credit if the user is not the owner of the laundromat
      if (user.id !== washingMachine.laundromat.owner.id) {
        user.credit -= contract.price;
        washingMachine.laundromat.owner.credit += contract.price;
      }
      await transactionalEntityManager.save(user);
      await transactionalEntityManager.save(washingMachine.laundromat.owner);
      await transactionalEntityManager.save(contract);
    });

    return res.status(STATUS_OK).json(contract);
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return res.status(STATUS_BAD_REQUEST).json(MESSAGE_VALUE_UNDEFINED);
    } else {
      return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
    }
  }
}) as RequestHandler);

router.put('/:id', (async (req, res) => {
  try {
    await updateContractSchema.validate(req.body, { abortEarly: false });

    // Check whether contract exists
    const contract = await getDb().contractRepository.findOne({
      where: { id: req.params.id },
      relations: [
        'user',
        'washingMachine',
        'washingMachine.laundromat',
        'washingMachine.laundromat.owner',
      ],
    });
    if (!contract) {
      return res.status(STATUS_NOT_FOUND).json(MESSAGE_NOT_FOUND);
    }

    // Check whether user exists
    const uid = res.locals.uid as string | undefined;
    const user = await getDb().userRepository.findOne({
      where: { id: uid },
    });
    if (!user) {
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

    await getDb().entityManager.transaction(async (transactionalEntityManager) => {
      // Update user credit if the user is not the owner of the laundromat
      if (uid !== contract.washingMachine.laundromat.owner.id) {
        user.credit -= contract.price;
        contract.washingMachine.laundromat.owner.credit += contract.price;
      }
      contract.status = 'cancelled';
      await transactionalEntityManager.save(user);
      await transactionalEntityManager.save(contract.washingMachine.laundromat.owner);
      await transactionalEntityManager.save(contract);
    });

    return res.status(STATUS_OK).json(contract);
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return res.status(STATUS_BAD_REQUEST).json(MESSAGE_VALUE_UNDEFINED);
    } else {
      return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
    }
  }
}) as RequestHandler);

router.delete('/*', (_req, res) => {
  return res.status(STATUS_FORBIDDEN).json(customMessage(false, 'Contract cannot be deleted'));
});

export default router;
