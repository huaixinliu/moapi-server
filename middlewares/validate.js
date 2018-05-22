export default  function(type){
  return async function(ctx, next){

    //接口
    if(type==='ADDINT'){
      ctx.checkBody('name').notEmpty("接口名称不能为空");
      ctx.checkBody('url').notEmpty("url不能为空");
      ctx.checkBody('module_id').notEmpty("moduleId不能为空");
      ctx.checkBody('project_id').notEmpty("projectId不能为空");
    }else if(type==='DELINT'){
      ctx.checkParams('interfaseId').notEmpty("interfaseId不能为空");
    }else if(type==='UPINT'){
      ctx.checkParams('interfaseId').notEmpty("interfaseId不能为空");
    }
    //模块
    else if(type==='ADDMOD'){
      ctx.checkBody('name').notEmpty("模块名称不能为空");
      ctx.checkBody('project_id').notEmpty("项目id不能为空");
    }else if(type==='DELMOD'){
      ctx.checkParams('moduleId').notEmpty("moduleId不能为空");
    }else if(type==='UPMOD'){
      ctx.checkParams('moduleId').notEmpty("moduleId不能为空");
    }
  //项目
    else if(type==='ADDPRO'){
      ctx.checkBody('name').notEmpty("项目名称不能为空");
    }else if(type==='DELPRO'){
      ctx.checkParams('projectId').notEmpty("projectId不能为空");
    }else if(type==='UPPRO'){
      ctx.checkParams('projectId').notEmpty("projectId不能为空");
    }
    //备注
    else if(type==='ADDREM'){
      ctx.checkBody('message').notEmpty("备注不能为空");
    }
    //用户
    else if(type==='ADDUSER'){
      ctx.checkBody('name').notEmpty("昵称不能为空");
      ctx.checkBody('password').notEmpty("密码不能为空");
      ctx.checkBody('phone').isMobilePhone("无效的手机号", ['zh-CN']);
    }else if(type==='SIGNUP'){
      ctx.checkBody('name').notEmpty("昵称不能为空");
      ctx.checkBody('password').notEmpty("密码不能为空");
      ctx.checkBody('phone').isMobilePhone("无效的手机号", ['zh-CN']);
    }else if(type==='SIGNIN'){
      ctx.checkBody('password').notEmpty("密码不能为空");
      ctx.checkBody('phone').notEmpty("手机号不能为空").isMobilePhone("无效的手机号", ['zh-CN']);
    }

    if (ctx.errors) {
      ctx.status = 400;
      ctx.body = {
        message: ctx.errors[0][Object.keys(ctx.errors[0])[0]]
      };
      return;
    }

  }
}
