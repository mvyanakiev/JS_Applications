let messagesService = (() => {

    function loadMyMessage(username) {
        let endPoint = `messages?query={"recipient_username":"${username}"}`;
        return requester.get('appdata', endPoint, '')
    }


    function loadArchiveMessage(username) {
        let endPoint = `messages?query={"sender_username":"${username}"}`;
        return requester.get('appdata', endPoint, '')
    }

    function deleteMessage(id) {
        return requester.remove('appdata', "messages/" + id, "basic");
    }

    function sendingMessage(username, messageToSend) {
        let userData = {
            sender_username: sessionStorage.getItem('username'),
            sender_name: sessionStorage.getItem('name'),
            recipient_username: username,
            text: messageToSend,
        };
        return requester.post("appdata", "messages", "", userData)
    }

    return {
        loadMyMessage,
        loadArchiveMessage,
        deleteMessage,
        sendingMessage
    }


})();