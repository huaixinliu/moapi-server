import ModuleModel from './../models/module';
import ProjectModel from './../models/project';
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

    if (ctx.errors) {
      ctx.status = 400;
      ctx.body = ctx.errors;
      return;
    }


    const module=await ModuleModel.findOne({
      id: ctx.params.moduleId
    });

    if (!module) {
      ctx.status = 400;
      ctx.body = "模块不存在"
      return;
    }

    if(ctx.user.type!==4){
      const project= await ProjectModel.findOne({
        id:module.project_id
      });
      if(!project.admin.equals(ctx.user._id)&&!project.developers.find(id=>id.equals(ctx.user._id))){
        ctx.status = 403;
        ctx.body = "没有修改模块权限";
        return;
      }
    }

    await ModuleModel.updateModule(module,ctx.request.body)

    ctx.body = "更新成功";
  }

  async deleteModule(ctx, next) {

    if (ctx.errors) {
      ctx.status = 400;
      ctx.body = ctx.errors;
      return;
    }
    const moduleId =ctx.params.moduleId

    const module=await ModuleModel.findOne({id:moduleId})

    if(!module){
      ctx.status = 400;
      ctx.body="模块不存在"
    }

    if(ctx.user.type!==4){
      const project= await ProjectModel.findOne({
        id:module.project_id
      });
      if(!project.admin.equals(ctx.user._id)&&!project.developers.find(id=>id.equals(ctx.user._id))){
        ctx.status = 403;
        ctx.body = "没有删除模块权限";
        return;
      }
    }

    await ModuleModel.deleteModule(module);
    ctx.body = {
      success: true,
      msg: "删除成功"
    };
  }

}

export default new Module()
