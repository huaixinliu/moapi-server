import RecordModel from './../models/record'
import BaseController from '../base/baseController'
class Record extends BaseController{
  constructor(){
    super()
    this.addInterfaseRecord=this.addInterfaseRecord.bind(this);
    this.addRemarkRecord=this.addRemarkRecord.bind(this);
    this.addModuleRecord=this.addModuleRecord.bind(this);
    this.addProjectRecord=this.addProjectRecord.bind(this);
  }

  async addModuleRecord(ctx, next){
    ctx.record=ctx.record||{}
    await next();
    if(ctx.status!==200){
      return
    }
    const recordId=await this.getId('record_id');
    const type=ctx.method==="POST"?"ADD_MODULE":(ctx.method==="PUT"?"UPDATE_MODULE":"DELETE_MODULE");
    const info={
      id:recordId,
      creator:ctx.user.name,
      type,
      project_id:ctx.record.project.id,
      module_id:ctx.record.module.id,
      project_name:ctx.record.project.name,
      module_name:ctx.record.module.name,
    }
    const record=new RecordModel(info);
    await RecordModel.addRecord(record);
  }

  async addProjectRecord(ctx, next){
    ctx.record=ctx.record||{}
    await next();
    if(ctx.status!==200){
      return
    }
    const recordId=await this.getId('record_id');
    const type=ctx.method==="POST"?"ADD_PROJECT":(ctx.method==="PUT"?"UPDATE_PROJECT":"DELETE_PROJECT");
    const info={
      id:recordId,
      creator:ctx.user.name,
      type,
      project_id:ctx.record.project.id,
      project_name:ctx.record.project.name,
    }
    const record=new RecordModel(info);
    await RecordModel.addRecord(record);
  }

  async addInterfaseRecord(ctx, next){
    ctx.record=ctx.record||{}
    await next();
    if(ctx.status!==200){
      return
    }
    const recordId=await this.getId('record_id');
    const type=ctx.method==="POST"?"ADD_INTERFASE":(ctx.method==="PUT"?"UPDATE_INTERFASE":"DELETE_INTERFASE");
    const info={
      id:recordId,
      creator:ctx.user.name,
      type,
      message:ctx.request.body.record_message,
      interfase_id:ctx.record.interfase.id,
      interfase_name:ctx.record.interfase.name,
      project_id:ctx.record.interfase.project_id,
      module_id:ctx.record.interfase.module_id,
      project_name:ctx.record.project.name,
      module_name:ctx.record.module.name,
    }
    const record=new RecordModel(info);
    await RecordModel.addRecord(record);
  }
  async addRemarkRecord(ctx, next){
    ctx.record=ctx.record||{}
    await next();
    if(ctx.status!==200){
      return
    }
    const recordId=await this.getId('record_id');
    const type=ctx.method==="POST"?"ADD_REMARK":(ctx.method==="PUT"?"UPDATE_REMARK":"DELETE_REMARK");
    const info={
      id:recordId,
      creator:ctx.user.name,
      type,
      message:ctx.record.remark.message,
      interfase_id:ctx.record.interfase.id,
      interfase_name:ctx.record.interfase.name,
      project_id:ctx.record.interfase.project_id,
      module_id:ctx.record.interfase.module_id,
      project_name:ctx.record.project.name,
      module_name:ctx.record.module.name,
    }
    const record=new RecordModel(info);
    await RecordModel.addRecord(record);
  }

}

export default new Record()
