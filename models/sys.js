/**
 * Created by cdgoujianjun on 2015/4/21.
 */
var mongodb = require('./db');

function Sys(name,cfg_obj) {
    this.name = name,
    this.cfg_obj = cfg_obj
}

module.exports = Sys;

//网站初始化配置信息
Sys.initCfg = [
    ["cfg_siteName","网站名称","默认网站","str"],
    ["cfg_basehost","网址","http://localhost/","str"],
    ["cfg_description","描述信息","默认描述","str"],
    ["cfg_keyword","关键字","默认关键字","str"],
    ["cfg_beian","备案号","默认备案号","str"],
    ["cfg_tel","电话","13438956672","str"],
    ["cfg_email","邮箱","xyclr@163.com","str"],
    ["cfg_addr","地址","默认地址","str"],
    ["cfg_qq","QQ号码","178304593","str"],
    ["cfg_logo","logo地址","https://ss0.bdstatic.com/5a21bjqh_Q23odCf/static/superplus/img/logo_white_ee663702.png","str"]
];

Sys.prototype.save = function(callback){
    var date = new Date();
    //存储各种时间格式，方便以后扩展
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + "-" + (date.getMonth() + 1),
        day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
        date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    }
    //要存入数据库的文档
    var sys = {
        name : this.name,
        settings: this.cfg_obj,
        time: time
    };
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        db.collection('sys', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //将文档插入 Sys 集合
            collection.insert(sys, {
                safe: true
            }, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err
                }
                callback(null);//返回 err 为 null
            });
        });
    });
};

Sys.update = function (name, setting,callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        db.collection('sys', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //更新文章内容
            collection.update({
                name: name
            },{$set : { "settings" : setting}},function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};



Sys.get = function(name, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('sys', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //查找用户名（name键）值为 name 一个文档
            collection.findOne({
                name: name
            }, function (err, sys) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                callback(null, sys);//成功！返回查询的用户信息
            });
        });
    });
};

