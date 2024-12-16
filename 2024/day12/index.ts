class Node {
    sides: number = 0;
    sideLocations: ('left' | 'right' | 'up' | 'down')[] = [];
    constructor(public x: number, public y: number) {

    }

    calculate(id: string) {
        if (this.x === 0 || id !== Region.Garden[this.y][this.x - 1].id) {
            this.sides++;
            this.sideLocations.push('left');
        }
        if (this.y === 0 || id !== Region.Garden[this.y - 1][this.x].id) {
            this.sides++;
            this.sideLocations.push('up');
        }
        if (this.x === Region.max.x || id !== Region.Garden[this.y][this.x + 1].id) {
            this.sides++;
            this.sideLocations.push('right');
        }
        if (this.y === Region.max.y || id !== Region.Garden[this.y + 1][this.x].id) {
            this.sides++;
            this.sideLocations.push('down');
        }
        return this.sides;
    }
}

class Region {
    static Garden: Region[][] = [];
    static get max() { return { y: Region.Garden.length - 1, x: Region.Garden[0].length - 1 }; }

    private nodeMap: { [key: string]: Node } = {};
    private node: Node[] = [];
    private _id: string;
    get id() { return this._id; }
    private _area: number = 0;
    private _perimeter: number = 0;
    private _sides: number = 0;
    get area() { return this._area; }
    get perimeter() { return this._perimeter; }
    get sides() { return this._sides; }

    constructor(id: string, x: number, y: number) {
        this._id = id;
        const start = new Node(x, y);
        this.node.push(start);
        this.nodeMap[`${x},${y}`] = start;
    }

    combine(region: Region) {
        region.node.forEach(node => {
            this.node.push(node);
            Region.Garden[node.y][node.x] = this;
            this.nodeMap[`${node.x},${node.y}`] = node;
        });
    }

    calculate() {
        if (this.area) {
            return 0;
        }

        this._area = this.node.length;

        this.node.forEach(node => {
            this._perimeter += node.calculate(this.id);
            this._sides += node.sides;
            node.sideLocations.forEach(side => {
                switch (side) {
                    case 'left':
                    case 'right':
                        if (this.nodeMap[`${node.x},${node.y - 1}`]?.sideLocations.includes(side)) {
                            this._sides--;
                        }
                        if (this.nodeMap[`${node.x},${node.y + 1}`]?.sideLocations.includes(side)) {
                            this._sides--;
                        }
                        break;
                    case 'up':
                    case 'down':
                        if (this.nodeMap[`${node.x - 1},${node.y}`]?.sideLocations.includes(side)) {
                            this._sides--;
                        }
                        if (this.nodeMap[`${node.x + 1},${node.y}`]?.sideLocations.includes(side)) {
                            this._sides--;
                        }
                        break;
                }
            });
        });

        console.log(this.id, this._area, this.sides, this._area * this.sides);
        return this._area * this.sides;
    }
}

export default function main(input: string) {
    Region.Garden = input.split('\r\n').map((row, y) => row.split('').map((cell, x) => new Region(cell, x, y)));
    for (let y = 0; y < Region.Garden.length; y++) {
        for (let x = 0; x < Region.Garden[y].length; x++) {
            if (y + 1 < Region.Garden.length && Region.Garden[y][x] !== Region.Garden[y + 1][x] && Region.Garden[y][x].id === Region.Garden[y + 1][x].id) {
                Region.Garden[y][x].combine(Region.Garden[y + 1][x]);
            }
            if (x + 1 < Region.Garden[y].length && Region.Garden[y][x] !== Region.Garden[y][x + 1] && Region.Garden[y][x].id === Region.Garden[y][x + 1].id) {
                Region.Garden[y][x].combine(Region.Garden[y][x + 1]);
            }
        }
    }
    return Region.Garden.flat().reduce((acc, region) => acc + region.calculate(), 0);
}