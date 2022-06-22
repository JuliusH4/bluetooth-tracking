
export class NotEnoughsignals {
    constructor(message: string) {
      const error = Error(message);
  
      // set immutable object properties
      Object.defineProperty(error, 'message', {
        get() {
          return message;
        }
      });
      Object.defineProperty(error, 'name', {
        get() {
          return 'NotEnoughSignals';
        }
      });
      // capture where error occured
      Error.captureStackTrace(error, NotEnoughsignals);
      return error;
    }
  }