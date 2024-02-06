import { updateLogger as updateLoggerCore } from '@cypherock/sdk-core';
import { ILogger, LogCreator } from '@cypherock/sdk-interfaces';
import {
  createDefaultConsoleLogger,
  updateLoggerObject,
} from '@cypherock/sdk-utils';

export const loggerServiceName = 'sdk-app-near';

export const logger: ILogger = {
  ...createDefaultConsoleLogger(loggerServiceName),
};

export const updateLogger = (createLogger: LogCreator) => {
  updateLoggerCore(createLogger);
  updateLoggerObject({
    currentLogger: logger,
    newLogger: createLogger(loggerServiceName),
  });
};

export default logger;
