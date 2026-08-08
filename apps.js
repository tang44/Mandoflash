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

            activeDeck = cards;

            current = 0;

            filterCards();

            card.classList.remove("hidden");
            flashButtons.classList.remove("hidden");

            break;

        case "reading":

            activeDeck = readingCards;

            current = 0;

            filterCards();

            card.classList.remove("hidden");
            flashButtons.classList.remove("hidden");

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

function highlightTarget(text, target) {

    if (!text) return "";

    return text.replaceAll(
        target,
        `<span class="target-hanzi">${target}</span>`
    );

}

function showFlashcard(){

    if(filtered.length===0){

        front.textContent="No cards";

        back.innerHTML="";

        counter.textContent="0 / 0";

        return;

    }


    const c = filtered[current];


    front.textContent =
        c.Hanzi;


    back.innerHTML = `
    <div class="card-title">
        ${c.Hanzi} ${c.Pinyin}
    </div>

    <hr>

    <div class="back-layout">

        <div class="left-column">

            <div class="card-section">
                <h3>English</h3>

                <div class="card-box english">
                    ${c.English}
                </div>

                <div class="english-meta">
                    <strong>Part of Speech:</strong> ${c["Part of Speech"]}&nbsp&nbsp
                    <strong>HSK:</strong> ${c.Levels}
                </div>


            </div>
        <div class="card-section">

    <h3>Examples</h3>

    <div class="examples-grid">

        <div class="example-card">
            ${highlightTarget(c.example1_chinese, c.Hanzi)}<br>
            ${c.example1_pinyin}<br><br>
            ${c.example1_english}
        </div>

        <div class="example-card">
            ${highlightTarget(c.example2_chinese, c.Hanzi)}<br>
            ${c.example2_pinyin}<br><br>
            ${c.example2_english}
        </div>

        <div class="example-card">
            ${highlightTarget(c.example3_chinese, c.Hanzi)}<br>
            ${c.example3_pinyin}<br><br>
            ${c.example3_english}
        </div>

    </div>
</div>

            

        </div>
    </div>
`;


    showingFront=true;

    front.classList.remove("hidden");

    back.classList.add("hidden");


    counter.textContent =
        `${current+1} / ${filtered.length}`;

}


function makeClickableHanzi(text){

    let result = "";

    let i = 0;


    while(i < text.length){

        let found = false;


        // Try longest words first
        for(let length = 4; length >= 1; length--){

            let part =
                text.substring(i,i+length);


            if(vocabLookup[part]){

                const vocab =
                    vocabLookup[part];


                result += `

                <span 
                    class="hanzi-hover"
                    data-pinyin="${vocab.Pinyin}"
                    data-english="${vocab.English}">
                   
                    

                    ${part}

                </span>

                `;


                i += length;

                found = true;

                break;

            }

        }


                if(!found){

                    const char = text[i];


                    // Ignore punctuation styling
                    if(/[，。！？、；：,.!?]/.test(char)){

                        result += `
                        <span class="hanzi-punctuation">
                            ${char}
                        </span>
                        `;

                        i++;
                        continue;

                    }


                    const vocab =
                        vocabLookup[char];


                    if(vocab){

                        result += `
                        <span 
                            class="hanzi-hover"
                            data-pinyin="${vocab.Pinyin}"
                            data-english="${vocab.English}">

                            ${char}

                        </span>
                        `;

                    }
                    else {

                        result += `
                        <span class="hanzi-missing">
                            ${char}
                        </span>
                        `;

                    }


                    i++;

                }

    }


    return result;

}

function showReadingFlashcard(){

    if(filtered.length === 0){

        front.textContent = "No cards";
        back.innerHTML = "";
        counter.textContent = "0 / 0";
        return;

    }

    const c = filtered[current];

    


    back.innerHTML = `
    <div class="reading-back">

        <div class="reading-title">
            ${makeClickableHanzi(c.Hanzi)}
    </div>


    <hr>


    <div 
        class="reading-answer hidden"
        id="readingAnswer"
    >

        <div class="card-box">
            


        <span class="reading-pinyin">
            ${c.Pinyin}
            </span>

            

            <span class="reading-english">
                ${c.English}
            </span>

        </div>

    </div>


    <button id="showReadingAnswer">

        Show Pinyin + English

    </button>

    <div class="reading-ref">
    Ref: ${c.Word} | HSK ${c.Level} | #${c.Ref}
</div>

    </div>


    `;


    document
    .getElementById("showReadingAnswer")
    .onclick = function(event){

        event.stopPropagation();

        document
        .getElementById("readingAnswer")
        .classList.toggle("hidden");

    };


    
    // Reading cards always show the back

    front.classList.add("hidden");
    back.classList.remove("hidden");


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

    if(mode === "reading")
    showReadingFlashcard();
    else
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

    if(mode === "reading")
    showReadingFlashcard();
    else
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

    if(mode === "reading")
    showReadingFlashcard();
    else
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

// card.onclick=flipCard;

card.onclick = function(){

    if(mode === "reading"){
        return;
    }

    flipCard();

};

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

