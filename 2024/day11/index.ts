const blinks = 75;

class Something {
    private blinks: number[] = [];
    private outputs: string[] = [];
    private histories: { [key: number]: number } = { 0: 1 };
    children: Something[] = [];

    private _value: number;

    get value() { return this._value; }

    constructor(input: number) {

        const stone = input.toString();
        this._value = input;

        if (stone.length > 1 && stone.length % 2 == 0) {
            const num1 = parseInt(stone.substring(0, stone.length / 2));
            const num2 = parseInt(stone.substring(stone.length / 2));
            this.outputs = [[num1, num2].join(' ')];
        } else if (this._value === 0) {
            this.outputs = ['1'];
        } else {
            this.outputs = [(this._value * 2024).toString()];
        }
    }

    calculateAll() {
        return this.blinks.map(x => this.calculate(x));
    }

    calculate(blinkIndex: number) {

        if (this.histories[blinks - blinkIndex] === undefined) {
            this.histories[blinks - blinkIndex] = this.children.map(x => x.calculate(blinkIndex + 1)).reduce((a, b) => a + b, 0);
        }

        return this.histories[blinks - blinkIndex];
    }

    initChildren(blinkIndex: number) {
        const newChildren = [];
        for (const childValue of this.outputs[0].split(' ').map(x => parseInt(x))) {
            if (history[childValue] === undefined) {
                history[childValue] = new Something(childValue);
                newChildren.push(history[childValue]);
            } else {
                history[childValue].addBlink(blinkIndex);
            }

            this.children.push(history[childValue]);
        }

        return newChildren;
    }

    addBlink(blinkIndex: number) {
        this.blinks.push(blinkIndex);
    }

    getChildren(blinkIndex: number) {
        if (this.children.length === 0) {
            return this.initChildren(blinkIndex);
        }
        this.children.forEach(x => x.addBlink)
        return [];
    }

    get output() { return this.outputs[0]; }

}

const history: { [key: number]: Something } = {};

export default function main(input: string) {

    let tree = input.split(' ').map(x => new Something(parseInt(x)));

    for (let i = 1; i <= blinks; i++) {
        tree = tree.map(x => x.getChildren(i)).flat();
    }

    // return history[0].calculate(blinks - 10);

    return Object.values(history).map(x => x.calculateAll()).flat().reduce((a, b) => a + b, tree.length);
}