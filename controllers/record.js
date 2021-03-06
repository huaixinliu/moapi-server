import RecordModel from './../models/record'
import BaseController from '../base/baseController'
class Record extends BaseController{
  constructor(){
    super()

  }
  async getInterfaseRecord(ctx, next){
    const interfaseId=ctx.params.interfaseId;

    const pageSize=ctx.query.pageSize||20;
    const page=(ctx.query.page||1)-1;

    const records=await RecordModel.find({interfase_id:interfaseId})
        .where('type')
        .sort({'createdAt':-1})
        .skip(pageSize*page)
        .limit(pageSize);

    const total=await RecordModel.count({interfase_id:interfaseId})
    ctx.body={
      total:total,
      data:records
    };
  }
  async getRecord(ctx, next){
    const projectList=ctx.request.query.projectIds.split(",");
    const pageSize=ctx.query.pageSize||50;
    const page=(ctx.query.page||1)-1;
    const total=await RecordModel.find({})
        .where('project_id')
        .in(projectList)
        .count({});
    const records=await RecordModel.find({})
      .where('project_id')
      .in(projectList)
      .sort({'createdAt':-1})
      .skip(pageSize*page)
      .limit(pageSize);


    ctx.body={
      total:total,
      data:records
    };
  }


}

export default new Record()
