import ProjectModel from './../models/project';
import UserModel from './../models/user';
import xss from 'xss';
import defaultProject from './../defaultData/project'
import BaseController from '../base/baseController'
import {getMdData} from '../util/markedown'
import parseDate from "../util/parseDate"
import ejs from 'ejs'
import fs from 'fs'
import path from 'path'
import marked from 'best-marked'
import highlight from 'highlight.js'
import extend from '../util/extend'
import proxy from '../util/proxy'
import send from "koa-send"
import archiver from "archiver"
marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function(code) {
    return highlight.highlightAuto(code).value;
  },
  pedantic: false,
  gfm: true,
  headerPrefix: "doc-anchor-",
  tocPrefix: "doc-toc-",
  tables: true,
  breaks: true,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false,
  ordered: true,
  depthFrom: 1,
  depthTo: 2,
  orderStr: [
    [
      "一",
      '二',
      '三',
      '四',
      '五',
      '六',
      '七',
      '八',
      '九',
      '十',
      "十一",
      '十二',
      '十三',
      '十四',
      '十五',
      '十六',
      '十七',
      '十八',
      '十九',
      '二十',
      "二十一",
      '二十二',
      '二十三',
      '二十四',
      '二十五',
      '二十六',
      '二十七',
      '二十八',
      '二十九',
      '三十'
    ]
  ]
});

const markedown = fs.readFileSync(path.join(__dirname, '../views/markdown.ejs')).toString()
const serverTemplate = fs.readFileSync(path.join(__dirname, '../views/server.ejs')).toString()
const packageInfo = `
{
  "name": "mock-server",
  "scripts": {
    "start": "node app.js",
    "dev": "./node_modules/.bin/nodemon app.js"
  },
  "dependencies": {
    "debug": "^2.6.3",
    "ejs": "^2.5.7",
    "koa": "^2.2.0",
    "koa-bodyparser": "^3.2.0",
    "koa-convert": "^1.2.0",
    "koa-cors": "^0.0.16",
    "koa-json": "^2.0.2",
    "koa-logger": "^2.0.1",
    "koa-onerror": "^1.2.1",
    "koa-router": "^7.1.1",
    "koa-static": "^3.0.0",
    "koa-views": "^5.2.1",
    "koa2-pixie-proxy": "^2.0.3"
  },
  "devDependencies": {
    "nodemon": "^1.8.1"
  }
}
`




class Project extends BaseController {
  constructor() {
    super()
    this.addProject = this.addProject.bind(this);
  }
  async addProject(ctx, next) {

    const projectId = await this.getId('project_id');


    const newProjectInfo={
      ...ctx.request.body
    }



    if(newProjectInfo.developers){
      const developers=await UserModel
      .find({})
      .where("id")
      .in(newProjectInfo.developers);
      newProjectInfo.developers=developers.map(user=>user._id);
    }


    if(newProjectInfo.reporters){
      const reporters=await UserModel
      .find({})
      .where("id")
      .in(newProjectInfo.reporters);
      newProjectInfo.reporters=reporters.map(user=>user._id);
    }

    if(newProjectInfo.guests){
      const guests=await UserModel
      .find({})
      .where("id")
      .in(newProjectInfo.guests);
      newProjectInfo.guests=guests.map(user=>user._id);
    }

    const project = new ProjectModel({
      ...defaultProject,
      ...newProjectInfo,
      id: projectId,
      admin: ctx.user._id
    });
    const newproject = await ProjectModel.addProject(project);
    ctx.record={project}
    if (newproject) {
      ctx.body = "";
    }
  }

  async deleteProject(ctx, next) {
    const project = await ProjectModel.findOne({id: ctx.params.projectId});

    if (!project) {
      ctx.status = 400;
      ctx.body = {
        message: "项目不存在"
      };
    }

    if (ctx.user.type !== 4 && !project.admin.equals(ctx.user._id) && !project.developers.find(id => id.equals(ctx.user._id))) {
      ctx.status = 403;
      ctx.body = {
        message: "没有删除项目权限"
      };
      return;
    }

    await ProjectModel.deleteProject(project);
    ctx.record={project}
    ctx.body = "";

  }

  async updateProject(ctx, next) {

    const project = await ProjectModel.findOne({id: ctx.params.projectId});

    if (!project) {
      ctx.status = 400;
      ctx.body = {
        message: "项目不存在"
      };
    }

    if (ctx.user.type !== 4 && !project.admin.equals(ctx.user._id) && !project.developers.find(id => id.equals(ctx.user._id))) {
      ctx.status = 403;
      ctx.body = {
        message: "没有修改项目权限"
      };
      return;
    }

    const newProjectInfo={
      ...ctx.request.body
    }

    if(ctx.user.type !== 4 &&!project.admin.equals(ctx.user._id) ){
      delete newProjectInfo.admin;
      delete newProjectInfo.developers;
    }else{
      if(newProjectInfo.admin){
        const admin=await UserModel
        .findOne({id:newProjectInfo.admin});
        newProjectInfo.admin=admin._id;
      }
      if(newProjectInfo.developers){
        const developers=await UserModel
        .find({})
        .where("id")
        .in(newProjectInfo.developers);
        newProjectInfo.developers=developers.map(user=>user._id);
      }
    }

    if(newProjectInfo.reporters){
      const reporters=await UserModel
      .find({})
      .where("id")
      .in(newProjectInfo.reporters);
      newProjectInfo.reporters=reporters.map(user=>user._id);
    }

    if(newProjectInfo.guests){
      const guests=await UserModel
      .find({})
      .where("id")
      .in(newProjectInfo.guests);
      newProjectInfo.guests=guests.map(user=>user._id);
    }
    await ProjectModel.updateProject(project, newProjectInfo);
    ctx.record={project}
    ctx.body = "修改成功";

  }








  async getProjectList(ctx, next) {

    let projects = []
    if (ctx.user.type === 4) {
      projects = await ProjectModel.find({}).populate("admin")
    } else {
      projects = await ProjectModel.find({
        $or: [
          {
            public: true
          }, {
            guests: ctx.user._id
          }
        ]
      }).populate("admin")
    }

    if (!projects) {
      ctx.status = 400;
      ctx.body = {
        message: "项目不存在"
      };
    } else {
      ctx.body = projects
    }
  }

  async getSelfProjectList(ctx, next) {

    const projects = await ProjectModel.find({admin: ctx.user._id}).populate("admin")

    if (!projects) {
      ctx.status = 400;
      ctx.body = {
        message: "项目不存在"
      };
    } else {
      ctx.body = projects
    }
  }

  async getDevelopProjectList(ctx, next) {

    const projects = await ProjectModel.find({"developers": ctx.user._id}).populate("admin");

    if (!projects) {
      ctx.status = 400;
      ctx.body = {
        message: "项目不存在"
      };
    } else {
      ctx.body = projects
    }
  }

  async getRelateProjectList(ctx, next) {

    if (ctx.errors) {
      ctx.status = 400;
      ctx.body = ctx.errors;
      return;
    }

    const projects = await ProjectModel.find({"reporters": ctx.user._id}).populate("admin");

    if (!projects) {
      ctx.status = 400;
      ctx.body = {
        message: "项目不存在"
      };
    } else {
      ctx.body = projects
    }
  }

  async getProject(ctx, next) {

    const project = await ProjectModel.findOne({id: ctx.params.projectId}).populate({
      path: 'modules',
      select: "name interfases project_id description id -_id",
      populate: {
        path: 'interfases',
        select: "name url project_id module_id id req res headers method proxy_type versions -_id",
        populate: {
          path: 'remarks',
          select: "id message project_id module_id interfase_id creator updatedAt createdAt version -_id",
        }
      }
    })

    if (!project) {
      ctx.status = 400;
      ctx.body = {
        message: "项目不存在"
      };
    } else {
      ctx.body = {
        id: project.id,
        modules: project.modules
      };
    }
  }

  async getProjectInfo(ctx, next) {

    const project = await ProjectModel.findOne({id: ctx.params.projectId}).populate("admin").populate("reporters").populate("guests").populate("developers")

    let permission = 1;

    if (ctx.user.type === 4 || project.admin.id === ctx.user.id) {
      permission = 4;
    } else if (project.developers.find(item => item.id === ctx.user.id)) {
      permission = 3;
    } else if (project.reporters.find(item => item.id === ctx.user.id)) {
      permission = 2;
    }

    if (!project) {
      ctx.status = 400;
      ctx.body = {
        message: "项目不存在"
      };
    } else {
      ctx.body = {
        permission: permission,
        id: project.id,
        name: project.name,
        description: project.description,
        developers: project.developers,
        reporters: project.reporters,
        guests: project.guests,
        proxy: project.proxy,
        admin: project.admin,
        template: project.template,
        versions:project.versions,
        version:project.version
      };
    }
  }







  async getMarkDown(ctx, next) {
    let project = await ProjectModel.findOne({id: ctx.params.projectId}).populate({
      path: 'modules',
      populate: {
        path: 'interfases',
        populate: {
          path: 'remarks'
        }
      }
    }).exec();
    const mdData = getMdData(project)
    const md = ejs.render(markedown, {...mdData,parseDate});
    ctx.set('Content-disposition', 'attachment;filename=' + encodeURIComponent(project.name) + '.md')
    ctx.body = md
  }

  async getDoc(ctx, next) {
    let project = await ProjectModel.findOne({id: ctx.params.projectId}).populate({
      path: 'modules',
      populate: {
        path: 'interfases',
        populate: {
          path: 'remarks'
        }
      }
    }).exec();
    const mdData = getMdData(project)
    const md = ejs.render(markedown, {...mdData,parseDate});

    await ctx.render("doc", {
      title: project.name,
      id: project.id,
      content: marked(md)
    })
  }

  async getServer(ctx, next) {
    let project = await ProjectModel.findOne({id: ctx.params.projectId}).populate({
      path: 'modules',
      populate: {
        path: 'interfases'
      }
    })

    const mdData = getMdData(project)
    const server = ejs.render(serverTemplate, mdData);
    const zipName = 'server.zip';
    const zipStream = fs.createWriteStream(zipName);
    const zip = archiver('zip');
    zip.pipe(zipStream);

    zip.append(server, {name: 'app.js'});
    zip.append(packageInfo, {name: 'package.js'})

    await zip.finalize();
    ctx.attachment(zipName)
    await send(ctx, zipName);
  }

  async getMock(ctx, next) {
    let project = await ProjectModel.findOne({id: ctx.params.projectId}).populate({
      path: 'modules',
      populate: {
        path: 'interfases'
      }
    }).exec();
    const mdData = getMdData(project)
    let curInterfase;
    let url = ctx.params[0] || "/"

    if (/^\//.test(url)) {
      url = "/" + url
    }

    label : for (let module of mdData.modules) {
      for (let interfase of module.interfases) {
        if (interfase.url.replace(/^\/|\/$/, '') === url.replace(/^\/|\/$/, '') && interfase.method.toUpperCase() === ctx.request.method) {
          curInterfase = interfase;
          break label;
        }
      }
    }

    if (curInterfase && curInterfase.proxyType) {
      if (curInterfase.proxyType === 1) {
        ctx.body = curInterfase.mockRes
      } else {

        let response = await proxy(ctx, next, url, {host: "http://api.91jkys.com:9096/"})
        if (response) {
          Object.keys(response.headers).forEach(h => ctx.set(h, response.headers[h]));

          ctx.status = response.statusCode;
          try {
            ctx.body = extend(JSON.parse(response.body), JSON.parse(curInterfase.mockRes))
          } catch (e) {

            ctx.body = {
              err: e,
              message: "该接口不能合并mock",
              a: response.body,
              b: curInterfase.mockRes
            }
          }
        } else {
          ctx.body = curInterfase.mockRes;
        }
      }
    } else {
      try {
        let response = await proxy(ctx, next, url, {host: "http://api.91jkys.com:9096/"})
        if (response) {
          Object.keys(response.headers).forEach(h => ctx.set(h, response.headers[h]));
          ctx.status = response.statusCode;
          ctx.body = response.body;
        }
      } catch (err) {
        console.log(err.request)
        ctx.body = err.response.body;
        ctx.status = err.statusCode || 500;
      }

    }

  }

}

export default new Project()
