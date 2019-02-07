$(function(){
    let shorten_button = $('#shorten_button');
    let shorten_text = $('#shorten_text');
    let copy_div = $('#copy_div');
    let copy_text = $('#copy_text');
    let copy_button = $('#copy_button');
    let copy_success_message = $('#copy_message');
    let text_to_be_copied = $('#shortentextlink');
    shorten_button.click(function(){   
        console.log('Button clicked.');
        $.post(
            '/shorten',
            {url : shorten_text.val()}, // this will be send to /shorten
            function(data){ //  response of post request
                copy_div.show(); // display clipboard and success message
                console.log(data.hash);
                copy_text.text('https://g-z.herokuapp.com/'+data.hash);
                text_to_be_copied.text('https://g-z.herokuapp.com/'+data.hash);
                //window.prompt("Copy to clipboard: Ctrl+C, Enter", 'https://g-z.herokuapp.com/'+data.hash);
            }
        )
    })

    copy_button.click(function(){
         // clipboard logic
        copy_success_message.show();
        text_to_be_copied.select();
        document.execCommand("copy");
        setTimeout(function(){
           copy_success_message.hide();
        },1500);
     })

});