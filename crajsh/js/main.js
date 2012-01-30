var tron = tron || {};
/*
tron.GAME_SMALL = 6;
tron.GAME_MEDIUM = 7;
tron.GAME_LARGE = 8;
tron.GAME_HUGE = 9;
*/

/*
tron.SAMPLE_SHOOT = 0;
tron.SAMPLE_EXPLODE = 1;
tron.SAMPLE_DIE = 2;
tron.SAMPLE_TELEPORT = 3;
tron.SAMPLE_WEAPON_UPGRADE = 4;
tron.SAMPLE_INVINCIBLE = 5;
tron.SAMPLE_INTRO = 6;
tron.SAMPLE_NEW_GAME = 7;
*/

/*
 tron.TEXTURE_PLAYERS = 0;
 tron.TEXTURE_OTHERTILES = 1;
 tron.TEXTURE_EYES = 2;
 tron.TEXTURE_BAR = 3;
 tron.TEXTURE_GFM = 4;
 tron.TEXTURE_MARS = 5;
 tron.TEXTURE_HELP = 6;
 tron.TEXTURE_LETTERS = 7;
*/    

/*
  tron.GAME_STATE_LOADING = 0;
  tron.GAME_STATE_LOGO = 1;
  tron.GAME_STATE_GAME = 2;
  tron.GAME_STATE_HELP = 3;
  tron.GAME_STATE_MAP  = 4
*/

/*
  tron.MAX_DIMENSION = 752;//688
  tron.MIN_DIMENSION = 352
 */
  

tron.Main = function(wx, wy)
{
	var i;
    this._game = null;
    
    var mD = /*  tron.MIN_DIMENSION */ 352;
	var MD = /*  tron.MAX_DIMENSION */ 752;
    this._renderers = new Array(17);    
    this._renderers[0] = new tron.Renderer("canvas0" , true , MD, MD);
    
    //if (!tron.IE8compat)
    //{
	    this._renderers[1] = new tron.Renderer("canvas1" , true , 112, 112);
	    this._renderers[2] = new tron.Renderer("canvas2" , true, 112, 112);
	    this._renderers[3] = new tron.Renderer("canvas3" , true, 112, 112);
	    this._renderers[4] = new tron.Renderer("canvas4" , true, 112, 112);
	    this._renderers[5] = new tron.Renderer("canvas5" , true, 112, 112);
	    this._renderers[6] = new tron.Renderer("canvas6" , true, 112, 112);
	    this._renderers[7] = new tron.Renderer("canvas7" , true, 112, 112);
    /*}
    else
    {
	    this._renderers[1] = null;
	    this._renderers[2] = null;
	    this._renderers[3] = null;
	    this._renderers[4] = null;
	    this._renderers[5] = null;
	    this._renderers[6] = null;
	    this._renderers[7] = null;
    }*/
    this._renderers[8] = new tron.Renderer("canvas8" , true , MD >> 1, MD);
    this._renderers[9] = new tron.Renderer("canvas9" , true , MD >> 1, MD);
    this._renderers[10] = new tron.Renderer("canvas10", true, MD >> 1, MD >> 1);
    this._renderers[11] = new tron.Renderer("canvas11", true, MD >> 1, MD >> 1);
    this._renderers[12] = new tron.Renderer("canvas12", true, MD >> 1, MD);
    this._renderers[13] = new tron.Renderer("canvas13", true, MD >> 1, MD >> 1);
    this._renderers[14] = new tron.Renderer("canvas14", true, MD >> 1, MD >> 1);
    this._renderers[15] = new tron.Renderer("canvas15", true, MD >> 1, MD >> 1);
    this._renderers[16] = new tron.Renderer("canvas16", true, MD, MD >> 1);
    
    this._mainWidth = 0;
    this._mainHeight = 0;
    this.resize(wx, wy);
    
    this._textures = new tron.TextureManager(9);
    this._textures.add("img/players4.png", 256, 128, false);
    this._textures.add("img/otherstiles.png", 16, 304, false);    
    this._textures.add("img/eyes.png", 16, 256, false);
    this._textures.add("img/bar.png", 32, 16, false);
    this._textures.add("img/gfm.png", 203, 149, true);
    this._textures.add("img/mars.gif", 300, 300, true);
    this._textures.add("img/help.png", 450, 461, true);
    this._textures.add("img/letters.png", 186, 153, false);
    
    this._audioManager = new tron.AudioManager();
    
  	var GLOBAL_VOLUME = 0.8 / 0.55;
  
    this._audioManager.addSample("sound/shoot.ogg", "sound/shoot.mp3", GLOBAL_VOLUME * 0.45 /* 0.35 */, 3);
    this._audioManager.addSample("sound/explode.ogg", "sound/explode.mp3", GLOBAL_VOLUME * 0.55, 2);
    this._audioManager.addSample("sound/die.ogg", "sound/die.mp3", GLOBAL_VOLUME * 0.35, 2);
    this._audioManager.addSample("sound/teleport.ogg", "sound/teleport.mp3", GLOBAL_VOLUME * 0.12, 1);
    this._audioManager.addSample("sound/weaponupgrade.ogg", "sound/weaponupgrade.mp3", GLOBAL_VOLUME * 0.15, 1);
    this._audioManager.addSample("sound/invincible.ogg", "sound/invincible.mp3", GLOBAL_VOLUME * 0.4, 1);
    this._audioManager.addSample("sound/intro_GoM_44khz_16b.ogg", "sound/intro_GoM_44khz_16b.mp3", GLOBAL_VOLUME * 0.55, 1);    
    this._audioManager.addSample("sound/newgame.ogg", "sound/newgame.mp3", GLOBAL_VOLUME * 0.35, 1);
    
    this._audioManager.addMusic("rame a l'envers", 
                                "sound/kaneel_rame_a_l_envers.ogg", 
                                "sound/kaneel_rame_a_l_envers.mp3", GLOBAL_VOLUME * 0.43);
    
    this._audioManager.addMusic("les maux oublies", 
                                "sound/kaneel_les_maux_oublies.ogg", 
                                "sound/kaneel_les_maux_oublies.mp3", GLOBAL_VOLUME * 0.5);
    this._audioManager.addMusic("reveil epice cafe amplifie", 
                                "sound/kaneel_reveil_epice_cafe_amplifie.ogg", 
                                "sound/kaneel_reveil_epice_cafe_amplifie.mp3", GLOBAL_VOLUME * 0.38);
                                
    
    
    
    this._lastNHuman = -1;
//    this._evenFrame = false;
    
    this._c0 = document.getElementById("c0");
    this._c1 = document.getElementById("c1");
    this._c2 = document.getElementById("c2");
    this._c3 = document.getElementById("c3");
    this._c4 = document.getElementById("c4");
    this._c5 = document.getElementById("c5");
    this._c6 = document.getElementById("c6");
    this._c7 = document.getElementById("c7");
    this._c8 = document.getElementById("c8");
    this._c9 = document.getElementById("c9");
    this._c10 = document.getElementById("c10");
    this._c11 = document.getElementById("c11");
    this._c12 = document.getElementById("c12");
    this._c13 = document.getElementById("c13");
    this._c14 = document.getElementById("c14");
    this._c15 = document.getElementById("c15");
    this._c16 = document.getElementById("c16");
    
    this._2p = document.getElementById("2p");
    this._3p = document.getElementById("3p");
    this._4p = document.getElementById("4p");
    this._nowPlaying = document.getElementById("nowplaying");
    
    this._patternManager = new tron.PatternManager();    
    this._letters = new tron.Letters(this._textures);
    this._localTime = 0.0;
    this._globalTime = 0.0;
    
    // for map drawing
    this._scratchArray = new Array(514 * 514);
    this._mapResults = new Array(512 * 512);
    var fillArray = tron.fillArray;
    fillArray( this._scratchArray, 0);
    fillArray( this._mapResults, 0);
    
    this.setState(/* tron.GAME_STATE_LOADING */ 0);
    this._wasResized = true;
};

tron.Main.prototype = {

	resize : function(wx, wy)
	{
		var w1 = 112;
		var h1 = 112;
		if ((wx < 1100) || (wy < 500))
		{
			w1 = 80;
			h1 = 80;
		}
		
		var w2 = (wx - 400 - w1) & 0xfff0;
		var h2 = (wy - 40) & 0xfff0;
		
		var mD = /*  tron.MIN_DIMENSION */ 352;
		var MD = /*  tron.MAX_DIMENSION */ 752;
		if (w2 < mD) w2 = mD;
		if (h2 < mD) h2 = mD;
		if (w2 > MD) w2 = MD;
		if (h2 > MD) h2 = MD;
		this._mainWidth = w2;
		this._mainHeight = h2;
		var w3 = (w2 >> 1) & 0xfff0;
		var h3 = (h2 >> 1) & 0xfff0;
		
		// old w2 = 608  and w2/2 = 304
		var r = this._renderers;
		
		this._renderers[0].setSize(w2, h2);    
	    /* if (r[1]) { */ this._renderers[1].setSize(w1, h1); //}
	    /* if (r[2]) { */ this._renderers[2].setSize(w1, h1); //}
	    /* if (r[3]) { */ this._renderers[3].setSize(w1, h1); //}
	    /* if (r[4]) { */ this._renderers[4].setSize(w1, h1); //}
	    /* if (r[5]) { */ this._renderers[5].setSize(w1, h1); //}
	    /* if (r[6]) { */ this._renderers[6].setSize(w1, h1); //}
	    /* if (r[7]) { */ this._renderers[7].setSize(w1, h1); //}	    
	    this._renderers[8].setSize(w3, h2);
	    this._renderers[9].setSize(w3, h2);
	    this._renderers[10].setSize(w3, h3);
	    this._renderers[11].setSize(w3, h3);
	    this._renderers[12].setSize(w3, h3);
	    this._renderers[13].setSize(w3, h3);
	    
	    this._renderers[14].setSize(w3, h3);
	    this._renderers[15].setSize(w3, h3);
	    this._renderers[16].setSize(w2, h3);
	    
	    var game = this._game;
	    
	    if (game) {
		    game.resize(this._mainWidth, this._mainHeight);
	    }
	    this._wasResized = true;
	},

	keydown: function(e)
	{
		switch(this._state)
		{
		
		case /* tron.GAME_STATE_LOADING */ 0: 	
			break;
				
		case /* tron.GAME_STATE_LOGO */ 1:
			switch (e.keyCode)
	        {                
	            case 32:
	            case 13:
	            	this.setState(/* tron.GAME_STATE_HELP */ 3);
	                
	        }   
			break;
			 	
		case /* tron.GAME_STATE_HELP */ 3:
		case /* tron.GAME_STATE_MAP */ 4:
			switch (e.keyCode)
	        {                
	            case 32:
                case 13:
	            	tron.newGame();
	                
	        }   
			break;
			
		case /* tron.GAME_STATE_GAME */ 2:	
			switch (e.keyCode)
	        {                
	            case 32:
                case 13:
	            	tron.newGame();
	            default:
	            	this._game.keydown(e);    
	        }  
			break;
		}		
	},
	
	hide: function(e)
	{
		e.style.display	= 'none';
	},
	
	show: function(e)
	{
		e.style.display	= 'block';
	},
	
	setState : function(s)
	{
		var i;
		this._state = s;
		var renderers = this._renderers;
		var context = renderers[0].getCanvasContext();		
		switch(s)
		{
			//case /* tron.GAME_STATE_LOADING */ 0:
			case /* tron.GAME_STATE_HELP */ 3:	
				this.setViewportsNumber(1);
				context.globalAlpha = 1.0;
				for (i = 0; i < 8; ++i)
				{
					var ri = renderers[i];
					if (ri) { ri.clear('#eaf5ff'); }
				}
				this.drawHelp();
				break;
				
			case /* tron.GAME_STATE_MAP */ 4:
				context.globalAlpha = 1.0;
				this.setViewportsNumber(1);
				for (i = 0; i < 8; ++i)
				{
					var ri = renderers[i];
					if (ri) { ri.clear('#eaf5ff'); }
				}				
				this.drawMap();
				break;
				
			case /* tron.GAME_STATE_GAME */ 2:
				context.globalAlpha = 1.0;		
				this.clic();
				break;
				
				
			case /* tron.GAME_STATE_LOGO */ 1:	
				// play intro sound
				this._audioManager.playSample(/* tron.SAMPLE_INTRO */ 6, 1.0);
				break;
		}	
		this._localTime = 0.0;
	},
	
	loop: function(time, dt)
	{
		var context = this._renderers[0].getCanvasContext();
		var state = this._state;
		this._localTime += dt;
		if (state !== /* tron.GAME_STATE_LOADING */ 0) 
		{
			this._globalTime += dt;
			var audioManager = this._audioManager;
			//audioManager.checkEnded();
			audioManager.updateTime(dt);
			if (this._globalTime > 10.0)
			{	
				audioManager.nextMusic();				
			}
		}
		
		var lt = this._localTime;
		var wasResized = this._wasResized;
		this._wasResized = false;
		
		var mainWidth = this._mainWidth;
		var mainHeight = this._mainHeight;
		var midx = mainWidth >> 1;
		var midy = mainHeight >> 1;			
				
		switch (this._state)
		{
			
			case /* tron.GAME_STATE_LOADING */ 0: 			
			
				var progression = (this._textures.progression() + this._audioManager.progression()) / 2;
				var w = (mainWidth >> 1) - 104;
				
				var h = 3;				
				context.strokeStyle = '#2e6e9e';
				context.strokeRect(midx - w, midy - h, 2 * w , 2 * h);
				
				context.fillStyle = '#2e6e9e';
				context.fillRect(midx - w + 2, midy - h + 2, progression * (2 * w - 4), 2 * h - 4);			
				
				context.font = '11px sans serif';
				context.fillText("Loading...",midx - 15, midy - h - 10);
			
				if (this._textures.allLoaded() && this._audioManager.allLoaded()) 
				{
					this.setState(/* tron.GAME_STATE_LOGO */ 1);
				}
				break;
				
			case /* tron.GAME_STATE_LOGO */ 1:
			
				if (lt < 1)
				{
					context.globalAlpha = 0.8;
				}
				else if (lt > 3)
				{
					context.globalAlpha = 0.2;
				}
				else 
				{
					context.globalAlpha = 0.1;
				}	
				
				this._renderers[0].clear('#eaf5ff');
				context.globalAlpha = 1.0;
				
				if (lt > 3) 
				{
					context.globalAlpha = Math.max(0.0, 1.0 - (lt-3) * 1.0);
				}
				else
				{
					context.globalAlpha = 1.0;
				}
				
				var gfmimg = this._textures.get(/* tron.TEXTURE_GFM */ 4)._img;
				var marsimg = this._textures.get(/* tron.TEXTURE_MARS */ 5)._img;
				
				var tt = Math.min(1.0, lt * 1.0);				
				
				var iw = 214 * tt;
				var ih = 150 * tt;
				var mw = 300 * tt;
				var mh = 300 * tt;
					
				
				var dw = 200 * (1.0 - Math.min(lt, 1.0));
				context.drawImage(marsimg, -Math.cos(time) * dw + midx + 6 - (mw >> 1),  
				                           -Math.sin(time) * dw * 0.66 + midy - (mh >> 1), mw, mh);
				context.drawImage(gfmimg, Math.cos(time) * dw + midx + 30 - (iw >> 1),  
				                          Math.sin(time) * dw * 0.66 + midy - (ih >> 1), iw, ih);
				
				var context2 = this._renderers[0].getAuxContext();
				var canvas2 = this._renderers[0].getAuxCanvas();
				var canvas = this._renderers[0].getCanvas();
				
				context2.drawImage(canvas, 0, 0);
				
				context.globalAlpha = 0.8;
				var G = 50 - Math.min(lt * 40, 46);
				context.drawImage(canvas2, G, G, mainWidth - G * 2, mainHeight - G * 2, 0, 0, mainWidth, mainHeight);				 	
				if (lt > 5) 
				{
					this.setState(/* tron.GAME_STATE_HELP */ 3);
				}
			 	break;			 	
			
			case /* tron.GAME_STATE_GAME */ 2:	
				
				//context = this._renderers[0].getCanvasContext();
				//context.globalAlpha = 1.0;				
				
				var game = this._game;
				
				
				
				if (game)
				{
					//var smoothMode = tron.smoothMode;
					
					//if ((!smoothMode) || (this._evenframe))
					//{						
						game.update();
										
						game.render();
						if ((game._endState !== /* tron.END_NOT_YET */ 0) && (game._endElapsed > 10))
						{
							this.setState(/* tron.GAME_STATE_MAP */ 4);
						}						
				/*	}
					else
					{
						game.renderViewports();
					}*/
						
//					this._evenframe = !this._evenframe;
				}				
				break;	
				
			case /* tron.GAME_STATE_HELP */ 3:
			
				if (wasResized) 
				{
					this.drawHelp();
				}
				break;		
				
			case /* tron.GAME_STATE_MAP */ 4:	
				if (wasResized) 
				{
					this.drawMap();
				}
				break;
		}
		
	},
	
	clic : function()
	{
		if (this._state !== /* tron.GAME_STATE_LOADING */ 0)
		{
			this._audioManager.playSample(/* tron.SAMPLE_NEW_GAME */ 7, 1.0);
		}
	},
	
	goToHelp : function()
	{
		this.setState(/* tron.GAME_STATE_HELP */ 3);
		this.clic();	
	},	
	
	setViewportsNumber : function(nHumans)
	{
		if (this._lastNHuman === nHumans) return;
		var lastNHuman = this._lastNHuman;
		this._lastNHuman = nHumans;
		var mw = this._mainWidth;
		var mh = this._mainHeight;
		
		switch (nHumans)
		{
			case 1:
				this.hide(this._2p);
				this.hide(this._3p);
				this.hide(this._4p);
				this.show(this._c0);
				this.show(this._c1);
				this.show(this._c2);
				this.show(this._c3);								
				break;
				
			case 2:				
				this.hide(this._3p);
				this.hide(this._4p);
				this.hide(this._c0);
				this.hide(this._c1);
				this.show(this._2p);				
				this.show(this._c2);
				this.show(this._c3);
				break;
				
			case 3:				
				this.hide(this._c0);
				this.hide(this._2p);
				this.hide(this._c1);
				this.hide(this._c2);
				this.hide(this._4p);
				this.show(this._3p);				
				this.show(this._c3);
				//this._c12.colSpan = "2";				
				//this._renderers[12].setSize(mw, mh >> 1);
				break;
				
			case 4:
				//this._c12.colSpan = "1";
				//this._renderers[12].setSize(mw >> 1, mh >> 1);
				this.hide(this._c0);
				this.hide(this._2p);
				this.hide(this._3p);
				this.hide(this._c1);
				this.hide(this._c2);
				this.hide(this._c3);
				
				this.show(this._4p);				
				//this.resize(this._mainWidth, this._mainHeight);
				break;			
		}	
		/*
		if ((lastNHuman === 4) && (	nHumans !== 4))
		{
			this.resize(this._mainWidth, this._mainHeight);
		}
		*/
	},
	
	newGame: function(sizeofgame, nHumans)
	{
		if (this._textures.allLoaded()) 
		{
			var r = this._renderers;
			var i;
			var renderers = new Array(8);
			this.setViewportsNumber(nHumans);
			switch (nHumans)
			{
				case 1:
					for (i = 0; i < 8; ++i)
					{
						renderers[i] = r[i];
					}					
					break;
				case 2:
					renderers[0] = r[9];
					renderers[1] = r[8];
					for (i = 2; i < 8; ++i)
					{
						renderers[i] = r[i];
					}
					break;
				case 3:
					renderers[0] = r[14];
					renderers[1] = r[15];
					renderers[2] = r[16];
					for (i = 3; i < 8; ++i)
					{
						renderers[i] = r[i];
					}		
					break;
					
				case 4:
					renderers[0] = r[13];
					renderers[1] = r[10];
					renderers[2] = r[12];
					renderers[3] = r[11];
					renderers[4] = r[4];
					renderers[5] = r[5];
					renderers[6] = r[6];
					renderers[7] = r[7];
					break;
				default:
					return;
				
			}
			this._lastNHuman = nHumans;			
			this._game = new tron.Game(renderers, this._textures, this._audioManager, sizeofgame, nHumans, this._patternManager);
//			this._evenFrame = true;
			this.setState(/* tron.GAME_STATE_GAME */ 2);
		}
	},
	
	drawMap : function()
	{
		var i, j, x, y;
		var game = this._game;
		if (!game) return;
		
		var world = game._world;
		
		var playersimg = this._textures.get(/* tron.TEXTURE_PLAYERS */ 0)._img;
        var othersimg = this._textures.get(/* tron.TEXTURE_OTHERTILES */ 1)._img;
		
		var wx = world._width;
		var wy = world._height;
		var renderers = this._renderers;
		var renderer = this._renderers[0];
		var rx = renderer._width;
		var ry = renderer._height;
		var context = renderer.getCanvasContext();
		
		var sizeX = (rx / wx) | 0;
		var sizeY = (ry / wy) | 0;
		
		var size = Math.min(sizeX, sizeY);
		size = Math.max(Math.min(size, 8), 1);
		var bx = (rx - size * wx) >> 1;
		var by = (ry - size * wy) >> 1;
		var mapResults = this._mapResults; 
    	world.getTiles(0, 0, wx, wy, mapResults, this._scratchArray);
    	
    	var ind = 0;
		
		for (j = 0; j < wy; j++) 
		{
		    for (i = 0; i < wx; i++) 
		    {
			    var c = mapResults[ind++];
			    var color;
			    
			    if (c > /* EMPTY_TILE */ -1) 
		        { 	                                        
		        	y = (c & 0x70); // select row base on team
		            x = (c & 15) * 16;
		            context.drawImage(playersimg, x , y, 16, 16, bx + i * size, by + j * size, size, size);
				}                    
		        else if (c < /* EMPTY_TILE */ -1) 
		        {                        
		        	x = ((-c - 2) /* & 15*/ ) * 16;
		            context.drawImage(othersimg, 0, x, 16, 16, bx + i * size, by + j * size, size, size);
				}
		    }
		}	
		
		// message
		var L = this._letters;
		switch (game._endState)
		{
			case /* tron.END_EVERYONE_IS_DEAD */ 1:
				L.drawLetter(renderers[1], "D");
				L.drawLetter(renderers[3], "R");
				L.drawLetter(renderers[5], "A");
				L.drawLetter(renderers[8], "W");
				break;
				
			case /* tron.END_IA_WIN */ 2:
				L.drawLetter(renderers[2], "T");
				L.drawLetter(renderers[4], "H");
				L.drawLetter(renderers[6], "E");
				L.drawLetter(renderers[1], "G");
				L.drawLetter(renderers[3], "A");
				L.drawLetter(renderers[5], "M");
				L.drawLetter(renderers[7], "E");
				break;
			
			case /* tron.END_PLAYER_WIN */ 3:
				L.drawLetter(renderers[2], "Y");
				L.drawLetter(renderers[4], "O");
				L.drawLetter(renderers[6], "U");
				L.drawLetter(renderers[1], "R");
				L.drawLetter(renderers[3], "O");
				L.drawLetter(renderers[5], "C");
				L.drawLetter(renderers[7], "K");
				break;
			
		}	
		
		
	},
	
	drawHelp : function()
	{
		var renderers = this._renderers;
		var renderer = this._renderers[0];
		var rw = renderer._width;
		var rh = renderer._height;
		var context = renderer.getCanvasContext();
		context.globalAlpha = 1.0;
		var tex = this._textures.get(/* tron.TEXTURE_HELP */ 6);
		var helpimg = tex._img;
		var w = tex._width;
		var h = tex._height;
		var B = 20;
		var displayW = w;
		var displayH = h;
		if (displayW > rw - B)
		{
			displayW = rw - B;
			displayH = displayW * h / w;	
		}
		if (displayH > rh - B)
		{
			displayH = rh - B;
			displayW = displayH * w / h;	
		}
		
		var x = (rw - displayW) >> 1;
		var y = (rh - displayH) >> 1;
		context.drawImage(helpimg, 0, 0, tex._width, tex._height, x, y, displayW, displayH);
		
		
		// message
		var L = this._letters;
		L.drawLetter(renderers[2], "T");
		L.drawLetter(renderers[4], "H");
		L.drawLetter(renderers[6], "E");
		L.drawLetter(renderers[1], "H");
		L.drawLetter(renderers[3], "E");
		L.drawLetter(renderers[5], "L");
		L.drawLetter(renderers[7], "P");
	},
	
	enableMusic : function()
	{
		this._audioManager.enableSounds();
	},
	
	disableMusic : function()
	{
		this._audioManager.disableSounds();
	}
	
};
