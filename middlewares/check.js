import UserModel from './../models/user'

class Check{
  async token(ctx, next){

    var accessToken = ctx.request.query.accesstoken||ctx.request.body.accesstoken||ctx.request.header.accesstoken||ctx.request.query.token||ctx.request.body.token;

    if (!accessToken) {
      ctx.status = 403;
      ctx.body = {
        message: '请登录'
      };
      return next;
    }

    var user = await UserModel.findOne({
      access_token: accessToken
    })


    if (!user) {
      ctx.status = 403;
      ctx.body = {
        message: '请登录'
      };
      return next;
    }


    ctx.user = user;

    await next();
  }




  async admin(ctx,next){
    if (ctx.user.type!==4) {
      ctx.status = 403;
      ctx.body = {
        message: '请登录'
      };
      return next;
    }
      await next();
  }







}

export default new Check()
