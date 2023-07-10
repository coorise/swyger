import fs from 'fs'
let filename='index.html'
if(fs.existsSync(filename)){
  if(!fs.existsSync('static'))fs.mkdirSync('static')
  let HTMLData=fs.readFileSync(filename, 'utf8')
  let htmlResult = HTMLData.replace(/\.\/src/g, './')
  let entryFile='/index.js'
  let mode=process.env?.BUILD_MODE
  if(mode==='bundle-minify') entryFile ='swyger-client.min.js'
  if(mode==='bundle') entryFile ='swyger-client.js'
  htmlResult = htmlResult.replace(/\/index.js/g, entryFile)
  console.log('Rewriting ', filename , ' found in the root of your project to dist/index.html')

  fs.writeFileSync('static/'+filename, htmlResult, 'utf8');
}else {
  console.log('No ', filename , ' found in the root of your project')
  //process.exit()

}



