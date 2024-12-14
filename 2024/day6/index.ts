let map: string[][];
let obstructions = new Set<string>();
let tested = new Set<string>();
let originalGuardPosition: Point;

//1332, 1553

interface Point {
    x: number;
    y: number;
    direction?: Direction;
}

enum Direction {
    North, East, South, West
}

export default function main(input: string) {
    const length = input.indexOf('\r\n');
    const guardPosition = input.replaceAll('\r\n', '').indexOf('^');
    map = input.split('\r\n').map(x => x.split(''));
    originalGuardPosition = { x: guardPosition % length, y: Math.floor(guardPosition / length), direction: Direction.North };
    obstructions.add(`${originalGuardPosition.x},${originalGuardPosition.y}`);
    const firstResult = RunMap(originalGuardPosition);

    const distinctSteps = firstResult.steps.size;

    for (const step of firstResult.steps.points) {
        const original = getChar(step);
        if (original === '#') {
            continue;
        }
        setChar(step, '#');
        const result = RunMap(originalGuardPosition);
        if (result.isLoop) {
            obstructions.add(`${step.x},${step.y}`);
        }
        setChar(step, original);
    }

    return { distinctSteps, possibleObstructions: obstructions.size - 1 };
}

class StepsCounter {
    set = new Set<string>();
    add(point: Point) {
        this.set.add(`${point.x},${point.y}`);
    }
    has(point: Point) {
        return this.set.has(`${point.x},${point.y}`);
    }
    get size() {
        return this.set.size;
    }
    get points() {
        return Array.from(this.set).map(x => x.split(',').map(x => parseInt(x))).map(x => ({ x: x[0], y: x[1] }));
    }
}

class LoopCheck {
    set = new Set<string>();
    add(point: Point) {
        this.set.add(`${point.x},${point.y},${point.direction}`);
    }
    has(point: Point) {
        return this.set.has(`${point.x},${point.y},${point.direction}`);
    }
}

function RunMap(point: Point, print = false) {
    if (print) {
        console.log('start', point, originalGuardPosition);
    }
    const steps = new StepsCounter;
    const loopCheck = new LoopCheck;
    while (!isDone(point) && !loopCheck.has(point)) {
        steps.add(point);
        loopCheck.add(point);
        if (print) {
            console.log(point);
        }

        point = move(point);

    }

    steps.add(point);

    return { isLoop: loopCheck.has(point), steps };
}

function isDone(point: Point) {
    const { x, y } = point;
    return x == 0 || y == 0 || x == map[0].length - 1 || y == map.length - 1;
}

function turnRight(direction: Direction) {
    return (direction + 1) % 4;
}

function move(point: Point) {
    const other = { ...point };
    while (checkNextPosition(other) === '#') {
        other.direction = turnRight(other.direction ?? Direction.North);
    }

    return getNextPosition(other);
}

function checkNextPosition(point: Point) {
    try {
        const next = getNextPosition(point);
        return getChar(next);
    } catch {
        return '#';
    }
}

function getNextPosition(point: Point) {
    const { x, y } = point;
    switch (point.direction) {
        case Direction.North:
            return { x, y: y - 1, direction: point.direction };
        case Direction.East:
            return { x: x + 1, y, direction: point.direction };
        case Direction.South:
            return { x, y: y + 1, direction: point.direction };
        case Direction.West:
            return { x: x - 1, y, direction: point.direction };
        case undefined:
            return { x, y, direction: point.direction };
    }
}

function getChar(point: Point) {
    const { x, y } = point;
    try { return map[y][x]; } catch { return '#'; }
}

function setChar(point: Point, char: string) {
    const { x, y } = point;
    map[y][x] = char;
}