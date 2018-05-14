import InterfaseModel from './../models/interfase';
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

    ctx.checkBody('name').notEmpty("接口名称不能为空");
    ctx.checkBody('url').notEmpty("url不能为空");
    ctx.checkBody('module_id').notEmpty("moduleId不能为空");

    if (ctx.errors) {
      ctx.status = 400;
      ctx.body = ctx.errors;
      return;
    }
    const interfaseId=await this.getId('interfase_id');

    const interfase = new InterfaseModel({
      ...defaultInterfase,
      ...ctx.request.body,
      id:interfaseId,
    });
    const newInterfase = await InterfaseModel.addInterfase(interfase);
    if (newInterfase) {
      ctx.body = newInterfase;
    }
  }

  async updateInterfase(ctx, next) {
    ctx.checkParams('interfaseId').notEmpty("参数错误");
    ctx.checkBody('name').notEmpty("接口名称不能为空");
    ctx.checkBody('url').notEmpty("url不能为空");
    ctx.checkBody('module_id').notEmpty("moduleId不能为空");

    if (ctx.errors) {
      ctx.status = 400;
      ctx.body = ctx.errors;
      return;
    }


    await InterfaseModel.findOneAndUpdate({
      id: ctx.params.interfaseId
    }, {
      ...ctx.request.body,
      id:ctx.params.interfaseId
    }, function(err) {
      if(err){
        ctx.status = 400;
        ctx.body=err;
      }
    });

    ctx.body = {
      success: true,
    };

  }

  async deleteInterfase(ctx, next) {
    ctx.checkParams('interfaseId').notEmpty("interfaseId 不能为空");
    if (ctx.errors) {
      ctx.status = 400;
      ctx.body = ctx.errors;
      return;
    }
    let interfaseId = xss(ctx.params.interfaseId.trim());
    const interfase=await InterfaseModel.deleteInterfase(interfaseId);
    ctx.body = interfase;
  }

}

export default new Interfase()
