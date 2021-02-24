import { HttpHeaders } from "@angular/common/http";

export const HOST = 'http://localhost:8080/rest.service.example/api/';
export enum POSITION_TYPE {
  AUTOMATIC = 2,
  ON_DEMAND = 1
};
export enum STATE {
  CREATE,
  VIEW
};
export const HEADERS = new HttpHeaders({
  'Content-Type': 'application/json; charset=utf-8',
  'Accept': 'application/json, text/plain'
});
