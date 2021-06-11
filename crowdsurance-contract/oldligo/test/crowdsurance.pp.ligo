# 1 "../src/crowdsurance.mligo"
# 1 "<built-in>"
# 1 "<command-line>"
# 31 "<command-line>"
# 1 "/usr/include/stdc-predef.h" 1 3 4

# 17 "/usr/include/stdc-predef.h" 3 4











































# 32 "<command-line>" 2
# 1 "../src/crowdsurance.mligo"

# 1 "../src/types.mligo" 1
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
}
# 2 "../src/crowdsurance.mligo" 2

# 1 "../src/assertions.mligo" 1
let assert_insuring_phase (s: contract_storage): bool = match s.current_phase with
	| Insuring -> true
	| Running -> false
	| End -> false

let assert_running_phase (s: contract_storage): bool = match s.current_phase with
	| Insuring -> false
	| Running -> true
	| End -> false

let assert_user_not_present (s, a: contract_storage * address): bool = 
	match Map.find_opt (a: address) s.users with
	| Some (u) -> true
	| None -> false

let assert_owner (s: contract_storage): bool =
	true
# 3 "../src/crowdsurance.mligo" 2


let short_term_percentage: nat = 30n
let long_term_percentage: nat = 70n


type action = 
| Initialize of key_hash
| InsureUser of user_data
| TriggerEvent of event
| EndInsuringPhase
| EndRunningPhase


let end_insuring_phase (s: contract_storage) =
	let a0: unit = assert (assert_owner s) in
	let a1: unit = assert (assert_insuring_phase s) in
	([]: operation list), { s with current_phase= Running }


let end_running_phase (s: contract_storage) =
	let a0: unit = assert (assert_owner s) in
	let a1: unit = assert (assert_running_phase s) in

	(* trigger long term payments *)
	
	([]: operation list), { s with current_phase= End }


let trigger_event (s: contract_storage) (e: event) =
	let a0: unit = assert (assert_owner s) in
	let a1: unit = assert (assert_running_phase s) in

	(* trigger short term payments *)

	([]: operation list), { s with 
		events= e :: s.events;
	}


let insure_user (s: contract_storage) (u: user_data) = 
	let a0: unit = assert (assert_owner s) in
	let a1: unit = assert (assert_insuring_phase s) in
	let a2: unit = assert (assert_user_not_present (s, u.address)) in

	(* s.cells.push(u.address) *)
	let cells_updated: (nat, address set) map = match (Map.find_opt (u.cell: nat) s.cells) with
	| None -> 
		Map.update 
			(u.cell: nat) 
			(Some (Set.add u.address (Set.empty: address set))) 
			s.cells
	| Some (c) -> 
		Map.update 
			(u.cell: nat) 
			(Some (Set.add u.address c)) 
			s.cells
	in
	
	(* s.users.push(u) *)
	let users_updated: (address, user_data) map = Map.update (u.address: address) (Some (u)) s.users in 

	(* return *)
	([] : operation list), { s with
		total_users= s.total_users + 1n;
		running_balance= s.running_balance + u.balance;
		remaining_balance= s.remaining_balance + u.balance;
		cells= cells_updated;
		users= users_updated;
	}
	

let initialize (s: contract_storage) (p: key_hash) =
	let a0: unit = assert (assert_owner s) in
	let delop: operation = Operation.set_delegate (Some p) in 
	([delop]: operation list), s


let main (p,s: action * contract_storage) =
	let res = 
		match p with
		| Initialize (p) -> initialize s p
		| InsureUser (u) -> insure_user s u
		| TriggerEvent (e) -> trigger_event s e
		| EndInsuringPhase -> end_insuring_phase s
		| EndRunningPhase -> end_running_phase s
	in res
