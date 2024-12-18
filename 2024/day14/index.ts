// const map = { x: 11, y: 7 };
const map = { x: 101, y: 103 };

class Robot {
    private locations: { [key: number]: { x: number, y: number } };
    private velocity: { x: number, y: number };

    constructor(location: { x: number, y: number }, velocity: { x: number, y: number }) {
        this.locations = { 0: location };
        this.velocity = velocity;
    }

    getAtTime(time: number) {
        if (!this.locations[time]) {
            const changeX = this.velocity.x * time;
            const changeY = this.velocity.y * time;

            this.locations[time] = {
                x: this.locations[0].x + changeX,
                y: this.locations[0].y + changeY
            };
            if (this.locations[time].x < 0) {
                this.locations[time].x %= map.x;
                this.locations[time].x += map.x;
            }

            if (this.locations[time].x == map.x) {
                this.locations[time].x = 0;
            } else if (this.locations[time].x >= map.x) {
                this.locations[time].x %= map.x;
            }

            if (this.locations[time].y < 0) {
                this.locations[time].y %= map.y;
                this.locations[time].y += map.y;
            }

            if (this.locations[time].y == map.y) {
                this.locations[time].y = 0;
            } else if (this.locations[time].y > map.y) {
                this.locations[time].y %= map.y;
            }
        }

        return this.locations[time];
    }
}

function mapLocations(robots: Robot[], time: number) {
    const locations: { [key: string]: number } = {};
    robots.forEach((robot) => {
        const location = robot.getAtTime(time);
        if (locations[`${location.x},${location.y}`])
            locations[`${location.x},${location.y}`]++
        else
            locations[`${location.x},${location.y}`] = 1
    });

    Deno.writeTextFileSync(outputFileName, `----------------- ${time} ------------------------------\n`, { append: true });

    let mapOutput = '';

    for (let y = 0; y < map.y; y++) {
        for (let x = 0; x < map.x; x++) {
            mapOutput += locations[`${x},${y}`] ? locations[`${x},${y}`] : '.';
        }
        mapOutput += '\n';
    }

    Deno.writeTextFileSync(outputFileName, mapOutput, { append: true });

    return locations;
}

const outputFileName = './2024/day14/output.txt';

export default function main(input: string) {
    const time = 10000;
    const robots = input.split('\r\n').map((line) => {
        const [x, y, vx, vy] = line.matchAll(/-?\d+/g).map(x => parseInt(x[0]));
        return new Robot({ x, y }, { x: vx, y: vy });
    });
    Deno.writeTextFileSync(outputFileName, ``, { create: true });

    for (let i = 0; i < time; i++) {
        if (getSafetyFactor(robots, i) < 230436441 / 2) {
            mapLocations(robots, i);
        }
    }

    return getSafetyFactor(robots, 100);
}

function getSafetyFactor(robots: Robot[], time: number) {
    const quads = [0, 0, 0, 0];
    robots.forEach((robot) => {
        const location = robot.getAtTime(time);
        const border = { x: Math.floor(map.x / 2), y: Math.floor(map.y / 2) };
        if (location.x < border.x && location.y < border.y) quads[0]++;
        else if (location.x > border.x && location.y < border.y) quads[1]++;
        else if (location.x < border.x && location.y > border.y) quads[2]++;
        else if (location.x > border.x && location.y > border.y) quads[3]++;
    });

    return quads.reduce((acc, val) => acc * val, 1);
}