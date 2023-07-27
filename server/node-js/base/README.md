## Server: Swyger Base with NodeJS

Visit the aster branch: https://github.com/coorise/swyger-nodejs-base.git


Note: You must know how to use NodeJS: https://nodejs.org/en/docs/guides/getting-started-guide

**Swyger Base v0.1** is a good api Server for:
- CRUD: Create/Read/Update/Delete in realtime

### Setup ENV Variables
Locate the <a href="https://github.com/coorise/swyger-nodejs-base/blob/master/.env.example">``.env.example``</a> file from the repo and create ``.env`` file at the root of your project:
- Configuration of Acebase Server
```
AUTH_ADMIN_TOKEN=token 
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
- Database Server: MongoDB(https://www.mongodb.com/try/download/community) / MySQL(https://dev.mysql.com/downloads/mysql/) /...etc
- Git: https://git-scm.com/downloads
- 
### Install Dependencies
```
git clone https://github.com/coorise/swyger-nodejs-base.git
cd swyger-nodejs-base
npm install
```

- Configuration of Swyger Base

To generate token: ``npm run generate:key -- --secret yoursecret --with-env`` or generate it online, visit https://www.javainuse.com/jwtgenerator

Note: Swyger Base server should also run on a different port and it is used by Swyger Auth/Database/Storage!

### Run In Production Mode
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
- #### Pull Swyger Base Image
```
docker pull coorise/swyger-nodejs-base:0.1
```
--OR--------
- #### Build Your Own Local Image
```
git clone https://github.com/coorise/swyger-nodejs-base.git
cd swyger-nodejs-base
docker build -t coorise/swyger-nodejs-base:0.1 .
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


