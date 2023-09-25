import { Context, Markup, Telegraf } from 'telegraf';
import { Update } from 'typegram';
import { setUpBot } from './setup';
import { botToken } from './framework/environment';


const bot = new Telegraf(botToken);

setUpBot(bot);
bot.launch();