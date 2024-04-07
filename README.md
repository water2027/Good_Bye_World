
### 第一步
```
git clone https://github.com/water2027/Good_Bye_World.git
cd Good_Bye_World
```

### 第二步
需要npm和node，如果没有，请安装
```
sudo apt update
sudo apt upgrade
```
```
sudo apt install npm
sudo apt install node
```
可以使用`npm -v`和`node -v`检查是否安装

安装express
```
npm install express
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
