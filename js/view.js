var GAME = GAME || {};


GAME.view = {
  init: function() {
    this.draw();
    this.eventListeners.changeShipDirection();
    this.eventListeners.shootLasers();
    this.eventListeners.accelerateDecelerate();
    this.eventListeners.clickListener();
  },

  canvas: $('canvas').get(0),

  context: $('canvas').get(0).getContext("2d"),

  draw: function() {
    this.context.fillStyle="#000";
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawAsteroids();
    this.drawLasers();
    this.drawShip();

    $( "#score" ).text(GAME.score);

    if ( !GAME.playing ) {
      $( "#game-over" ).text("Game Over :-( Click to play again!");
    }
  },

  drawAsteroids: function() {
    $.each(GAME.controller.allAsteroids, function(i, astr) {
      GAME.view.context.beginPath();
      GAME.view.context.fillStyle = '#777';
      GAME.view.context.strokeStyle = GAME.view.randomColor();
      // arc(x, y, radius, angle, Math.PI * 2, false for clockwise/true for counter-clockwise)
      GAME.view.context.arc(astr.xCoord, astr.yCoord, astr.size, 0, Math.PI * 2, false)
      GAME.view.context.fill();
      GAME.view.context.stroke();
    });
  },

  drawShip: function() {
    var ship = GAME.controller.ship;
    var center = { x: ship.xCoord, y: ship.yCoord };

    var victor = ship.direction.clone();
    var nose = { x: ship.xCoord + victor.x, y: ship.yCoord + victor.y }

    var rotated = victor.rotateDeg(150)
    var backRight = { x: ship.xCoord + rotated.x, y: ship.yCoord + rotated.y }

    var taters = rotated.rotateDeg(60)
    var backLeft = { x: ship.xCoord + taters.x, y: ship.yCoord + taters.y }

    this.context.fillStyle = '#aaa';
    this.context.strokeStyle = GAME.view.randomColor();;
    this.context.beginPath();

    this.context.moveTo( center.x, center.y );

    this.context.lineTo( backRight.x, backRight.y );

    this.context.lineTo( nose.x, nose.y );

    this.context.lineTo( backLeft.x, backLeft.y );

    this.context.closePath();

    this.context.fill();
    this.context.stroke();
  },

  randomColor: function() {
    var r = Math.floor( Math.random() * 128 + 64 );
    var g = Math.floor( Math.random() * 128 + 64 );
    var b = Math.floor( Math.random() * 128 + 64 );
    return "rgb( " + r + "," + g + "," + b + " )";
  },

  drawLasers: function() {
    $.each(GAME.controller.getLasers(), function(i, laser) {
      var vector = new Victor(laser.size, 0);
      var rotated = vector.rotateDeg(laser.velocity.horizontalAngleDeg())

      GAME.view.context.strokeStyle = GAME.view.randomColor();
      GAME.view.context.beginPath();
      GAME.view.context.moveTo(laser.xCoord, laser.yCoord);
      GAME.view.context.lineTo(rotated.x + laser.xCoord, rotated.y + laser.yCoord);
      GAME.view.context.closePath();
      GAME.view.context.stroke();
    })
  },

  eventListeners: {
    changeShipDirection: function() {
      $( document ).keydown(function(e) {
        e.preventDefault();
        switch(e.which) {
          case 37:
          GAME.controller.turnShip(-1);
          break;

          case 39:
          GAME.controller.turnShip(1);
          break;
        }
      })


    },


    shootLasers: function() {
      $(document).keydown(function(e) {
        e.preventDefault();
        if (e.which === 32) {
          GAME.controller.shootLaser();
        }
      })
    },

    accelerateDecelerate: function() {
      $( document ).keydown(function(e) {
        e.preventDefault();
        switch(e.which) {
          case 38:
            GAME.controller.accelerateShip(1);
          break;

          case 40:
            GAME.controller.accelerateShip(-1);
          break;
        }
      })
    },

    clickListener: function() {
      $( "canvas" ).click( function(e) {
        location.reload();
      });
    }
  }
}
