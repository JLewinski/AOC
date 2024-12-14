interface Point {
    x: number;
    y: number;
    hasAntinode: boolean;
    frequency?: string;
}

export default function main(input: string) {
    const map = input.split('\r\n').map((line, i) => line.split('').map((x, j) => {
        return { x: j, y: i, hasAntinode: false, frequency: x !== '.' ? x : undefined };
    }));

    const flattened = map.flat().filter(x => x.frequency !== undefined);
    const maxX = map[0].length;
    const maxY = map.length;
    console.log(maxX, maxY);

    const distinctFrequencies = new Set<string>();
    flattened.forEach(x => distinctFrequencies.add(x.frequency!));
    distinctFrequencies.forEach(frequency => {
        let points = flattened.filter(x => x.frequency === frequency);
        const antiPoints = points.map((a, i) => {
            return points.filter((_, j) => i !== j).map(b => {
                const pt = calculateA(a, b);
                return pt;
            });
        }).flat().filter(pt => pt.x >= 0 && pt.y >= 0 && pt.x < maxX && pt.y < maxY);
        antiPoints.forEach(pt => {
            map[pt.y][pt.x].hasAntinode = true;
        });
    });

    console.log(map.map(x => x.map(y => y.frequency ?? (y.hasAntinode ? '#' : '.')).join('')).join('\n'));

    const antinodes = map.flat().filter(x => x.hasAntinode);
    return antinodes.length;
}

function calculateA(a: Point, b: Point) {
    const pt = { x: a.x - b.x, y: a.y - b.y };
    pt.x = a.x + pt.x;
    pt.y = a.y + pt.y;
    console.log('after', pt);
    return pt;
}