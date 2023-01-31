import SerialPort from 'serialport';

export const openConnection = (connection: SerialPort) =>
  new Promise<void>((resolve, reject) => {
    if (connection.isOpen) {
      resolve();
      return;
    }

    connection.open(err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

export const closeConnection = (connection: SerialPort) =>
  new Promise<void>((resolve, reject) => {
    if (!connection.isOpen) {
      resolve();
      return;
    }

    connection.close(err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
