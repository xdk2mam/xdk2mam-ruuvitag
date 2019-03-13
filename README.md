# XDK2MAM package for RuuviTag Open Source Wireless Sensor Node

[RuuviTag](https://ruuvi.com/ruuvitag-specs/) is an advanced open-source sensor beacon platform measuring temperature, atmosferic pressure and air humidity with professional enviromental sensors (Bosch BME 280) and the ability to send the data out through BLE. 

**Note that the Node code provided here works for Linux (aimed to Raspberry Pi mainly). If you want to set a receiver on other OS you can extend the solution by visiting the [Noble Repository](https://github.com/noble/noble).**

**Because the Node Bluetooth code relays on [Noble](https://github.com/noble/noble), and this project seems to have updated its dependencies only till Node 8, we recommend to use 8.10.0 version. We tested it with Node 9 and made it work. Node 10 and further versions will not install properly.**

The following repository has 2 solutions. 

- **[RuuviTag to BLE Device](https://github.com/xdk2mam/xdk2mam-ruuvitag/tree/master/xdk2mam-ruuvitag-direct)** (Beacon sends data directly to a BLE listening device with capabilities to run Node.js and publish the sensor's data to the Tangle)
- **[RuuviTag to Ruuvi Station](https://github.com/xdk2mam/xdk2mam-ruuvitag/tree/master/xdk2mam-ruuvitag-with-endpoint)** (Ruuvi Station App is used to get the data and send it to a Gateway defined on the app settings pointing to a Node.js server that publishes data to Tangle)
