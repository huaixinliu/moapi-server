import ProjectModel from './../models/project';
import xss  from 'xss';
import defaultProject from './../defaultData/project'
import BaseController from '../base/baseController'
import {getMdData} from '../util/markedown'
import ejs from 'ejs'
import fs from 'fs'
import path from 'path'
import marked from 'best-marked'
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
  tocPrefix:"doc-toc-",
  tables: true,
  breaks: true,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false,
  ordered: true,
  depthFrom: 1,
  depthTo: 3
});

const markedown=fs.readFileSync(path.join(__dirname , '../views/markdown.ejs')).toString()
const serverTemplate=fs.readFileSync(path.join(__dirname , '../views/server.ejs')).toString()
class Project extends BaseController{
  constructor(){
    super()
    this.addProject=this.addProject.bind(this);
  }
  async addProject(ctx, next) {


    const projectId=await this.getId('project_id');

    const project = new ProjectModel({
      ...defaultProject,
      ...ctx.request.body,
      id:projectId,
      admin:ctx.user._id
    });
    const newproject = await ProjectModel.addProject(project);
    if (newproject) {
      ctx.body = "";
    }
  }

  async deleteProject(ctx,next){
    const project= await ProjectModel.findOne({
      id:ctx.params.projectId
    });

    if(!project){
      ctx.status = 400;
      ctx.body = {message:"项目不存在"};
    }



    if(ctx.user.type!==4&&!project.admin.equals(ctx.user._id)&&!project.developers.find(id=>id.equals(ctx.user._id))){
      ctx.status = 403;
      ctx.body = {message:"没有删除项目权限"};
      return;
    }

    await ProjectModel.deleteProject(project);


    ctx.body = "";

  }

  async updateProject(ctx,next){


    const project=await ProjectModel.findOne({
      id: ctx.params.projectId
    });


    if(!project){
      ctx.status = 400;
      ctx.body = {message:"项目不存在"};
    }



    if(ctx.user.type!==4&&!project.admin.equals(ctx.user._id)&&!project.developers.find(id=>id.equals(ctx.user._id))){
      ctx.status = 403;
      ctx.body = {message:"没有修改项目权限"};
      return;
    }

    await ProjectModel.updateProject(project,{
      proxy:ctx.request.body.proxy||project.proxy,
      name:ctx.request.body.name||project.name,
      description:ctx.request.body.description||project.description,
      template:ctx.request.body.template||project.template,
    });


    ctx.body = "修改成功";



  }

  async getProjectList(ctx, next) {


    let projects=[]
   if(ctx.user.type===4){
     projects=  await ProjectModel
      .find({})
      .populate("admin")
   }else{
     projects=  await ProjectModel
      .find({$or:[{public:true},{guests:ctx.user._id}]})
      .populate("admin")
   }

   if (!projects) {
     ctx.status = 400;
     ctx.body = {message: "项目不存在"
     };
   }else{
     ctx.body = projects
   }
 }

 async getSelfProjectList(ctx, next) {



  const projects = await ProjectModel
  .find({admin:ctx.user._id})
  .populate("admin")

  if (!projects) {
    ctx.status = 400;
    ctx.body ={message: "项目不存在"
    };
  }else{
    ctx.body = projects
  }
}


async getDevelopProjectList(ctx, next) {


 const projects = await ProjectModel
 .find({"developers":ctx.user._id})
 .populate("admin");

 if (!projects) {
   ctx.status = 400;
   ctx.body = {message: "项目不存在"
   };
 }else{
   ctx.body = projects
 }
}

async getRelateProjectList(ctx, next) {

 if (ctx.errors) {
   ctx.status = 400;
   ctx.body = ctx.errors;
   return;
 }

 const projects = await ProjectModel
 .find({"reporters":ctx.user._id})
 .populate("admin");

 if (!projects) {
   ctx.status = 400;
   ctx.body = {message: "项目不存在"
   };
 }else{
   ctx.body = projects
 }
}


   async getProject(ctx, next) {



    const project = await ProjectModel
    .findOne({id: ctx.params.projectId})
    .populate({
      path:'modules',
      select:"name interfases project_id description id -_id",
      populate:{
        path:'interfases',
        select:"name url project_id module_id id req res headers method proxy_type -_id",
        populate:{
          path:'remark'
        }
      }
    })




    if (!project) {
      ctx.status = 400;
      ctx.body = {message: "项目不存在"
      };
    }else{
      ctx.body = {
        id:project.id,
        modules:project.modules,
      };
    }
  }


  async getProjectInfo(ctx, next) {


   const project = await ProjectModel
   .findOne({id: ctx.params.projectId})
   .populate("admin")
   .populate("reporters")
   .populate("guests")
   .populate("developers")

   let permission=1;

   if(ctx.user.type===4||project.admin.id===ctx.user.id){
     permission=4;
   }else if(project.developers.find(item=>item.id===ctx.user.id)){
     permission=3;
   }else if(project.reporters.find(item=>item.id===ctx.user.id)){
     permission=2;
   }

   if (!project) {
     ctx.status = 400;
     ctx.body ={message: "项目不存在"
     };
   }else{
     ctx.body = {
       permission:permission,
       id:project.id,
       name:project.name,
       description:project.description,
       developers:project.developers,
       reporters:project.reporters,
       guests:project.guests,
       proxy:project.proxy,
       admin:project.admin,
       template:project.template
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
      id:project.id,
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
