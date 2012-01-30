var tron = tron || {};

tron.Texture = function(filename, w, h, quality)
{
	this._path = filename;
//	this._name = name;
	this._width = w;
	this._height = h;
	
	var img = new Image();
	img.width = w;
	img.height = h;
	img.src = filename;
	
	var ieValue = quality ? "bicubic" : "nearest-neighbor";
    var ffValue = quality ? "optimizeQuality" : "optimizeSpeed";
	
	if (img.style.msInterpolationMode !== undefined) {
    	img.style.msInterpolationMode = ieValue;
    } 
	else if (img.style.getPropertyValue("image-rendering") != null) 
	{
    	img.style.setProperty ("image-rendering", ffValue, null);
	}
    /*if (img.style.getPropertyValue("image-rendering") != null)
    {
        alert('ok');
        img.style.setProperty ("interpolation-mode", "nearest-neighbor", null);
    }*/
	
	this._img = img;
	
};
    
tron.Texture.prototype = {
	isLoaded: function()
	{
		return this._img.complete; //loaded;
	}	
};

