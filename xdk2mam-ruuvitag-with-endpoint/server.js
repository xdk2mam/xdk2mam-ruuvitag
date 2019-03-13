let sensordata = require('xdk2mam');
var bodyParser = require('body-parser');
var express = require('express');
var IOTA = require('iota.lib.js');
var Mam = require('./node_modules/xdk2mam/mam.client.js');
var crypto = require('crypto');
var colors = require('colors');

// Start Express on given port
var app = express();
var port = process.env.PORT || 8080;

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({	extended: true,
                                limit: "1mb"}));

const INTERVAL_IN_MS = process.argv[2];
let sem = true;

// Enter your Node URL and port (be sure to use a node with PoW enabled)
let iota = new IOTA({
  'provider': 'https://papa.iota.family:14267'
});

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

setInterval(function(){ sem=true; }, INTERVAL_IN_MS)

const objSensor = (data) => {
	var obj = {};	

	obj.xdk2mam = []
	
	obj.xdk2mam.push({sensor: "Environmental", 
					  data: [{Pressure: data.tags[0].pressure},
							 {Temperature: data.tags[0].temperature},
							 {Humidity: data.tags[0].humidity}
							 ]});
	obj.xdk2mam.push({sensor: "Accelerometer",
					  data: [{x: data.tags[0].accelX},
							 {y: data.tags[0].accelY},
							 {z: data.tags[0].accelZ}
							 ]});	
	obj.device = data.deviceId
	obj.timestamp = data.time
	obj.rssi = data.tags[0].rssi

	console.log('*****************************************************************');
    console.log('** Pressure: ', colors.green.bold(obj.xdk2mam[0].data[0].Pressure));
    console.log('** Temperature: ', colors.green.bold(obj.xdk2mam[0].data[1].Temperature));
    console.log('** Humidity: ', colors.green.bold(obj.xdk2mam[0].data[2].Humidity));
    console.log('** Accel X: ', colors.green.bold(obj.xdk2mam[1].data[0].x));
    console.log('** Accel Y: ', colors.green.bold(obj.xdk2mam[1].data[1].y));
    console.log('** Accel Z: ', colors.green.bold(obj.xdk2mam[1].data[2].z));
    console.log('** Timestamp: ', colors.green.bold(obj.timestamp));
    console.log('** Device: ', colors.green.bold(obj.device));
	console.log('** Rssi: ', colors.green.bold(obj.rssi));
	console.log('*****************************************************************');

	return obj;
}


app.post('/sensors', async function(req, res) {		
	
	if(req.body.tags[0] != undefined){
		if(sem){		
			sem=false;
			await sensordata.saveDataAndPrintRoot(JSON.stringify(objSensor(req.body)),mamState,iota).then(ms => {
				mamState = ms;
				console.log('')				
			});	
		}	
	}
	
	res.send("OK");	

});

app.listen(port);
console.log('Server started! At http://localhost:' + port);

