let day: number = 1;

if (import.meta.main) {

  for(const entry of Deno.readDirSync('./2024/')){
    if (!entry.isDirectory || !entry.name.startsWith('day')) {
      continue;
    }
    const temp = parseInt(entry.name.substring(3));
    if (day < temp) {
      day = temp;
    }

    // import(`./day${temp}/index.ts`).then(async program => {
    //   const input = await Deno.readTextFile(`./day${temp}/input.txt`);
  
    //   const result = program.default(input);
    //   console.log(result);
  
    // });
  }


  import(`./2024/day${day}/index.ts`).then(async program => {
    const input = await Deno.readTextFile(`./2024/day${day}/input.txt`);

    const result = program.default(input);

    console.log(result);
  });
}

