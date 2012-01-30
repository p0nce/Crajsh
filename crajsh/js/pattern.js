var tron = tron || {};

tron.stringToWorld = function(x)
{	
	if (x === "E") { return /* tron.WORLD_EMPTY       */ 0;      }
	if (x === "B") { return /* tron.WORLD_WALL_BLUE   */ -5;     }
	if (x === "G") { return /* tron.WORLD_WALL_GREEN  */ -6;     }
	if (x === "O") { return /* tron.WORLD_WALL_ORANGE */ -7;     }
	if (x === "Y") { return /* tron.WORLD_WALL_YELLOW */ -8;     }
	if (x === "W") { return /* tron.WORLD_WALL_WHITE  */ -9;     }
	if (x === "K") { return /* tron.WORLD_WALL_BLACK  */ -10;    }
	if (x === "R") { return /* tron.WORLD_WALL_RED    */ -11;    }
	if (x === "P") { return /* tron.WORLD_WALL_PINK   */ -12;    }
	if (x === "V") { return /* tron.WORLD_WALL_VIOLET */ -13;    }
	if (x === "C") { return /* tron.WORLD_WALL_GREY   */ -14;    }
	if (x === "A") { return /* tron.WORLD_WALL_CYAN   */ -15;    }
	if (x === "X") { return /* tron.WORLD_POWERUP_YELLOW */ -16; }
	if (x === "I") { return /* tron.WORLD_POWERUP_GREEN  */ -17; }
	if (x === "Z") { return /* tron.WORLD_POWERUP_ORANGE */ -19; }
	if (x === "U") { return /* tron.WORLD_POWERUP_PINK */ -18;   }
	if (x === "D") { return /* tron.WORLD_TRIANGLE_SW */ -20;    }
	if (x === "F") { return /* tron.WORLD_TRIANGLE_NW */ -21;    }
	if (x === "H") { return /* tron.WORLD_TRIANGLE_NE */ -22;    }
	if (x === "J") { return /* tron.WORLD_TRIANGLE_SE */ -23;    }
	return "A";
};


// state of the screen
tron.Pattern = function(weight, w, h, content)
{
	this._weight = weight;
	this._width = w;	
	this._height = h;
	
/*	if (typeof content === "string")
	{	
		*/
		var N = content.length;
		this._content = new Array(N);
		var stoW = tron.stringToWorld;
		
		for (var i = 0; i < N; ++i)
		{
			this._content[i] = stoW(content[i]);
		}/*
	}
	else
	{
		this._content = content;
	}
	*/
	
};

tron.Pattern.prototype = {
	
	draw: function(world, x, y, orientation)
	{
		var i, j;
		var w = this._width;
		var h = this._height;
		var content = this._content;
		var translate = this._translate;
		
		// choose a random orentation
		switch(orientation)
		{
			case 0:	
				for (j = 0; j < h; ++j)
				{
					for (i = 0; i < w; ++i)
					{	
						world.setSecure(x + i, y + h - 1 - j, translate(this, orientation, content[j * w + i]));
					}
				}
				break;
				
			case 1:
				for (j = 0; j < h; ++j)
				{
					for (i = 0; i < w; ++i)
					{	
						world.setSecure(x + w - 1 - i, y + j, translate(this, orientation, content[j * w + i]));						
					}
				}
				break;
			
			case 2:
				for (j = 0; j < h; ++j)
				{
					for (i = 0; i < w; ++i)
					{	
						world.setSecure(x + w - 1 - i, y + h - 1 - j, translate(this, orientation, content[j * w + i]));						
					}
				}
				break;
			
			case 3:
			
				for (j = 0; j < h; ++j)
				{
					for (i = 0; i < w; ++i)
					{	
						world.setSecure(x + i, y + j, translate(this, orientation, content[j * w + i]));
					}
				}
				break;
				
			case 4:	
				for (j = 0; j < h; ++j)
				{
					for (i = 0; i < w; ++i)
					{	
						world.setSecure(x + h - 1 - j, y + i, translate(this, orientation, content[j * w + i]));						
					}
				}
				break;
				
			case 5:
				for (j = 0; j < h; ++j)
				{
					for (i = 0; i < w; ++i)
					{	
						world.setSecure(x + j, y + w - 1 - i, translate(this, orientation, content[j * w + i]));						
					}
				}
				break;
			
			case 6:
				for (j = 0; j < h; ++j)
				{
					for (i = 0; i < w; ++i)
					{	
						world.setSecure(x + h - 1 - j, y + w - 1 - i, translate(this, orientation, content[j * w + i]));						
					}
				}
				break;
			
			case 7:
			default:
			
				for (j = 0; j < h; ++j)
				{
					for (i = 0; i < w; ++i)
					{	
						world.setSecure(x + j, y + i, translate(this, orientation, content[j * w + i]));
					}
				}
				break;
			
		}
	},
	
	test: function(world, x, y, orientation)
	{
		var i, j;
		var w = this._width;
		var h = this._height;
		var content = this._content;
		var translate = this._translate;
		var wo, co;
		for (j = 0; j < h; ++j)
		{
			for (i = 0; i < w; ++i)
			{	
				
			/*	if (i < 0 || j < 0 || j >= h || i >= w)
				{
					wo = world.get(x + i, y + j);
					if (wo !== 0) 
					{
						return false;	
					}
				}
				else
				{				
			*/		switch(orientation)
					{
						case 0:	
							wo = world.get(x + i, y + h - 1 - j);
							break;
							
						case 1:
							wo = world.get(x + w - 1 - i, y + j);
							break;
						
						case 2:
							wo = world.get(x + w - 1 - i, y + h - 1 - j);
							break;
						
						case 3:
							wo = world.get(x + i, y + j);
							break;	
							
						case 4:	
							wo = world.get(x + h - 1 - j, y + i );
							break;
							
						case 5:
							wo = world.get(x + j, y + w - 1 - i);
							break;
						
						case 6:
							wo = world.get(x + h - 1 - j, y + w - 1 - i);
							break;
						
						case 7:
						default:					
							wo = world.get(x + j, y + i);
							break;								
					}
					wo = translate(this, orientation, wo)
					co = content[i + w * j];
					var matching = (co === wo) && (wo !== /* tron.WORLD_WALL_BLUE */ -5); // blue wall does not match
					if ((wo !== 0) && (!matching))
					{
						return false;
					}
			//	}
			}
		}
		return true;
	},
	
	_SW: [-21, -23, -22, -20, -21, -23, -20, -22 ],
	_NW: [-20, -22, -23, -21, -22, -20, -23, -21 ],
	_NE: [-23, -21, -20, -22, -23, -21, -22, -20 ],
	_SE: [-22, -20, -21, -23, -20, -22, -21, -23 ],
	
	_translate : function(t, orientation, x)
	{
		if (x > /* tron.WORLD_TRIANGLE_SW */ -20)
		{
			return x;	
		}
		
		switch(x)
		{
			case /* tron.WORLD_TRIANGLE_SW */ -20: return t._SW[orientation];
			case /* tron.WORLD_TRIANGLE_NW */ -21: return t._NW[orientation];
			case /* tron.WORLD_TRIANGLE_NE */ -22: return t._NE[orientation];
			case /* tron.WORLD_TRIANGLE_SE */ -23: return t._SE[orientation];		
			default: return x;
		}		
	}
};