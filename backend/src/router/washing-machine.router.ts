import { RequestHandler, Router } from 'express';
import { ValidationError } from 'yup';
import getDb from '../db';
import {
  createWashingMaschineSchema,
  updateWashingMaschineSchema,
} from '../entities/washing-machine';
import {
  MESSAGE_CONFLICT_UNRESOLVED,
  MESSAGE_FORBIDDEN_NOT_OWNER,
  MESSAGE_NOT_FOUND,
  MESSAGE_OK,
  MESSAGE_SERVER_ERROR,
  MESSAGE_VALUE_UNDEFINED,
} from './http-return-messages';
import {
  STATUS_BAD_REQUEST,
  STATUS_CONFLICT,
  STATUS_FORBIDDEN,
  STATUS_NOT_FOUND,
  STATUS_OK,
  STATUS_SERVER_ERROR,
} from './http-status-codes';

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

router.post('/', (async (req, res) => {
  try {
    const validated = await createWashingMaschineSchema.validate(req.body, {
      abortEarly: false,
      strict: true,
    });

    // Check whether laundromat exists and belongs to the user
    const uid = res.locals.uid as string | undefined;
    const laundromat = await getDb().laundromatRepository.findOne({
      where: { id: validated.laundromat, owner: { id: uid } },
    });
    if (!laundromat) {
      return res.status(STATUS_NOT_FOUND).json(MESSAGE_NOT_FOUND);
    }

    // Check whether a washing machine exists with the same name for the current laundromat
    const washingMachineExistsWithSameNameForCurrentLaundromat =
      await getDb().washingMachineRepository.findOne({
        where: { name: validated.name, laundromat: { id: laundromat.id } },
      });
    if (washingMachineExistsWithSameNameForCurrentLaundromat) {
      return res.status(STATUS_CONFLICT).json(MESSAGE_CONFLICT_UNRESOLVED);
    }

    const washingMachine = getDb().washingMachineRepository.create({
      ...validated,
      laundromat,
    });

    const result = await getDb().washingMachineRepository.save(washingMachine);
    return res.status(STATUS_OK).json(result);
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
    const validated = await updateWashingMaschineSchema.validate(req.body, {
      abortEarly: false,
      strict: true,
    });

    const washingMachineExists = await getDb().washingMachineRepository.findOne({
      where: { id: req.params.id },
      relations: ['laundromat', 'laundromat.owner'],
    });
    if (!washingMachineExists) {
      return res.status(STATUS_NOT_FOUND).json(MESSAGE_NOT_FOUND);
    }

    // Check whether the owner of the laundromat is the same as the user
    const uid = res.locals.uid as string | undefined;
    if (washingMachineExists.laundromat.owner.id !== uid) {
      return res.status(STATUS_FORBIDDEN).json(MESSAGE_FORBIDDEN_NOT_OWNER);
    }

    getDb().washingMachineRepository.merge(washingMachineExists, validated);
    const result = await getDb().washingMachineRepository.save(washingMachineExists);
    return res.status(STATUS_OK).json(result);
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return res.status(STATUS_BAD_REQUEST).json(MESSAGE_VALUE_UNDEFINED);
    } else {
      return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
    }
  }
}) as RequestHandler);

router.delete('/:id', (async (req, res) => {
  try {
    const washingMachineExists = await getDb().washingMachineRepository.findOne({
      where: { id: req.params.id },
      relations: ['laundromat', 'laundromat.owner'],
    });
    if (!washingMachineExists) {
      return res.status(STATUS_NOT_FOUND).json(MESSAGE_NOT_FOUND);
    }

    // Check whether the owner of the laundromat is the same as the user
    const uid = res.locals.uid as string | undefined;
    if (washingMachineExists.laundromat.owner.id !== uid) {
      return res.status(STATUS_FORBIDDEN).json(MESSAGE_FORBIDDEN_NOT_OWNER);
    }

    await getDb().washingMachineRepository.delete({ id: req.params.id });
    return res.status(STATUS_OK).json(MESSAGE_OK);
  } catch (error: unknown) {
    return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
  }
}) as RequestHandler);

export default router;
