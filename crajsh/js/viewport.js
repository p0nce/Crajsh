var tron = tron || {};

// state of the screen
tron.Viewport = function(game, player, renderer, w, h)
{
    this._width = 0;
    this._height = 0;
    
    var mW = renderer ? (renderer._maxWidth >> 4) : 1;
    var mH = renderer ? (renderer._maxHeight >> 4) : 1;
    
    this._array = new Array(mH * mW); // tiles currently displayed
    this._newArray = new Array(mH * mW); // tiles to be displayed
    this._scratch = new Array((mH + 2) * (mW + 2)); // scratch buffer
    
    this._isValid = renderer && (renderer._isValid);
    var copyOptimization = !!renderer._auxCanvas;
    this._copyOptimization = copyOptimization;
    //if (tron.smoothMode)
    //{
	//	this._copyOptimization = false;
    //}
    
/*    if (!(tron.IE8compat))
    {
	    this._copyOptimization = false;
    }*/
    
    this._world = game._world;
    this._textures = game._textures;
    this._renderer = renderer;
    this._player = player;
    this._camera = new tron.Camera(this, 0, 0);
    this._players = game._players;
    this._playersTexture = this._textures.get(/* tron.TEXTURE_PLAYERS */ 0);
    this._otherTexture = this._textures.get(/* tron.TEXTURE_OTHERTILES */ 1);
    this._eyesTexture = this._textures.get(/* tron.TEXTURE_EYES */ 2);
    this._barTexture = this._textures.get(/* tron.TEXTURE_BAR */ 3);
    
    
    if (this._isValid) 
    {
        this._context = renderer.getCanvasContext();
        this._canvas = renderer.getCanvas();
        
        if (this._copyOptimization) 
        {
            this._auxContext = renderer.getAuxContext();
            this._auxCanvas = renderer.getAuxCanvas();
        }
    }
    
    var fillArray = tron.fillArray;
    fillArray( this._array, 0);
    fillArray( this._scratch, 0);
    fillArray( this._newArray, 0);
    
    // init scratch with crap
    for (var sindex = 0; sindex < (w + 2) * (h + 2); ++sindex) 
    {
        this._scratch[sindex] = 0;
    }
    this._justResized = false;
    this.resize();
    this.moveCamera(); 
    
};

tron.Viewport.prototype = {

	resize: function()
	{
		var renderer = this._renderer;
		if (!renderer) return;
		var w = renderer._width >> 4;
    	var h = renderer._height >> 4;    
		this._width = w;
    	this._height = h;
		// init scratch with crap
		var scratch = this._scratch;
	    for (var sindex = 0; sindex < (w + 2) * (h + 2); ++sindex) 
	    {
	        scratch[sindex] = 0;
	    }
	    this._justResized = true;
	    renderer.clear('#eaf5ff');
	},	
    
    getWidth: function()
    {
        return this._width;
    },
    
    getHeight: function()
    {
        return this._height;
    },
    
    get: function(i, j)
    {
        return this._array[j * this._width + i];
    },
    
    set: function(i, j, x)
    {
        this._array[j * this._width + i] = x;
    },
    
    moveCamera : function()
    {
        var tx = this._width;
        var ty = this._height;
        this._camera.follow(this._player, -(tx >> 1), -(ty >> 1));
    },
    
    fill: function(x)
    {
	    var N = this._height * this._width;
	    var a = this._array;
	    var na = this._newArray;
	    
	    for (var i = 0; i < N; ++i)
	    {
			a[i] = x;    
			na[i] = x;
	    }
    },
    
    render: function()
    {
        //var game = this._game;
        var camera = this._camera;
        var textures = this._textures;
        var context = this._context;
        var world = this._world;
        var player = this._player;
        var camx = camera._x;
        var camy = camera._y;
        
        var playersimg = this._playersTexture._img;
        var othersimg = this._otherTexture._img;
        var eyesimg = this._eyesTexture._img;
        var barimg = this._barTexture._img;
        
        //var playerstiles = this._playersTexture._tiles;
        //var othertiles = this._otherTexture._tiles;
        
        
        var varray = this._array;
        var narray = this._newArray;
        var scratch = this._scratch;
        
        var tx = this._width;
        var ty = this._height;
        var x, y, i, j, k, i16, j16;
        var index = 0;
        var newOne, oldOne, camovx, camovy;
        var justResized = this._justResized;
        this._justResized = false;
        
        
        // optionnal !
        // slower except on edge case where it's faster
        // less latency overall, more predictability
        if (this._copyOptimization && (!justResized)) 
        {
            camovx = camera._movx;
            camovy = camera._movy;
            
            if (camovx || camovy) 
            {
                // copy to scratch
                index = 0;
                for (i = tx * ty; i--;) 
                {
                    scratch[index] = varray[index];
                    index += 1;
                }
                
                for (j = 0; j < ty; j++) 
                {
                    var sy = j + camovy;
                    for (i = 0; i < tx; i++) 
                    {
                        var sx = i + camovx;
                        
                        if (sx >= 0 && sy >= 0 && sx < tx && sy < ty) 
                        {
                            varray[i + tx * j] = scratch[sx + tx * sy];
                        }
                    }
                }
                
                this._auxContext.drawImage(this._canvas, 0, 0);
                /*
                var cx = (tx - 2) * 16;
                var cy = (ty - 2) * 16;
                var bx = 16 * (1 + camovx);
                var by = 16 * (1 + camovy);
                */
                
                var cx = (tx - 2) * 16;
                var cy = (ty - 2) * 16;
                var bx = -16 * (camovx);
                var by = -16 * (camovy);
                context.drawImage(this._auxCanvas, bx, by);//, cx, cy, 16, 16, cx, cy);
            }
        }
        
        // get tiles to display
        world.getTiles(camx, camy, tx, ty, narray, scratch);
        
        var EMPTY_TILE = /* tron.EMPTY_TILE */ -1;
        context.fillStyle = '#eaf5ff';        
        
        // optionnal EMPTY optimization
        // draw rectangle of color
        // actually slower
       /* 
        var optimizeEmptyTiles = true;
        if (optimizeEmptyTiles) 
        {	        
	        camovx = camera._movx;
            camovy = camera._movy;
            var hozMajor = Math.abs(camera._movx) < Math.abs(camera._movy);
            
            if (camera._movx === 0) // horizontal lines of empty
            {
	            index = 0;
	            for (j = 0; j < ty; j++) 
		        {
		            for (i = 0; i < tx; i++) 
		            {
			            for (k = 0; k < tx - i; ++k)
			            {
				            newOne = narray[index + k];
               				oldOne = varray[index + k];
               				if (newOne !== EMPTY_TILE) break;	
               				if (oldOne === EMPTY_TILE) break;               				
               				varray[index + k] = newOne;
			            }
			            
			            if (k > 0)
			            {
				            i16 = i * 16;
                    		j16 = j * 16;
				            context.fillRect(i16, j16, 16 * k, 16);
				            i += (k - 1);
				            index += (k - 1);				            
			            }
			            index++;
		        	}
		        }
	        }
	        else if (camera._movy === 0)  // vertical lines of empty
	        {
		        for (i = 0; i < tx; i++) 
		        {
		            for (j = 0; j < ty; j++) 
		            {
			            for (k = 0; k < ty - j; ++k)
			            {
				            index = (j + k) * tx + i;
				            newOne = narray[index];
               				oldOne = varray[index];
               				if (newOne !== EMPTY_TILE) break;	
               				if (oldOne === EMPTY_TILE) break;               				
               				varray[index] = newOne;
			            }
			            
			            if (k > 0)
			            {
				            i16 = i * 16;
                    		j16 = j * 16;
				            context.fillRect(i16, j16, 16, 16 * k);
				            j += (k - 1);				            			            
			            }
		        	}
		        }
	        }
        } 
        */
           
        
        if (player)   
        {
	        varray[tx - 4] = 0;
	        varray[tx - 3] = 0;
	        varray[tx - 2] = 0;
	        varray[tx - 1] = 0; 
	        varray[tx * 2 - 1] = 0;
	        varray[tx * 2 - 2] = 0;
	        varray[tx * 3 - 1] = 0;
	        varray[tx * 3 - 2] = 0;	        
        }
        
        if (justResized) // draw all tiles
        {
			for (i = 0; i < tx * ty; ++i)
			{
				varray[i] = 0;
			}			
    	}    	
    	
        var players = this._players;
        var nPlayers = players.length;
        var ww = world._widthMask;
        var wh = world._heightMask;
        
        // force player eye erasure        
        if (player._state === /* tron.STATE_ALIVE */ 1) 
        {
	        x = (player._posx - camx) & ww;
            y = (player._posy - camy) & wh;
            if ((x >= 0) && (x < tx) && (y >= 0) && (y < ty))
            {
	            varray[x + y * tx] = 0;
            }
        }
        
        // draw changing tiles	        
        index = 0;
        
        for (j = 0; j < ty; j++) 
        {
            for (i = 0; i < tx; i++) 
            {
                newOne = narray[index];
                oldOne = varray[index];
                
                if (oldOne !== newOne) // draw only when necessary
                {
                    i16 = i * 16;
                    j16 = j * 16;                    
                   
                    if (newOne > /* EMPTY_TILE */ -1) 
                    { 	                                        
                        y = (newOne & 0x70); // select row base on team
                        x = (newOne & 15) * 16;
                        context.drawImage(playersimg, x , y, 16, 16, i16, j16, 16, 16);
                    }                    
                    else if (newOne < /* EMPTY_TILE */ -1) 
                    {                        
                        x = ((-newOne - 2) /* & 15*/ ) * 16;
                        context.drawImage(othersimg, 0, x, 16, 16, i16, j16, 16, 16);
                    }
                    else
                    {
                       context.fillRect(i16, j16, 16, 16);
                    }
                    
                    varray[index] = newOne;
                    
                }
                index += 1;
            }
        }
        
      // draw players eyes
        for (i = 0; i < nPlayers; ++i)
        {
			/* draw eyes of players that are visible */
			var tplayer = players[i];
            if (tplayer._state === /* tron.STATE_ALIVE */ 1) 
            {
                x = (tplayer._posx - camx) & ww;
                y = (tplayer._posy - camy) & wh;
                j = 16 * tplayer._dir;
                if (tplayer._invincibility > 0) 
                {
	             	continue;
                }
                else if (tplayer._warning > 0) 
                {
	                j += 64;
                }
                else if (tplayer._turbo)
                {
	             	j += 128;   
                }             
	                
                if ((x >= 0) && (x < tx) && (y >= 0) && (y < ty))
                {
                    context.drawImage(eyesimg, 0, j | 0, 16, 16, x * 16, y * 16, 16, 16);
                }			
            }			
        }
        
        if (player && (player._human))
        {
	        context.drawImage(barimg, tx * 16 - 32, 0);
        	var barLength = player.shootPixels();
        	
        	
        	context.fillStyle = (barLength === 0) ? '#20ff20' : '#ffc4e0';
        	context.fillRect(tx * 16 - 27, 6, 24 - barLength, 1);
        	
    	}
    }
};
