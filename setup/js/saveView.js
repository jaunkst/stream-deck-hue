//==============================================================================
/**
@file       saveView.js
@brief      Philips Hue Plugin
@copyright  (c) 2019, Corsair Memory, Inc.
            This source code is licensed under the MIT-style license found in the LICENSE file.
**/
//==============================================================================

// Load the save view
function loadSaveView() {
    // Set the status bar
    setStatusBar('save');

    // Fill the title
    document.getElementById('title').innerHTML = localization['Save']['Title'];

    // Fill the content area
    document.getElementById('content').innerHTML = `
        <p>${localization['Save']['Description']}</p>
        <img class="image" src="images/bridge_paired.png" alt="${localization['Save']['Title']}">
        <div class="button" id="close">${localization['Save']['Save']}</div>
    `;

    // Add event listener
    document.getElementById('close').addEventListener('click', close);
    document.addEventListener('enterPressed', close);

    // Safe the bridge
    let detail = {
        'detail': {
            'id': bridge.getID(),
            'username': bridge.getUsername()
        }
    };

    let event = new CustomEvent('saveBridge', detail);
    window.opener.document.dispatchEvent(event);

    // Close this window
    function close() {
        window.close();
    }
}
