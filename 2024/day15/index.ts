type Map = ('#' | '.' | 'O' | '[' | ']')[][];

export default function (input: string) {
    const [mapInput, instructionInput] = input.split('\r\n\r\n');
    const { map, robot } = getMap(mapInput);
    const { map: map2, robot: robot2 } = getMap(mapInput, true);
    const instructions = instructionInput.split(/\s/g).filter(x => x.length).map(instruction => instruction.split('')).flat() as ('^' | '>' | 'v' | '<')[];
    // printMap(map, robot);
    printMap(map2, robot2);
    for (const instruction of instructions) {
        // console.log(instruction, robot);
        moveRobot(map, robot, instruction);
        moveRobot(map2, robot2, instruction);
        // printMap(map, robot);
        // printMap(map2, robot2);
    }

    const single = calculate(map);
    const double = calculate(map2);

    return { single, double };
}

function calculate(map:Map){
    return map.map((r, y) => r.map((c, x) => c === 'O' || c === '[' ? y * 100 + x : 0)).flat().reduce((a, b) => a + b);
}

function moveRobot(map: Map, robot: { x: number, y: number }, direction: ('^' | '>' | 'v' | '<')) {
    const { x, y } = robot;
    switch (direction) {
        case '^':
            robot.y--;
            break;
        case '>':
            robot.x++;
            break;
        case 'v':
            robot.y++;
            break;
        case '<':
            robot.x--;
            break;
    }
    if (map[robot.y][robot.x] === '.') {
        return true;
    } else if ((map[robot.y][robot.x] === 'O' || map[robot.y][robot.x] === '[' || map[robot.y][robot.x] === ']') && moveBox(map, { x: robot.x, y: robot.y }, direction)) {
        return true;
    }
    robot.x = x;
    robot.y = y;
    return false;
}

function canMoveBox(map: Map, box: { x: number, y: number }, direction: ('^' | '>' | 'v' | '<'), firstSide = true) {
    const { x, y } = box;

    if (firstSide && (direction == 'v' || direction == '^')) {
        const side = map[y][x] === '[' ? 1 : map[y][x] === ']' ? -1 : 0;
        if (side) {
            if (!canMoveBox(map, { x: x + side, y: y }, direction, false)) {
                return false;
            }
        }
    }

    switch (direction) {
        case '^':
            box.y--;
            break;
        case '>':
            box.x++;
            break;
        case 'v':
            box.y++;
            break;
        case '<':
            box.x--;
            break;
    }
    if (map[box.y][box.x] === '#') {
        return false;
    } else if ((map[box.y][box.x] === 'O' || map[box.y][box.x] === '[' || map[box.y][box.x] === ']') && !canMoveBox(map, { x: box.x, y: box.y }, direction)) {
        return false;
    }

    return true;
}

function moveBox(map: Map, box: { x: number, y: number }, direction: ('^' | '>' | 'v' | '<'), firstSide = true, ) {
    const { x, y } = box;

    const side = map[y][x] === '[' ? 1 : map[y][x] === ']' ? -1 : 0;
    if (firstSide && side && (direction == 'v' || direction == '^')) {
        if (!canMoveBox(map, { x: x, y: y }, direction)) {
            return false;
        }
        moveBox(map, { x: box.x + side, y: box.y }, direction, false);
    }


    switch (direction) {
        case '^':
            box.y--;
            break;
        case '>':
            box.x++;
            break;
        case 'v':
            box.y++;
            break;
        case '<':
            box.x--;
            break;
    }
    if (map[box.y][box.x] === '#') {
        box.x = x;
        box.y = y;
        return false;
    } else if ((map[box.y][box.x] === 'O' || map[box.y][box.x] === '[' || map[box.y][box.x] === ']') && !moveBox(map, { x: box.x, y: box.y }, direction)) {
        box.x = x;
        box.y = y;
        return false;
    }

    map[box.y][box.x] = map[y][x];
    map[y][x] = '.';
    return true;
}

function printMap(map: ("#" | "." | "O" | "[" | "]" | "@")[][], robot: { x: number, y: number }) {
    map[robot.y][robot.x] = '@';
    console.log(map.map(row => row.join('')).join('\n'));
    map[robot.y][robot.x] = '.';
}

function getMap(mapInput: string, double = false) {

    if (double) {
        mapInput = mapInput
            .replaceAll('.', '..')
            .replaceAll('@', '@.')
            .replaceAll('O', '[]')
            .replaceAll('#', '##');
    }
    const map = mapInput.split('\r\n').map(row => row.split(''));
    const robot = getRobotLocation(map) as { x: number, y: number };
    return { map: map as Map, robot };
}

function getRobotLocation(map: string[][]) {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === '@') {
                map[y][x] = '.';
                return { x, y };
            }
        }
    }
    return null;
}