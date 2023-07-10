import {defineConfig,splitVendorChunkPlugin} from "vite";
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {nodeResolve} from "@rollup/plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import glob from "glob-all";
import compress from 'vite-plugin-compression'
import {viteSingleFile} from "vite-plugin-singlefile";

const srcDir = 'src'

const distDir ='dist'
const publicDir ='static'
const nodeModuleDir ='resources/node_modules/'

let input=()=>{
  if(process.argv && process.argv.indexOf('--bundle') !== -1 ){
    return srcDir+'/index.js'
  }
  return Object.fromEntries(
      glob.sync([
        srcDir+'/**/*{.js,.ts,.jsx}',
      ]).map(file => [
        // This remove `src/` as well as the file extension from each file, so e.g.
        // src/nested/foo.js becomes nested/foo
        path.relative(srcDir, file.slice(0, file.length - path.extname(file).length)),
        // This expands the relative paths to absolute paths, so e.g.
        // src/nested/foo becomes /project/src/nested/foo.js
        fileURLToPath(new URL(file, import.meta.url))
      ])
  )
}
let output=()=>{
  if(process.argv && process.argv.indexOf('--bundle') !== -1 ){
    return {
      dir:distDir,
      format:'es',
      manualChunks: undefined,
      entryFileNames: process.argv && process.argv.indexOf('--minify') !== -1?'swyger-client-storage.min.js':'swyger-client-storage.js',
    }
  }
  return {
    dir:distDir,
    format:'es',
    entryFileNames: `[name].js`,
    chunkFileNames: `[name].js`,
    manualChunks:(id,{getModuleInfo})=> {
      if(id.includes('node_modules')){
        return (nodeModuleDir+path.parse(id).name).replace(distDir,'')
      }

    },
    assetFileNames: `[name].[ext]`
  }
}

export default defineConfig({
  //envDir:'.env',
  loader: { '.js': 'jsx' },
  root: path.join(__dirname),
  server:{
    host: 'localhost',
    //https: '', visit the doc config of vite
    port: 3003,
    open: false, //allow to open new window on your browser
    //cors:'',
    //origin:'',
    hmr:{
      //overlay:true  //set to false if you don't want to check your html tag
    },
    watch: {
      ignored: ['!**/node_modules'],
    }
  },
   plugins: [
     compress(
       {
         algorithm: 'brotliCompress',
         //ext:'br'
         //deleteOriginFile: true
       }
     ),
       viteSingleFile()
     //splitVendorChunkPlugin(),
       /*...VitePluginNode({
           // Nodejs native Request adapter
           // currently this plugin support 'express', 'nest', 'koa' and 'fastify' out of box,
           // you can also pass a function if you are using other frameworks, see Custom Adapter section
           adapter: 'express',

           // tell the plugin where is your project entry
           appPath: './server.js',

           // Optional, default: 'viteNodeApp'
           // the name of named export of you app from the appPath file
           exportName: 'viteNodeApp',

           // Optional, default: 'esbuild'
           // The TypeScript compiler you want to use
           // by default this plugin is using vite default ts compiler which is esbuild
           // 'swc' compiler is supported to use as well for frameworks
           // like Nestjs (esbuild don't support 'emitDecoratorMetadata' yet)
           tsCompiler: 'esbuild'
       })*/
   ],
  preview:{
    host: 'localhost',
    //https: '', visit the doc config of vite
    open: false, //allow to open new window on your browser
    port: 3003,
  },
  resolve: {
    alias: {
      path: "path-browserify",
    },
  },
  base:'./',
  transforms:[
    {
      test: ({path}) => path.endsWith('.html'),
      transform({code}){
        return `export default ${JSON.stringify(code)}`
      }
    }
  ],
  publicDir:publicDir,
  optimizeDeps:{
    //include: ["jquery"],
  },

  build: {
    sourcemap:true,
    minify: !!( process.argv && process.argv.indexOf('--minify') !== -1 ) ,
    //assetsInlineLimit: '8048', //8kb
    target: 'es2015', // it is the lowest,
    //lib:'', //declare multiple entries
    rollupOptions:{
      preserveEntrySignatures:'strict',
      plugins:[
        nodeResolve({browser:true, extensions:['.js','.ts','.scss','.jsx']}),
        commonjs(),

      ],
      input:input(),
      //preserveModules:true,
      output: output() ,
    },
    emptyOutDir:true,
    //copyPublicDir:false, //By default, Vite will copy files from the publicDir into the outDir on build
    outDir: path.join(__dirname,distDir),
  },
})
