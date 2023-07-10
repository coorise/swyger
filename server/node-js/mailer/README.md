##About Docker
Note: 
```
cmd: docker run container-name:version 
```
(if the image doesn't exist in local, it will try to 
download externally to https://hub.docker.com/)

##For node docker image 

visit: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

Note: node:alpine = is the lightest linux distribution


##Create docker image
```
cmd : docker build -t agglopy/auth:1.0 .
```
-t = for tag , eg: -t aminity:1.0

. = current dir

##Show docker images list
```
cmd: docker image ls
cmd: docker images
```
##Show docker process list
```
cmd: docker ps -a
```
##Run docker image container
```
cmd : docker run admin-backend
```
##Run docker container with interactive native linux shell
```
cmd : docker run  admin-backend -it
```
##Run docker with exposing host
```
cmd : docker run --name admin-backend -p 27017:27017 
-p 127.0.0.1:3306:3306 --expose=3500 --expose=3306 
--expose=27017 -d admin-backend
```
. -p = redirect right public(express) port to left private(docker) port , means outside docker

. --expose = expose between containers

. -d = for running in background

You can use a following logs with:
```
cmd : docker logs --follow Container-name
```

##For myphpadmin and mysql docker:

visit: https://hub.docker.com/r/phpmyadmin/phpmyadmin/

visit: https://www.howtogeek.com/devops/how-to-run-phpmyadmin-in-a-docker-container/

```
cmd : docker run -p 3307:3306 --name mysql -e MYSQL_ROOT_PASSWORD=mypass123 -d mysql:8.0.1
```
```
cmd : docker run -d --name phpmyadmin --link mysql:db -p 8081:80 phpmyadmin/phpmyadmin
```


##For mongo db docker:

visit:https://phoenixnap.com/kb/docker-mongodb

visit: https://www.mongodb.com/compatibility/docker

```
cmd : docker run -p 28017:27017 -it -v mongodata:/data/db --name mongodb -d mongo
```

Then create your database name for each databese server 

##For docker compose: 
docker-compose.yaml

then,
```
cmd : docker-compose up
```

## For mounting project with volume:

To see the default shared the folder directory:
visit:https://stackoverflow.com/questions/30723839/where-are-docker-images-and-containers-stored-when-we-use-it-with-windows

``Windows``: \\wsl$\docker-desktop-data\mnt\wsl\docker-desktop-data\data\docker\volumes

``Linux``: sudo ls /mnt/wsl/docker-desktop-data/data/docker/volumes

-----IN DEVELOPMENT MODE--------------

Note: For our node js project we added in package.json , "nodemon -L"
 the -L for -legacy-watch when running in container.

To run container and share the folder:
```
cmd (Windows) : docker run --name agglopy-auth -p 3500:80 -v ${pwd}:/home/server/auth/v1.0/agglopy_auth/ -v agglopy-auth-v1.0:/home/server/auth/v1.0/agglopy_auth/node_modules -d agglopy/auth:1.0
cmd (Linux) : sudo docker run --name agglopy-auth-v1.0 -p 3500:80  -v "$(pwd)":/home/server/auth/v1.0/agglopy_auth/ -v agglopy-auth-v1.0:/home/server/auth/v1.0/agglopy_auth/node_modules --add-host=host.docker.internal:host-gateway agglopy/auth:1.0
```
the second "-v agglopy-auth-v1.0:/home/server/auth/v1.0/agglopy_auth/node_modules"
volume  is to tell he will keep using /node_modules from docker folder
because some bugs occured with modules whih require OS, 
check this blog:
https://www.richardkotze.com/top-tips/install-bcrypt-docker-image-exclude-host-node-modules

Some note about shortcut directory:
``Windows``: "%cd%" = current dir with CMD

``Windows``: ${pwd} = current dir with PowerShell

``Linus``: "$(pwd)" = current dir

-v : -v [custom-name-of-mount]:[path-of-your-working-dir-in-your-container-from-Dockerfile]

-----IN PRODUCTION MODE--------------
eg: -v my-custom-name:/working-path

```
cmd: docker run --name agglopy-auth -p 3500:80 -v agglopy-auth-v1.0:/home/server/auth/v1.0/agglopy_auth/ -d agglopy/auth:1.0
```

##About VPS
Once you get a new VPS
0. Let update packages
```
cmd: sudo apt update
```

1.First change your password:
```
cmd: passwd (hit enter)
```
then follow dialog

2.Change your ssh port:
```
cmd: sudo nano /etc/ssh/sshd_config
```
in the file:
```
...
#Port 22 (uncomment and change port)
```
then restart your vps
```
cmd: sudo reboot
```

##Make SFTP in your linux VPS
Visit: https://www.fosslinux.com/39228/how-to-set-up-an-sftp-server-on-linux.htm

1.Go to ssh config
```
cmd: sudo nano /etc/ssh/sshd_config
```
then at the end of the file:
```
...
Match group root 
ChrootDirectory / 
```

then:
```
cmd: sudo systemctl restart ssh
```
2. Add/Update User and Group

To add a group (should match with sshd_config file):
```
cmd: sudo addgroup my_group
```
then to add a new user to a group:
```
cmd: sudo useradd -m new_user -g my_group
```
-m:means create user home with his name as directory  (/home/new_user),
so he will have a permission 755 = rwxr-xr-x (owner-group-others)

then set him a new password:
```
cmd: sudo passwd new-user (hit enter and follow the screen dialog)
```
For an existing user
```
cmd: sudo usermod -a old_user -G my_group
```
-a : means append , so it will add this to his existing list group else other groups will be deleted

You can also give some folder priority:
```
cmd: sudo chmod 700 /home/new_user/
---OR----
cmd: sudo chmod -R 700 /home/new_user/
```
-R= if you want sub-folders to have the same permissions as parent

-700: means full control [write,read,execute], so:
```
Owner: rwx = 4+2+1 = 7
Group: r-x = 4+0+1 = 5
Other: r-x = 4+0+1 = 5
```
You can visit: https://linuxize.com/post/umask-command-in-linux/

List folders with their permissions:

```
cmd: ls -al
```
or mask
```
cmd: umask
>> eg : 0002
```
sometimes mask are hidden, then
```
cmd: sudo su
cmd: umask
>> eg : 0022
```


 Use ACL (to control user and folder permissions)
```
cmd: sudo apt install acl
```
```
cmd: sudo setfacl -R -m user:rwx -d /your_dir
cmd: sudo setfacl -R -m group:rwx -d /your_dir
```
-R = for recursive folder
-m = modify

Change the owner of folder
```
cmd: sudo chown user  /your_dir
cmd: sudo setfacl group /your_dir
cmd: sudo setfacl user:group /your_dir
```

Access to Super user mode:
```
cmd: sudo su
cmd to quit: exit
```


###Explore SFTP files with Windows
Download ``WinFsp``: https://github.com/winfsp/winfsp/releases
Download ``SSHF-Win``: https://github.com/winfsp/sshfs-win/releases

About root directory:https://github.com/winfsp/sshfs-win/issues/12

-Right-click on ``This PC`` , then ``Map Network drive``
in the field: ``\\sshfs\user@host!port\..\..``  ( '..\..\' means location should start at the root folder)



###About Git

Configure a global Environment
Your name:

```
cmd: git config --global user.name "Sobgui"
```
Your emai:
```
cmd: git config --global user.email "username@gmail.com"
```
To generate key and set where to save it:
```
cmd: ssh-keygen -o -t rsa -C "username@gmail.com"
```


Clone your repository with ssh key:


```
cmd: git clone ssh://git@146.59.229.245:222/Sobgui/agglomy-backend.git (In case you didn't set the default directory of your key , it is savde in default : user/.ssh/)

cmd: git -c core.sshCommand="ssh -i agglomy" clone ssh://git@146.59.229.245:222/Sobgui/agglomy-backend.git (With your custom path for your private key)

```

### SSL Certificate with Docker (NGINX - Lets-Encrypt)
visit: https://www.programonaut.com/setup-ssl-with-docker-nginx-and-lets-encrypt/

```
cmd: docker run --name nginx -p 80:80 -p 443:443 -v "$(pwd)"/certificate/nginx/nginx.conf:/etc/nginx/nginx.conf nginx:1.15-alpine
```

### Node for production
To not install the dev package, just type:
```
cmd: npm prune install
cmd: npm prune --production
```
