const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const db = require('./database');
function addPost(newPost) {
    // 假设 time 字段由数据库自动生成
    return db.execute('INSERT INTO posts (title, jmjx, body, tag) VALUES (?, ?, ?, ?)',
                      [newPost.title, newPost.jmjx, newPost.body, newPost.tag]);
}

function addReply(newreply){
    return db.execute('INSERT INTO reply (title,name,reply) VALUES (?, ?, ?)',
    [newreply.title, newreply.name, newreply.reply])
}

function deletePost(title) {
    return db.execute('DELETE FROM posts WHERE title = ?', [title]);
}

function delreply(dereply){
    return db.execute('DELETE FROM reply WHERE title = ? AND name = ? AND reply = ?',[dereply.title,dereply.name,dereply.reply])
}

app.use('/myhtml', express.static(path.join(__dirname, 'myhtml')));
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/posts',(req,res)=>{
        //从数据库获取数据
        db.execute('SELECT * FROM posts ORDER BY created_at DESC')
            .then(([rows])=>{
                res.json(rows);
            })
            .catch(err=>{
                res.status(500).send({message:'error:',error:err})
            });
});

app.post('/api/create',async (req, res) => {
try{
    const { title, jmjx, body, tag } = req.body;

    const foldpath = path.join(__dirname,'public',title);
    await fs.promises.mkdir(foldpath,{recursive:true});

    const filename = title + '.html';
    const filePath = path.join(__dirname, 'public', title, filename);
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Water's Blog?</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
        <link rel="stylesheet" href="../main.css">
        <style>
            p {
                text-indent: 2em;
                line-height: 1.8;
                margin-top: 10px;
                margin-bottom: 10px;
                font-size: 18px;
                color: #333;
                font-weight: 600;
            }
            article {
                background-color: #f5f5f5;
                /* 淡灰色背景 */
                font-family: 'SimSun', '宋体', serif;
            }
            #click {
                background-color: #007bff;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
            }
        </style>
    </head>

    <body class="star-pattern">

        <header class="bg-transparent text-white p-4">
            <div class="container mx-auto">
                <h1 class="github">blog</h1>
            </div>
        </header>

        <main class="container mx-auto flex justify-between p-4">
            <section class="w-2/3 ml-28">
                <article class="bg-white p-6 rounded-lg shadow-md mb-4" id="content">
                </article>
                <textarea id="name" cols="10" rows="1" placeholder="不会真的有人填真名吧？"></textarea>
                <textarea id="reply" cols="10" rows="1" placeholder="想说点什么吗？"></textarea>
                <button id="click">点我留言，速</button>
                <div id="lqyj"></div>
            </section>
            <aside class="w-1/4 ml-4">
                <div class="bg-white p-4 rounded-lg shadow-md mb-4 flex items-center">
                    <img class="rounded-full h-16 w-16" src="../water.png" alt="Profile picture description">
                    <div class="ml-4">
                        <h3 class="font-bold rilo-text">Water</h3>
                        <p class="text-gray-600">摆烂，摆大烂</p>
                        <div>
                            <a href="https://github.com/water2027"><span class="fancy-text">我的GitHub</span></a>
                        </div>
                    </div>
                </div>
            </aside>
        </main>

        <footer class="bg-transparent text-white p-4">
            <div class="container mx-auto">
                <a href="https://github.com/water2027" target="_blank"><span class="github">本博客项目来源地址</span></a>
            </div>
        </footer>
        <script>
            const title = '${title}';
            const button = document.getElementById('click');
            function dele(name, reply, title) {
                fetch('/api/delreply', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, reply, title }),
                })
                    .then(response => response.json())
                    .then(data => {

                        console.log('删除成功?');
                        get_reply();
                    })
                    .catch((error) => {
                        console.log('失败了?' + error);
                    });
            }
            function get_reply() {
                const lqyj = document.getElementById('lqyj');
                lqyj.innerHTML='';
                fetch('/api/getreply?title='+ encodeURIComponent(title),{
                    method: 'GET'
                })
                    .then(response => response.json())
                    .then(data => {
                        for (let i=data.length-1;i>=0;i--){
                            let item = data[i];
                            const lq = document.createElement('article');
                            lq.className = 'bg-white p-6 rounded-lg shadow-md mb-4';
                            const name = document.createElement('h2');
                            name.className = 'text-xl font-bold mb-2 gradient-text';
                            name.innerHTML = item.name
                            const reply = document.createElement('p');
                            reply.className = 'text-gray-600 text-sm sea';
                            reply.innerHTML = item.reply;
                            const del = document.createElement('button');
                            del.innerHTML = '删除';
                            del.addEventListener('click', () => {
                                dele(item.name, item.reply, title);
                            });
                            lq.appendChild(name);
                            lq.appendChild(reply);
                            lq.appendChild(del);
                            lqyj.appendChild(lq);
                        }
                    });
            }
            button.addEventListener('click', () => {
                const name = document.getElementById('name').value;
                const reply = document.getElementById('reply').value;
                fetch('/api/reply', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title, name, reply }),
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('留言成功?');
                        get_reply();
                    })
                    .catch((error) => {
                        console.log('失败了?' + error);
                    });
            });

            document.addEventListener('DOMContentLoaded', async () => {
                fetch('/api/getart?title='+ encodeURIComponent(title), {
                    method: 'GET'
                })
                    .then(response => response.json())
                    .then(data => {
                        const content = document.getElementById('content');
                        const h1 = document.createElement('h1');
                        h1.className = 'gradient-text';
                        h1.innerHTML = data.title;
                        const p = document.createElement('p');
                        p.innerHTML = data.body;
                        content.appendChild(h1);
                        content.appendChild(p);
                    })
                    .catch((error) => {
                        console.log('失败了?' + error);
                    });
                await get_reply();
            });

        </script>
    </body>

    </html>`;

    await fs.promises.writeFile(filePath, htmlContent,'utf-8');
    await addPost(req.body);

    res.send({message:'成功',filename});
}catch(err){
        console.error(err);
        res.status(500).send({message:'失败',error:err});
}
});

app.post('/api/reply',async (req, res) => {
    try{
        const {title, name, reply} = req.body;
        await addReply(req.body);
        res.status(200).send({message:'成功'});
    }catch(err){
        console.error(err);
        res.status(500).send({message:'失败',error:err});
    }
});

app.post('/api/delreply',async (req,res)=>{
    try{
        const {name,reply,title} = req.body;

        await delreply(req.body);
        res.status(200).send({message:'成功'});
    }catch(err){
        console.error(err);
        res.status(500).send({message:'失败',error:err});
    }
})

app.post('/api/del',async (req, res) => {
    const {title}=req.body;
    await fs.promises.rm(path.join(__dirname, 'public', title), { recursive: true });
    await deletePost(title);
});

app.get('/api/getart', (req, res) => {
    const { title } = req.query;
    db.execute('SELECT title, body FROM posts WHERE title = ?', [title])
        .then(([rows]) => {
            // 判断是否找到了文章
            if (rows.length > 0) {
                res.json(rows[0]);
            } else {
                res.status(404).send('文章未找到');
            }
        })
        .catch(err => {
            // 处理查询过程中可能出现的错误
            console.error('数据库查询失败', err);
            res.status(500).send('内部服务器错误');
        });
});

app.post('/api/update', (req, res) => {
    const { title, newbody } = req.body;
    console.log(title)
    console.log(newbody)
    // 检查 title 和 body 是否存在
    if (title === undefined || newbody === undefined) {
        return res.status(400).send({ message: '缺少必要的参数' });
    }

    db.execute('UPDATE posts SET body = ? WHERE title = ?', [newbody, title])
        .then(result => {
            if (result[0].affectedRows > 0) {
                res.send({ message: '更新成功' });
            } else {
                res.status(404).send({ message: '未找到相应标题的帖子' });
            }
        })
        .catch(err => {
            console.error('数据库操作失败', err);
            res.status(500).send({ message: '内部服务器错误' });
        });
});

app.get('/api/getreply',(req,res)=>{
    const {title} = req.query;
    db.execute('SELECT name, reply FROM reply WHERE title = ?', [title])
        .then(([rows]) => {
            // 判断是否找到了文章
            if (rows.length > 0) {
                res.json(rows);
            } else {
                res.status(404).send('文章未找到');
            }
        })
        .catch(err => {
            // 处理查询过程中可能出现的错误
            console.error('数据库查询失败', err);
            res.status(500).send('内部服务器错误');
        });
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});
