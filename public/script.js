$(function(){
    let shorten_button = $('#shorten_button');
    let shorten_text = $('#shorten_text');
    shorten_button.click(function(){
        console.log('Button clicked.');
        $.post(
            '/shorten',
            {url : shorten_text.val()}, // this will be send to /shorten
            function(data){ //  response of post request
                console.log(data);
                window.prompt("Copy to clipboard: Ctrl+C, Enter", 'https://g-z.herokuapp.com/'+data.hash);
            }
        )
    })
});