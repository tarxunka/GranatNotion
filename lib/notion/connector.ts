import { Client } from '@notionhq/client';
import { CreatePageResponse } from "@notionhq/client/build/src/api-endpoints";
import env from '../../env';
import debug from 'debug';

const ll = debug('notionbot::notionConnector');

const notion = new Client({
    auth: env!.secret_B7Fc0S6wIoZiqNeHKmB6DT5PhDudJHKqOf5A1KYXZFs,
});

const taskDB = env!.09767b0861134519be6f2846922e954a;

export default {
    createTask: function (title: string, tgAuthor: string): Promise<CreatePageResponse> {
        ll('creating task', title, 'from', tgAuthor);
        return notion.pages.create({
            parent: {
                database_id: taskDB
            },
            properties: {
                Name: {
                    type: "title",
                    title: [
                        {
                            type: "text",
                            text: {
                                content: title
                            }
                        }
                    ]
                },
                TGAuthor: {
                    type: "rich_text",
                    rich_text: [
                        {
                            type: "text",
                            text: {
                                content: tgAuthor
                            }
                        }
                    ]
                },
                Status: {
                    type: "select",
                    select: {
                        name: 'Backlog'
                    }
                },
                Source: {
                    type: "select",
                    select: {
                        name: 'Telegram'
                    }
                }
            }

        });
    },
    convertTaskToUrl: function (task: CreatePageResponse): string {
        return task.id.replace(/-/g, ''); // конвертируем id в рабочий для ссылки
    }
};
