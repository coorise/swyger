## Server: Swyger Storage with NodeJS

Visit the master branch: https://github.com/coorise/swyger-nodejs-storage.git


Note: You must know how to use NodeJS: https://nodejs.org/en/docs/guides/getting-started-guide

**Swyger Storage v0.1** is a good api Server for:
- CRUD: Create/Read/Update/Delete file
- Realtime Event: on value/create/delete/update


### Setup ENV Variables
Locate the <a href="https://github.com/coorise/swyger-nodejs-storage/blob/master/.env.example">``.env.example``</a> file from the repo and create ``.env`` file at the root of your project:

- Configuration of MongoDB
```
DB_NAME=swyger_storage
DB_HOST=localhost
DB_PORT=27017
DB_USERNAME=root
DB_PASSWORD=
```

Note: If you want to add more storages (MySQL, etc...), clone the repo then go in ``./src/app/config/storage/typeorm/typeorm.db-list.js``
And you also have to set your drive read/write ``./src/app/config/storage/typeorm/data.drive-manager.js``
- Configuration of Swyger Base
```
ACE_HOST=localhost
ACE_PORT=3100
ACE_NAME=swyger
ACE_ENABLE_HTTPS=false
ACE_USER=admin
ACE_PASS=SwygerBase@123
```
## @Without Docker
### Requirements:
- NodeJS v16 (https://nodejs.org/en/blog/release/v16.16.0)
- Storage Server: MongoDB(https://www.mongodb.com/try/download/community) / MySQL(https://dev.mysql.com/downloads/mysql/) /...etc
- Git: https://git-scm.com/downloads

### Install Dependencies
```
git clone https://github.com/coorise/swyger-nodejs-storage.git
cd swyger-nodejs-storage
npm install
```
Note: Swyger Base server should also run on a different port, it is required if you will also use Swyger Storage and Swyger Storage
- Configuration of the Storage Server

To generate token: ``npm run generate:key -- --secret yoursecret --with-env`` or generate it online, visit https://www.javainuse.com/jwtgenerator

```
NODE_ENV=development #or production
AUTH_ADMIN_TOKEN=token 
APP_VERSION=0.2
HOST=0.0.0.0
PORT=4100
```

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

### Run In Production Modes
```
npm run build
npm run prod
# OR
npm run start
```
##  @With Docker
### Requirements:
- Docker(https://docs.docker.com/get-docker/) and docker-compose(https://docs.docker.com/compose/install/) in case you want to add it in container
- Git: https://git-scm.com/downloads

### Run In Docker

A ``Dockerfile`` and ``docker-compose.yaml`` are located at the root of your project
- #### Pull Swyger Storage Image
```
docker pull coorise/swyger-nodejs-storage:0.1
```
--OR--------
- #### Build Your Own Local Image
```
git clone https://github.com/coorise/swyger-nodejs-storage.git
cd swyger-nodejs-storage
docker build -t coorise/swyger-nodejs-storage:0.1 .
```
Note: The working docker directory will be in ``/home/server/swyger/storage/``
- #### Run Image In Container with Docker
```
docker run --name swyger_storage -p 4100:4100 --expose=4100 --add-host=host.docker.internal:host-gateway coorise/swyger-nodejs-storage:0.1
```
Note: In case you want to create a volume:
```
cmd (Windows) : docker run  --name swyger_storage -p 4100:4100 -v ${pwd}:/home/server/swyger/storage/ -v "$(pwd)"/node_modules:/home/server/swyger/storage/node_modules -d swyger/storage:0.1
cmd (Linux) : sudo docker run --name swyger_storage -p 4100:4100  -v "$(pwd)":/home/server/swyger/storage/ -v "$(pwd)"/node_modules:/home/server/swyger/storage/node_modules --add-host=host.docker.internal:host-gateway swyger/storage:0.1
```
- #### Run Image In Container with Docker-Compose
```
docker-compose up -d
```

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
- Swagger UI v4.1.3 only is compatible with Docker Container (due to cors)
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


