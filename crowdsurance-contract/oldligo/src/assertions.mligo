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
	s.owner = Current.sender