import RecordModel from './../models/record'
import BaseController from '../base/baseController'
class Record extends BaseController{
  constructor(){
    super()
    this.addInterfaseRecord=this.addInterfaseRecord.bind(this);
    this.deleteInterfaseRecord=this.deleteInterfaseRecord.bind(this);
    this.updateInterfaseRecord=this.updateInterfaseRecord.bind(this);
  }
  async addInterfaseRecord(ctx, next){
    await next();
    const recordId=await this.getId('record_id');
    const info={
      id:recordId,
      creator:'admin',
      type:'ADD_INTERFASE',
      interfase_id:ctx.response.body.id,
      interfaseName:ctx.response.body.name,
      project_id:ctx.response.body.project_id,
      module_id:ctx.response.body.module_id,
    }
    const record=new RecordModel(info);
    await RecordModel.addRecord(record);
  }

  async deleteInterfaseRecord(ctx, next){
    await next();
    console.log(ctx.response.body)
    const recordId=await this.getId('record_id');
    const info={
      id:recordId,
      creator:'admin',
      type:'DELETE_INTERFASE',
      interfase_id:ctx.request.body.id,
      interfaseName:ctx.request.body.name,
      project_id:ctx.request.body.project_id,
      module_id:ctx.request.body.module_id,
    }
    const record=new RecordModel(info);
    await RecordModel.addRecord(record);
  }

  async updateInterfaseRecord(ctx, next){
    const info={
      id:null,
      creator:'admin',
      type:'UPDATE_INTERFASE',
      message:ctx.request.body.record_message,
      interfase_id:ctx.request.body.id,
      interfaseName:ctx.request.body.name,
      project_id:ctx.request.body.project_id,
      module_id:ctx.request.body.module_id,
    }
    await next();
    info.id=await this.getId('record_id');
    const record=new RecordModel(info);
    await RecordModel.addRecord(record);
  }
}

export default new Record()
