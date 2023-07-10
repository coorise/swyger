import fs from 'fs'
const filename='./index.html'
if(fs.existsSync(filename)){
  fs.readFile(filename, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    let result = data.replace(/\.\/src/g, '');
    result=result.replace('env="dev"','env="prod"')
    console.log('Rewriting ', filename , ' found in the root of your project to dist...')
    fs.writeFile('dist/'+filename, result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
    //process.exit()
  });

}else {
  console.log('No ', filename , ' found in the root of your project')
  //process.exit()

}


