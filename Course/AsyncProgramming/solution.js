function attachEvents() {
    const URL = "https://baas.kinvey.com/appdata/kid_HJYf25Qcf";
    const USERNAME = "Peter";
    const PASSWORD = "p";
    let posts = {};

    $('#btnLoadPosts').on("click", () => {
        $.ajax({
            method: "GET",
            url: URL + "/posts",
            headers: {
                "Authorization": "Basic " + btoa(USERNAME + ":" + PASSWORD)
            },
        }).then(handleSuccess).catch(handleError)
    });

    function handleSuccess(res) {
        $('#posts').empty()
        for (let obj in res) {
            $('#posts').append(`<option value="${res[obj]._id}">${res[obj].title}</option>`);
            posts[res[obj]._id] = res[obj].body;

        }
    }

    $('#btnViewPost').on("click", loadComments);



    function loadComments() {
        $('#post-comments').empty();

        let postId = $('#posts').val();
        $('#post-title').text($('#posts').find(":selected").text());
        $('#post-body').text(posts[postId]);

        $.ajax({
            url: URL + `/comments/?query={"post_id":"${postId}"}`,
            headers: {
                "Authorization": "Basic " + btoa(USERNAME + ":" + PASSWORD)
            },

        }).then(function (res) {

            for (let obj in res) {
                $('#post-comments').append(`<li>${res[obj].text}</li>`)
            }

        })
    }


    function handleError(myEr) {
        console.log(myEr.status);
        console.log(myEr.statusText);
    }
}

