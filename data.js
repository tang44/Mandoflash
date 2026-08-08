// =====================================================
// DATA.JS
// CSV DATABASE HANDLING
// =====================================================


// =====================================================
// GLOBAL DATABASE
// =====================================================

let cards = [];

let readingCards = [];

let vocabLookup = {};

let activeDeck = [];

let filtered = [];

let current = 0;


// =====================================================
// LOAD DATABASE
// =====================================================

async function loadCSV(){

    try{


        const response =
            await fetch(
                "HSK_1to4_combined_from_CLI.csv"

                //HSK_1to4_combined_from_CLI.csv
                //HSK_1to4_cards.csv
                //HSK_1to4_combined.csv
            );


        if(!response.ok){

            throw new Error(
                "CSV file not found"
            );

        }



        const text =
            await response.text();



        console.log(
            "CSV loaded:"
        );


        console.log(
            text.substring(0,200)
        );



        cards = csvToObjects(text);

        cards.forEach(card => {

            vocabLookup[card.Hanzi] = {

                Pinyin: card.Pinyin,
                English: card.English,
                Level: card.Levels,
                Number: card["#"]

            };

        });


        buildReadingCards();

        // Start app on vocabulary flashcards
        activeDeck = cards;

        filtered = [...activeDeck];

        filterCards();
        
        

        console.log(
            "Cards loaded:",
            cards.length
        );


        console.log(
            "First card:",
            cards[0]
        );



        populateFilters();


        filterCards();


        updateCardCount();



        // app.js handles display
        if(
            typeof showFlashcard === "function"
        ){

            showFlashcard();

        }


    }


    catch(error){


        console.error(
            "CSV ERROR:",
            error
        );


        const front =
            document.getElementById(
                "front"
            );


        if(front){

            front.textContent =
                "Unable to load cards";

        }


    }

}




// =====================================================
// TSV / CSV CONVERTER
// Handles Excel exports
// =====================================================

function csvToObjects(text){


    text =
        text
        .replace(/\r/g,"")
        .replace(/^\uFEFF/,"")
        .trim();



    const rows =
        text
        .split("\n")
        .map(row=>{


            return row.split(
                /\t|,/
            );


        });



    const headers =
        rows[0]
        .map(header=>

            header
            .replace(/^\uFEFF/,"")
            .trim()

        );



    return rows
    .slice(1)
    .filter(row =>
        row.length > 1
    )
    .map(row=>{


        let obj={};



        headers.forEach(
            (header,index)=>{


                obj[header] =
                    row[index]
                    ?.trim()
                    ||
                    "";


            }
        );



        return obj;


    });


}

// =====================================================
// BUILD READING DATABASE
// =====================================================

function buildReadingCards(){

    readingCards = [];

    cards.forEach(card => {

        [
            [card.example1_chinese, card.example1_pinyin, card.example1_english],
            [card.example2_chinese, card.example2_pinyin, card.example2_english],
            [card.example3_chinese, card.example3_pinyin, card.example3_english]

        ].forEach(example => {

            const [hanzi, pinyin, english] = example;

            if(!hanzi || !hanzi.trim())
                return;

            readingCards.push({

                Hanzi: hanzi,
                Pinyin: pinyin,
                English: english,

                Level: card.Level,
                Levels: card.Levels,

                // original vocabulary reference
                Word: card.Hanzi,
                Ref: card.Number

            });

        });

    });

    console.log(
        "Reading cards:",
        readingCards.length
    );

}


// =====================================================
// FILTER OPTIONS
// =====================================================

function populateFilters(){


    const level =
        document.getElementById(
            "levelFilter"
        );


    const pos =
        document.getElementById(
            "posFilter"
        );



    if(!level || !pos)
        return;



    level.innerHTML =
        `
        <option value="">
            All Levels
        </option>
        `;


    pos.innerHTML =
        `
        <option value="">
            All Parts of Speech
        </option>
        `;



    const levels =
[
    ...new Set(
        cards
        .map(c => c.Level?.trim())
        .filter(x => x && /^[0-9]+$/.test(x))
    )
];



    const parts =
[
    ...new Set(
        cards
        .map(c => c["First PoS"]?.trim())
        .filter(x => x && x.length < 20)
    )
];



    levels.forEach(x=>{


        level.innerHTML +=
        `

        <option value="${x}">

            HSK ${x}

        </option>

        `;


    });



    parts.forEach(x=>{


        pos.innerHTML +=
        `

        <option value="${x}">

            ${x}

        </option>

        `;


    });


}




// =====================================================
// FILTER DATABASE
// =====================================================

function filterCards(){


    const search =
        document
        .getElementById("search")
        ?.value
        .toLowerCase()
        ||
        "";



    const level =
        document
        .getElementById("levelFilter")
        ?.value
        ||
        "";



    const pos =
        document
        .getElementById("posFilter")
        ?.value
        ||
        "";

  




    filtered =
        activeDeck.filter(card=>{


            const text =

                Object
                .values(card)
                .join(" ")
                .toLowerCase();



            return (

                text.includes(search)

                &&

                // (!level ||
                // card.Level===level)
                (!level ||
                    card.Level?.trim()===level)

                &&

                // (!pos ||
                // card["First PoS"]===pos)
                (!pos ||
                    card["First PoS"]?.trim()===pos)

            );


        });



    current=0;


    updateCardCount();


    console.log(
        "Filtered cards:",
        filtered.length
    );

    if(typeof showFlashcard === "function"){
    showFlashcard();
}

    if(mode === "reading"){
        showReadingFlashcard();
    }
    else{
        showFlashcard();
    }


}

// =====================================================
// FILTER EVENTS
// =====================================================

function setupFilterEvents(){

    const search = document.getElementById("search");
    const level = document.getElementById("levelFilter");
    const pos = document.getElementById("posFilter");
    const sort = document.getElementById("sort");


    if(search){
        search.addEventListener(
            "input",
            filterCards
        );
    }


    if(level){
        level.addEventListener(
            "change",
            filterCards
        );
    }


    if(pos){
        pos.addEventListener(
            "change",
            filterCards
        );
    }


    if(sort){
        sort.addEventListener(
            "change",
            function(){

                sortCards(this.value);
                updateCardCount();

                if(typeof showFlashcard === "function"){
                    showFlashcard();
                }

            }
        );
    }

}


// =====================================================
// SORT
// =====================================================

function sortCards(type){


    if(type==="number"){

        filtered.sort(
            (a,b)=>
            Number(a["#"])
            -
            Number(b["#"])
        );

    }



    if(type==="Hanzi"){

        filtered.sort(
            (a,b)=>
            a.Hanzi.localeCompare(
                b.Hanzi
            )
        );

    }



    if(type==="pinyin"){

        filtered.sort(
            (a,b)=>
            a.Pinyin.localeCompare(
                b.Pinyin
            )
        );

    }



    if(type==="english"){

        filtered.sort(
            (a,b)=>
            a.English.localeCompare(
                b.English
            )
        );

    }


}




// =====================================================
// SHUFFLE
// =====================================================

function shuffle(array){


    const arr =
        [...array];



    for(
        let i=arr.length-1;
        i>0;
        i--
    ){

        const j =
            Math.floor(
                Math.random()
                *
                (i+1)
            );


        [
            arr[i],
            arr[j]
        ] =
        [
            arr[j],
            arr[i]
        ];

    }



    return arr;


}





// =====================================================
// CARD HELPERS
// =====================================================

function randomCard(){


    if(filtered.length===0)
        return null;



    return filtered[

        Math.floor(
            Math.random()
            *
            filtered.length
        )

    ];

}




function getPrompt(
    card,
    direction
){

    return direction==="HanziToEnglish"

        ?

        card.Hanzi

        :

        card.English;


}





function getAnswer(
    card,
    direction
){

    return direction==="HanziToEnglish"

        ?

        card.English

        :

        card.Hanzi;


}






// =====================================================
// QUIZ/GAME ANSWERS
// =====================================================

function generateOptions(
    card,
    direction
){


    let options=[{


        text:
            getAnswer(
                card,
                direction
            ),


        card


    }];



    let attempts=0;



    while(
        options.length < 4
        &&
        attempts < 100
    ){


        attempts++;


        const random =
            randomCard();



        if(!random)
            break;



        const answer =
            getAnswer(
                random,
                direction
            );



        if(
            !options.some(
                o=>o.text===answer
            )
        ){

            options.push({

                text:answer,

                card:random

            });

        }


    }



    return shuffle(options);


}




// =====================================================
// CARD COUNTER
// =====================================================

function updateCardCount(){


    const count =
        document.getElementById(
            "cardCount"
        );



    if(count){


        count.textContent =
            `(${filtered.length} cards)`;


    }


}





// =====================================================
// START DATABASE
// =====================================================

window.addEventListener(
    "load",
    function(){

        setupFilterEvents();
        loadCSV();

    }
);
