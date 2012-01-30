var tron = tron || {};

/*
tron.MAX_BULLETS = 128;
*/

tron.BulletPool = function(game)
{
	var bullets = new Array(/* tron.MAX_BULLETS */ 128);
    this._bullets = bullets;
    this._count = 0;
    this._game = game;
    
    for (var i = 0; i < /* tron.MAX_BULLETS */ 128; i++) 
    {
        bullets[i] = new tron.Bullet(game);
    }
};

tron.BulletPool.prototype = {
	addBullet: function(x, y, dx, dy, power)
	{
		if (this._count < /* tron.MAX_BULLETS */ 128) 
		{
			this._bullets[this._count].init(x, y, dx, dy, power);
			this._count++;
		}
	},
	
	update: function(x, y, dx, dy)
	{
		var length = this._count;
		var world = this._game._world;
		var audioManager = this._game._audioManager;
        var widthMask = world._widthMask;
        var heightMask = world._heightMask;
        var bullets = this._bullets;
        var i = 0;
		for (i = 0; i < length; i++) 
		{
			bullets[i].update(widthMask, heightMask, world, audioManager);
		}
	},
	
	draw: function()
	{
		var length = this._count;
        var bullets = this._bullets;
        var world = this._game._world;
		for (var i = 0; i < length; i++) 
		{
			bullets[i].draw(world);
		}
	},
	
	undrawAndClean: function()
	{
		var i = 0;
        var bullets = this._bullets;
        var count = this._count;
        var world = this._game._world;
        
		for (var i = 0; i < count; i++) 
		{
			bullets[i].undraw(world);
		}     
		   
        i = 0;
		while (i < count) 
		{
			var bi = bullets[i];
			var state = bi._state;
			if (state === /* tron.BULLET_STATE_DEAD */ 5) 
			{
				count--;				
				// swap with last element
				var temp = bi;
				bullets[i] = bullets[count];
				bullets[count] = temp;
			}
			else 
			{
	//			if (state === /* tron.BULLET_STATE_ALIVE */ 1)
	//			{
	//				bi.undraw(world);	
	//			}
				i++;
			}
		}
        this._count = count;
	}
};
