import ProjectModel from './../models/project';
import xss  from 'xss';
import defaultProject from './../defaultData/project'
import BaseController from '../base/baseController'
import {getMdData} from '../util/markedown'
import ejs from 'ejs'
import fs from 'fs'
import path from 'path'
import marked from 'marked'
import highlight from 'highlight.js'
import extend from '../util/extend'
import proxy from '../util/proxy'
marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function(code) {
    return highlight.highlightAuto(code).value;
  },
  pedantic: false,
  gfm: true,
  headerPrefix:"doc-anchor-",
  tables: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false
});

const markedown=fs.readFileSync(path.join(__dirname , '../views/markdown.ejs')).toString()
const serverTemplate=fs.readFileSync(path.join(__dirname , '../views/server.ejs')).toString()
class Project extends BaseController{
  constructor(){
    super()
    this.addProject=this.addProject.bind(this);
  }
  async addProject(ctx, next) {
    ctx.checkBody('name').notEmpty("项目名称不能为空");
    if (ctx.errors) {
      ctx.status = 400;
      ctx.body = ctx.errors;
      return;
    }

    const projectId=await this.getId('project_id');

    const project = new ProjectModel({
      ...defaultProject,
      ...ctx.request.body,
      id:projectId
    });
    const newproject = await ProjectModel.addProject(project);
    if (newproject) {
      ctx.body = {
        success: true,
      };
    }
  }

  async getProjectList(ctx, next) {

   if (ctx.errors) {
     ctx.status = 400;
     ctx.body = ctx.errors;
     return;
   }

   const projects = await ProjectModel
   .find({})
   if (!projects) {
     ctx.status = 400;
     ctx.body = {
       msg: "项目不存在"
     };
   }else{
     ctx.body = projects
   }
 }

   async getProject(ctx, next) {
    ctx.checkParams('projectId').notEmpty("参数错误");
    if (ctx.errors) {
      ctx.status = 400;
      ctx.body = ctx.errors;
      return;
    }

    const project = await ProjectModel
    .findOne({id: ctx.params.projectId})
    .populate({
      path:'modules',
      populate:{
        path:'interfases'
      }
    })
    .exec();

    if (!project) {
      ctx.status = 400;
      ctx.body = {
        msg: "项目不存在"
      };
    }else{
      ctx.body = {
        id:project.id,
        name:project.name,
        modules:project.modules
      };
    }
  }


  async getMarkDown(ctx, next){
    let project = await ProjectModel
    .findOne({id: ctx.params.projectId})
    .populate({
      path:'modules',
      populate:{
        path:'interfases'
      }
    })
    .exec();
    const mdData=getMdData(project)
    const md=ejs.render(markedown,mdData);
    ctx.set('Content-disposition','attachment;filename='+encodeURIComponent(project.name)+'.md')
    ctx.body=md
  }


  async getDoc(ctx, next){
    let project = await ProjectModel
    .findOne({id: ctx.params.projectId})
    .populate({
      path:'modules',
      populate:{
        path:'interfases'
      }
    })
    .exec();
    const mdData=getMdData(project)
    const md=ejs.render(markedown,mdData);

    await ctx.render("doc",{
      title:project.name,
      content:marked(md)
    })
  }


  async getServer(ctx, next){
    let project = await ProjectModel
    .findOne({id: ctx.params.projectId})
    .populate({
      path:'modules',
      populate:{
        path:'interfases'
      }
    })
    .exec();
    const mdData=getMdData(project)
    const server=ejs.render(serverTemplate,mdData);


    ctx.set('Content-disposition','attachment;filename=app.js')
    ctx.body=server
  }


async getMock(ctx, next){
  let project = await ProjectModel
  .findOne({id: ctx.params.projectId})
  .populate({
    path:'modules',
    populate:{
      path:'interfases'
    }
  })
  .exec();
  const mdData=getMdData(project)
  let curInterfase;
  let url=ctx.params[0]||"/"

  if(/^\//.test(url)){
    url="/"+url
  }

  label:
  for(let module of mdData.modules){
    for(let interfase of module.interfases){
      if(interfase.url.replace(/^\/|\/$/,'')===url.replace(/^\/|\/$/,'')&&interfase.method.toUpperCase()===ctx.request.method){
        curInterfase=interfase;
        break label;
      }
    }
  }



  if(curInterfase&&curInterfase.proxyType){
    if(curInterfase.proxyType===1){
      ctx.body=curInterfase.mockRes
    }else {

      let response=await proxy(ctx,next,url,{host:"http://api.91jkys.com:9096/"})
      if(response){
        Object.keys(response.headers).forEach(
            h => ctx.set(h, response.headers[h])
        );

        ctx.status = response.statusCode;
        try{
          ctx.body=extend(JSON.parse(response.body),JSON.parse(curInterfase.mockRes))
        }catch(e){

          ctx.body={err:e,message:"该接口不能合并mock",a:response.body,b:curInterfase.mockRes}
        }
      }else{
        ctx.body=curInterfase.mockRes;
      }
    }
  }else{
    try{
      let response=await proxy(ctx,next,url,{host:"http://api.91jkys.com:9096/"})
      if(response){
        Object.keys(response.headers).forEach(
            h => ctx.set(h, response.headers[h])
        );
        ctx.status = response.statusCode;
        ctx.body = response.body;
      }
    }catch(err){
      console.log(err.request)
       ctx.body = err.response.body;
       ctx.status = err.statusCode || 500;
    }


  }

}


}

export default new Project()
