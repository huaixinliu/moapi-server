import InterfaseModel from './../models/interfase';
import ProjectModel from './../models/project';
import ModuleModel from './../models/module';
import defaultInterfase from './../defaultData/interfase'
import BaseController from '../base/baseController'
import xss  from 'xss';


class Interfase extends BaseController{
  constructor(){
    super();
    this.addInterfase=this.addInterfase.bind(this);
  }


  async getInterfase(ctx, next) {

    const interfase = await InterfaseModel.findOne({id: ctx.params.interfaseId});

    if (!interfase) {
      ctx.status = 400;
      ctx.body = {
        msg: "接口不存在"
      };
      return;
    }

    ctx.body = {
      id:interfase.id,
      name:interfase.name,
      method: interfase.method,
      url: interfase.url,
      res: interfase.res,
      req:interfase.req
    };
  }

  async addInterfase(ctx, next){

    const module=await ModuleModel.findOne({id:ctx.request.body.module_id});
    const project=await ProjectModel.findOne({id:ctx.request.body.project_id});

    if(ctx.user.type!==4&&!project.admin.equals(ctx.user._id)&&!project.developers.find(id=>id.equals(ctx.user._id))&&!project.reporters.find(id=>id.equals(ctx.user._id))){
      ctx.status = 403;
      ctx.body = {
        message: '没有修改接口权限'
      };
      return;
    }

    const interfaseId=await this.getId('interfase_id');
    const interfaseInfo={
      ...defaultInterfase,
      ...project.template,
      ...ctx.request.body,
      id:interfaseId,
      project:project._id,
      module:module._id
    }

    const interfase = new InterfaseModel(interfaseInfo);
    await InterfaseModel.addInterfase(interfase,module);

    ctx.record.interfase = interfase;
    ctx.record.module = module;
    ctx.record.project = project;
    ctx.body={message:"添加成功"}
  }






  async updateInterfase(ctx, next) {

    const interfase =await InterfaseModel
    .findOne({
      id: ctx.params.interfaseId
    })
    .populate("module")
    .populate("project");

    if(!interfase){
      ctx.status = 400;
      ctx.body = {
        message: "接口不存在",
      };
      return;
    }

    if(ctx.request.body.__v<interfase.__v&&!ctx.request.body.force_save){
      ctx.status = 400;
      ctx.body = {
        message: "保存失败,该接口已被更新",
      };
      return;
    }

    const module =interfase.module;
    const project =interfase.project;

    if(ctx.user.type!==4&&!project.admin.equals(ctx.user._id)&&!project.developers.find(id=>id.equals(ctx.user._id))&&!project.reporters.find(id=>id.equals(ctx.user._id))){
      ctx.status = 403;
      ctx.body ={ message:"没有修改接口权限"};
      return;
    }

    const interfaseInfo={
      ...ctx.request.body
    }
    delete interfaseInfo.__v;

    await InterfaseModel.updateInterfase(interfase,interfaseInfo)
    ctx.record.interfase = interfase;
    ctx.record.module = module;
    ctx.record.project = project;

    ctx.body = {
      message: "更新成功",
    };

  }

  async deleteInterfase(ctx, next) {


    let interfaseId = xss(ctx.params.interfaseId.trim());
    const interfase=await InterfaseModel
    .findOne({id:interfaseId})
    .populate("module")
    .populate("project");

    if(!interfase){
      ctx.status = 400;
      ctx.body = {message:"接口不存在"};
      return;
    }
    const module =interfase.module;
    const project =interfase.project;

    if(ctx.user.type!==4&&!project.admin.equals(ctx.user._id)&&!project.developers.find(id=>id.equals(ctx.user._id))){
      ctx.status = 403;
      ctx.body = {message:"没有删除接口权限"};
      return;
    }

    await InterfaseModel.deleteInterfase(interfase);

    ctx.record.interfase = interfase;
    ctx.record.module = module;
    ctx.record.project = project;
    ctx.body = {message:"删除成功"};
  }

}

export default new Interfase()
