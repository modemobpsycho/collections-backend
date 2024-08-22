import app from './server';
import serverless from 'serverless-http';

export const handler = serverless(app);
