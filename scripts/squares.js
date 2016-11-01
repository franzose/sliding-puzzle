import SVG from 'svg.js';
import constants from './constants';
import images from './images';
import { inArray, getRandomGameNumbers } from './functions';

export default function(container, size) {
    let squares = [],
        emptySquare,
        emptySquareTemplate = images.empty.replace('id="empty-square"', ''),
        squareClass = 'game__square',
        isMoving = false;

    // Draws random set of squares on the game scene
    this.draw = () => {
        let group = getSquaresGroup().clear();

        let leftIndex = 0,
            topIndex = 0,
            numbers = getRandomGameNumbers();

        for (let idx = 0; idx <= 15; idx++) {
            if (idx % 4 == 0 && idx > 0) {
                leftIndex = 0;
                topIndex++;
            }

            let x = size * leftIndex,
                y = size * topIndex,
                number = numbers.shift(),
                svg = number == 16 ? images.empty : images.square.replace('{{idx}}', number);

            group.svg(svg);
            squares[idx] = group.get(idx)
                .addClass(`${squareClass} js-square`)
                .attr({ x, y })
                .data('index', number);

            leftIndex++;
        }
    };

    // Draws empty squares to initially fill the game scene
    this.drawEmpty = () => {
        let group = getSquaresGroup().clear();

        let leftIndex = 0,
            topIndex = 0;

        for (let idx = 0; idx <= 15; idx++) {
            if (idx % 4 == 0 && idx > 0) {
                leftIndex = 0;
                topIndex++;
            }

            let x = size * leftIndex,
                y = size * topIndex;

            group.svg(emptySquareTemplate);
            squares[idx] = group.get(idx)
                .addClass(squareClass)
                .attr({ x, y });

            leftIndex++;
        }
    };

    // Returns the SVG square by the given DOM node
    this.getSquareByNode = (node) => {
        let svg = node.closest('svg');

        if ( ! svg || ! svg.classList.contains('js-square')) {
            return null;
        }

        return squares.find((square) => {
            return square.data('index') == svg.getAttribute('data-index');
        });
    };

    this.isEmpty = (square) => square.attr('id') === 'empty-square';

    // Checks whether a square can be moved.
    // Movable squares are those which stand one position
    // to the LEFT, RIGHT, TOP or BOTTOM from the empty square
    this.isMovable = (square) => {
        let box = square.tbox(),
            emptyBox = getEmptySvgSquare().tbox(),
            leftRight = [emptyBox.x - size, emptyBox.x + size],
            topBottom = [emptyBox.y - size, emptyBox.y + size];

        return (box.y == emptyBox.y && inArray(box.x, leftRight)) ||
               (box.x == emptyBox.x && inArray(box.y, topBottom));
    };

    // Marks a square as selected
    this.select = (square) => {
        deselect();

        square.addClass(constants.classes.SELECTED);
    };

    this.deselect = () => deselect();

    // Returns or creates wrapping group of the squares
    function getSquaresGroup() {
        let group = SVG.get('#squares-group');

        return (group ? group : container.group().attr('id', 'squares-group'));
    }

    // Finds currently selected square and removes selection from it, returning the square itself
    function deselect() {
        let selected = squares.find((square) => square.hasClass(constants.classes.SELECTED));

        if (selected) {
            selected.removeClass(constants.classes.SELECTED);
        }


        return selected;
    }

    // Moves a square by direction defined in constants
    this.moveByDirection = (direction) => {
        let empty = getEmptySvgSquare(),
            target = getSquareByCoords(getMoveCoordsFromDirection(empty, direction));

        return this.move(target, empty);
    };

    // Move a square by exchanging its position with the empty square
    this.move = (square, empty) => {
        if ( ! square) {
            return false;
        }

        isMoving = true;

        empty = empty || getEmptySvgSquare();

        let emptyBox = empty.tbox(),
            squareBox = square.tbox();

        empty.animate(constants.animation.MOVE_DURATION).attr({
            x: squareBox.x - 1,
            y: squareBox.y - 1
        });

        square.animate(constants.animation.MOVE_DURATION).attr({
            x: emptyBox.x - 1,
            y: emptyBox.y - 1
        });

        reindexSquares(square);

        setTimeout(() => {
            isMoving = false;
        }, constants.animation.MOVE_DURATION + 50);

        return true;
    };

    this.isMoving = () => isMoving;

    function getEmptySvgSquare() {
        if ( ! emptySquare) {
            emptySquare = SVG('empty-square');
        }

        return emptySquare;
    }

    // Calculates new coordinates for the square from the given direction of movement
    function getMoveCoordsFromDirection(empty, direction) {
        let coords = empty.tbox();

        switch (direction) {
            case constants.direction.LEFT:
                return {
                    x: coords.x + size,
                    y: coords.y
                };

            case constants.direction.RIGHT:
                return {
                    x: coords.x - size,
                    y: coords.y
                };

            case constants.direction.UP:
                return {
                    x: coords.x,
                    y: coords.y + size
                };

            case constants.direction.DOWN:
                return {
                    x: coords.x,
                    y: coords.y - size
                };
        }
    }

    // Returns a square by the given coordinates
    function getSquareByCoords(coords) {
        return squares.find((square) => {
            let box = square.tbox();

            return box.x == coords.x && box.y == coords.y;
        });
    }

    // Exchange indices of the currently moving square (target) and the empty square
    function reindexSquares(target) {
        let targetIndex = squares.indexOf(target),
            empty = squares.find((square) => square.data('index') == 16),
            emptyIndex = squares.indexOf(empty);

        squares[targetIndex] = empty;
        squares[emptyIndex] = target;
    }

    this.getPositions = () => {
        return squares.map((square) => {
            return square.data('index');
        });
    };
};