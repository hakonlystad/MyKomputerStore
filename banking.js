const customerName = "Ole Olaisen";
let balance = 800.0; //just som starting funds
const wage = 100.0;
let loan = 0.0;
let cash = 200; //a little cash to start with
let activeLoan = false;

const work = () => {
    cash += wage;
}
const establishLoan = (amount) => {
    amount = parseFloat(amount);
    loan += amount;
    balance += amount;
    activeLoan = true;
}

const checkRepaid = () => {
    if (loan < 0.01) {loan = 0};
    if (loan === 0) { activeLoan = false };
    //if (checkLoan) {return false}
    //else {return true};
}

const payLoan = (amount) => {
    amount = parseFloat(amount);
    //if (amount > loan) { amount = loan }
    loan -= amount;
    cash -= amount;
    //if (loan < 0.01) {loan = 0}
    //if (loan === 0) { activeLoan = false }  
}
const transferBank = (amount) => {
    amount = parseFloat(amount);
    let toBank = amount;
    let toLoan = 0.0;
    if (activeLoan) {
        toLoan = amount/10;
        if (toLoan > loan) { toLoan = loan }
        toBank = Math.round((amount - toLoan)*100)/100;
        loan = Math.round((loan - toLoan)*100)/100;
        console.log(loan);
        //if (loan < 0.01) {loan = 0};
        //if (loan === 0) { activeLoan = false };
    }
    balance += toBank;
    cash -= amount;
}
const payFromBank = (amount) => {
    amount = parseFloat(amount);
    balance -= amount;
}
const transferToLoan = (amount) => {
    amount = parseFloat(amount);
    loan -= amount;
    balance -= amount;  
}

const getCustomerName = () => {
    return customerName;
}
const getBalance = () => {
    return balance;
}
const getCash = () => {
    return cash;
}
const getLoan = () => {
    return loan;
}
const getWage = () => {
    return wage;
}
const checkLoan = () => {
    return activeLoan;
}


const banking = {
    getCustomerName,
    getBalance,
    getCash,
    getLoan,
    getWage,
    checkLoan,
    checkRepaid,
    work,
    establishLoan,
    payLoan,
    transferBank,
    payFromBank,
    transferToLoan
}

export default banking;