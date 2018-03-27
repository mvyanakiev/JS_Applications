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
        }).then(clearForm).catch(handleError)

    });

    function loadData(res) {

        $('#catches').empty();

        let dataToappend = "";

        for (let obj of res) {

            dataToappend = `
            <div class="catch" data-id="${obj._id}">
            <label>Angler</label>
            <input type="text" class="angler" value="${obj.angler}"/>
            <label>Weight</label>
            <input type="number" class="weight" value="${obj.weight}"/>
            <label>Species</label>
            <input type="text" class="species" value="${obj.species}"/>
            <label>Хванах рибата на:</label>
            <input type="text" class="location" value="${obj.location}"/>
            <label>Bait</label>
            <input type="text" class="bait" value="${obj.bait}"/>
            <label>Capture Time</label>
            <input type="number" class="captureTime" value="${obj.captureTime}"/>
            <button class="update">Update</button>
            <button class="delete">Delete</button>
        </div>`;

            $('#catches').append(dataToappend);


            //todo заиграй се с this-а за бутоните update & delete - да хваща id-то и да пуска заявака за edit/delete

            // $('#catches .delete').on('click', () => {
            //
            //    let tva = $('#catches .angler').val();
            //    alert(tva);
            //
            // })



        }
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




