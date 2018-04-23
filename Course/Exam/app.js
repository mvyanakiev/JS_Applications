$(() => {

    (() => {

        $('#container > section').css("display", "none");
        $('#cashier').hide();
        $('#nav').hide();
        $('.logout').on("click", logoutUser);

        $('#login-form').submit(loginUser);
        $('#register-form').submit(registerUser);
        $('#create-entry-form').submit(createReceipt);

        $('#checkoutBtn').on("click", checkOut);


    })();


    if (sessionStorage.getItem('username') === null) {
        userLoggedOut();
    } else {
        userLoggedIn();
    }

    function checkOut(ev) {
        ev.preventDefault();
        console.log("hui");

    }

    function validateInfo(productData) {


        if ((typeof productData.type === "string")
            && (productData.type !== "")
            && (productData.price > 0)
            && (productData.qty > 0)) {
            return true;
        }

        // else if  (typeof productData.type !== "string") {
        //     showError("Product type is not a string!")
        // } else if  (productData.type !== "") {
        //     showError("Product type must not be empty!")
        // } else if  (productData.price > 0) {
        //     showError("Product price must be a positive number!")
        // } else if  (productData.qty > 0) {
        //     showError("Product qty must be a positive number!")
        // }

        //todo error VALIDATION

    }

    function createReceipt(ev) {
        ev.preventDefault();

        let productData = {
            type: $('#create-entry-form').find('input[name="type"]').val(),
            price: $('#create-entry-form').find('input[name="price"]').val(),
            qty: $('#create-entry-form').find('input[name="qty"]').val(),
        };


        if (validateInfo(productData) === true) {

            requester.post('appdata', 'entries', "", productData)
                .then(() => {
                    getProducts();
                    $('#create-entry-form').find('input[name="type"]').val("");
                    $('#create-entry-form').find('input[name="price"]').val("");
                    $('#create-entry-form').find('input[name="qty"]').val("");
                }).catch(handleError);
        }
    }

    function getProducts() {
        requester.get('appdata', 'entries', '')
            .then(listProducts)
            .catch(handleError);
    }

    function listProducts(res) {
        $('#active-entries').empty();
        let grandTotal = 0;
        let tableRow = "";
        let productCount = 0;

        for (let element of res) {

            let subTotal = (element.price * element.qty);
            subTotal = Number(subTotal.toFixed(2));
            productCount = productCount + 1;

            tableRow += `<div class="row">`;
            tableRow += `<div class="col wide">${element.type}</div>`;
            tableRow += `<div class="col wide">${element.qty}</div>`;
            tableRow += `<div class="col wide">${element.price}</div>`;
            tableRow += `<div class="col wide">${subTotal}</div>`;
            tableRow += `<a href="#" class="deleteMsg" name="${element._id}">&#10006;</a>`;
            grandTotal += subTotal;
        }
        $('#active-entries').append(tableRow);

        $('.deleteMsg').on('click', deleteCurrentProduct);
        $('#grandeTotalleTiEbaMaikata').text(grandTotal);

    }

    function deleteCurrentProduct(ev) {
        ev.preventDefault();
        let currentId = $(ev.target).attr('name');

        requester.remove('appdata', "entries/" + currentId, '')
            .then(getProducts)
            .catch(handleError);
    }

    function showUserName() {
        let newUserToShow = sessionStorage.getItem('username');
        let textToAppend = '<span>Cashier: </span>';
        textToAppend += `<a href="#">${newUserToShow}</a>`;
        $('#cashier').html(textToAppend);
    }

    function registerUser(ev) {
        ev.preventDefault();

        let usernameVal = $('#username-register').val();
        let passwordVal = $('#password-register').val();
        let passwordRepeatVal = $('#password-register-check').val();

        if ((passwordVal === passwordRepeatVal) && (passwordVal.length>4) && (typeof passwordVal === "string")      ) {
            auth.register(usernameVal, passwordVal)
                .then((userInfo) => {
                    showInfo("User registration successful.");
                    saveSession(userInfo);
                    $('#username-register').val("");
                    $('#password-register').val("");
                    $('#password-register-check').val("");
                })
                .catch(handleError);
        } else {
            showError("Password do not match.")
        }


    }

    function userLoggedIn() {
        $('#welcome-section').hide();
        $('#nav').show();
        $('#cashier').show();
        $('#create-receipt-view').show();
        showUserName();
        getProducts();

    }

    function loginUser(ev) {
        ev.preventDefault();

        let usernameVal = $('#username-login').val();
        let passwordVal = $('#password-login').val();

        auth.login(usernameVal, passwordVal)
            .then((userInfo) => {
                showInfo("Login successful successful.");
                saveSession(userInfo);
                $('#username-login').val("");
                $('#password-login').val("");
            })
            .catch(handleError);
    }

    function logoutUser() {
        auth.logout().then(() => {
            sessionStorage.clear();
            showInfo("Logout successful.");
            userLoggedOut();
        }).catch(handleError);
    }

    function userLoggedOut() {
        $('#welcome-section').show();
        $('#cashier').hide();
        $('#nav').hide();
        $('#create-receipt-view').hide();

    }

    function saveSession(userInfo) {
        let userAuth = userInfo._kmd.authtoken;
        sessionStorage.setItem('authtoken', userAuth);
        let userId = userInfo._id;
        sessionStorage.setItem('userId', userId);
        let username = userInfo.username;
        sessionStorage.setItem('username', username);
        userLoggedIn();
    }

    function handleError(reason) {
        showError(reason.responseJSON.description);
    }

    function showInfo(message) {
        let infoBox = $('#infoBox');
        infoBox.text(message);
        infoBox.show();
        setTimeout(() => infoBox.fadeOut(), 1000);
    }

    function showError(message) {
        let errorBox = $('#errorBox');
        errorBox.text(message);
        errorBox.show();
        setTimeout(() => errorBox.fadeOut(), 1000);
    }

    // Handle notifications
    $(document).on({
        ajaxStart: () => $("#loadingBox").show(),
        ajaxStop: () => $('#loadingBox').fadeOut()
    });


});