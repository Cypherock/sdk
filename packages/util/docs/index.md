# Utils

Package name: `@cypherock/sdk-utils`

Contains common utilities

## 1. Usage

Install package: `npm i @cypherock/sdk-utils`

```ts
import { sleep } from '@cypherock/sdk-utils';

await sleep(200);
```

## 2. Functions

### 2.1. `async sleep(ms: number)`

Sleeps for `ms` milliseconds

**Arguments**: `ms: number`

**Result**: `void`

### 2.2. `hexToUint8Array(hex: string)`

Converts hex string to Uint8Array

**Arguments**: `hex: string`

**Result**: `Uint8Array`

### 2.3. `uint8ArrayToHex(data: Uint8Array)`

Converts Uint8Array to hex string

**Arguments**: `data: Uint8Array`

**Result**: `string`
