var tron = tron || {};

tron.Renderer = function(canvasId, aux, maxWidth, maxHeight)
{
	this._width = 0;
	this._height = 0;
	
	this._canvas = document.getElementById(canvasId);
/*	if (tron.IE8compat)
	{
		tron.IE8compat.initElement(this._canvas);
	}*/	
	this._context = this._canvas.getContext('2d');
	this._maxWidth = maxWidth;
	this._maxHeight = maxHeight;
	
	var canvasDrawOptimization = true;
	
	// the same trick applied on texture can be applied
	// this only works for FF and Opera
	
	if (canvasDrawOptimization)
	{
		if (this._canvas.style.msInterpolationMode !== undefined) {
			this._canvas.style.msInterpolationMode = "nearest-neighbor";
		} 
		else if (this._canvas.style.getPropertyValue("image-rendering") != null) 
		{
			this._canvas.style.setProperty ("image-rendering", "optimizeSpeed", null);
		}	
	}		
	
	if (aux && (this._canvas !== null)) 
	{
		this._auxCanvas = document.createElement('canvas');	
/*		if (tron.IE8compat)
		{
			tron.IE8compat.initElement(this._auxCanvas);
		}*/	
		this._auxContext = this._auxCanvas.getContext('2d');			
		this._auxCanvas.width = this._width;
		this._auxCanvas.height = this._height;	
		
		if (canvasDrawOptimization)
		{			
			if (this._auxCanvas.style)
			{
				if (this._auxCanvas.style.msInterpolationMode !== undefined) {
					this._auxCanvas.style.msInterpolationMode = "nearest-neighbor";
				} 
				else if (this._auxCanvas.style.getPropertyValue("image-rendering") != null) 
				{
					this._auxCanvas.style.setProperty ("image-rendering", "optimizeSpeed", null);
				}
			}
		}
	}
	else
	{	
		this._auxCanvas = null;
		this._auxContext = null;
	}
	/*
	// offscreen
	this._offCanvas = document.createElement('canvas');		
	this._offContext = this._offCanvas.getContext('2d');			
	this._offCanvas.width = this._width;
	this._offCanvas.height = this._height;	
	
	if (canvasDrawOptimization)
	{			
		if (this._offCanvas.style)
		{
			if (this._offCanvas.style.msInterpolationMode !== undefined) {
				this._offCanvas.style.msInterpolationMode = "nearest-neighbor";
			} 
			else if (this._offCanvas.style.getPropertyValue("image-rendering") != null) 
			{
				this._offCanvas.style.setProperty ("image-rendering", "optimizeSpeed", null);
			}
		}
	}
	*/
	this._isValid = (this._canvas !== null);
};

tron.Renderer.prototype = {
		
	setSize: function(w, h)
	{
		this._width = w;
		this._height = h;
		if (this._canvas) 
		{
			this._canvas.width = w;
			this._canvas.height = h;
			if (this._offCanvas) 
			{ 
				this._offCanvas.width = w;
				this._offCanvas.height = h;
			}
			
			if (this._auxCanvas)
			{
				this._auxCanvas.width = w;
				this._auxCanvas.height = h;
			}
		}
	},
	
	getWidth: function()
	{
		return this._width;
	},
	
	getHeight: function()
	{
		return this._height;
	},
	
	setColor: function(c)
	{
		if (this._canvas !== null) 
		{
			this._context.fillStyle = c;
		}
	},
	
	clear: function(clearColor)
	{
		if (this._canvas !== null) 
		{
			var context = this._context;
			context.fillStyle = clearColor;
			context.fillRect(0, 0, this._width, this._height);
		}
	},
	
	fillRect: function(x, y, w, h)
	{
		this._context.fillRect(x, y, w, h);
	},
	
	getCanvasContext: function()
	{
		return this._context;
		//return this._offContext;
	},
	
	getCanvas: function()
	{
		return this._canvas;
		//return this._offCanvas;
	},
	
	getAuxContext: function()
	{
		return this._auxContext;
	},
	
	getAuxCanvas: function()
	{		
		return this._auxCanvas;
	},
	
	flip: function()
	{
		this._context.drawImage(this._offCanvas, 0, 0);
	}
};
