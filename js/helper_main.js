$(function() {
  // Make keyboard items draggable
$(".item").draggable({
    drag: function (event, ui) {
        if ($(this).data('droppedin')) {
            $(this).data('droppedin').droppable('enable');
            $(this).data('droppedin', null)
            $(this).removeClass('dropped')
        }
    },
    snap: ".box",
    snapMode: "inner",
    helper: "clone", // create "copy" with original properties, but not a true clone
    cursor: "move",
    revert: "invalid",
    revertDuration: 0 // immediate snap
});

$(".box").droppable({
    classes: {
        "ui-droppable-hover": "ui-state-hover"
    },
    drop: function(event, ui) {
        const color = document.querySelector('input[name="box_color"]:checked').value;
        $(this).append($(ui.draggable).clone());
        let boxID = event.target.id;
        document.getElementById(boxID).lastElementChild.setAttribute("data-color", color);
    },
});

// Function to adjust the width of the drop box
function adjustDropBoxWidth() {
  var itemCount = $('#drop-box .item').length;
  $('#drop-box').css('width', itemCount * 30 + 'px'); // Adjust width as per your requirement
}

let infoModal = document.getElementById("info-modal");
let infoButton = document.getElementById("info");
let infoCloseButton = document.getElementsByClassName("modal-exit")[0];

infoButton.onclick = function() {
    infoModal.style.display = "block";
};

infoCloseButton.onclick = function() {
    infoModal.style.display = "none";
};

function changeColor(color) {
    let boxes = document.querySelectorAll('[data-color="0"]');
    boxes.forEach(box => {
        box.style.backgroundColor=color;
    })
}

function getKnown(){
    let out = [];
    for (let i=0; i<5; i++){
        let idx = i.toString();
        let children = document.getElementById(idx).childNodes;
        for (let j=0; j<children.length; j++)  {
            let letter = children[j];
            out.push([idx, letter.id, letter.dataset.color]);
        }
    }
    console.log(out)
    return out;
}

function formatWords(words){
    let out = '<div>';
    if (words.length === 0) {
        out = '<p style="text-align:center;"><br><b>no matching words</b></p>';
        document.getElementById("whereToPrint").innerHTML = out;
    } else {
        words.forEach( word => {
                out += "<p style=\"text-align:center;\">" + word + "</p>"
            }
        );
        out += "</div>";
        document.getElementById("whereToPrint").innerHTML = out;
    }
}

function filterWords() {
    let goodWords = [];
    let bad_letters = document.getElementById('badLetterField').value.toLowerCase();
    let known = getKnown();
    let letter;
    for (let i = 0; i < allWords.length; i++) {
        let word = allWords[i];
        let isGoodWord = true;
        for (let j = 0; j < bad_letters.length; j++) {
            letter = bad_letters.charAt(j)
            if (word.includes(letter)) {
                isGoodWord = false;
            }
        }
        for (let k=0; k<known.length; k++) {
            let key = known[k];

            let idx = parseInt(key[0]);
            letter = key[1].toLowerCase();
            let color = key[2];
            if (color === 'crimson') {
                if (word.includes(letter)) {
                    isGoodWord = false;
                }
            } else if (color === 'orange') {
                if (!word.includes(letter) || word.charAt(idx) === letter) {
                    isGoodWord = false;
                }
            } else if (color === 'green') {
                if (word.charAt(idx) != letter) {
                    isGoodWord = false;
                }
            }
        }
        if (isGoodWord) {
            goodWords.push(word)
        }
    }
    formatWords(goodWords)
}

function resetBoard(){
    document.getElementById("whereToPrint").innerHTML = "";
    document.getElementById("badLetterField").value = "";
    for (let i=0; i<5; i++){
        let idx = i.toString();
        let box = document.getElementById(idx);
        while (box.hasChildNodes()){
            let child = box.firstElementChild;
            box.removeChild(child);
        }
    }
}

function input(e) {
    let tbInput = document.getElementById("badLetterField");
    tbInput.value = tbInput.value + e.id;
}

function del() {
    let tbInput = document.getElementById("badLetterField");
    tbInput.value = tbInput.value.substr(0, tbInput.value.length - 1);
}

function wordIsValid(word, hand) {
  if (word.length === 0) {
    return false;
  }
  word = word.toLowerCase();
  hand = hand.map(tok => tok.toLowerCase());

  function checkWord(word, hand) {
    if (word.length === 0) {
      return true;
    }
    for (let tok of hand) {
      if (word.startsWith(tok)) {
        hand.splice(hand.indexOf(tok), 1);
        if (checkWord(word.slice(tok.length), hand)) {
          return true;
        }
      }
    }
    return false;
  }

  return checkWord(word, hand);
}

const tokens = ["A", "AB", "AC", "AD", "AF", "AG", "AI", "AJ", "AK", "AL", "AM", "AN", "AP", "AR", "AS", "AT", "AU", "AV", "AW", "AY", "B", "BA", "BE", "BI", "BJ", "BL", "BO", "BR", "BU", "BY", "C", "CA", "CC", "CE", "CH", "CI", "CK", "CL", "CO", "CR", "CT", "CU", "CY", "D", "DA", "DD", "DE", "DG", "DI", "DO", "DR", "DS", "DU", "DY", "E", "EA", "EC", "ED", "EE", "EF", "EG", "EH", "EI", "EL", "EM", "EN", "EO", "EP", "EQ", "ER", "ES", "ET", "EV", "EW", "EX", "EY", "F", "FA", "FE", "FF", "FI", "FL", "FO", "FR", "FT", "FU", "G", "GA", "GE", "GG", "GH", "GI", "GL", "GN", "GO", "GR", "GS", "GT", "GU", "GY", "H", "HA", "HE", "HI", "HL", "HN", "HO", "HR", "HS", "HT", "HU", "HY", "I", "IA", "IB", "IC", "ID", "IE", "IF", "IG", "IK", "IL", "IM", "IN", "IO", "IP", "IR", "IS", "IT", "IV", "IX", "IZ", "J", "JE", "JO", "JU", "K", "KE", "KI", "KL", "KN", "KS", "L", "LA", "LB", "LD", "LE", "LF", "LI", "LL", "LM", "LO", "LP", "LR", "LS", "LT", "LU", "LV", "LW", "LY", "M", "MA", "MB", "ME", "MI", "MM", "MO", "MP", "MS", "MU", "MY", "N", "NA", "NC", "ND", "NE", "NF", "NG", "NI", "NL", "NM", "NN", "NO", "NS", "NT", "NU", "NV", "NY", "O", "OA", "OB", "OC", "OD", "OE", "OF", "OG", "OI", "OJ", "OK", "OL", "OM", "ON", "OO", "OP", "OR", "OS", "OT", "OU", "OV", "OW", "OX", "P", "PA", "PE", "PH", "PI", "PL", "PM", "PO", "PP", "PR", "PS", "PT", "PU", "Q", "QU", "R", "RA", "RC", "RD", "RE", "RF", "RG", "RI", "RK", "RL", "RM", "RN", "RO", "RR", "RS", "RT", "RU", "RV", "RY", "S", "SA", "SC", "SE", "SF", "SH", "SI", "SK", "SL", "SM", "SO", "SP", "SS", "ST", "SU", "SY", "T", "TA", "TE", "TH", "TI", "TL", "TM", "TO", "TR", "TS", "TT", "TU", "TW", "TY", "U", "UA", "UB", "UC", "UD", "UE", "UG", "UI", "UL", "UM", "UN", "UP", "UR", "US", "UT", "V", "VA", "VE", "VI", "VO", "VY", "W", "WA", "WE", "WH", "WI", "WL", "WN", "WO", "WR", "WS", "WT", "X", "XA", "XC", "XI", "XP", "XT", "Y", "YE", "YI", "YL", "YO", "YP", "YS", "Z", "ZE"]
