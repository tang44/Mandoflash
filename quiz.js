// =====================================================
// QUIZ.JS
// Quiz Engine
// =====================================================


// =====================================================
// QUIZ SETTINGS
// =====================================================

let quizDirection = "chineseToEnglish";
let quizLength = 10;


// =====================================================
// QUIZ STATE
// =====================================================

let quizQuestions = [];

let quizIndex = 0;

let totalQuestions = 0;

let currentQuestion = 1;

let score = 0;

let answered = 0;


// =====================================================
// DOM REFERENCES
// =====================================================

const question =
    document.getElementById("question");

const answers =
    document.getElementById("answers");

const nextQuestion =
    document.getElementById("nextQuestion");

const scoreDisplay =
    document.getElementById("scoreDisplay");

const questionCounter =
    document.getElementById("questionCounter");

const quizDirectionSelect =
    document.getElementById("quizDirection");

const quizLengthSelect =
    document.getElementById("quizLength");

const resetQuizButton =
    document.getElementById("resetQuiz");


// =====================================================
// START QUIZ
// =====================================================

function startQuiz(){

    if(filtered.length===0){

        question.innerHTML=
            "<h2>No cards available.</h2>";

        answers.innerHTML="";

        return;

    }


    quizIndex=0;

    currentQuestion=1;

    score=0;

    answered=0;


    const amount =
        quizLength==="all"
            ? filtered.length
            : Number(quizLength);


    quizQuestions =
        shuffle(filtered)
        .slice(0,amount);


    totalQuestions =
        quizQuestions.length;


    scoreDisplay.textContent =
        "Score: 0/0";


    questionCounter.textContent =
        `Question 1 of ${totalQuestions}`;


    nextQuestion.classList.add("hidden");


    showQuiz();

}


// =====================================================
// CURRENT CARD
// =====================================================

function currentQuizCard(){

    return quizQuestions[quizIndex];

}


// =====================================================
// UPDATE STATUS PANEL
// =====================================================

function updateQuizStatus(){

    questionCounter.textContent =

        `Question ${currentQuestion} of ${totalQuestions}`;


    scoreDisplay.textContent =

        `Score: ${score}/${answered}`;

}


// =====================================================
// NEXT QUESTION
// =====================================================

function nextQuizQuestion(){

    quizIndex++;

    currentQuestion++;


    if(quizIndex>=quizQuestions.length){

        showFinalScore();

        return;

    }


    showQuiz();

}


// =====================================================
// RESET QUIZ
// =====================================================

function resetQuiz(){

    startQuiz();

}


// =====================================================
// SETTINGS EVENTS
// =====================================================

quizDirectionSelect.onchange=function(){

    quizDirection=this.value;

    startQuiz();

};


quizLengthSelect.onchange=function(){

    quizLength=this.value;

    startQuiz();

};


resetQuizButton.onclick=resetQuiz;


// =====================================================
// NEXT BUTTON
// =====================================================

nextQuestion.onclick=function(){

    nextQuizQuestion();

};

// =====================================================
// SHOW CURRENT QUIZ QUESTION
// =====================================================

function showQuiz(){


    const card =
        currentQuizCard();


    if(!card){

        showFinalScore();

        return;

    }


    updateQuizStatus();


    nextQuestion.classList.add("hidden");


    const correct =
        getAnswer(
            card,
            quizDirection
        );


    const prompt =
        getPrompt(
            card,
            quizDirection
        );



    // ==========================
    // DISPLAY QUESTION
    // ==========================


    question.innerHTML = `

        <div class="quizPrompt">

            ${prompt}

        </div>

    `;



    // ==========================
    // CREATE ANSWERS
    // ==========================


    const options =
        generateOptions(
            card,
            quizDirection
        );



    answers.innerHTML="";



    options.forEach(option=>{


        const button =
            document.createElement("button");


        button.className="answer";


        button.textContent =
            option.text;



        // store card data

        button.dataset.chinese =
            option.card.Chinese;


        button.dataset.pinyin =
            option.card.Pinyin;



        button.onclick=function(){


            checkAnswer(
                button,
                option.text,
                correct
            );


        };


        answers.appendChild(button);


    });


}



// =====================================================
// CHECK ANSWER
// =====================================================

function checkAnswer(
    selectedButton,
    choice,
    correct
){



    // prevent double clicking

    if(!nextQuestion.classList.contains("hidden")){

        return;

    }



    answered++;



    if(choice===correct){

        score++;

    }



    updateQuizStatus();



    const buttons =
        answers.querySelectorAll(
            "button"
        );



    buttons.forEach(button=>{


        button.disabled=true;



        // correct answer

        if(button.textContent===correct){


            button.classList.add(
                "correct"
            );


            button.innerHTML=`

                <strong>

                    ${button.textContent}

                </strong>


                <br>


                ${button.dataset.chinese}

                ${button.dataset.pinyin}

            `;


        }



        // wrong selected answer

        if(
            button===selectedButton
            &&
            choice!==correct
        ){


            button.classList.add(
                "wrong"
            );


        }


    });



    nextQuestion.classList.remove(
        "hidden"
    );


}

// =====================================================
// FINAL SCORE SCREEN
// =====================================================

function showFinalScore(){


    questionCounter.classList.add(
        "hidden"
    );


    nextQuestion.classList.add(
        "hidden"
    );



    const percent =
        Math.round(
            (score / totalQuestions) * 100
        );



    scoreDisplay.textContent =
        `Final Score: ${score}/${totalQuestions}`;



    question.innerHTML = `


        <div class="quizFinished">


            <h2>

                Quiz Complete!

            </h2>



            <h1>

                ${score} / ${totalQuestions}

            </h1>



            <p>

                ${percent}%

            </p>



        </div>


    `;



    answers.innerHTML="";



}



// =====================================================
// CLEAR QUIZ
// Used when leaving Quiz Mode
// =====================================================

function clearQuiz(){


    quizQuestions=[];


    quizIndex=0;


    currentQuestion=1;


    score=0;


    answered=0;



    question.innerHTML="";


    answers.innerHTML="";


    scoreDisplay.textContent =
        "Score: 0/0";


    questionCounter.textContent="";


}



// =====================================================
// MAKE QUIZ AVAILABLE TO APP.JS
// =====================================================

window.startQuiz = startQuiz;

window.clearQuiz = clearQuiz;