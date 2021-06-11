/* 
 *  Helperbit: a p2p donation platform (crowdsurance)
 *  Copyright (C) 2016-2021  Davide Gessa (gessadavide@gmail.com)
 *  
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';
import { timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface ConnectionStatus {
  online: boolean;
  node: string;
  level: number;
  hash: string;
}

@Injectable({
  providedIn: 'root'
})
export class TezosService {
  public connectionStatus: EventEmitter<ConnectionStatus>;

  constructor(private http: HttpClient) {
    this.connectionStatus = new EventEmitter();
    this.connectionStatus.emit({ online: false, node: environment.node, level: 0, hash: '' });

    timer(0, 10000).subscribe(() => this.updateNodeStatus());
    this.updateNodeStatus();
  }

  updateNodeStatus() {
    this.http.get(environment.node + '/chains/main/blocks/head').subscribe((data: any) => {
      this.connectionStatus.emit({ online: true, node: environment.node, level: data.header.level, hash: data.hash });
    }, () => {
      this.connectionStatus.emit({ online: false, node: environment.node, level: 0, hash: '' });
    });
  }
}
