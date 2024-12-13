import { readInput } from "../main.ts";
const day = 4;

Deno.test("AOC4", async () => {
    const result = await main();
    console.log(result);
    // assertEquals(result.noDo, 173785482);
    // assertEquals(result.filteredDisabled, 83158140);
});

export default async function main() {
    const input = await readInput(day);
    const wordSearch = input.split("\n").map((line) => line.split(""));
    const found = search(wordSearch, "XMAS");

    return { found };
}


function search(wordSearch: string[][], word: string) {
    let found = 0;
    for (let i = 0; i < wordSearch.length; i++) {
        for (let j = 0; j < wordSearch[i].length; j++) {
            if (wordSearch[i][j] === word[0]) {
                found += searchWord(wordSearch, word, i, j);
            }
        }
    }
    return found;
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

function move(x: number, y: number, dir: Direction) {
    switch (dir) {
        case Direction.right:
            x++;
            break;
        case Direction.left:
            x--;
            break;
        case Direction.up:
            y--;
            break;
        case Direction.down:
            y++;
            break;
        case Direction.rightUp:
            x++;
            y--;
            break;
        case Direction.rightDown:
            x++;
            y++;
            break;
        case Direction.leftUp:
            x--;
            y--;
            break;
        case Direction.leftDown:
            x--;
            y++;
            break;
    }

    // if (x < 0) {
    //     y--;
    //     x = wordSearch.length - 1;
    // }

    // if (x >= wordSearch.length) {
    //     y++;
    //     x = 0;
    // }

    // if (y < 0) {
    //     x--;
    //     y = wordSearch[0]?.length - 1;
    // }

    // if (y >= wordSearch[0].length) {
    //     x++;
    //     y = 0;
    // }

    return [x, y];
}

function checkDir(wordSearch: string[][], i: number, j: number, searchTerm: string, dir: Direction) {
    let word = '';

    while (i >= 0 && i < wordSearch.length && j >= 0 && j < wordSearch[i].length && word.length < searchTerm.length && word[word.length - 1] == searchTerm[word.length - 1]) {
        word += wordSearch[i][j];
        [j, i] = move(j, i, dir);
    }
    return word === searchTerm;
}

function searchWord(wordSearch: string[][], word: string, i: number, j: number) {
    //iterate through all directions
    let found = 0;

    if (checkDir(wordSearch, i, j, word, Direction.right)) { found++; console.log('right', i, j); }
    if (checkDir(wordSearch, i, j, word, Direction.left)) { found++; console.log('left', i, j); }
    if (checkDir(wordSearch, i, j, word, Direction.up)) { found++; console.log('up', i, j); }
    if (checkDir(wordSearch, i, j, word, Direction.down)) { found++; console.log('down', i, j); }
    if (checkDir(wordSearch, i, j, word, Direction.rightUp)) { found++; console.log('rightUp', i, j); }
    if (checkDir(wordSearch, i, j, word, Direction.rightDown)) { found++; console.log('rightDown', i, j); }
    if (checkDir(wordSearch, i, j, word, Direction.leftUp)) { found++; console.log('leftUp', i, j); }
    if (checkDir(wordSearch, i, j, word, Direction.leftDown)) { found++; console.log('leftDown', i, j); }

    return found;
}

function searchX(wordSearch: string[][], word: string, i: number, j: number) {
    
    const halfLength = word.length / 2;
    const middle = word[halfLength];

    if (wordSearch[i][j] !== middle || i == 0 || j == 0 || i == wordSearch.length - 1 || j == wordSearch[i].length - 1) {
        return false;
    }

    const result = ['', '', '', ''];
    for (let k = 0; k < word.length / 2; k++) {
        result[0] += wordSearch[i][j + k];
    }

    return found === word.length;
}