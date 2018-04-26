$(() => {



    //event listener
    $('#registerForm').submit(registerUser);
    $('#loginForm').submit(loginUser);
    $('#logout').on("click", logoutUser());









    if (sessionStorage.getItem('username') === null) {
        userLoggedOut();
    } else {
        userLoggedIn();
    }


    function logOutView() {

        console.log("vliza v poslednoto");

        $('#profile').css("display", "none");
        $('#viewCatalog').css("display", "none");
        $('#viewSubmit').css("display", "none");
        $('#viewMyPosts').css("display", "none");
        $('#viewEdit').css("display", "none");
        $('#viewEdit').css("display", "none");
        $('#viewComments').css("display", "none");
        $('#menu').css("display", "none");
    }

    function registerUser(ev) {
        ev.preventDefault();

        let usernameVal = $('#registerForm').find('input[name=username]').val();
        let passwordVal = $('#registerForm').find('input[name=password]').val();
        let repeatPasVal = $('#registerForm').find('input[name=repeatPass]').val();

        let validUser = validate.lettersOnly(usernameVal, 3);
        let validPass = validate.lettersAndDigits(passwordVal, 6);

        if (validUser === true &&
        validPass === true &&
        passwordVal === repeatPasVal) {

            auth.register(usernameVal, passwordVal, repeatPasVal)
                .then((userInfo) => {
                    showInfo("User registration successful.");
                    saveSession(userInfo);
                    $('#registerForm').find('input[name=username]').val("");
                    $('#registerForm').find('input[name=password]').val("");
                    $('#registerForm').find('input[name=repeatPass]').val("");

                })
                .catch(handleError);
        }
    }

    function loginUser(ev) {
        ev.preventDefault();

        let usernameVal = $('#loginForm').find('input[name=username]').val();
        let passwordVal = $('#loginForm').find('input[name=password]').val();

        let validUser = validate.lettersOnly(usernameVal, 3);
        let validPass = validate.lettersAndDigits(passwordVal, 6);

        if (validUser === true &&
            validPass === true) {

            auth.login(usernameVal, passwordVal)
                .then((userInfo) => {
                    showInfo("Login successful successful.");
                    saveSession(userInfo);
                    $('#loginForm').find('input[name=username]').val("");
                    $('#loginForm').find('input[name=password]').val("");                })
                .catch(handleError);
        }








    }

    function userLoggedIn() {

        let username = sessionStorage.getItem('username');
        $('#profile').css("display", "inline");
        $('#profile > span').text(username);


    }

    function logoutUser() {
        auth.logout().then(() => {
            sessionStorage.clear();
            showInfo("Logout successful.");
            userLoggedOut();
        }).catch(handleError);
    }

    function userLoggedOut() {
        logOutView();
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

    $(document).on({
        ajaxStart: () => $("#loadingBox").show(),
        ajaxStop: () => $('#loadingBox').fadeOut()
    });

    function hideAllViews() {
        $('#profile').css("display", "none");
        $('#viewCatalog').css("display", "none");
        $('#viewSubmit').css("display", "none");
        $('#viewMyPosts').css("display", "none");
        $('#viewEdit').css("display", "none");
        $('#viewEdit').css("display", "none");
        $('#viewComments').css("display", "none");
        $('#viewWelcome').css("display", "none");
        $('#menu').css("display", "none");

    };


});