# Swyger Server

Visit the master branch: https://github.com/coorise/swyger-nodejs-server.git


<a href="https://github.com/coorise/swyger-nodejs-server.git">**Swyger NodeJS Server**</a> is best for all your projects.It has everything to get started!
Note1: You must know how to use NodeJS: https://nodejs.org/en/docs/guides/getting-started-guide
Note2: We made modulable parts for the server with multiple port for auth,database and storage.

### Requirements:
- NodeJS v16 (https://nodejs.org/en/blog/release/v16.16.0)
- Git: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
- Database Server: MongoDB(https://www.mongodb.com/try/download/community) / MySQL(https://dev.mysql.com/downloads/mysql/) /...etc
- Docker(https://www.docker.com/products/docker-desktop/) and docker-compose(https://docs.docker.com/compose/install/) in case you want to add it in container

## Running with docker compose
```
docker-compose -f docker-compose.yaml -d
##For development and in local
docker-compose -f docker-compose-local-dev.yaml -d
```
Note: If you want to run on local or in dev , you have to clone this repo: ``git clone https://github.com/coorise/swyger-nodejs-server.git`` , <br>
then make sure do ``npm install`` for each module(base,auth,database,storage...),<br>
finally do set the docker-compose with a proper ``volume`` for each module with their ``node_modules``
```
docker-compose -f docker-compose-local-dev.yaml -d
```

OR RUN MANUALLY
## Step 1: SwygerBase
SwygerBase is used to store data in json(required for database and storage server).
Go to ``./base``, read the ``README.md`` file at the root of project there to set the ``.env`` file then in your cmd, type:
```
npm i
npm start
```
Note: In case you won't use Database or Storage server and you want only Auth server, you can skip this step.
## Step 2: Swyger Auth
Auth is used to make authentication: register/login
Go to ``./auth``, read the ``README.md`` file at the root of project there to set the ``.env`` file then in your cmd, type:
```
npm i
npm start
```
## Step 3: Swyger Database
Database is used to do crud whether with Base/MongoDb/MySQL...
Go to ``./database``, read the ``README.md`` file at the root of project there to set the ``.env`` file then in your cmd, type:
```
npm i
npm start
```
## Step 4: Swyger Storage
Storage is used to do crud with your file. Actually available location are Discord/Local
Go to ``./storage``, read the ``README.md`` file at the root of project there to set the ``.env`` file then in your cmd, type:
```
npm i
npm start
```
## Step 5: Swyger Is Ready !!!!
Visit docs for each server.
If everything is correct, you can consume it with client side!

Note: For each server, there is an env variable called ``AUTH_ADMIN_TOKEN``, you have to generate 'only one token' from one server then share it for other servers.

# Todo
- Removing/Reduce some unusual dependencies,functions, refactoring paths/files...
- Making good and easy documentation with tutorials (videos, webpage...)
- Code Cleaning/ Making a suitable project structure with modulable pattern
- Making Docker file for the whole project (auth,base,database,storage...)

# Join US
If you have any suggestion, feature to add ...etc
- Discord(Support Team, FAQ, Chat): https://discord.gg/PPTZY5qFdC

# Contributors
- Agglomy Team :
  - Ivan Joel Sobgui
# Licence

MIT: You can use it for educational/personal/business purpose!