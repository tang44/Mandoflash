// =====================================================
// DATA.JS
// CSV DATABASE HANDLING
// =====================================================


// =====================================================
// GLOBAL DATABASE
// =====================================================

let cards = [];

let filtered = [];

let current = 0;


// =====================================================
// LOAD DATABASE
// =====================================================

async function loadCSV(){

    try{


        const response =
            await fetch(
                "hsk1to3_cards.csv"
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



        cards =
            csvToObjects(text);



        filtered =
            [...cards];



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
                cards.map(
                    c=>c.Level
                )
            )
        ];



    const parts =
        [
            ...new Set(
                cards.map(
                    c=>c["First PoS"]
                )
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
        cards.filter(card=>{


            const text =

                Object
                .values(card)
                .join(" ")
                .toLowerCase();



            return (

                text.includes(search)

                &&

                (!level ||
                card.Level===level)

                &&

                (!pos ||
                card["First PoS"]===pos)

            );


        });



    current=0;


    updateCardCount();


    console.log(
        "Filtered cards:",
        filtered.length
    );


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



    if(type==="chinese"){

        filtered.sort(
            (a,b)=>
            a.Chinese.localeCompare(
                b.Chinese
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

    return direction==="chineseToEnglish"

        ?

        card.Chinese

        :

        card.English;


}





function getAnswer(
    card,
    direction
){

    return direction==="chineseToEnglish"

        ?

        card.English

        :

        card.Chinese;


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
    loadCSV
);
