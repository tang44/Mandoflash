// =====================================================
// APP.JS
// Flashcards + Application UI
// =====================================================


// =====================================================
// APP STATE
// =====================================================

let mode = "flash";
let showingFront = true;


// =====================================================
// DOM REFERENCES
// =====================================================

const card =
    document.getElementById("card");

const front =
    document.getElementById("front");

const back =
    document.getElementById("back");

const flashButtons =
    document.getElementById("flashButtons");

const quiz =
    document.getElementById("quiz");

const quizControls =
    document.getElementById("quizControls");

const gameBoard =
    document.getElementById("gameArea");

const gamePanel =
    document.getElementById("gameControls");

const counter =
    document.getElementById("counter");


// =====================================================
// INITIALIZE
// =====================================================

window.addEventListener("load", () => {

    updateModeUI();

});


// =====================================================
// MODE UI
// =====================================================

function updateModeUI(){

    // Hide everything

    card.classList.add("hidden");

    flashButtons.classList.add("hidden");

    quiz.classList.add("hidden");

    quizControls.classList.add("hidden");

    gameBoard.classList.add("hidden");

    gamePanel.classList.add("hidden");


    switch(mode){

        case "flash":

            card.classList.remove("hidden");

            flashButtons.classList.remove("hidden");

            showFlashcard();

            break;


        case "quiz":

            quiz.classList.remove("hidden");

            quizControls.classList.remove("hidden");

            startQuiz();

            break;


        case "games":

            gameBoard.classList.remove("hidden");

            gamePanel.classList.remove("hidden");

            break;

    }

}


// =====================================================
// FLASHCARD DISPLAY
// =====================================================

function showFlashcard(){

    if(filtered.length===0){

        front.textContent="No cards";

        back.innerHTML="";

        counter.textContent="0 / 0";

        return;

    }


    const c = filtered[current];


    front.textContent =
        c.Chinese;


    back.innerHTML = `

        <div class="card-title">

            ${c.Chinese}

            ${c.Pinyin}

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


    showingFront=true;

    front.classList.remove("hidden");

    back.classList.add("hidden");


    counter.textContent =
        `${current+1} / ${filtered.length}`;

}


// =====================================================
// FLIP CARD
// =====================================================

function flipCard(){

    showingFront=!showingFront;

    front.classList.toggle("hidden");

    back.classList.toggle("hidden");

}


// =====================================================
// NEXT CARD
// =====================================================

function nextCard(){

    if(filtered.length===0)
        return;

    current++;

    if(current>=filtered.length)
        current=0;

    showFlashcard();

}


// =====================================================
// PREVIOUS CARD
// =====================================================

function previousCard(){

    if(filtered.length===0)
        return;

    current--;

    if(current<0)
        current=filtered.length-1;

    showFlashcard();

}


// =====================================================
// RANDOM CARD
// =====================================================

function randomFlashcard(){

    if(filtered.length===0)
        return;

    current=
        Math.floor(
            Math.random()*filtered.length
        );

    showFlashcard();

}


// =====================================================
// MODE SELECTOR
// =====================================================

document
.getElementById("mode")
.addEventListener("change",function(){

    mode=this.value;

    updateModeUI();

});


// =====================================================
// FLASHCARD EVENTS
// =====================================================

card.onclick=flipCard;

document
.getElementById("flip")
.onclick=flipCard;


document
.getElementById("next")
.onclick=nextCard;


document
.getElementById("prev")
.onclick=previousCard;


document
.getElementById("random")
.onclick=randomFlashcard;
