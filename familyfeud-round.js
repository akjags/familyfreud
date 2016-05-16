var ifr;
var score0;
var score1;
var strikeCount;
var data;
var questions = [];
var answers = [];
var curq = 0;
var curteam = -1; // track which team is answering questions
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
  score0 = 0;
  score1 = 0;
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
  if (curq>=1) {
    document.getElementById("wrapper_"+(curq-1)).style.display="none";
  }
  round = 0;
  curteam = -1;
  addQuestionData(curq);
  setUpFlippers();
  setUpBuzzers();
  curq+=1;
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
          if (strikeCount<3) {
            playBell();
            sumScores($(this).data("score"));
          }
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
  if (round==0) {
    score0 += score;
  }
  else if (round==1) {
    score1 += score;
  }
  $('#score').text(score0);
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


//           <section class="container">
//             <div class="inactive"></div>
//           </section> 

// <div class="wrapper" id="wrapper_0">
//         <div class="cell">
//           <section class="container active" id="answer1" data-score="43">
//             <div class="answer">
//               <figure class="front"><span>1</span></figure>
//               <figure class="back">Answer one <span class="score">43</span></figure>
//             </div>
//           </section>

//           <section class="container active" id="answer2" data-score="31">
//             <div class="answer">
//               <figure class="front"><span>2</span></figure>
//               <figure class="back">Answer two <span class="score">31</span></figure>
//             </div>
//           </section>

//           <section class="container active" id="answer3" data-score="23">
//            <div class="answer">
//               <figure class="front"><span>3</span></figure>
//               <figure class="back">Answer three <span class="score">23</span></figure>
//             </div>
//           </section>

//           <section class="container active" id="answer4" data-score="3">
//            <div class="answer">
//               <figure class="front"><span>4</span></figure>
//               <figure class="back">Answer four <span class="score">3</span></figure>
//             </div>
//           </section>
      
//           <section class="container">
//             <div class="inactive"></div>
//           </section> 
//         </div>

//         <div class="cell">
//           <section class="container">
//             <div class="inactive"></div>
//           </section>
//           <section class="container">
//             <div class="inactive"></div>
//           </section>
//           <section class="container">
//             <div class="inactive"></div>
//           </section>
//           <section class="container">
//             <div class="inactive"></div>
//           </section>
//           <section class="container">
//             <div class="inactive"></div>
//           </section>                
//         </div>
//       </div>