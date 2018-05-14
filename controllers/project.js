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





}

export default new Project()
