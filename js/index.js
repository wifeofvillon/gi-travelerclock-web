let specificData = {
    resin: {
        max: 160,
        ms: 8 * 60 * 1000,
        weeklyboss: 60,
        normalboss: 40,
        domain: 20
    }            
};

// cookie
let cookieKey = {
    resin: 'resin',
    date: 'date'
}

let getCookieByKey = (key) => {
    if (!document.cookie.split('; ').find(item => item.startsWith(key))) return false;
    let value = document.cookie
        .split('; ')
        .find(item => item.startsWith(key))
        .split('=')[1];
     return value;
};

let setCookieByKeyValue = (key, value) => {
    document.cookie = `${key}=${value}`;
} ;

// how long until the target amount
let getTimeToTargetAmount = (current, target) => {
    let needTime = (target - current) * specificData.resin.ms;
    if (needTime > 0) {
        return needTime;
    } else {
        return 0;
    }
};

// set current amount and time
let updateCookie = (amount) => {
    setCookieByKeyValue(cookieKey.resin, amount);
    setCookieByKeyValue(cookieKey.date, Date.now());
    let expires = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)).toUTCString();
    setCookieByKeyValue("expires", expires);
    setCookieByKeyValue("Max-Age", 7 * 24 * 60 * 60);
    console.log(document.cookie);
};

// get date for each bosses
let getDateBosses = () => {
    let targetDate = {};
    let lastAmount = getCookieByKey(cookieKey.resin);
    let lastDate = Number(getCookieByKey(cookieKey.date));

    targetDate.weeklyboss = lastDate + getTimeToTargetAmount(lastAmount, specificData.resin.weeklyboss);
    targetDate.normalboss = lastDate + getTimeToTargetAmount(lastAmount, specificData.resin.normalboss);
    targetDate.domain     = lastDate + getTimeToTargetAmount(lastAmount, specificData.resin.domain);

    return targetDate;
};

// get date as HH:mm
let getTargetDateToString = (targetDate) => {
    let date = new Date(targetDate);
    if (date.getMinutes() < 10) return `${date.getHours()}:0${date.getMinutes()}`;
    return `${date.getHours()}:${date.getMinutes()}`;
};

let getCurrentAmount = () => {
    let lastamount = Number(getCookieByKey(cookieKey.resin));
    let lastupdate = Number(getCookieByKey(cookieKey.date));
    let now = Date.now();
    return Math.floor(lastamount + (now - lastupdate) / specificData.resin.ms);
};

// render specific values
let renderSpecificValues = () => {
    document.getElementById('resin__amount--max').innerText = specificData.resin.max;
    document.getElementById('boss__weeklyboss--amount').innerText = specificData.resin.weeklyboss;
    document.getElementById('boss__normalboss--amount').innerText = specificData.resin.normalboss;
    document.getElementById('boss__domain--amount').innerText     = specificData.resin.domain;
}

// render Resin amount
let renderResinAmount = () => {
    document.getElementById('resin__percent').style.cssText = `width: ${Math.floor(getCurrentAmount()/specificData.resin.max*100)}%`;
    document.getElementById('resin__amount--current').innerText = getCurrentAmount();
}

// render max date
let renderMaxDate = () => {
    let date = new Date(Number(getCookieByKey(cookieKey.date)));
    let maxDate = new Date(date.getTime() + specificData.resin.max - Number(getCookieByKey(cookieKey.resin)) * specificData.resin.ms);
    document.getElementById('resin__date--max').innerText = maxDate.toLocaleString();
}

// render last update
let renderLastUpdate = () => {
    let date = new Date(Number(getCookieByKey(cookieKey.date)));
    document.getElementById('resin__date--update').innerText = date.toLocaleString();
}

// render Bosses' target date on the page
let renderTargetDates = () => {
    let targetDate = getDateBosses();
    document.getElementById('boss__weeklyboss--date').innerText = getTargetDateToString(targetDate.weeklyboss);
    document.getElementById('boss__normalboss--date').innerText = getTargetDateToString(targetDate.normalboss);
    document.getElementById('boss__domain--date').innerText     = getTargetDateToString(targetDate.domain);
};

// execute initially
let init = () => {
    renderSpecificValues();
    renderResinAmount();
    renderMaxDate();
    renderLastUpdate();
    renderTargetDates();
};

// execute by update button
let update = () => {
    let value = document.getElementById('modal__update--input').value;
    updateCookie(value);
    init();
};