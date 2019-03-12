let sensordata = require('xdk2mam');
var bodyParser = require('body-parser');
var express = require('express');
var IOTA = require('iota.lib.js');
var Mam = require('./node_modules/xdk2mam/mam.client.js');
var crypto = require('crypto');

// Start Express on given port
var app = express();
var port = process.env.PORT || 8080;

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({	extended: true,
                                limit: "1mb"}));

// Enter your Node URL and port (be sure to use a node with PoW enabled)
let iota = new IOTA({
  'provider': 'http://heimelaga.vodka:14265'
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
	obj.device = "aleelus"
	obj.timestamp = data.time 

	return obj;
}


app.post('/sensors', async function(req, res) {

	await sensordata.saveData(objSensor(req.body),mamState,iota).then(ms => {    
	mamState = ms; 
	res.send("OK");
	});

});

app.listen(port);
console.log('Server started! At http://localhost:' + port);

