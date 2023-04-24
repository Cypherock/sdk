/**
 * TransportError is a base class for all errors related to the Transport class.
 * Error classes that extend TransportError should be used to provide more specific error information.
 * The typed errors help to differentiate between different types of errors and provide clear error interfaces to the user.
 * @extends {Error}
 */
 class TransportError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'TransportError';
    }
  }
  
  /**
   * TransportWebUSBUIGestureRequired is thrown when a user gesture is required for WebUSB API usage.
   * This error typically occurs when trying to access the WebUSB API outside of a user-triggered event.
   * @see https://wicg.github.io/webusb/#dfn-user-gesture for more information.
   * This is enforced by the WebUSB API for security reasons so that websites cannot silently access USB devices without the user's consent.
   * @extends {TransportError}
   */
  class TransportWebUSBUIGestureRequired extends TransportError {
    constructor(message: string) {
      super(message);
      this.name = 'TransportWebUSBUIGestureRequired';
    }
  }
  
  /**
   * TransportOpenUserCancelled is thrown when a user cancels the device connection process.
   * This error typically occurs when the user clicks the "Cancel" button in the device connection dialog.
   * @extends {TransportError}
   */
  class TransportOpenUserCancelled extends TransportError {
    constructor(message: string) {
      super(message);
      this.name = 'TransportOpenUserCancelled';
    }
  }
  
  /**
   * InterfaceNotFoundError is thrown when the expected interface is not found on the USB device.
   * @extends {TransportError}
   */
  class InterfaceNotFoundError extends TransportError {
    constructor(message: string) {
      super(message);
      this.name = 'InterfaceNotFoundError';
    }
  }

  
// Path: packages/hw-webusb/src/transportWebUSB.ts
// interface containing the device and the type of operation.
interface X1DeviceInfo {
    operationType: 'add' | 'remove';
    deviceDescriptor: USBDevice;
    deviceModel: string;
    device: USBDevice;
  }
  
// Path: packages/hw-webusb/src/transportWebUSB.ts
// The `Transport` class is a comprehensive solution for interacting with X1 devices over the WebUSB API. 
// It is designed to simplify detecting and identifying X1 devices, handling device setup, and managing errors that might occur during these operations. 
// The class includes several methods to facilitate these tasks.
class Transport {
    private device: USBDevice;
  
    constructor(device?: USBDevice) {
      this.device = device || null;
    }
  
    /**
     * Returns the first connected X1 device, or null if none is found within the specified timeout.
     * @param {number} timeout - The duration to wait for a device (in milliseconds).
     * @returns {Promise<USBDevice | null>} A Promise that resolves to the first connected X1 device, or null if none is found within the specified timeout.
     */
    async getX1DeviceWithTimeout(timeout: number): Promise<USBDevice | null> {
      // Implementation of the waitForDevice function
      // ...

      return new Promise<USBDevice | null>((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error('X1 device not found within the specified timeout'));
        }, timeout);
    
        navigator.usb
          .requestDevice({ filters: [{ vendorId: 0x2581 }, { vendorId: 0x2c97 }] })
          .then((device: USBDevice) => {
            clearTimeout(timer);
            resolve(device);
          })
          .catch((error: Error) => {
            clearTimeout(timer);
            reject(error);
          });
      });
    }
  
    /**
     * Identifies the X1 device model based on the provided USB product ID.
     * @param {number} productId - The USB product ID of the device.
     * @returns {string} The device model string.
     */
    identifyUSBProductId(productId: number): string {
      // Implementation of the identifyUSBProductId function
      // ...
      function identifyUSBProductId(productId: number): string {
        switch (productId) {
          case 0x3b7c:
            return 'X1-March-2022';
         
        }
      }
    }
  
    /**
     * Sets up the X1 device by opening the WebUSB device, selecting device configuration, resetting the device, finding the correct interface, and claiming the interface.
     * An event listener is added to handle device disconnections.
     * @param {X1DeviceInfo} deviceInfo - An object containing the X1 device information.
     * @returns {Promise<USBDevice>} A Promise that resolves to the set up X1 device.
     * @throws {InterfaceNotFoundError} - If the correct interface is not found.
     * @throws {Error} - If the interface cannot be claimed.
     */
    async setupX1Device(deviceInfo: X1DeviceInfo): Promise<USBDevice> {
      // Implementation of the setupX1Device function
      // ...
        const { device } = deviceInfo;

        // Function to handle device disconnection
        function handleDisconnect() {
        console.log('X1 device disconnected.');
        navigator.usb.removeEventListener('disconnect', handleDisconnect);
        }

        // Add event listener for device disconnection
        navigator.usb.addEventListener('disconnect', handleDisconnect);

        // Open the device
        await device.open();

        // Select device configuration
        if (device.configuration === null) {
             await device.selectConfiguration(1);
        }

        // Reset the device
        await device.reset();

        // Find the right interface
        let interfaceNumber = -1;
        const config = device.configuration;
        if (config) {
        for (const iface of config.interfaces) {
            const alternate = iface.alternates[0];
            if (alternate.interfaceClass === 0xff && alternate.interfaceSubclass === 0 && alternate.interfaceProtocol === 0) {
            interfaceNumber = iface.interfaceNumber;
            break;
            }
        }
        }

        if (interfaceNumber === -1) {
            throw new InterfaceNotFoundError('Interface not found.');
        }

        // Claim the interface
        // Interface must be claimed before sending or receiving data.
        // It is a good practice to release the interface when it is no longer needed.
        // throw an error if the interface cannot be claimed. 
        const iface = config?.interfaces[interfaceNumber];
        if (iface && !iface.claimed) {
        await device.claimInterface(interfaceNumber);
        } else {
        throw new Error('Failed to claim the interface.');
        }

        return device;
    }
  
    /**
     * Handles X1 device detection by calling the setupX1Device() method when a device is detected.
     * If an error occurs during the device detection, an appropriate error is thrown.
     * @param {X1DeviceInfo | null} detectedDevice - An object containing the X1 device information, or null if an error occurred.
     * @param {Error | null} error - An Error object if an error occurred during device detection, or null otherwise.
     * @returns {Promise<X1DeviceInfo>} A Promise that resolves to the detected X1 device information.
     * @throws {TransportWebUSBUIGestureRequired} - If a DOMException with error code 18 occurs.
     * @throws {TransportOpenUserCancelled} - If any other error occurs.
     * @throws {Error} - If no device is detected and no error is provided.
     */
    async handleX1DeviceDetection(
      detectedDevice: X1DeviceInfo | null,
      error: Error | null
    ): Promise<X1DeviceInfo> {
      // Implementation of the handleX1DeviceDetection function
      // ...

      return new Promise(async (resolve, reject) => {
        if (detectedDevice) {
            try {
                // Setup the device.
                await this.setupX1Device(detectedDevice);
                // Resolve the promise with the detected device.
                resolve(detectedDevice);
            } catch (setupError) {
                reject(setupError);
            }
        } else if (error) {
            // Throw an appropriate error.
            // If a DOMException with error code 18 occurs, throw a TransportWebUSBUIGestureRequired error.
            // Otherwise, throw a TransportOpenUserCancelled error.
            // If no device is detected and no error is provided, throw an Error.
            // DOMEXception with error code 18 occurs when the user cancels the device selection dialog.
            if (
                window.DOMException &&
                error instanceof window.DOMException &&
                error.code === 18
            ) {
                reject(new TransportWebUSBUIGestureRequired(error.message));
            } else {
                reject(new TransportOpenUserCancelled(error.message));
            }
        } else {
            reject(new Error('No device detected and no error provided.'));
        }
    });
    }
  
  /**
   * Creates a new instance of the Transport class with the first connected X1 device, or rejects with an error if none is found within the specified timeout or if there's an error during device detection.
   * @param {number} [timeout=5000] - The duration to wait for a device (in milliseconds). Defaults to 5000.
   * @returns {Promise<Transport>} A Promise that resolves to a new instance of the Transport class with the first connected X1 device.
   */
   static async create(timeout?: number): Promise<Transport> {
    // Create a new Promise that resolves to a new instance of the Transport class with the connected X1 device
    return new Promise<Transport>(async (resolve, reject) => {
     // Instantiate a new Transport object
      const transport = new Transport();

      try {
        // Get the first connected X1 device within the specified timeout.
        const device: USBDevice = await transport.getX1DeviceWithTimeout(timeout || 5000);
        // Identify the device model based on its product ID
        const deviceModel: string = transport.identifyUSBProductId(device.productId);

         // Create a LedgerDeviceInfo object containing device information
        const X1DeviceInfo: X1DeviceInfo = {
          operationType: 'add',
          deviceDescriptor: device,
          deviceModel: deviceModel,
          device: device,
        };

        // Call handleLedgerDeviceDetection with the detected device information.
        await transport.handleX1DeviceDetection(X1DeviceInfo, null);
        // Resolve the Promise with the instantiated Transport object containing the detected device
        resolve(transport);
      } catch (error) {
        try {
        // Call handleLedgerDeviceDetection with the error occurred during device detection
          await transport.handleX1DeviceDetection(null, error);
          // Resolve the Promise with the instantiated Transport object after handling the error
          resolve(transport);
        } catch (e) {
         // Reject the Promise with the error occurred during device detection
          reject(e);
        }
      }
    });
  }
  
}