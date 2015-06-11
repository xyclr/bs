var crypto = require('crypto'),
    fs = require('fs-extra'),
    Sys = require('../models/sys.js'),
    User = require('../models/user.js'),
    async = require('async'),
    multer  = require('multer'),
    settings = require('../settings');


/* 获取Http时间（2012-12-21 19:30形式） */
Date.prototype.getHttpTime = function(){
    return this.getFullYear() + '-' + (this.getMonth()+1) + '-' + this.getDate() +  ' ' + this.getHours() + ':' + this.getMinutes() ;
};


module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index', {
            title: '主页',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.get('/file', function (req, res) {
        var path = settings.uploadPath,fileInfo = [];
        console.info(settings.uploadPath);
        explorer(path);
        function explorer(path){
            fs.readdir(path, function(err, files){
                //err 为错误 , files 文件名列表包含文件夹与文件
                if(err){
                    console.log('error:\n' + err);
                    return;
                };
                files.forEach(function(file){

                    fs.stat(path + '/' + file, function(err, stat){
                        if(err){console.log(err); return;}
                        if(stat.isDirectory()){
                            // 如果是文件夹遍历
                        }else{
                            // 读出所有的文件
                        };
                        fileInfo.push(file);
                    });
                });

                var Timer = true;
                setInterval(function(){
                    if(fileInfo.length == files.length && Timer) {
                        res.render('file', {
                            title: 'file',
                            user: req.session.user,
                            fileInfo : fileInfo,
                            success: req.flash('success').toString(),
                            error: req.flash('error').toString()
                        });
                        Timer = false;
                    }

                },1000);
            });
        }
    });
    app.get('/file/:name', function (req, res){
        var  filename = req.params.name;
        var path = settings.uploadPath + '/' + filename,fileInfo = {};
        fs.readdir(path, function(err, files){
            //err 为错误 , files 文件名列表包含文件夹与文件
            if(err){
                console.log('error:\n' + err);
                return;
            };
            files.forEach(function(file){

                fs.stat(path + '/' + file, function(err, stat){
                    //console.info(stat);
                    //创建一个对象保存信息
                    var obj = new Object();
                    obj.size = (stat.size/1024).toFixed(2) +"/kb";//文件大小，以字节为单位
                    obj.name = file;//文件名
                    obj.path = path+'/'+file; //文件绝对路径
                    obj.ext = (file + "").split(".").pop();
                    obj.type = "file";
                    obj.time = stat.mtime.getHttpTime();

                    if(err){console.log(err); return;}

                    if (obj.ext && obj.ext.search(/gif|jpg|png|ico/ig)!=-1) {
                        obj.type = "img"
                    }
                    console.info(obj)
                    fileInfo[obj.name] = obj;
                });
            });

            var Timer = true;
            setInterval(function(){
                if(count(fileInfo)  == files.length && Timer) {
                    // res.writeHead(200, {'Content-type' : 'text/html'});
                    res.json({"fileInfo": fileInfo});
                    res.end('');
                    Timer = false;
                }

            },1000);
        });

        function count(o){
            var t = typeof o;
            if(t == 'string'){
                return o.length;
            }else if(t == 'object'){
                var n = 0;
                for(var i in o){
                    n++;
                }
                return n;
            }
            return false;
        };

    });

    app.get('/st', function (req, res) {

    });



    app.get('/upload', function (req, res) {
        res.render('upload', {
            title: 'upload',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });



    app.post('/upload',function(req, res) {
        var  subpath = req.params.name;
        //console.info(req.body.name);
        //console.info(req.body.src);
        //console.info(realpath);
        //console.info(req.files)
        var obj = req.files;
        var realpath = settings.uploadPath + req.body.src;
        var tmp_path = obj.file.path;
        var new_path =  realpath + "/" +obj.file.name;
        // console.log("原路径："+tmp_path);
        //console.log("新路径："+new_path);
        fs.move(tmp_path, new_path, function (err) {
            var scriptStr = '<script>parent.submitCb("success","upload success!",'+ '"'+req.body.src+'"'+')</script>';
            if (err)  {
                res.write('<script>parent.submitCb("error",err)</script>')
                return console.error(err);
            } else {
                console.log("success!");

                res.write(scriptStr);
            };
            res.end("")

        });
    });

    app.post('/fileDel',function(req, res) {
        req.body.delList.forEach(function (name) {
            fs.unlink(settings.uploadPath + req.body.delFilePath + "/" + name, function (err) {
                if (err) {
                    throw err;
                }
                console.log('文件:' + name + '删除成功！');
                res.end("over")
            });
        });
    });




    app.get('/sys', checkLogin);
    app.get('/sys', function (req, res) {
        Sys.get("settings1", function (err, sys) {
            if (err) {
                sys = [];
            }
            if(!sys) {
                res.render('sys', {
                    title: '系统设置',
                    user: req.session.user,
                    sys : {settings :Sys.initCfg },//加载默认配置
                    success: req.flash('success').toString(),
                    error: req.flash('error').toString()
                });


                var sys = new Sys("settings1",Sys.initCfg);

                sys.save(function (err) {
                    if (err) {
                        req.flash('error', err);
                        return res.redirect('/');
                    }
                });

            } else {
                res.render('sys', {
                    title: '系统设置',
                    user: req.session.user,
                    sys : sys,
                    success: req.flash('success').toString(),
                    error: req.flash('error').toString()
                });
            }

        });

    });

    app.post('/sys', checkLogin);
    app.post('/sys', function (req, res) {
        Sys.update("settings1",req.body.settingArr, function (err) {
            if (err) {
                req.flash('error', err);
                res.redirect('/sys');
            }
            req.flash('success', '修改成功!');
            res.redirect('/sys');
        });
    });

    app.get('/category', function (req, res) {
        res.render('category', {
            title: '分类',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });



    app.get('/reg', checkNotLogin);
    app.get('/reg', function (req, res) {
        res.render('reg', {
            title: '注册',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.post('/reg', checkNotLogin);
    app.post('/reg', function (req, res) {
        var name = req.body.name,
            password = req.body.password,
            password_re = req.body['password-repeat'];
        if (password_re != password) {
            req.flash('error', '<b>两次输入的密码不一致!</b>');
            return res.redirect('/reg');
        }
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        var newUser = new User({
            name: name,
            password: password,
            email: req.body.email
        });
        User.get(newUser.name, function (err, user) {
            if (user) {
                req.flash('error', '用户已存在!');
                return res.redirect('/reg');
            }
            newUser.save(function (err, user) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/reg');
                }
                req.session.user = user;
                req.flash('success', '注册成功!');
                res.redirect('/');
            });
        });
    });

    app.get('/login', checkNotLogin);
    app.get('/login', function (req, res) {
        res.render('login', {
            title: '登录',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.post('/login', checkNotLogin);
    app.post('/login', function (req, res) {
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        User.get(req.body.name, function (err, user) {
            if (!user) {
                req.flash('error', '用户不存在!');
                return res.redirect('/login');
            }
            if (user.password != password) {
                req.flash('error', '密码错误!');
                return res.redirect('/login');
            }
            req.session.user = user;
            req.flash('success', '登陆成功!');
            res.redirect('/');
        });
    });

    app.get('/logout', checkLogin);
    app.get('/logout', function (req, res) {
        req.session.user = null;
        req.flash('success', '登出成功!');
        res.redirect('/');
    });

    app.use(function (req, res) {
        res.render('404', {
            title: '404',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    function checkLogin(req, res, next) {
        /* if (!req.session.user) {
         req.flash('error', '未登录!');
         return res.redirect('/login');  //一定要return 不然报错 “Can't set headers after they are sent.”
         }*/
        next();
    }

    function checkNotLogin(req, res, next) {
        if (req.session.user) {
            req.flash('error', '已登录!');
            return res.redirect('back');
        }
        next();
    }
}

