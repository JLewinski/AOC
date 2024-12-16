interface Location {
    x: number;
    y: number;
    val: number;
}

export default function main(input: string) {
    const map = input.split('\r\n').map(row => row.split('').map(x => parseInt(x)));
    const trailHeads = input.replaceAll('\r\n', '').matchAll(/0/g).map(x => ({
        x: Math.floor(x.index / map.length),
        y: x.index % map.length,
        val: 0
    })).toArray();

    const scores = trailHeads.map(loc => getRoute(map, loc)).flat();
    const inDistinctScores = trailHeads.map(loc => getRoute(map, loc, true)).flat();
    return {scores: scores.reduce((acc, val) => acc + val, 0), all: inDistinctScores.reduce((acc, val) => acc + val, 0)};
}

function getRoute(map: number[][], location: Location, isDistinct = false) {

    let options = getOptions(map, location);
    for (let i = 1; i < 9; i++){
        const temp = new Set<string>();
        options = options.map(loc => getOptions(map, loc)).flat().filter(x => {
            if (!temp.has(`${x.x},${x.y}`)) {
                temp.add(`${x.x},${x.y}`);
                return true;
            }
            return isDistinct || false;
        });
    }

    return options.length;
}

function getOptions(map: number[][], location: Location) {
    const options: Location[] = [];

    if (location.x > 0 && map[location.x - 1][location.y] == location.val + 1) {
        options.push({ x: location.x - 1, y: location.y, val: map[location.x - 1][location.y] });
    }
    if (location.x < map.length - 1 && map[location.x + 1][location.y] == location.val + 1) {
        options.push({ x: location.x + 1, y: location.y, val: map[location.x + 1][location.y] });
    }
    if (location.y > 0 && map[location.x][location.y - 1] == location.val + 1) {
        options.push({ x: location.x, y: location.y - 1, val: map[location.x][location.y - 1] });
    }
    if (location.y < map[0].length - 1 && map[location.x][location.y + 1] == location.val + 1) {
        options.push({ x: location.x, y: location.y + 1, val: map[location.x][location.y + 1] });
    }

    return options;
}