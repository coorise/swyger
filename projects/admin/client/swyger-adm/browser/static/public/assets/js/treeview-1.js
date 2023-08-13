//visit :https://codepen.io/bisserof/pen/nrMveb
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function setFontSize(el) {
  var fontSize = el.val();

  if ( isNumber(fontSize) && fontSize >= 0.5 ) {
    $('.dataSize').css({ 'font-size': fontSize + 'em' });
  } else if ( fontSize ) {
    el.val('1');
    $('.dataSize').css({ 'font-size': '1em' });
  }
}

$(document).on('input', '#fontSize', function() {
  setFontSize($(this));
  $('#fontSize')
    .bind('keyup', function(e){
      if (e.keyCode == 27) {
        $(this).val('1');
        $('.dataSize').css({ 'font-size': '1em' });

      } else {
        setFontSize($(this));
      }
    });

});


$(window)
  .bind('keyup', function(e){
    if (e.keyCode == 27) {
      $('#fontSize').val('1');
      $('.dataSize').css({ 'font-size': '1em' });
    }
  });
