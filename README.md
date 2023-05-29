# Cypherock SDK

## Table of contents

1. [Prerequisites](#prerequisites)
2. [Understanding the directory structure](#understanding-the-directory-structure)
3. [Development Setup](#development-setup)
4. [Local setup](#local-setup)
5. [Other commands](#other-commands)
6. [Contributing](#contributing)

## Prerequisites

Before you get started, please make sure you have the following setup -

- Node.js v16 (use [nvm][1] if already using a different Node version).
- [`pnpm`][2]
  ```
  npm i -g pnpm
  ```
- Install [`protoc`][9]
- Python >=3.6
  - [Download][7] and install the latest Python version.
  - Run `npm config set python /path/to/executable/python` to configure.
- Install and set up [node-gyp][6] -
  - `npm i -g node-gyp` to install.
  - For Windows, follow an additional step -
    - Install Visual C++ 2017 Build Environment: [Visual Studio Build Tools][3] (using "Visual C++ build tools" workload) or [Visual Studio Community][4] (using the "Desktop development with C++" workload).
  - For more details, please refer to the [node-gyp documentation][5].

## Understanding the directory structure

```
├── apps                # Contains all the applications
│   └── browser             # Browser application to test sdk
│   └── node                # Nodejs application to test sdk
│   └── docs                # Documentation for sdk
│
├── packages            # Holds packages required for sdk
│   └── app-manager         # Manager application containing all
│   └── core                # Handles low level communication protocol necessary for device communication
│   └── hw-hid              # Handles device connection with HID protocol
│   └── hw-serialport       # Handles device connection with SerialPort protocol
│   └── hw-webusb           # Handles device connection with WebUSB protocol
│   └── interfaces          # Contains common interfaces between other packages
│   └── util-*              # Common utilities shared between packages
│
├── submodules          # Contains all submodules required for sdk
│   └── common              # Common configs and protobufs shared between device and sdk
│
├── package.json

```

## Development Setup

> The repository contains submodules, which need to be downloaded as well.
> Clone the repository along with its submodules using -

```sh
git clone git@github.com:Cypherock/sdk.git --recurse-submodules
```

### Local setup

Once you have cloned the repository, follow these steps -

```sh
pnpm i        # Install packages
pnpm build        # build all modules
```

### Other commands

- `pnpm start:node`: Start demo app on nodejs
- `pnpm start:browser`: Start demo app on browser
- `pnpm test`: Run all tests
- `pnpm lint`: Lint all files
- `pnpm pretty`: Prettify all files

### Turorepo Remote Caching

- Create a new file `.turbo/config.json` and add the following content -
  ```json
  {
    "teamid": "team_<TEAMID>",
    "apiurl": "<CACHE API URL>"
  }
  ```
- Set the `TURBO_TOKEN=yourToken` environment variable

## Contributing

Please consider making a contribution to the project. Contributions can include bug fixes, feature proposal, or optimizations to the current code.

[1]: https://nodejs.org/en/download/package-manager/#nvm 'How to use NVM'
[2]: https://pnpm.io/ 'Pnpm documentation'
[3]: https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=BuildTools 'MS VS Build Tools'
[4]: https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=Community 'MS VS Community'
[5]: https://github.com/nodejs/node-gyp 'node-gyp documentation'
[6]: https://github.com/nodejs/node-gyp#on-windows 'Configure node-gyp on Windows'
[7]: https://www.python.org/downloads 'Download Python'
[8]: https://nodejs.org/api/fs.html#fsrmsyncpath-options 'fs.rmSync was introduced in v14.14.0'
[9]: https://grpc.io/docs/protoc-installation/ 'Protoc Installation'
