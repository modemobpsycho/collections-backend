import express from 'express';
import { createTicket, getAllTickets } from '../controllers/jiraController';
import { checkAuth } from '../helpers/checkAuth';
import { checkAccountJira } from '../helpers/checkAccountJira';

const jiraRouter = express.Router();

jiraRouter.post('/create', checkAuth, checkAccountJira, createTicket);
jiraRouter.get('/getAll/:limit', checkAuth, getAllTickets);

export default jiraRouter;
