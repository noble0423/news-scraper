// Grabs the articles as JSON 
$.getJSON("/articles", function(data) {
    console.log(data);
    for (let i = 0; i < data.length; i++) {
        // $("#articles").append(`<p data-id= ${ data[i]._id } > ${ data[i].title } <br /> ${ data[i].link } <br /> ${ data[i].image } <br /> ${ data[i].publishDate } </p>`);
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
        console.log(data[i].title);
    }
});