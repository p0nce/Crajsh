var tron = tron || {};

Function.prototype.bind = function()
{ 
	var fn = this, args = Array.prototype.slice.call(arguments), object = args.shift(); 
	return function()
	{ 
		return fn.apply(object, 
		args.concat(Array.prototype.slice.call(arguments))); 
	}; 
}; 

tron.randInt = function(a, b)
{
    // assumes b >= a
    return a + Math.floor(Math.random() * (b - a));
};

tron.fillArray = function(a, e)
{
	var l = a.length;
	for (var i = 0; i < l; ++i)
	{
		a[i] = e;
	}	
}
