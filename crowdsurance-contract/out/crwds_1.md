# crowsurance
> Genrated with [Archetype](https://archetype-lang.org/) v0.1.14

## Roles

### contract_manager

| Attribute              | Value  |
|----------------|---|---|
| Kind           | constant  |
| Address        | tz15P69BXJYAURaznhvN1k1KmuhR6P52hw6x  |


### event_oracle

| Attribute              | Value  |
|----------------|---|---|
| Kind           | constant  |
| Address        | tz15P69BXJYAURaznhvN1k1KmuhR6P52hw6x  |


### verify_oracle

| Attribute              | Value  |
|----------------|---|---|
| Kind           | constant  |
| Address        | tz15P69BXJYAURaznhvN1k1KmuhR6P52hw6x  |


## Assets

### user

| Field | Desc | Type | Attribute |
|--|--|--|--|
| addr |  | address | __key__
| cell |  | int | 
| bal |  | tez | 
| premium |  | tez | 
| verified |  | bool | 


### wcell

| Field | Desc | Type | Attribute |
|--|--|--|--|
| idx |  | int | __key__
| users |  | user collection | 


### event_cell

| Field | Desc | Type | Attribute |
|--|--|--|--|
| cid |  | int | __key__


### event

| Field | Desc | Type | Attribute |
|--|--|--|--|
| eid |  | string | __key__
| etype |  | event_type | 
| mag |  | rational | 
| cells |  | event_cell partition | 
| affected |  | user collection | 

## Transitions

### start
`called by ` contract_manager

### endInsuring
`called by ` contract_manager

### endInsured
`called by ` contract_manager
## Actions

### insureUser
| Name | Desc | Type |
|--|--|--|
|pos||int|
#### require 
##### i0
`(state = Insuring)`
##### i1
`(transferred >= min_premium)`
##### i2
`(not user.contains (caller))`
#### Postconditions 
##### ip0
`(user.count() = before.user.count() + 1)`

### verifyUser
`called by ` verify_oracle
| Name | Desc | Type |
|--|--|--|
|uaddr||address|
|wc||int|
#### require 
##### v0
`(state = Insuring)`
##### v1
`(user.contains (uaddr))`
##### v2
`((user.get (uaddr)).cell = wc)`
##### v3
`(not wcell.contains (wc) or (wcell.contains (wc) and not ((wcell.get (wc)).users).contains (uaddr)))`
#### Postconditions 
##### vp0
`((user.select ((the.verified = false))).count() = (before.user.select ((the.verified = false))).count() - 1)`
##### vp1
`(wcell.contains (wc))`

### withdraw
#### require 
##### w0
`(state = Expired)`
##### w1
`(user.contains (caller))`
##### w2
`((user.get (caller)).verified)`
##### w3
`((user.get (caller)).bal > 0utz)`
##### w4
`(balance >= (user.get (caller)).bal)`
#### Postconditions 
##### wp0
`((user.select ((the.addr = caller))).sum ((the.bal)) = 0tz)`
##### wp1
`(user.sum ((the.bal)) = before.user.sum ((the.bal)) - (before.user.select ((the.addr = caller))).sum ((the.bal)))`
##### wp2
`(balance = before.balance - (before.user.select ((the.addr = caller))).sum ((the.bal)))`

### triggerEvent
`called by ` event_oracle
| Name | Desc | Type |
|--|--|--|
|ed||string|
|emg||rational|
|et||event_type|
|cl||event_cell partition|
#### require 
##### t0
`(state = Insured)`
##### t1
`(cl.count() > 0)`
##### t2
`(not event.contains (ed))`
##### t3
`(emg > min_mag and emg < max_mag)`
#### Postconditions 
##### tp0
`(event.count() = before.event.count() + 1)`
##### tp1
`(elapsed_balance >= 0tz)`
## Security predicates

##### s0
`no_storage_fail anyaction`


