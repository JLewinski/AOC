const movementCosts = { a: 3, b: 1 };

interface XY { x: number, y: number };
class Machine {
    private a: XY;
    private b: XY;
    private prize: XY;

    constructor(a: XY, b: XY, prize: XY, pt2 = false) {
        this.a = a;
        this.b = b;
        this.prize = prize;
        if (pt2) {
            this.prize.x += 10000000000000;
            this.prize.y += 10000000000000;
        }
    }

    calculateMinCost(pt2 = false) {

        const prizeY = pt2 ? this.prize.y + 10000000000000 : this.prize.y;
        const prizeX = pt2 ? this.prize.x + 10000000000000 : this.prize.x;

        const numberB = (this.a.x * prizeY - this.a.y * prizeX) / (this.a.x * this.b.y - this.a.y * this.b.x);
        const remainderB = (this.a.x * prizeY - this.a.y * prizeX) % (this.a.x * this.b.y - this.a.y * this.b.x);
        const numberA = (prizeX - numberB * this.b.x) / this.a.x;
        const remainderA = (prizeX - numberB * this.b.x) % this.a.x;

        if (remainderA || remainderB || numberA < 0 || numberB < 0) {
            return undefined;
        }

        return numberA * movementCosts.a + numberB * movementCosts.b;
    }
}

export default async function main(input: string) {
    const totalTokens = { pt1: 0, pt2: 0 };
    const results = parseInput(input);
    for (const costPromise of results) {
        const cost = await costPromise;

        totalTokens.pt1 += cost.pt1 ?? 0;
        totalTokens.pt2 += cost.pt2 ?? 0;
    };

    return totalTokens;
}

function parseInput(input: string) {
    return input.split('\r\n\r\n').map(async group => {
        const [a, b, prize] = group.split('\r\n').map(parseXY);
        const machine = new Machine(a, b, prize);
        return { pt1: machine.calculateMinCost(), pt2: machine.calculateMinCost(true) };
    });
}

function parseXY(input: string) {
    const [x, y] = input.matchAll(/\d+/g).map(val => parseInt(val[0])).toArray();
    return { x, y };
}