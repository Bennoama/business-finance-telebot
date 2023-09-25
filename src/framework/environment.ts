import env from 'env-var';

export const monitorApiUrl = env.get('uri').required().asString();
export const botToken = env.get('botToken').required().asString();