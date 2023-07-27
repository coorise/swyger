# <span style="color:red">Swyger</span>  <span style="color:blue">Client JS</span>

## Get Started
Swyger Client is used for Swyger Server as consumer Rest API.
Visit the master branch: https://github.com/coorise/swyger-js-client.git

You can download the swyger database client js library on: https://www.unpkg.com/@swyger/client

then save it somewhere in your directory like "/dist/swyger-client.min.js"

```
<script type="module">
        import SwygerClient from './dist/swyger-client.min.js'
        //import SwygerStorageClient from '@swyger/client' //with npm for node module

        let config={
            //Configure the offline DB
            OFFLINE_DB_NAME:{
                AUTH:'swyger_auth',
                DATABASE:'swyger_database',
                STORAGE:'swyger_storage'
            },

            //Configure the server
            HOST_SERVER:{
                AUTH:'http://localhost:4100',
                DATABASE:'http://localhost:4400',
                STORAGE:'http://localhost:4500',
                MAIL:'http://localhost:4200',
            },
            API_VERSION:{
                AUTH:'/api/v1',
                DATABASE:'/api/v1',
                STORAGE:'/api/v1',
                MAIL:'/api/v1',
            },
            AUTO_REFRESH_TOKEN_TIMEOUT:1500000, //in millisecond= 25 minutes
            // A Unique Api key for all your servers
            API_KEY:your_api_key
        }
        let client =SwygerClient.init(config)
        //now you can do authentication
        let auth= client?.auth?.auth()
        auth.register({email,password},callback)
        //...
        
        //CRUD with database realtime
        let ref=client?.database?.database().ref('/your/path/reference') //like firebase
        //ref.create({object},callback)
        //OR listener
        //ref.onValue(callback)
        //...
        
        //CRUD with File in realtime
        let storageConfig={ //Discord/AWS/Google....
            token:'discord-bot-token',
            channelId:'discord-channel-id'
        }
        let location='local' //discord/aws/google
        let storageRef=client?.storage?.storage(location,storageConfig).ref('/your/parent/ref')
        //storageRef.upload({object},callback)
        //...

 </script>
```
# Build Your Own JS Client Library
Note 0: Clone the repository:

``git clone https://github.com/coorise/swyger-js-client.git``


Note 1: For more details about how to use our API Consumer, visit the ``DOC`` : https://github.com/coorise/swyger-js-client/tree/master/doc/swyger/api.

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