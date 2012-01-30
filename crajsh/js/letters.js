var tron = tron || {};

tron.Letters = function(textures)
{
	this._lettersImage = textures.get(/* tron.TEXTURE_LETTERS */ 7)._img;
	
	var N = 16;
	
	this._count = N;
	
	this._s = new Array(N);
	this._x = new Array(N);
	this._y = new Array(N);
	this._w = new Array(N);
	this._h = new Array(N);
	
	this.addLetter(0, "A", 0, 0, 31, 47);
	this.addLetter(1, "C", 31, 0, 31, 47);
	this.addLetter(2, "D", 62, 0, 31, 47);
	this.addLetter(3, "E", 93, 0, 31, 47);
	this.addLetter(4, "G", 124, 0, 31, 47);
	this.addLetter(5, "H", 155, 0, 31, 47);
	this.addLetter(6, "K", 0, 47, 31, 59);
	this.addLetter(7, "M", 31, 47, 47, 47);
	this.addLetter(8, "O", 78, 47, 31, 47);
	this.addLetter(9, "R", 109, 47, 31, 47);
	this.addLetter(10, "T", 140, 47, 37, 47);
	this.addLetter(11, "U", 31, 94, 31, 47);
	this.addLetter(12, "W", 62, 94, 47, 47);
	this.addLetter(13, "Y", 109, 94, 31, 47);
	this.addLetter(14, "L", 140, 94, 31, 47);
	this.addLetter(15, "P", 0, 106, 31, 47);
	
};

tron.Letters.prototype = {
	
	addLetter : function(i, s, x, y, w, h)
	{
		this._s[i] = s;
		this._x[i] = x;
		this._y[i] = y;
		this._w[i] = w;
		this._h[i] = h;
	},
	
	// draw a letter, centered
	drawLetter : function(renderer, s)
	{
		if (!renderer) return;
		var count = this._count;
		var ms = this._s;
		for (var i = 0; i < count; ++i)
		{
			if (s === ms[i])
			{
				// found
				var w = this._w[i];
				var h = this._h[i];
				var sx = this._x[i];
				var sy = this._y[i];
				var ctx = renderer.getCanvasContext();
				var rx = renderer._width;
				var ry = renderer._height;
				
				if (ctx)
				{
					ctx.drawImage(this._lettersImage, sx, sy, w, h, (rx - w) >> 1, (ry - h) >> 1, w, h);					
				}
				return;
			}
		}		
	}
	
};