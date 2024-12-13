export default function main(input: string) {
    const wordSearch = input.split("\n").map((line) => line.split(""));
    return search(wordSearch, "XMAS", "MAS");
}


function search(wordSearch: string[][], word: string, wordX: string) {
    let found = 0;
    let foundX = 0;
    for (let i = 0; i < wordSearch.length; i++) {
        for (let j = 0; j < wordSearch[i].length; j++) {
            found += searchWord(wordSearch, word, i, j);
            foundX += searchX(wordSearch, wordX, i, j) ? 1 : 0;
        }
    }
    return {found, foundX};
}

enum Direction {
    right,
    left,
    up,
    down,
    rightUp,
    rightDown,
    leftUp,
    leftDown
}

function move(x: number, y: number, dir: Direction, num = 1) {
    switch (dir) {
        case Direction.right:
            x += num;
            break;
        case Direction.left:
            x -= num;
            break;
        case Direction.up:
            y -= num;
            break;
        case Direction.down:
            y += num;
            break;
        case Direction.rightUp:
            x += num;
            y -= num;
            break;
        case Direction.rightDown:
            x += num;
            y += num;
            break;
        case Direction.leftUp:
            x -= num;
            y -= num;
            break;
        case Direction.leftDown:
            x -= num;
            y += num;
            break;
    }

    return [x, y];
}

function checkDir(wordSearch: string[][], i: number, j: number, searchTerm: string, dir: Direction) {
    let word = '';

    while (i >= 0 && i < wordSearch.length && j >= 0 && j < wordSearch[i].length && word.length < searchTerm.length) {
        word += wordSearch[i][j];
        [j, i] = move(j, i, dir);
    }
    return word;
}

function searchWord(wordSearch: string[][], word: string, i: number, j: number) {
    //iterate through all directions
    let found = 0;

    if (word == checkDir(wordSearch, i, j, word, Direction.right)) { found++; }
    if (word == checkDir(wordSearch, i, j, word, Direction.left)) { found++; }
    if (word == checkDir(wordSearch, i, j, word, Direction.up)) { found++; }
    if (word == checkDir(wordSearch, i, j, word, Direction.down)) { found++; }
    if (word == checkDir(wordSearch, i, j, word, Direction.rightUp)) { found++; }
    if (word == checkDir(wordSearch, i, j, word, Direction.rightDown)) { found++; }
    if (word == checkDir(wordSearch, i, j, word, Direction.leftUp)) { found++; }
    if (word == checkDir(wordSearch, i, j, word, Direction.leftDown)) { found++; }

    return found;
}

function searchX(wordSearch: string[][], word: string, i: number, j: number) {

    const halfLength = parseInt((word.length / 2).toFixed(0)) - 1;
    const middle = word[halfLength];

    if (wordSearch[i][j] !== middle) {
        return false;
    }

    
    let [x, y] = move(j, i, Direction.leftUp, halfLength);
    const diag1 = checkDir(wordSearch, y, x, word, Direction.rightDown);
    [x, y] = move(j, i, Direction.rightUp, halfLength);
    const diag2 = checkDir(wordSearch, y, x, word, Direction.leftDown);

    return (diag1 == word || diag1.split('').reverse().join('') == word) && (diag2 == word || diag2.split('').reverse().join('') == word);
}