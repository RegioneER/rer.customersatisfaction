require([
    'jquery',
  ], function($, otherLibrary) {
    'use strict';

    const add_error_message = (err) => {
        const resp = err.responseJSON;
        if (!resp) {
            return;
        }
        $( "#customer-satisfaction" ).prepend('<div class="customer-satisfaction-message portalMessage error"><strong>' + resp.message + '</strong></div>')
    }
    const add_success_message = () => {
        $( "#customer-satisfaction" ).prepend('<div class="customer-satisfaction-message portalMessage info"><strong>Grazie per il tuo feedbak</strong></div>')
    }
    const clean_message = () => {
        $( ".customer-satisfaction-message" ).remove();

    }

    $("#customer-satisfaction form").on( "submit", function( event ) {
        const form = $(this);
        event.preventDefault();
        clean_message();
        let data={};
        form.serializeArray().forEach(param => data[param.name] = param.value);
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: form.attr('action'),
            data: JSON.stringify(data),
            headers:{'Accept': 'application/json', 'Content-Type': 'application/json'},
            processData: false,
            success: function(msg) {
                form.trigger("reset");
                add_success_message();
            },
            error: function(err) {
                add_error_message(err);
            }
        });
    });
  });
