# Logging

By default all package logs will be printed to the console.

## Changing log levels

You can change the log levels by setting the `LOG_LEVEL` environment variable.

### Available log levels

- `error`
- `warn`
- `info`
- `verbose`
- `debug`

**Example**

```ts
// NodeJS
process.env.LOG_LEVEL = 'error';

// Browser
window.cysyncEnv = { LOG_LEVEL: 'error' };
```

## Using custom logger

If you don't want to use console for logging you can inject your own logger
into the packages.

All the SDK packages export a `updateLogger` function which can be used to inject
custom logger.

```ts
const updateLogger = (createLogger: LogCreator) => void;

// Services refers the different packages
type LogCreator = (service: string) => ILogger;

type LogMethod = (message: any, meta?: object) => void;

interface ILogger {
  info: LogMethod;
  error: LogMethod;
  warn: LogMethod;
  debug: LogMethod;
  verbose: LogMethod;
}
```

**Example**

```ts
import { updateLogger as updateLoggerEvm } from '@cypherock/sdk-app-evm';
import { updateLogger as updateLoggerHid } from '@cypherock/sdk-hw-hid';

const createLogger = (service: string) => ({
  info: (message: any, meta?: object) => {
    console.log({ message, meta, service });
  },
  error: (message: any, meta?: object) => {
    console.error({ message, meta, service });
  },
  warn: (message: any, meta?: object) => {
    console.warn({ message, meta, service });
  },
  debug: (message: any, meta?: object) => {
    console.debug({ message, meta, service });
  },
  verbose: (message: any, meta?: object) => {
    console.trace({ message, meta, service });
  },
});

updateLoggerEvm(createLogger);
updateLoggerHid(createLogger);
```
