var tron = tron || {};

/*
tron.SLOT_UP = 1;
tron.SLOT_DOWN = 2;
tron.SLOT_LEFT = 4;
tron.SLOT_RIGHT = 8;

tron.EMPTY_TILE = -1;

tron.WORLD_EMPTY = 0;
tron.WORLD_FIREY = -1;
tron.WORLD_FIRER = -2;
tron.WORLD_DEBRIS = -3;
tron.WORLD_BULLET = -4;
tron.WORLD_WALL_BLUE = -5;
tron.WORLD_WALL_GREEN = -6;
tron.WORLD_WALL_ORANGE = -7;
tron.WORLD_WALL_YELLOW = -8;
tron.WORLD_WALL_WHITE = -9;
tron.WORLD_WALL_BLACK = -10;
tron.WORLD_WALL_RED = -11;
tron.WORLD_WALL_PINK = -12;
tron.WORLD_WALL_VIOLET = -13;
tron.WORLD_WALL_GREY = -14;
tron.WORLD_WALL_CYAN = -15;
tron.WORLD_POWERUP_YELLOW = -16;
tron.WORLD_POWERUP_GREEN = -17;
tron.WORLD_POWERUP_PINK = -18;
tron.WORLD_POWERUP_ORANGE = -19;
tron.WORLD_TRIANGLE_SW = -20;
tron.WORLD_TRIANGLE_NW = -21;
tron.WORLD_TRIANGLE_NE = -22;
tron.WORLD_TRIANGLE_SE = -23;
*/

// the world contains occupation data
// 0: empty place
// 1-16: player of the team 1-16
// < 0: other tile

// it can return tiles
// >= 0 player stuff
// -1: empty
// -n: other tiles
tron.World = function(w_log_2, h_log_2)
{
    this._width_shift = w_log_2;
    this._height_shift = h_log_2;
    
    var w = (1 << w_log_2), h = (1 << h_log_2);
    this._width = w;
    this._widthMask = (w - 1);
    this._height = h;
    this._heightMask = (h - 1);
    
    var len = w * h;
    var array = new Array(len);
    this._array = array;
    
    var i = 0, j = 0;
    for (i = 0; i < len; ++i)
	{
		array[i] = 0;
    }    
    
    var wallWidth = 1;
    switch(Math.min(w_log_2, h_log_2))
    {
        case 6:
            wallWidth = 1;
            break;          
        case 7:
            wallWidth = 2;
            break;
        case 8:
            wallWidth = 8;
            break;
        case 9:
            wallWidth = 16;
            break;
    }
    
    for (j = 0; j < wallWidth; ++j) 
    {
        for (i = 0; i < w; ++i) 
        {
            this.set(i, j, /* tron.WORLD_WALL_BLUE */ -5);
            this.set(i, h - 1 - j, /* tron.WORLD_WALL_BLUE */ -5);
        }           
    }
    
    for (i = 0; i < wallWidth; ++i) 
    {
        for (j = 0; j < h; ++j) 
        {
            this.set(i, j, /* tron.WORLD_WALL_BLUE */ -5);
            this.set(w - 1 - i, j, /* tron.WORLD_WALL_BLUE */ -5);
        }        
    }        
};

tron.World.prototype = {

    set: function(i, j, e)
    {
        this._array[j * this._width + i ] = e;
    },
    
    setSecure: function(i, j, e)
    {
        this._array[ (j & this._heightMask) * this._width + (i & this._widthMask) ] = e;
    },
    
    get: function(i, j)
    {
        return this._array[((j & this._heightMask) * this._width) + (i & this._widthMask)]; //wrap around
    },
    
    getLine: function(i, j, count, buffer, index)
    {
        var ii = (i & this._widthMask);
        var jj = (j & this._heightMask);
        var w = this._width;
        var array = this._array;
        var sindex = jj * w + ii;
        
        for (var k = 0; k < count; ++k) 
        {
            //var rx = ii + k;
            if ((ii + k) === w) 
            {
                sindex -= w;
            }
            buffer[index + k] = array[sindex];
        }
    },
    
    // return occupation on a square
    // results an array of width x height elements
    // scratch a scratch array of (width x height) elements
    gets: function(x, y, width, height, results)
    {
        var wmask = this._widthMask;
        var hmask = this._heightMask;
        var wworld = this._width;
        var array = this._array;
        
        // get a bigger rect of tiles (border of 1)
        
        var index = 0;
        for (var j = 0; j < height; ++j) 
        {
            var py = y + j;
            for (var i = 0; i < width; ++i) 
            {
                var px = x + i;
                results[index] = array[((py & hmask) * wworld) + (px & wmask)];
                index += 1;
            }
        }
    },
    
    
    // return multiples tiles all at once
    // results an array of width x height elements
    // scratch a scratch array of (width + 2) x (height + 2) elements
    getTiles: function(x, y, width, height, results, scratch)
    {
        var wp2 = width + 2;
        var wmask = this._widthMask;
        var hmask = this._heightMask;
        var wworld = this._width;
        var array = this._array;
        
        // get a bigger rect of tiles (border of 1)
        
        var index = 0;
        var wp1 = width + 1;
        var hp1 = height + 1;
        var i, j;
        
        for (j = -1; j < hp1; ++j) 
        {
            for (i = -1; i < wp1; ++i) 
            {
                var px = x + i;
                var py = y + j;
                scratch[index] = array[((py & hmask) * wworld) + (px & wmask)]; //wrap around
                index += 1;
            }
        }
        
        // compose tiles without fearing boundaries thanks to the border
        var nindex = 0;
        var scratchIndex = width + 3;
        
        for (j = 0; j < height; j++) 
        {
            for (i = 0; i < width; i++) 
            {
            
                var centerTile = scratch[scratchIndex];
                //if (centerTile > 8) 
                //{
                //    centerTile = 1 + (centerTile - 1) & 7;
                //}
                
                if (centerTile <= 0) 
                {
                    results[nindex] = centerTile - 1;
                }
                else 
                {
                    var up = scratch[scratchIndex - wp2];
                    var down = scratch[scratchIndex + wp2];
                    var left = scratch[scratchIndex - 1];
                    var right = scratch[scratchIndex + 1];
                    
                    var r = 0;
                    if (centerTile === up) 
                    {
                        r += /* tron.SLOT_UP */ 1;
                    }
                    if (centerTile === down) 
                    {
                        r += /* tron.SLOT_DOWN */ 2;
                    }
                    if (centerTile === left) 
                    {
                        r += /* tron.SLOT_LEFT */ 4;
                    }
                    if (centerTile === right) 
                    {
                        r += /* tron.SLOT_RIGHT */ 8;
                    }
                    
                    results[nindex] = r + 16 * (centerTile - 1);
                }
                nindex += 1;
                scratchIndex += 1;
            }
            scratchIndex += 2;
        }
        
    },
    
    isSafePos : function(x, y, dir)
    {
        var dx = tron.directionX(dir);
        var dy = tron.directionY(dir);
  		var empty = /* tron.WORLD_EMPTY */ 0;
		for (var i = 0; i < 30; ++i)
		{
			var p = this.get(x + dx * i, y + dy * i);
			if (p !== empty) 
			{
				return false;
			}
		}
		return true;
    },
    
    // fill a line on the world to prevent early crossings
    line : function(x, y, dir, what)
    {
        var dx = tron.directionX(dir);
        var dy = tron.directionY(dir);  
		for (var i = 0; i < 30; ++i)
		{
			this.set(x + dx * i, y + dy * i, what);
		}			
    },
    
    // return an array of objects with x, y and dir
    getSafePositions : function(n)
    {
        var i, posx, posy, pdir;
        var res = new Array(n);
        
        for (i = 0; i < n; ++i)
        {
	        // find a safe spot
            do
            {
                posx = tron.randInt(0, this._width);
                posy = tron.randInt(0, this._height);
                pdir = tron.randInt(/* tron.DIR_UP */ 0, /* tron.DIR_RIGHT */ 3 + 1);
                
            } while(!this.isSafePos(posx, posy, pdir));
            
            this.line(posx, posy, pdir, /* tron.WORLD_WALL_BLUE */ -5);
            
            // change the track
            
            res[i] = { x: posx, y: posy, dir: pdir };
        }
        
        // clear all lines done during search
        for (i = 0; i < n; ++i)
        {
        	this.line(res[i].x, res[i].y, res[i].dir, /* tron.WORLD_EMPTY */ 0);
    	}
        
        return res;
    }   
   
};
