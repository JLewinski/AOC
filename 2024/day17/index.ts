type Input = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type CommandArray = ReturnType<typeof parseCommands>;
const allInputs = [0, 1, 2, 3, 4, 5, 6, 7];

export default function (input: string) {
    const [regA, regB, regC, ...commands] = input.matchAll(/(\d+)/g).map(x => parseInt(x[0]) as Input);
    const program = new Program(regA, regB, regC);
    program.run(0, commands);

    const parsedCommands = parseCommands(commands);
    const outputCommand = findCommands(parsedCommands, 5)[0].index;

    let possibleValues = [0];

    for (let i = 0; i < 8*8*8; i++){
        const tempProgram = new Program(i, 0, 0);
        tempProgram.run(0, commands);
        if (commands.join(',').endsWith(tempProgram.output.join(','))){
            console.log(i, tempProgram.output.join(','));
        }
    }

    for (let i = 0; i < commands.length; i++) {
        const expectedIndex = commands.length - i - 1;
        const expectedOutput = commands[expectedIndex];
        possibleValues = possibleValues.map(x => x * 8).map(x => allInputs.map(y => x + y)).flat().filter(initialA => {

            const tempProgram = new Program(initialA, 0, 0, commands);
            parsedCommands.forEach(command => {
                tempProgram.runCommand(command.command, command.input);
            });
            return tempProgram.output[0] === expectedOutput;
        });

        // possibleValues.map(x =>{
        //     const tempProgram2 = new Program(x, 0, 0, commands.slice(expectedIndex));
        //     tempProgram2.run(0, commands);
        //     console.log(x, tempProgram2.output.join(','));
        // })

    }

    possibleValues = possibleValues.sort()

    



    return { initial: program.output.join(','), lowest: possibleValues.sort()[0] };
}

function parseCommands(commands: number[]) {
    let commandParse = '';
    commands.forEach((command, index) => {
        if (index && index % 2 === 0) {
            commandParse += ',';
        }
        commandParse += command;
    });
    return commandParse.split(',').map(x => {
        const [command, input] = x.split('');

        return { command: parseInt(command) as Input, input: parseInt(input) as Input, inputType: getCombo(parseInt(input) as Input) };
    });
}

function getCombo(input: Input): 'literal' | 'regA' | 'regB' | 'regC' | 'invalid' {
    switch (input) {
        case 0:
        case 1:
        case 2:
        case 3:
            return 'literal';
        case 4:
            return 'regA';
        case 5:
            return 'regB';
        case 6:
            return 'regC';
        case 7:
            return 'invalid';
    }
}

function findCommands(commands: CommandArray, command: Input) {
    return commands
        .map((command, index) => ({
            command, index
        }))
        .filter(x => x.command.command === command);
}

class Program {

    regAValues: number[] = [];

    regA: number;
    regB: number;
    regC: number;
    instructionPtr: number = 0;
    input: Input[] = [];
    output: number[] = [];
    expectedOutput: number[] | undefined;

    constructor(a: number, b: number, c: number, expectedOutput?: number[]) {
        this.regA = a;
        this.regB = b;
        this.regC = c;
        this.expectedOutput = expectedOutput;
    }

    run(ptrVal: number, commands: Input[]) {
        this.instructionPtr = ptrVal;
        this.input = commands;
        while (this.instructionPtr < this.input.length) {
            this.runCommand(this.input[this.instructionPtr], this.input[this.instructionPtr + 1]);
        }
    }

    getCombo(input: Input): number {
        switch (input) {
            case 0:
            case 1:
            case 2:
            case 3:
                return input;
            case 4:
                return this.regA;
            case 5:
                return this.regB;
            case 6:
                return this.regC;
            case 7:
                throw Error("Invalid input");
        }
    }

    runCommand(command: Input, input: Input, reverse = false) {
        if (reverse) {

        }
        switch (command) {
            case 0: this.adv(input); break;
            case 1: this.bxl(input); break;
            case 2: this.bst(input); break;
            case 3: this.jnz(input); break;
            case 4: this.bxc(input); break;
            case 5: this.out(input); break;
            case 6: this.bdv(input); break;
            case 7: this.cdv(input); break;
        }
    }

    calcAdv(input: Input, reverse = false) {
        if (!reverse)
            return Math.floor(this.regA / Math.pow(2, this.getCombo(input)));

        return this.regA * Math.pow(2, this.getCombo(input));
    }

    adv(input: Input) {
        this.regA = this.calcAdv(input);
        this.instructionPtr += 2;
    }

    bxl(input: Input) {
        this.regB = this.regB ^ input;
        this.instructionPtr += 2;
    }

    bst(input: Input) {
        this.regB = this.getCombo(input) % 8;
        this.instructionPtr += 2;
    }

    jnz(input: Input) {
        this.regAValues.push(this.regA);
        if (this.regA === 0) { return this.instructionPtr += 2; }
        this.instructionPtr = input;
    }

    static toBits(a: number, b: number) {
        const astr = a.toString(2);
        const bstr = b.toString(2);
        let result = 0;
        for (let i = 0; i < astr.length || i < bstr.length; i++) {
            const aBit = astr[astr.length - i - 1] || '0';
            const bBit = bstr[bstr.length - i - 1] || '0';
            if (aBit !== bBit) {
                result += Math.pow(2, i);
            }
        }
        return result;
    }

    bxc(_: Input) {

        const val = this.regC ^ this.regB;
        if (val < 0) {
            this.regB = Program.toBits(this.regC, this.regB);
        } else {
            this.regB = val;
        }
        this.instructionPtr += 2;
    }

    out(input: Input) {
        const value = this.getCombo(input) % 8;
        if (this.expectedOutput && this.expectedOutput[this.output.length] !== value) {
            this.instructionPtr = this.input.length;
        }
        this.output.push(value);
        this.instructionPtr += 2;
    }

    bdv(input: Input) {
        this.regB = this.calcAdv(input);
        this.instructionPtr += 2;
    }

    cdv(input: Input) {
        this.regC = this.calcAdv(input);
        this.instructionPtr += 2;
    }
}