import axios from 'axios';
import { Response, Request } from 'express';
import { MyConfig } from '../config/config';
import { prismaClient } from '../prisma/database';

export const createTicket = async (req: Request, res: Response) => {
    try {
        const { title, description, type, priority, url, AUTH_JIRA_ID } = req.body;

        if (!title || !description || !type || !priority || !url) {
            return res.status(400).send('Bad Request');
        }

        let collectionId = null;
        const collectionRegex = /collections\/(\d+)/;
        if (collectionRegex.test(url)) {
            const match = url.match(collectionRegex);
            collectionId = match[1];
        }

        const collection = await prismaClient.collection.findUnique({
            where: {
                id: Number(collectionId)
            },
            select: {
                title: true,
                user: true
            }
        });

        const jiraUrlCreateTicket = 'https://vadimtaratuta.atlassian.net/rest/api/3/issue/';
        const auth = {
            username: MyConfig.JIRA_EMAIL as string,
            password: MyConfig.JIRA_PASSWORD as string
        };

        const issueData = {
            fields: {
                project: {
                    key: 'COL'
                },
                summary: title,
                description: {
                    type: 'doc',
                    version: 1,
                    content: [
                        {
                            type: 'paragraph',
                            content: [
                                {
                                    type: 'text',
                                    text: description
                                }
                            ]
                        },
                        {
                            type: 'paragraph',
                            content: [
                                {
                                    type: 'text',
                                    text: url,
                                    marks: [
                                        {
                                            type: 'link',
                                            attrs: {
                                                href: url
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            type: 'paragraph',
                            content: [
                                {
                                    type: 'text',
                                    text: `${
                                        collection?.title ? 'Collection: ' + collection?.title : ''
                                    }`
                                }
                            ]
                        },
                        {
                            type: 'paragraph',
                            content: [
                                {
                                    type: 'text',
                                    text: `${
                                        collection
                                            ? 'Created by: ' + collection?.user?.fullName
                                            : ''
                                    }`
                                }
                            ]
                        }
                    ]
                },
                issuetype: {
                    name: type
                },
                priority: {
                    name: priority
                },
                reporter: {
                    id: AUTH_JIRA_ID
                },
                assignee: {
                    id: `${
                        type === 'Question'
                            ? MyConfig.JIRA_QA_ACCOUNT_ID
                            : MyConfig.JIRA_DEV_ACCOUNT_ID
                    }`
                }
            }
        };

        const response = await axios.post(jiraUrlCreateTicket, issueData, { auth });

        await prismaClient.jiraTickets.create({
            data: {
                userId: req.body.AUTH_userId,
                ticketId: response.data.id
            }
        });

        res.status(201).send('Ticket created successfully');
    } catch (error: Error | any) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

export const getAllTickets = async (req: Request, res: Response) => {
    try {
        const { limit } = req.params;
        const { AUTH_userId } = req.body;

        const ticketsFromDB = await prismaClient.jiraTickets.findMany({
            take: Number(limit),
            where: {
                userId: Number(AUTH_userId)
            }
        });

        const ticketIds = ticketsFromDB.map(({ ticketId }) => ticketId);

        const ticketsPromises = ticketIds.map(async (ticketId) => {
            try {
                const response = await axios.get(
                    `https://vadimtaratuta.atlassian.net/rest/api/3/issue/${ticketId}`,
                    {
                        auth: {
                            username: MyConfig.JIRA_EMAIL as string,
                            password: MyConfig.JIRA_PASSWORD as string
                        }
                    }
                );

                return response.data;
            } catch (error: Error | any) {
                return null;
            }
        });

        const ticketsData = await Promise.all(ticketsPromises);
        const successfulTickets = ticketsData.filter((ticket) => ticket !== null);

        const filteredTickets = successfulTickets.map((ticket) => ({
            id: ticket.id,
            key: ticket.key,
            url: ticket.self,
            summary: ticket.fields.summary,
            status: ticket.fields.status.name,
            description: ticket.fields.description?.content[0]?.content[0]?.text,
            issueType: ticket.fields.issuetype.name,
            issueIconUrl: ticket.fields.issuetype.iconUrl,
            priority: ticket.fields.priority.name,
            priorityIconUrl: ticket.fields.priority.iconUrl,
            assignee: ticket.fields.assignee?.displayName,
            created: ticket.fields.created,
            updated: ticket.fields.updated,
            comments: ticket.fields.comment?.comments || []
        }));

        res.status(200).json(filteredTickets);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
