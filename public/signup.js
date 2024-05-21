document.addEventListener('DOMContentLoaded', function () {
    username = document.getElementById('username');
    password = document.getElementById('password');
    cardholder_name = document.getElementById('cardholder-name');
    card_number = document.getElementById('card-number');
    exp_date = document.getElementById('exp-date');
    cvv = document.getElementById('cvv');
    btn_signup = document.getElementById('btn-signup');


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


    /**
     * 
     */
    btn_signup.addEventListener('click', () => {

        if (!username.value || !password.value || !cardholder_name.value || !card_number.value || !exp_date.value || !cvv.value) {
            alert('Please fill out all fields');
            return;
        }

        if (!validateCardNumber(card_number.value)) {
            alert('Please enter a valid card number');
            return;
        }

        if (!validateExpDate(exp_date.value)) {
            alert('Please enter a valid expiration date (MM/YY)');
            return;
        }

        if (!validateCVV(cvv.value)) {
            alert('Please enter a valid CVV');
            return;
        }

        console.log('Signup successful');
        var usernameVal = username.value
        var passwordVal = password.value
        var cardHolderVal = cardholder_name.value
        var cardNumVal = card_number.value
        var expDatVal = exp_date.value
        var cvvVal = cvv.value
        const signupData = {
            usernameVal, passwordVal, cardHolderVal, cardNumVal, expDatVal, cvvVal
        };

        fetch('/signup/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signupData)
        })
            .then(response => {
                if (response.status === 201) {
                    //if successful relocate to login
                    window.location.href = '/login';
                } else {
                    return response.text().then(data => {
                        throw new Error(data);
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error registering user');
            });
    });




})