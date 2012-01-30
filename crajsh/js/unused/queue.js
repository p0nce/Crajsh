var tron = tron || {};

tron.Queue = function(capacity)
{	
	this._start = 0;	
	this._stop = 0;
	this._data = new Array(capacity);
}

tron.Queue.prototype.empty = function()
{
	return this._stop === this._start;	
}

tron.Queue.prototype.size = function()
{
	return this._stop - this._start;	
}

tron.Queue.prototype.push = function(e)
{
	// no check !
	this._data[this._stop] = e; 
	this._stop += 1; 
}

tron.Queue.prototype.push2 = function(e, f)
{
	// no check !
	var stop = this._stop;
	this._data[stop++] = e;
	this._data[stop++] = f;
	this._stop = stop; 
}

tron.Queue.prototype.pop = function()
{
	var res = this._data[this._start];
	this._start += 1;
	return res;
}

tron.Queue.prototype.clear = function()
{
	this._start = 0;
	this._stop = 0;
}
