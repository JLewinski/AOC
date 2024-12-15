export default function main(input: string) {
    const expanded = expand(input);
    const fullFiles = moveFiles(expanded);
    // console.log(fullFiles.join(''));

    return fullFiles.map((x, i) => x !== null ? i * x : 0).reduce((a, b) => a + b);
}

function expand(input: string) {
    const result = [];
    for (let i = 0; i < input.length; i++) {
        const count = parseInt(input[i]);
        result.push({ val: i % 2 == 0 ? i / 2 : null, count });
    }
    return result;
}

function moveFiles(input: { val: number | null, count: number }[]) {
    printResult(input);
    let i = input.length - 1;
    while (i > 1) {
        const data = input[i--];
        if (data.val == null) {
            continue;
        }

        for (let j = 1; j <= i; j++) {
            const space = input[j];

            if (space.val !== null || space.count < data.count) {
                continue;
            }

            input.splice(j, 0, { val: data.val, count: data.count });
            data.val = null;
            space.count -= data.count;
            i++;
            // printResult(input);
            break;
        }
    }
    return printResult(input);
}

function printResult(input: { val: number | null, count: number }[])
{
    const result: (number | string | null)[] = [];

    for (const data of input) {
        for (let j = 0; j < data.count; j++) {
            result.push(data.val);
        }
    }

    // console.log(result.join(''));

    return result;
}