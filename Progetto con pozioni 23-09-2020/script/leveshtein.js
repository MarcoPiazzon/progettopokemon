function bestMatch(pokemonName, pokedex) {
  pokemonName=pokemonName.toLowerCase();
  pokemonName.replace(" ", "-");
  let best_match = "";
  let least_dist = 0;
  for (let i = 0; i < pokedex.length; i++) {
      let d = levenshteinDynamicProgramming(pokemonName, pokedex[i].name);
      if (i == 0 || d < least_dist) {
          least_dist = d;
          best_match = pokedex[i].name;
      }
  }
  console.log("best match: " + best_match);
  return best_match;
}

function levenshteinDynamicProgramming(a, b) {
  let lev=[];
  for(let i=0;i<a.length; i++){
      lev[i] = [];
      for(let j=0;j<b.length; j++){
          if(i==0||j==0){
              lev[i].push(0);
          }else{
              let c1 =lev[i-1][j-1];
              if(a[i]!=b[j]){
                  c1++;
              }
              lev[i][j]=Math.min(lev[i-1][j]+1,lev[i][j-1]+1,c1);
          }
      }
  }
  return lev[a.length-1][b.length-1];
}