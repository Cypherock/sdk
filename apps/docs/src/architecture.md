# Architecture

The below architecture shows how your application can interact with the Cypherock
X1 hardware wallet through the Cypherock SDK.

![SDK Architecture](../assets/architecture.png)

## Components

1. [**Cypherock SDK Applications**](./apps/index.md): The packages through which you will be able
   to invoke operations on the Cypherock X1 Hardware Wallet
2. **Cypherock SDK Core**: This contains the logic for sending/receiving data
   to and from Cypherock X1 hardware wallet. It's also responsible for handling ACKs,
   encoding/decoding large data chunks into smaller packets.
3. [**Cypherock SDK HW Connect**](./hw_connect.md): These packages will allow you to connect to the
   Cypherock X1 Hardware Wallet with different technologies, like: WebUSB, HID
