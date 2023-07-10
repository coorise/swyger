# <span style="color:red">Swyger</span>  <span style="color:blue">Auth Client JS</span>

## Get Started
Swyger Auth Client JS library is used for Swyger Server as consumer Rest API for authentication(login,register,refresh token,...) .
Visit the master branch: https://github.com/coorise/swyger-js-client-auth.git

You can download the swyger auth client js library on: https://www.unpkg.com/@swyger/client-auth

then save it somewhere in your directory like "/dist/swyger-client-auth.min.js"

```
<script type="module">
        import SwygerAuthClient from './dist/swyger-client-auth.min.js'
        //import SwygerAuthClient from '@swyger/client-auth' //with npm for node module
        let config={
            //Configure the offline DB
            OFFLINE_DB_NAME:{
                AUTH:'swyger_auth'
            },

            //Configure the server
            HOST_SERVER:{
                AUTH:'http://localhost:4100',
                
            },
            API_VERSION:{
                AUTH:'/api/v1',
            },
            AUTO_REFRESH_TOKEN_TIMEOUT:1500000, //in millisecond= 25 minutes
            // A Unique Api key for all your servers
            API_KEY:your_api_key
        }
        let client =SwygerAuthClient.init(config)
        //now you can do authentication
        let auth= client.auth
        auth.register({email,password},callback)
        auth.login({email,password},callback)
        ...

 </script>
```
# Build Your Own JS Client Library
Note 0: Clone the repository:

``git clone https://github.com/coorise/swyger-js-client-auth.git``


Note 1: For more details about how to use our API Consumer, visit the ``DOC`` : https://github.com/coorise/swyger-js-client-auth/tree/master/doc/swyger/api.

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