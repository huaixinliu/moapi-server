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



    const project= await ProjectModel.findOne({
      id:ctx.request.body.project_id
    });



    if(ctx.user.type!==4&&!project.admin.equals(ctx.user._id)&&!project.developers.find(id=>id.equals(ctx.user._id))){
      ctx.status = 403;
      ctx.body = {message:"没有修改模块权限"};
      return;
    }



    const moduleId=await this.getId('module_id');

    const module = new ModuleModel({
      ...ctx.request.body,
      id:moduleId,
      project:project._id
    });
    const newModule = await ModuleModel.addModule(module,project);
    if (newModule) {
      ctx.body = newModule;
    }
  }

  async updateModule(ctx, next) {




    const module=await ModuleModel.findOne({
      id: ctx.params.moduleId
    });

    if (!module) {
      ctx.status = 400;
      ctx.body = {message:"模块不存在"}
      return;
    }

    if(ctx.user.type!==4){
      const project= await ProjectModel.findOne({
        id:module.project_id
      });
      if(!project.admin.equals(ctx.user._id)&&!project.developers.find(id=>id.equals(ctx.user._id))){
        ctx.status = 403;
        ctx.body = {message:"没有修改模块权限"};
        return;
      }
    }

    await ModuleModel.updateModule(module,ctx.request.body)

    ctx.body = {message:"更新成功"};
  }

  async deleteModule(ctx, next) {




    const moduleId =ctx.params.moduleId

    const module=await ModuleModel.findOne({id:moduleId})

    if(!module){
      ctx.status = 400;
      ctx.body={message:"模块不存在"}
    }


    const project= await ProjectModel.findOne({
      id:module.project_id
    });
    if(ctx.user.type!==4&&!project.admin.equals(ctx.user._id)&&!project.developers.find(id=>id.equals(ctx.user._id))){
      ctx.status = 403;
      ctx.body = {message:"没有删除模块权限"};
      return;
    }


    await ModuleModel.deleteModule(module,project);
    ctx.body ={message:"删除成功"};
  }

}

export default new Module()
