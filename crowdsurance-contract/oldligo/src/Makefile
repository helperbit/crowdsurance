all:
	ligo dry-run src/crowdsurance.mligo -s cameligo main "Initialize(\"tz1THsLcunLo8CmDm9f2y1xHuXttXZCpyFnq\": key_hash)" "{ events=([]: event list); total_users=0n; current_phase=Insuring; insured_balance=0tez; remaining_balance=0tez; users=(Big_map.empty: (address, user_data) big_map); cells=(Big_map.empty: (nat, address set) big_map) }"

compile:
	ligo compile-contract src/crowdsurance.mligo -s cameligo main > crowdsurance.tz

decl:
	ligo list-declarations src/crowdsurance.mligo -s cameligo

measure:
	ligo measure-contract src/crowdsurance.mligo -s cameligo main

ast:
	ligo print-ast src/crowdsurance.mligo -s cameligo

install-deps:
	npm install --unsafe-perm @stove-labs/granary@pre-alpha