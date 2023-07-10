import fs from 'fs'
let filename='src/api/env.js'
if(fs.existsSync(filename)){
  let env = process.env?.NODE_ENV||'prod'
  let envData=fs.readFileSync(filename, 'utf8',)
  let result = envData.replace('.ENV||\'dev\'',`.ENV||\'${env}\'`);
  console.log('Rewriting ', filename , 'file found ENV='+env)
  fs.writeFileSync(filename, result, 'utf8');
  filename='index.html'
  if(fs.existsSync(filename)){
    if(!fs.existsSync('static'))fs.mkdirSync('static')
    let HTMLData=fs.readFileSync(filename, 'utf8')
    let htmlResult = HTMLData.replace(/\.\/src/g, './')
    let entryFile='/index.js'
    let mode=process.env?.BUILD_MODE
    if(mode==='bundle-minify') entryFile ='swyger-client-database.min.js'
    if(mode==='bundle') entryFile ='swyger-client-database.js'
    htmlResult = htmlResult.replace(/\/index.js/g, entryFile)
    console.log('Rewriting ', filename , ' found in the root of your project to dist/index.html')

    fs.writeFileSync('static/'+filename, htmlResult, 'utf8');
  }else {
    console.log('No ', filename , ' found in the root of your project')
    //process.exit()

  }

}else {
  console.log('No ', filename , ' found in project')
  //process.exit()

}



