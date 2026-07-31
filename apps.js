let cards = [];

let filtered = [];

let current = 0;

let showingFront = true;


const front = document.getElementById("front");

const back = document.getElementById("back");


// Load CSV when app starts

//flashcard\cards.csv

window.onload = loadCSV;



async function loadCSV(){

    try {

        const response = await fetch("hsk1to3_cards.csv");
        //flashcard\hsk1to3_cards.csv

        const text = await response.text();


        cards = csvToObjects(text);


        populateFilters();

        filterCards();


    }

    catch(error){

        console.error(error);

        front.innerHTML="Unable to load cards";

    }

}




function csvToObjects(text){


    const rows = parseCSV(text);


    const headers = rows[0];


    return rows.slice(1).map(row=>{


        let obj={};


        headers.forEach((h,i)=>{

            obj[h.trim()] = row[i]?.trim() || "";

        });


        return obj;


    });


}




function parseCSV(text){


    let rows=[];

    let row=[];

    let value="";

    let quote=false;


    for(let char of text){


        if(char === '"'){

            quote=!quote;

        }

        else if(char === "," && !quote){

            row.push(value);

            value="";

        }

        else if(char === "\n" && !quote){

            row.push(value);

            rows.push(row);

            row=[];

            value="";

        }

        else{

            value+=char;

        }

    }


    if(value){

        row.push(value);

        rows.push(row);

    }


    return rows;

}




function populateFilters(){


    let levels=[...new Set(cards.map(c=>c.Level))];

    // let pos=[...new Set(cards.map(c=>c["Part of Speech"]))];
    let pos=[...new Set(cards.map(c=>c["First PoS"]))];


    let level=document.getElementById("levelFilter");

    let speech=document.getElementById("posFilter");


    levels.forEach(x=>{

        level.innerHTML += `<option>${x}</option>`;

    });


    pos.forEach(x=>{

        speech.innerHTML += `<option>${x}</option>`;

    });


}






function filterCards(){


    let search=document.getElementById("search").value.toLowerCase();

    let level=document.getElementById("levelFilter").value;

    let pos=document.getElementById("posFilter").value;



    filtered=cards.filter(card=>{


        let text=Object.values(card)
        .join(" ")
        .toLowerCase();


        return text.includes(search)

        && (!level || card.Level===level)

        && (!pos || card["Part of Speech"]===pos);


    });



    let sort=document.getElementById("sort").value;


    if(sort==="number")

        filtered.sort((a,b)=>a["#"]-b["#"]);



    if(sort==="chinese")

        filtered.sort((a,b)=>a.Chinese.localeCompare(b.Chinese));



    if(sort==="pinyin")

        filtered.sort((a,b)=>a.Pinyin.localeCompare(b.Pinyin));



    if(sort==="english")

        filtered.sort((a,b)=>a.English.localeCompare(b.English));



    if(sort==="random")

        filtered.sort(()=>Math.random()-0.5);



    current=0;

    show();

}





function show(){


    if(filtered.length===0){

        front.innerHTML="No cards";

        back.innerHTML="";

        return;

    }



    let c=filtered[current];



    front.innerHTML=c.Chinese;



    back.innerHTML=`

   <div style="color: red, align:center">
    ${c.Chinese} ${c.Pinyin}
    </div>
    <hr>
    <b style="color: MediumPurple;font-size: 30px;">English:</b> 
    
    <div style="border: 2px blue; padding: 10px; border-radius: 5px; background-color: #cabdee2a;font-size: 30px;color: black;">
    ${c.English}
</div>


    <b style="color: gray;font-size: 30px;">Other info:</b>  <br>
    <div style="border: 4px gray; padding: 10px; border-radius: 5px; background-color: #c4c1c11f;font-size: 30px;color: black;font-size: 30px;">
    
        Part of Speech: &nbsp;&nbsp; ${c["Part of Speech"]}<br> 
        HSK Level(s): &nbsp;&nbsp; ${c.Levels}
    </div>

    `;



    showingFront=true;


    front.classList.remove("hidden");

    back.classList.add("hidden");



    document.getElementById("counter").innerHTML=

    `${current+1} / ${filtered.length}`;

}




function flip(){

    showingFront=!showingFront;


    front.classList.toggle("hidden");

    back.classList.toggle("hidden");

}




document.getElementById("card").onclick=flip;

document.getElementById("flip").onclick=flip;



document.getElementById("next").onclick=function(){

    current++;

    if(current>=filtered.length)

        current=0;


    show();

};



document.getElementById("prev").onclick=function(){

    current--;

    if(current<0)

        current=filtered.length-1;


    show();

};



document.getElementById("random").onclick=function(){

    current=Math.floor(Math.random()*filtered.length);

    show();

};



document.getElementById("search").oninput=filterCards;

document.getElementById("levelFilter").onchange=filterCards;

document.getElementById("posFilter").onchange=filterCards;

document.getElementById("sort").onchange=filterCards;