import { RequestHandler, Router } from 'express';
import { ValidationError } from 'yup';
import getDb from '../db';
import { createUserSchema, updateUserSchema } from '../entities/user';
import {
  MESSAGE_CONFLICT_UNRESOLVED,
  MESSAGE_NOT_FOUND,
  MESSAGE_OK,
  MESSAGE_SERVER_ERROR,
  customMessage,
} from '../utils/http-return-messages';
import {
  STATUS_BAD_REQUEST,
  STATUS_CONFLICT,
  STATUS_CREATED,
  STATUS_FORBIDDEN,
  STATUS_NOT_FOUND,
  STATUS_OK,
  STATUS_SERVER_ERROR,
} from '../utils/http-status-codes';

const router: Router = Router();

router.get('/', (_, res) => {
  return res
    .status(STATUS_FORBIDDEN)
    .json(customMessage(false, 'You are not allowed to see lists of users!'));
});

router.get('/:idOrEmail', (async (req, res) => {
  try {
    const user = await getDb().userRepository.findOne({
      where: [{ id: req.params.idOrEmail }, { email: req.params.idOrEmail }],
    });
    if (!user) {
      return res.status(STATUS_NOT_FOUND).json(MESSAGE_NOT_FOUND);
    }
    return res.status(STATUS_OK).json(user);
  } catch (error) {
    return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
  }
}) as RequestHandler);

router.post('/', (async (req, res) => {
  try {
    const validated = await createUserSchema.validate(req.body, {
      abortEarly: false,
      strict: true,
    });
    const uid = res.locals.uid as string;
    const email = res.locals.email as string | undefined;

    const user = getDb().userRepository.create({
      ...validated,
      id: uid,
      email,
    });

    const userExists = await getDb().userRepository.findOne({
      where: [{ id: uid }, { email }],
    });
    if (userExists) {
      return res.status(STATUS_CONFLICT).json(MESSAGE_CONFLICT_UNRESOLVED);
    }

    const result = await getDb().userRepository.save(user);
    return res.status(STATUS_CREATED).json(result);
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return res.status(STATUS_BAD_REQUEST).json(customMessage(false, error.errors.join(', ')));
    } else {
      return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
    }
  }
}) as RequestHandler);

router.put('/', (async (req, res) => {
  try {
    const validated = await updateUserSchema.validate(req.body, {
      abortEarly: false,
      strict: true,
    });
    const uid = res.locals.uid as string;

    const userExists = await getDb().userRepository.findOne({
      where: { id: uid },
    });
    if (!userExists) {
      return res.status(STATUS_NOT_FOUND).json(MESSAGE_NOT_FOUND);
    }

    // Check whether the user was a vendor, and trying to disable it
    if (userExists.isAlsoVendor && !validated.isAlsoVendor) {
      const laundromatExists = await getDb().laundromatRepository.findOne({
        where: {
          owner: {
            id: uid,
          },
        },
      });
      if (laundromatExists) {
        return res
          .status(STATUS_BAD_REQUEST)
          .json(customMessage(false, 'Cannot disable vendor status while owning a laundromat'));
      }
    }

    getDb().userRepository.merge(userExists, validated);
    const result = await getDb().userRepository.save(userExists);
    return res.status(STATUS_OK).json(result);
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return res.status(STATUS_BAD_REQUEST).json(customMessage(false, error.errors.join(', ')));
    } else {
      return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
    }
  }
}) as RequestHandler);

router.delete('/', (async (_req, res) => {
  try {
    const uid = res.locals.uid as string;
    const userExists = await getDb().userRepository.findOne({ where: { id: uid } });
    if (!userExists) {
      return res.status(STATUS_NOT_FOUND).json(MESSAGE_NOT_FOUND);
    }
    await getDb().userRepository.delete({ id: uid });
    return res.status(STATUS_OK).json(MESSAGE_OK);
  } catch (error: unknown) {
    return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
  }
}) as RequestHandler);

export default router;
