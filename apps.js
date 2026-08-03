// =====================================================
// GLOBAL STATE
// =====================================================

let cards = [];
let filtered = [];

let current = 0;

let mode = "flash";


// =====================================================
// QUIZ STATE
// =====================================================

let quizDirection = "chineseToEnglish";
let quizLength = 10;

let quizIndex = 0;
let quizQuestions = [];

let currentQuestion = 0;
let totalQuestions = 0;

let score = 0;
let answered = 0;


// =====================================================
// FLASHCARD STATE
// =====================================================

let showingFront = true;


// =====================================================
// DOM REFERENCES
// =====================================================

const quizControls =
    document.getElementById("quizControls");

const front =
    document.getElementById("front");

const back =
    document.getElementById("back");

const flashButtons =
    document.getElementById("flashButtons");

const quiz =
    document.getElementById("quiz");

const question =
    document.getElementById("question");

const answers =
    document.getElementById("answers");

const nextQuestion =
    document.getElementById("nextQuestion");

const quizDirectionSelect =
    document.getElementById("quizDirection");

const quizLengthSelect =
    document.getElementById("quizLength");

const resetQuizButton =
    document.getElementById("resetQuiz");

const questionCounter =
    document.getElementById("questionCounter");

const scoreDisplay =
    document.getElementById("scoreDisplay");


// =====================================================
// START APP
// =====================================================

window.onload = loadCSV;


// =====================================================
// LOAD CSV DATA
// =====================================================

async function loadCSV(){

    try{

        const response =
            await fetch("hsk1to3_cards.csv");

        const text =
            await response.text();


        cards = csvToObjects(text);


        populateFilters();

        filterCards();

    }

    catch(error){

        console.error(error);

        front.textContent =
            "Unable to load cards";

    }

}

// =====================================================
// CSV CONVERSION
// =====================================================

function csvToObjects(text){

    const rows = parseCSV(text);

    const headers = rows[0];


    return rows.slice(1).map(row=>{

        let obj = {};


        headers.forEach((h,i)=>{

            obj[h.trim()] =
                row[i]?.trim() || "";

        });


        return obj;

    });

}



// =====================================================
// CSV PARSER
// Handles commas inside quoted fields
// =====================================================

function parseCSV(text){

    let rows = [];

    let row = [];

    let value = "";

    let quote = false;



    for(let char of text){


        if(char === '"'){

            quote = !quote;

        }

        else if(char === "," && !quote){

            row.push(value);

            value = "";

        }

        else if(char === "\n" && !quote){

            row.push(value);

            rows.push(row);

            row = [];

            value = "";

        }

        else{

            value += char;

        }

    }



    if(value){

        row.push(value);

        rows.push(row);

    }



    return rows;

}



// =====================================================
// CREATE FILTER OPTIONS
// =====================================================

function populateFilters(){

    let levels =
        [...new Set(cards.map(c=>c.Level))];


    let pos =
        [...new Set(cards.map(c=>c["First PoS"]))];


    let level =
        document.getElementById("levelFilter");


    let speech =
        document.getElementById("posFilter");



    levels.forEach(x=>{

        level.innerHTML +=
            `<option>${x}</option>`;

    });



    pos.forEach(x=>{

        speech.innerHTML +=
            `<option>${x}</option>`;

    });

}



// =====================================================
// FILTER + SORT CARDS
// =====================================================

function filterCards(){

    let search =
        document
        .getElementById("search")
        .value
        .toLowerCase();


    let level =
        document
        .getElementById("levelFilter")
        .value;


    let pos =
        document
        .getElementById("posFilter")
        .value;



    filtered =
        cards.filter(card=>{


            let text =
                Object.values(card)
                .join(" ")
                .toLowerCase();



            return text.includes(search)

            && (!level ||
                card.Level === level)

            && (!pos ||
                card["Part of Speech"] === pos);

        });



    let sort =
        document
        .getElementById("sort")
        .value;



    if(sort==="number")

        filtered.sort((a,b)=>
            a["#"] - b["#"]);



    if(sort==="chinese")

        filtered.sort((a,b)=>
            a.Chinese.localeCompare(b.Chinese));



    if(sort==="pinyin")

        filtered.sort((a,b)=>
            a.Pinyin.localeCompare(b.Pinyin));



    if(sort==="english")

        filtered.sort((a,b)=>
            a.English.localeCompare(b.English));



    if(sort==="random")

        filtered.sort(() =>
            Math.random()-0.5);



    current = 0;


// Update database counter

const cardCount =
    document.getElementById("cardCount");


if(cardCount){

    cardCount.textContent =
        `(${filtered.length} cards)`;

}


show();


    show();

}

// =====================================================
// UPDATE DISPLAY BASED ON CURRENT MODE
// =====================================================

function updateModeUI(){

    const card =
        document.getElementById("card");


    if(mode === "flash"){

        // Flashcard controls
        flashButtons.classList.remove("hidden");


        // Show flashcard
        card.classList.remove("hidden");


        // Hide quiz
        quiz.classList.add("hidden");


        // Hide quiz settings
        quizControls.classList.add("hidden");


    }

    else{

        // Hide flashcard controls
        flashButtons.classList.add("hidden");


        // Hide flashcard
        card.classList.add("hidden");


        // Show quiz
        quiz.classList.remove("hidden");


        // Show quiz settings
        quizControls.classList.remove("hidden");

    }

}



// =====================================================
// MAIN DISPLAY CONTROLLER
// Decides what content to show
// =====================================================

function show(){

    updateModeUI();


    if(mode === "flash"){

        showFlashcard();

    }

    else{

        showQuiz();

    }

}



// =====================================================
// FLASHCARD DISPLAY
// Shows Chinese front and information back
// =====================================================

function showFlashcard(){


    if(filtered.length === 0){

        front.textContent = "No cards";

        back.innerHTML = "";

        return;

    }



    const c = filtered[current];



    // Front side

    front.textContent =
        c.Chinese;



    // Back side

    back.innerHTML = `

        <div class="card-title">

            ${c.Chinese} ${c.Pinyin}

        </div>


        <hr>


        <div class="card-section">

            <h3>English</h3>

            <div class="card-box english">

                ${c.English}

            </div>

        </div>



        <div class="card-section">

            <h3>Other Information</h3>


            <div class="card-box info">


                <p>
                    <strong>Part of Speech:</strong>
                    ${c["Part of Speech"]}
                </p>


                <p>
                    <strong>HSK Level(s):</strong>
                    ${c.Levels}
                </p>


            </div>


        </div>

    `;



    // Reset card to front

    showingFront = true;


    front.classList.remove("hidden");

    back.classList.add("hidden");



    // Flashcard counter

    document
        .getElementById("counter")
        .textContent =
        `${current + 1} / ${filtered.length}`;

}

// =====================================================
// START QUIZ
// Creates a randomized question set
// =====================================================

function startQuiz(){

    mode = "quiz";

    updateModeUI();


    // Reset quiz progress

    quizIndex = 0;

    currentQuestion = 1;

    score = 0;

    answered = 0;



    // Determine quiz size

    let amount =
        quizLength === "all"
        ? filtered.length
        : Number(quizLength);



    // Create randomized quiz list

    quizQuestions =
        [...filtered]
        .sort(() => Math.random() - 0.5)
        .slice(0, amount);



    totalQuestions =
        quizQuestions.length;



    // Reset display

    scoreDisplay.textContent =
        "Score: 0/0";


    nextQuestion.classList.add("hidden");



    showQuiz();

}



// =====================================================
// SHOW CURRENT QUIZ QUESTION
// Creates question + answers
// =====================================================

function showQuiz(){


    if(quizQuestions.length === 0){

        startQuiz();

        return;

    }



    // Update counter

    questionCounter.classList.remove("hidden");


    questionCounter.textContent =
        `Question ${currentQuestion} of ${totalQuestions}`;



    // Update score

    scoreDisplay.textContent =
        `Score: ${score}/${answered}`;



    // Hide next until answered

    nextQuestion.classList.add("hidden");



    const c =
        quizQuestions[quizIndex];



    let prompt;

    let correct;



    // Select quiz direction

    if(quizDirection === "chineseToEnglish"){


        prompt = c.Chinese;

        correct = c.English;


    }

    else{


        prompt = c.English;

        correct = c.Chinese;


    }



    // Display question

    question.innerHTML = `

        <div class="quizPrompt">

            ${prompt}

        </div>

    `;



    // Create answer choices

    // Store answer text + source card
let options = [
    {
        text: correct,
        card: c
    }
];


while(options.length < 4){

    let randomCard =
        filtered[
            Math.floor(
                Math.random()*filtered.length
            )
        ];


    let answer =
        quizDirection==="chineseToEnglish"
        ? randomCard.English
        : randomCard.Chinese;


    if(!options.some(o => o.text === answer)){

        options.push({
            text: answer,
            card: randomCard
        });

    }

}

    



    // Shuffle answers

    options.sort(() =>
        Math.random() - 0.5);



    answers.innerHTML = "";



    // Create buttons

options.sort(() =>
    Math.random()-0.5
);


options.forEach(option=>{


    let button =
        document.createElement("button");


    button.className="answer";


    button.textContent = option.text;


    button.dataset.chinese =
        option.card.Chinese;


    button.dataset.pinyin =
        option.card.Pinyin;


    button.onclick=()=>{


        checkAnswer(
            option.text,
            correct
        );


    };


    answers.appendChild(button);


});


}

// =====================================================
// CHECK ANSWER
// Locks buttons, updates score, shows result
// =====================================================

function checkAnswer(choice, correct){


    // Prevent clicking multiple times

    if(!nextQuestion.classList.contains("hidden")){

        return;

    }



    answered++;



    if(choice === correct){

        score++;

    }



    // Update score display

    scoreDisplay.textContent =
        `Score: ${score}/${answered}`;



    // Disable all answers

    answers
    .querySelectorAll("button")
    .forEach(button=>{


        button.disabled = true;



        // Highlight correct answer

        if(button.textContent===correct){

            button.classList.add("correct");


            button.innerHTML = `

                <strong>
                    ${button.textContent}
                </strong>

                <br>

                ${button.dataset.chinese}  ${button.dataset.pinyin}
                </small>

    `;

}



        // Highlight selected wrong answer

        if(
            button.textContent === choice &&
            choice !== correct
        ){

            button.classList.add("wrong");

        }


    });



    // Allow moving forward

    nextQuestion.classList.remove("hidden");


}



// =====================================================
// NEXT QUESTION BUTTON
// Moves to next quiz item
// =====================================================

nextQuestion.onclick = function(){


    quizIndex++;

    currentQuestion++;



    if(quizIndex >= quizQuestions.length){


        showFinalScore();


        return;

    }



    showQuiz();


};



// =====================================================
// FINAL SCORE SCREEN
// Shows completed quiz result
// =====================================================

function showFinalScore(){


    questionCounter.classList.add("hidden");


    nextQuestion.classList.add("hidden");



    scoreDisplay.textContent =
        `Final Score: ${score}/${quizQuestions.length}`;



    let percent =
        Math.round(
            (score / quizQuestions.length) * 100
        );



    question.innerHTML = `

        <div class="quizFinished">


            <h2>
                Quiz Complete!
            </h2>


            <h1>
                ${score} / ${quizQuestions.length}
            </h1>


            <p>
                ${percent}%
            </p>


        </div>

    `;



    answers.innerHTML = "";


}

// =====================================================
// FLIP FLASHCARD
// =====================================================

function flip(){

    showingFront = !showingFront;


    front.classList.toggle("hidden");

    back.classList.toggle("hidden");

}



// =====================================================
// RESET QUIZ BUTTON
// =====================================================

resetQuizButton.onclick = function(){

    startQuiz();

};



// =====================================================
// QUIZ DIRECTION CHANGE
// =====================================================

quizDirectionSelect.onchange = function(){

    quizDirection = this.value;

    startQuiz();

};



// =====================================================
// QUIZ LENGTH CHANGE
// =====================================================

quizLengthSelect.onchange = function(){

    quizLength = this.value;

    startQuiz();

};



// =====================================================
// FLASHCARD BUTTONS
// =====================================================

// Flip

document
.getElementById("card")
.onclick = flip;


document
.getElementById("flip")
.onclick = flip;



// Next flashcard

document
.getElementById("next")
.onclick = function(){


    current++;


    if(current >= filtered.length){

        current = 0;

    }


    show();

};



// Previous flashcard

document
.getElementById("prev")
.onclick = function(){


    current--;


    if(current < 0){

        current = filtered.length - 1;

    }


    show();

};



// Random flashcard

document
.getElementById("random")
.onclick = function(){


    current =
        Math.floor(
            Math.random() *
            filtered.length
        );


    show();

};



// =====================================================
// MODE SWITCH
// Flashcards <-> Quiz
// =====================================================

document
.getElementById("mode")
.onchange = function(){


    mode = this.value;



    if(mode === "quiz"){


        startQuiz();


    }

    else{


        // Clear quiz content

        quizQuestions = [];

        question.innerHTML = "";

        answers.innerHTML = "";


        show();


    }


};



// =====================================================
// FILTER EVENTS
// =====================================================

document
.getElementById("search")
.oninput = filterCards;


document
.getElementById("levelFilter")
.onchange = filterCards;


document
.getElementById("posFilter")
.onchange = filterCards;


document
.getElementById("sort")
.onchange = filterCards;

// =====================================================
// chatgpt assistance: https://chatgpt.com/s/t_6a709ba06ac48191b5a41a7a521e7015
// =====================================================
