# <span style="color:red">Swyger</span>  <span style="color:blue">Database Client JS</span>

## Get Started
Swyger Database Client JS library is used for Swyger Server as consumer Rest API for CRUD operation in realtime!.
Visit the master branch: https://github.com/coorise/swyger-js-client-database.git

You can download the swyger database client js library on: https://www.unpkg.com/@swyger/client-database

then save it somewhere in your directory like "/dist/swyger-client-database.min.js"
```
<script type="module">
        import SwygerDatabaseClient from './dist/swyger-client-database.min.js'
        //import SwygerDatabaseClient from '@swyger/client-database' //with npm for node module

        let config={
            //Configure the offline DB
            OFFLINE_DB_NAME:{
                DATABASE:'swyger_database'
            },

            //Configure the server
            HOST_SERVER:{
                AUTH:ClientConfig?.HOST_SERVER?.AUTH||'http://localhost:4100', //Required for protected route
                DATABASE:'http://localhost:4400',
            },
            API_VERSION:{
                AUTH:'/api/v1',
                DATABASE:'/api/v1',
            },
            // A Unique Api key for all your servers
            API_KEY:your_api_key
        }
        let client =SwygerDatabaseClient.init(config)
        
        
        //crud for database
        let database=client.database.ref('/my/path/reference') //like firebase database realtime
        database.create({object},callback)
        //OR listener
        //ref.onValue(callback)
        ...
        

 </script>
```
# Build Your Own JS Client Library 
Note 0: Clone the repository: 

``git clone https://github.com/coorise/swyger-js-client-database.git``


Note 1: For more details about how to use our API Consumer, visit the ``DOC`` : https://github.com/coorise/swyger-js-client-database/tree/master/doc/swyger/api.

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