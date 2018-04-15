$(() => {

    //Attach event handlers
    (() => {
        $('header').find('a[data-target]').click(navigateTo);
        $('main').find('a[data-target]').click(navigateTo);
        $('#formRegister').find(':submit').on("click", registerUser);
        $('#formLogin').submit(loginUser);
        $('#formSendMessage').submit(sendMessage);
        $('#linkMenuLogout').on("click", logoutUser);

        $('#linkUserHomeMyMessages').on("click", getMessages);
        $('#linkMenuMyMessages').on("click", getMessages);

        $('#linkMenuArchiveSent').on("click", getArchiveMessages);
        $('#linkUserHomeArchiveSent').on("click", getArchiveMessages);

        $('#linkMenuSendMessage').on("click", loadSendMessageScreen);
        $('#linkUserHomeSendMessage').on("click", loadSendMessageScreen);
    })();

    if (sessionStorage.getItem('username') === null) {
        userLoggedOut();
    } else {
        userLoggedIn();
    }


    function loadSendMessageScreen() {
        requester.get('user', "", "")
            .then(prepereDropDownList)
            .catch(handleError);

        function prepereDropDownList(res) {
            $('#msgRecipientUsername').empty();
            let optionsToSelect = "";

            for (let user of res) {
                //todo Оправи Юзера <бр> да се показва
                optionsToSelect += `<option value="${user.username}">${user.name}</option>`
            }

            $('#msgRecipientUsername').append(optionsToSelect);
        }
    }

    function sendMessage(ev) {
        ev.preventDefault();

        let username = $('#msgRecipientUsername').find(":selected").val();
        let messageToSend = $('#msgText').val();

        messagesService.sendingMessage(username, messageToSend)
            .then(() => {
                showInfo("Message sent.");
                listArchiveMessages();
            })
            .catch(handleError);
    }

    function listArchiveMessages(msg) {

        $('#sentMessages').empty();

        let TABLE_HEADER = "<table>\n" +
            "                    <thead>\n" +
            "                    <tr>\n" +
            "                        <th>To</th>\n" +
            "                        <th>Message</th>\n" +
            "                        <th>Date Sent</th>\n" +
            "                        <th>Actions</th>\n" +
            "                    </tr>\n" +
            "                    </thead>\n" +
            "\n" +
            "\n" +
            "                    <tbody>";

        let tableSentFooter = "</tbody>\n" +
            "                    \n" +
            "                    \n" +
            "                </table>";

        let tableSentMessages = "";

        for (let msgElement of msg) {

            tableSentMessages += "<tr>";
            tableSentMessages += `<td>${msgElement.recipient_username}</td>`;
            tableSentMessages += `<td>${msgElement.text}</td>`;
            tableSentMessages += `<td>${formatDate(msgElement._kmd.ect)}</td>`;
            tableSentMessages += `<td><button class="deleteMsg" name="${msgElement._id}">Delete</button></td>`;
            tableSentMessages += "</tr>";
        }

        let tableSentToAppend = TABLE_HEADER + tableSentMessages + tableSentFooter;

        $('#sentMessages').append(tableSentToAppend);

        $('.deleteMsg').on('click', deleteCurrentMessage);
    }

    function deleteCurrentMessage(ev) {
        let currentId = $(ev.target).attr('name');

        messagesService.deleteMessage(currentId)
            .then(listArchiveMessages)
            .catch(handleError);
    }

    function getArchiveMessages() {
        let username = sessionStorage.getItem('username');

        messagesService.loadArchiveMessage(username)
            .then(listArchiveMessages)
            .catch(handleError)
    }

    function getMessages() {
        let username = sessionStorage.getItem('username');

        messagesService.loadMyMessage(username)
            .then(listMessages)
            .catch(handleError)
    }

    function listMessages(msg) {

        if (msg.length > 0) {
            //render table
        } else {
            //render header only

        }
        console.log(msg);
    }

    function logoutUser() {
        auth.logout().then(() => {
            sessionStorage.clear();
            showInfo("Logout successful.");
            userLoggedOut();
        }).catch(handleError);
    }

    function loginUser(ev) {
        ev.preventDefault();

        let usernameVal = $('#loginUsername').val();
        let passwordVal = $('#loginPasswd').val();

        auth.login(usernameVal, passwordVal)
            .then((userInfo) => {
                showInfo("Login successful successful.");
                saveSession(userInfo);
                $('#loginUsername').val("");
                $('#loginPasswd').val("");
            })
            .catch(handleError);
    }

    function registerUser(ev) {
        ev.preventDefault();

        let usernameVal = $('#registerUsername').val();
        let passwordVal = $('#registerPasswd').val();
        let registerNameVal = $('#registerName').val();

        auth.register(usernameVal, passwordVal, registerNameVal)
            .then((userInfo) => {
                showInfo("User registration successful.");
                saveSession(userInfo);
                $('#registerUsername').val("");
                $('#registerPasswd').val("");
                $('#registerName').val("");
            })
            .catch(handleError);
    }

    function navigateTo() {
        //console.log(viewName); // прихваща откъде идва клика
        let viewName = $(this).attr('data-target');
        showView(viewName);
    }

    function userLoggedIn() {
        $('.anonymous').hide();
        $('.useronly').show();
        let username = sessionStorage.getItem('username');
        $('#spanMenuLoggedInUser').text("Welcome, " + sessionStorage.getItem('name'));
        $('#viewUserHomeHeading').text("Welcome, " + sessionStorage.getItem('name'));
        showView('UserHome');
    }

    function userLoggedOut() {
        $('.anonymous').show();
        $('.useronly').hide();
        $('#spanMenuLoggedInUser').text('');
        showView('AppHome');
    }

    function showView(viewName) {
        $('main > section').hide();
        $('#view' + viewName).show();
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

    function formatDate(dateISO8601) {
        let date = new Date(dateISO8601);
        if (Number.isNaN(date.getDate()))
            return '';
        return date.getDate() + '.' + padZeros(date.getMonth() + 1) +
            "." + date.getFullYear() + ' ' + date.getHours() + ':' +
            padZeros(date.getMinutes()) + ':' + padZeros(date.getSeconds());

        function padZeros(num) {
            return ('0' + num).slice(-2);
        }
    }

    // Handle notifications
    $(document).on({
        ajaxStart: () => $("#loadingBox").show(),
        ajaxStop: () => $('#loadingBox').fadeOut()
    });

});