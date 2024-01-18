import { RequestHandler, Router } from 'express';
import { ValidationError } from 'yup';
import getDb from '../db';
import { createTopupSchema, finalizeBalanceTransaction } from '../entities/balance-transaction';
import { createUserSchema, markAsReadSchema, updateUserSchema } from '../entities/user';
import StatusError from '../utils/error-with-status';
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
      relations: {
        inbox: true,
      },
      order: {
        inbox: {
          createdAt: 'DESC',
        },
      },
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
      withDeleted: true,
    });
    if (userExists) {
      if (userExists.deletedAt) {
        return res
          .status(STATUS_CONFLICT)
          .json(
            customMessage(
              false,
              'User already deleted, please restore it first by requesting POST /users/restore',
            ),
          );
      }
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

router.post('/restore', (async (_req, res) => {
  try {
    const uid = res.locals.uid as string;
    const userExists = await getDb().userRepository.findOne({
      where: { id: uid },
      relations: { inbox: true },
      withDeleted: true,
    });
    if (!userExists) {
      return res.status(STATUS_NOT_FOUND).json(MESSAGE_NOT_FOUND);
    }
    if (!userExists.deletedAt) {
      return res.status(STATUS_CONFLICT).json(customMessage(false, 'User is not deleted'));
    }
    await getDb().userRepository.restore({ id: uid });
    userExists.deletedAt = undefined;
    return res.status(STATUS_OK).json(userExists);
  } catch (error: unknown) {
    return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
  }
}) as RequestHandler);

router.post('/topup', (async (req, res) => {
  try {
    const validated = await createTopupSchema.validate(req.body, { abortEarly: false });

    // Check whether user exists
    const uid = res.locals.uid as string;
    const user = await getDb().userRepository.findOne({
      where: { id: uid },
      relations: { inbox: true },
    });
    if (!user) {
      return res.status(STATUS_BAD_REQUEST).json(customMessage(false, 'User does not exist'));
    }

    const balanceTransaction = getDb().balanceTransactionRepository.create({
      ...validated,
      type: 'topup',
      to: user,
    });
    await finalizeBalanceTransaction(balanceTransaction);
    return res.status(STATUS_OK).json(balanceTransaction);
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return res.status(STATUS_BAD_REQUEST).json(customMessage(false, error.errors.join(', ')));
    } else if (error instanceof StatusError) {
      return res.status(error.status).json(customMessage(false, error.message));
    }
    return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
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
      relations: { inbox: true },
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

router.put('/read', (async (req, res) => {
  try {
    const validated = await markAsReadSchema.validate(req.body, {
      abortEarly: false,
      strict: true,
    });
    const uid = res.locals.uid as string;

    const user = await getDb().userRepository.findOne({
      where: { id: uid },
      relations: { inbox: true },
    });

    if (!user) {
      return res.status(STATUS_NOT_FOUND).json(MESSAGE_NOT_FOUND);
    }

    if (!user.inbox) {
      return res.status(STATUS_OK).json(user);
    }

    user.inbox = user.inbox?.map((message) => {
      if (validated.messageIds.includes(message.id)) {
        message.read = true;
      }
      return message;
    });

    await getDb().messageRepository.save(user.inbox);
    return res.status(STATUS_OK).json(user);
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return res.status(STATUS_BAD_REQUEST).json(customMessage(false, error.errors.join(', ')));
    } else if (error instanceof StatusError) {
      return res.status(error.status).json(customMessage(false, error.message));
    }
    return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
  }
}) as RequestHandler);

router.delete('/', (async (_req, res) => {
  try {
    const uid = res.locals.uid as string;
    const userExists = await getDb().userRepository.findOne({ where: { id: uid } });
    if (!userExists) {
      return res.status(STATUS_NOT_FOUND).json(MESSAGE_NOT_FOUND);
    }

    // Check whether the user is a vendor, and owns a laundromat
    if (userExists.isAlsoVendor) {
      const laundromatExists = await getDb().laundromatRepository.findOne({
        where: {
          owner: {
            id: uid,
          },
        },
      });
      if (laundromatExists) {
        return res
          .status(STATUS_CONFLICT)
          .json(customMessage(false, 'Cannot delete user while owning a laundromat'));
      }
    }

    await getDb().userRepository.softDelete({ id: uid });
    return res.status(STATUS_OK).json(MESSAGE_OK);
  } catch (error: unknown) {
    return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
  }
}) as RequestHandler);

export default router;
