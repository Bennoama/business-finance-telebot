import { gracefulShutdown } from "./framework/gracefulShutdown";
import { getData, postData } from "./framework/monitor-api-Interactions";
import * as fs from 'fs';
import * as utils from "./framework/utilities";

const helpInformation:string = (fs.readFileSync('./src/resources/helpInformation.txt', 'utf-8'));

export const setUpBot = (bot:any) => {
    gracefulShutdown(bot);

    bot.start((ctx:any) => {
        ctx.reply('שלום יעל! אנחנו בצוות בן נח, מאחלים לך המון הצלחה עם העסק המתפתח!');
    });
    bot.help((ctx:any) => {
        const format:string = helpInformation;
        ctx.reply(helpInformation);
    });

    bot.on('text', (ctx:any) => {
        const text = ctx.message.text;
        
        if (text.toLowerCase().includes('balance')) {
            handleGetBalance(text, ctx);
            return;
        }

        const strings:string[] = text.toLowerCase().split('\n');

        if (strings[0].includes('הכנסה') || strings[0].includes('הוצאה')) {
            handleExpensesAndIncomes(strings, ctx);
            return;
        }

        ctx.reply('הקלט שהוכנס אינו תקין. ניתן לכתוב help/ לקבלת עזרה');
        return;
        
    });
}

const handleGetBalance = async (balanceRequest:string, ctx:any) => {
    balanceRequest = balanceRequest.toLocaleLowerCase();
    const shouldGetAll = (balanceRequest.includes('all'));
    const shouldShowTransactions = (balanceRequest.includes('show'));
    balanceRequest = balanceRequest.replace('all', '').replace('show', '').replace(/\s\s+/g, ' ').trim();
    const balanceRequestTokens:string[] = balanceRequest.split(' ');

    const year = utils.parseYear(balanceRequestTokens[utils.BALANCE_REQUEST_TOKENS.YEAR], ctx);
    if (-1 == year) {
        return;
    }

    const month = utils.parseMonth(balanceRequestTokens[utils.BALANCE_REQUEST_TOKENS.MONTH], year, ctx);
    if (-1 == month) {
        return;
    }
    
    if (!(await getData(shouldGetAll, year, month, shouldShowTransactions, ctx))) {
        return;
    }

}

const handleExpensesAndIncomes = async (strings:string[], ctx:any): Promise<boolean> => {
    const income:boolean = strings[0].includes('הכנסה') ? true : false;

        if (undefined == strings[1]) {
            ctx.reply('אנא צייני סכום');
            return false;
        }

        const amount = parseInt(strings[1]); 
        if (isNaN(amount)) {
            ctx.reply('הסכום שסופק אינו תקין, אנא נסי שוב');
            return false;
        }

        let messageDescription = "Unspecified";
        if (undefined != strings[2]) {
            messageDescription = strings[2];
        }
        const description = messageDescription;

        const date:Date = utils.parseDate(strings[3], ctx);
        if (0 === date.getFullYear()) {
            return false;
        }

        return (await postData(income, amount, description, date, ctx));
}






