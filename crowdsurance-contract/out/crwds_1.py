"""
 Helperbit: a p2p donation platform (crowdsurance)
 Copyright (C) 2016-2021  Davide Gessa (gessadavide@gmail.com)
 
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 
 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <https://www.gnu.org/licenses/>
"""

# Smartpy output generated by archetype 0.1.14

# contract: crowsurance

import smartpy as sp

class Crowsurance(sp.Contract):
  # API function

  rat_cmp
  
  def count_user (self):
    #TODO
  
  def sum_user (self, p):
    reduce(
    (lambda x, key: p(self.data.user_assets[key]) + x),
    self.data.user_keys,
    0)
  
  def set_user (self, key, asset):
    self.data.user_assets[key] = asset
  
  def add_user (self, asset):
    key = asset.addr
    self.data.user_assets[key] = asset
  
  def select_user (self, c, p):
    reduce(
    (lambda x, key:
    item = get_user(self, key)
    if (p item):
    x.insert (key)
    x
    else:
    x
    ),
    self.user_keys,
    [])
  
  def contains_user (self, l, key):
    key in l
  
  
  
  def col_to_keys_user (self):
    self.data.user_assets.keys()
  
  
  def add_wcell (self, asset):
    key = asset.idx
    self.data.wcell_assets[key] = asset
  
  def add_wcell_users (self, asset, b):
    self.data.wcell_assets[asset.idx] = asset
  
  def contains_wcell (self, l, key):
    key in l
  
  def col_to_keys_wcell (self):
    self.data.wcell_assets.keys()
  
  def count_event_cell (self):
    #TODO
  
  def add_event_cell (self, asset):
    key = asset.cid
    self.data.event_cell_assets[key] = asset
  
  def add_event (self, asset):
    key = asset.eid
    self.data.event_assets[key] = asset
  
  def add_event_affected (self, asset, b):
    self.data.event_assets[asset.eid] = asset
  
  def contains_event (self, l, key):
    key in l
  
  def col_to_keys_event (self):
    self.data.event_assets.keys()
  


  def __init__(self):
    self.contract_manager = sp.address("tz15P69BXJYAURaznhvN1k1KmuhR6P52hw6x")
    self.event_oracle = sp.address("tz15P69BXJYAURaznhvN1k1KmuhR6P52hw6x")
    self.verify_oracle = sp.address("tz15P69BXJYAURaznhvN1k1KmuhR6P52hw6x")
    self.min_premium = sp.mutez(1000000)
    self.max_mag = (12, 1)
    self.min_mag = (5, 1)
    self.insuring_duration = 604800
    self.insured_duration = 2419200
    self.state_creation = 0
    self.state_insuring = 1
    self.state_insured = 2
    self.state_expired = 3
    self.event_type_earthquake = 0
    self.event_type_flood = 1
    self.event_type_wildfire = 2
    self.event_type_draught = 3
    self.event_type_hurricane = 4
    self.event_type_eruption = 5
    self.init(insuring_deadline = sp.now,
              expiration = sp.now,
              initial_balance = sp.mutez(0),
              elapsed_balance = sp.mutez(0),
              insured_users = 0,
              state = self.state_creation,
              user_assets = sp.map(tkey=sp.TAddress, tvalue= sp.TRecord(addr = sp.TAddress, cell = sp.TInt, bal = sp.TMutez, premium = sp.TMutez, verified = sp.TBool)),
              wcell_assets = sp.map(tkey=sp.TInt, tvalue= sp.TRecord(idx = sp.TInt, users = sp.TAddress list)),
              event_cell_assets = sp.map(tkey=sp.TInt, tvalue= sp.TRecord(cid = sp.TInt)),
              event_assets = sp.map(tkey=sp.TString, tvalue= sp.TRecord(eid = sp.TString, etype = sp.TInt, mag = sp.TInt * sp.TInt, cells = sp.TInt list, affected = sp.TAddress list)))

  def add_shallow_wcell(self, wcell, wcell_users):
    self.add_wcell (wcell)
    sp.for user in params.wcell_users:
      self.add_user (user)
    
  
  def add_shallow_event(self, event, event_cells, event_affected):
    self.add_event (event)
    sp.for event_cell in params.event_cells:
      self.add_event_cell (event_cell)
    
    sp.for user in params.event_affected:
      self.add_user (user)
    
  
  @sp.entry_point
  def start(self, params):
    sp.if (~((sp.sender) == (self.contract_manager))):
      sp.failwith ("invalid caller")
    sp.if ((self.data.state) == (self.state_creation)):
      self.insuring_deadline = (sp.now) + (self.insuring_duration)
      self.expiration = ((sp.now) + (self.insuring_duration)) + (self.insured_duration)
      self.data.state = self.state_insuring
    sp.else:
      sp.failwith ("invalid state")
  
  @sp.entry_point
  def endInsuring(self, params):
    sp.if (~((sp.sender) == (self.contract_manager))):
      sp.failwith ("invalid caller")
    sp.if ((self.data.state) == (self.state_insuring)):
      sp.if ((sp.now) >= (self.data.insuring_deadline)):
        vrf = self.select_user (self.col_to_keys_user (), fun the -> the.verified)
        self.elapsed_balance = self.sum_user (vrf, fun the -> the.premium)
        self.initial_balance = self.data.elapsed_balance
        self.insured_users = self.count_user (vrf)
        self.data.state = self.state_insured
    sp.else:
      sp.failwith ("invalid state")
  
  @sp.entry_point
  def endInsured(self, params):
    sp.if (~((sp.sender) == (self.contract_manager))):
      sp.failwith ("invalid caller")
    sp.if ((self.data.state) == (self.state_insured)):
      sp.if ((sp.now) >= (self.data.expiration)):
        self.data.state = self.state_expired
    sp.else:
      sp.failwith ("invalid state")
  
  @sp.entry_point
  def insureUser(self, params):
    sp.if (~((self.data.state) == (self.state_insuring))):
      sp.failwith ("require i0 failed")
    sp.if (~((sp.amount) >= (self.min_premium))):
      sp.failwith ("require i1 failed")
    sp.if (~(~(self.contains_user (self.col_to_keys_user (), sp.sender)))):
      sp.failwith ("require i2 failed")
    self.add_user (sp.record ( addr = sp.sender, cell = params.pos, bal = sp.mutez(0), premium = sp.amount, verified = sp.bool(False) ))
  
  @sp.entry_point
  def verifyUser(self, params):
    sp.if (~((sp.sender) == (self.verify_oracle))):
      sp.failwith ("invalid caller")
    sp.if (~((self.data.state) == (self.state_insuring))):
      sp.failwith ("require v0 failed")
    sp.if (~(self.contains_user (self.col_to_keys_user (), params.uaddr))):
      sp.failwith ("require v1 failed")
    sp.if (~((self.data.user_assets[params.uaddr].cell) == (params.wc))):
      sp.failwith ("require v2 failed")
    sp.if (~((~(self.contains_wcell (self.col_to_keys_wcell (), params.wc))) | ((self.contains_wcell (self.col_to_keys_wcell (), params.wc)) & (~(self.contains_user (unshallow_user self.data.wcell_assets[params.wc].users, params.uaddr)))))):
      sp.failwith ("require v3 failed")
    u = self.data.user_assets[params.uaddr]
    k_ = params.uaddr
    user_ = self.data.user_assets[k_]
    user_ = sp.record ( addr = user_.addr, cell = user_.cell, bal = user_.bal, premium = user_.premium, verified = sp.bool(True) )
    self.set_user (k_, user_)
    sp.if (self.contains_wcell (self.col_to_keys_wcell (), u.cell)):
      add_shallow_wcell (self, sp.record ( idx = u.cell, users = [] ), [])
    self.add_wcell_users (self.data.wcell_assets[u.cell], self.data.user_assets[params.uaddr])
  
  @sp.entry_point
  def withdraw(self, params):
    sp.if (~((self.data.state) == (self.state_expired))):
      sp.failwith ("require w0 failed")
    sp.if (~(self.contains_user (self.col_to_keys_user (), sp.sender))):
      sp.failwith ("require w1 failed")
    sp.if (~(self.data.user_assets[sp.sender].verified)):
      sp.failwith ("require w2 failed")
    sp.if (~((self.data.user_assets[sp.sender].bal) > (sp.mutez(0)))):
      sp.failwith ("require w3 failed")
    sp.if (~((sp.balance) >= (self.data.user_assets[sp.sender].bal))):
      sp.failwith ("require w4 failed")
    k_ = sp.sender
    user_ = self.data.user_assets[k_]
    user_ = sp.record ( addr = user_.addr, cell = user_.cell, bal = sp.mutez(0), premium = user_.premium, verified = user_.verified )
    self.set_user (k_, user_)
    sp.send(sp.sender, self.data.user_assets[sp.sender].bal)
  
  @sp.entry_point
  def triggerEvent(self, params):
    sp.if (~((sp.sender) == (self.event_oracle))):
      sp.failwith ("invalid caller")
    sp.if (~((self.data.state) == (self.state_insured))):
      sp.failwith ("require t0 failed")
    sp.if (~((self.count_event_cell (params.cl)) > (0))):
      sp.failwith ("require t1 failed")
    sp.if (~(~(self.contains_event (self.col_to_keys_event (), params.ed)))):
      sp.failwith ("require t2 failed")
    sp.if (~((rat_cmp (gt, params.emg, self.min_mag)) & (rat_cmp (lt, params.emg, self.max_mag)))):
      sp.failwith ("require t3 failed")
    ev = sp.record ( eid = params.ed, etype = params.et, mag = params.emg, cells = params.cl, affected = [] )
    ev_1 = []
    sp.for c in params.cl:
      c = Mgetfrommap_event_cell (c, params.cl_values)
      sp.for ac in unshallow_user self.data.wcell_assets[c.cid].users:
        ac = self.data.user_assets[ac]
        self.add_event_affected (ev, ac)
      
    
    sp.for iu in unshallow_user ev.affected:
      iu = self.data.user_assets[iu]
      nbal = (iu.bal) + (iu.premium)
      user_ = iu
      user_ = sp.record ( addr = user_.addr, cell = user_.cell, bal = nbal, premium = user_.premium, verified = user_.verified )
      self.set_user (iu.addr, user_)
      self.elapsed_balance -= nbal
    
    add_shallow_event (self, ev, ev_1)
  
# We evaluate a contract with parameters.
contract = Crowsurance()

# We need to compile the contract.
# It can be done with the following command.
import smartpybasic as spb
spb.compileContract(contract, targetBaseFilename = "/tmp/crowsurance")

print("Contract compiled in /tmp/crowsuranceCode.tz")
