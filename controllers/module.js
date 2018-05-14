import ModuleModel from './../models/module';

import BaseController from '../base/baseController'
import xss  from 'xss';

class Module extends BaseController{
  constructor(){
    super();
    this.addModule=this.addModule.bind(this);
  }


  async addModule(ctx, next){

    ctx.checkBody('name').notEmpty("模块名称不能为空");
    ctx.checkBody('project_id').notEmpty("项目id不能为空");

    if (ctx.errors) {
      ctx.status = 400;
      ctx.body = ctx.errors;
      return;
    }
    const moduleId=await this.getId('module_id');

    const module = new ModuleModel({
      id:moduleId,
      ...ctx.request.body
    });
    const newModule = await ModuleModel.addModule(module);
    if (newModule) {
      ctx.body = newModule;
    }
  }

  async updateModule(ctx, next) {
    ctx.checkBody('name').notEmpty("模块名称不能为空");
    ctx.checkBody('project_id').notEmpty("项目id不能为空");

    if (ctx.errors) {
      ctx.status = 400;
      ctx.body = ctx.errors;
      return;
    }

    const module=await ModuleModel.findOneAndUpdate({
      id: ctx.params.moduleId
    }, {
      ...ctx.request.body,
      id:ctx.params.moduleId
    });
    if (module) {
      ctx.body = {
        success: true,
        userInfo: "更新成功"
      };
    }else{
      ctx.status = 400;
      ctx.body = "模块不存在"
    }
  }

  async deleteModule(ctx, next) {

    if (ctx.errors) {
      ctx.status = 400;
      ctx.body = ctx.errors;
      return;
    }
    const moduleId =ctx.params.moduleId

    await ModuleModel.deleteModule(moduleId);
    ctx.body = {
      success: true,
      msg: "删除成功"
    };
  }

}

export default new Module()
