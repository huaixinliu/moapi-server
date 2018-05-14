import koaRouter from 'koa-router';
import Project from '../controllers/project';
import Check from '../middlewares/check'

const router=koaRouter()
router.prefix('/project');

router.get('/', function (ctx, next) {
  ctx.body = 'this is a interface api';
});


router.get('/:projectId',Project.getProject);
router.post('/',Project.addProject);

router.get('/md/:projectId',Project.getMarkDown);
router.get('/doc/:projectId',Project.getDoc);


export default router
