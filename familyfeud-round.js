var ifr;
var sum;
var strikeCount;
var data;

$(document).ready(function(){
  $.getJSON("questions/data.json",{}, function( input ){ 
    /*  # do stuff here  */ 
    data=input;
    buildHTML();
  });
  ifr = document.getElementById('sound');
  sum = 0;
  strikeCount = 0;
  
  setUpAnswers();
  setUpBuzzers();
});

function playBell() {
  ifr.src = 'ff-clang.wav';
}

function playBuzzer() {
  ifr.src = 'buzzer.mp3';
}

function setUpAnswers() {
  $('#rotating-answers').find('.active').on('click', 
      function() {
        var answer = $(this).find('.answer');
        if (!answer.hasClass('flipped')) {
          answer.addClass('flipped');
          playBell();
          sumScores($(this).data("score"));
        }
      });
}

function setUpBuzzers() {
  $('#strike').on('click', 
      function() {
        if (strikeCount < 3){  
          strikeCount++;
          $('#strike-count').text(strikeCount);
          var strike = $('<span class="wrongx">X</span>')
          var wrong = $('#wrong');
          wrong.append(strike);
          playBuzzer();
          wrong.fadeIn('fast');
          setTimeout(function() {wrong.fadeOut('fast');}, 1500);
        }
      });
}

function sumScores(score) {
  sum += score
  $('#score').text(sum);
}