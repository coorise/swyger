## Server: Swyger Base with NodeJS

Visit the aster branch: https://github.com/coorise/swyger-nodejs-base.git


Note: You must know how to use NodeJS: https://nodejs.org/en/docs/guides/getting-started-guide

**Swyger Base v0.1** is a good api Server for:
- CRUD: Create/Read/Update/Delete in realtime

### Requirements:
- NodeJS v16 (https://nodejs.org/en/blog/release/v16.16.0)
- Database Server: MongoDB(https://www.mongodb.com/try/download/community) / MySQL(https://dev.mysql.com/downloads/mysql/) /...etc
- Docker(https://www.docker.com/products/docker-desktop/) and docker-compose(https://docs.docker.com/compose/install/) in case you want to add it in container

### Install Dependencies
```
npm install
```
Note: Don't update the ``"acebase-server": "^1.16.2"``, because we edited it for our server! We noticed that their web manager UI is working with online resources, so we made it offline.

### Setup ENV Variables
Locate the ``.env`` file or create it at the root of your project:


- Configuration of Swyger Base

To generate token: ``npm run generate:key -- --secret yoursecret --with-env`` or generate it online, visit https://www.javainuse.com/jwtgenerator

```
AUTH_ADMIN_TOKEN=token 
ACE_HOST=localhost
ACE_PORT=3100
ACE_NAME=swyger
ACE_ENABLE_HTTPS=false
ACE_USER=admin
ACE_PASS=SwygerBase@123
```
Note: Swyger Base server should also run on a different port and it is used by Swyger Auth/Database/Storage!


### Create a custom API automatically
It will create a file in ``./src/app/api_builder/typeorm``
```
npm run swyger -- --create api --name nameOfApi
```
Note: You can see the file ``./src/app/services/api/builder/typeorm/cmd.js`` (Still in test)

### Run In Development Mode
```
npm run dev
```

### Run In Production Mode
```
npm run build
npm run prod
# OR
npm run start
```
### Run In Docker

A ``Dockerfile`` and ``docker-compose.yaml`` are located at the root of your project
- #### Build Image
```
docker build -t swyger/base:0.1 .
```
Note: The working docker directory will be in ``/home/server/swyger/base/``
- #### Run Image In Container with Docker
```
docker run --name swyger_base -p 4100:4100 --expose=4100 --add-host=host.docker.internal:host-gateway swyger/base:0.1
```
Note: In case you want to create a volume:
```
cmd (Windows) : docker run  --name swyger_base -p 4100:4100 -v ${pwd}:/home/server/swyger/base/ -v "$(pwd)"/node_modules:/home/server/swyger/base/node_modules -d swyger/base:0.1
cmd (Linux) : sudo docker run --name swyger_base -p 4100:4100  -v "$(pwd)":/home/server/swyger/base/ -v "$(pwd)"/node_modules:/home/server/swyger/base/node_modules --add-host=host.docker.internal:host-gateway swyger/base:0.1
```
- #### Run Image In Container with Docker-Compose
```
docker-compose up -d
```

### Api Doc

Once the server is running in ``development mode ``and everything is ok, visit: http://localhost:3100/docs
### Web Database Manager

Once the server is running and everything is ok, visit: http://localhost:3100/webmanager/



# Some References
- TypeOrm: https://typeorm.io/
- DotEnv: https://www.npmjs.com/package/dotenv
- Acebase Client: https://www.npmjs.com/package/acebase-client
- SocketIo: https://www.npmjs.com/package/socket.io
- Glob: https://www.npmjs.com/package/glob
- Json Joi Converter: https://www.npmjs.com/package/json-joi-converter
- Node Json DB: https://www.npmjs.com/package/node-json-db

# Issues
- some bugs still remain
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


