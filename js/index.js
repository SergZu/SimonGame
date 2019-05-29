;
(function (){
  'use strict'
  // Main object constructor
  function SimonGame() {
    let self = this;
    self.scope = 0;
    self.state = 'offline';
    self.struct = false;
    self.gameSeq = [];
    self.userSeq = [];
    self.countDiv = document.getElementsByClassName('game-count');
    self.sectorsDiv = document.getElementsByClassName('game-sector');
    self.sound = {
    blue: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'), 
    red: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'), 
    yellow: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'), 
    green: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
  }
    
    SimonGame.prototype.resetGame = function(){
        self.gameSeq = [];
        self.scope = 0;
        
        self.addCount();
    };
    
    SimonGame.prototype.addCount = function(){
      self.scope++;
      self.countDiv[0].innerText = '' + self.scope;
      setTimeout(function(){
        self.countDiv[0].innerText = '  ';
        setTimeout(function(){
          self.countDiv[0].innerText = '' + self.scope; 
        }, 200)
      }, 200);
    };
    
   SimonGame.prototype.playAudio = function(id) {
  // Plays the correct audio file.
     let sound = +id;
  switch (sound) {
    case 1:
      self.sound.green.play();
      break;
    case 2:
      self.sound.red.play();
      break;
    case 3:
      self.sound.yellow.play();
      break;
    case 4:
      self.sound.blue.play();
      break;
  }
}
    
    SimonGame.prototype.addToGameSeq = function(){
      let value = Math.floor(Math.random() * 4 + 1);
      self.gameSeq.push(value);
    };
    
    SimonGame.prototype.clearUserSeq = function(){
      self.userSeq = [];
    };
    
    SimonGame.prototype.getSpeed = function(){
      if (self.scope < 5) return 500;
      if (self.scope < 10) return 425;
      if (self.scope < 15) return 350;
      if (self.scope < 20) return 275;
    }; 
    
    SimonGame.prototype.showSector = function(n){
      var target = self.sectorsDiv[n-1];
      target.classList.add('led');
      self.playAudio(n);
      var timeout = self.getSpeed();
      setTimeout(function(){
        target.classList.remove('led');
      }, timeout)
    };
    
    SimonGame.prototype.showSeq = function(){
      let n = 0;
      let showTimeout = self.getSpeed()+100;
      var moves = setInterval(function(){
        self.showSector(self.gameSeq[n]);
        n++;
        if (n >= self.gameSeq.length) clearInterval(moves);
      }, showTimeout);
      self.clearUserSeq();
      self.makeClickable(self.sectorsDiv, 'on');
    };
    
    SimonGame.prototype.addToUserSeq = function(id){
      let sectorNum = +id;
      self.userSeq.push(sectorNum);
      self.readUserSeq(sectorNum);
    };
    
    SimonGame.prototype.makeClickable = function(element, state){
      for(let n = 0; n < element.length; n++){
        if (state === 'on') {
          element[n].classList.add('clickable');
          element[n].classList.remove('unclickable');
        }
        else {
          element[n].classList.add('unclickable');
          element[n].classList.remove('clickable');
        };
      };  
    };
    
    SimonGame.prototype.nextRound = function(){
      self.makeClickable(self.sectorsDiv, 'off');
      self.addCount();
      self.addToGameSeq();
      self.showSeq();
    };
    
    SimonGame.prototype.showError = function(){
      self.countDiv[0].innerText = 'Err';
      setTimeout(function(){
        self.countDiv[0].innerText = '  ';
        setTimeout(function(){
          self.countDiv[0].innerText = '' + self.scope; 
        }, 600)
      }, 600);
    };
    
    SimonGame.prototype.showWin = function(){
      self.countDiv[0].innerText = 'Win';
      setTimeout(function(){
        self.countDiv[0].innerText = '!!!';
        setTimeout(function(){
          self.countDiv[0].innerText = '   ' ; 
        }, 800)
      }, 800);
    };
 
    SimonGame.prototype.readUserSeq = function(sector){
      let userSeqLength = self.userSeq.length;
      let gameSeqLength = self.gameSeq.length;
      if (self.userSeq[userSeqLength - 1] !== self.gameSeq[userSeqLength - 1]) {
        if (self.strict){
          self.showError();
          self.resetGame();
          self.addToGameSeq();
          self.showSeq();
        }
        else {
          self.showError();
          self.showSeq();
        }
      }
      else {
        let check = userSeqLength === gameSeqLength;
        if (check) {
          if (self.scope === 20){
            self.showWin();
            self.resetGame();
            self.addToGameSeq();
            self.showSeq();
          }
          else {
            self.nextRound();
          }
        }
      }
    }; 
    
    SimonGame.prototype.strictMode = function(){
      if (self.strict) {
        self.strict = false;
        document.getElementsByClassName('game-strict')[0].classList.remove('led');
      }
      else {    
        self.strict = true;
        document.getElementsByClassName('game-strict')[0].classList.add('led');
      }
    };
    
    SimonGame.prototype.onOff = function(){
      if (self.state === 'offline'){
        self.state = 'on';
        console.log('on');
        document.getElementsByClassName('game-on')[0].classList.add('led');
        self.makeClickable( document.getElementsByClassName('game-control'), 'on');
      }
      else {
        self.state = 'offline';
        console.log('off');
        document.getElementsByClassName('game-on')[0].classList.remove('led');
        self.strict = false;
        document.getElementsByClassName('game-strict')[0].classList.remove('led');
        self.makeClickable( document.getElementsByClassName('game-control'), 'off');
        self.makeClickable(self.sectorsDiv, 'off');
        self.gameSeq = [];
        self.scope = 0;
        self.countDiv[0].innerText = ' ';
      }
    };
    
    SimonGame.prototype.initGame = function(){
      if (self.state !== 'started'){
        self.state = 'started';
        self.resetGame();
        self.addToGameSeq();
        self.showSeq();
      }
    };
    
};// End of constructor
  
  var Game = new SimonGame();
  
  let powerButton = document.getElementsByClassName('game-on')[0];
  let startButton = document.getElementsByClassName('game-start')[0];
  let strictButton = document.getElementsByClassName('game-strict')[0];
  let sectors = Game.sectorsDiv;
  
  //Set button click events
  powerButton.addEventListener('click', Game.onOff);
  startButton.addEventListener('click', Game.initGame);
  strictButton.addEventListener('click', Game.strictMode);
  
  for(let n = 0; n < sectors.length; n++){
    sectors[n].addEventListener('click', function(event){
      let id = event.target.id;
      Game.showSector(id);
      Game.addToUserSeq(id);
    });
  }
  
})();
