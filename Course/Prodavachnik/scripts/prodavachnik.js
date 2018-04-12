function startApp() {

    // localStorage.clear();

    const appKey = 'kid_Bk1jUzfof';
    const appSecret = 'dbb2217fa20f49bfadd86cef791597cb';
    const baseUrl = 'https://baas.kinvey.com/';
    const timeOut = 1000;

    // Attach AJAX "loading" event listener
    $(document).on({
        ajaxStart: function () {
            $("#loadingBox").show()
        },
        ajaxStop: function () {
            $("#loadingBox").hide()
        }
    });

    $('header').find('a').show();
    $('#viewHome').show();


    function showView(view) {
        $('section').hide();

        switch (view) {
            case 'home' :
                $('#viewHome').show();
                break;

            case 'login' :
                $('#viewLogin').show();
                break;

            case 'register' :
                $('#viewRegister').show();
                break;

            case 'ads' :
                $('#viewAds').show();
                break;

            case 'create' :
                $('#viewCreateAd').show();
                break;

            case 'details' :
                $('#viewDetailsAd').show();
                break;

            case 'edit' :
                $('#viewEditAd').show();
                break;
        }

    }

    function navigateTo(e) {
        $('section').hide();
        let target = $(e.target).attr('data-target');
        $('#' + target).show();
    }

    // Event listeners
    $('header').find('a[data-target]').on('click', navigateTo);
    $('#buttonLoginUser').on("click", login);
    $('#buttonRegisterUser').on("click", register);
    $('#buttonCreateAd').on("click", createAdd);
    $('#linkListAds').on("click", loadAdsFromKinvey);
    $('#linkLogout').on("click", logout);


    let requester = (() => {

        function makeAuth(type) {
            if (type === 'basic') return 'Basic ' + btoa(appKey + ':' + appSecret);
            else return 'Kinvey ' + localStorage.getItem('authtoken');
        }

        function makeRequest(method, module, url, auth) {
            return req = {
                url: baseUrl + module + '/' + appKey + '/' + url,
                method,
                headers: {
                    'Authorization': makeAuth(auth)
                }
            };
        }

        function get(module, url, auth) {
            return $.ajax(makeRequest("GET", module, url, auth))
        }

        function post(module, url, data, auth) {
            let req = makeRequest("POST", module, url, auth);
            req.data = data;
            return $.ajax(req);
        }

        function update(module, url, data, auth) {
            let req = makeRequest("PUT", module, url, auth);
            req.data = data;
            return $.ajax(req);
        }

        function remove(module, url, auth) {
            return $.ajax(makeRequest("DELETE", module, url, auth));
        }

        return {
            get, post, update, remove
        }

    })();

    if (localStorage.getItem('authtoken') !== null &&
        localStorage.getItem('username') !== null) {
        userLoggedIn();
    } else {
        userLoggedOut();
    }

    function userLoggedIn() {
        $('#loggedInUser').text(`Здравей, ${localStorage.getItem('username')}!`);
        $('#loggedInUser').show();
        $('#linkLogin').hide();
        $('#linkRegister').hide();
        $('#linkLogout').show();
        $('#linkListAds').show();
        $('#linkCreateAd').show();
    }

    function userLoggedOut() {
        $('#loggedInUser').text("");
        $('#loggedInUser').hide();
        $('#linkLogin').show();
        $('#linkRegister').show();
        $('#linkLogout').hide();
        $('#linkListAds').hide();
        $('#linkCreateAd').hide();
    }

    function saveSession(data) {
        localStorage.setItem('username', data.username);
        localStorage.setItem('id', data._id);
        localStorage.setItem('authtoken', data._kmd.authtoken);
        userLoggedIn();
    }

    async function register() {
        let form = $('#viewRegister');
        let username = form.find('input[name="username"]').val();
        let password = form.find('input[name="passwd"]').val();

        try {
            let data = await requester.post('user', '', {username, password}, 'basic')
            saveSession(data);
            showView('ads');
        } catch (err) {
            errorProd(err);
        }

    }

    async function login() {
        let form = $('#formLogin');
        let username = form.find('input[name="username"]').val();
        let password = form.find('input[name="passwd"]').val();

        try {
            let data = await requester.post('user', 'login', {username, password}, 'basic')
            saveSession(data);
            loadAdsFromKinvey();
        } catch (err) {
            errorProd("Status: " + err.status + "! " + err.responseJSON.description);
        }
    }

    function createAdd() {

        let form = $('#formCreateAd');

        let dataToPost = {
            title: form.find('input[name="title"]').val(),
            description: form.find('textarea[name="description"]').val(),
            date: form.find('input[name="datePublished"]').val(),
            price: form.find('input[name="price"]').val(),
            publisher: localStorage.getItem('username'),
        };

        if (validate(dataToPost)) {
            $.ajax({
                method: "POST",
                data: dataToPost,
                url: baseUrl + 'appdata/' + appKey + '/ads',
                headers: {'Authorization': "Kinvey " + localStorage.getItem('authtoken')},
                success: successAddedAdd,
                error: errorProd,
            });
        }
    }

    function successAddedAdd() {
        showInfoBox("Add created successful");
        loadAdsFromKinvey();
    }

    function loadAdsFromKinvey() {
        showView('ads');

        $.ajax({
            method: "GET",
            url: baseUrl + 'appdata/' + appKey + '/ads',
            headers: {'Authorization': "Kinvey " + localStorage.getItem('authtoken')},
            success: listAds,
            error: errorProd,
        })
    }

    function listAds(ads) {

        ads = ads.reverse();
        $('#ads').html('<table id="adsTable">');
        let adsTable = $('#adsTable');

        let th = "<tr>";
        th += "<th>Title</th>";
        th += "<th>Publisher</th>";
        th += "<th>Description</th>";
        th += "<th>Price</th>";
        th += "<th>Date Published</th>";
        th += "<th>Actions</th>";
        th += "</tr>";

        adsTable.append(th);


        for (let i = 0; i < ads.length; i++) {
            let tr = `<tr>`;
            tr += `<td>${ads[i].title}</td>`;
            tr += `<td>${ads[i].publisher}</td>`;
            tr += `<td>${ads[i].description}</td>`;
            tr += `<td>${ads[i].price}</td>`;
            tr += `<td>${ads[i].date}</td>`;
            tr += `<td>`;

            if (localStorage.getItem("id") === ads[i]._acl.creator) {
                tr += `<a href="#" class="delete" name="${ads[i]._id}">[Delete]</a>`;
                tr += `<a href="#" class="edit" name="${ads[i]._id}">[Edit]</a>`;
            }

            tr += `</td>`;
            tr += `</tr>`;
            adsTable.append(tr);
        }

        $('.delete').on('click', deleteElement);
        $('.edit').on('click', getAdForEdit);
    }

    function deleteElement(ev) {
        let currentId = $(ev.target).attr('name');

        $.ajax({
            method: "DELETE",
            url: baseUrl + 'appdata/' + appKey + '/ads/' + currentId,
            headers: {'Authorization': "Kinvey " + localStorage.getItem('authtoken')},
            success: function () {
                loadAdsFromKinvey();
                showInfoBox("Add deleted successful");
            },
            error: errorProd,
        });
    }

    function getAdForEdit(ev) {

        let currentId = $(ev.target).attr('name');

        $.ajax({
            method: "GET",
            url: baseUrl + 'appdata/' + appKey + '/ads/' + currentId,
            headers: {'Authorization': "Kinvey " + localStorage.getItem('authtoken')},
            success: loadAdForEdit,
            error: errorProd,
        });


    }

    function loadAdForEdit(data) {
        showView('edit');

        let form = $('#formEditAd');

        title: form.find('input[name="title"]').val(data.title);
        description: form.find('textarea[name="description"]').val(data.description);
        date: form.find('input[name="datePublished"]').val(data.date);
        price: form.find('input[name="price"]').val(data.price);
        // publisher: form.find('input[name="publisher"]').val(data.public);
        id: form.find('input[name="id"]').val(data._id);


        $('#buttonEditAd').on("click", function postDetails() {

            let dataToPost = {
                title: form.find('input[name="title"]').val(),
                description: form.find('textarea[name="description"]').val(),
                date: form.find('input[name="datePublished"]').val(),
                price: form.find('input[name="price"]').val(),
                publisher: data.publisher,
                id: form.find('input[name="id"]').val(),
            };


            if (validate(dataToPost)) {

                $.ajax({
                    method: "PUT",
                    data: dataToPost,
                    url: baseUrl + 'appdata/' + appKey + '/ads/' + dataToPost.id,
                    headers: {'Authorization': "Kinvey " + localStorage.getItem('authtoken')},
                    success: () => {
                        loadAdsFromKinvey();
                        showInfoBox("Add edited successful");
                    },
                    error: errorProd,
                });
            }
        });
    }


    function validate(dataToPost) {


        if ((dataToPost.title !== "") &&
            (dataToPost.description !== "") &&
            (dataToPost.date !== "") &&
            (dataToPost.price > 0)) {

            return true

        } else if (dataToPost.title == "") {
            errorProd("Title must not be empty!");
            return false
        } else if (dataToPost.description == "") {
            errorProd("Description must not be empty!");
            return false
        } else if (dataToPost.date == "") {
            errorProd("Data must not be empty!");
            return false
        } else if (dataToPost.price <= 0) {
            errorProd("Price must be positive number!");
            return false
        }
    }

    async function logout() {
        try {
            let data = await requester.post('user', '_logout', {authtoken: localStorage.getItem('authtoken')})
            localStorage.clear();
            userLoggedOut();
            showView('home')
        } catch (err) {
            errorProd(err);
        }


    }

    function errorProd(errorMsg) {
        let box = $('#errorBox');
        box.text(errorMsg);
        box.show();
        setTimeout(function () {
            box.fadeOut()
        }, timeOut);
        clearTimeout(box);
    }

    // function errorProd(response) {
    //     let errorMsg = JSON.stringify(response);
    //     if (response.readyState === 0)
    //         errorMsg = "Cannot connect due to network error.";
    //     if (response.responseJSON &&
    //         response.responseJSON.description)
    //         errorMsg = response.responseJSON.description;
    //     showError(errorMsg);
    // }
    //
    // function showError(errorMsg) {
    //     $('#errorBox').text("Error: " + errorMsg);
    //     $('#errorBox').show();
    // }


    function showInfoBox(infoMsg) {
        let box = $('#infoBox');
        box.text(infoMsg);
        box.show();
        setTimeout(function () {
            box.fadeOut()
        }, timeOut);
        clearTimeout(box);

    }
}