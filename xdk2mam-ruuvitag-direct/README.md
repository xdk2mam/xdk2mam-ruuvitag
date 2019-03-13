# XDK2MAM package for RuuviTag to BLE Device

The following method will allow RuuviTag users to send sensor's data directly to a BLE device capable of running Node.js to handle data publishing to the Tangle via Masked Authenticated Messaging.

**Note that the Node code provided here works for Linux (aimed to Raspberry Pi mainly). If you want to set a receiver on other OS you can extend the solution by visiting the [Noble Repository](https://github.com/noble/noble).**

**Because the Node Bluetooth code relays on [Noble](https://github.com/noble/noble), and this project seems to have updated its dependencies only till Node 8, we recommend to use 8.10.0 version. We tested it with Node 9 and made it work. Node 10 and further versions will not install properly.**

The process to follow is pretty straight forward. First of all, be sure to have the Noble required soft. Because we are using a Pi3 with Raspbian, we will need to install ***libbluetooth-dev***. So, in our Raspberry Pi 3, or whatever device with Linux you are using, we must run: 


```
sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev
```
Once dependencies are installed, we are now ready to clone the repositorie.

```
git clone https://github.com/xdk2mam/xdk2mam-ruuvitag.git
```
Done! Let's head to the **xdk2mam-ruuvitag-direct** folder to install the neede modules with the following command. 

```
npm i
```

Once the installation finishes, edit the app.js file to add your Full Node (be sure to use one with PoW enabled). We set one from [IOTA Dance](https://iota.dance) per default.

```
let iota = new IOTA({
	'provider': 'https://mama.iota.family:14267'
});
```
That's all! But before you run the **app.js** script to start the BLE listener that will publish the beacon data to the Tangle you need to consider two things. 
- **Noble** requires to run the script as root, so you will need to sudo or become a root user. 
- The **app.js** script requires a parameter to scpecify the interval in milliseconds used to release data. 

So, to start the magic, assuming you want data from the RuuviTag sensors every 30 minutes, you should have to type

```
sudo node app.js 30000
```
Finally, remove your RuuviTag cover, take off the plastic from the batterie and push the little black button named **B**.
Despite our beacon has the **B** and **R** next to the tinty buttons, some may not so use this image as guide.

![RuuviTag B button](https://iotool.io/images/ruuvitag/schema.png)




