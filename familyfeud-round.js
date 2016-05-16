var ifr;
var sum;
var strikeCount;
var data;
var questions = [];
var answers = [];
var answernum = [];
var curq = 0;
var curteam = 0; // track which team is answering questions
var round = 0; // 0 = first response team, 1 = second team trying
// 2 = both teams had too many strikes, don't assign points

window.onbeforeunload = function() {
  alert("Dude, are you sure you want to leave? Think of the kittens!");
}
function disableF5(e) {
  if ((e.which || e.keyCode) == 116) {
    e.preventDefault(); alert('Blocking refresh...');
  }
}

$(document).ready(function(){
  $(document).on("keydown", disableF5);
  $.getJSON("questions/data.json",{}, function( input ){ 
    /*  # do stuff here  */ 
    data=input;
    reformat();
  });
  ifr = document.getElementById('sound');
  sum = 0;
  strikeCount = 0;
  setTimeout(nextQuestion,1);
});

function reformat() {
  // Take the slightly poorly formatted data object and reformat it
  for (question in data) {
    questions.push(question);
    qdata = data[question];
    alist = [];
    for (answer in qdata) {
      if (qdata[answer]>1) {
        alist.push({a:answer,n:qdata[answer]});
      }
    }
    alist.sort(function(x,y) {return y.n-x.n;});
    answers.push(alist);
  }
}

function nextQuestion() {
  addQuestionData(curq);
  setUpFlippers();
  setUpBuzzers();
  curq+=1;
}

function addQuestionData(curq) {
  $("#question").text(questions[curq]);
}

function playBell() {
  ifr.src = 'ff-clang.mp3';
}

function playBuzzer(num) {
  ifr.src = 'buzzer'+num+'.mp3';
}

function setUpFlippers() {
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
          wrong.fadeIn('fast');
          setTimeout(playBuzzer(1),100);
          setTimeout(function() {wrong.fadeOut('fast');}, 1500);
        }
      });
}

function sumScores(score) {
  sum += score
  $('#score').text(sum);
}