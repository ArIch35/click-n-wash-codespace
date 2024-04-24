import { RequestHandler, Router } from 'express';
import getDb from '../db';
import {
  MESSAGE_NOT_FOUND,
  MESSAGE_SERVER_ERROR,
  customMessage,
} from '../utils/http-return-messages';
import {
  STATUS_FORBIDDEN,
  STATUS_NOT_FOUND,
  STATUS_OK,
  STATUS_SERVER_ERROR,
} from '../utils/http-status-codes';

const router: Router = Router();

router.get('/', (async (_, res) => {
  const id = res.locals.uid as string;
  try {
    const balanceTransactions = await getDb().balanceTransactionRepository.find({
      where: { user: { id } },
      withDeleted: true,
    });
    return res.status(STATUS_OK).json(balanceTransactions);
  } catch (error) {
    return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
  }
}) as RequestHandler);

router.get('/:id', (async (req, res) => {
  const id = res.locals.uid as string;
  try {
    const balanceTransaction = await getDb().balanceTransactionRepository.findOne({
      where: { id: req.params.id, user: { id } },
      withDeleted: true,
    });
    if (!balanceTransaction) {
      return res.status(STATUS_NOT_FOUND).json(MESSAGE_NOT_FOUND);
    }
    return res.status(STATUS_OK).json(balanceTransaction);
  } catch (error) {
    return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
  }
}) as RequestHandler);

router.post('/', (_req, res) => {
  return res
    .status(STATUS_FORBIDDEN)
    .json(customMessage(false, 'Balance transaction cannot be created'));
});

router.put('/:id', (_req, res) => {
  return res
    .status(STATUS_FORBIDDEN)
    .json(customMessage(false, 'Balance transaction cannot be updated'));
});

router.delete('/*', (_req, res) => {
  return res
    .status(STATUS_FORBIDDEN)
    .json(customMessage(false, 'Balance transaction cannot be deleted'));
});

export default router;
