const URL = 'https://phonebook-ab10b.firebaseio.com/';


$('#btnLoad').on("click", loadData);


function loadData() {
    $('#phonebook').empty();

    $.ajax({
        method: "GET",
        url: URL + '.json',
        success: handleSuccess,
        error: handleError
    });

    function handleSuccess(res) {

        console.log(res);

        //
        // for (let key of res) {
        //     $('#phonebook').append(
        //         $(`<li>${res[key].name}: tel </li>`)
        //             .append($('<a href="#" > [Delete] < /a>')
        //             ))
        // }

    }

}


function handleError(res) {
    console.log(res);

}