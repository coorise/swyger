#!/usr/bin/env node

import {
    intro,
    outro,
    confirm,
    select,
    spinner,
    isCancel,
    cancel,
    text, multiselect,
} from '@clack/prompts';
import { setTimeout as sleep } from 'node:timers/promises';
import color from 'picocolors';
import chalk from 'chalk';
import boxen from 'boxen';
import git from '@npmcli/git'
import fs from "fs-extra";
//visit: https://github.com/manavshrivastavagit/mycli/blob/master/bin/index.js
import {translate} from "@vitalets/google-translate-api";
import yargs from "yargs/yargs";
import {hideBin} from "yargs/helpers";
async function main() {
    let app={}
    const usage = chalk.red("\nUsage: swyger init \n"
        + boxen(chalk.green("\n" + "Swyger CLI 0.1.6"+ "\nLet's build project! \n"), {padding: 1, borderColor: 'red', dimBorder: true}) + "\n");

    console.log(usage);
    let args=hideBin(process.argv) //Or process.argv.slice(2)

    const argv = yargs(args)
        .usage(usage)
        .command({
            command:'init',
            describe:'Init command',
            builder:function (yargs, helpOrVersionSet) {
                return yargs
                    .option('name', {
                        alias: 'n',
                        describe:'Name of the Project',
                        demandOption: false,})
                    .option('server', {
                        alias: 's',
                        describe:'Create a server Project',
                        demandOption: false,})
                    .option('client', {
                        alias: 'c',
                        describe:'Create a client Project',
                        demandOption: false,})
            },
            handler:async function(childArg){
                let arg=childArg
                console.log();
                intro(color.inverse(' create-my-app '));
                //console.log('Adding notes: ',childArg);
                if(arg.name){
                    app.name=arg.name
                }else {
                    const name = await text({
                        message: 'What is your server name?',
                        placeholder: 'swyger-clone',
                        validate(value) {
                            if (value.length === 0) return `Value is required!`;
                        }
                    });

                    if (isCancel(name)) {
                        cancel('Operation cancelled');
                        return process.exit(0);
                    }
                    app.name=name
                }
                app.name=app.name.toLowerCase()


                if(arg.server&&!arg.client){
                    app.sideType='server'
                }else if(!arg.server&&arg.client){
                    app.sideType='client'
                }
                else if(arg.server&&arg.client) {
                    console.log('For server: \nswyger init -n swyger -s \nswyger init --name swyger --server')
                    console.log('For client: \nswyger init -n swyger -c \nswyger init --name swyger --client')
                    return process.exit(0);
                }
                if(!app?.sideType){
                    const sideType=await select({
                        message: 'Pick your side type',
                        options: [
                            { value: 'server', label: 'Create a Backend App' },
                            { value: 'client', label: 'Create a Frontend App' },
                        ],
                    });
                    if (isCancel(sideType)) {
                        cancel('Operation cancelled');
                        return process.exit(0);
                    }
                    app.sideType=sideType
                }
                let projectType
                let serviceType
                let apiClientType
                let serverLanguageType
                let projectFolder='./'+app.name
                let shouldUseApiClient
                let projectUrl
                const projectSpinner = spinner();
                let repo
                switch (app?.sideType) {
                    case 'server':
                        serverLanguageType=await select({
                            message: 'Pick your Language',
                            options: [
                                { value: 'node-js', label: 'Create the server with NodeJS' },
                            ],
                        })
                        if (isCancel(serverLanguageType)) {
                            cancel('Operation cancelled');
                            return process.exit(0);
                        }
                        switch (serverLanguageType) {
                            case 'node-js':
                                serviceType = await select({
                                    message: 'Pick a service you need',
                                    options: [
                                        { value: 'all', label: 'All services(auth,database,storage...)' },
                                        { value: 'auth', label: 'This will create only an auth server (register,login,refresh token...)' },
                                        { value: 'database', label: 'This will create only a database server(create,read,update,delete data in realtime)' },
                                        //{ value: 'storage', label: 'This will create only a storage server', hint: 'oh no' },
                                        { value: 'storage', label: 'This will create only a storage server(create,read,update,delete file in realtime)'},
                                    ],
                                });
                                if (isCancel(serviceType)) {
                                    cancel('Operation cancelled');
                                    return process.exit(0);
                                }
                                repo='https://github.com/coorise/swyger-nodejs-base.git'
                                projectSpinner.start('Downloading browser repo from github: '+repo+'\n');
                                await git.clone(repo, 'master')?.then(()=>{
                                    if(fs.pathExistsSync('./swyger-nodejs-base')){
                                        if(fs.pathExistsSync('./swyger-nodejs-base/package.json')){
                                            projectSpinner.stop('The repo from github: '+repo+' was cloned successfully!\n');
                                            const fileData = fs.readFileSync("./swyger-nodejs-base/package.json", "utf8")
                                            // Use JSON.parse to convert        string to JSON Object
                                            const jsonData = JSON.parse(fileData)
                                            jsonData.name='@'+app.name+'/base'
                                            jsonData.version='0.1.0'
                                            // Write it back to your json file
                                            fs.writeFileSync("./swyger-nodejs-base/package.json", JSON.stringify(jsonData,null, 4))
                                        }

                                        fs.moveSync('./swyger-nodejs-base',projectFolder+'/server/base')
                                    }
                                })

                                switch (serviceType) {
                                    case 'all':
                                        repo='https://github.com/coorise/swyger-nodejs-auth.git'
                                        projectSpinner.start('Downloading browser repo from github: '+repo+'\n');
                                        await git.clone(repo, 'master')?.then(()=>{
                                            if(fs.pathExistsSync('./swyger-nodejs-auth')){
                                                if(fs.pathExistsSync('./swyger-nodejs-auth/package.json')){
                                                    projectSpinner.stop('The repo from github: '+repo+' was cloned successfully!\n');
                                                    const fileData = fs.readFileSync("./swyger-nodejs-auth/package.json", "utf8")
                                                    // Use JSON.parse to convert        string to JSON Object
                                                    const jsonData = JSON.parse(fileData)
                                                    jsonData.name='@'+app.name+'/auth'
                                                    jsonData.version='0.1.0'
                                                    // Write it back to your json file
                                                    fs.writeFileSync("./swyger-nodejs-auth/package.json", JSON.stringify(jsonData,null, 4))
                                                }
                                                fs.moveSync('./swyger-nodejs-auth',projectFolder+'/server/auth')
                                            }
                                        })
                                        repo='https://github.com/coorise/swyger-nodejs-database.git'
                                        projectSpinner.start('Downloading browser repo from github: '+repo+'\n');
                                        await git.clone(repo, 'master')?.then(()=>{
                                            if(fs.pathExistsSync('./swyger-nodejs-database')){
                                                if(fs.pathExistsSync('./swyger-nodejs-database/package.json')){
                                                    projectSpinner.stop('The repo from github: '+repo+' was cloned successfully!\n');
                                                    const fileData = fs.readFileSync("./swyger-nodejs-database/package.json", "utf8")
                                                    // Use JSON.parse to convert        string to JSON Object
                                                    const jsonData = JSON.parse(fileData)
                                                    jsonData.name='@'+app.name+'/database'
                                                    jsonData.version='0.1.0'
                                                    // Write it back to your json file
                                                    fs.writeFileSync("./swyger-nodejs-database/package.json", JSON.stringify(jsonData,null, 4))
                                                }
                                                fs.moveSync('./swyger-nodejs-database',projectFolder+'/server/database')
                                            }
                                        })
                                        repo='https://github.com/coorise/swyger-nodejs-storage.git'
                                        projectSpinner.start('Downloading browser repo from github: '+repo+'\n');
                                        await git.clone(repo, 'master')?.then(()=>{
                                            if(fs.pathExistsSync('./swyger-nodejs-storage')){
                                                if(fs.pathExistsSync('./swyger-nodejs-storage/package.json')){
                                                    projectSpinner.stop('The repo from github: '+repo+' was cloned successfully!\n');
                                                    const fileData = fs.readFileSync("./swyger-nodejs-storage/package.json", "utf8")
                                                    // Use JSON.parse to convert        string to JSON Object
                                                    const jsonData = JSON.parse(fileData)
                                                    jsonData.name='@'+app.name+'/storage'
                                                    jsonData.version='0.1.0'
                                                    // Write it back to your json file
                                                    fs.writeFileSync("./swyger-nodejs-storage/package.json", JSON.stringify(jsonData,null, 4))
                                                }
                                                fs.moveSync('./swyger-nodejs-storage',projectFolder+'/server/storage')
                                            }
                                        })
                                        break;
                                    case 'auth':
                                        repo='https://github.com/coorise/swyger-nodejs-auth.git'
                                        projectSpinner.start('Downloading browser repo from github: '+repo+'\n');
                                        await git.clone(repo, 'master')?.then(()=>{
                                            if(fs.pathExistsSync('./swyger-nodejs-auth')){
                                                if(fs.pathExistsSync('./swyger-nodejs-auth/package.json')){
                                                    projectSpinner.stop('The repo from github: '+repo+' was cloned successfully!\n');
                                                    const fileData = fs.readFileSync("./swyger-nodejs-auth/package.json", "utf8")
                                                    // Use JSON.parse to convert        string to JSON Object
                                                    const jsonData = JSON.parse(fileData)
                                                    jsonData.name='@'+app.name+'/auth'
                                                    jsonData.version='0.1.0'
                                                    // Write it back to your json file
                                                    fs.writeFileSync("./swyger-nodejs-auth/package.json", JSON.stringify(jsonData,null, 4))
                                                }
                                                fs.moveSync('./swyger-nodejs-auth',projectFolder+'/server/auth')
                                            }
                                        })
                                        break;
                                    case 'database':
                                        repo='https://github.com/coorise/swyger-nodejs-database.git'
                                        projectSpinner.start('Downloading browser repo from github: '+repo+'\n');
                                        await git.clone(repo, 'master')?.then(()=>{
                                            if(fs.pathExistsSync('./swyger-nodejs-database')){
                                                if(fs.pathExistsSync('./swyger-nodejs-database/package.json')){
                                                    projectSpinner.stop('The repo from github: '+repo+' was cloned successfully!\n');
                                                    const fileData = fs.readFileSync("./swyger-nodejs-database/package.json", "utf8")
                                                    // Use JSON.parse to convert        string to JSON Object
                                                    const jsonData = JSON.parse(fileData)
                                                    jsonData.name='@'+app.name+'/database'
                                                    jsonData.version='0.1.0'
                                                    // Write it back to your json file
                                                    fs.writeFileSync("./swyger-nodejs-database/package.json", JSON.stringify(jsonData,null, 4))
                                                }
                                                fs.moveSync('./swyger-nodejs-database',projectFolder+'/server/database')
                                            }
                                        })
                                        break;
                                    case 'storage':
                                        repo='https://github.com/coorise/swyger-nodejs-storage.git'
                                        projectSpinner.start('Downloading browser repo from github: '+repo+'\n');
                                        await git.clone(repo, 'master')?.then(()=>{
                                            if(fs.pathExistsSync('./swyger-nodejs-storage')){
                                                if(fs.pathExistsSync('./swyger-nodejs-storage/package.json')){
                                                    projectSpinner.stop('The repo from github: '+repo+' was cloned successfully!\n');
                                                    const fileData = fs.readFileSync("./swyger-nodejs-storage/package.json", "utf8")
                                                    // Use JSON.parse to convert        string to JSON Object
                                                    const jsonData = JSON.parse(fileData)
                                                    jsonData.name='@'+app.name+'/storage'
                                                    jsonData.version='0.1.0'
                                                    // Write it back to your json file
                                                    fs.writeFileSync("./swyger-nodejs-storage/package.json", JSON.stringify(jsonData,null, 4))
                                                }
                                                fs.moveSync('./swyger-nodejs-storage',projectFolder+'/server/storage')
                                            }
                                        })
                                        break;
                                }
                                app.serviceType=serviceType
                                break;
                        }

                        break;
                    case 'client':
                        projectType = await select({
                            message: 'What is the platform you want to build?',
                            options: [
                                { value: 'browser', label: 'Bowser: Html/CSS SPA Boilerplate to create Static Website (like NuxtJS, NextJS...)' },
                            ],
                        });

                        if (isCancel(projectType)) {
                            cancel('Operation cancelled');
                            return process.exit(0);
                        }
                        shouldUseApiClient=await confirm({
                            message: 'Do you want to add swyger api consumer client (auth,database,storage...)?',
                        })
                        if (isCancel(shouldUseApiClient)) {
                            cancel('Operation cancelled');
                            return process.exit(0);
                        }
                        if(shouldUseApiClient){
                            apiClientType = await multiselect({
                                message: 'What is the client api type you want to build? (Select: Space bar |__|, Enter: Continue',
                                options: [
                                    { value: 'all', label: 'All Rest Api consumer(authentication,database,storage...)' },
                                    { value: 'auth', label: 'Auth Rest Api consumer' },
                                    //{ value: 'database', label: 'Database Rest Api consumer' },
                                    //{ value: 'storage', label: 'Storage Rest Api consumer' },
                                ],
                            });
                            if (isCancel(apiClientType)) {
                                cancel('Operation cancelled');
                                return process.exit(0);
                            }
                        }

                        switch (projectType) {
                            case 'browser':
                                projectUrl='swyger-spa.git'
                                if(shouldUseApiClient){
                                    projectUrl='swyger-browser.git'
                                }
                                repo='https://github.com/coorise/'+projectUrl
                                projectSpinner.start('Downloading browser repo from github: '+repo+'\n');
                                await git.clone(repo, 'master')?.then(()=>{
                                    if(fs.pathExistsSync('./swyger-browser')){
                                        if(fs.pathExistsSync('./swyger-browser/package.json')){
                                            projectSpinner.stop('The repo from github: '+repo+' was cloned successfully!\n');
                                            const fileData = fs.readFileSync("./swyger-browser/package.json", "utf8")
                                            // Use JSON.parse to convert        string to JSON Object
                                            const jsonData = JSON.parse(fileData)
                                            jsonData.name='@'+app.name+'/browser'
                                            jsonData.version='0.1.0'
                                            if(!apiClientType.includes('all')){
                                                let fileImport=''
                                                let client="const SwygerClient= {\n" +
                                                    "    init:(ClientConfig)=>{\n" +
                                                    "\n" +
                                                    "        return {\n"
                                                delete jsonData.dependencies['@swyger/client']
                                                if(apiClientType.includes('auth')) {
                                                    jsonData.dependencies['@swyger/client-auth'] = 'latest'
                                                    fileImport="import SwygerAuthClient from '@swyger/client-auth'\n"
                                                    client=client+"          auth:SwygerAuthClient.init(ClientConfig),\n"
                                                }else{
                                                    if(fs.pathExistsSync('./swyger-browser/src/app/rest/core/index.js')){
                                                        let coreData = fs.readFileSync("./swyger-browser/src/app/rest/core/index.js", "utf8")
                                                        coreData=coreData.replace(/import AuthModule?\n/,'')
                                                        coreData=coreData.replace(/...AuthModule,/,'')
                                                        fs.writeFileSync("./swyger-browser/src/app/rest/core/index.js", coreData)
                                                    }
                                                    if(fs.pathExistsSync('./swyger-browser/static/public/themes/dashui/app/core/auth')){
                                                        fs.removeSync('./swyger-browser/static/public/themes/dashui/app/core/auth')
                                                    }
                                                }
                                                if(apiClientType.includes('database')) {
                                                    jsonData.dependencies['@swyger/client-database'] = 'latest'
                                                    fileImport=fileImport+"import SwygerDatabaseClient from '@swyger/client-database'\n"
                                                    client=client+"          database:SwygerDatabaseClient.init(ClientConfig),\n"
                                                }else{
                                                    if(fs.pathExistsSync('./swyger-browser/src/app/rest/core/index.js')){
                                                        let coreData = fs.readFileSync("./swyger-browser/src/app/rest/core/index.js", "utf8")
                                                        coreData=coreData.replace(/import DatabaseModule?\n/,'')
                                                        coreData=coreData.replace(/...DatabaseModule,/,'')
                                                        fs.writeFileSync("./swyger-browser/src/app/rest/core/index.js", coreData)
                                                    }
                                                    if(fs.pathExistsSync('./swyger-browser/static/public/themes/dashui/app/core/database')){
                                                        fs.removeSync('./swyger-browser/static/public/themes/dashui/app/core/database')
                                                    }
                                                }
                                                if(apiClientType.includes('storage')) {
                                                    jsonData.dependencies['@swyger/client-storage'] = 'latest'
                                                    fileImport=fileImport+"import SwygerStorageClient from '@swyger/client-storage'\n"
                                                    client=client+"          storage:SwygerStorageClient.init(ClientConfig),\n"

                                                }else{
                                                    if(fs.pathExistsSync('./swyger-browser/src/app/rest/core/index.js')){
                                                        let coreData = fs.readFileSync("./swyger-browser/src/app/rest/core/index.js", "utf8")
                                                        coreData=coreData.replace(/import StorageModule?\n/,'')
                                                        coreData=coreData.replace(/...StorageModule,/,'')
                                                        fs.writeFileSync("./swyger-browser/src/app/rest/core/index.js", coreData)
                                                    }
                                                    if(fs.pathExistsSync('./swyger-browser/static/public/themes/dashui/app/core/storage')){
                                                        fs.removeSync('./swyger-browser/static/public/themes/dashui/app/core/storage')
                                                    }
                                                }

                                                //Rewriting the route.js for client
                                                if(fs.pathExistsSync('./swyger-browser/src/route.js')){
                                                    client=client +
                                                        "        }\n" +
                                                        "    }\n" +
                                                        "}"
                                                    let routeData = fs.readFileSync("./swyger-browser/src/route.js", "utf8")
                                                    routeData=routeData.replace(/import SwygerClient from '@swyger\/client'/,fileImport+'\n')
                                                    routeData=routeData.replace(/let client=/,client+'\nlet client=')
                                                    fs.writeFileSync("./swyger-browser/src/route.js", routeData)

                                                }

                                            }
                                            // Write it back to your json file
                                            fs.writeFileSync("./swyger-browser/package.json", JSON.stringify(jsonData,null, 4))

                                        }
                                        fs.moveSync('./swyger-browser',projectFolder+'/client/browser')
                                    }
                                })
                                break;
                        }

                        app.projectType=projectType
                        break;
                }

                const projectUsage =chalk.red(boxen(chalk.green("\n" + app.name.toUpperCase()+" v0.1.0 project." + "\nEnter in your sub folder(s) by cmd: cd folder_name, \nthen cmd: npm install \n     cmd: npm run dev (for development) \n"), {padding: 1, borderColor: 'red', dimBorder: true}) + "\n");
                console.log(projectUsage)
                outro("You're all set! Don't forget to read the README.md for each project!");

                await sleep(1000);
            },
        })
        //.option("i", {alias:"init", describe: "Init a project", type: "string", demandOption: false })
        //.option("s", {alias:"sentence", describe: "Sentence to be translated", type: "string", demandOption: false })
        .showHelpOnFail(false, 'Specify --help for available options')
        .help('help')
        .argv;
    if(argv?._?.[0]!=='init'){
        console.log('The command should be: swyger init')
    }


}

main().catch(console.error);

