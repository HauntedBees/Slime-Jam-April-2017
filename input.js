const input = {
    gamepads: [], gamepadQueryIdx: -1, 
    gamepadButtons: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    GetKey: e => e.key.length === 1 ? e.key.toLowerCase() : e.key,
    KeyPress: function(e) {
        const key = input.GetKey(e);
        gameData.SendMessage(key);
    },
    GamepadConnected: function(e) {
        input.gamepads[e.gamepad.index] = e.gamepad;
        console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.", e.gamepad.index, e.gamepad.id, e.gamepad.buttons.length, e.gamepad.axes.length);
        input.gamepadQueryIdx = setInterval(input.QueryGamepads, 10);
    },
    GamepadDisconnected: function(e) {
        delete input.gamepads[e.gamepad.index];
        let hasKeys = false;
        for(const key in input.gamepads) { hasKeys = true; break; }
        if(!hasKeys) {
            console.log("no controllers left!");
            clearInterval(input.gamepadQueryIdx);
        }
    },
    QueryGamepads: function() {
        const gamepads = navigator.getGamepads();
        if(gamepads === undefined || gamepads === null) { return; }
        const buttonsDown = [];
        for(const gp in gamepads) {
            if(gamepads[gp] === null || gamepads[gp].id === undefined) { continue; }
            gamepads[gp].buttons.forEach((e, i) => {
                if(e.pressed && i < 16) { buttonsDown.push(i); }
            });
        }
        for(let i = 0; i < input.gamepadButtons.length; i++) {
            const prevState = input.gamepadButtons[i];
            const btn = (i < 16) ? ("Gamepad" + i) : ("GamepadA" + (i - 16));
            if(buttonsDown.indexOf(i) < 0 && buttonsDown.indexOf(-i) < 0) { // not pressed
                if(prevState > 0) { // just released
                    input.gamepadButtons[i] = -1;
                } else { input.gamepadButtons[i] = 0; } // not pressed
            } else { // pressed
                input.gamepadButtons[i]++;
                const btnVal = input.gamepadButtons[i];
                if(btnVal === 1 || (btnVal >= 100 && btnVal % 15 === 0)) {
                    gameData.SendMessage(btn);
                }
            }
        }
    }
};