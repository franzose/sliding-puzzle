export default {
    rectangle: '<rect id="square" rx="4" ry="4" width="50" height="50"></rect>',
    square: '<svg width="50" height="50"><use fill="#ffd121" href="#square"></use><text x="50%" y="50%" stroke="none" alignment-baseline="middle" text-anchor="middle">{{idx}}</text></svg>',
    empty: '<svg id="empty-square" width="50" height="50"><use fill="#272727" stroke="#ffd121" stroke-width="2" href="#square"></use></svg>'
};