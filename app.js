import banking from "./banking.js";
import { getKomputers } from "./products.js";

// ––– DOM REFERENCES AND GLOBAL VARIABLES –––

// for bank and loan
const customerName = document.getElementById("customerName");
const balance = document.getElementById("balance");
const loan = document.getElementById("loan");
const loanBtn = document.getElementById("getLoan");
const loanAmount = document.getElementById("loanRequest");
const loanCancelBtn = document.getElementById("cancelLoanRequest");
const loanReqBtn = document.getElementById("submitLoanRequest");
const loanResponse = document.getElementById("requestResponse");

// for work and transfer
const workBtn = document.getElementById("workBtn");
const cash = document.getElementById("cash");
const bankBtn = document.getElementById("BankBtn");
const cancelTransfer = document.getElementById("cancelTransfer");
const confirmTransfer = document.getElementById("confirmTransfer");
const transferAmount = document.getElementById("bankTransfer");
const workMessage = document.getElementById("workMessage");

// for payback with cash
const payBackBtn = document.getElementById("payBackBtn");
const payBack = document.getElementById("payBack");
const cancelPayBack = document.getElementById("cancelPayBack");
const confirmPayBack = document.getElementById("confirmPayBack");

// for payback from bank
const bankPayBtn = document.getElementById("bankPayBtn");
const bankPayAmount = document.getElementById("bankPayAmount");
const cancelBankPay = document.getElementById("cancelBankPay");
const confirmBankPay = document.getElementById("confirmBankPay");
const bankMessage = document.getElementById("bankMessage");

// Komputer globals
let komputers;
let idNumber = 1;

// Komputer DOM ref.
const komputersList = document.getElementById("komputersList");
const komputerSpecs = document.getElementById("showSpecs");
const komputerName = document.getElementById("komputerName");
const komputerDescription = document.getElementById("komputerDescription");
const komputerImage = document.getElementById("komputerImage");
const komputerPrice = document.getElementById("komputerPrice");

// for buying
let myKomputers = [];
const buyBtn = document.getElementById("buyBtn");
const buyMessage = document.getElementById("buyMessage");
const collection = document.getElementById("collection");

// Visibility...
const loanInfo = document.getElementById("loanInfo");
const loanUI = document.getElementById("loanUI");
const bankPaykUI = document.getElementById("bankPaykUI");
const bankUI = document.getElementById("bankUI");
const payBackUI = document.getElementById("payBackUI");



// ––– SHOW STATUS FUNCTIONS –––

const showBalance = () => {
    balance.innerText = `${banking.getBalance()} NOK`;
}
const showCash = () => {
    cash.innerText = `${banking.getCash()} NOK`;
}
const showLoan = () => {
    loan.innerText = `${banking.getLoan()} NOK`;
}

// ––– VISIBILITY FUNCTIONS –––

const hideElement = (element) => {
    element.style.display = "none";
}
const showFlexElement = (element) => {
    element.style.display = "flex";
}
const showBlockElement = (element) => {
    element.style.display = "block";
}
const toggleBlockElement = (element) => {
    console.log(element.style.display);
    (element.style.display == "none" ? element.style.display = "block" : element.style.display = "none");
}


// ––– LOAN FUNCTIONS –––

const requestLoan = () => {
    if (banking.checkLoan()) {
        alert("You must repay your current loan before you can get a new one.");
        return;
    }
    console.log(banking.checkLoan())
    const amount = loanAmount.value;
    const balance = banking.getBalance();
    
    if (amount > balance * 2) {
        bankMessage.innerText = "You cannot get a loan of more than twice your bank balance";
        return;
    }
    banking.establishLoan(amount);
    showBalance();
    showLoan();
    showFlexElement(loanInfo);
    showBlockElement(bankPayBtn);
    showBlockElement(payBackBtn);
    hideElement(loanBtn);
    hideElement(loanUI);
}

const updateMaxLoan = () => {
    const amount = banking.getBalance()*2;
    loanAmount.setAttribute("max", amount);
}

const updateLoanUI = () => {
    if (!banking.checkLoan()) {
        hideElement(bankPayBtn);
        hideElement(payBackBtn);
        hideElement(loanInfo);
        hideElement(bankPaykUI);
        hideElement(payBackUI)
        showBlockElement(loanBtn);
    }
}

// cancel buttons

const bankPayCanceled = () => {
    loanAmount.value = "0";
}
loanCancelBtn.addEventListener("click", bankPayCanceled);

const bankTransferCanceled = () => {
    transferAmount.value = "0";
}
cancelTransfer.addEventListener("click", bankTransferCanceled);

const payBackCanceled = () => {
    payBack.value = "0";
}
cancelPayBack.addEventListener("click", payBackCanceled);

const BankPayCanceled = () => {
    bankPayAmount.value = "0";
}
cancelBankPay.addEventListener("click", BankPayCanceled);


// ––– WORK –––


const work = () => {
    banking.work();
    showCash();
    workMessage.innerText = "";
}

const transferToBank = () => {
    workMessage.innerText = "";
    const amount = transferAmount.value;
    const cash = banking.getCash();
    if (amount > cash) {
        transferAmount.value = cash;
        workMessage.innerText = `You only have ${cash} NOK`;
        return;
    }
    console.log(banking.checkLoan());
    const currentLoan = banking.getLoan();
    banking.transferBank(amount);
    
    showBalance();
    showCash();
    updateMaxLoan();

    if (banking.checkLoan()) {
        banking.checkRepaid();
        showLoan();
        let toLoan = (amount/10).toFixed(2);
        if (amount/10 > currentLoan) {toLoan = currentLoan.toFixed(2)};
        workMessage.innerText = `${toLoan} NOK was paid to your loan.${(banking.checkLoan() ? "" : " Your loan has been repaid :)")}`;
    }
    console.log(banking.checkLoan());
    updateLoanUI();
    
}

// ––– PAYBACK –––

const payBackLoan = () => {
    if (!banking.checkLoan()) {
        workMessage.innerText = "You have no outstanding loan :)";
        return;
    }
    let amount = payBack.value;
    const cash = banking.getCash();
    const loan = banking.getLoan();
    if (amount > cash) {
        payBack.value = cash;
        workMessage.innerText = `You only have ${cash} NOK`;
        return;
    };
    if (amount > loan) { amount = loan };
    banking.payLoan(amount);
    banking.checkRepaid();
    showLoan();
    showCash();
    workMessage.innerText = `${amount} NOK was paid back on your loan.${(banking.checkLoan() ? "" : " Your loan has been repaid :)")}`;
    updateLoanUI();
}
// from bank
const payBackFromBank = () => {
    if (!banking.checkLoan()) {
        bankMessage.innerText = "You have no outstanding loan :)";
        return;
    }
    let amount = bankPayAmount.value;
    const loan = banking.getLoan();
    if (amount > loan) { amount = loan };
    banking.transferToLoan(amount);
    banking.checkRepaid();
    showBalance();
    showLoan();
    bankMessage.innerText = `${amount} NOK was paid back to your loan, from your bank.${(banking.checkLoan() ? "" : " Your loan has been repaid :)")}`;
    updateLoanUI();
}

// ––– GETTING THE KOMPUTERS ––– (ps. I know it´s really spelled with a 'c')

const insertOption = (object) => {
    const element = document.createElement("option");
    element.innerText = object.title;
    element.dataset.id = object.id;
    komputersList.append(element);
}

const populateSelect = (objArr) => {
    objArr.forEach(insertOption);
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

const populateSpecs = (arr) => {
    removeAllChildNodes(komputerSpecs);
    for (let spec of arr) {
        const element = document.createElement("li");
        element.innerText = spec;
        komputerSpecs.append(element);
    }
}

const checkId = (obj) => {
    return obj.id == idNumber;
}
const findKomputer = () => {
    return komputers.find(checkId);
}
const findKomputerSpecs = () => {
    populateSpecs(findKomputer().specs);
}
const findKomputerDescription = () => {
    const komputerObj = findKomputer()
    komputerName.innerText = komputerObj.title;
    komputerDescription.innerText = komputerObj.description;
    komputerPrice.innerText = `${komputerObj.price} NOK`;
}

const findKomputerImage = () => {
    const komputerObj = findKomputer();
    const imageAlt = `Image of ${komputerObj.title}`;
    let imageUrl = "https://computer-api-production.up.railway.app/" + komputerObj.image;
    if (komputerObj.id == "5") {
        imageUrl = "https://computer-api-production.up.railway.app/assets/images/5.png";
        // just to fix an error in the data...
    }
    console.log(imageUrl);
    console.log(imageAlt);
    komputerImage.setAttribute("src", imageUrl);
    komputerImage.setAttribute("alt", imageAlt);

}

// ––– BUYING –––

const buyKomputer = () => {
    buyMessage.innerText = "";
    const komputer = findKomputer();
    const price = komputer.price;
    let coverage = banking.getBalance();
    if (price > coverage) {
        buyMessage.style.animationName = "none";
        buyMessage.innerText = "Your bank balance is not sufficient to buy this komputer";
        return;
    }
    banking.payFromBank(price);
    showBalance();
    myKomputers.push(komputer);
    console.log(myKomputers);
    const name = komputer.title;
    let message = name + " is now yours!";
    if (!name.includes("The ")) { message = "The " + message };
    buyMessage.innerText = message;
    activateBuyAnim(buyMessage);
    addToMyKomputers(komputer);

}
const activateBuyAnim = (element) => {
    element.classList.remove("buyAnimation");
    void element.offsetWidth;
    buyMessage.style.animationName = "";
    element.classList.add("buyAnimation");
} 
// collection..
const addToMyKomputers = (komputer) => {
    const frame = document.createElement("div");
    const image = document.createElement("img");
    const name = document.createElement("h4");
    const blurb = document.createElement("p");
    let imageUrl = "https://computer-api-production.up.railway.app/" + komputer.image;
    if (komputer.id == "5") {
        imageUrl = "https://computer-api-production.up.railway.app/assets/images/5.png";
        // just to fix an error in the data...
    }
    image.setAttribute("src", imageUrl);
    name.innerText = komputer.title;
    blurb.innerText = komputer.description;
    frame.append(image);
    frame.append(name);
    frame.append(blurb);
    collection.append(frame);
}


// ––– EVENT RESPONSES –––
komputersList.onchange = (e) => {
    idNumber = e.target.options[e.target.selectedIndex].dataset.id;
    buyMessage.innerText = "";
    findKomputerSpecs();
    findKomputerDescription();
    findKomputerImage();
}

loanReqBtn.addEventListener("click", requestLoan);
workBtn.addEventListener("click", work);
confirmPayBack.addEventListener("click", payBackLoan);
confirmTransfer.addEventListener("click", transferToBank);
buyBtn.addEventListener("click", buyKomputer);
confirmBankPay.addEventListener("click", payBackFromBank);

// visibility-buttons
loanBtn.addEventListener("click", () => toggleBlockElement(loanUI));
bankPayBtn.addEventListener("click", () => toggleBlockElement(bankPaykUI));
bankBtn.addEventListener("click", () => toggleBlockElement(bankUI));
payBackBtn.addEventListener("click", () => toggleBlockElement(payBackUI));


// ––– INITIAL LOADS –––
customerName.innerText = banking.getCustomerName();
showBalance();
showCash();
getKomputers()
    .then(data => komputers = [...data])
    .then(populateSelect)
    .then(findKomputerSpecs)
    .then(findKomputerDescription)
    .then(findKomputerImage);

// inital visibility

loanInfo.style.display = "none";
hideElement(loanUI);
hideElement(bankPaykUI);
hideElement(bankUI);
hideElement(payBackUI);
hideElement(bankPayBtn);
hideElement(payBackBtn);



