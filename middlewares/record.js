import RecordModel from './../models/record'
import BaseController from '../base/baseController'
class Record extends BaseController{
  constructor(){
    super()
    this.addInterfaseRecord=this.addInterfaseRecord.bind(this);

  }
  async addInterfaseRecord(ctx, next){
    ctx.record=ctx.record||{}
    await next();
    const recordId=await this.getId('record_id');
    const type=ctx.method==="POST"?"ADD_INTERFASE":(ctx.method==="PUT"?"UPDATE_INTERFASE":"DELETE_INTERFASE");
    const info={
      id:recordId,
      creator:ctx.user.name,
      type,
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
