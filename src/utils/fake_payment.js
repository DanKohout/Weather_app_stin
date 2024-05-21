
/**
 * This is a fake payment check function.
 * For now, it returns true if the inputs are somewhat correct
 * @returns boolean
 */
function fakePayment(cardholderName, cardNumber, expDate, cvv) {
    // This is a fake payment check function.
    // For now, it returns true if the inputs are somewhat correct
    const isValidCardNumber = validateCardNumber(cardNumber);
    const isValidExpDate = validateExpDate(expDate);
    const isValidCVV = validateCVV(cvv);
    if (!isValidCardNumber || !isValidExpDate || !isValidCVV) {
        return false;
    }
    return true;
}

function validateCardNumber(cardNumber) {
    const cardNumberPattern = /^\d{16}$/;
    return cardNumberPattern.test(cardNumber);
}

function validateExpDate(expDate) {
    const expDatePattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expDatePattern.test(expDate)) {
        return false;
    }
    const [month, year] = expDate.split('/').map(Number);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear() % 100;
    return (year > currentYear) || (year === currentYear && month >= currentMonth);
}

function validateCVV(cvv) {
    const cvvPattern = /^\d{3}$/;
    return cvvPattern.test(cvv);
}

module.exports = fakePayment;