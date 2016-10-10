// http://stackoverflow.com/questions/5006821/nodejs-how-to-read-keystrokes-from-stdin

const readline = require('readline');

const request = require('request');
const Roku = require('node-roku');
const xml2json = require('xml2json');

// Will be populated once a device is found
var address;

// Map to this URL: http://******:8060/keypress/{key}
const keyEndpoint = {
    // Arrow Keys
    left: 'Left',
    right: 'Right',
    up: 'Up',
    down: 'Down',

    // Standard Keys
    space: 'Play',
    backspace: 'Back',
    return: 'Select',

    // Sequences (shift key)
    H: 'home',
    R: 'Rev',
    F: 'Fwd',
    S: 'Search',
    E: 'Enter',

    // Other
    r: 'InstantReplay',
    b: 'InfoBackspace'
};
const xmlToObject = xml => {
    return JSON.parse(xml2json.toJson(xml));
}

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

console.log('Looking for Rokus on the network...');

// Find the Rokus
Roku.find((err, devices) => {
    if (err) {
        console.log('`roku.find` error: ', err);
        process.exit();
    }

    if (!devices.length) {
        console.log('No Roku devices found.  Bailing.');
        process.exit();
    }

    // Key press listener needs to be valid at this point to grab numeric from the keypress
    deviceList = devices;
    if (deviceList.length === 1) {
        address = deviceList[0];
        connectToRoku(address);
    } else {
        deviceListToConsole(deviceList, "Please select the Roku to connect to:");
    }
});

// Start the keypress listener
process.stdin.on('keypress', (str, key) => {
    // "Raw" mode so we must do our own kill switch
    if (key.sequence === '\u0003') {
        process.exit();
    }

    var endpoint;

    // Ignore endpoint calls until we're connected
    if (address) {
        // Handle commands
        endpoint = keyEndpoint[key.name] || keyEndpoint[key.sequence] || 'Lit_' + key.name;

        // Not sure how "undefined" happens but it does; ignore those;
        if (endpoint === 'Lit_undefined') {
            return;
        }

        // Send command!
        request.post(address + '/keypress/' + endpoint);
    } else {
        // Check if numeral entered is in deviceList
        selectedIndex = parseInt(key.name || key.sequence);

        if (!deviceList) {
            return;
        }

        if (deviceList[selectedIndex]) {
            address = deviceList[selectedIndex];
            connectToRoku(address);
        } else {
            console.log("Invalid selection, please select a valid Roku.");
        }
    }
});

function deviceListToConsole(deviceList, header) {
    if (header) {
        console.log(header);
    }

    deviceList.forEach(function (device, index, array) {
        console.log(index + ': ' + device);
    });
}

function connectToRoku(address) {
    console.log("Connecting to device at " + address + '...');
    Roku.getDevice(address, (err, deviceDetail) => {
        console.log('Connected to Device: ', xmlToObject(deviceDetail).root.device.friendlyName, ' (', address, ')');
        console.log('Press keys to navigate the Roku and select content!');
    });
}
