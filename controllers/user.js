import UserModel from './../models/user';
import uuidv4  from 'uuid/v4';
import xss  from 'xss';
import BaseController from '../base/baseController'
import ProjectModel from '../models/project'
class User extends BaseController{
  constructor(){
    super()
    this.signup=this.signup.bind(this)
  }
  async signup (ctx, next){


    const phone = xss(ctx.request.body.phone.trim());
    const name = xss(ctx.request.body.name.trim());
    const password = xss(ctx.request.body.password.trim());
    let user = await UserModel.findOne({phone: phone}).exec();



    if (user) {
      ctx.status = 400;
      ctx.body ={message: "手机号已经注册过"
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

console.log(99999)
    let phone = xss(ctx.request.body.phone.trim());
    let password = xss(ctx.request.body.password.trim());
    let user = await UserModel
    .findOne({phone: phone})
    .populate("watch_projects");

    if (!user) {

      ctx.status = 400;
      ctx.body = {message:"该手机号尚未注册"
      };
    } else if (user.password === password) {
      let accessToken = uuidv4();

      user.set({access_token: accessToken})
      await user.save()

      ctx.body = {
        name:user.name,
        accessToken:accessToken,
        phone:user.phone,
        watchProjects:user.watch_projects,
        type:"ADMIN"
      };

    } else {
      ctx.status = 400;
      ctx.body = {message: "密码错误"
      };
    }

  }


  async signout(ctx, next) {

      let accessToken = ctx.request.query.accesstoken||ctx.request.body.accesstoken||ctx.request.header.accesstoken;
    let user = await UserModel.findOne({access_token: accessToken}).exec();

    if (!user) {

      ctx.status = 400;
      ctx.body = {message:"用户不存在"
      };
    } else {
      let _accessToken = uuidv4();
      UserModel.update({
        access_token: accessToken
      }, {
        access_token: _accessToken
      },function(){
        ctx.body = {message: "退出登录"
        };
      });


    }

  }

  async addUser(ctx, next) {

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
      ctx.body = {message:"删除账号不纯在"
      };
    } else {
      UserModel.remove({phone: phone}).then(() => {
        ctx.body = {message:"删除成功"
        };
      });
    }
  }

  async getUserList(ctx,next){
    let userList = await UserModel.find({});
    ctx.body=userList
  }



  async getWatchProject(ctx,next){

    let user = await UserModel
    .findOne({_id:ctx.user._id})
    .populate('watch_projects');
    ctx.body=user.watch_projects
  }

  async addWatchProject(ctx,next){
    let project = await ProjectModel.findOne({id:ctx.request.body.project_id});
    if(!project){
      ctx.status = 400;
      ctx.body ={message: "项目不存在"
      };
      return;
    }

    ctx.user.watch_projects.push(project._id);
    await ctx.user.save()
    ctx.body="关注成功"
  }

  async deleteWatchProject(ctx,next){
    let project = await ProjectModel.findOne({id:ctx.request.body.project_id});
    if(!project){
      ctx.status = 400;
      ctx.body = {message: "项目不存在"
      };
      return;
    }
    let index =ctx.user.watch_projects.findIndex(id=>id.equals(project._id));
    if(index===-1){
      ctx.status = 400;
      ctx.body = {message:"项目未关注"
      };
      return;
    }
    ctx.user.watch_projects.splice(index,1);
    await ctx.user.save()
    ctx.body="取消成功"
  }

}

export default new User()
