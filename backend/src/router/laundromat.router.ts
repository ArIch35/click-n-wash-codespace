import { RequestHandler, Router } from 'express';
import { ValidationError } from 'yup';
import getDb from '../db';
import { createLaundromatSchema } from '../entities/laundromat';
import {
  MESSAGE_FORBIDDEN_NOT_OWNER,
  MESSAGE_NOT_FOUND,
  MESSAGE_OK,
  MESSAGE_SERVER_ERROR,
  MESSAGE_VALUE_UNDEFINED,
} from './http-return-messages';
import {
  STATUS_BAD_REQUEST,
  STATUS_FORBIDDEN,
  STATUS_NOT_FOUND,
  STATUS_OK,
  STATUS_SERVER_ERROR,
} from './http-status-codes';

const router: Router = Router();

router.get('/', (async (_, res) => {
  try {
    const laundromats = await getDb().laundromatRepository.find();
    return res.status(STATUS_OK).json(laundromats);
  } catch (error) {
    return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
  }
}) as RequestHandler);

router.get('/:id', (async (req, res) => {
  try {
    const laundromat = await getDb().laundromatRepository.findOne({ where: { id: req.params.id } });
    if (!laundromat) {
      return res.status(STATUS_NOT_FOUND).json(MESSAGE_NOT_FOUND);
    }
    return res.status(STATUS_OK).json(laundromat);
  } catch (error) {
    return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
  }
}) as RequestHandler);

router.post('/', (async (req, res) => {
  try {
    const validated = await createLaundromatSchema.validate(req.body, { abortEarly: false });

    // Check whether the owner exists
    const uid = res.locals.uid as string | undefined;
    const user = await getDb().userRepository.findOne({ where: { id: uid } });
    if (!user) {
      return res.status(STATUS_NOT_FOUND).json(MESSAGE_NOT_FOUND);
    }

    const laundromat = getDb().laundromatRepository.create({
      ...validated,
      owner: user,
    });

    const result = await getDb().laundromatRepository.save(laundromat);
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
    const validated = await createLaundromatSchema.validate(req.body, { abortEarly: false });

    const laundromatExists = await getDb().laundromatRepository.findOne({
      where: { id: req.params.id },
    });
    if (!laundromatExists) {
      return res.status(STATUS_NOT_FOUND).json(MESSAGE_NOT_FOUND);
    }

    // Check whether the owner of the laundromat is the same as the user
    const uid = res.locals.uid as string | undefined;
    if (laundromatExists.owner.id !== uid) {
      return res.status(STATUS_FORBIDDEN).json(MESSAGE_FORBIDDEN_NOT_OWNER);
    }

    getDb().laundromatRepository.merge(laundromatExists, validated);
    const result = await getDb().laundromatRepository.save(laundromatExists);
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
    const laundromatExists = await getDb().laundromatRepository.findOne({
      where: { id: req.params.id },
    });
    if (!laundromatExists) {
      return res.status(STATUS_NOT_FOUND).json(MESSAGE_NOT_FOUND);
    }

    // Check whether the owner of the laundromat is the same as the user
    const uid = res.locals.uid as string | undefined;
    if (laundromatExists.owner.id !== uid) {
      return res.status(STATUS_FORBIDDEN).json(MESSAGE_FORBIDDEN_NOT_OWNER);
    }

    await getDb().laundromatRepository.delete({ id: req.params.id });
    return res.status(STATUS_OK).json(MESSAGE_OK);
  } catch (error: unknown) {
    return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
  }
}) as RequestHandler);

export default router;
