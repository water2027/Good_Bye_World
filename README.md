
### 第一步
```
git clone https://github.com/water2027/Good_Bye_World.git
cd Good_Bye_World
```

### 安装npm、node
需要npm和node，如果没有，请安装。推荐使用高版本的node，我当时使用12.x的版本会报错。
```
sudo apt update
sudo apt upgrade
```
```
sudo apt install npm
sudo apt install node
```
可以使用`npm -v`和`node -v`检查是否安装

###安装并配置mysql
```
sudo apt install mysql-server
```
配置mysql
```
sudo mysql_secure_installation
```
登录到mysql
```
sudo mysql -u root -p
```
root用户没有密码，至少我当时是这样的，我选择了新建用户并设置密码。
```
CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'password';
```
用你想要的用户名替换newuser，密码替换password。
之后登录把之前的root改成你新建的用户名就可以了。
然后登录mysql，新建数据库、数据表。
```
create database 库名;
```
注意分号。使用新库：
```
use 库名
```
新建两个表，如果有需要可以更改配置。
```
create table posts (id INT AUTO_INCREMENT,title VARCHAR(50) NOT NULL,jmjx TEXT,body TEXT NOT NULL,tag VARCHAR(50),created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
create table reply (id INT AUTO_INCREMENT,title VARCHAR(50) NOT NULL,name VARCHAR(50) NOT NULL,reply TEXT NOT NULL);
```
这样就配置好MySQL了，大概。

###安装express和mysql2
```
npm install express
npm install mysql2
npm init
```
在这里一直回车就行，或者在使用`npm init -y`



这里基本上完成了，然后进行nginx配置，或者用别的什么。

配置文件：
```
server {
        listen 80;
        server_name 你的ip或者域名;

        root /var/www/boke/public;

        location / {
                try_files $uri $uri/ /index.html;
        }

        location /api/ {
                proxy_pass http://localhost:3000;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        }
}
```
然后检查并重启nginx
```
sudo nginx -t
sudo systemctl restart nginx
```
要放开相应的端口，然后就可以使用ip或者域名访问了，大概。   
记得启动app.js
```
node app.js
```
如果要后台运行的话，使用这个
```
nohup node app.js &
```
