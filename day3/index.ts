import { assertEquals } from "@std/assert/equals";
import { readInput } from "../main.ts";
const day = 3;

Deno.test("AOC3", async () => {
    const result = await main();
    console.log(result);
    assertEquals(result.noDo, 173785482);
    assertEquals(result.filteredDisabled, 83158140);
});

export default async function main() {
    const input = await readInput(day);
    const mulInsturctions = input
        .matchAll(/mul\(\d{1,3},\d{1,3}\)/g)
        .map(x => ({
            val: x[0],
            i: x.index
        })).toArray();

    const products = mulInsturctions.map(x => {
        const [a, b] = x.val.matchAll(/\d{1,3}/g).map(Number).toArray();
        return { a, b, product: a * b, i: x.i };
    });

    const dos = [{i: 0, enabled: true},...input.matchAll(/(do\(\))|(don't\(\))/g).map(x => ({i:x.index, val: x[0], enabled: x[0] === "do()"})).toArray()];
    const filteredDisabled = products.reduce((acc, val) =>
    {
        return dos.findLast(x => x.i < val.i)?.enabled ? acc + val.product : acc;
    }
    , 0);

    return { noDo: products.reduce((acc, x) => acc + x.product, 0), filteredDisabled };
}