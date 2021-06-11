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

import os
import subprocess

def dry_run(action, storage):
    out = subprocess.Popen(['ligo', 'dry-run', '../src/crowdsurance.mligo', '-s', 'cameligo', 'main', action, storage], 
            stdout=subprocess.PIPE, 
            stderr=subprocess.STDOUT)
    stdout, stderr = out.communicate()
    return stdout.decode("utf-8").replace(')\n\n', '').split(' ] , ')[1]


class ContractExecutor:
    storage = ''

    def __init__ (self, initial_storage):
        self.storage = initial_storage

    def initialize(self, pkey_hash):
        act = 'Initialize(\"' + pkey_hash + '\": key_hash)'
        st = dry_run(act, self.storage)
        print('Storage ->', st)
        self.storage = st

    def insureUser(self, udata):
        pass

