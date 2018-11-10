var Jumper = function() {};
Jumper.Play = function() {};

Jumper.Play.prototype = {

  preload: function() {
    this.load.image( 'hero', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/836/dude.png' );
    this.load.image( 'pixel', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/836/pixel_1.png' );
  },

  create: function() {

    this.stage.backgroundColor = '#00BFFF';


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


    this.cursor = this.input.keyboard.createCursorKeys();
  },

  update: function() {

    this.world.setBounds( 0, -this.hero.yChange, this.world.width, this.game.height + this.hero.yChange );


    this.cameraYMin = Math.min( this.cameraYMin, this.hero.y - this.game.height + 200 );
    this.camera.y = this.cameraYMin;


    this.physics.arcade.collide( this.hero, this.platforms );
    this.heroMove();


    this.platforms.forEachAlive( function( elem ) {
      this.platformYMin = Math.min( this.platformYMin, elem.y );
      if( elem.y > this.camera.y + this.game.height ) {
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
  },

  platformsCreate: function() {

    this.platforms = this.add.group();
    this.platforms.enableBody = true;
    this.platforms.createMultiple( 10, 'pixel' );


    this.platformsCreateOne( -16, this.world.height - 16, this.world.width + 16 );

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

    this.hero = game.add.sprite( this.world.centerX, this.world.height - 36, 'hero' );
    this.hero.anchor.set( 0.5 );


    this.hero.yOrig = this.hero.y;
    this.hero.yChange = 0;


    this.physics.arcade.enable( this.hero );
    this.hero.body.gravity.y = 500;
    this.hero.body.checkCollision.up = false;
    this.hero.body.checkCollision.left = false;
    this.hero.body.checkCollision.right = false;
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
      this.state.start( 'Play' );
    }
  }
}

var game = new Phaser.Game( 300, 500, Phaser.CANVAS, '' );
game.state.add( 'Play', Jumper.Play );
game.state.start( 'Play' );
