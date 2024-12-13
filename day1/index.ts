import { assertEquals } from "@std/assert/equals";
import { readInput } from "../main.ts";

Deno.test("AOC1", async () => {
    const result = await main();
    assertEquals(result[0], 1941353);
    assertEquals(result[1], 22539317);
});

const day = 1;

export default async function main() {
    const input = await readInput(day);
    const [arr1, arr2] = parseInput(input);
    const differenceScore = arr1
        .map((x, i) => Math.abs(x - arr2[i]))
        .reduce((acc, curr) => acc + curr, 0);

    const similarityScore = arr1
        .filter((x, i, a) => a.indexOf(x) == i)
        .map(num => {
            const count2 = getCount(arr2, num);
            return count2 ? num * getCount(arr1, num) * count2 : 0;
        })
        .reduce((acc, curr) => acc + curr, 0);

    return [differenceScore, similarityScore];
}

function getCount(arr: number[], num: number) {
    const index = arr.indexOf(num);
    return index === -1 ? 0 : arr.lastIndexOf(num) - index + 1;
}

function parseInput(input: string) {
    const arr = input.matchAll(/\d+/g).map(x => x[0]).map(Number).toArray();
    const filter = (arr: number[], odd: boolean) => arr.filter((_, i) => i % 2 === (odd ? 1 : 0)).sort();
    return [filter(arr, false), filter(arr, true)];
}