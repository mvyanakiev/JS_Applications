let messages = (() =>  {

    const appKey = 'kid_HysPwa6oG';
    const appSecret = 'ddc43053eb1d458f8667270307c371dd';
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

});