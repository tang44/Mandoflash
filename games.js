// =====================================================
// GAMES.JS
// MANDOFLASH MINI GAMES
// =====================================================



// =====================================================
// GAME STATE
// =====================================================

let currentGame = "speed";

let gameRunning = false;

let gameCard = null;

let gameScore = 0;

let gameCorrect = 0;

let gameWrong = 0;

let gameCombo = 0;

let gameBestCombo = 0;


// Lives

let gameLives = 3;


// Timer

let gameTime = 60;

let gameTimer = null;


// Boss

let bossHP = 100;

let bossMaxHP = 100;

let bossAttempts = 10;

let bossMaxAttempts = 10;




// =====================================================
// DOM REFERENCES
// =====================================================


const gameControls =
    document.getElementById(
        "gameControls"
    );


const gameMode =
    document.getElementById(
        "gameMode"
    );


const startGameButton =
    document.getElementById(
        "startGame"
    );


const gameArea =
    document.getElementById(
        "gameArea"
    );


const gameTitle =
    document.getElementById(
        "gameTitle"
    );


const gamePrompt =
    document.getElementById(
        "gamePrompt"
    );


const gameAnswers =
    document.getElementById(
        "gameAnswers"
    );

const gameDescription =
    document.getElementById(
        "gameDescription"
    );

const gameStatus =
    document.getElementById(
        "gameStatus"
    );


const gameScoreDisplay =
    document.getElementById(
        "gameScore"
    );


const gameTimerDisplay =
    document.getElementById(
        "gameTimer"
    );


const gameLivesDisplay =
    document.getElementById(
        "gameLives"
    );


const gameComboDisplay =
    document.getElementById(
        "gameCombo"
    );



const typingArea =
    document.getElementById(
        "typingArea"
    );


const typingInput =
    document.getElementById(
        "typingInput"
    );


const submitTyping =
    document.getElementById(
        "submitTyping"
    );



const bossArea =
    document.getElementById(
        "bossArea"
    );


const bossHealth =
    document.getElementById(
        "bossHealth"
    );


const bossHPDisplay =
    document.getElementById(
        "bossHP"
    );


updateGameDescription(
    currentGame
);

// =====================================================
// GAME MODE CHANGE
// =====================================================

if(gameMode){


    gameMode.onchange=function(){


    currentGame =
        this.value;


    updateGameStatus(
        currentGame
    );


    updateGameDescription(
        currentGame
    );


};


}





// =====================================================
// START GAME BUTTON
// =====================================================

if(startGameButton){


    startGameButton.onclick=function(){


        startGame(
            currentGame
        );


    };


}

// =====================================================
// START GAME ENGINE
// =====================================================

function startGame(type){


    currentGame = type;


    resetGame();


    gameRunning = true;



    if(gameTitle){

        gameTitle.textContent =
            getGameTitle(type);

    }



    if(gameStatus){

        gameStatus.textContent =
            "Playing";

    }



    setupGameUI(type);



    updateGameStatus(type);



    if(type==="speed"){

        startSpeedRound();

    }


    else if(type==="survival"){

        startSurvival();

    }


    else if(type==="streak"){

        startStreak();

    }


    else if(type==="typing"){

        startTyping();

    }


    else if(type==="boss"){

        startBossBattle();

    }


}


// =====================================================
// GAME DESCRIPTIONS
// =====================================================

function updateGameDescription(game){


    if(!gameDescription)

        return;



    const descriptions = {


        speed:

            "⚡ Answer as many questions as possible in 60 seconds.",


        survival:

            "❤️ Keep answering correctly. Three mistakes and the game ends.",


        streak:

            "🔥 Build the longest correct answer streak.",


        typing:

            "⌨️ Type the English answer as quickly and accurately as possible.",


        boss:

            "🐉 Attack the boss by answering correctly. 10 tries or it survives."

    };



    gameDescription.textContent =
        descriptions[game];

}

// =====================================================
// RESET GAME
// =====================================================

function resetGame(){


    clearInterval(
        gameTimer
    );


    gameScore = 0;

    gameCorrect = 0;

    gameWrong = 0;


    gameCombo = 0;

    gameBestCombo = 0;


    gameLives = 3;


    gameTime = 60;


    bossAttempts = 10;



    updateGameDisplay();


}




// =====================================================
// GAME TITLES
// =====================================================

function getGameTitle(type){


    const titles = {


        speed:
            "⚡ Speed Round",


        survival:
            "❤️ Survival Mode",


        streak:
            "🔥 Streak Challenge",


        typing:
            "⌨️ Typing Practice",


        boss:
            "🐉 Boss Battle"


    };


    return titles[type];

}




// =====================================================
// SETUP GAME UI
// =====================================================

function setupGameUI(type){


    if(gameAnswers){

        gameAnswers.innerHTML="";

    }



    if(typingArea){

        typingArea.classList.add(
            "hidden"
        );

    }



    if(bossArea){

        bossArea.classList.add(
            "hidden"
        );

    }




    if(type==="typing"
       &&
       typingArea){


        typingArea.classList.remove(
            "hidden"
        );


    }




    if(type==="boss"
       &&
       bossArea){


        bossArea.classList.remove(
            "hidden"
        );

    }


}




// =====================================================
// GAME STATUS PANEL CONTROL
// ONLY SHOW CURRENT GAME ITEMS
// =====================================================

function updateGameStatus(game){



    const items = [

        "gameTimer",

        "gameLives",

        "gameCombo"

    ];



    items.forEach(id=>{


        const element =
            document.getElementById(id);



        if(element){

            element.classList.add(
                "hidden"
            );

        }


    });





    switch(game){



        case "speed":


            showGameStat(
                "gameTimer"
            );


            break;




        case "survival":


            showGameStat(
                "gameLives"
            );


            break;




        case "streak":


            showGameStat(
                "gameCombo"
            );


            break;




        case "typing":


            showGameStat(
                "gameCombo"
            );


            break;




        case "boss":


            // Boss uses HP bar

            break;


    }



}





function showGameStat(id){


    const element =
        document.getElementById(id);



    if(element){


        element.classList.remove(
            "hidden"
        );


    }


}





// =====================================================
// UPDATE STATUS DISPLAY
// =====================================================

function updateGameDisplay(){



    if(gameScoreDisplay){


        gameScoreDisplay.textContent =

            `Score: ${gameScore}`;


    }





    if(gameLivesDisplay){


        gameLivesDisplay.textContent =

            "❤️".repeat(
                gameLives
            );


    }





    if(gameComboDisplay){


        gameComboDisplay.textContent =

            `🔥 ${gameCombo}`;


    }





    if(gameTimerDisplay
       &&
       currentGame==="speed"){


        gameTimerDisplay.textContent =

            `⏱ ${gameTime}`;


    }



}

// =====================================================
// NEXT GAME QUESTION
// =====================================================

function nextGameQuestion(){


    if(!gameRunning)

        return;



    gameCard =
        randomCard();



    gamePrompt.textContent =

        getPrompt(
            gameCard,
            "HanziToEnglish"
        );



    return gameCard;

}




// =====================================================
// CREATE GAME ANSWERS
// =====================================================

function showGameChoices(){


    const options =

        generateOptions(
            gameCard,
            "HanziToEnglish"
        );



    gameAnswers.innerHTML="";



    options.forEach(option=>{


        const button =

            document.createElement(
                "button"
            );



        button.textContent =
            option.text;



        button.onclick=function(){



            if(currentGame==="boss"){


                processBossAnswer(
                    option.text
                );


            }

            else{


                processGameAnswer(
                    option.text
                );


            }



        };



        gameAnswers.appendChild(
            button
        );



    });


}




// =====================================================
// SPEED ROUND
// =====================================================

function startSpeedRound(){


    gameTime = 60;


    updateGameDisplay();


    startTimer();


    nextSpeedQuestion();


}




function nextSpeedQuestion(){


    nextGameQuestion();


    showGameChoices();


}





function startTimer(){


    clearInterval(
        gameTimer
    );



    gameTimer =

        setInterval(()=>{


            gameTime--;


            updateGameDisplay();



            if(gameTime<=0){


                speedFinished();


            }



        },1000);


}




function speedFinished(){


    gameRunning=false;



    clearInterval(
        gameTimer
    );



    if(gameStatus){


        gameStatus.textContent =

            "Time Complete!";

    }




    gamePrompt.innerHTML = `

        <div class="game-win">

            ⚡ Speed Round Finished!

            <br><br>

            Score: ${gameScore}

        </div>

    `;



    gameAnswers.innerHTML="";


    saveGameStats();


}





// =====================================================
// SURVIVAL MODE
// =====================================================

function startSurvival(){


    gameLives=3;


    updateGameDisplay();


    nextSurvivalQuestion();


}





function nextSurvivalQuestion(){


    nextGameQuestion();


    showGameChoices();


}






// =====================================================
// STREAK MODE
// =====================================================

function startStreak(){


    gameCombo=0;


    gameBestCombo=0;


    updateGameDisplay();



    nextStreakQuestion();


}




function nextStreakQuestion(){


    nextGameQuestion();


    showGameChoices();


}






// =====================================================
// CONTINUE GAME
// =====================================================

function continueGame(){



    if(currentGame==="speed"){


        nextSpeedQuestion();


    }



    else if(currentGame==="survival"){


        nextSurvivalQuestion();


    }



    else if(currentGame==="streak"){


        nextStreakQuestion();


    }


}

// =====================================================
// ANSWER PROCESSOR
// =====================================================

function processGameAnswer(choice){


    if(!gameRunning)

        return;



    const correct =

        getAnswer(
            gameCard,
            "HanziToEnglish"
        );



    const buttons =
        gameAnswers.querySelectorAll(
            "button"
        );



    buttons.forEach(button=>{


        button.disabled=true;



        if(button.textContent===correct){


            button.classList.add(
                "game-correct"
            );


        }



    });





    if(choice===correct){



        gameCorrect++;


        gameCombo++;



        if(gameCombo > gameBestCombo){


            gameBestCombo =
                gameCombo;


        }



        gameScore +=

            10 + gameCombo;



    }


    else{


        gameWrong++;


        gameCombo=0;



        handleWrongAnswer();


    }





    updateGameDisplay();





    setTimeout(()=>{


        if(gameRunning){


            continueGame();


        }


    },500);



}






// =====================================================
// WRONG ANSWER HANDLER
// =====================================================

function handleWrongAnswer(){



    if(currentGame==="survival"){



        gameLives--;



        updateGameDisplay();




        if(gameLives<=0){



            endGame(
                "💀 Survival Failed"
            );



        }


    }


}






// =====================================================
// BOSS BATTLE
// =====================================================

function startBossBattle(){


    bossMaxHP = 100;


    bossHP = bossMaxHP;


    bossAttempts = bossMaxAttempts;



    updateBossDisplay();



    nextBossQuestion();



}





function nextBossQuestion(){



    nextGameQuestion();


    showGameChoices();



}






function processBossAnswer(choice){


    if(!gameRunning)

        return;



    const correct =

        getAnswer(
            gameCard,
            "HanziToEnglish"
        );



    // Every attempt counts

    bossAttempts--;



    if(choice === correct){


        gameCorrect++;


        gameCombo++;


        gameScore +=

            10 + gameCombo;



        bossDamage(10);


    }

    else{


        gameWrong++;


        gameCombo = 0;


    }



    updateBossDisplay();


    updateGameDisplay();



    // Victory

    if(bossHP <= 0){


        bossDefeated();


        return;


    }



    // Out of attempts

    if(bossAttempts <= 0){


        bossFailed();


        return;


    }



    setTimeout(()=>{


        nextBossQuestion();


    },500);



}







function bossDamage(amount){



    bossHP -= amount;




    if(bossHP<0)

        bossHP=0;




    updateBossDisplay();




    if(bossHP<=0){


        bossDefeated();


    }


}






function updateBossDisplay(){


    if(bossHealth){

        bossHealth.value =
            bossHP;

    }



    if(bossHPDisplay){

        bossHPDisplay.textContent =

            `${bossHP} / ${bossMaxHP} HP`;

    }



    const bossStatus =
        document.getElementById(
            "bossStatus"
        );


    if(bossStatus){

        bossStatus.textContent =

            `🐉 HP: ${bossHP} | Attempts: ${bossAttempts}/${bossMaxAttempts}`;

    }


}






function bossDefeated(){



    gameRunning=false;



    gameScore +=100;




   gamePrompt.innerHTML = `

    <div class="game-win">

        🏆 Boss Defeated!

        <br>

        🎉 Victory!

        <br><br>

        Score: ${gameScore}

        <br><br>

        Attempts Left:
            ${bossAttempts}

    </div>

`;



    gameAnswers.innerHTML="";



    saveGameStats();



}

function bossFailed(){


    gameRunning=false;


    gameStatus.textContent =
        "💀 Boss Survived!";


    gamePrompt.innerHTML = `

        <div class="game-over">

            💀 Boss Battle Failed!

            <br><br>

            Attempts Used: ${bossMaxAttempts}

            <br><br>

            Boss HP Remaining: ${bossHP}

        </div>

    `;



    gameAnswers.innerHTML="";


    saveGameStats();


}


// =====================================================
// TYPING PRACTICE
// =====================================================

function startTyping(){


    if(typingInput){

        typingInput.value = "";

        typingInput.focus();

    }


    nextTypingQuestion();


}



function nextTypingQuestion(){


    nextGameQuestion();


    if(gameCard){

        gamePrompt.textContent =
            gameCard.Hanzi;

    }


}




function checkTypingAnswer(){


    if(!gameRunning)

        return;



    const answer =

        typingInput.value
        .trim()
        .toLowerCase();



    const correct =

        gameCard.English
        .trim()
        .toLowerCase();




    if(answer===correct){


        gameCorrect++;


        gameCombo++;


        gameScore +=

            10 + gameCombo;


    }

    else{


        gameWrong++;


        gameCombo=0;


    }



    updateGameDisplay();



    typingInput.value="";



    setTimeout(()=>{


        if(gameRunning){

            nextTypingQuestion();

        }


    },500);



}




if(submitTyping){


    submitTyping.onclick=function(){

        checkTypingAnswer();

    };


}



if(typingInput){


    typingInput.addEventListener(
        "keydown",
        function(event){


            if(event.key==="Enter"){


                checkTypingAnswer();


            }


        }
    );


}






// =====================================================
// END GAME
// =====================================================

function endGame(message){


    gameRunning=false;


    clearInterval(
        gameTimer
    );



    if(gameStatus){

        gameStatus.textContent =
            message;

    }




    gamePrompt.innerHTML = `

        <div class="game-over">

            ${message}

            <br><br>

            Score: ${gameScore}

        </div>

    `;



    gameAnswers.innerHTML="";



    saveGameStats();


}







// =====================================================
// LOCAL STORAGE STATS
// =====================================================


let gameStats =

JSON.parse(

    localStorage.getItem(
        "mandoFlashStats"
    )

)

||

{

    gamesPlayed:0,

    totalScore:0,

    bestCombo:0,

    bestSpeed:0

};






function saveGameStats(){


    gameStats.gamesPlayed++;


    gameStats.totalScore +=
        gameScore;



    if(gameBestCombo >
       gameStats.bestCombo){


        gameStats.bestCombo =
            gameBestCombo;

    }



    if(currentGame==="speed"
       &&
       gameScore >
       gameStats.bestSpeed){


        gameStats.bestSpeed =
            gameScore;

    }




    localStorage.setItem(

        "mandoFlashStats",

        JSON.stringify(
            gameStats
        )

    );


}







// =====================================================
// PUBLIC FUNCTION
// =====================================================

window.startGame =
    startGame;