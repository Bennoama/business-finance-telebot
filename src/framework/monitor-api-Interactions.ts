import axios from "axios";
import { Transaction } from "./types";
import {formatDate} from './utilities'
import { monitorApiUrl } from './environment'


export const postData = async (income: boolean, amount: number, description: string, date:Date, ctx:any): Promise<boolean> => {
    const data = {
        "Amount": income ? amount : -amount,
        "Description": description,
        "Date": date.toString()
    }
    const response = await axios.post(monitorApiUrl, data);
    if (200 != response.status) {
        ctx.reply("Something went wrong with posting to DB, please contact 0528084663 for technical support :)")
        return false;
    }

    delete response.data['_id'];
    response.data['Date'] = formatDate(response.data['Date']);
    const submittedData = JSON.stringify(response.data, null, 2).replace(/[{"}]/g, '').trim() + '\n'
    ctx.reply("You have submitted: \n" + submittedData);
    return true;
}

export const getData = async (shouldGetAll:boolean, year:number, month: number, shouldShowTransactions: boolean, ctx:any)
:Promise<boolean> => {
    const response = await axios.get(monitorApiUrl)
    if (200 != response.status) {
        ctx.reply("Something went wrong with fetching the data, please contact 0528084663 for technical support :)");
        return false;
    }
    const data:Transaction[] = (response.data);

    let sumExpenses:number = 0;
    let sumIncomes:number = 0;
    let reply: string = "";

    data.sort((first:Transaction, second:Transaction):number => {
        return ((new Date(first['Date']) > new Date(second['Date'])) ? 1 : -1);
    });

    data.forEach((transaction:Transaction) => {
        const transactionDate = new Date(transaction['Date']);
        const transactionYear = transactionDate.getFullYear();
        const transactionMonth = transactionDate.getMonth() + 1;

        let isBetweenDates = false;

        if (shouldGetAll) {
            isBetweenDates = (transactionYear > year || transactionMonth >= month && transactionYear == year);
        } else {
            isBetweenDates = (transactionYear == year && transactionMonth == month);
        }

        if (isBetweenDates) {
            if (0 < transaction['Amount']) {
                sumIncomes += transaction['Amount'];
            } else {
                sumExpenses += transaction['Amount'];
            }
            if (shouldShowTransactions) {
                delete transaction['_id'];
                transaction['Date'] = transaction['Date'].slice(0, 10);
                reply += '\n' + (JSON.stringify(transaction, null, 2)).replace(/[{"}]/g, '').trim() + '\n';
            }
        }
    });
    reply += "\nסיכום:\n"
    reply += "הוצאות: " + sumExpenses + '\n' + "הכנסות: " + sumIncomes + '\n' + "מאזן: " + (sumIncomes + sumExpenses);
    ctx.reply(reply);
    return true;
}
