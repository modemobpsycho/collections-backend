import { NextFunction, Request, Response } from 'express';
import { MyConfig } from '../config/config';
import axios from 'axios';

export const checkAccountJira = async (req: Request, res: Response, next: NextFunction) => {
    const { AUTH_email } = req.body;
    // const jiraUrlSearchUser = 'https://vadimtaratuta.atlassian.net/rest/api/3/users/search';

    // const responseSearch = await axios.get(jiraUrlSearchUser, {
    //     auth: {
    //         username: MyConfig.JIRA_EMAIL as string,
    //         password: MyConfig.JIRA_PASSWORD as string
    //     },
    //     params: {
    //         query: AUTH_email
    //     }
    // });

    const jiraUrlCreateUser = 'https://vadimtaratuta.atlassian.net/rest/api/3/user/';
    const auth = {
        username: MyConfig.JIRA_EMAIL as string,
        password: MyConfig.JIRA_PASSWORD as string
    };

    const responseCreate = await axios.post(
        jiraUrlCreateUser,
        {
            emailAddress: AUTH_email,
            displayName: AUTH_email,
            active: true,
            products: ['jira-software']
        },
        { auth }
    );

    req.body.AUTH_JIRA_ID = responseCreate.data.accountId;

    next();
};
