import SVG from 'svg.js';
import constants from './constants';
import images from './images';
import Squares from './squares';
import Timer from './timer';
import { inArray, range, getDirectionFromKeyCode } from './functions';

export default function(container) {
    let that = this,
        game = SVG(container),
        combinationToWin = range(1, 16),
        moves = 0,
        started = false,
        squares = new Squares(game, constants.dimensions.SQUARE_SIZE + constants.dimensions.SQUARE_MARGIN),
        timer = new Timer();

    this.launch = () => {
        moves = 0;
        started = true;

        squares.draw();

        if (typeof this.onLaunch === 'function') {
            this.onLaunch();
        }

        timer.start(this.onEach);
    };

    this.draw = squares.draw;
    this.drawEmpty = squares.drawEmpty;
    this.start = (each) => timer.start(each);
    this.stop = () => {
        started = false;

        timer.stop((seconds) => {
            if (typeof this.onStop === 'function') {
                this.onStop(moves, seconds, playerHasWon());
            }
        });

        this.drawEmpty();
    };

    // Handles mouse activities on the game surface.
    // Once a square is clicked, it's checked upon movability or emptiness
    // and then it's eigther selected or moved to a new position
    container.addEventListener('touchstart', move);
    container.addEventListener('mousedown', move);

    function move(event) {
        if ( ! started) {
            return;
        }

        let square = squares.getSquareByNode(event.target);

        if ( ! square) {
            return;
        }

        if (squares.isMovable(square)) {
            squares.select(square);
        } else if (squares.isEmpty(square) && squares.move(squares.deselect())) {
            countMove();
        }
    }

    // Handles mouse activities outside the game surface
    document.addEventListener('touchstart', deselect);
    document.addEventListener('mousedown', deselect);

    function deselect(event) {
        if ( ! started || event.target.closest('#container')) {
            return;
        }

        event.preventDefault();
        squares.deselect();
    }

    // Handles keyboard activities, allowing to play by using left-right-top-bottom keys
    document.addEventListener('keydown', (event) => {
        if ( ! started || squares.isMoving()) {
            return;
        }

        if (event.keyCode == 27) {
            squares.deselect();

            return;
        }

        if ( ! inArray(event.keyCode, range(37, 40))) {
            return;
        }

        if (squares.moveByDirection(getDirectionFromKeyCode(event.keyCode))) {
            countMove();
        }
    });

    function countMove() {
        moves++;

        if (playerHasWon()) {
            that.stop();
        }
    }

    // Checks current square positions with the winning combination
    function playerHasWon() {
        return squares.getPositions().every((position, index) => {
            return position == combinationToWin[index];
        });
    }
};