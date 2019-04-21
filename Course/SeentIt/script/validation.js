let validate = (() => {

    function internalError(errorMessage) {
        // let err = {responseJSON: {description: mes}};
        // handleError(err);
        return errorMessage
    }

    function lengthChecking(stringToValidate, n) {
        if ((n === -1) || (stringToValidate.length >= n)) {
            return true
        } else {
            return internalError("Error message: String is shorter than needed");
        }
    }

    function smallLettersOnly(stringToValidate, lengthCheck) {
        let checkerCall = lengthChecking(stringToValidate, lengthCheck);

        if (checkerCall === true) {
            let testRegex = /^[a-z]+$/;
            if (stringToValidate.match(testRegex)) {
                return true;
            } else {
                return internalError("Error message: String doesn't content only small english letters");
            }
        } else {
            return checkerCall
        }
    }

    function lettersOnly(stringToValidate, lengthCheck) {
        let checkerCall = lengthChecking(stringToValidate, lengthCheck);

        if (checkerCall === true) {
            let testRegex = /^[a-zA-z]+$/;
            if (stringToValidate.match(testRegex)) {
                return true;
            } else {
                return internalError("Error message: String doesn't content only english letters");
            }
        } else {
            return checkerCall
        }
    }

    function lettersAndDigits(stringToValidate, lengthCheck) {
        let checkerCall = lengthChecking(stringToValidate, lengthCheck);

        if (checkerCall === true) {
            let testRegex = /^[a-zA-z0-9]+$/;
            if (stringToValidate.match(testRegex)) {
                return true;
            } else {
                return internalError("Error message: String doesn't content only english letters and numbers");
            }
        } else {
            return checkerCall
        }
    }

    return {
        smallLettersOnly,
        lettersOnly,
        lettersAndDigits,
    }
})();
