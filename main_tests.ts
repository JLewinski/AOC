import { assertEquals } from "@std/assert/equals";

Deno.test("AOC1", async () => {
    const day = 1;
    const input = await Deno.readTextFile(`./day${day}/input.txt`);
    const program = await import(`./day${day}/index.ts`);
    const result = program.default(input);
    console.log(result);
    assertEquals(result[0], 1941353);
    assertEquals(result[1], 22539317);
});

Deno.test("AOC2", async () => {
    const day = 2;
    const input = await Deno.readTextFile(`./day${day}/input.txt`);
    const program = await import(`./day${day}/index.ts`);
    const result = program.default(input);
    console.log(result);
    assertEquals(result.numValid, 516);
    assertEquals(result.numValidTolerate, 561);
});

Deno.test("AOC3", async () => {
    const day = 3;
    const input = await Deno.readTextFile(`./day${day}/input.txt`);
    const program = await import(`./day${day}/index.ts`);
    const result = program.default(input);
    console.log(result);
    assertEquals(result.noDo, 173785482);
    assertEquals(result.filteredDisabled, 83158140);
});

Deno.test("AOC4", async () => {
    const day = 4;
    const input = await Deno.readTextFile(`./day${day}/input.txt`);
    const program = await import(`./day${day}/index.ts`);
    const result = program.default(input);
    console.log(result);
    assertEquals(result.found, 2483);
    assertEquals(result.foundX, 1925);
});

Deno.test("AOC5", async () => {
    const day = 5;
    const input = await Deno.readTextFile(`./day${day}/input.txt`);
    const program = await import(`./day${day}/index.ts`);
    const result = program.default(input);
    console.log(result);
    assertEquals(result.originallyFixed, 4569);
    assertEquals(result.afterFix, 6456);
});