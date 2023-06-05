import { ILogger, LogCreator } from '@cypherock/sdk-interfaces';
import {
  createDefaultConsoleLogger,
  updateLoggerObject,
} from '@cypherock/sdk-utils';

export const loggerServiceName = 'sdk-app-manager';

export const logger: ILogger = {
  ...createDefaultConsoleLogger(loggerServiceName),
};

export const updateLogger = (createLogger: LogCreator) => {
  updateLoggerObject({
    currentLogger: logger,
    newLogger: createLogger(loggerServiceName),
  });
};

export default logger;
