var tron = tron || {};


tron.Camera = function(game, x, y)
{
    //this._game = game;
    //this._world = game._world;
    this._x = x;
    this._y = y;
    this._movx = 0;
    this._movy = 0;
    this._wx = game._world._width;
    this._wy = game._world._height;
};

tron.Camera.prototype = {
	follow: function(player, dx, dy)
	{
		var oldx = this._x;
		var oldy = this._y;
		//var world = this._world;
		
		/*
		var wx = world._width;
		var wy = world._height;
		
		if (tron.smoothMode)
		{
			dx *= 0.5;
			dy *= 0.5;
		}
		
		var newx = player._posx + dx + wx;
		var newy = player._posy + dy + wy;
		while(newx > wx) { newx -= wx; }
		while(newy > wy) { newy -= wy; }
		*/
		var wx = this._wx;
		var wy = this._wy;
		var wmask = wx - 1;
		var ymask = wy - 1;
		var newx = (player._posx + dx) & wmask;
		var newy = (player._posy + dy) & ymask;
		
		var movx = newx - oldx;
		var movy = newy - oldy;
		
		this._x = newx;
		this._y = newy;
		
		//var wx = this._world._width;
		//var wy = this._world._height;
		
		while (movx < -2) 
		{
			movx += wx;
		}
		while (movx > +2) 
		{
			movx -= wx;
		}
		while (movy < -2) 
		{
			movy += wy;
		}
		while (movy > +2) 
		{
			movy -= wy;
		}
		this._movx = movx;
		this._movy = movy;		
	}	
};

