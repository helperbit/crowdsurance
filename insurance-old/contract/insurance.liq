[%%version 0.9]

type user = {
  address: key_hash;
  amount: tez
};;

type cell = {
  userCount: nat;
  users: user list;
  intensitySum: nat
};;

type eventType = Earthquake | Wildfire | Flood;;

type event = {
  time: timestamp; 
  eventType: eventType;
  intensity: nat;
  involvedUsers: nat;
  affectedCells: nat list
};;

type phase = InsuringPhase | InsuredPeriodPhase | EndPhase;;

type storage = {
  expiration: timestamp;
  oracle: address;
  shortTermPercentage: nat;
  longTermPercentage: nat;
  yearIntensity: nat;

  totalInsuredAmount: tez;
  elapsedInsuredAmount: tez;
  elapsedInsuredAmountShortTerm: tez;
  elapsedInsuredAmountLongTerm: tez;

  totalUsers: nat;
  totalEvents: nat;
  totalIntensity: nat;
  phase: phase;

  events: event list;
  cells: (nat, cell) map
};;

let%init storage oracle yearIntensity shortTermPercentage longTermPercentage expiration = {
  expiration = expiration;
  oracle = oracle;
  shortTermPercentage = shortTermPercentage;
  longTermPercentage = longTermPercentage;
  yearIntensity = yearIntensity;

  totalInsuredAmount = 0tz;
  elapsedInsuredAmount = 0tz;
  elapsedInsuredAmountShortTerm = 0tz;
  elapsedInsuredAmountLongTerm = 0tz;

  totalUsers = 0p;
  totalEvents = 0p;
  totalIntensity = 0p;
  phase = InsuringPhase;

  events = [];
  cells = Map []    
};;

let assert_oracle storage = if Current.sender() <> storage.oracle then failwith "Only oracle allowed";;


let%entry endInsuringPhase () storage = 
  let storage = storage.phase <- InsuredPeriodPhase in
  let storage = storage.elapsedInsuredAmount <- storage.totalInsuredAmount in
  let storage = storage.elapsedInsuredAmountShortTerm <- storage.totalInsuredAmount / storage.shortTermPercentage in
  let storage = storage.elapsedInsuredAmountLong <- storage.totalInsuredAmount / storage.longTermPercentage in
  ([], storage)
;;

let%entry endInsuredPhase () storage = 
  assert_oracle ();
  if Current.timestamp < storage.expiration then failwith "Expiration not reached";

  ([], storage)
;;


let%entry triggerEvent eventParameters storage =
  assert_oracle ();
  ([], storage)
;;


type insureParameters = {
  insuredAddress: address;
  cell: nat;
  oracleSignature: signature
};;

let%entry insure insureParameters storage =
  ([], storage)
;;