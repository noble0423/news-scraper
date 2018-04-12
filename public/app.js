// Grabs the articles as JSON 
$.getJSON("/articles", function(data) {
    for (let i = 0; i < data.length; i++) {
        $("#all-articles").append(`<br><div class='individual-article'><div data-id= ${ data[i]._id } > ${ data[i].title } <br /> ${ data[i].link } <br /> ${ data[i].image } <br /> ${ data[i].publishDate } </div></div>`);
        // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
        // console.log(data[i].title);
    }
});