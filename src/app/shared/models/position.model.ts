/**
 * @autor: Vladimir Aca
 */

export class PositionC {
  public userId: number;
  public timeStamp: string;

  constructor(public externalId: number, public latitude: number, public longitude: number) {
    this.userId = 1;
    this.timeStamp = new Date().getTime().toString();
  }
}
