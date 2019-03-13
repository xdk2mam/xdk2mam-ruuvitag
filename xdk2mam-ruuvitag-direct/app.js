const Noble = require('noble');
const BeaconScanner = require('node-beacon-scanner');
var base64_decode = require('./decode/base64.js')
var base91 = require('base91');
var crypto = require('crypto');
var colors = require('colors');

let sensordata = require('xdk2mam');
var IOTA = require('iota.lib.js');
var Mam = require('./node_modules/xdk2mam/mam.client.js');


// Enter your Node URL and port (be sure to use a node with PoW enabled)
let iota = new IOTA({
	'provider': 'https://papa.iota.family:14267'
});

const INTERVAL_IN_MS = process.argv[2];
let sem = true;

var scanner = new BeaconScanner();


const keyGen = length => {
    var charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9'
    var values = crypto.randomBytes(length)
    var result = new Array(length)
    for (var i = 0; i < length; i++) {
    result[i] = charset[values[i] % charset.length]
    }
    return result.join('')
}

const seed = keyGen(81);


let mamState = Mam.init(iota, seed, 2);

scanner.onadvertisement = async (advertisement) => {
	
	if(sem){
		sem=false;
		const info = parseAndDisplayData(advertisement);			
		await sensordata.saveDataAndPrintRoot(JSON.stringify(info),mamState,iota).then(ms => {
			mamState = ms;
			console.log('')		
		});	
	}		
}

scanner.startScan().then(()=>{
		console.log('Scanning...');
}).catch(error => {
		console.log(error);
})


setInterval(function(){ sem=true; }, INTERVAL_IN_MS)


function parseAndDisplayData(advertisement) {

	const idRuuvi = advertisement.id
	const rssi = advertisement.rssi
	const hash = advertisement.eddystoneUrl.url.substr(advertisement.eddystoneUrl.url.length - 9)

	 var variables = hash;
	 if(variables.length===9){
	   variables += "...";
	 }	 
	 var decoded   = base91.decode(variables);
	 var decoded64 = base64_decode(variables);
	 var format = decoded64[0];

	 let temp = 0;
	 let air_pressure = 0;
	 let humidity = 0;

	 if(2 !== format && 4 !== format){
	     humidity = decoded[1] * 0.5;
	     var uTemp = (((decoded[3] & 127) << 8) | decoded[2]);
	     var tempSign = (decoded[3] >> 7) & 1;
	     temp = tempSign === 0 ? uTemp/256.0 : -1 * uTemp/256.0;
	     air_pressure = ((decoded[5] << 8) + decoded[4]) + 50000; 
	 }
	 else
	 {
	     humidity = decoded64[1] * 0.5;
	     var uTemp = (((decoded64[2] & 127) << 8) | decoded64[3]);
	     var tempSign = (decoded64[2] >> 7) & 1;
	     temp = tempSign === 0 ? uTemp/256.0 : -1 * uTemp/256.0;
	     air_pressure = ((decoded64[4] << 8) + decoded64[5]) + 50000;	     
	 }

	 var xdk2mam = { sensor: [{ Temperature: temp },
						      { Humidity: humidity },
						      { Pressure: air_pressure/100}],
				     timestamp: Math.floor(Date.now() / 1000),
				     device: idRuuvi,
				 	 rssi: rssi}

	console.log('*****************************************************************');
    console.log('** Temperature: ', colors.green.bold(xdk2mam.sensor[0].Temperature));
    console.log('** Humidity: ', colors.green.bold(xdk2mam.sensor[1].Humidity));
    console.log('** Pressure: ', colors.green.bold(xdk2mam.sensor[2].Pressure));
    console.log('** Timestamp: ', colors.green.bold(xdk2mam.timestamp));
    console.log('** Device: ', colors.green.bold(xdk2mam.device));
	console.log('** Rssi: ', colors.green.bold(xdk2mam.rssi));
	console.log('*****************************************************************');
    


	 return xdk2mam
}
