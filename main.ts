export async function readInput(day: number) {
  return await Deno.readTextFile(`./day${day}/input.txt`);
}