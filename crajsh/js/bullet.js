var tron = tron || {};

/*
tron.BULLET_STATE_ALIVE = 1;
tron.BULLET_STATE_EXPLODING1 = 2;
tron.BULLET_STATE_EXPLODING2 = 3;
tron.BULLET_STATE_EXPLODING3 = 4;
tron.BULLET_STATE_DEAD = 5;
*/

tron.Bullet = function(game)
{
    this._posx = -1;
    this._posy = -1;
    this._movx = -1;
    this._movy = -1;
    this._state = /* tron.BULLET_STATE_DEAD */ 5;    
    this._power = 2;
};

tron.Bullet.prototype = {
	init: function(x, y, dx, dy, power)
	{
		this._posx = x;
		this._posy = y;
		this._movx = dx;
		this._movy = dy;
		this._state = /* tron.BULLET_STATE_ALIVE */ 1;
		this._power = Math.min(10, Math.max(2, power));
	},
	
	update: function(widthMask, heightMask, world, audioManager)
	{
		if (this._state === /* tron.BULLET_STATE_ALIVE */ 1) 
		{
			var newposx = (this._posx + this._movx) & widthMask;
			var newposy = (this._posy + this._movy) & heightMask;
			
			var here = world.get(newposx, newposy);
			
			if (here > 0 || here < -2) 
			{
				this._state = /* tron.BULLET_STATE_EXPLODING1 */ 2;
				
				// sound
				audioManager.playSampleLocation(/* tron.SAMPLE_EXPLODE */ 1, 1.0, newposx, newposy);
			}			
			this._posx = newposx;
			this._posy = newposy;
		}
	},
	
	undraw: function(world)
	{
		if (this._state === /* tron.BULLET_STATE_ALIVE */ 1) 
		{
			//var x = this._posx;
			//var y = this._posy;
			//var w = this._world;
			world.set(this._posx, this._posy, /* tron.WORLD_EMPTY */ 0);
		}
	},
	
	draw: function(w)	
	{
		var i, j;
		var state = this._state;
		if (state === /* tron.BULLET_STATE_DEAD */ 5) 
		{
			return;
		}
		var x = this._posx;
		var y = this._posy;
		//var w = this._world;		
		
		if (state === /* tron.BULLET_STATE_ALIVE */ 1)
		{
			w.set(x, y, /* tron.WORLD_BULLET */ -4);
		}
		else
		{
			var c;
			if (state === 2) c = -1;
			if (state === 3) c = -2;
			if (state === 4) c = 0;
			var p = this._power;
			
			if (p === 2)
			{
				w.setSecure(x    , y - 2, c);
				w.setSecure(x - 1, y - 1, c);
				w.setSecure(x    , y - 1, c);
				w.setSecure(x + 1, y - 1, c);
				w.setSecure(x - 2, y    , c);
				w.setSecure(x - 1, y    , c);
				w.setSecure(x    , y    , c);
				w.setSecure(x + 1, y    , c);
				w.setSecure(x + 2, y    , c);					
				w.setSecure(x - 1, y + 1, c);
				w.setSecure(x    , y + 1, c);
				w.setSecure(x + 1, y + 1, c);
				w.setSecure(x    , y + 2, c);
			}
			else
			{		
				var abs = Math.abs;
				for (j = -p; j <= p; j++) 
				{
					var l = p - abs(j);
					for (i = -l; i <= l; i++) 
					{
						w.setSecure(x + i, y + j, c);						
					}
				}
			}
			this._state++			
		}
	}
};

