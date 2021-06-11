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

from tools import ContractExecutor

INITIAL_STORAGE = "{ events=([]: event list); total_users=0n; current_phase=Insuring; insured_balance=0tez; remaining_balance=0tez; users=(Big_map.empty: (address, user_data) big_map); cells=(Big_map.empty: (nat, address set) big_map) }"

ce = ContractExecutor(INITIAL_STORAGE)
ce.initialize('tz1THsLcunLo8CmDm9f2y1xHuXttXZCpyFnq')
ce.insureUser({})
ce.insureUser({})