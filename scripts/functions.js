import constants from './constants';

// Checks whether values array contains specific value
function inArray(value, values) {
    return values.indexOf(value) > -1;
}

// Creates an array of integers
function range(start, count) {
    return Array
        .apply(0, new Array(count))
        .map((element, index) => index + start);
}

// Returns a random integer within specified bounds
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Returns a complete set of randomly generated square indices for the game
function getRandomGameNumbers() {
    return range(1, 16).sort(_ => Math.floor(Math.random() * 16) - 1);
}

// Converts keyboard key codes to custom constants
function getDirectionFromKeyCode(code) {
    switch (code) {
        case 38: return constants.direction.UP;
        case 40: return constants.direction.DOWN;
        case 37: return constants.direction.LEFT;
        case 39: return constants.direction.RIGHT;
        default: return constants.direction.UNDEF;
    }
}

// Formats given seconds into H:i:s format
function formatTime(seconds) {
    let hours = Math.floor(seconds / 3600),
        minutes = Math.floor((seconds - (hours * 3600)) / 60);

    seconds = seconds - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = `0${hours}`;
    }

    if (minutes < 10) {
        minutes = `0${minutes}`;
    }

    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    return `${hours}:${minutes}:${seconds}`;
}

export {
    inArray,
    range,
    getRandomInt,
    getRandomGameNumbers,
    getDirectionFromKeyCode,
    formatTime
};