import { assertEquals } from "@std/assert/equals";
import { readInput } from "../main.ts";
const day = 2;

Deno.test("AOC2", async () => {
    const result = await main();
    assertEquals(result.numValid, 516);
});

export default async function main() {
    const input = await readInput(day);
    const reports = parseInput(input);

    const numValid = reports.map(x => ({ report: x, valid: isValid(x) })).filter(x => x.valid).length;
    const numValidTolerate = reports.map(x => ({ report: x, valid: isValid(x, 1) })).filter(x => x.valid).length;

    return {numValid,numValidTolerate};
}


function removeElement(report: number[], i: number) {
    return [...report.slice(0, i), ...report.slice(i + 1)];
}

function isValid(report: number[], removable = 0): boolean {
    const min = 1;
    const max = 3;
    const first = report[0] - report[1] > 0;
    for (let i = 0; i < report.length - 1; i++) {
        const diff = report[i] - report[i + 1];
        const absDiff = Math.abs(diff);
        if (absDiff < min || absDiff > max || diff > 0 !== first) {
            if (removable){
                return  isValid(removeElement(report, i), removable - 1) || 
                        isValid(removeElement(report, i + 1), removable - 1) ||
                        isValid(removeElement(report, 0), removable - 1) ||
                        isValid(removeElement(report, 1), removable - 1);
            }
            return false;
        }
    }
    return true;
}

function parseInput(input: string) {
    return input.split("\n").filter(x => x).map(x => x.matchAll(/\d+/g).map(Number).toArray());
}