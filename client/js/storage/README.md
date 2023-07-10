# <span style="color:red">Swyger</span>  <span style="color:blue">Storage Client JS</span>

## Get Started
Swyger Client is used for Swyger Server as consumer Rest API.
Visit the master branch: https://github.com/coorise/swyger-js-client-storage.git


You can download the swyger database client js library on: https://www.unpkg.com/@swyger/client-storage

then save it somewhere in your directory like "/dist/swyger-client-storage.min.js"
```
<script type="module">
        import SwygerStorageClient from './dist/swyger-client-storage.min.js'
        //import SwygerStorageClient from '@swyger/client-storage' //with npm for node module

        
        let config={
          //Configure the offline DB
          OFFLINE_DB_NAME:{
              DATABASE:'swyger_database'
          },
  
          //Configure the server
          HOST_SERVER:{
              AUTH:'http://localhost:4100', //Required for protected route
              STORAGE:'http://localhost:4400',
          },
          API_VERSION:{
              AUTH:'/api/v1',
              STORAGE:'/api/v1',
          },
          // A Unique Api key for all your servers
          API_KEY:'your_api_key'
        }
        let client= SwygerStorageClient.init(config)
    
        //CRUD with File in realtime
        let storageConfig={ //Discord(unlimited storage available with discord bot)/(soon AWS, Google)....
            token:'discord-bot-token',
            channelId:'discord-channel-id'
        }
        let location='local' //discord/aws/google
        let storageRef=client?.storage(location,storageConfig).ref('/your/parent/ref') //like firebase storage
        //storageRef.upload({object},callback)
        //...

 </script>
```
# Build Your Own JS Client Library
Note 0: Clone the repository:

``git clone https://github.com/coorise/swyger-js-client-storage.git``


Note 1: For more details about how to use our API Consumer, visit the ``DOC`` : https://github.com/coorise/swyger-js-client-storage/tree/master/doc/swyger/api.

Note 2: If you want to modify the entire api (eg:children route,...), you have to work with the main project (installing Node JS with the project dependencies ``npm i``) <br> then locate the ``./src/api/api-route.js``,<br>
once you are done just build it with ``npm run build``,<br> to get your new library in ``dist`` folder.

# Todo
- Removing/Reduce some unusual dependencies,functions, refactoring paths/files...
- Making good and easy documentation with tutorials (videos, webpage...)
- Code Cleaning/ Making a suitable project structure with modulable pattern

# Join US
If you have any suggestion, feature to add ...etc
- Discord(Support Team, FAQ, Chat): https://discord.gg/PPTZY5qFdC

# Contributors
- Agglomy Team :
    - Ivan Joel Sobgui
# Licence

MIT: You can use it for educational/personal/business purpose!