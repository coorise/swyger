import module from 'module-alias'

//Visit: https://www.npmjs.com/package/module-alias



// Add multiple aliases, good shortcut when you don't want '../../../../' when you import
module.addAliases({
    '@rootApp'  : __dirname+'/../',
    '@src'  : __dirname,
    '@app': __dirname + '/app',
    '@config': __dirname + '/app/config',
    '@rest': __dirname + '/app/rest',
    '@core': __dirname + '/app/rest/core',
    '@api': __dirname + '/app/rest/api',
    '@api-builder': __dirname + '/app/api_builder',
    '@helpers': __dirname + '/app/helpers',
    '@common': __dirname + '/app/helpers/common',
    '@middleware': __dirname + '/app/middlewares',
    '@plugin': __dirname + '/app/plugins',
    '@service': __dirname + '/app/services',
    '@test': __dirname + '/app/test',
    '@doc': __dirname + '/app/doc',
    '@module': __dirname + '/modules',
})
//with that, you could later do const mymodule= require ('@your-module')

//Add custom modules directory like node_modules
//module.addPath(__dirname + '/modules')

//with that, you could later do const myModule= require ('your-module') which is present on /modules folder


