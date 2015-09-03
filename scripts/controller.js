/*
 * Copyright 2014, Gregg Tavares.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Gregg Tavares. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
"use strict";

// Start the main app logic.
requirejs([
    'hft/commonui',
    'hft/gameclient',
    'hft/misc/input',
    'hft/misc/misc',
    'hft/misc/mobilehacks',
    'hft/misc/touch',
  ], function(
    CommonUI,
    GameClient,
    Input,
    Misc,
    MobileHacks,
    Touch) {

  var globals = {
    debug: false,
    currentPrice: 100,
    cash : 1000,
    stock : 10,
  };
  Misc.applyUrlSettings(globals);
  MobileHacks.fixHeightHack();

  // var score = 0;
  // var statusElem = document.getElementById("gamestatus");
  // var inputElem = document.getElementById("inputarea");
  var colorElem = document.getElementById("display");
  var priceElem = document.getElementById("price");
  var cashElem = document.getElementById("cash");
  var stockElem = document.getElementById("stock");

  var client = new GameClient();

  CommonUI.setupStandardControllerUI(client, globals);

  var randInt = function(range) {
    return Math.floor(Math.random() * range);
  };

  // Sends a move command to the game.
  //
  // This will generate a 'move' event in the corresponding
  // NetPlayer object in the game.
  // var sendMoveCmd = function(position, target) {
  //   client.sendCmd('move', {
  //     x: position.x / target.clientWidth,
  //     y: position.y / target.clientHeight,
  //   });
  // };
  var buyCmd = function() {
      client.sendCmd('buy',{});
  }

  var sellCmd = function() {
      client.sendCmd('sell',{});
  }

  // Pick a random color
  var color =  'rgb(' + randInt(128) + "," + randInt(128) + "," + randInt(128) + ")";
  // Send the color to the game.
  //
  // This will generate a 'color' event in the corresponding
  // NetPlayer object in the game.
  client.sendCmd('color', {
    color: color,
  });
  colorElem.style.backgroundColor = color;

  // Send a message to the game when the screen is touched
  // inputElem.addEventListener('pointermove', function(event) {
  //   var position = Input.getRelativeCoordinates(event.target, event);
  //   sendMoveCmd(position, event.target);
  //   event.preventDefault();
  // });

  var bb = document.getElementById("buyBut");
  bb.addEventListener('click',function(event) {
    client.sendCmd('buy',{});
    event.preventDefault();
  });

  var sb = document.getElementById("sellBut");
  sb.addEventListener('click',function(event) {
    client.sendCmd('sell',{});
    event.preventDefault();
  });

  var updatePriceView = function() {
    priceElem.innerHTML = globals.currentPrice;
  }

  var updateOwnView = function() {
    cashElem.innerHTML = globals.cash;
    stockElem.innerHTML = globals.stock;
  }

  // Update our score when the game tells us.
  // client.addEventListener('scored', function(cmd) {
  //   score += cmd.points;
  //   statusElem.innerHTML = "You scored: " + cmd.points + " total: " + score;
  // });
  client.addEventListener('updateprice', function(cmd) {
    globals.currentPrice = cmd.currentPrice;
    updatePriceView();
  });

  client.addEventListener('stats', function(cmd) {
    // globals.currentPrice = cmd.currentPrice;
    globals.cash = cmd.cash;
    globals.stock = cmd.stock;
    updateOwnView();
  });
});

