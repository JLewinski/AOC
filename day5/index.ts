const rules = {} as Record<number, number[] | undefined>;


export default function main(input: string) {
    const [ruleInput, updateInput] = input.split('\r\n\r\n');


    for (const match of ruleInput.matchAll(/\d+\|\d+/g)) {
        const [before, after] = getNumbers(match[0]);
        if (rules[before]) {
            rules[before].push(after);
        } else {
            rules[before] = [after];
        }
    }

    let originallyFixed = 0;

    const toFix: number[][] = [];
    for (const update of updateInput.split('\r\n').map(getNumbers)) {
        const middle = checkUpdate(update);
        if (middle) {
            originallyFixed += middle;
        } else {
            toFix.push(update);
        }
    }



    return { originallyFixed, afterFix: toFix.map(fixUpdate).reduce((a, c) => a + c) };
}

function checkUpdate(update: number[]) {
    for (let k = update.length - 1; k >= 0; k--) {
        const kRules = rules[update[k]];
        if (!kRules) continue;
        for (let i = 0; i < k; i++) {
            if (kRules.indexOf(update[i]) != -1) {
                return 0;
            }
        }
    }
    return update[Math.floor(update.length / 2)];
}

function fixUpdate(update: number[]): number {
    for (let i = 0; i < update.length; i++) {
        for (let k = i + 1; k < update.length; k++) {
            const kRules = rules[update[k]];
            if (!kRules) continue;
            if (kRules.indexOf(update[i]) != -1) {
                const temp = update.splice(i, 1);
                update.splice(k, 0, ...temp);
                k = i + 1;
            }
        }
    }
    return update[Math.floor(update.length / 2)];
}

function getNumbers(input: string) {
    return input.matchAll(/\d+/g).map(x => parseInt(x[0])).toArray() ?? [];
}