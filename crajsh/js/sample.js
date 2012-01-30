var tron = tron || {};


// a sample has several sounds for simultaneous playback

tron.Sample = function(ssrc, baseVolume, nChannels)
{
	this._nChannels = nChannels;
	this._channels = new Array(nChannels);
	
	for( var i = 0; i < nChannels; ++i) 
	{
		this._channels[i] = new tron.Sound("", ssrc, false, baseVolume);
	} 	
};

tron.Sample.prototype = 
{
	// play a sound which isn't already playing
	play : function(t, volume)
	{
		var nChannels = this._nChannels;
		var channels = this._channels;
		var i, t;
		if (nChannels <= 0) { return false; }
		
		for(i = 0; i < nChannels; ++i) 
		{
			if(channels[i].play(t, volume)) 
			{ 
				return true; 
			}
		} 
		
		// VOICE STEALING
		// all channels already playing (or stuck in a FF 4 bug)
		// force play the least recently used
		var minVoice = -1;
		var minT = 1e100;
		for(i = 0; i < nChannels; ++i) 
		{
			if (!channels[i]._error)
			{
				t = channels[i]._t;
				if (t < minT)
				{
					minT = t;
					minVoice = i;
				}
			}
		}
		if (minVoice >= 0)
		{
			channels[minVoice].forceplay(t, volume);
			return true;
		}
		
		// not stealing			
		return false;
	},
	
	isLoaded : function()
	{
		var nChannels = this._nChannels;
		var channels = this._channels;
		for( var i = 0; i < nChannels; ++i) 
		{
			if(!channels[i].isLoaded()) 
			{
				return false;
			}
		} 		
		return true; // all channels loaded		
	}/*,
	
	checkEnded : function()
	{
		var nChannels = this._nChannels;
		var channels = this._channels;
		for( var i = 0; i < nChannels; ++i) 
		{
			channels[i].checkEnded();
		} 
	}*/
};