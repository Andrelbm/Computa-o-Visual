var preload = function(game){}

preload.prototype = {
	preload: function(){

          this.load.image( 'pixel', 'assets/pixel.png' );
          this.load.image('BG', 'assets/BG.png');
          this.load.image('invader', 'assets/invader.png');
          this.load.image('botao1','assets/botao1.png');
          this.load.image('botao2','assets/botao2.png');
          this.load.image('botao3','assets/botao3.png');
          this.load.image( 'hero', 'assets/dude.png' );
          this.load.image( 'nome', 'assets/nome.png' );

	},
  	create: function(){
		this.game.state.start("GameTitle");
	}
}
