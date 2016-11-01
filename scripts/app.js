'use strict';

import './polyfills';
import constants from './constants';
import templates from './templates';
import { formatTime } from './functions';
import Game from './game';

window.onload = (undefined) => {
    let container = document.getElementById('container'),
        launch = document.getElementById('launch'),
        stop = document.getElementById('stop'),
        timeContainer = document.getElementById('time-container'),
        time = document.getElementById('time'),
        results = document.getElementById('results'),
        winnerTemplate = templates.winner
            .replace('{{winner}}', constants.strings.WINNER)
            .replace('{{moves_text}}', constants.strings.MOVES)
            .replace('{{time_text}}', constants.strings.TIME),
        game = new Game(container);

    launch.addEventListener('click', game.launch);
    stop.addEventListener('click', game.stop);

    game.onLaunch = () => {
        launch.classList.add(constants.classes.HIDDEN);
        timeContainer.classList.remove(constants.classes.HIDDEN);
        stop.classList.remove(constants.classes.HIDDEN);
        results.innerHTML = '';
    };

    game.onEach = (seconds) => {
        time.innerHTML = formatTime(seconds);
    };

    game.onStop = (moves, seconds, won) => {
        launch.classList.remove(constants.classes.HIDDEN);
        timeContainer.classList.add(constants.classes.HIDDEN);
        time.innerHTML = '00:00:00';
        stop.classList.add(constants.classes.HIDDEN);

        if (won) {
            results.innerHTML = winnerTemplate
                .replace('{{moves}}', moves)
                .replace('{{time}}', formatTime(seconds));
        }
    };

    // Draw empty squares to fill the scene
    game.drawEmpty();
};