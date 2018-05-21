import RemarkModel from './../models/remark'
import BaseController from '../base/baseController'
import ProjectModel from './../models/project'
class Remark extends BaseController{
  constructor(){
    super()
    this.addRemark=this.addRemark.bind(this);
    this.updateRemark=this.updateRemark.bind(this);
  }
  async addRemark(ctx, next){
    ctx.checkBody('message').notEmpty("备注不能为空");
    if (ctx.errors) {
      ctx.status = 400;
      ctx.body = ctx.errors;
      return;
    }

    if(ctx.user.type!==4){
      const project=await ProjectModel.findOne({
        id:ctx.request.body.project_id
      });
      if(!project.admin.equals(ctx.user._id)&&!project.developers.find(id=>id.equals(ctx.user._id))&&!project.reporters.find(id=>id.equals(ctx.user._id))){
        ctx.status = 403;
        ctx.body = "没有添加权限";
        return;
      }
    }

    const remarkId=await this.getId('remark_id');
    const info={
      id:remarkId,
      creator:ctx.user.name,
      interfase_id:ctx.request.body.interfase_id,
      message: ctx.request.body.message,
    	module_id: ctx.request.body.module_id,
      project_id:ctx.request.body.project_id
    }
    const remark=new RemarkModel(info);
    await RemarkModel.addRemark(remark);
    ctx.body="添加成功"
  }

  async deleteRemark(ctx, next){

    const remark=await RemarkModel.findOne({id:ctx.params.remarkId})

    if(!remark){
      ctx.status=400;
      ctx.body="备注不存在"
    }

    if(ctx.user.type!==4){
      const project=await ProjectModel.findOne({
        id:remark.project_id
      });
      if(!project.admin.equals(ctx.user._id)&&!project.developers.find(id=>id.equals(ctx.user._id))&&!project.reporters.find(id=>id.equals(ctx.user._id))){
        ctx.status = 403;
        ctx.body = "没有删除权限";
        return;
      }
    }

    await RemarkModel.deleteRemark(remark);
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
      ctx.body="备注不存在"
    }

    if(ctx.user.type!==4){
      const project=await ProjectModel.findOne({
        id:remark.project_id
      });
      if(!project.admin.equals(ctx.user._id)&&!project.developers.find(id=>id.equals(ctx.user._id))&&!project.reporters.find(id=>id.equals(ctx.user._id))){
        ctx.status = 403;
        ctx.body = "没有修改权限";
        return;
      }
    }

    const info={
      creator:ctx.user.name,
      ...ctx.request.body,
    }
    await RemarkModel.updateRemark(remark,info);

    ctx.body="更新成功"
  }
}

export default new Remark()
