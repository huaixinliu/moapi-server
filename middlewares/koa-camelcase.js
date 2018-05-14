import {camelcaseTo_,_ToCamelcase} from "../util/camelcase"

function camelcase(){
  return async function(ctx, next){
    if(typeof ctx.request.body==='object'&&ctx.request.type==='application/json'){
      ctx.request.body=camelcaseTo_(ctx.request.body)
    }
    await next();
    if(typeof ctx.response.body==='object'&&ctx.response.type==='application/json'){
      ctx.response.body=_ToCamelcase(ctx.response.body)
    }
  }
}






export default camelcase
