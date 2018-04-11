$(() => {
    renderCatTemplate();

   async function renderCatTemplate() {

        let cats = window.cats;
        // console.log(cats);

        let source = await $.get('cat-template.hbs');

        let compiled = Handlebars.compile(source);
        let template = compiled({
            cats
        });

       $('#body').append(template);


    }

})
