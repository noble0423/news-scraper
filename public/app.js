// Grabs the articles as JSON 
$.getJSON("/articles", function(data) {
    console.log(data);
    // want the Note Title to render at the end of this line, not the Note _id
    for (let i = 0; i < data.length; i++) {
        $("#all-articles").append(`<br><div class='individual-article'><div data-id=${ data[i]._id } > ${ data[i].title } <br /> ${ data[i].link } <br /> ${ data[i].image } <br /> ${ data[i].publishDate } <br /> ${ data[i].note } </div></div>`);
    }
});

// Home button (after scrape)
$(document).on("click", "#home-btn", function() {
    console.log("clicked");
});
// $(document).ready(function() {
//     $("#home-btn").click(function() {
//         console.log("clicked");
//     });
// });
// $("#home-btn").click(function() {
//     console.log("clicked");
// });

// Whenever someone clicks on div.individual-article
$(document).on("click", ".individual-article", function() {
    // console.log("clicked");
    // Empty the notes from the notes section
    $("#notes").empty();
    // Save the id from 
    var thisId = $(this).children("div").attr("data-id");
    console.log(thisId);

    // Now we make an AJAX call for the Article 
    $.ajax({
        method : "GET",
        url : "/articles/" + thisId
    })
        // Add the note information to the page
        .then(function(data) {
            // console.log(data);
            $("#notes")
                .append(`<h2> ${ data.title } </h2>`)
                .append(`<input id='title-input' name='title' >`)
                .append(`<textarea id='body-input' name='body' >`)
                .append(`<button data-id='${ data._id } ' id='save-note'>Save Note</button>`)
                .append(`<button data-id='${ data._id } ' id='update-note'>Update Note</button>`)
                .append(`<button data-id='${ data._id } ' id='delete-note'>Delete Note</button>`);
            
            // If there is a note in the article
            if (data.note) {
                // console.log(data.note.title);
                // console.log(data.note.body);
                $("#title-input").val(data.note.title);
                $("#body-input").val(data.note.body);
            }
        });
});

// When "Save Note" is clicked
$(document).on("click", "#save-note", function() {
    var thisId = $(this).attr("data-id");

    console.log(thisId);

    // Run a POST request to change the note, using user input
    $.ajax({
        method : "POST",
        url : "/articles/" + thisId,
        data : {
            title : $("#title-input").val(),
            body : $("#body-input").val()
        }
    })
    .then(function(data) {
        console.log(data);
        alert("Note Saved");
        $("#notes").empty();
    });

    $("#title-input").val("");
    $("#body-input").val("");
});

// When "Update Note" is clicked
$(document).on("click", "#update-note", function() {
    var thisId = $(this).attr("data-id");
    
    console.log(thisId);

    // Run a UPDATE request to change the note, using user input (updated note is being transferred to BE and to DB correctly, but not returned to front end correctly--note can't be seen)
    $.ajax({
        method : "PUT",
        url : "/articles/" + thisId,
        data : {
            title : $("#title-input").val(),
            body : $("#body-input").val()
        }
    })
    .then(function(data) {
        // console.log("ajax id" + thisId);
        console.log(data);
        alert("Note Updated");
        $("#notes").empty();
    });

    $("#title-input").val("");
    $("#body-input").val("");
});

// When "Delete Note" is clicked
$(document).on("click", "#delete-note", function() {
    var thisId = $(this).attr("data-id");
    
    console.log(thisId);

    // Run a DELETE request to change the note, using user input
    $.ajax({
        method : "DELETE",
        url : "/articles/" + thisId,
        data : {
            title : $("#title-input").val(),
            body : $("#body-input").val()
        }
    })
    .then(function(data) {
        console.log(data);
        alert("Note Deleted");
        $("#notes").empty();
    });

    $("#title-input").val("");
    $("#body-input").val("");
});