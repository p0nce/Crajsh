var tron = tron || {};



// state of the screen
tron.PatternManager = function()
{	
//	var E = /* tron.WORLD_EMPTY */ 0;
//	var B = /* tron.WORLD_WALL_BLUE   */ -5;
//	var G = /* tron.WORLD_WALL_GREEN  */ -6;
//	var O = /* tron.WORLD_WALL_ORANGE */ -7;
//	var Y = /* tron.WORLD_WALL_YELLOW */ -8;
//	var W = /* tron.WORLD_WALL_WHITE  */ -9;
//	var K = /* tron.WORLD_WALL_BLACK  */ -10;
//	var R = /* tron.WORLD_WALL_RED    */ -11;
//	var P = /* tron.WORLD_WALL_PINK   */ -12;
//	var V = /* tron.WORLD_WALL_VIOLET */ -13;
//	var C = /* tron.WORLD_WALL_GREY   */ -14;
//	var A = /* tron.WORLD_WALL_CYAN   */ -15;
//	
//	
//	var X = /* tron.WORLD_POWERUP_YELLOW */ -16;
//	var I = /* tron.WORLD_POWERUP_GREEN  */ -17;
//	//var Z = /* tron.WORLD_POWERUP_ORANGE */ -19;
//	var U = /* tron.WORLD_POWERUP_PINK */ -18;
//	
//	var D = /* tron.WORLD_TRIANGLE_SW */ -20;
//    var F = /* tron.WORLD_TRIANGLE_NW */ -21;
//    var H = /* tron.WORLD_TRIANGLE_NE */ -22;
//    var J = /* tron.WORLD_TRIANGLE_SE */ -23;
	
	
	this._items = new Array(9);
	
	// pieuvre
	this._items[0] = new tron.Pattern(1.0, 7, 7, 
	"EEEAAEEEEAKAAEHAAAAAAEEEUAKAJAAEAAEEEAEAEEEEFEHEE");
	
	// tete de fourmi
	this._items[1] = new tron.Pattern(0.4, 9, 7, 
	"EEPEEEPEEEEEVEVEEEEVVVEVVVEEVKVEVKVEEVVVEVVVEEEEEIEEEEEEJVVVDEE");
	
	// invader
	this._items[2] = new tron.Pattern(1.0, 7, 5, 
	"EEBBBEEEBKBKBEHBBBBBFEEEXEEEJBBBBBD");
	
	// croisement violet
	this._items[3] = new tron.Pattern(0.1, 9, 9, 
	"EEEJEDEEEEVVVEVVVEEVKVEVKVEJVVPEPVVDEEEEIEEEEHVVPEPVVFEVKVEVKVEEVVVEVVVEEEEHEFEEE");	
	
	// pieuvre 2
	this._items[4] = new tron.Pattern(0.3, 7, 7, 
	"EEEAAEEEEAKAAEHAAAAAAEEEUAKAJAAEAAFEEAEEEEEEAADEE");
	
	// invader 2
	this._items[5] = new tron.Pattern(0.8, 5, 5, 
	"EBBBEBKBKBHBBBFEEXEEJBBBD");
	
	// pieuvre 3
	this._items[6] = new tron.Pattern(0.2, 7, 7, 
	"EEEAAEEEEAKAAEAAAAAAAAEEUAKAAEAEAAEAEAEAEEFEPEHEE");
	
	// small losange
	this._items[7] = new tron.Pattern(1.0, 2, 2, 
	"JDHF");
	
	// mid losange
	this._items[8] = new tron.Pattern(0.5, 3, 3, 
	"JBDBPBHBF");
	
	// all
	
	//this._items[7] = new tron.Pattern(200, 12, 1, "EBGOYWKRPVCA");
	
	
	
	
	/*// small wall
	this._items[3] = new tron.Pattern(2.0, 5, 1, 
	"BBBBB");
	
	// long wall
	this._items[4] = new tron.Pattern(2.0, 10, 1, 
	"BBBBBBBBBB");
	
	// long wall
	this._items[5] = new tron.Pattern(2.0, 15, 1, 
	"BBBBBBBBBBBBBBB");
	*/
	
	/*	
	
	this._items[3] = new tron.Pattern(1.0, 7, 7, [	 	
	    E, E, P, E, P, E, E,
		E, B, B, E, B, B, E,
		P, B, E, E, E, B, P,
		E, E, E, R, E, E, E,
		P, B, E, E, E, B, P,
		E, B, B, E, B, B, E,
		E, E, P, E, P, E, E,	
	]);
	
	this._items[4] = new tron.Pattern(1.0, 7, 5, [	 	
	    E, B, B, B, B, B, E,
		P, B, E, E, E, B, P,
		E, E, E, R, E, E, E,
		P, B, E, E, E, B, P,
		E, B, B, B, B, B, E,		
	]);
	*/
	
	/*
	this._items[1] = new tron.Pattern(1.0, 3, 7, [
		PI, BL, BL, BL, PI,
		EM, EM, BL, EM, EM,
		PI, EM, BL, EM, PI,
		BL, EM, EM, EM, BL,
		BL, BL, BL, BL, BL,
	]);
	*/
	/*
	this._items[2] = new tron.Pattern(1.0, 5, 5, [
		EM, BL, EM, BL, EM,
		BL, BL, EM, BL, BL,
		EM, EM, EM, EM, EM,
		BL, BL, EM, BL, BL,
		EM, BL, EM, BL, EM,
	]);
	
	this._items[3] = new tron.Pattern(1.0, 5, 5, [
		EM, BL, EM, BL, EM,
		BL, BL, EM, BL, BL,
		EM, EM, RE, EM, EM,
		BL, BL, EM, BL, BL,
		EM, BL, EM, BL, EM,
	]);
	*/
	this._totalWeight = this.computeTotalWeight();
	
};

tron.PatternManager.prototype = {	
	
	computeTotalWeight: function()
	{
		var patterns = this._items;
		var nPatterns = patterns.length;
		var totalWeight = 0.0;
	    for (i = 0; i < nPatterns; ++i)
	    {
		    totalWeight += patterns[i]._weight;
	    }	
	    return totalWeight;
	},
	
	getRandomPattern : function()
	{
		var patterns = this._items;
		var nPatterns = patterns.length;
		var dice = Math.random() * this._totalWeight;	
		
		for (i = 0; i < nPatterns; ++i)
	    {
		    dice -= patterns[i]._weight;
		    if (dice < 0)
		    {
				return patterns[i];
		    }
	    }
	    return patterns[nPatterns - 1];
	},
	
	addPatterns : function(world, n)
    {
	    var i;
	    var wx = world._width;
	    var wy = world._height;
	    var x, y, pattern, orientation;
	    
	    for (i = 0; i < n; ++i)
	    {			
			var timeout = 0;
			var success = true;
			do
			{
				pattern = this.getRandomPattern();
				x = Math.round(Math.random() * wx);
				y = Math.round(Math.random() * wy);	
				orientation = Math.floor(Math.random() * 8.0);
				timeout ++;			
				if (++timeout > 50)
				{
					success = false;
					break;
				}
			} while( !pattern.test(world, x, y, orientation) );
			
			if (success)
			{
				pattern.draw(world, x, y, orientation);
			}			
	    }
    }
};

