
let ENV = ""
let src = ""
if ((process.argv && process.argv.indexOf('--env') !== -1)) { // node your-script.js  --env development|production|test
  // @ts-ignore
  ENV = process.argv[process.argv.indexOf('--env') + 1].toString()
  if(ENV === "development"){
    src = "src"
  } else if(ENV === "production"){
    src = "dist"
  }
}

const  {typeValidation } = require('./'+src+'/services/database/typeorm/');
//console.log(`------------DB Validated TYPEORM config List------------- `)
/*typeValidation.forEach(db => {
    for( const [key, value] of Object.entries(db)){
        console.log(`key: ${key}= value: ${db[key]} `)
    }
    //console.log(`------------DB------------- `)
})*/

module.exports = typeValidation;
