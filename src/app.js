const Pokedex = require('pokedex-promise-v2');
const fs = require('fs')
const P = new Pokedex();

async function parse(pokemonData){
    
    if(fs.existsSync('pokemon.json'))
    {
        console.log('===== JSON FILE DETECTED');
        try{
            console.log('===== DELETING JSON FILE');
            fs.unlinkSync('pokemon.json');
        }catch(err){
            console.log('===== ERROR ON DELETE');
            return;
        }
    }
    console.log("===== STARTING FILE WRITE");

    var stream = fs.createWriteStream("pokemon.json");
    stream.write("[")

    for (let index = 0; index < pokemonData.length; index++) {
        const element = pokemonData[index];
        let response = await P.getPokemonByName( index + 1 );
        let poke = JSON.stringify({
            nid : index + 1,
            name: element.name,
            type: response.types.flatMap( i => i.type.name)
        })
        stream.write(poke)
        if(index != pokemonData.length) stream.write(',')
        console.log(`${element.name} saved`)
    }
    stream.write("]");
    console.log("===== COMPLETE");
    stream.close();
}


async function gatherData() {
    var data = await P.getPokemonSpeciesList({
        limit: 807
    });
    parse(data.results)
}

gatherData();