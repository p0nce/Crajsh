var tron = tron || {};

tron.Stack = function(capacity)
{		
	this._index = 0;
	this._capacity = capacity;
	this._data = new Array(capacity);
}

tron.Stack.prototype.push = function(e)
{
	if (this._index === this._capacity) throw new Error("full stack");
	
	this._data[this._index] = e;
	this._index += 1;
}

tron.Stack.prototype.pop = function()
{
	if (this._index === 0) throw new Error("empty");
	this._index -= 1;
	return this._data[this._index];
}

tron.Stack.prototype.clear = function()
{
	this._index = 0;
}
