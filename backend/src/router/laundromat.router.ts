import { RequestHandler, Router } from 'express';
import { ValidationError } from 'yup';
import getDb from '../db';
import { createLaundromatSchema, updateLaundromatSchema } from '../entities/laundromat';
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

router.get('/', (async (req, res) => {
  try {
    const uid = res.locals.uid as string;
    const onlyOwned = req.query.onlyOwned === 'true';
    const laundromats = await getDb().laundromatRepository.find({
      where: onlyOwned ? { owner: { id: uid } } : {},
    });
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
      relations: ['owner'],
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
      relations: ['owner', 'washingMachines'],
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
