function attachEvents() {

    const URL = "https://messanger-503d7.firebaseio.com/.json";
    refresh();

    $('#refresh').on('click', refresh);
    $('#submit').on('click', submit);

    function submit() {
        let authorName = $('#author').val();
        let msgText = $('#content').val();
        let postMessage = JSON.stringify({
            author: authorName,
            content: msgText,
            timestamp: Date.now()
        });

        $.post(URL, postMessage).then(refresh);
    }


    function refresh() {
        $('#author').val("");
        $('#content').val("");
        $('#messages').empty();

        $.get(URL).then(loadMessages);

        function loadMessages(res) {
            // let unsortedMessages = [];
            for (let obj in res) {
                // let mess = {name:res[obj].author, content:res[obj].content, time:res[obj].timestamp};
                // unsortedMessages.push(mess);
                $('#messages').append(res[obj].author + ": " + res[obj].content + '\n');
            }

            // let sorted = unsortedMessages.sort((a,b) => a.time-b.time);
            // for (let obj of sorted) {
            //     $('#messages').append(obj.name + ":  " + obj.content + '\n');
            // }
        }
    }
}