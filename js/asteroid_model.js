GAME.asteroidModel = {

  init: function(numAsteroids) {
    this.asteroids = [];
    this.generateAsteroids(numAsteroids);
    this.deltaTime = 0;
    this.lastAsteroidCreatedAt = 0;
    this.astrToExplode = [];
  },


  Asteroid: function(xCoord, yCoord, size, xVelocity, yVelocity) {
    this.xCoord = xCoord || GAME.useful.randomX();
    this.yCoord = yCoord || GAME.useful.random(10, 790);
    this.size = size || GAME.useful.random(20,90);
    if (xVelocity && yVelocity) {
      this.velocity = new Victor( xVelocity, yVelocity );
    } else {
      this.velocity = new Victor( GAME.useful.randomVelocity(), GAME.useful.randomVelocity() );
    }

  },


  generateAsteroids: function(numAsteroids) {
    for (var i = 0; i < numAsteroids; i++) {
      var ast = new this.Asteroid();
      this.asteroids.push(ast);
    }
  },


  collisions: function(lasers) {
    for (var i = 0; i < this.asteroids.length; i++) {
      this.asteroidAsteroid(i);
      this.asteroidLaser(i, lasers);
      this.asteroidShip(i);
    }
  },


  asteroidAsteroid: function(i) {
    // check for asteroid collisions
    for (var j = 0; j < this.asteroids.length; j++) {
      if (i === j) {
        continue;
      }
      var astrA = this.asteroids[i];
      var astrB = this.asteroids[j];
      var distance = Math.sqrt( Math.pow(astrA.xCoord - astrB.xCoord, 2) + Math.pow(astrA.yCoord - astrB.yCoord, 2) );
      var sumRadii = astrA.size + astrB.size;

      if (distance <= sumRadii) {
        this.addAstrToExplode( astrA );
      }
    }
  },

  addAstrToExplode: function(astr) {
    if ( !this.astrToExplode.indexOf(astr) || this.astrToExplode.indexOf(astr) === -1 ) {
      this.astrToExplode.unshift(astr);
    }
  },

  asteroidLaser: function(i, lasers) {
    // check for laser collisions
    for (var k = 0; k < lasers.length; k ++) {
      var astr = this.asteroids[i]
      var radius = astr.size;
      var distance = Math.sqrt( Math.pow(astr.xCoord - lasers[k].xCoord, 2) + Math.pow(astr.yCoord - lasers[k].yCoord, 2) );

      if (distance <= radius) {
        // TODO: make sure it's not already there
        lasers.splice(k, 1)
        GAME.score += 1;
        this.addAstrToExplode(astr);
      }
    }
  },

  asteroidShip: function(i) {
    // check for ship collisions
    var astr = this.asteroids[i];
    var radius = astr.size + GAME.controller.ship.size / 2;
    var distance = Math.sqrt( Math.pow(astr.xCoord - GAME.controller.ship.xCoord, 2) + Math.pow(astr.yCoord - GAME.controller.ship.yCoord, 2) );

    if (distance <= radius) {
      GAME.playing = false;
    }
  },


  explodeAsteroids: function() {
    while ( this.astrToExplode.length > 0 ) {
      var astr = this.astrToExplode.pop();
      var collisionX = astr.xCoord;
      var collisionY = astr.yCoord;
      var originalSize = astr.size;
      var leftVector = astr.velocity.clone().rotateDeg(-60);
      var rightVector = astr.velocity.clone().rotateDeg(60);

      var aIdx = this.asteroids.indexOf(astr);

      //remove asteroid
      this.asteroids.splice(aIdx, 1);

      if (originalSize > 10) {
        var leftDisplace = (new Victor(originalSize, 0)).rotateDeg(leftVector.horizontalAngleDeg());

        var rightDisplace = (new Victor(originalSize, 0)).rotateDeg(rightVector.horizontalAngleDeg());

        this.asteroids.push( new GAME.asteroidModel.Asteroid(collisionX + leftDisplace.x, collisionY + leftDisplace.y, originalSize/2, leftVector.x, leftVector.y));

        // create new tiny asteroid, with random velocity
        this.asteroids.push( new GAME.asteroidModel.Asteroid(collisionX + rightDisplace.x, collisionY + rightDisplace.y, originalSize/2, rightVector.x, rightVector.y));
      }
    }
  },


  // TODO: make this better...
  update: function(lasers) {
    for ( var i = 0; i < this.asteroids.length; i++ ) {
      this.asteroids[i].tic();
    }
    this.collisions(lasers);
    this.explodeAsteroids();
    this.addNewAsteroid();
  },



  addNewAsteroid: function() {
    var d = new Date();
    this.deltaTime = d.getTime() - this.lastAsteroidCreatedAt;
    if (this.deltaTime > 5000) {
      this.generateAsteroids(1);
      this.lastAsteroidCreatedAt = d.getTime();
    }
  }

}

GAME.asteroidModel.Asteroid.prototype.tic = function() {
  this.xCoord += this.velocity.x;
  this.yCoord += this.velocity.y;

  this.wrap();
}



GAME.asteroidModel.Asteroid.prototype.wrap = function() {
  // if x-coord is < min width or > max, reset
  if (this.xCoord < 0) {
    this.xCoord = GAME.width + this.xCoord;
  } else if (this.xCoord > GAME.width) {
    this.xCoord = this.xCoord - GAME.width;
  } else if (this.yCoord < 0) {
    this.yCoord = GAME.height + this.yCoord;
  } else if (this.yCoord > GAME.height) {
    this.yCoord = this.yCoord - GAME.height;
  }
}
