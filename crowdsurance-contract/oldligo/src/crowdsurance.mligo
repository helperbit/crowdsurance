#include "types.mligo"
#include "assertions.mligo"


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
	([delop]: operation list), { s with 
		owner= Current.sender
	}


let main (p,s: action * contract_storage) =
	let res = 
		match p with
		| Initialize (p) -> initialize s p
		| InsureUser (u) -> insure_user s u
		| TriggerEvent (e) -> trigger_event s e
		| EndInsuringPhase -> end_insuring_phase s
		| EndRunningPhase -> end_running_phase s
	in res