export class User {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private expiresIn: Date
  ) {}

  get token() {
    if (!this.expiresIn || this.expiresIn < new Date()) {
      return null;
    }
    return this._token;
  }
}
