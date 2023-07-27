## Server: Swyger Mailer with NodeJS

Visit the master branch: https://github.com/coorise/swyger-nodejs-mailer.git


Note: You must know how to use NodeJS: https://nodejs.org/en/docs/guides/getting-started-guide

**Swyger Mailer v0.1** is a good api Server for:
- SMTP Client: Sending mail


### Setup ENV Variables
Locate the <a href="https://github.com/coorise/swyger-nodejs-mailer/blob/master/.env.example">``.env.example``</a> file from the repo and create ``.env`` file at the root of your project:

- Configuration of the SMTP client
```
MAIL_HOST="mail.agglomy.com"
MAIL_SENDER=team@agglomy.com
MAIL_PASS=
MAIL_EXT=@agglomy.com
```

## @Without Docker
### Requirements:
- NodeJS v16 (https://nodejs.org/en/blog/release/v16.16.0)
- Git: https://git-scm.com/downloads

### Install Dependencies
```
git clone https://github.com/coorise/swyger-nodejs-mailer.git
cd swyger-nodejs-mailer
npm install
```
Note: Swyger Base server should also run on a different port, it is required if you will also use Swyger Mailer and Swyger Storage
- Configuration of the Mailer Server

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
- #### Pull Swyger Mailer Image
```
docker pull coorise/swyger-nodejs-mailer:0.1
```
--OR--------
- #### Build Your Own Local Image
```
git clone https://github.com/coorise/swyger-nodejs-mailer.git
cd swyger-nodejs-mailer
docker build -t coorise/swyger-nodejs-mailer:0.1 .
```
Note: The working docker directory will be in ``/home/server/swyger/mailer/``
- #### Run Image In Container with Docker
```
docker run --name swyger_mailer -p 4100:4100 --expose=4100 --add-host=host.docker.internal:host-gateway coorise/swyger-nodejs-mailer:0.1
```
Note: In case you want to create a volume:
```
cmd (Windows) : docker run  --name swyger_mailer -p 4100:4100 -v ${pwd}:/home/server/swyger/mailer/ -v "$(pwd)"/node_modules:/home/server/swyger/mailer/node_modules -d swyger/mailer:0.1
cmd (Linux) : sudo docker run --name swyger_mailer -p 4100:4100  -v "$(pwd)":/home/server/swyger/mailer/ -v "$(pwd)"/node_modules:/home/server/swyger/mailer/node_modules --add-host=host.docker.internal:host-gateway swyger/mailer:0.1
```
- #### Run Image In Container with Docker-Compose
```
docker-compose up -d
```

## @API Use Case 
You can use http request like <a href="https://www.npmjs.com/package/axios">Axios</a>. <br>
You set your server host: http://localhost:4200/api/v1/mails/send-one <br>
You also have to add in ``header``: Access-Key:"Token" <br>
The request should be ``multipart form``  with this minimum field:
```
    "from": "user1@agglomy.com",
    "to": "user2@agglomy.com"v,
    "subject": "Swyger subject"
    "html": "<div>Some fancy message</div>
    "attachements":[file1,file2,...]
```
Note to get doc, just run the project on development, then visit: http://localhost:4200/api-docs

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


