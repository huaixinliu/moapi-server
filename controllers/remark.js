import RemarkModel from './../models/remark'
import BaseController from '../base/baseController'
import ProjectModel from './../models/project';
import ModuleModel from './../models/module';
import InterfaseModel from './../models/interfase'
class Remark extends BaseController{
  constructor(){
    super()
    this.addRemark=this.addRemark.bind(this);
    this.updateRemark=this.updateRemark.bind(this);
  }
  async addRemark(ctx, next){

    const interfase=await InterfaseModel.findOne({id:ctx.request.body.interfase_id});

    const project=await ProjectModel.findOne({
      id:interfase.project_id
    });

    const module=await ModuleModel.findOne({
      id:interfase.module_id
    });


    if(ctx.user.type!==4&&!project.admin.equals(ctx.user._id)&&!project.developers.find(id=>id.equals(ctx.user._id))&&!project.reporters.find(id=>id.equals(ctx.user._id))){
      ctx.status = 403;
      ctx.body = {message:"没有添加权限"};
      return;
    }


    const remarkId=await this.getId('remark_id');
    const info={
      id:remarkId,
      creator:ctx.user.name,
      interfase_id:interfase.id,
      message: ctx.request.body.message,
    	module_id: interfase.module_id,
      project_id:interfase.project_id,
      version:ctx.request.body.version
    }
    const remark=new RemarkModel(info);
    await RemarkModel.addRemark(remark,interfase);

    ctx.record={
      interfase,
      project,
      module,
      remark
    }
    ctx.body="添加成功"
  }

  async deleteRemark(ctx, next){

    const remark=await RemarkModel.findOne({id:ctx.params.remarkId})

    if(!remark){
      ctx.status=400;
      ctx.body={message:"备注不存在"}
    }

    const interfase=await InterfaseModel.findOne({id:remark.interfase_id});

    const project=await ProjectModel.findOne({
      id:interfase.project_id
    });

    const module=await ModuleModel.findOne({
      id:interfase.module_id
    });


    if(ctx.user.type!==4&&!project.admin.equals(ctx.user._id)&&!project.developers.find(id=>id.equals(ctx.user._id))&&!project.reporters.find(id=>id.equals(ctx.user._id))){
      ctx.status = 403;
      ctx.body ={message: "没有删除权限"};
      return;
    }


    await RemarkModel.deleteRemark(remark,interfase);

    ctx.record={
      interfase,
      project,
      module,
      remark
    }
    ctx.body="删除成功"
  }

  async updateRemark(ctx, next){

    ctx.checkBody('message').notEmpty("备注不能为空");
    if (ctx.errors) {
      ctx.status = 400;
      ctx.body = ctx.errors;
      return;
    }

    const remark=await RemarkModel.findOne({id:ctx.params.remarkId})

    if(!remark){
      ctx.status=400;
      ctx.body={message:"备注不存在"}
    }

    const interfase=await InterfaseModel.findOne({id:remark.interfase_id});

    const project=await ProjectModel.findOne({
      id:remark.project_id
    });

    const module=await ModuleModel.findOne({
      id:remark.module_id
    });


    if(ctx.user.type!==4&&!project.admin.equals(ctx.user._id)&&!project.developers.find(id=>id.equals(ctx.user._id))&&!project.reporters.find(id=>id.equals(ctx.user._id))){
      ctx.status = 403;
      ctx.body = {message:"没有修改权限"};
      return;
    }


    const info={
      creator:ctx.user.name,
      ...ctx.request.body,
    }
    await RemarkModel.updateRemark(remark,info);
    ctx.record={
      interfase,
      project,
      module,
      remark
    }
    ctx.body="更新成功"
  }
}

export default new Remark()
