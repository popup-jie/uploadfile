const express = require('express');
const app = express()
const multer = require('multer')
const fs = require('fs')
// var bodyParser = require('body-parser');  用于express框架，专门来读取请求体中的键值对 POST请求

//创建储存文件夹，有则读取
var createFolder = function (folder) {
  try {
    fs.accessSync(folder);
  } catch (e) {
    fs.mkdirSync(folder);
  }
}

var uploadFolder = 'upload/' //自定义文件路径

createFolder(uploadFolder);
//设置硬盘储存，并修改文件名字
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder)
  },
  filename: function (req, file, cb) {
    let ext = file.originalname.split('.')[file.originalname.split('.').length - 1]
    cb(null, dateFtt("yyyy-MM-dd", new Date()) + '.' + ext)
  }
})

const upload = multer({ storage: storage, fileFilter });
// storage || desc: 'upload/'

// 提取post请求中的键值对
// app.use(bodyParser.urlencoded({ extended: true }));

app.get('/drop.html', (req, res) => {
  res.sendFile(__dirname + '/' + 'drop.html')
})

//如果使用 upload.array()方法的话，则请求体 req.files 为当前客户端请求的文件
//如果使用 upload.single()方法的话，则请求体 req.file 为当前客户端请求的文件
// fieldname: 'file', name 名字
// originalname: '111.txt', 文件当前名字
// encoding: '7bit',    编码
// mimetype: 'text/plain',  支持类型
// destination: 'upload/', 上传路径
// filename: '2018-04-11.txt', 上传后的名字
// path: 'upload\\2018-04-11.txt', 上传后的路径
// size: 624  文件大小，单位为： 字节
app.post('/process_post', upload.array('file'), function (req, res, next) {
  // multer 模块为，express的中间件， 只支持multipart/form-data 数据，
  // 本身也是 bodyParser 扩展，因此可以使用 req.body 获取到前端的除了 文件的其他键值对
  if (!req.next) {
    res.json({ ok: false })
    return false
  }

  res.json(req.files)

  // 循环遍历，可移动图片位置，也可以修改图片文件(覆盖操作)
  // 可以通过大小判断是否上线或者文件损坏等
  // for (let i = 0; i < req.files.length; i++) {
  //   let filename = req.files[i].path
  //   let newName = dateFtt("yyyy-MM-dd", new Date())
  //   fs.rename(filename, 'uploads/' + newName, (err) => {
  //     if (err)
  //       throw err
  //   })
  // }

  // return
})


var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})

//文件过滤
function fileFilter(req, file, cb) {

  // 如果不允许该文件上传则为 false
  // cb(null, false)

  // 如果允许该文件上传则为 true
  cb(null, true)

  // 出错后，可以在第一个参数中传入一个错误   
  // cb(new Error('I don\'t have a clue!'))
}

//时间格式化函数
function dateFtt(fmt, date) {
  var o = {
    "M+": date.getMonth() + 1,                 //月份   
    "d+": date.getDate(),                    //日   
    "h+": date.getHours(),                   //小时   
    "m+": date.getMinutes(),                 //分   
    "s+": date.getSeconds(),                 //秒   
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
    "S": date.getMilliseconds()             //毫秒   
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
} 