export const paymentValidationMessage = {
    cardholdername: {
        required: `Card Holder Name can't be blank.`,
        whitespace: `Card Holder Name can't be blank.`
    },
    cardnumber: {
        required: `Your card number can't be blank.`,
        whitespace: `Your card number can't be blank.`,
        incomplete_number: `Your card number is incomplete.`,
        invalid_number: `Your card number is invalid.`,
    },
    exp_date: {
        required: `Your card's expiration date can't be blank.`,
        whitespace: `Your card's expiration date can't be blank.`,
        incomplete_expiry: `Your card's expiration date is incomplete.`,
        invalid_expiry_month_past: `Your card's expiration date is in the past.`,
        invalid_expiry_year_past: `Your card's expiration year is in the past..`,
    },
    cvc: {
        required: `CVC can't be blank.`,
        whitespace: `CVC can't be blank.`,
        incomplete_cvc: `Your card's security code is incomplete.`
    }
}