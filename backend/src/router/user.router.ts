import { Router } from "express";
import getDb from "../db";
import { MESSAGE_CONFLICT_UNRESOLVED, MESSAGE_NOT_FOUND, MESSAGE_OK, MESSAGE_SERVER_ERROR, MESSAGE_VALUE_UNDEFINED } from "./http-return-messages";
import { STATUS_BAD_REQUEST, STATUS_CONFLICT, STATUS_NOT_FOUND, STATUS_OK, STATUS_SERVER_ERROR } from "./http-status-codes";
import { ValidationError } from "yup";
import { createUserSchema, updateUserSchema } from "../entities/user";

const router: Router = Router();

router.get("/", async (_, res) => {
    try {
        const users = await getDb().userRepository.find();
        return res.status(STATUS_OK).json(users);
    } catch (error) {
        return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
    }
});

router.get("/:email", async (req, res) => {
    try {
        const user = await getDb().userRepository.findOne({ where: { email: req.params.email }});
        if (!user) {
            return res.status(STATUS_NOT_FOUND).json(MESSAGE_NOT_FOUND);
        }
        return res.status(STATUS_OK).json(user);
    } catch (error) {
        return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
    }
});

router.post('/', async (req, res) => {
    try {
        await createUserSchema.validate(req.body, { abortEarly: false });

        const user = getDb().userRepository.create(req.body);

        const userExists = await getDb().userRepository.findOne({ where: { email: req.body.email }} );
        if (userExists) {
            return res.status(STATUS_CONFLICT).json(MESSAGE_CONFLICT_UNRESOLVED);
        }

        const result = await getDb().userRepository.save(user);
        return res.status(STATUS_OK).json(result);
    }
    catch (error: any) {
        if (error instanceof ValidationError) {
            return res.status(STATUS_BAD_REQUEST).json(MESSAGE_VALUE_UNDEFINED);
        } else {
            return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
        }
    }
});

router.put('/:email', async (req, res) => {
    try {
        await updateUserSchema.validate(req.body, { abortEarly: false });

        const userExists = await getDb().userRepository.findOne({ where: { email: req.params.email }} );
        if (!userExists) {
            return res.status(STATUS_NOT_FOUND).json(MESSAGE_NOT_FOUND);
        }
        getDb().userRepository.merge(userExists, req.body);
        const result = await getDb().userRepository.save(userExists);
        return res.status(STATUS_OK).json(result);
    }
    catch (error: any) {
        if (error instanceof ValidationError) {
            return res.status(STATUS_BAD_REQUEST).json(MESSAGE_VALUE_UNDEFINED);
        } else {
            return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
        }
    }
});

router.delete('/:email', async (req, res) => {
    try {
        const userExists = await getDb().userRepository.findOne({ where: { email: req.params.email }} );
        if (!userExists) {
            return res.status(STATUS_NOT_FOUND).json(MESSAGE_NOT_FOUND);
        }
        await getDb().userRepository.delete({ email: req.params.email });
        return res.status(STATUS_OK).json(MESSAGE_OK);
    }
    catch (error: any) {
        return res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
    }
});

export default router;