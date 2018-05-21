import UserModel from './../models/user';
import uuidv4  from 'uuid/v4';
import xss  from 'xss';
import BaseController from '../base/baseController'
class User extends BaseController{
  constructor(){
    super()
    this.signup=this.signup.bind(this)
  }
  async signup (ctx, next){
    ctx.checkBody('name').notEmpty("昵称不能为空");
    ctx.checkBody('password').notEmpty("密码不能为空");
    ctx.checkBody('phone').isMobilePhone("无效的手机号", ['zh-CN']);
    if (ctx.errors) {
      ctx.status = 400;
      ctx.body = ctx.errors;
      return;
    }
    const phone = xss(ctx.request.body.phone.trim());
    const name = xss(ctx.request.body.name.trim());
    const password = xss(ctx.request.body.password.trim());
    let user = await UserModel.findOne({phone: phone}).exec();



    if (user) {
      ctx.status = 400;
      ctx.body = {
        msg: "手机号已经注册过"
      };
      return;
    }

    const userId=await this.getId("user_id")
    const accessToken = uuidv4();
    user = new UserModel({name: name, phone: phone, password: password, access_token: accessToken,id:userId});

    try {
      user = await user.save();
      ctx.body =user
    } catch (e) {
      ctx.body = e;
      return next;
    }

  }

  async signin(ctx, next) {
    ctx.checkBody('password').notEmpty("密码不能为空");
    ctx.checkBody('phone').notEmpty("手机号不能为空").isMobilePhone("无效的手机号", ['zh-CN']);
    if (ctx.errors) {
      ctx.status = 400;
      ctx.body = ctx.errors;
      return;
    }
    let phone = xss(ctx.request.body.phone.trim());
    let password = xss(ctx.request.body.password.trim());
    let user = await UserModel.findOne({phone: phone});

    if (!user) {

      ctx.status = 400;
      ctx.body = {
        success: false,
        msg: "该手机号尚未注册"
      };
    } else if (user.password === password) {
      let accessToken = uuidv4();
      UserModel.update({
        phone: phone
      }, {
        access_token: accessToken
      }, function(err) {});

      ctx.body = {
        name:user.name,
        accessToken:accessToken,
        phone:user.phone,
        type:"ADMIN"
      };

    } else {
      ctx.status = 400;
      ctx.body = {
        success: false,
        msg: "密码错误"
      };
    }

  }


  async signout(ctx, next) {

      let accessToken = ctx.request.query.accesstoken||ctx.request.body.accesstoken||ctx.request.header.accesstoken;
    let user = await UserModel.findOne({access_token: accessToken}).exec();

    if (!user) {

      ctx.status = 400;
      ctx.body = {
        success: false,
        msg: "用户不存在"
      };
    } else {
      let _accessToken = uuidv4();
      UserModel.update({
        access_token: accessToken
      }, {
        access_token: _accessToken
      },function(){
        ctx.body = {
          success: true,
          msg: "退出登录"
        };
      });


    }

  }

  async addUser(ctx, next) {
    ctx.checkBody('name').notEmpty("昵称不能为空");
    ctx.checkBody('phone').isMobilePhone("无效的手机号", ['zh-CN']);
    if (ctx.errors) {
      ctx.status = 400;
      ctx.body = ctx.errors;
      return;
    }
    const defaultUser = {
      password: '123456',
      age: 20
    };
    const user = new UserModel(Object.assign({}, ctx.request.body, defaultUser));
    const user2 = await UserModel.addUser(user);
    if (user2) {
      ctx.body = {
        success: true,
        userInfo: user2
      };
    }
  }

  async deleteUser(ctx, next) {
    ctx.checkBody('phone').isMobilePhone("无效的手机号", ['zh-CN']);
    if (ctx.errors) {
      ctx.status = 400;
      ctx.body = ctx.errors;
      return;
    }
    let phone = xss(ctx.request.body.phone.trim());
    let user = await UserModel.findOne({phone: phone}).exec();
    if (!user) {
      ctx.status = 400;
      ctx.body = {
        msg: "删除账号不纯在"
      };
    } else {
      UserModel.remove({phone: phone}).then(() => {
        ctx.body = {
          success: true,
          msg: "删除成功"
        };
      });
    }
  }

  async getUserList(ctx,next){
    let userList = await UserModel.find({});
    ctx.body=userList
  }

}

export default new User()
