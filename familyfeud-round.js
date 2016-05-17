var ifr;
var score0 = 0;
var score1 = 0;
var strikeCount;
var data;
var questions = [];
var answers = [];
var curq = 0;
var curteam = -1; // track which team is answering questions
var round = -1;
var attempt = 0;

// Rules:
// Question comes up
// A team buzzes in -- they have one chance to get something on the board
// this is round 0
// if they dont (one strike), it goes to the other team immediately
// if they get something, they have 3 strikes to get the rest
// this is round 1
// If they don't get everything, it goes to the other team, they have 3 
// strikes to get whatever remains
// next question...

var round_strikes = [1, 3];

function keycall(e) {
  if ((e.which || e.keyCode) == 116) {
    e.preventDefault(); alert('Blocking refresh...');
  }
  if ((e.which || e.keyCode) == 33) {
    buzzIn(0);
  }
  if ((e.which || e.keyCode) == 34) {
    buzzIn(1);
  }
}

function buzzIn(team) {
  if (curteam < 0) {
    playBuzzer(2);
    curteam = team;
    round = 0;
    attempt = 0;
    changeTeamGUI(curteam);
    setRoundInd();
  }
}

function changeTeam() {
  flip = [1,0];
  curteam = flip[curteam];
  if (attempt==1) {
    round++;
    attempt = 0;
  } else {
    attempt++;
  }
  if (round==2) {
    curteam = -1;
  }
  resetStrikes();
  changeTeamGUI(curteam);
  setRoundInd();
}

function changeTeamGUI(team) {
  if (curteam == 0) {
    $('#arrow_container').empty().prepend('<img id="leftarrow" src="arrow.png" />')
    document.getElementById("team0").style.border="10px solid white";
    document.getElementById("team1").style.border="10px solid transparent";
    $('#arrow_container').fadeIn('slow')
    setTimeout(function() {$('#arrow_container').fadeOut('slow');}, 1500);
  } else if (curteam == 1) {
      $('#arrow_container').empty().prepend('<img id="rightarrow" src="arrow.png" />')
      document.getElementById("team0").style.border="10px solid transparent";
      document.getElementById("team1").style.border="10px solid white";
      $('#arrow_container').fadeIn('fast')
      setTimeout(function() {$('#arrow_container').fadeOut('fast');}, 1500);
  } else {
      document.getElementById("team0").style.border="10px solid transparent";
      document.getElementById("team1").style.border="10px solid transparent";
  }
}

function setRoundInd() {
  if (round==-1) {
    $("#roundind").text("Buzz when you have an answer in mind!");
  } else if (round==0) {
    $("#roundind").text("One chance to take control!");
  } else if (round==1) {
    $("#roundind").text("Three chances to earn points!");
  } else if (round==2) {
    $("#roundind").text("No more points this round! Next Question!!");
  }
}

$(document).ready(function(){
  setTimeout(initialize,0);
  //initialize();
});

function initialize() {
  $(document).on("keydown", keycall);
  $.getJSON("https://raw.githubusercontent.com/dbirman/familyfreud/master/questions/data.json",{}, function( input ){ 
    /*  # do stuff here  */ 
    data=input;
    reformat();
  });
  pauseForQuestions();
  ifr = document.getElementById('sound');
}

function pauseForQuestions() {
  while (questions.length==0) {
    console.log('recalling');
    setTimeout(pauseForQuestions,1);
    return
  }
  nextQuestion();
}

function nextQuestion() {
  if (curq>=1) {
    document.getElementById("wrapper_"+(curq-1)).style.display="none";
  }
  round = -1;
  curteam = -1;
  resetStrikes();
  addQuestionData(curq);
  setUpFlippers();
  setRoundInd();
  curq+=1;
  changeTeamGUI(curteam);
}

function resetStrikes() {
  strikeCount = 0;
  $('#strike-count').text(strikeCount);
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
        if (round>=0) {
          var answer = $(this).find('.answer');
          if (!answer.hasClass('flipped')) {
            answer.addClass('flipped');
            if (strikeCount<round_strikes[round] && round < 2) {
              playBell();
              sumScores($(this).data("score"));
              if (round==0) {
                round++;
                attempt = 0;
                setRoundInd();
              }
            }
          }
        }
      });
}

function strike() {
  if (curteam>=0 && round < 2) {
    if (strikeCount < 3){  
      strikeCount++;
      if (strikeCount==round_strikes[round]) {
        setTimeout(changeTeam,1500);
      }
      $('#strike-count').text(strikeCount);
      var wrong = $('#wrong');
      wrong.empty();
      for (var i=0;i<strikeCount;i++) {
        var strike = $('<span class="wrongx">X</span>')
        wrong.append(strike);
      }
      wrong.fadeIn('fast');
      setTimeout(playBuzzer(1),100);
      setTimeout(function() {wrong.fadeOut('fast');}, 1500);
    }
  }
}

function sumScores(score) {
  if (curteam==0) {
    score0 += score;
  }
  else if (curteam==1) {
    score1 += score;
  }
  $('#score0').text(score0);
  $('#score1').text(score1);
}

function addQuestionData(curq) {

  $("#question").text(questions[curq]);
  if (curq >= questions.length) {
    $("#question").text("Final Scores!!");
    return;
  }
  //now shit gets really complicated, we have to add to the "rotating-answers"
  //div a new wrapper with all the questions & answers... oh boy
  //we'll do this by adding the front of each tag in one array
  var frontstrs = [];
  //and the back of the tags in this other array
  var backstrs = []; 
  //then we'll combine the arrays into one huge string, but in reverse
  var f1 = "<div class=\"wrapper\" id=\"wrapper_"+curq+"\">";
  var e1 = ("</div>");
  var canswers = answers[curq];
  var at = [];
  for (var ai=0; ai<canswers.length; ai++) {
    var answer = canswers[ai];
    var l1 = "<section class=\"container active\" id=\"answer"+ai+"\" data-score=\""+answer.n+"\">";
    var l2 = "<div class=\"answer\">";
    var l3 = "<figure class=\"front\"><span>"+(ai+1)+"</span></figure>";
    var l4 = "<figure class=\"back\">"+answer.a+"<span class=\"score\">"+answer.n+"</span></figure>";
    var l5 = "</div>";
    var l6 = "</section>";
    at.push(l1+l2+l3+l4+l5+l6);
  }
  var max_answers = 10;
  while (ai<max_answers) {
    var l1 = "<section class=\"container\">";
    var l2 = "<div class=\"inactive\"></div>";
    var l3 = "</section>";
    at.push(l1+l2+l3);
    ai+=1;
  }
  var cell1 = "<div class=\"cell\">";
  var celle = "</div>";

  divstringform=f1+cell1+at[0]+at[1]+at[2]+at[3]+at[4]+celle+cell1+at[5]+at[6]+at[7]+at[8]+at[9]+celle+e1;
  $("#rotating-answers").append(divstringform);
}


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