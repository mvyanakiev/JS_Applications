function startApp() {
    $('header').find('a').show();

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

    $('header').find('a[data-target]').on('click', navigateTo);









}