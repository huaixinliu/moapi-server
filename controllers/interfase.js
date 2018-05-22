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
    ctx.checkParams('interfaseId').notEmpty("参数错误");
    if (ctx.errors) {
      ctx.status = 400;
      ctx.body = ctx.errors;
      return;
    }

    const interfase = await InterfaseModel.findOne({id: ctx.params.interfaseId}).exec();

    if (!interfase) {
      ctx.status = 400;
      ctx.body = {
        msg: "接口不存在"
      };
    }else{
      ctx.body = {
        id:interfase.id,
        name:interfase.name,
        method: interfase.method,
        url: interfase.url,
        res: interfase.res,
        req:interfase.req
      };
    }
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

    const interfase = new InterfaseModel({
      ...defaultInterfase,
      ...ctx.request.body,
      id:interfaseId,
      project:project._id,
      module:module._id
    });
    const newInterfase = await InterfaseModel.addInterfase(interfase,module);
    if (newInterfase) {
      ctx.record.interfase = newInterfase;
      ctx.record.module = module;
      ctx.record.project = project;
      ctx.body={message:"添加成功"}
    }
  }






  async updateInterfase(ctx, next) {



    const interfase =await InterfaseModel
    .findOne({
      id: ctx.params.interfaseId
    })
    .populate("module")
    .populate("project");

    const module =interfase.module;
    const project =interfase.project;

    if(!interfase){

      return;
    }




    if(ctx.user.type!==4&&!project.admin.equals(ctx.user._id)&&!project.developers.find(id=>id.equals(ctx.user._id))&&!project.reporters.find(id=>id.equals(ctx.user._id))){
      ctx.status = 403;
      ctx.body ={ message:"没有修改接口权限"};
      return;
    }




    await InterfaseModel.updateInterfase(interfase,ctx.request.body)
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
