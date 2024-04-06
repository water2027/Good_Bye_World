const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
function addObjectToJsonFile(filePath, newObject) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('读取文件时发生错误:', err);
            return;
        }

        // 尝试解析 JSON
        let json;
        try {
            json = JSON.parse(data);
        } catch (parseErr) {
            console.error('解析 JSON 时发生错误:', parseErr);
            return;
        }

        // 假设 json 是一个数组
        json.push(newObject);

        // 将 JavaScript 对象转换为 JSON 字符串
        const jsonString = JSON.stringify(json, null, 2); // 缩进为 2 个空格，以便阅读

        // 写回文件
        fs.writeFile(filePath, jsonString, 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('写入文件时发生错误:', writeErr);
                return;
            }
            console.log('JSON 文件更新成功');
        });
    });
}
app.use('/myhtml',express.static(path.join(__dirname,'myhtml')));
app.use(express.static('public'));
app.use(express.json());

app.get('/',(req,res) => {
        res.sendFile(path.join(__dirname,'public','index.html'));
});

app.post('/create',(req,res) => {
        const { title, body, jmjx } = req.body;
        const filename = title + '.html';
        const filePath = path.join(__dirname,'public',filename);
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Water's Blog?</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link rel="stylesheet" href="main.css">
    <style>
        p{
            text-indent: 2em;
            line-height: 1.8;
            margin-top: 10px; /* 段落顶部外边距 */
            margin-bottom: 10px; /* 段落底部外边距 */
            font-size: 18px;
            color: #333;
            font-weight: 600;
        }
        article {
            background-color: #f5f5f5; /* 淡灰色背景 */
            font-family:'SimSun', '宋体', serif;
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
        <section class="w-2/3 ml-28" id="content">
            <article class="bg-white p-6 rounded-lg shadow-md mb-4">
                <h2 class="gradient-text">${title}</h2>
                ${body}
            </article>
        </section>
        <aside class="w-1/4 ml-4">
            <div class="bg-white p-4 rounded-lg shadow-md mb-4 flex items-center">
                <img class="rounded-full h-16 w-16" src="./water.png" alt="Profile picture description">
                <div class="ml-4">
                    <h3 class="font-bold rilo-text" >Water</h3>
                    <p class="text-gray-600">摆烂，摆大烂</p>
                    <div>
                            <a href="https://github.com/water2027"><span class="fancy-text">我的GitHub</span></a>
                    </div>                                                                                                              </div>
            </div>
        </aside>
    </main>

    <footer class="bg-transparent text-white p-4">
        <div class="container mx-auto">
            <a href="https://github.com/water2027" target="_blank"><span class="github">本博客项目来源地址</span></a>
    </div>
    </footer>

</body>
</html>`;

        fs.writeFile(filePath,htmlContent,(err) => {
            if(err){
                res.status(500).send({message:'文件写入失败',error: err });
                return;
            }
            res.send({ message: '文件创建成功',filename });
        });
        const now = new Date()
        let wow=now.toLocaleDateString();
        const newobject = { name : title, time: wow, glyk:jmjx };
        const jsonpath = path.join(__dirname,'public','faq.json');
        addObjectToJsonFile(jsonpath,newobject);

});

const PORT =3000;
app.listen(PORT, ()=>{
        console.log(`服务器运行在 http://localhost:${PORT}`);
});                