const getSource=()=>{
  let base = 'src'
  let ENV = ""
  if ((process.argv && process.argv.indexOf('--env') !== -1)) { // node your-script.js  --env development|production|test
    // @ts-ignore
    ENV = process.argv[process.argv.indexOf('--env') + 1].toString()
    if(ENV === "development"){
      base = "src"
    } else if(ENV === "production"){
      base = "dist"
    }

  }
  return base
}
const getEnv=()=>{
  let ENV = ""
  if ((process.argv && process.argv.indexOf('--env') !== -1)) { // node your-script.js  --env development|production|test
    // @ts-ignore
    ENV = process.argv[process.argv.indexOf('--env') + 1].toString()
    if(ENV === "development"){
      return 'development'
    } else if(ENV === "production"){
      return 'production'
    }

  }
  return 'development'

}
const Base=getSource()
const mode=getEnv()
const env=process.env

const jwt= {
  secret: process.env.JWT_SECRET
}


export {
  Base,
  env,
  mode,
  jwt,
};
