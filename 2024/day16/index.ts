import { Queue } from 'jsr:@cm-iv/queue';

function getLeft(dir: Direction): Direction {
    return (dir + 3) % 4;
}

function getRight(dir: Direction): Direction {
    return (dir + 1) % 4;
}

enum Direction {
    NORTH = 0,
    EAST = 1,
    SOUTH = 2,
    WEST = 3
}

class PathNode {
    location: LocationNode;
    direction: Direction;
    get score() { return this._score; }
    private _score: number;
    previous: PathNode[] = [];
    next: PathNode[] = [];

    constructor(location: LocationNode, direction: Direction, score: number, previous?: PathNode) {
        this.location = location;
        this.direction = direction;
        this._score = score;
        if (previous) {
            this.previous.push(previous);
            previous.next.push(this);
        }
    }

    updateScore(score: number, previous?: PathNode) {
        if (!previous) {
            this._score -= score;
            this.next.forEach(x => x.updateScore(score));
        } else {
            this.previous.forEach(x => x.deleteBranch(this));
            const difference = this._score - score;
            if (difference == 0) {
                this.previous.push(previous);
                previous.next.push(this);
            } else {
                this.previous = [previous];
                previous.next.push(this);
                this._score -= difference;
                this.next.forEach(x => x.updateScore(difference));
            }
        }
    }

    get key() {
        return `${this.location.x},${this.location.y},${this.direction}`;
    }

    getAllUnique(): Set<LocationNode> {
        return new Set(this.getAll());
    }

    getAll(): LocationNode[] {
        return [this.location, ...this.previous.map(x => x.getAll()).flat()];
    }

    deleteBranch(next?: PathNode) {
        this.next = this.next.filter(x => x !== next);
        if (this.next.length == 0) {
            this.previous.forEach(x => x.deleteBranch(this));
        }
    }
}

class LocationNode {
    x: number;
    y: number;
    map: Map;
    _neighbors: Record<Direction | number, LocationNode> | undefined;
    get key() {
        return `${this.x},${this.y}`;
    }

    constructor(x: number, y: number, map: Map) {
        this.x = x;
        this.y = y;
        this.map = map;
    }

    getLeft(dir: Direction) {
        return this.neighbors[(dir + 3) % 4];
    }

    getRight(dir: Direction) {
        return this.neighbors[(dir + 1) % 4];
    }

    getForward(dir: Direction) {
        return this.neighbors[dir];
    }

    getNext(dir: Direction) {
        return this.neighbors[dir];
    }

    get neighbors() {
        if (!this._neighbors) {
            this._neighbors = {
                0: this.map.getLocation(this.x, this.y - 1),
                1: this.map.getLocation(this.x + 1, this.y),
                2: this.map.getLocation(this.x, this.y + 1),
                3: this.map.getLocation(this.x - 1, this.y)
            };
        }

        return this._neighbors;
    }
}

class Map {
    locations: Record<string, LocationNode> = {};
    startNode!: LocationNode;
    endNode!: LocationNode;
    _locationArray: LocationNode[] = [];
    private initialMap: string[][];

    getLocation(x: number, y: number) {
        return this.locations[`${x},${y}`];
    }

    constructor(input: string) {
        const map = input.split(/\s+/g).map(row => row.split(''));
        this.initialMap = map;
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                if (map[y][x] === '#') continue;
                const node = new LocationNode(x, y, this);
                this.locations[`${x},${y}`] = node;
                this._locationArray.push(node);
                if (map[y][x] === 'S') {
                    this.startNode = node;
                } else if (map[y][x] === 'E') {
                    this.endNode = node;
                }
            }
        }
    }

    private replaceNode(map:string[][], node: PathNode) {
        switch(node.direction){
            case Direction.NORTH:
                map[node.location.y][node.location.x] = '^';
                break;
            case Direction.EAST:
                map[node.location.y][node.location.x] = '>';
                break;
            case Direction.SOUTH:
                map[node.location.y][node.location.x] = 'v';
                break;
            case Direction.WEST:
                map[node.location.y][node.location.x] = '<';
                break;
        }
        node.previous.forEach(x => this.replaceNode(map, x));
    }

    print(node: PathNode) {
        const map = this.initialMap.map(x => x.slice());
        this.replaceNode(map, node);
        console.log(map.map(x => x.join('')).join('\n'));
    }
}

class PathFinder {
    map: Map;
    visited: Record<string, PathNode> = {};
    queue = new Queue<PathNode>();
    score: number | undefined;
    history: string[] | undefined;

    constructor(map: Map) {
        this.map = map;
    }

    private getAllVisited(location?: LocationNode) {
        if (location === undefined) return [];
        return [
            { score: this.getVisited(location, Direction.NORTH), dir: Direction.NORTH },
            { score: this.getVisited(location, Direction.EAST), dir: Direction.EAST },
            { score: this.getVisited(location, Direction.SOUTH), dir: Direction.SOUTH },
            { score: this.getVisited(location, Direction.WEST), dir: Direction.WEST }
        ].filter(x => x.score !== undefined).sort((a, b) => a.score.score - b.score.score);
    }

    private getVisited(location: LocationNode, dir: Direction) {
        return this.visited[`${location.x},${location.y},${dir}`];
    }

    private setVisited(location: LocationNode, dir: Direction, score: number, previous?: PathNode) {
        if (!location) return;
        const savedScore = this.getVisited(location, dir);
        if (savedScore === undefined) {
            this.visited[`${location.x},${location.y},${dir}`] = new PathNode(location, dir, score, previous);
            return this.visited[`${location.x},${location.y},${dir}`];
        } else if (savedScore.score >= score) {
            savedScore.updateScore(score, previous);
        }
    }

    enqueue(location: LocationNode, dir: Direction, score: number, previous?: PathNode) {
        const path = this.setVisited(location, dir, score, previous);
        if (path && location !== this.map.endNode) {
            this.queue.enqueue(path);
        }
    }

    findPath() {
        if (this.score !== undefined && this.history) {
            return { score: this.score, history: this.history.length };
        }

        this.enqueue(this.map.startNode, Direction.EAST, 0);
        this.enqueue(this.map.startNode, Direction.NORTH, 1000);
        this.enqueue(this.map.startNode, Direction.SOUTH, 1000);
        this.enqueue(this.map.startNode, Direction.WEST, 2000);

        while (!this.queue.isEmpty()) {
            const initial = this.queue.dequeue() as PathNode;
            const dir = initial.direction;
            const leftDir = getLeft(dir);
            const rightDir = getRight(dir);
            let location = initial.location;
            if (initial.score !== this.getVisited(location, dir).score) {
                continue;
            }
            let current: PathNode | undefined = initial;
            location = location.getNext(dir);
            let nextScore = initial.score + 1;
            while (current && location) {
                if (location.getNext(leftDir)) {
                    this.enqueue(location, leftDir, nextScore + 1000, current);
                }
                if (location.getNext(rightDir)) {
                    this.enqueue(location, rightDir, nextScore + 1000, current);
                }
                current = this.setVisited(location, dir, nextScore, current);
                location = location.getNext(dir);
                nextScore++;
            }
        }

        const final = this.getAllVisited(this.map.endNode);
        if (final.length) {
            // console.log(this.visited);
            // console.log(final);

            this.score = final[0].score.score;
            this.history = final[0].score.getAllUnique().values().toArray().map(x => x.key);
            const set = new Set(this.history);

            return { score: this.score, history: set.size };
        } else {
            console.error('No path found');
            return -1;
        }
    }
}

export default function main(input: string) {
    const map = new Map(input);
    const pathFinder = new PathFinder(map);
    return pathFinder.findPath();
}