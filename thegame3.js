var theGame3 = function(game){
	var bg;
	score = 0;
  scoreText = null;
  var aliens;
  var gameoverText;
  var gameoverText1;
}

theGame3.prototype = {


create: function() {


    bg= this.game.add.tileSprite(0, 0, 300, 500, 'BG');
    bg.fixedToCamera = true;


    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.maxWidth = this.game.width;
    this.scale.maxHeight = this.game.height;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.setScreenSize( true );


    this.physics.startSystem( Phaser.Physics.ARCADE );


    this.cameraYMin = 99999;
    this.platformYMin = 99999;


    this.platformsCreate();



    this.heroCreate();
    this.invaderCreate()


    this.cursor = this.input.keyboard.createCursorKeys();

    scoreText = this.game.add.text(16, 16, 'Score: 0',
      { fontSize: '12px', fill: '#ffffff' });
      scoreText.fixedToCamera = true;



        gameoverText = this.game.add.text(this.world.centerX, this.world.centerY, 'test', {font: "40px Arial", fill:"#000000", align: "center"});
        gameoverText.anchor.setTo(0.5,0.5);
        gameoverText.visible = false;
        gameoverText.fixedToCamera = true;

        gameoverText1 = this.game.add.text(this.world.centerX, 290, 'test', {font: "12px Arial", fill:"#000000", align: "center"});
        gameoverText1.anchor.setTo(0.5,0.5);
        gameoverText1.visible = false;
        gameoverText1.fixedToCamera = true;



  },




  update: function() {

    this.world.setBounds( 0, -this.hero.yChange, this.world.width, this.game.height + this.hero.yChange );

    this.cameraYMin = Math.min( this.cameraYMin, this.hero.y - this.game.height + 100 );
    this.camera.y = this.cameraYMin;


    this.physics.arcade.collide( this.hero, this.platforms);
    this.physics.arcade.overlap(this.enemyPool,this.hero, this.enemyHitsPlayer, null, this);


    if (this.nextEnemyAt < this.time.now && this.enemyPool.countDead() > 0) {
      this.nextEnemyAt = this.time.now + this.enemyDelay;
      var enemy = this.enemyPool.getFirstExists(false);
      // spawn at a random location top of the screen
      enemy.reset(this.rnd.integerInRange(0, 300), this.cameraYMin-100);
      // also randomize the speed
      enemy.body.velocity.y = 90;
    }



    this.heroMove();




    this.platforms.forEachAlive( function( elem ) {
      this.platformYMin = Math.min( this.platformYMin, elem.y );
      if( elem.y > this.camera.y + this.game.height ) {
        score += 10;
        scoreText.setText('Score: ' + score);
        elem.kill();
        this.platformsCreateOne( this.rnd.integerInRange( 0, this.world.width - 50 ), this.platformYMin - 100, 50 );


      }
    }, this );

  },

  shutdown: function() {

    this.world.setBounds( 0, 0, this.game.width, this.game.height );
    this.cursor = null;
    this.hero.destroy();
    this.hero = null;
    this.platforms.destroy();
    this.platforms = null;
    score=0;
  },

  platformsCreate: function() {

    this.platforms = this.add.group();
    this.platforms.enableBody = true;
    this.platforms.createMultiple( 10, 'pixel' );


//Gera o Chão
    this.platformsCreateOne( -16, this.world.height - 16, this.world.width + 16 );
//Gera as 9 primeiras plataformas
    for( var i = 0; i < 9; i++ ) {
      this.platformsCreateOne( this.rnd.integerInRange( 0, this.world.width - 50 ), this.world.height - 100 - 100 * i, 50 );
    }
  },

  platformsCreateOne: function( x, y, width ) {

    var platform = this.platforms.getFirstDead();
    platform.reset( x, y );
    platform.scale.x = width;
    platform.scale.y = 16;
    platform.body.immovable = true;
    return platform;
  },


  heroCreate: function() {

    this.hero = this.game.add.sprite( this.world.centerX, this.world.height - 36, 'hero' );
    this.hero.anchor.set( 0.5 );


    this.hero.yOrig = this.hero.y;
    this.hero.yChange = 0;


    this.physics.arcade.enable( this.hero );
    this.hero.body.gravity.y = 500;
    this.hero.body.checkCollision.up = false;
    this.hero.body.checkCollision.left = false;
    this.hero.body.checkCollision.right = false;
  },

  invaderCreate: function(){
    //this.aliens = game.add.sprite( this.world.leftX, this.world.height - 400, 'invader' );
    //var tween = game.add.tween(this.aliens).to( { x: 280 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    this.enemyPool = this.add.group();
    this.enemyPool.enableBody = true;
    this.enemyPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.enemyPool.createMultiple(50, 'invader');
    this.enemyPool.setAll('anchor.x', 0.5);
    this.enemyPool.setAll('anchor.y', 0.5);
    this.enemyPool.setAll('outOfBoundsKill', true);
    this.enemyPool.setAll('checkWorldBounds', true);
    this.nextEnemyAt = 0;
    this.enemyDelay = 500;


  },

  enemyHitsPlayer: function(){
    this.hero.kill();
    //this.enemyPool.kill();
    gameoverText.text = 'Game over';
    gameoverText.visible = true;
    gameoverText1.text = 'Pressione F5 para recomeçar';
    gameoverText1.visible = true;



  },



  heroMove: function() {
    // handle the left and right movement of the hero
    if( this.cursor.left.isDown ) {
      this.hero.body.velocity.x = -200;
    } else if( this.cursor.right.isDown ) {
      this.hero.body.velocity.x = 200;
    } else {
      this.hero.body.velocity.x = 0;
    }


    if( this.cursor.up.isDown && this.hero.body.touching.down ) {
      this.hero.body.velocity.y = -350;
    }


    this.world.wrap( this.hero, this.hero.width / 2, false );


    this.hero.yChange = Math.max( this.hero.yChange, Math.abs( this.hero.y - this.hero.yOrig ) );


    if( this.hero.y > this.cameraYMin + this.game.height && this.hero.alive ) {
      this.hero.kill();
      gameoverText.text = 'Game over';
      gameoverText.visible = true;
      gameoverText1.text = 'Pressione F5 para recomeçar';
      gameoverText1.visible = true;
    }
  }
}
