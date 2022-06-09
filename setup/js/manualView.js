//==============================================================================
/**
@file       manualView.js
@brief      Philips Hue Plugin
@copyright  (c) 2019, Corsair Memory, Inc.
            This source code is licensed under the MIT-style license found in the LICENSE file.
**/
//==============================================================================

// Load the manual view
function loadManualView() {
    // Set the status bar
    setStatusBar('discovery');

    // Fill the title
    document.getElementById('title').innerHTML = localization['Manual']['Title'];

    // Fill the content area
    document.getElementById('content').innerHTML = `
        <p>${localization['Manual']['Description']}</p>
        <br />
        <div id="ip-validation" class="error-container"></div>
        <label>${localization['Manual']['IPAddress']}</label>
        <input type="text" id="ip" />
        <div class="button block" id="check">${localization['Manual']['Check']}</div>
        <div class="button-transparent" id="close">${localization['Manual']['Close']}</div>
    `;

    // Set cursor to input field
    document.getElementById('ip').focus();

    // Add event listener
    document.getElementById('check').addEventListener('click', check);
    document.addEventListener('enterPressed', check);

    document.getElementById('close').addEventListener('click', close);
    document.addEventListener('escPressed', close);

    // Print error message
    function printError(error) {
        document.getElementById('ip-validation').innerHTML = `<div class="error">${error}</div>`;
    }

    // Check ip address
    function check() {
        let ip = document.getElementById('ip').value.trim();

        // check if input is empty
        if (!ip) {
            printError(localization['Manual']['Error']['Empty']);
            return;
        }

        // check if ip is invalid
        let ipV4Regex = '^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$';
        if (!(new RegExp(ipV4Regex)).test(ip)) {
            printError(localization['Manual']['Error']['Invalid']);
            return;
        }

        // try reaching bridge
        let url = `http://${ip}/api/config`;
        let xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('GET', url, true);
        xhr.timeout = 10000;

        xhr.onload = function() {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200 &&
                xhr.response !== undefined && xhr.response != null &&
                xhr.response.hasOwnProperty('bridgeid')
            ) {
                bridges = [
                    new Bridge(ip, xhr.response.bridgeid.toLowerCase())
                ];

                // at this point the bridge has been found and added to list
                pair();
                return;
            }

            printError(localization['Manual']['Error']['Unreachable']);
        };

        xhr.onerror = xhr.ontimeout = function() {
            printError(localization['Manual']['Error']['Unreachable']);
        };

        xhr.send();
    }

    // Open pairing view
    function pair() {
        unloadManualView();
        loadPairingView();
    }

    // Close the window
    function close() {
        window.close();
    }

    // Unload view
    function unloadManualView() {
        // Remove event listener
        document.removeEventListener('enterPressed', check);
        document.removeEventListener('escPressed', close);
    }
}
