import DocModel from './../models/doc'
import BaseController from '../base/baseController'
import ProjectModel from './../models/project';
import marked from 'best-marked'
import highlight from 'highlight.js'

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
  depthTo: 3,
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
const fs = require('fs-extra')
class Record extends BaseController{
  constructor(){
    super()
    this.addDoc=this.addDoc.bind(this);
    this.uploadDoc=this.uploadDoc.bind(this);
  }

  async getDoc(ctx, next){
    const doc=await DocModel
    .findOne({id:ctx.params.docId})
    .populate("project");

    if(!doc){
      ctx.status = 400;
      ctx.body = {
        msg: "文档不存在"
      };
      return;
    }
    ctx.body = {
      title:doc.title,
      content:doc.content,
      projectName:doc.project.name,
      projectId:doc.project.id,
      id:doc.id
    };
  }


  async addDoc(ctx, next){
    const project= await ProjectModel.findOne({
      id:ctx.request.body.project_id
    });

    if(ctx.user.type!==4&&!project.admin.equals(ctx.user._id)&&!project.developers.find(id=>id.equals(ctx.user._id))){
      ctx.status = 403;
      ctx.body = {message:"没有修改模块权限"};
      return;
    }

    const docId=await this.getId('doc_id');
    const doc = new DocModel({
      ...ctx.request.body,
      id:docId,
      creator:ctx.user._id,
      project:project._id
    });
    await DocModel.addDoc(doc,project);

    // ctx.record={
    //   project,
    //   doc
    // }
    ctx.body = doc;
  }

  async uploadDoc(ctx, next){
    const project= await ProjectModel.findOne({
      id:ctx.query.projectId
    });

    if(ctx.user.type!==4&&!project.admin.equals(ctx.user._id)&&!project.developers.find(id=>id.equals(ctx.user._id))){
      ctx.status = 403;
      ctx.body = {message:"没有修改模块权限"};
      return;
    }
    let content=await fs.readFile(ctx.req.file.path);
    const docId=await this.getId('doc_id');
    const doc = new DocModel({
      title:ctx.req.file.originalname.split('.')[0],
      content:content.toString(),
      id:docId,
      creator:ctx.user._id,
      project:project._id
    });
    await DocModel.addDoc(doc,project);
    ctx.body={title:doc.titel,id:doc.id}
  }

  async updateDoc(ctx, next){
    const doc=await DocModel.findOne({id:ctx.params.docId});

    if(!doc){
      ctx.status = 400;
      ctx.body = {
        msg: "文档不存在"
      };
      return;
    }

    const project= await ProjectModel.findOne({
      _id:doc.project
    });

    if(ctx.user.type!==4&&!project.admin.equals(ctx.user._id)&&!project.developers.find(id=>id.equals(ctx.user._id))){
      ctx.status = 403;
      ctx.body = {message:"没有修改文档权限"};
      return;
    }

    const docInfo={
      ...ctx.request.body
    }

    await DocModel.updateDoc(doc,docInfo)


    ctx.body = {
      message: "更新成功",
    };

  }


  async deleteDoc(ctx, next){
    const doc=await DocModel
    .findOne({id:ctx.params.docId})

    if(!doc){
      ctx.status = 400;
      ctx.body = {
        msg: "文档不存在"
      };
      return;
    }

    const project= await ProjectModel.findOne({
      _id:doc.project
    });

    if(ctx.user.type!==4&&!project.admin.equals(ctx.user._id)&&!project.developers.find(id=>id.equals(ctx.user._id))){
      ctx.status = 403;
      ctx.body = {message:"没有修改文档权限"};
      return;
    }


    await DocModel.deleteDoc(doc,project)

    ctx.body = {
      message: "删除成功",
    };


  }

  async previewDoc(ctx, next){
    let doc = await DocModel.findOne({id: ctx.params.docId});

    await ctx.render("doc", {
      title: doc.title,
      id: doc.id,
      content: marked(doc.content)
    })
  }






}

export default new Record()
