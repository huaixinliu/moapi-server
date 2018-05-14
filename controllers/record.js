import RecordModel from './../models/record'
import BaseController from '../base/baseController'
class Record extends BaseController{
  constructor(){
    super()

  }
  async getInterfaseRecord(ctx, next){
    const interfaseId=ctx.params.interfaseId

    const records=await RecordModel.find({interfase_id:interfaseId})
          .where('type').in(['ADD_INTERFASE', 'UPDATE_INTERFASE','DELETE_INTERFASE']);
    console.log(records)
    ctx.body=records;
  }


}

export default new Record()
