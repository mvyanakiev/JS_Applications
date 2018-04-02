function attachEvents() {

    const URL = "https://baas.kinvey.com/appdata/kid_rJnpHCvcM";
    const USERNAME = "guest";
    const PASSWORD = "guest";

    $('.load').on("click", () => {
        $.ajax({
            method: "GET",
            url: URL + "/biggestCatches",
            headers: {
                "Authorization": "Basic " + btoa(USERNAME + ":" + PASSWORD)
            },
        }).then(loadData).catch(handleError)
    });

    $('.add').on("click", () => {

        let dataToPost = {
            angler: $('#addForm .angler').val(),
            weight: Number($('#addForm .weight').val()),
            species: $('#addForm .species').val(),
            location: $('#addForm .location').val(),
            bait: $('#addForm .bait').val(),
            captureTime: Number($('#addForm .captureTime').val()),
        };

        $.ajax({
            method: "POST",
            headers: {
                "Authorization": "Basic " + btoa(USERNAME + ":" + PASSWORD)
            },
            url: URL + "/biggestCatches",
            data: dataToPost,
        }).then(added).catch(handleError)

    });

    function loadData(res) {

        $('#catches').empty();

        for (let obj of res) {

            let dataToappend = `
            <div class="catch" data-id="${obj._id}">
            <label>Angler</label>
            <input type="text" class="angler" value="${obj.angler}"/>
            <label>Weight</label>
            <input type="number" class="weight" value="${obj.weight}"/>
            <label>Species</label>
            <input type="text" class="species" value="${obj.species}"/>
            <label>Location</label>
            <input type="text" class="location" value="${obj.location}"/>
            <label>Bait</label>
            <input type="text" class="bait" value="${obj.bait}"/>
            <label>Capture Time</label>
            <input type="number" class="captureTime" value="${obj.captureTime}"/>
            <button class="update">Update</button>
          <button class="delete" >Delete</button>
       </div>`;

            $('#catches').append(dataToappend);

            $('.delete').on('click',
                deleteElement
            );

            $('.update').on('click',
                updateElement
            );
        }
    }
    function updateElement(ev) {
        let currentId = $(ev.target).parent().attr('data-id');
        let currentDiv = $(this).parent();

        let dataToPost = {
            angler: currentDiv.find('.angler').val(),
            weight: Number(currentDiv.find('.weight').val()),
            species: currentDiv.find('.species').val(),
            location: currentDiv.find('.location').val(),
            bait: currentDiv.find('.bait').val(),
            captureTime: Number(currentDiv.find('.captureTime').val())
        };
            let request = {
            method: 'PUT',
            url: "https://baas.kinvey.com/appdata/kid_rJnpHCvcM/biggestCatches/" + currentId,
            headers: {
                "Authorization": "Basic " + btoa(USERNAME + ":" + PASSWORD)
            },
            data: dataToPost,
        };
        $.ajax(request)
            .then(added)
            .catch(handleError);

    }
    function deleteElement(ev) {
        let currentId = $(ev.target).parent().attr('data-id');
        let request = {
            method: 'DELETE',
            url: "https://baas.kinvey.com/appdata/kid_rJnpHCvcM/biggestCatches/" + currentId,
            headers: {
                "Authorization": "Basic " + btoa(USERNAME + ":" + PASSWORD)
            },
        };
        $.ajax(request)
            .then(added)
            .catch(handleError);
    }
    function added() {

        (function loading() {
            $.ajax({
                method: "GET",
                url: URL + "/biggestCatches",
                headers: {
                    "Authorization": "Basic " + btoa(USERNAME + ":" + PASSWORD)
                },
            }).then(loadData).catch(handleError)
        })();

        clearForm();
    }
    function clearForm() {
        $('#addForm .angler').val("");
        $('#addForm .weight').val("");
        $('#addForm .species').val("");
        $('#addForm .location').val("");
        $('#addForm .bait').val("");
        $('#addForm .captureTime').val("")
    }
    function handleError(myEr) {
        console.log(myEr.status);
        console.log(myEr.statusText);
    }
}




