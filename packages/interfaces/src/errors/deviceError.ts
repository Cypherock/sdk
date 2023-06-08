export abstract class DeviceError extends Error {
  public code: string;

  public message: string;

  public isDeviceError = true;

  constructor(errorCode: string, message: string, cls: any) {
    super();
    this.code = errorCode;
    this.message = message;

    this.setPrototype(cls);
  }

  public setPrototype(cls: any) {
    if ((<any>Object).setPrototypeOf) {
      (<any>Object).setPrototypeOf(this, cls.prototype);
    } else {
      // eslint-disable-next-line
      (<any>this).__proto__ = cls.prototype;
    }
  }

  public toJSON() {
    return {
      code: this.code,
      message: `${this.code}: ${this.message}`,
      isDeviceError: this.isDeviceError,
      stack: this.stack,
    };
  }
}
