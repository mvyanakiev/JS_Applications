const BASE_URL = 'https://baas.kinvey.com/';
const APP_KEY = 'kid_SygfWsv9z';
const APP_SECRET = '6ca2a6293fbf432b881c888d4bfab277';
const AUTH_HEADERS = {'Authorization': "Basic " + btoa(APP_KEY + ":" + APP_SECRET)}
const BOOKS_PER_PAGE = 10;

function loginUser() {
    let username = $('#formLogin input[name=username]').val();
    let password = $('#formLogin input[name=passwd]').val();
    $.ajax({
        method: "POST",
        url: BASE_URL + 'user/' + APP_KEY + '/login',
        headers: AUTH_HEADERS,
        data: {username, password},
    }).then(function (res) {
        signInUser(res, "Login successful")
    }).catch(handleAjaxError);
}

function registerUser() {

    let username = $('#formRegister input[name=username]').val();
    let password = $('#formRegister input[name=passwd]').val();

    $.ajax({
        method: "POST",
        url: BASE_URL + 'user/' + APP_KEY + '/',
        headers: AUTH_HEADERS,
        data: {username, password},
    }).then(function (res) {
        signInUser(res, 'Registration successful.').catch(handleAjaxError)
    });
}

function listBooks() {
    $.ajax({
        url: BASE_URL + 'appdata/' + APP_KEY + '/books',
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')}
    }).then(function (res) {
        showView('viewBooks')
        displayPaginationAndBooks(res.reverse())
    }).catch(handleAjaxError);
}

function createBook() {

    let title = $('#viewCreateBook input[name=title]').val();
    let author = $('#viewCreateBook input[name=author]').val();
    let description = $('#viewCreateBook textarea[name=description]').val();

    $.ajax({
        method: "POST",
        url: BASE_URL + 'appdata/' + APP_KEY + '/books',
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
        data: {
            title: title,
            author: author,
            description: description,
        },
    })
        .then(function (res) {
            listBooks();
            showInfo('Book created.')})
        .catch(handleAjaxError);



}

function deleteBook(book) {
    // TODO
    // DELETE -> BASE_URL + 'appdata/' + APP_KEY + '/books/' + book._id
    // showInfo('Book deleted.')
}

function loadBookForEdit(book) {
    // TODO
}

function editBook() {
    // TODO
    // PUT -> BASE_URL + 'appdata/' + APP_KEY + '/books/' + book._id
    // showInfo('Book edited.')
}

function saveAuthInSession(userInfo) {
    // TODO
}

function logoutUser() {
    sessionStorage.clear();
    showHideMenuLinks();
    showHomeView();
    showInfo('Logout successful.');
}

function signInUser(res, message) {
    sessionStorage.setItem('username', res.username);
    sessionStorage.setItem('authToken', res._kmd.authtoken);
    sessionStorage.setItem('userId', res._id);
    showHomeView();
    showHideMenuLinks();
    showInfo(message);
}

function displayPaginationAndBooks(books) {
    let pagination = $('#pagination-demo')
    if (pagination.data("twbs-pagination")) {
        pagination.twbsPagination('destroy')
    }
    pagination.twbsPagination({
        totalPages: Math.ceil(books.length / BOOKS_PER_PAGE),
        visiblePages: 5,
        next: 'Next',
        prev: 'Prev',
        onPageClick: function (event, page) {
            let table = $('#books > table');
            table.find('tr').each((index, el) => {
                if (index > 0) {
                    $(el).remove()
                }
            });
            let startBook = (page - 1) * BOOKS_PER_PAGE;
            let endBook = Math.min(startBook + BOOKS_PER_PAGE, books.length);
            $(`a:contains(${page})`).addClass('active');
            for (let i = startBook; i < endBook; i++) {
                let tr = $('<tr>');
                table.append(
                    $(tr).append(
                        $(`<td>${books[i].title}</td>`))
                        .append($(`<td>${books[i].author}</td>`))
                        .append($(`<td>${books[i].description}</td>`))
                );


                // console.log(books[i]._acl.creator);
                // console.log(sessionStorage.getItem('userId'));

                if (books[i]._acl.creator === sessionStorage.getItem('userId')) {
                    $(tr).append($(`<td>`)
                        .append(
                            $(`<a href="#">[Edit]</a>`).on("click", function () {
                                loadBookForEdit(books[i])
                                console.log("EDIT");
                            })
                        )
                        .append(
                            $(`<a href="#">[Delete]</a>`).on("click", function () {
                                console.log("Delete");
                                deleteBook(books[i])
                            })
                        )
                    )

                }


            }
        }
    })
}

function handleAjaxError(response) {
    let errorMsg = JSON.stringify(response)
    if (response.readyState === 0)
        errorMsg = "Cannot connect due to network error."
    if (response.responseJSON && response.responseJSON.description)
        errorMsg = response.responseJSON.description
    showError(errorMsg)
}