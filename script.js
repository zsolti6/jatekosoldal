window.addEventListener("load", () => {
        amobaSetup();
});

var indexek = {
        0: 0,
        1: 0,
        2: 0,
        3: 1,
        4: 1,
        5: 1,
        6: 2,
        7: 2,
        8: 2
}

var szinek = {
        "0|0": "orange",
        "0|1": "oceanblue",
        "0|2": "blue",
        "1|0": "aqua",
        "1|1": "pink",
        "1|2": "gold",
        "2|0": "yellow",
        "2|1": "lightgrey",
        "2|2": "purple"
}

var kezdoTabla = [];
var megoldottTabla = [];
var valtoSzam;

async function getBoard(){
        await fetch("https://sudoku-api.vercel.app/api/dosuku")
        .then(function(datas) {
                return datas.json();
        })
        .then(function(datas) {
                kezdoTabla = [];
                megoldottTabla = [];
                for(var i = 0; i < 9; i++){
                        var sor = [];
                        var msor = [];
                        for(var j = 0; j < 9; j++){
                                var ertek = datas.newboard.grids[0].value[i][j];
                                var mertek = datas.newboard.grids[0].solution[i][j];
                                sor.push(ertek);
                                msor.push(mertek);
                                var szin = szinek[indexek[i] + "|" +  indexek[j]];
                                var ujTile = `<div class="tile${ertek == 0 ? " ures" : ""}" id="${i}${j}" style="background-color: ${szin}">${ertek == 0 ? "" : ertek}</div>`;
                                document.getElementById("tabla").innerHTML += ujTile;
                        }
                        kezdoTabla.push(sor);
                        megoldottTabla.push(msor);
                }
                var tileok = document.querySelectorAll(".tile");
                tileok.forEach(element => {
                        element.addEventListener("click", tileClick);
                });
        })
}

function valasztoSetup(){
        var k = 1;
        for(var i = 0; i < 3; i++){
                for(var j = 0; j < 3; j++){
                        document.getElementById("valaszto").innerHTML += `<div class="valasztoTile" id="${k}">${k}</div>`;
                        k++;
                }
        }
        var vTileok = document.querySelectorAll(".valasztoTile");
        vTileok.forEach(element => {
                element.addEventListener("click", valasztoClick);
        });
}

function valasztoClick(e){
        valtoSzam = e.target.id;
        let valasztotileok = document.querySelectorAll(".valasztoTile");
        valasztotileok.forEach(element => {
                element.classList.remove("kivalasztott");
        });
        e.target.classList.add("kivalasztott");
}

function tileClick(e){
        var tile = e.target;
        if(valtoSzam == null){
                return;
        }
        if(tile.classList.contains("ures")){
                tile.classList.remove("helyes");
                tile.classList.remove("helytelen");
                if(parseInt(tile.innerText) == valtoSzam){
                        kezdoTabla[tile.id[0]][tile.id[1]] = 0;
                        tile.innerText = "";
                }else{
                        kezdoTabla[tile.id[0]][tile.id[1]] = valtoSzam;
                        tile.innerText = valtoSzam;
                }
        }
        if(winCheck()){
                alert("Gratulálunk, minden szám helyes!");
        }
}

function ellenoriz(){
        for(var i = 0; i < 9; i++){
                for(var j = 0; j < 9; j++){
                        if(kezdoTabla[i][j] != megoldottTabla[i][j] && kezdoTabla[i][j] != 0){
                                document.getElementById(`${i}${j}`).classList.remove("helyes");
                                document.getElementById(`${i}${j}`).classList.add("helytelen");
                        }else if(kezdoTabla[i][j] != 0){
                                document.getElementById(`${i}${j}`).classList.remove("helytelen");
                                document.getElementById(`${i}${j}`).classList.add("helyes");
                        }
                }
        }
}

function winCheck(){
        for(var i = 0; i < 9; i++){
                for(var j = 0; j < 9; j++){
                        if(kezdoTabla[i][j] != megoldottTabla[i][j]){
                                return false;
                        }
                }
        }
        return true;
}

function kezdooldal(){
        document.getElementById("tartalom").innerHTML = `<h1 class="focim">Kezdőoldal</h1><br><p class="foleiras">Ezen az oldalon különböző játékok vannak például Sudoku és Amőba.</p><div id="kepdiv"><img src="fooldalkep.png" class="img-fluid"></img></div>`;
}

function sudokuSetup(){
        document.getElementById("tartalom").innerHTML = 
        `
        <h1>Sudoku játék</h1>
        <div id="kontener"><div id="tabla"></div></div>
        <div id="valaszto"></div>
        <div id="gombdiv"><input id="ellenoriz" type="button" value="Ellenőrzés" onclick="ellenoriz()"></div>
        <div id="magyarazat">
              <p>A magyarázatot itt találod:
              <a id="wikilink" href="https://hu.wikipedia.org/wiki/Sz%C3%BAdoku" target="_blank">https://hu.wikipedia.org/wiki/Sz%C3%BAdoku</a></p>
        </div>
        `;
        
        getBoard();
        valasztoSetup();
}

let kovetkezik = "x";
let amobaTabla = [];
let lepesek = 0;
let vege = false;

function amobaSetup(){
        kovetkezik = "x";
        amobaTabla = [];
        vege = false;
        document.getElementById("tartalom").innerHTML = 
        `
        <h1>Amőba játék</h1>
        <div id="kontener"><div id="tabla"></div></div>
        <p id="info">${kovetkezik} következik</p>
        <div id="magyarazat">
              <p>A magyarázatot itt találod:
              <a id="wikilink" href="https://hu.wikipedia.org/wiki/Gomoku#Am%C5%91ba" target="_blank">https://hu.wikipedia.org/wiki/Gomoku#Am%C5%91ba</a></p>
        </div>
        `;
        for(var i = 0; i < 5; i++){
                let sor = [];
                for(var j = 0; j < 5; j++){
                        document.getElementById("tabla").innerHTML += `<div class="amobatile" id="${i}${j}"></div>`;
                        sor.push("-");
                }
                amobaTabla.push(sor);
        }
        let tileok = document.querySelectorAll(".amobatile");
        tileok.forEach(element => {
                element.addEventListener("click", handleTileClick);
        });
        console.log(amobaTabla);
}

function handleTileClick(e){
        if(e.target.innerText != "" || vege){
                return;
        }
        e.target.innerText = kovetkezik;
        e.target.classList.add(kovetkezik == "x" ? "piros" : "kek");
        amobaTabla[e.target.id[0]][e.target.id[1]] = kovetkezik;
        lepesek++;
        if(lepesek == 25){
                document.getElementById("info").innerHTML = "Döntetlen!";
        }
        if(nyert()){
                document.getElementById("info").innerHTML = `${kovetkezik} nyert!`;
                vege = true;
        }else{
                document.getElementById("info").innerHTML = `${kovetkezik} következik`;
        }
        kovetkezik = kovetkezik == "x" ? "o" : "x";
}

function nyert(){
        for(var i = 0; i < 5; i++){ // vizszintes
                for(var j = 0; j < 2; j++){
                        if(amobaTabla[i][j] == amobaTabla[i][j + 1] && amobaTabla[i][j] == amobaTabla[i][j + 2] && amobaTabla[i][j] == amobaTabla[i][j + 3] && amobaTabla[i][j] != "-"){
                                return true;
                        }
                }
        }
        for(var i = 0; i < 2; i++){ // fuggoleges
                for(var j = 0; j < 5; j++){
                        if(amobaTabla[i][j] == amobaTabla[i + 1][j] && amobaTabla[i][j] == amobaTabla[i + 2][j] && amobaTabla[i][j] == amobaTabla[i + 3][j] && amobaTabla[i][j] != "-"){
                                return true;
                        }
                }
        }
        for(var i = 0; i < 2; i++){ // balfent le
                for(var j = 0; j < 2; j++){
                        if(amobaTabla[i][j] == amobaTabla[i + 1][j + 1] && amobaTabla[i][j] == amobaTabla[i + 2][j + 2] && amobaTabla[i][j] == amobaTabla[i + 3][j + 3] && amobaTabla[i][j] != "-"){
                                return true;
                        }
                }
        }
        for(var i = 3; i < 5; i++){ // jobbfent le
                for(var j = 0; j < 2; j++){
                        if(amobaTabla[i][j] == amobaTabla[i - 1][j + 1] && amobaTabla[i][j] == amobaTabla[i - 2][j + 2] && amobaTabla[i][j] == amobaTabla[i - 3][j + 3] && amobaTabla[i][j] != "-"){
                                return true;
                        }
                }
        }
        return false;
}
