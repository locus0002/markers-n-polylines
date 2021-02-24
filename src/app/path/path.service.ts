/**
 * @autor: Vladimir Aca
 */

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import * as Constants from '../shared/constants';
import { Position } from '../shared/interfaces/position.interface';
import { PositionC } from '../shared/models/position.model';

@Injectable({ providedIn:'root' })
export class PathService {
  currentExternalId: number = null;
  currentPositions: Array<PositionC> = [];
  updatedPositions = new Subject<Array<Position>>();
  serverId = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  addNewPosition(position: google.maps.LatLng) {
    const newPosition = new PositionC(
      this.currentExternalId,
      position.lat(),
      position.lng()
    );
    this.currentPositions.push(newPosition);
  }

  getPath(externalId: number) {
    this.http.get<Array<Position>>
      (Constants.HOST + 'path/automatic/' + externalId,
      { headers: Constants.HEADERS }
    )
      .subscribe( response => {
        this.currentPositions = [];
        this.updatedPositions.next(response);
      }, error => {
        this.currentPositions = [];
        this.updatedPositions.next(this.currentPositions);
        console.log('error', error.message);
      });
  }

  intializeNewPath() {
    this.currentExternalId = new Date().getTime();
    this.currentPositions = [];
  }

  postPositions() {
    this.http.post(
      Constants.HOST + 'path/position/' + Constants.POSITION_TYPE.AUTOMATIC,
      JSON.stringify(this.currentPositions),
      { headers: Constants.HEADERS }
    )
      .subscribe(() => {
        this.serverId.next(true);
      }, error => {
        console.log('error', error.message);
        this.serverId.next(false);
      });
  }

}
