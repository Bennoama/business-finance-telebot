export const getMonth = ():number => {
    return ((new Date()).getMonth() + 1);
}

export const getYear = ():number => {
    return ((new Date()).getFullYear());
}

export const getDayOfMonth = ():number => {
    return ((new Date()).getDate());
}

enum TOKEN_INDEXES {
    DAY, BALANCE = 0,
    MONTH = 1,
    YEAR = 2,
};

export const parseYear = (balanceRequest:string, ctx:any):number => {
    let year:number = getYear();
    const balanceRequestTokens:string[] = balanceRequest.split(' ');
    const yearToken = balanceRequestTokens[TOKEN_INDEXES.YEAR]

    if (undefined != yearToken) { // month is included in command
        let yearInRequest:number = parseInt(yearToken);
        if (yearInRequest < 100) {
            if (yearInRequest < 10) {
                ctx.reply('Year is invalid');
                return -1;
            }
            yearInRequest += 2000;
        }
        
        if (isNaN(yearInRequest) || yearInRequest < 0) {
            ctx.reply('Year is invalid' + yearInRequest);
            return -1;
        }

        if (yearInRequest > getYear()) {
            ctx.reply("Date has not arrived yet");
            return -1;
        }

        year = yearInRequest;
    }
    return year;
}

export const parseMonth = (balanceRequest:string, year:number, shouldGetAll:boolean, ctx:any):number => {
    let month = getMonth();
    const balanceRequestTokens:string[] = balanceRequest.split(' ');
    const monthToken = balanceRequestTokens[TOKEN_INDEXES.MONTH]

    if (undefined != monthToken) { // month is included in command
        const monthInRequest = parseInt(monthToken);
        if (isNaN(monthInRequest) || monthInRequest > 12 || monthInRequest < 1) {
            ctx.reply('Month is invalid');
            return -1;
        }
        if ((monthInRequest > getMonth() && year == getYear())) {
            ctx.reply("Date has not arrived yet");
            return -1;
        }
        month = monthInRequest;
    }
    else if (shouldGetAll) {
        month = 0;
    }
    return month;
}

export const parseDate = (str:string, ctx:any): Date => {
    if (undefined == str) {
        return new Date();
    }
    const givenDate = str.replace(/[\-_/]/g, '.');
    const tokens:string[] = givenDate.split('.');
    
    let year = 0;
    if (3 != tokens.length) {
        if (tokens.length != 2) {
            ctx.reply("Invalid date");
            return new Date(0,0,0);
        } else {
            year = getYear();
        }
    } else {
        year = parseInt(tokens[TOKEN_INDEXES.YEAR]);
    }

    if (isNaN(year)) {
        ctx.reply("Invalid year");
        return new Date(0,0,0);
    }

    if (year < 10) {
        ctx.reply("Invalid year");
        return new Date(0,0,0);
    }

    if (year < 100) {
        year += 2000;
    }

    if (year > getYear()) {
        ctx.reply("Date greater than today");
        return new Date(0,0,0);
    }

    const month = parseInt(tokens[TOKEN_INDEXES.MONTH]);
    if (isNaN(month)) {
        ctx.reply("Invalid month");
        return new Date(0,0,0);
    }
    if (month > getMonth() && year == getYear()) {
        ctx.reply("Date greater than today");
    }

    if (month < 1 || month > 12) {
        ctx.reply("Invalid month");
        return new Date(0,0,0);
    }

    const monthsLengths = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
    const day = parseInt(tokens[TOKEN_INDEXES.DAY]);
    if (isNaN(day)) {
        ctx.reply("Invalid day");
        return new Date(0,0,0);
    }
    if (day > getDayOfMonth() && month == getMonth() && year == getYear()) {
        ctx.reply("Date greater than today");
        return new Date(0,0,0);
    }

    if (day < 1 || day > monthsLengths[month - 1]) {
        ctx.reply("Invalid day of month");
        return new Date(0,0,0);
    }
    const now = new Date();
    return new Date(year, month - 1, day, now.getHours(), now.getMinutes(), now.getSeconds()); 
} 
export const formatDate = (dateStr:string):string => {
    const today = new Date(dateStr);
    const year = today.getFullYear();
    let month = (today.getMonth() + 1).toString(); // Months start at 0!
    let day = today.getDate().toString();

    if (parseInt(day) < 10) {
        day = '0' + day;
    }
    if (parseInt(month) < 10) {
        month = '0' + month;
    }
    return (day + '/' + month + '/' + year);
}
