var tron = tron || {};

/*
tron.DIR_UP = 0;
tron.DIR_DOWN = 1;
tron.DIR_LEFT = 2;
tron.DIR_RIGHT = 3;

tron.COMMAND_NONE = -1;
tron.COMMAND_UP = 0;
tron.COMMAND_DOWN = 1;
tron.COMMAND_LEFT = 2;
tron.COMMAND_RIGHT = 3;
tron.COMMAND_TURN_LEFT = 4;
tron.COMMAND_TURN_RIGHT = 5;
tron.COMMAND_SHOOT = 6;
*/

/* 
tron.COMMAND_QUEUE_LENGTH = 40;
*/

tron.TURN_PROBABILITY = [-1.0, 0.999, 0.9, 0.7, 0.4, 0.3, 0.2, 0.1, 0.05, 0.025];

/*
tron.STATE_ALIVE = 1;
tron.STATE_EXPLODING1 = 2;
tron.STATE_EXPLODING2 = 3;
tron.STATE_EXPLODING3 = 4;
tron.STATE_EXPLODING4 = 5;
tron.STATE_DEAD = 6;

tron.BULLET_DELAY = 40;

tron.SIGHT = 8;

tron.INVINCIBILITY_DURATION = 52;
*/

/* tron.PLAYERS_DO_EXPLODE = 0; */

tron.directionX = function(dir)
{
	switch(dir)
    {   
        case /* tron.DIR_LEFT */ 2:
            return -1;
            
        case /* tron.DIR_RIGHT */ 3:
			return 1;
            
        //case /* tron.DIR_UP */ 0:
        //case /*tron.DIR_DOWN */ 1:  
		//	return 0;
		default:
			return 0;
	}
};

tron.directionY = function(dir)
{
	switch(dir)
    {
        case /* tron.DIR_UP */ 0: return -1;
        case /*tron.DIR_DOWN */ 1: return 1;
        //case /* tron.DIR_LEFT */ 2:
        //case /* tron.DIR_RIGHT */ 3: return 0;
		default: return 0;
	}
};


tron.Player = function(game, human, team, posx, posy, dir)
{
    this._game = game;
    this._state = /* tron.STATE_ALIVE */ 1;
    this._turbo = false;
    this._human = human;
    this._world = game._world;
    this._posx = posx | 0;
    this._posy = posy | 0;
    this._team = team | 0;
    this._dir = -1; // invalid
    this._movx = 1;
    this._movy = 0;
    
    this._waitforshoot = 0;///* tron.BULLET_DELAY */ 40;
    this._sight = /* tron.SIGHT */ 8;
    this._scratchSight = 15;
    this._scratchSize = (2 * this._scratchSight + 1) | 0;
    this._scratch = new Array(this._scratchSize * this._scratchSize);
    this._scratch2 = new Array(this._scratchSize * this._scratchSize);
	
    //this._queue = new tron.Queue(30 * this._scratchSize * this._scratchSize + 1);
    
    this._queueData = new Array(40 * this._scratchSize * this._scratchSize + 1);
    //this._lifetime = 0;
    this._likeToTurn = 0.010 + Math.random() * 0.01;
    this._likeShooting = 0.035 + 0.03 * Math.random();
    
    
    this._commandQueue = new Array(/* tron.COMMAND_QUEUE_LENGTH */ 40);
    
    this._commandIndex = 0; // command remaining
    this.setDirection(dir);
    this._lastTurn = (Math.random() < 0.5);
    this._warning = 0;
    
    this._invincibility = 0;
    this._tripleShoot = 0;    
    
    
    for (var i = 0; i < /* tron.COMMAND_QUEUE_LENGTH */ 40; ++i) 
    {
        this._commandQueue[i] = /* tron.COMMAND_NONE */ -1;
    }    
    
    var fillArray = tron.fillArray;
    fillArray( this._queueData, 0);
    fillArray( this._scratch, 0);
    fillArray( this._scratch2, 0);
};

tron.Player.prototype = {

	setDirection: function(d)
	{
		var cdir = this._dir;
		switch (d)
		{
			case /* tron.DIR_UP */ 0:
				if (cdir === /*tron.DIR_DOWN */ 1) 
				{					
					if (this._turbo)
					{
						this._turbo = false;
					}
					else
					{
						this.shoot();
					}
					return;
				}				
				this._movx = 0;
				this._movy = -1;
				break;
				
			case /*tron.DIR_DOWN */ 1:
				if (cdir === /* tron.DIR_UP */ 0) 
				{					
					if (this._turbo)
					{
						this._turbo = false;
					}
					else
					{
						this.shoot();
					}
					return;
				}
				this._movx = 0;
				this._movy = 1;
				break;
				
			case /* tron.DIR_LEFT */ 2:
				if (cdir === /* tron.DIR_RIGHT */ 3) 
				{					
					if (this._turbo)
					{
						this._turbo = false;
					}
					else
					{
						this.shoot();			
					}
					return;
				}
				this._movx = -1;
				this._movy = 0;
				break;
				
			case /* tron.DIR_RIGHT */ 3:
				if (cdir === /* tron.DIR_LEFT */ 2) 
				{					
					if (this._turbo)
					{
						this._turbo = false;
					}
					else
					{
						this.shoot();
					}
					return;
				}
				this._movx = 1;
				this._movy = 0;
				break;
		}
		
		if ((cdir === d) && (this._human))
		{
			this._turbo = !this._turbo;	
		}
		else
		{
			this._turbo = false;	
		}
		this._dir = d;
	},
	
	turnLeftDirection: function(dir)
	{
		switch (dir)
		{
			case /* tron.DIR_UP */ 0:
				return /* tron.DIR_LEFT */ 2;				
			case /*tron.DIR_DOWN */ 1:
				return /* tron.DIR_RIGHT */ 3;				
			case /* tron.DIR_LEFT */ 2:
				return /*tron.DIR_DOWN */ 1;				
			case /* tron.DIR_RIGHT */ 3:
				return /* tron.DIR_UP */ 0;
			//default:
			//	return 
		}
	},
		
	turnRightDirection: function(dir)
	{
		switch (dir)
		{
			case /* tron.DIR_UP */ 0:
				return /* tron.DIR_RIGHT */ 3;
			case /*tron.DIR_DOWN */ 1:				
				return /* tron.DIR_LEFT */ 2;
			case /* tron.DIR_LEFT */ 2:
				return /* tron.DIR_UP */ 0;
			case /* tron.DIR_RIGHT */ 3:
				return /*tron.DIR_DOWN */ 1;
			default:
				
		}
	},
	
	turnLeft: function()
	{
		var d = this.turnLeftDirection(this._dir);
		this.setDirection(d);
	},
	
	turnRight: function()
	{
		var d = this.turnRightDirection(this._dir);
		this.setDirection(d);
	},
	
	direction2command: function()
	{
		switch (this._dir)
		{
			case /* tron.DIR_UP */ 0:
				return /* tron.COMMAND_UP */ 0;
			case /*tron.DIR_DOWN */ 1:
				return /* tron.COMMAND_DOWN */ 1;
			case /* tron.DIR_LEFT */ 2:
				return /* tron.COMMAND_LEFT */ 2;
			case /* tron.DIR_RIGHT */ 3:
				return /* tron.COMMAND_RIGHT */ 3;
		}
	},
	
	executeCommand: function(cmd)
	{
		switch (cmd)
		{
			
			case 0:
			case 1:
			case 2:
			case 3:
				this.setDirection(cmd);
				return;
				
			case /* tron.COMMAND_TURN_LEFT */ 4:
				this.turnLeft();
				return;
			case /* tron.COMMAND_TURN_RIGHT */ 5:
				this.turnRight();
				return;
			case /* tron.COMMAND_SHOOT */ 6:
				this.shoot();
				return;		
		}		
	},
	
	shoot: function()
	{
		if (this._waitforshoot === 0) 
		{
			if (this._invincibility > 0) return;
			var movx = this._movx;
			var movy = this._movy;
			var world = this._world;
			var widthMask = world._widthMask;
			var heightMask = world._heightMask;
			var mx = (this._posx + movx) & widthMask;
			var my = (this._posy + movy) & heightMask;			
			var bpool = this._game._bulletPool;
			var tripleShoot = this._tripleShoot;
			var power = tripleShoot + 1;
			var mx2, my2, mx3, my3;
			bpool.addBullet(mx, my, movx, movy, power);
			if (this._tripleShoot > 0)
			{
				mx2 = (this._posx - movy) & widthMask;
				my2 = (this._posy + movx) & heightMask;
				if (world.get(mx2, my2) == 0)
				{
					bpool.addBullet(mx2, my2, movx, movy, power);
				}
				mx3 = (this._posx + movy) & widthMask;
				my3 = (this._posy - movx) & heightMask;
				if (world.get(mx3, my3) == 0)
				{
					bpool.addBullet(mx3, my3, movx, movy, power);
				}
			}
			this._waitforshoot = /* tron.BULLET_DELAY */ 40;
			
			// bullet sound
			this._game._audioManager.playSampleLocation(/* tron.SAMPLE_SHOOT */ 0, 1.0, mx, my);
		}
	},
	/*
	hasCommand: function()
	{
		return this._commandIndex > 0.5;
	},
	*/
	
	pushCommand: function(cmd)
	{
		if (this._state !== /* tron.STATE_ALIVE */ 1) 
		{
			return;
		}
		
		if (this._commandIndex < /* tron.COMMAND_QUEUE_LENGTH */ 40) // not full ?
		{
			this._commandQueue[this._commandIndex] = cmd;
			(this._commandIndex)++;
		}
	},
	
	popCommand: function(cmd)
	{
		var res = this._commandQueue[0];
		this._commandIndex--;
		var remaining = this._commandIndex;
		
		for (var i = 0; i < remaining; ++i) 
		{
			this._commandQueue[i] = this._commandQueue[i + 1];
		}
		//if (typeof res === "undefined") console.log("poped an undefined command");
		return res;
	},	
	
	intelligence: function()
	{
		if (this._state !== /* tron.STATE_ALIVE */ 1) 
		{
			return;
		}
		
		if (this._invincibility > 0)
		{
			this._invincibility--;			
		}
		
		if (this._human) 
		{
			return;
		}
		
		var hasCommand = this._commandIndex > 0.5; //this.hasCommand();
		
		
		// find time to live
		
		// TODO make something less dumb
		var sight = this._sight;
		var sightSide = sight;
		var world = this._world;
		var bx = this._posx;
		var by = this._posy;
		//var x = bx;
		//var y = by;
		var mx = this._movx;
		var my = this._movy;
		var prob = tron.TURN_PROBABILITY;
		var index, val;
		var px, py, pl, pturn, minturns, minpx, minpy, minl, val2, commandPopped, iwillsurvive, ndir;
		
		
		if (hasCommand)
		{
			/* If the AI has command, we only check that we don't run into something */
			
			// check next location
			commandPopped = this._commandQueue[0];			
			iwillsurvive = true;
			switch (commandPopped)
			{
				case /* tron.COMMAND_UP */ 0:
				case /* tron.COMMAND_DOWN */ 1:
				case /* tron.COMMAND_LEFT */ 2:
				case /* tron.COMMAND_RIGHT */ 3:
					val = world.get(bx + tron.directionX(commandPopped), by + tron.directionY(commandPopped));
					iwillsurvive = ((val /* tron.EMPTY */ === 0) || (val ===  /* tron.BULLET */ -4));
					break;
					
				case /* tron.COMMAND_TURN_LEFT */ 4:
					ndir = this.turnLeftDirection(this._dir);
					val = world.get(bx + tron.directionX(ndir), by + tron.directionY(ndir));
					iwillsurvive = ((val /* tron.EMPTY */ === 0) || (val ===  /* tron.BULLET */ -4));
					break;
					
				case /* tron.COMMAND_TURN_RIGHT */ 5:
					ndir = this.turnRightDirection(this._dir);
					val = world.get(bx + tron.directionX(ndir), by + tron.directionY(ndir));
					iwillsurvive = ((val /* tron.EMPTY */ === 0) || (val ===  /* tron.BULLET */ -4));
					break;
					
				case /* tron.COMMAND_SHOOT */ 6:
					iwillsurvive = true;
					break;
					
				default:
					//console.log('cmd = ' + commandPopped);
					break;
			}
			
			if (iwillsurvive) 
			{
				return; /* exit the function safely */
			}
			else 
			{
				this._commandIndex = 0; /* clear command index */
			}
		}
		
		var findAPath = Math.random() < 0.002; // occasionnally we trigger a search for an exit without a danger
		
		for (var i = 1; i < sight; ++i) 
		{
			val = world.get(bx + mx * i, by + my * i);
			
			if (findAPath || val /* tron.EMPTY */ !== 0 && val !== /* tron.BULLET*/ -4)
			{
				if (findAPath || i <= 2)
				{
				
					//var queue = this._queue;
					var scratchSize = this._scratchSize | 0;
					var scratch = this._scratch; // scratch will store surroundings
					var scratch2 = this._scratch2; // scratch2 will store a path from center (with commands)
					var ssight = this._scratchSight | 0;
					var UP = /* tron.COMMAND_UP */ 0;
					var DOWN = /* tron.COMMAND_DOWN */ 1;
					var LEFT = /* tron.COMMAND_LEFT */ 2;
					var RIGHT = /* tron.COMMAND_RIGHT */ 3;
					var NONE = /* tron.COMMAND_NONE */ -1;
					var e, lastcmd;
					
					var queue_start = 0;
					var queue_stop = 0;
					var queue_data = this._queueData;
					
					/* get surroundings	*/
					world.gets(bx - ssight, by - ssight, scratchSize, scratchSize, scratch);
					
					// fill scratch 2 
					for (var k = 0; k < scratchSize * scratchSize; ++k) 
					{
						scratch2[k] = NONE;
					}
					
					index = (ssight | 0) * scratchSize + (ssight | 0);
					
					scratch2[index] = this._dir; //this.direction2command();
					
					// push initial element
					queue_data[queue_stop++] = ssight | 0; // x
					queue_data[queue_stop++] = ssight | 0; // y
					queue_data[queue_stop++] = 0; // generations
					queue_data[queue_stop++] = 0; // number of turns
					//queue_stop = (queue_stop + 4) | 0;
					
					//var total = 1;
					//var log_push = false;
					
					for (var iter = 0; iter < ssight; iter++) 
					{
						/* if (log_push) console.log("iter = " + iter + "   queue contains " + (queue_stop - queue_start) / 4 + " items"); */
						/* if empty we lost the search */
						if (queue_start === queue_stop) 
						{
							/* console.log("breaking"); */
							break;
						}
						
						/* peek head element */
						px = queue_data[queue_start] | 0;
						py = queue_data[queue_start + 1] | 0;
						pl = queue_data[queue_start + 2] | 0;
						pturn = queue_data[queue_start + 3] | 0;
						lastcmd = scratch2[px * scratchSize + py] | 0;
						
		/*				
						if (pl !== iter)
						{
							alert('WTF!!!!!    pl is ' + pl + ' and iter is ' + iter);	
						}						
		*/				
						//var pushed = 0;
						//var read = 0;
						
						while (pl === iter) 
						{
							//read++;
							//if (log_push) console.log("read " + px + "," + py + " gen = " + pl + " turns = " + pturn);
							
							queue_start = (queue_start + 4) | 0;
							
							if ((lastcmd !== RIGHT) && (px > 0)) 
							{
								index = 0 | (((px - 1) | 0) + scratchSize * (py | 0));
								if (scratch2[index] === NONE) // not visited
								{
									val2 = scratch[index];
									if ((val2 /* tron.EMPTY */ === 0) || (val2 === /* tron.BULLET*/ -4))
									{
										queue_data[queue_stop++] = (px - 1) | 0;
										queue_data[queue_stop++] = py;
										queue_data[queue_stop++] = (iter + 1) | 0;
										queue_data[queue_stop++] = 0 | (pturn + ((lastcmd === LEFT) ? 0 : 1));
										scratch2[index] = LEFT;
										/*
										if (log_push) console.log("push " + queue_data[queue_stop-4] + "," 
										+ queue_data[queue_stop-3] + " gen = " + queue_data[queue_stop-2] + " turns = " + queue_data[queue_stop-1]);
										
										pushed++;
										*/
										
									}
									else 
									{
										scratch2[index] = -2; // wall
									}
								}
							}
							
							if ((lastcmd !== LEFT) && (px < scratchSize - 1)) 
							{
								index = 0 | ( ((px + 1) | 0) + scratchSize * (py | 0));
								if (scratch2[index] === NONE) // not visited
								{
									val2 = scratch[index];
									if ((val2 /* tron.EMPTY */ === 0) || (val2 === /* tron.BULLET*/ -4))
									{
										queue_data[queue_stop++] = (px + 1) | 0;
										queue_data[queue_stop++] = py;
										queue_data[queue_stop++] = (iter + 1) | 0;
										queue_data[queue_stop++] = 0 | (pturn + ((lastcmd === RIGHT) ? 0 : 1));
										scratch2[index] = RIGHT;
										/*
										if (log_push) console.log("push " + queue_data[queue_stop-4] + "," 
										+ queue_data[queue_stop-3] + " gen = " + queue_data[queue_stop-2] + " turns = " + queue_data[queue_stop-1]);
										
										pushed++;
										*/
										
									}
									else 
									{
										scratch2[index] = -2; // wall
									}
								}
							}
							
							if ((lastcmd !== DOWN) && (py > 0)) 
							{
								index = 0 | ((px | 0) + scratchSize * ((py - 1) | 0));
								if (scratch2[index] === NONE) // not visited
								{
									val2 = scratch[index];
									if ((val2 /* tron.EMPTY */ === 0) || (val2 === /* tron.BULLET*/ -4))
									{
										queue_data[queue_stop++] = px;
										queue_data[queue_stop++] = (py - 1) | 0;
										queue_data[queue_stop++] = (iter + 1) | 0;
										queue_data[queue_stop++] = 0 | (pturn + ((lastcmd === UP) ? 0 : 1));										
										scratch2[index] = UP;
										/*
										if (log_push) console.log("push " + queue_data[queue_stop-4] + "," 
										+ queue_data[queue_stop-3] + " gen = " + queue_data[queue_stop-2] + " turns = " + queue_data[queue_stop-1]);
										
										pushed++;
										*/
										
									}
									else 
									{
										scratch2[index] = -2; // wall
									}
								}
							}
							
							if ((lastcmd !== UP) && (py < scratchSize - 1)) 
							{
								index = 0 | ((px | 0) + scratchSize * ((py + 1) | 0));
								if (scratch2[index] === NONE) // not visited
								{
									val2 = scratch[index];
									if ((val2 /* tron.EMPTY */ === 0) || (val2 === /* tron.BULLET*/ -4))
									{
										queue_data[queue_stop++] = px;
										queue_data[queue_stop++] = (py + 1) | 0;
										queue_data[queue_stop++] = (iter + 1) | 0;
										queue_data[queue_stop++] = 0 | (pturn + ((lastcmd === DOWN) ? 0 : 1));
										scratch2[index] = DOWN;
										/*
										if (log_push) console.log("push " + queue_data[queue_stop-4] + "," 
										+ queue_data[queue_stop-3] + " gen = " + queue_data[queue_stop-2] + " turns = " + queue_data[queue_stop-1]);
										
										pushed++;
										*/
										
									}
									else 
									{
										scratch2[index] = -2; // wall
									}
								}
							}
							
							if (queue_start === queue_stop) 
							{
								//console.log("empty queue breaking");
								break;
							}
							
							/* peek another element */
							px = queue_data[queue_start] | 0;
							py = queue_data[queue_start + 1] | 0;
							pl = queue_data[queue_start + 2] | 0;
							pturn = queue_data[queue_start + 3] | 0;							
							
						}
						/*
						if (log_push) console.log(read + " read, " + pushed + " pushed, queue_start = " + queue_start + ", queue_stop = " + queue_stop);
						
						
						total -= read;
						total += pushed;
						
						var inQueue = (queue_stop - queue_start) / 4;
						if (inQueue !== total)
						{
							console.log("WTF, total is " + total + " but inQueue is " + inQueue);
						}*/
						
					}
					
					/* get trace (DEBUG) */
					/*var scratch2trace = "";
					var scratchtrace = "";
					for (var iter4 = 0; iter4 < scratchSize; ++iter4)
					{
						for (var iter5 = 0; iter5 < scratchSize; ++iter5)
						{
							index = (iter5 | 0) + scratchSize * (iter4 | 0);
							scratch2trace = scratch2trace + " " + (scratch2[index] >= 0 ? " " : "") + scratch2[index];
							scratchtrace = scratchtrace + " " + (scratch[index] >= 0 ? " " : "") + scratch[index];
						}
						scratch2trace = scratch2trace + "\n";
						scratchtrace = scratchtrace + "\n";
					}
					*/
					
					
					// we found a way to survive ssight iterations, else fallback to normal algorithm 
					// since we are probably fucked :)
					
					/* console.log("queue has " + (queue_stop - queue_start ) / 4 + " solutions"); */
					
					if (queue_start !== queue_stop) 
					{	
						// find min number of turns
						var iter2;
						minturns = 1000;
						var turns = 0;
						for (iter2 = queue_start; iter2 < queue_stop; iter2 += 4) 
						{
						
							turns = queue_data[iter2 + 3];
		/*					if ((turns > 1000) || (turns < 0)) 
							{
								alert("W.T.F");	
							}
		*/					if (turns < minturns) 
							{
								minturns = turns;
								px = queue_data[iter2];
								py = queue_data[iter2 + 1];
								pl = queue_data[iter2 + 2];
		/*						if (pl !== ssight) 
								{
									alert("WTF man! pl is not " + ssight + " but " + pl);									
								}
		*/						if (turns < 2) 
								{
									break;
								}
							}
						}
						
						
						
						var cmd = scratch2[(px | 0) + scratchSize * (py | 0)];
		//				var backtrace = "(" + px + "," + py + ")";
						var errored = false;
						for (iter2 = 0; iter2 < pl; ++iter2) 
						{
						
							//world.set( (bx + px - ssight) | 0, (by + py - ssight) | 0, -2);
							switch (cmd)
							{
								case RIGHT:
									scratch[iter2] = RIGHT;
			//						backtrace += " => RIGHT => ";
									px--;
									break;
								case LEFT:
									scratch[iter2] = LEFT;
			//						backtrace += " => LEFT => ";
									px++;
									break;
								case UP:
									scratch[iter2] = UP;
			//						backtrace += " => UP => ";
									py++;
									break;
								case DOWN:
									scratch[iter2] = DOWN;
			//						backtrace += " => DOWN => ";
									py--;
									break;
								default:
								// TODO FIX IT !
									if (!errored)
									{
										errored = true;
			//							backtrace += " => ???";
									}
									// log the entire scratech 2 
							}
							if (!errored)
							{
								cmd = scratch2[px + scratchSize * py];
		//						backtrace += "(" + px + "," + py + ")";
							}							
						}
		/*				if (errored)
						{
							console.log("backtrace: " + backtrace);
							alert(backtrace);
							alert(scratchtrace);
							alert(scratch2trace);
						}
		*/				if ((px === ssight) && (py === ssight)) 
						{
							// push the escape sequence	(not all of it)		
							//var prescience = 5 + turns;
							//var indexmax = Math.max(pl - 1 - prescience, 0);
							var indexmax = 0;
							for (var iter3 = pl - 1; iter3 >= indexmax; --iter3) //pl - 1 - 10; --iter3) 
 							{
								this.pushCommand(scratch[iter3]);
							}
							return;
						}
						/*else 
						{
						 	//  TODO FIX IT ! (rare)
						 	console.log("px = " + px  + "   py = " + py);
							// console.log("backtrace: " + backtrace);
						}
						*/
					}
				//	else 
				//	{
						// TODO make something smarter
						//					console.log("no path found :(");
					//	if (Math.random() < 0.5) // shoot
					//	{
					//		this.pushCommand(/* tron.COMMAND_SHOOT */ 6);
					//	}
				//	}
				}
				
				// good enough approximation but leads to inelegant self-death
				if (Math.random() < prob[i]) 
				{ // decide to turn
					var free = i - 1;
					var j;
					// search left
					var lfree = sightSide;
					for (j = 1; j < sightSide; ++j) 
					{
						if (0 !== world.get(bx + my * j, by - mx * j)) 
						{
							lfree = j - 1;
							break;
						}
					}
					
					// search right
					var rfree = sightSide;
					for (j = 1; j < sightSide; ++j) 
					{
						if (0 !== world.get(bx - my * j, by + mx * j)) 
						{
							rfree = j - 1;
							break;
						}
					}
					var max = Math.max(lfree, rfree);
					if (free <= max) 
					{
						if (lfree > rfree) 
						{
							this.pushCommand(/* tron.COMMAND_TURN_LEFT */ 4);
							this._lastTurn = false;
						}
						else 
							if (lfree < rfree) 
							{
								this.pushCommand(/* tron.COMMAND_TURN_RIGHT */ 5);
								this._lastTurn = true;
							}
							else 
							{
								if (this._lastTurn)
								{
									this.pushCommand(/* tron.COMMAND_TURN_LEFT */ 4);
									this._lastTurn = false;
								}
								else
								{
									this.pushCommand(/* tron.COMMAND_TURN_RIGHT */5);
									this._lastTurn = true;
								}								
							}
					}
				}
				
				return;
			}
		}
		
		// why not turning ?
		if (Math.random() < this._likeToTurn) 
		{
			var lfree2 = (0 === world.get(bx + my, by - mx));
			var rfree2 = (0 === world.get(bx - my, by + mx));
			if (lfree2 || rfree2) 
			{
				if (!lfree2) 
				{
					this.pushCommand(/* tron.COMMAND_TURN_RIGHT */ 5);
				}
				else 
					if (!rfree2) 
					{
						this.pushCommand(/* tron.COMMAND_TURN_LEFT */ 4);
					}
					else 
					{
						this.pushCommand((Math.random() < 0.5) ? /* tron.COMMAND_TURN_LEFT */ 4 : /* tron.COMMAND_TURN_RIGHT */ 5);
					}
			}
		}
		else 
			if (Math.random() < this._likeShooting) // why not shoot ?
			{
				this.pushCommand(/* tron.COMMAND_SHOOT */ 6);
			}
	},
	
	// one game tick
	update: function(turboCycle)
	{
		if (this._state !== /* tron.STATE_ALIVE */ 1) 
		{
			return;
		}
		if (turboCycle && !(this._turbo)) return;
		
		this._waitforshoot = Math.max(this._waitforshoot - 1, 0);
		
		if (this._commandIndex > 0.5) 
		{
			if (turboCycle)
			{
				this._commandIndex = 0; // erase all commands
			}	
			else
			{
				var cmd = this.popCommand();
				this.executeCommand(cmd);
			}
		}
		var world = this._world;
		var widthMask = world._widthMask;
		var heightMask = world._heightMask;
		
		var newx = (this._posx + this._movx) & widthMask;
		var newy = (this._posy + this._movy) & heightMask;
		var warning = this._warning;
		var incoming = world.get(newx, newy);
		
		if ((warning < 2) 
		   && (incoming !== 0) 
		   && (incoming !== /* tron.WORLD_FIREY */ -1) // explosions do not block
		   && (incoming !== /* tron.WORLD_FIRER */ -2) // explosions do not block
		   && (this._invincibility === 0))
		{
			warning++;	
			this._turbo = false;
		}		
		else
		{
			this._posx = newx;			
			this._posy = newy;
			warning = 0;
		}
		this._warning = warning;
		
		//this._lifetime++;
	},
	
	take: function(w)
	{
		if (this._invincibility > 0) 
		{
			return;
		}
		var world = this._world;
		switch (w)
		{
			case /* tron.WORLD_POWERUP_YELLOW */ -16: 
				
				this._invincibility = /* tron.INVINCIBILITY_DURATION */ 52;	
				this._game._audioManager.playSampleLocation(/* tron.SAMPLE_INVINCIBLE */ 5, 1.0, this._posx, this._posy);			
				break;
				
			case /* tron.WORLD_POWERUP_GREEN  */ -17: 
				
				// get triple shoot definetively
				this._game._audioManager.playSampleLocation(/* tron.SAMPLE_WEAPON_UPGRADE */ 4, 1.0, this._posx, this._posy);
				this._tripleShoot++; 
				break;			                                          
			case /* tron.WORLD_POWERUP_PINK */ -18: 
				
		        // teleport somewhere		        
		        var randInt = tron.randInt;
		        var wx = world._width;
		        var wy = world._height;
		        var pdir = this._dir;
		        
		        for (var i = 0; i < 100; ++i)
		        {
		        	var posx = randInt(0, wx);
		            var posy = randInt(0, wy);
		            //var pdir = this._dir; randInt(/* tron.DIR_UP */ 0, /* tron.DIR_RIGHT */ 3);
		            if (world.isSafePos(posx, posy, pdir))
		            {
			            world.set(this._posx, this._posy, this._team); // eat powerup
			            this._posx = posx;
			            this._posy = posy;			            
			            //this._movx = tron.directionX(pdir);
			            //this._movy = tron.directionY(pdir);
			            //this._turbo = false;
			            //this._dir = pdir;
			            break;
		            }		                
				} 
				this._game._audioManager.playSample(/* tron.SAMPLE_TELEPORT */ 3, 1.0);
				break;
		
			case /* tron.WORLD_TRIANGLE_SW */ -20:
				if (this._dir === /* tron.DIR_LEFT */ 2)
				{
					this.pushCommand(/* tron.COMMAND_UP */ 0);
					this.pushCommand(/* tron.COMMAND_LEFT */ 2);
					
				} 
				else if (this._dir === /* tron.DIR_DOWN */ 1)
				{
					this.pushCommand(/* tron.COMMAND_RIGHT */ 3);
					this.pushCommand(/* tron.COMMAND_DOWN */ 1);
				} else this.die();
				break;
			
			case /* tron.WORLD_TRIANGLE_NW */ -21:	
				if (this._dir === /* tron.DIR_LEFT */ 2)
				{
					this.pushCommand(/* tron.COMMAND_DOWN */ 1);
					this.pushCommand(/* tron.COMMAND_LEFT */ 2);
				} 
				else if (this._dir === /* tron.DIR_UP */ 0)
				{
					this.pushCommand(/* tron.COMMAND_RIGHT */ 3);
					this.pushCommand(/* tron.COMMAND_UP */ 0);
				} else this.die();
				break;  
				
			
			case /* tron.WORLD_TRIANGLE_NE */ -22:
				if (this._dir === /* tron.DIR_RIGHT */ 3)
				{
					this.pushCommand(/* tron.COMMAND_DOWN */ 1);
					this.pushCommand(/* tron.COMMAND_RIGHT */ 3);
				} 
				else if (this._dir === /* tron.DIR_UP */ 0)
				{
					this.pushCommand(/* tron.COMMAND_LEFT */ 2);
					this.pushCommand(/* tron.COMMAND_UP */ 0);
				} else this.die();
				break;  
			
			case /* tron.WORLD_TRIANGLE_SE */ -23:	
				if (this._dir === /* tron.DIR_RIGHT */ 3)
				{
					this.pushCommand(/* tron.COMMAND_UP */ 0);
					this.pushCommand(/* tron.COMMAND_RIGHT */ 3);
				} 
				else if (this._dir === /* tron.DIR_DOWN */ 1)
				{
					this.pushCommand(/* tron.COMMAND_LEFT */ 2);
					this.pushCommand(/* tron.COMMAND_DOWN */ 1);
				} else this.die();
				break;  			
				
			case /* tron.WORLD_POWERUP_ORANGE */ -19: break;
			default: 
				this.die();
		}
	},
	
	/* check one */
	checkDeath: function(turboCycle)
	{
		if (this._state !== /* tron.STATE_ALIVE */ 1) 
		{
			return;
		}		
		if (turboCycle && !(this._turbo)) return;
		if (this._warning > 0) return;
		
		var t = this._world.get(this._posx, this._posy);
		
		if (t !== 0) 
		{
			this.take(t);
		}
	},
	
	/* check two */
	checkDeath2: function(turboCycle)
	{
		if (this._state !== /* tron.STATE_ALIVE */ 1) 
		{
			return;
		}		
		if (turboCycle && !(this._turbo)) return;		
		if (this._warning > 0) return;
		var t = this._world.get(this._posx, this._posy);
		
		if (t !== this._team) 
		{
			this.die();//this.take(t);
		}
	},
	
	die: function()
	{
		if (this._invincibility > 0) return;
		
		if (/* tron.PLAYERS_DO_EXPLODE */ 1) 
		{
			this._state = /* tron.STATE_EXPLODING1 */ 2;
			// die sound
			this._game._audioManager.playSampleLocation(/* tron.SAMPLE_DIE */ 2, 1.0, this._posx, this._posy);
		}
		else 
		{
			this._state = /* tron.STATE_DEAD */ 6;
		}
	},
	
	draw: function(turboCycle)
	{
		if (turboCycle && !(this._turbo)) return;
		var i, j, invincibility, debris;
		var x = this._posx;
		var y = this._posy;
		var w = this._game._world;
		
		switch (this._state)
		{
			case /* tron.STATE_ALIVE */ 1:				
				invincibility = this._invincibility;
				if ((invincibility > 0) && (invincibility < /* tron.INVINCIBILITY_DURATION */ 52))
				{
					return;
				}
				w.set(x, y, this._team);
				break;
				
			case /* tron.STATE_EXPLODING1 */ 2:
				for (j = -2; j <= 2; j++) 
				{
					for (i = -2; i <= 2; i++) 
					{
						w.setSecure(x + i, y + j, /* tron.WORLD_FIREY */ -1);
					}
				}
				this._state = /* tron.STATE_EXPLODING2 */ 3;
				break;
				
			case /* tron.STATE_EXPLODING2 */ 3:
				for (j = -2; j <= 2; j++) 
				{
					for (i = -2; i <= 2; i++) 
					{
						w.setSecure(x + i, y + j, /* tron.WORLD_FIRER */ -2);
					}
				}
				this._state = /* tron.STATE_EXPLODING3 */ 4;
				break;
				
			case /* tron.STATE_EXPLODING3 */ 4:
			case /* tron.STATE_EXPLODING4 */ 5:
			
				
				for (j = -2; j <= 2; j++) 
				{
					for (i = -2; i <= 2; i++) 
					{
						w.setSecure(x + i, y + j, /* tron.WORLD_EMPTY */ 0);
					}
				}
				
				switch((this._team - 1) & 7)
				{
					case 0: debris = /* tron.WORLD_WALL_WHITE  */ -9; break;
					case 1: debris = /* tron.WORLD_WALL_RED    */ -11; break;
					case 2: debris = /* tron.WORLD_WALL_VIOLET */ -13; break;
					case 3: debris = /* tron.WORLD_WALL_PINK   */ -12; break;
					case 4: debris = /* tron.WORLD_WALL_GREEN  */ -6; break;
					case 5: debris = /* tron.WORLD_WALL_YELLOW */ -8; break;
					case 6: debris = /* tron.WORLD_WALL_CYAN   */ -15; break;
					case 7: default: debris = /* tron.WORLD_WALL_ORANGE */ -7;
				}
				
				for (j = -1; j <= 1; j++) 
				{
					for (i = -1; i <= 1; i++) 
					{	
						w.setSecure(x + i, y + j, debris); 
					}					
				}
				//w.setSecure(x, y, -10);		
				this._state++;// = /* tron.STATE_DEAD */ 6;
				break;
				
			case /* tron.STATE_DEAD */ 6:
				break;
		}
		
		
	},
	
	shootPixels : function()
	{
		return 0 | Math.round(24.0 * this._waitforshoot / /* tron.BULLET_DELAY */ 40.0 );		
	}
};


