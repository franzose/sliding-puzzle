export default function() {
    let timer,
        seconds = 0;

    this.start = (each) => {
        seconds = 0;

        count(each);
    };

    this.stop = (after) => {
        clearTimeout(timer);

        if (typeof after === 'function') {
            after(seconds);
        }
    };

    function count(each) {
        timer = setTimeout(() => count(each), 1000);

        seconds++;

        if (typeof each === 'function') {
            each(seconds);
        }
    }
};