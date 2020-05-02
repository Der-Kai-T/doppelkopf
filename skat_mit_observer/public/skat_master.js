//global Variables

var karten_pro_spiel = 10;
var karten_im_deck = 10;

var deck_array = [];
var img_array = [];
var img_strings = [];

var karten_nummern = [];

var ui_elements = [];

var ablage_array = [];

var armut_array = [];

var spielernummer = 0;

var socket;

var stiche = [];

var stich_anzeigen = 0;

var img_back;

function preload(){
    img_strings.push("herz_ass.png");
    img_strings.push("herz_bube.png");
    img_strings.push("herz_dame.png");
    img_strings.push("herz_king.png");
    img_strings.push("herz_zehn.png");

    img_strings.push("karo_ass.png");
    img_strings.push("karo_bube.png");
    img_strings.push("karo_dame.png");
    img_strings.push("karo_king.png");
    img_strings.push("karo_zehn.png")

    img_strings.push("kreuz_ass.png");
    img_strings.push("kreuz_bube.png");
    img_strings.push("kreuz_dame.png");
    img_strings.push("kreuz_king.png");
    img_strings.push("kreuz_zehn.png")

    img_strings.push("pik_ass.png");
    img_strings.push("pik_bube.png");
    img_strings.push("pik_dame.png");
    img_strings.push("pik_king.png");
    img_strings.push("pik_zehn.png")

    img_strings.push("herz_ass.png");
    img_strings.push("herz_bube.png");
    img_strings.push("herz_dame.png");
    img_strings.push("herz_king.png");
    img_strings.push("herz_zehn.png");

    img_strings.push("karo_ass.png");
    img_strings.push("karo_bube.png");
    img_strings.push("karo_dame.png");
    img_strings.push("karo_king.png");
    img_strings.push("karo_zehn.png")

    img_strings.push("kreuz_ass.png");
    img_strings.push("kreuz_bube.png");
    img_strings.push("kreuz_dame.png");
    img_strings.push("kreuz_king.png");
    img_strings.push("kreuz_zehn.png")

    img_strings.push("pik_ass.png");
    img_strings.push("pik_bube.png");
    img_strings.push("pik_dame.png");
    img_strings.push("pik_king.png");
    img_strings.push("pik_zehn.png")

    for (var i = 0; i< img_strings.length; i++){
      img_array.push(loadImage('img/' + img_strings[i]));
      karten_nummern.push(i);
    }

    img_back = loadImage('img/back.png');


}

function newGame(){
  if(spielernummer == 0){
    //alert("Bitte eine Spielernummer festlegen");
  }else{
    var shuffled_karten_nummern = shuffle(karten_nummern);
    console.log(shuffled_karten_nummern);
    deck_array = [];
    ablage_array = [];
    armut_array = [];
    stiche = [];
    stich_anzeigen = 0;

    for(var i = 0; i<karten_pro_spiel; i++){
      var img_nrr = i + ((spielernummer-1)*karten_pro_spiel);
      deck_array.push(new Deck(i, shuffled_karten_nummern[img_nrr]));
    }

    draw_full_deck();
    socket.emit('new_game', shuffled_karten_nummern);
    draw_full_deck();
  }
}


function createUI(){

  //***************************************************
  // Karten tauschen
  var action = function(){
    var a,b;

    for (var i = 0; i< deck_array.length; i++){
      if(a == null){
        if(deck_array[i].highlight){
          a = i;
        }
      }else{
        if(deck_array[i].highlight){
          b = i;
          i= deck_array.length +10;
        }
      }
    }
    console.log("A=" + a + " B=" + b);
    for (var i = 0; i< deck_array.length; i++){
      deck_array[i].highlight = false;
    }
    move_deck(a,b);

    if(spielernummer == 1){
        socket.emit('observer_hand_1', deck_array);
    }
    if(spielernummer == 2){
        socket.emit('observer_hand_2', deck_array);
    }
    if(spielernummer == 3){
        socket.emit('observer_hand_3', deck_array);
    }
    if(spielernummer == 4){
        socket.emit('observer_hand_4', deck_array);
    }

  }
  ui_elements.push(new UI_Element(100,height-200,"Karten tauschen", action));
  //ui_elements.push(new UI_Element(100,50,"Karten tauschen", action));
  ui_elements.push(new UI_Element(width-200,height-200,"Karten tauschen", action));

  //***************************************************
  // Karte ablegen:
  action = function(){
      for (var i = 0; i< deck_array.length; i++){
        if(deck_array[i].highlight){
          deck_array[i].in_deck = false;
          deck_array[i].highlight = false;

          ablage_array.push(deck_array[i]);
          deck_array.splice(i,1);
          i = deck_array.length+10;

        }
      }
      socket.emit('ablage_array', ablage_array);
      if(spielernummer == 1){
          socket.emit('observer_hand_1', deck_array);
      }
      if(spielernummer == 2){
          socket.emit('observer_hand_2', deck_array);
      }
      if(spielernummer == 3){
          socket.emit('observer_hand_3', deck_array);
      }
      if(spielernummer == 4){
          socket.emit('observer_hand_4', deck_array);
      }
      draw_full_deck();
  }
  ui_elements.push(new UI_Element(200,50,"Karte ablegen", action));

  //***************************************************
// Ablagestapel leeren
  action = function(){
    stiche.push(ablage_array);
    ablage_array = [];
    socket.emit('neuer_stich', ablage_array);
    draw_full_deck();
  }
  ui_elements.push(new UI_Element(450,50,"Ablage weg", action));

  // Neues Spiel
  action = function(){
    newGame();

    }
    ui_elements.push(new UI_Element(550,50,"neu", action));

//Stiche scroll
    action = function(){
      stich_anzeigen += 1;
      if(stich_anzeigen-1 < stiche.length){
        ablage_array = [];
        ablage_array = stiche[stich_anzeigen-1];
        socket.emit('ablage_array', ablage_array);
        draw_full_deck();
      }

    }
    ui_elements.push(new UI_Element(700,50,"Stiche + 1", action));

    action = function(){
      stich_anzeigen -= 1;
      if(stich_anzeigen-1 < stiche.length && stich_anzeigen-1>=0){
        ablage_array = [];
        ablage_array = stiche[stich_anzeigen-1];
        socket.emit('ablage_array', ablage_array);
        draw_full_deck();
      }

    }
    ui_elements.push(new UI_Element(700,100,"Stiche -1 ", action));

    // Armut geben
      action = function(){
        for (var i = deck_array.length-1; i>0 ; i--){
          if(deck_array[i].highlight){
            deck_array[i].in_deck = false;
            deck_array[i].highlight = false;
            deck_array[i].armut = true;

            armut_array.push(deck_array[i]);
            deck_array.splice(i,1);

          }
        }
        socket.emit('armut', armut_array);
        reorder_deck();
        if(spielernummer == 1){
            socket.emit('observer_hand_1', deck_array);
        }
        if(spielernummer == 2){
            socket.emit('observer_hand_2', deck_array);
        }
        if(spielernummer == 3){
            socket.emit('observer_hand_3', deck_array);
        }
        if(spielernummer == 4){
            socket.emit('observer_hand_4', deck_array);
        }
        draw_full_deck();
      }
      ui_elements.push(new UI_Element(450,200,"Armut geben", action));


    // Ablagestapel nehmen
      action = function(){
          for(var i = 0; i < armut_array.length; i++){
            armut_array[i].in_deck = true;
            armut_array[i].armut = false;
            deck_array.push(armut_array[i]);
          }
          armut_array = [];
            socket.emit('armut', armut_array);
          reorder_deck();
          if(spielernummer == 1){
              socket.emit('observer_hand_1', deck_array);
          }
          if(spielernummer == 2){
              socket.emit('observer_hand_2', deck_array);
          }
          if(spielernummer == 3){
              socket.emit('observer_hand_3', deck_array);
          }
          if(spielernummer == 4){
              socket.emit('observer_hand_4', deck_array);
          }
          draw_full_deck();
      }
      ui_elements.push(new UI_Element(550,200,"Armut nehmen", action));






//Spielernummern

  //***************************************************
// Spieler 1
  action = function(){
    spielernummer = 1;
    draw_full_deck();
  }
  ui_elements.push(new UI_Element(width - 50,50,"Spieler 1", action));


  //***************************************************
  action = function(){
    spielernummer = 2;
    draw_full_deck();
  }
  ui_elements.push(new UI_Element(width - 50,150,"Spieler 2", action));
//***************************************************
  action = function(){
    spielernummer = 3;
    draw_full_deck();
  }
  ui_elements.push(new UI_Element(width - 50,250,"Spieler 3", action));
//***************************************************
  action = function(){
    spielernummer = 4;

    draw_full_deck();
  }
  ui_elements.push(new UI_Element(width - 50,350,"Spieler 4", action));
}

function reorder_deck(){
  for (var i = 0; i< deck_array.length; i++){
    deck_array[i].pos = i;
    deck_array[i].draw();


  }
}


function setup(){
  createCanvas(1024,768);
  background(0, 97, 0);

  createUI();

  newGame();

  socket = io.connect();
  socket.on('ablage_array', newAblage_array);
  socket.on('new_game', new_game_received);
  socket.on('neuer_stich', neuer_stich_received);
  socket.on('armut', armut_received);


  draw_full_deck();

}

function armut_received(data){
  var temp_array = [];
  for(var i = 0; i<data.length; i++){
    temp_array.push(new Deck(data[i].pos, data[i].img_nr));
    temp_array[i].in_deck = false;
    temp_array[i].armut = true;
  }
  armut_array = temp_array;
  draw_full_deck();
}


function new_game_received(data){

  if(spielernummer == 0){
  //  alert("Bitte eine Spielernummer festlegen");
  }else{
  console.log(data);
    var shuffled_karten_nummern = data;
    deck_array = [];
    ablage_array = [];
    armut_array = [];
    stiche = [];
    stich_anzeigen = 0;
    for(var i = 0; i<karten_pro_spiel; i++){
      var img_nrr = i + ((spielernummer-1)*karten_pro_spiel);
      deck_array.push(new Deck(i, shuffled_karten_nummern[img_nrr]));
    }

    draw_full_deck();
  }
}

function neuer_stich_received(data){
  stiche.push(ablage_array);
  var temp_array = [];
  for(var i = 0; i<data.length; i++){
    temp_array.push(new Deck(data[i].pos, data[i].img_nr));
    temp_array[i].in_deck = false;
  }
  ablage_array = temp_array;
  draw_full_deck();
}


function newAblage_array(data){

  var temp_array = [];
  for(var i = 0; i<data.length; i++){
    temp_array.push(new Deck(data[i].pos, data[i].img_nr));
    temp_array[i].in_deck = false;
  }
  ablage_array = temp_array;
  draw_full_deck();
}

function mousePressed(){
  for(var i = 0 ; i< deck_array.length; i++){

  }
}

function draw_full_deck(){
    background(0, 97, 0);
    if(deck_array.length < 10){
      karten_im_deck = 10;
    }else{
      karten_im_deck = deck_array.length;
    }
  for (var i = 0; i< deck_array.length; i++){
    deck_array[i].draw();


  }

  for (var i = 0; i< ablage_array.length; i++){
    ablage_array[i].pos = i;
    ablage_array[i].draw();


  }
  for (var i = 0; i< armut_array.length; i++){
    armut_array[i].pos = i;
    armut_array[i].draw();


  }



  drawUI();

}


function UI_Element(x,y,label, action){
  this.w = 100;
  this.h = 50;
  this.x = x;
  this.y = y;
  this.label = label;
  this.click = action;
  this.highlight = false;

  this.draw = function(){
    push();
      translate(x,y);
      rectMode(CENTER);
      if(this.highlight){
        stroke(255,180,0,180);
      }else{
        stroke(255);
      }
      strokeWeight(2);
      noFill();
      rect(0,0,this.w,this.h);
      fill(255);
      noStroke();
      textAlign(CENTER);
      text(this.label, 0,0);
    pop();
  }

  this.clicked = function(){
    var l = this.x - (this.w/2);
    var r = this.x + (this.w/2);
    var t = this.y - (this.h/2);
    var b = this.y + (this.h/2);
    if(mouseX>l && mouseX<r && mouseY>t && mouseY<b){
      this.click();
    }

  }
}

function drawUI(){
  for(var i = 0; i<ui_elements.length; i++){
    ui_elements[i].draw();
  }

  push();
    fill(255);
    if(spielernummer == 0){
      text("bitte rechts einen Spieler auswählen", 700,50);
    }else{
      text("Spieler-Nummer: " + spielernummer, 800, 50 );
    }
  pop();
}


function move_deck(a, b){
  var pos_temp = deck_array[a].pos;
  deck_array[a].pos = deck_array[b].pos;
  deck_array[b].pos = pos_temp;
  draw_full_deck();
}

function mousePressed(){
  for (var i = 0; i< deck_array.length; i++){
    deck_array[i].click();
  }

  for (var i = 0; i< ui_elements.length; i++){
    ui_elements[i].clicked();
  }
}

function Deck (pos, img_nr){
  this.pos = pos;
  this.img_nr = img_nr
  this.img = img_array[this.img_nr];
  this.in_deck = true;
  this.highlight = false;
  this.armut = false;
  this.l=0;
  this.r=0;
  this.t=0;
  this.b=0;


  this.draw = function() {
    if(this.in_deck && this.armut == false){
      push();
      var space = karten_im_deck *4;
      var x = ((width/karten_im_deck)*this.pos) + ((width/space)/2);
      var w = (width/karten_im_deck)-(width/space);
      var h = (507/348)*w;
      var y = height-h - (height/space);

      this.l = x;
      this.r = x+w;
      this.t = y;
      this.b = y+h;

      translate(x, y);
      if(this.highlight){
        stroke(255,180,0,200);
        strokeWeight(10);
        rect(0,0,w,h);

      }else{

      }
      image(this.img, 0,0, w, h);
      pop();
    }else if (this.in_deck == false && this.armut == false){
      push();
      var space = karten_im_deck *4;
      var x = ((width/karten_im_deck)*this.pos) + ((width/space)/2);
      var w = (width/karten_im_deck)-(width/space);
      var h = (507/348)*w;
      var y = height/2;

      this.l = x;
      this.r = x+w;
      this.t = y;
      this.b = y+h;

      translate(x, y);
      if(this.highlight){
        stroke(255,180,0,200);
        strokeWeight(10);
        rect(0,0,w,h);

      }else{

      }
      image(this.img, 0,0, w, h);
      pop();
    } else if(this.armut == true){
      push();
      var space = karten_im_deck *4;
      var x = ((width/karten_im_deck)*this.pos) + ((width/space)/2);
      var w = (width/karten_im_deck)-(width/space);
      var h = (507/348)*w;
      var y = height/2-h;

      this.l = x;
      this.r = x+w;
      this.t = y;
      this.b = y+h;

      translate(x, y);
      if(this.highlight){
        stroke(255,180,0,200);
        strokeWeight(10);
        rect(0,0,w,h);

      }else{

      }
      image(img_back, 0,0, w, h);
      pop();
    }
  }


    this.click = function (){

      if(mouseX>this.l && mouseX<this.r && mouseY>this.t && mouseY<this.b){
        if(this.highlight){
          this.highlight = false;
        }else{
          this.highlight = true;
        }
        draw_full_deck();
      }
    }







}
