var gameTitle = function(game){}

gameTitle.prototype = {
  	create: function(){
      var bg= this.game.add.tileSprite(0, 0, 300, 500, 'BG');
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
    this.invaderCreate();
    button = this.game.add.button(85, 190, 'botao1', this.actionOnClick, this, 2, 1, 0);
    button = this.game.add.button(85, 240, 'botao2', this.actionOnClick2, this, 2, 1, 0);
    button = this.game.add.button(85, 290, 'botao3', this.actionOnClick3, this, 2, 1, 0);
    var nome = this.game.add.image(-10, 10,'nome');
	},

  update: function() {

    if (this.nextEnemyAt < this.time.now && this.enemyPool.countDead() > 0) {
      this.nextEnemyAt = this.time.now + this.enemyDelay;
      var enemy = this.enemyPool.getFirstExists(false);
      // spawn at a random location top of the screen
      enemy.reset(this.rnd.integerInRange(0, 300), 0);
      // also randomize the speed
      enemy.body.velocity.y = 70;
    }


    this.platforms.forEachAlive( function( elem ) {
      this.platformYMin = Math.min( this.platformYMin, elem.y );
      if( elem.y > this.camera.y + this.game.height ) {
        elem.kill();
        this.platformsCreateOne( this.rnd.integerInRange( 0, this.world.width - 50 ), this.platformYMin - 100, 50 );
      }
    }, this );

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
    this.enemyPool.fixedToCamera = true;
    this.nextEnemyAt = 0;
    this.enemyDelay = 800;


  },
	actionOnClick: function(){
		this.game.state.start("TheGame");
	},
  actionOnClick2: function(){
		this.game.state.start("TheGame2");
	},
  actionOnClick3: function(){
		this.game.state.start("TheGame3");
	},
  
}
