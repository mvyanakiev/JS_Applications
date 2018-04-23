$(() => {

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


    if (sessionStorage.getItem('username') === null) {
        userLoggedOut();
    } else {
        userLoggedIn();
    }


    function logOutView() {
        $('#profile').css("display", "none");
        $('#viewCatalog').css("display", "none");
        $('#viewSubmit').css("display", "none");
        $('#viewMyPosts').css("display", "none");
        $('#viewEdit').css("display", "none");
        $('#viewEdit').css("display", "none");
        $('#viewComments').css("display", "none");
        $('#menu').css("display", "none");

    }










    function userLoggedIn() {


        $('.anonymous').hide();
        $('.useronly').show();
        let username = sessionStorage.getItem('username');
        $('#spanMenuLoggedInUser').text("Welcome, " + sessionStorage.getItem('name'));
        $('#viewUserHomeHeading').text("Welcome, " + sessionStorage.getItem('name'));

        showView("");
    }

    function userLoggedOut() {
        // hideAllViews();
        logOutView();


    }



    function saveSession(userInfo) {
        let userAuth = userInfo._kmd.authtoken;
        sessionStorage.setItem('authtoken', userAuth);
        let userId = userInfo._id;
        sessionStorage.setItem('userId', userId);
        let username = userInfo.username;
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('name', userInfo['name']);
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


});