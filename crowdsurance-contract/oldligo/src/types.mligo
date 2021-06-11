type phase =
| Insuring
| Running
| End

type eventtype =
| Earthquake

type user_data = {
	address: address;
	balance: tez;
	months: nat;
	cell: nat;
}

type event = { 
	etype: eventtype;
	time: timestamp;
	cells: nat set;
	intensity: (nat, nat) map;
}

type contract_storage = {
	total_users: nat;
	current_phase: phase;
	running_balance: tez;
	remaining_balance: tez;
	cells: (nat, address set) map;
	users: (address, user_data) map;
	events: event list;
	owner: address;
}