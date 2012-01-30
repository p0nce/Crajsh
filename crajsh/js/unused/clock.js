var gfm = gfm || {};

gfm.Clock = function()
{
    this._firstTick = true;
    this._oldTime;
    this._time;
    this._dt;
};

gfm.Clock.prototype.tick = function()
{
    var now = new Date();
    if (this._firstTick) 
    {
        this._time = now.getTime() * 0.001;
        this._oldTime = this._time;
        this._dt = 0;
        this._firstTick = false;
    }
    else 
    {
        this._oldTime = this._time;
        this._time = now.getTime() * 0.001;
        this._dt = this._time - this._oldTime;
    }
};

gfm.Clock.prototype.getDeltaTime = function()
{
    return this._dt;
};
