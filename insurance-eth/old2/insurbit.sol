/**
 * Insurance contract for helperbit 
 *
 * The world is divided in cells of custom size; users are registered in cells by helperbit.
 *
 * Helperbit puo' aggiungere utenti assicurati con una tx insure solo se l'insuring period e' attivo. Li
 * aggiunge helperbit perche' (A) Toglie la fee, (B) helperbit assicura la posizione dell'utente nel mondo.
 *
 * Helperbit puo' fermare il period di insuring e far partire il contratto con una call endInsuringPeriod.
 *
 * Short term:
 * Appena accade un evento (o dopo qualche giorno), helperbit invia una tx raiseEvent passando intensita' dell'
 * evento e celle interessate. Ad ogni utente delle celle interessate verra' inviato un ammontare che dipende
 * dal bucket totale, dal short term distribution, e dalla redistribution formula.
 *
 * Long term:
 * Allo scadere del periodo, helperbit invia una tx raiseLongTermReward; verra' distribuito tra gli utenti
 * coinvolti in eventi durante l'anno, un ammontare definito dalla longterm distribution formula.
 */
pragma solidity ^0.4.0;

contract InsurBit {
	/*********************************************************************/
	/*************** Types */
	/* User structure */
	struct User {
		address addr;
		uint amount;
	}

	/* World cell structure */
	struct Cell {
		uint32 usercount;
		mapping (uint32 => User) users;		// Users in the cell
		uint32 intensity;					// Gained intensity by event in the cell during the period
	}

	/* Event structure */
	enum EventType { Earthquake }

	struct Event {
		EventType eventType;
		uint32 intensity;
		uint32[] cells;
		uint distributed;
		uint32 users;
	}

	/*********************************************************************/
	/*************** Events */
	/* Fired on the end of the insuring period */
	event InsuringPeriodEnd (uint totalInsuredAmount, uint32 totalUsers);

	/* Fired on new event */
	event RaisedEvent (EventType eventType, uint32 intensity, uint32[] cells, uint distributed, uint32 affected);

	/* Raised on term distribution */
	event LongTermDistribution (uint distributed, uint affected);


	/*********************************************************************/
	/*************** State variables */
	/* Total insured amount (short term and long term) */
	uint public totalInsuredAmount;
	uint public totalInsuredAmountShortTerm;
	uint public totalInsuredAmountLongTerm;

	/* Total users insured in this bucket */
	uint32 public totalUsers;

	/* Mapping from cell number to user */
	mapping (uint32 => Cell) public world;

	/* Events in the current year */
	uint32 public totalEvents;
	mapping (uint32 => Event) public events;

	/* Intensity sum */
	uint32 public intensitySum;

	/* Insuring period status */
	bool public insuringPeriodActive;
	

	/*********************************************************************/
	/*************** Contract parameters */
	/* Contract parameters: contract owner */
	address public HELPERBIT_ADDRESS;

	/* Contract parameters: excepted annual intensity */
	uint public YEAR_INTENSITY;

	/* Contract parameters: short and long term distribution */
	uint public SPLIT_SHORT_TERM;
	uint public SPLIT_LONG_TERM;



	/*********************************************************************/
	/*************** Modifiers */
	/* Callable only by helperbit */
	modifier onlyHB () {
        if (msg.sender != HELPERBIT_ADDRESS)
            throw;
        _;
    }

	/* Callable only if the insuring period is active */
	modifier insuringPeriod () {
        if (!insuringPeriodActive)
            throw;
        _;
    }


	/*********************************************************************/
	/*************** Methods */	
	/** Constructor */
	function InsurBit () {
		HELPERBIT_ADDRESS = msg.sender;
		YEAR_INTENSITY = 43013;
		SPLIT_SHORT_TERM = 100;
		SPLIT_LONG_TERM = 0;

		totalUsers = 0;
		totalInsuredAmount = 0;
		totalInsuredAmountShortTerm = 0;
		totalInsuredAmountLongTerm = 0;

		intensitySum = 0;

		totalEvents = 0;

		insuringPeriodActive = true;
	}
	

	/** 
	 * Called by helperbit for insuring a new user 
	 *
	 * This method places a new insured user in a world cell.
	 *
	 * Only helperbit is enabled to insert a new insurer, so the fee is deducted before the contract call,
	 * and the cell is the verified cell from helperbit.
	 */
	/// Insure a new user 
	function insure (uint32 cell, address user) onlyHB() insuringPeriod() {
		totalInsuredAmount += msg.value;
		totalInsuredAmountShortTerm += msg.value / SPLIT_SHORT_TERM * 100;
		totalInsuredAmountLongTerm += msg.value / SPLIT_LONG_TERM * 100;
		totalUsers += 1;


		/* Initialize empty cell */
		if (world[cell].usercount == 0) {
			world[cell] = Cell ({ usercount: 0, intensity: 0 });
		}

		/* Insert the new insured user */
		world[cell].users[world[cell].usercount] = User ({ addr: user, amount: msg.value });
		world[cell].usercount += 1;
	}

	/**
	 * Called at the end of the insuring period
	 */
	 function endInsuringPeriod () onlyHB() {
		 insuringPeriodActive = false;
		 InsuringPeriodEnd (totalInsuredAmount, totalUsers);
	 }


	/** 
	 * Called by helperbit when an event occurs 
	 *
	 * The interested cells are pushed to the affected list; every
	 * user in the interested cells is rewarded with the short term calculated amount.
	 */
	/// Raise a new event
	function raiseEvent (EventType eventType, uint32[] cells, uint16 intensity) onlyHB() {		
		/* Sum the total amount of insured users in the affected cells */
		uint total = 0;

		uint i;
		uint32 j;
		uint32 celln;
		uint32 affected;

		for (i = 0; i < cells.length; i++) {
			celln = cells[i];

			for (j = 0; j < world[celln].usercount; j++) {
				total += world[celln].users[j].amount;
				affected += 1;
			}
		}

		/* Evalute the value depending on intensity, excepted year intensity, bucketsize */
		uint toDistribute = intensity / YEAR_INTENSITY * totalInsuredAmountShortTerm; 

		/* Send the immediate reward */
		for (i = 0; i < cells.length; i++) {
			celln = cells[i];

			for (j = 0; j < world[celln].usercount; j++) {
				/* Evalute the amount for this user */
				uint amount = toDistribute / world[celln].users[j].amount;

				if (!world[celln].users[j].addr.send (amount))
					throw;
			}

			/* Update the affected cell */
			world[celln].intensity += intensity;
		}

		intensitySum += intensity;

		events[totalEvents] = Event ({eventType: eventType, intensity: intensity, cells: cells, distributed: toDistribute, users: affected});
		totalEvents += 1;

		RaisedEvent (eventType, intensity, cells, toDistribute, affected);
	}



	/** Called by helperbit after the insurance period */
	/// Long term reward
	function raiseLongTermReward () onlyHB() {
		LongTermDistribution (0, 0);
	}
}
