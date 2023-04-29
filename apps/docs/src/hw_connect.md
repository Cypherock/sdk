# HW Connect

This layer allows you to connect with the Cypherock X1 hardware wallet with
different technologies: WebUSB and HID.

You can use the below table to select between WebUSB and HID.

| Technology                                                            | Supported Platform                  |
| --------------------------------------------------------------------- | ----------------------------------- |
| [WebUSB](https://developer.mozilla.org/en-US/docs/Web/API/WebUSB_API) | Web Apps                            |
| [HID](https://www.npmjs.com/package/node-hid)                         | Desktop Apps with NodeJS/ElectronJS |

## 1. Create Connection

- **Description**: Find and create a connection instance of the connected
  Cypherock X1 hardware wallet. Thorws error if no connected device is found.
- **Parameters**: `None`
- **Result**: `DeviceConnection`
