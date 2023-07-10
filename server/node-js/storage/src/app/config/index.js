const getSource=()=>{
  let base = 'src'
  let ENV = ""
  if (process.env?.NODE_ENV) { // node your-script.js  --env development|production|test
    // @ts-ignore
    ENV = process.env?.NODE_ENV
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
  if (process.env?.NODE_ENV) { // node your-script.js  --env development|production|test
    // @ts-ignore
    ENV = process.env?.NODE_ENV
    if(ENV === "development"){
      return 'development'
    } else if(ENV === "production"){
      return 'production'
    }

  }
  return 'development'

}

const Base=getSource()
const env=process.env
const mode=getEnv()


const jwt= {
  secret: process.env.JWT_SECRET
}


export {
  env,
  mode,
  Base,
  jwt,
};
