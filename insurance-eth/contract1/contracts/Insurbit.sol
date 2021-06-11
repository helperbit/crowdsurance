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

contract Insurbit {
    /*********************************************************************/
    /*************** Types */
    /* Contract status */ 
    enum Status { InsuringPhase, InsuredPeriodPhase, EndPhase }

    /* User structure */
    struct User {
        address addr;
        uint amount;
    }

    /* World cell structure */
    struct Cell {
        uint usercount;							// Total number of users in the cell
        mapping (uint => User) users;			// Users in the cell
        uint intensity;							// Gained intensity by event in the cell during the period
    }

    /* World cell indexing */
    struct CellIndex {
        uint cell;
        uint i;
    }

    /* Event structure */
    enum EventType { Earthquake }

    struct Event {
        uint timestamp;
        EventType eventType;
        uint intensity;
        uint distributed;
        uint users;
        uint[] cells;
    }

    /*********************************************************************/
    /*************** Events */
    /* Fired on the end of the insuring period */
    event InsuringPeriodEnd (uint totalInsuredAmount, uint totalUsers);

    /* Fired on new event */
    event RaisedEvent (EventType eventType, uint intensity, uint[] cells, uint distributed, uint affected);

    /* Raised on term distribution */
    event LongTermDistribution (uint distributed, uint affected);


    /*********************************************************************/
    /*************** State variables */
    /* Total insured amount (short term and long term) */
    uint public totalInsuredAmount;
    uint public totalInsuredAmountShortTerm;
    uint public totalInsuredAmountLongTerm;
    uint public elapsedInsuredAmount;
    uint public elapsedInsuredAmountShortTerm;
    uint public elapsedInsuredAmountLongTerm;

    /* Total users insured in this bucket */
    uint public totalUsers;

    /* Mapping from cell number to user */
    mapping (uint => Cell) world;
    mapping (address => CellIndex) addresses;	

    /* Events in the current year */
    uint public totalEvents;
    mapping (uint => Event) public events;

    /* Intensity sum */
    uint public intensitySum;

    /* Insuring period status */
    Status public contractStatus;
    

    /*********************************************************************/
    /*************** Contract parameters */
    /* Contract parameters: contract owner */
    address public owner;

    /* Contract parameters: excepted annual intensity */
    uint YEAR_INTENSITY;

    /* Contract parameters: short and long term distribution */
    uint SPLIT_SHORT_TERM;
    uint SPLIT_LONG_TERM;



    /*********************************************************************/
    /*************** Modifiers */
    /* Callable only by helperbit */
    modifier onlyOwner () {
        require(msg.sender == owner);
        _;
    }

    /* Callable only if the insuring period is active */
    modifier insuringPeriod () {
        require(contractStatus == Status.InsuringPhase);
        _;
    }

    /* Callable only if the insuring period is not active */
    modifier insuredPeriod () {
        require (contractStatus == Status.InsuredPeriodPhase);
        _;
    }


    /*********************************************************************/
    /*************** Methods */	
    /** Constructor */
    constructor () public {
        owner = msg.sender;
        YEAR_INTENSITY = 43013;
        SPLIT_SHORT_TERM = 60;
        SPLIT_LONG_TERM = 40;

        totalUsers = 0;
        totalInsuredAmount = 0;
        totalInsuredAmountShortTerm = 0;
        totalInsuredAmountLongTerm = 0;

        elapsedInsuredAmount = 0;
        elapsedInsuredAmountShortTerm = 0;
        elapsedInsuredAmountLongTerm = 0;

        intensitySum = 0;

        totalEvents = 0;

        contractStatus = Status.InsuringPhase;
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
    function insure (uint cell, address user) onlyOwner() insuringPeriod() public payable returns (uint) {
        require (msg.value != 0 && cell != 0);

        totalInsuredAmount += msg.value;
        totalInsuredAmountShortTerm += msg.value * SPLIT_SHORT_TERM / 100;
        totalInsuredAmountLongTerm += msg.value * SPLIT_LONG_TERM / 100;

        totalUsers += 1;

        /* Check if the user is already insured */
        require (addresses [user].cell == 0);

        /* Initialize empty cell */
        if (world[cell].usercount == 0) {
            world[cell] = Cell ({ usercount: 0, intensity: 0 });
        }

        /* Insert the new insured user */
        addresses [user] = CellIndex ({ cell: cell, i: world[cell].usercount });
        world[cell].users[world[cell].usercount] = User ({ addr: user, amount: msg.value });
        world[cell].usercount += 1;

        return totalUsers;
    }

    /**
     * Called at the end of the insuring period
     */
    function endInsuringPeriod () onlyOwner() insuringPeriod() public returns (uint) {
        contractStatus = Status.InsuredPeriodPhase;

        elapsedInsuredAmount = totalInsuredAmount;
        elapsedInsuredAmountShortTerm = totalInsuredAmountShortTerm;
        elapsedInsuredAmountLongTerm = totalInsuredAmountLongTerm;
        
        emit InsuringPeriodEnd (totalInsuredAmount, totalUsers);

        return elapsedInsuredAmount;
    }


    /** 
     * Called by helperbit when an event occurs 
     *
     * The interested cells are pushed to the affected list; every
     * user in the interested cells is rewarded with the short term calculated amount.
     */
    /// Raise a new event
    function raiseEvent (EventType eventType, uint[] cells, uint16 intensity) onlyOwner() insuredPeriod() public returns (uint) {		
        /* Sum the total amount of insured users in the affected cells */
        uint total = 0;

        uint i;
        uint j;
        uint celln;
        uint affected;

        for (i = 0; i < cells.length; i++) {
            celln = cells[i];

            for (j = 0; j < world[celln].usercount; j++) {
                total += world[celln].users[j].amount;
                affected += 1;
            }
        }

        /* Evalute the value depending on intensity, excepted year intensity, bucketsize */
        uint toDistribute = intensity / YEAR_INTENSITY * elapsedInsuredAmountShortTerm; 

        /* Send the immediate reward */
        for (i = 0; i < cells.length; i++) {
            celln = cells[i];

            for (j = 0; j < world[celln].usercount; j++) {
                /* Evalute the amount for this user */
                uint amount = toDistribute / total * world[celln].users[j].amount;

                if (!world[celln].users[j].addr.send (amount))
                    revert();
            }

            /* Update the affected cell */
            world[celln].intensity += intensity;
        }

        elapsedInsuredAmountShortTerm = elapsedInsuredAmountShortTerm - toDistribute;
        elapsedInsuredAmount = elapsedInsuredAmount - toDistribute;
        intensitySum += intensity;

        events[totalEvents] = Event ({timestamp: block.timestamp, eventType: eventType, intensity: intensity, cells: cells, distributed: toDistribute, users: affected});
        totalEvents += 1;

        emit RaisedEvent (eventType, intensity, cells, toDistribute, affected);

        return affected;
    }



    /** Called by helperbit after the insurance period */
    /// Long term reward
    function endInsuredPeriod () onlyOwner() public {
        contractStatus = Status.EndPhase;
        emit LongTermDistribution (0, 0);
    }
}
