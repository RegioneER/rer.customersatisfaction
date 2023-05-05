require(['jquery'], function($) {
  'use strict';
  $(document).ready(function(){
    function addErrorMessage(err) {
      const resp = err.responseJSON;
      if (!resp) {
        return;
      }
      $('#customer-satisfaction').prepend(
        '<div class="customer-satisfaction-message portalMessage error" role="alert"><strong>' +
          resp.message +
          '</strong><button class="plone-btn plone-btn-link delete-message" title="Elimina messaggio">&times;</button></div>',
      );
    }

    function doSuccessCleanup() {
      $('#customer-satisfaction').prepend(
        '<div class="customer-satisfaction-message portalMessage info" role="alert"><strong>Grazie per il tuo feedbak</strong><button class="plone-btn plone-btn-link delete-message" title="Elimina messaggio">&times;</button></div>',
      );
      $('#customer-satisfaction form').remove();
    }

    function cleanMessage() {
      $('.customer-satisfaction-message').remove();
    }

    function cleanVotes() {
      $('#customer-satisfaction form label').each(function() {
        $(this).removeClass('active');
        $(this)
          .find('input[type="radio"]')
          .prop('checked', false);
      });
    }

    function setVoteActive(label) {
      label.addClass('active');
      label.find('input[type="radio"]').prop('checked', true);
      label.find('input[type="radio"]').select();
    }

    function expandCollapse(expand) {
      var $collapse = $('#cs-collapsible-form-area');
      if (expand) {
        $collapse.css('display', 'block');
        setTimeout(() => {
          $collapse.attr('aria-expanded', true);
          $collapse.attr('aria-hidden', false);
        }, 10);
      } else {
        $collapse.attr('aria-expanded', false);
        $collapse.attr('aria-hidden', true);
        setTimeout(() => {
          $collapse.css('display', 'none');
        }, 100);
      }
    }

    $('#customer-satisfaction form').on('submit', function(event) {
      var form = $(this);
      event.preventDefault();
      cleanMessage();
      var data = {};
      form
        .find(':input')
        .serializeArray()
        .forEach(function(param) {
          data[param.name] = param.value;
        });
      $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: form.attr('action'),
        data: JSON.stringify(data),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        processData: false,
        success: function() {
          form.trigger('reset');
          doSuccessCleanup();
        },
        error: function(err) {
          addErrorMessage(err);
        },
      });
    });

    $('#customer-satisfaction').on(
      'click',
      '.customer-satisfaction-message button.delete-message',
      function() {
        cleanMessage();
      },
    );

  
    $('#customer-satisfaction form input[type="radio"]').on('click', function(
      event,
      ) {
      console.log("cliccato")
      var currentLabel = $(event.target).closest('label');
      if (currentLabel && !currentLabel.hasClass('active')) {
        cleanVotes();
        setVoteActive(currentLabel);
        expandCollapse(true);
      } else {
        cleanVotes();
        expandCollapse(false);
      }
    });
  })

});
