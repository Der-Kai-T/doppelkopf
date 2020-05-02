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

var deck_0 = [];
var deck_1 = [];
var deck_2 = [];
var deck_3 = [];
var deck_4 = [];

var decks = [];

function preload(){

    decks.push(deck_0);
    decks.push(deck_1);
    decks.push(deck_2);
    decks.push(deck_3);
    decks.push(deck_4);

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



function setup(){
  createCanvas(1920,1080);
  background(0, 255, 0);

  socket = io.connect();
  socket.on('ablage_array', newAblage_array);
  socket.on('new_game', new_game_received);
  socket.on('neuer_stich', neuer_stich_received);
  socket.on('armut', armut_received);
  socket.on('observer_hand_1', hand_1_received);
  socket.on('observer_hand_2', hand_2_received);
  socket.on('observer_hand_3', hand_3_received);
  socket.on('observer_hand_4', hand_4_received);


}

function newAblage_array(data){
  var temp_array = [];
  for(var i = 0; i<data.length; i++){
    temp_array.push(new Deck(i, data[i].img_nr));
    temp_array[i].deck_nr = 0;
  }
  decks[0] = temp_array;
  draw_all();
}


function new_game_received(data){

  console.log(data);
    var shuffled_karten_nummern = data;
    decks[0] = [];
    for(var j = 1; j<=4; j++){
      decks[j] = [];

      for(var i = 0; i<karten_pro_spiel; i++){
        var img_nrr = i + ((j-1)*karten_pro_spiel);
        decks[j].push(new Deck(i, shuffled_karten_nummern[img_nrr]));
        decks[j][i].deck_nr = j;
      }
  }
  draw_all();
}


function neuer_stich_received(data){
  decks[0] = [];
  draw_all();
}


function armut_received(data){
  var temp_array = [];
  for(var i = 0; i<data.length; i++){
    temp_array.push(new Deck(i, data[i].img_nr));
    temp_array[i].deck_nr = 0;
  }
  decks[0] = temp_array;
  draw_all();
}


function hand_1_received(data){

  var temp_array = [];
  for(var i = 0; i<data.length; i++){
    temp_array.push(new Deck(data[i].pos, data[i].img_nr));
    temp_array[i].deck_nr = 1;
  }
  decks[1] = temp_array;
  draw_all();
}


function hand_2_received(data){
  var temp_array = [];
  for(var i = 0; i<data.length; i++){
    temp_array.push(new Deck(data[i].pos, data[i].img_nr));
    temp_array[i].deck_nr = 2;
  }
  decks[2] = temp_array;
  draw_all();
}


function hand_3_received(data){
  var temp_array = [];
  for(var i = 0; i<data.length; i++){
    temp_array.push(new Deck(data[i].pos, data[i].img_nr));
    temp_array[i].deck_nr = 3;
  }
  decks[3] = temp_array;
  draw_all();
}


function hand_4_received(data){
  var temp_array = [];
  for(var i = 0; i<data.length; i++){
    temp_array.push(new Deck(data[i].pos, data[i].img_nr));
    temp_array[i].deck_nr = 4;
  }
  decks[4] = temp_array;
  draw_all();
}


function draw_all(){
  background(0,255,0);
  for(var j = 0; j<=4; j++){
    for(var i = 0; i<decks[j].length; i++){
      decks[j][i].draw();
    }
  }
}


function Deck (pos, img_nr, deck){
  this.pos = pos;
  this.img_nr = img_nr
  this.img = img_array[this.img_nr];

  this.deck_nr = deck;
  this.l=0;

  this.r=0;
  this.t=0;
  this.b=0;


  this.draw = function() {

      push();
      var space = karten_im_deck *4;
      var x = ((width/karten_im_deck)*this.pos) + ((width/space)/2);
      var w = (width/karten_im_deck)-(width/space) - 25;
      var h = (507/348)*w;
      var y = (this.deck_nr*h)+(this.deck_nr*25);

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

  }








}
