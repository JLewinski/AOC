const day: number = 5;

if (import.meta.main) {

  // for(const entry of Deno.readDirSync('.')){
  //   if (!entry.isDirectory || !entry.name.startsWith('day')) {
  //     continue;
  //   }
  //   const temp = parseInt(entry.name.substring(3));
  //   import(`./day${temp}/index.ts`).then(async program => {
  //     const input = await Deno.readTextFile(`./day${temp}/input.txt`);
  
  //     const result = program.default(input);
  
  //     console.log(result);
  //   });
  // }


  import(`./day${day}/index.ts`).then(async program => {

    const input = await Deno.readTextFile(`./day${day}/input.txt`);

    const result = program.default(input);

    console.log(result);
  });
}

