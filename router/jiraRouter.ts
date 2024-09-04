import express from 'express';
import { createTicket, getAllTickets } from '../controllers/jiraController';
import { checkAuth } from '../helpers/checkAuth';

const jiraRouter = express.Router();

jiraRouter.post('/create', checkAuth, createTicket);
jiraRouter.get('/getAll/:limit', checkAuth, getAllTickets);

export default jiraRouter;
