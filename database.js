const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost', // 数据库服务器地址
    user: '', // 数据库用户名
    database: '', // 数据库名
    password: '' // 数据库密码
});

module.exports = pool.promise();
