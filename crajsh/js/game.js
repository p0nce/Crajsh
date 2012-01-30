var tron = tron || {};

/* 
tron.END_NOT_YET = 0;
tron.END_EVERYONE_IS_DEAD = 1;
tron.END_IA_WIN = 2;
tron.END_PLAYER_WIN = 3;
*/

tron.Game = function(renderers, textures, audioManager, size, nHumans, patternManager)
{
    var i;
    this._renderers = renderers;
    this._textures = textures;
    this._audioManager = audioManager;
    //this._nPlayers = 8;
    this._nHumans = nHumans;
        
    // 6 : 64x64
    // 7 : 128x128
    // 8 : 256x256
    // 9 : 512x512
    this._world = new tron.World(size, size);    
    if (patternManager)
    {
    	patternManager.addPatterns(this._world, Math.round(this._world._width * this._world._height / 2000.0)); // 4000.0
	}
    
    this._players = new Array(8);
    
    this._bulletPool = new tron.BulletPool(this);
    
    // choose safe locations (assume existing)
    var safePos = this._world.getSafePositions(/*this._nPlayers*/ 8);
    
    for (i = 0; i < /*this._nPlayers*/ 8; i++) 
    {
        var world = this._world;
        
        var isHuman = i < nHumans;
        var team = i + 1;
        this._players[i] = new tron.Player(this, isHuman, team, safePos[i].x, safePos[i].y, safePos[i].dir);
    }
    
     // create 8 viewport
    this._viewports = new Array(8);
    for (i = 0; i < 8; ++i) 
    {
        var r = this._renderers[i];
        if (r) { r.clear('#dfdfef'); }        
        this._viewports[i] = new tron.Viewport(this, this._players[i], r);//, i === 0); // only copy-optimize the first one
        this._viewports[i].fill(-2);
    }
    
    audioManager.setWorldSize(this._world._width, this._world._height);
    
    this._endState = /* tron.END_NOT_YET */ 0;
    this._endElapsed = 0;
    
};

tron.Game.prototype = {
	
	update: function()
    {
        // move all players
        var players = this._players;
        var bulletPool = this._bulletPool;
        //var N = this._nPlayers;
        var nHumans = this._nHumans;
        var viewports = this._viewports;
        var i;
        
        
        for (i = 0; i < /*N*/ 8; ++i)
        {
            players[i].intelligence();
        }
        
        
        //bulletPool.undraw();
        //bulletPool.clean();
        bulletPool.undrawAndClean();
        
        // move all players
        for (i = 0; i < /*N*/ 8; ++i)
        {
            players[i].update(false);
        }
        
        bulletPool.update();
 //       bulletPool.checkDeath();
        
        
        // check collision, mark as dead		
        for (i = 0; i < /*N*/ 8; ++i)
	    {
	    	players[i].checkDeath(false);
		}
        
        // draw players, advance explosion state		
        for (i = 0; i < /*N*/ 8; ++i)
        {
           players[i].draw(false);
        }
        
        bulletPool.update();
   //     bulletPool.checkDeath();
        bulletPool.draw();
        
        // check collision, mark as dead again		
        for (i = 0; i < /*N*/ 8; ++i)
        {
            players[i].checkDeath2(false);
        }
        
        
        // TURBO        
             
        // move all turbo players
        for (i = 0; i < nHumans; i++) 
        {
            players[i].update(true);
        }
        
        // check collision turbo players, mark as dead		
        for (i = 0; i < nHumans; i++) 
        {
            players[i].checkDeath(true);
        }    
        
         // draw players, advance explosion state		
        for (i = 0; i < nHumans; i++) 
        {
           players[i].draw(true);
        }
        
        // check collision, mark as dead again		
        for (i = 0; i < nHumans; i++) 
        {
            players[i].checkDeath2(true);
        }
        
        // END TURBO
        
        // set the audible part of the game
        var audioManager = this._audioManager;
        audioManager.clearFocus();
        for (i = 0; i < nHumans; ++i)
        {
	        var player = players[i];
	        var viewport = viewports[i];
        	audioManager.addFocus(player._posx, player._posy, (viewport._width + viewport._height) * 0.53);
    	}
    },
    
    keydown: function(evt)
    {
	    var players = this._players;
	    var nHumans = this._nHumans;
	    if (nHumans >= 1)
	    {
		    switch (evt.keyCode)
	        {
	            case 38: players[0].pushCommand(/* tron.COMMAND_UP */ 0); break;
	            case 40: players[0].pushCommand(/* tron.COMMAND_DOWN */ 1); break;
	            case 37: players[0].pushCommand(/* tron.COMMAND_LEFT */ 2); break;
	            case 39: players[0].pushCommand(/* tron.COMMAND_RIGHT */ 3); break;
	            case 48:                                                            // numpad 0 Opera
	            case 96: players[0].pushCommand(/* tron.COMMAND_SHOOT */ 6); break; // numpad 0
	        }
        }
        if (nHumans >= 2)
        {
			switch (evt.keyCode)
			{
				case 90: 
				case 87: players[1].pushCommand(/* tron.COMMAND_UP */ 0); break;
			    case 83: players[1].pushCommand(/* tron.COMMAND_DOWN */ 1); break;
			    case 81: 
			    case 65: players[1].pushCommand(/* tron.COMMAND_LEFT */ 2); break;
			    case 68: players[1].pushCommand(/* tron.COMMAND_RIGHT */ 3); break;
			    case 69: players[1].pushCommand(/* tron.COMMAND_SHOOT */ 6); break; // E
			}   
        }
        if (nHumans >= 3)
        {
			switch (evt.keyCode)
			{
				case 73: players[2].pushCommand(/* tron.COMMAND_UP */ 0); break;
			    case 75: players[2].pushCommand(/* tron.COMMAND_DOWN */ 1); break;
			    case 74: players[2].pushCommand(/* tron.COMMAND_LEFT */ 2); break;
			    case 76: players[2].pushCommand(/* tron.COMMAND_RIGHT */ 3); break;
			    case 79: players[2].pushCommand(/* tron.COMMAND_SHOOT */ 6); break;
			}   
        }
        if (nHumans >= 4)
        {
			switch (evt.keyCode)
			{
				case 36: players[3].pushCommand(/* tron.COMMAND_UP */ 0); break; // home
			    case 35: players[3].pushCommand(/* tron.COMMAND_DOWN */ 1); break; // end
			    case 46: players[3].pushCommand(/* tron.COMMAND_LEFT */ 2); break; // del
			    case 34: players[3].pushCommand(/* tron.COMMAND_RIGHT */ 3); break; // page down
			    case 57:
			    case 33: players[3].pushCommand(/* tron.COMMAND_SHOOT */ 6); break; // page up
			}   
        }
    },
    
    renderViewports: function()
    {
	    var viewports = this._viewports;
	    
	    for (var i = 0; i < 8; ++i)        
        {
            var v = viewports[i];
            if (v._isValid) 
            {
                v.moveCamera();
                v.render();
            }
        }
    },
    
    render: function()
    {
        this.renderViewports();
        
        if (this._endState === /* tron.END_NOT_YET */ 0)
        {
	         // check terminationed
	    	//var nPlayers = this._nPlayers;
		    var nHumans = this._nHumans;
	        var nPlayersAlive = /* nPlayers */ 8;  
	        var nHumansAlive = nHumans;  
	        var players = this._players;
	         
	        for (i = 0; i < /*nPlayers*/8; ++i)
	        {
	            if (players[i]._state === /* tron.STATE_DEAD */ 6)
	            {
		            nPlayersAlive--;
		            if (i < nHumans) 
		            {
			            nHumansAlive--;
		            }
	            }
	        } 
	        var nAIAlive = nPlayersAlive - nHumansAlive;
	        if (nPlayersAlive === 0)
	        {
		        this._endState = /* tron.END_EVERYONE_IS_DEAD */ 1;
		        
	        } else {
		        
		        if ((nAIAlive === 0) && (nHumansAlive === 1))
		        {
			        this._endState = /* tron.END_PLAYER_WIN */ 3;
		        }
		        
		        if ((nHumansAlive === 0) && (nAIAlive > 0))
		        {
			        this._endState = /* tron.END_IA_WIN */ 2;
		        }
	        }
        } 
        else
        {
	        this._endElapsed++;
        }
        
        
    },
    
    resize: function(mw, mh)
    {
	    var viewports = this._viewports;
        for (var i = 0; i < 8; ++i)        
        {
            var v = viewports[i];
            if (v._isValid) 
            {
                v.resize();
            }
        }
    },
    
    flip: function()
    {
	 	var r = this._renderers;
	 	// flip 
        for (var i = 0; i < 8; ++i)        
        {
            r[i].flip();
        }	               
    }
    
};
