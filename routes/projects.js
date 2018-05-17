import koaRouter from 'koa-router';
import Project from '../controllers/project';
import Check from '../middlewares/check'

const router=koaRouter()
router.prefix('/project');



router.get('/',Project.getProjectList);
router.get('/:projectId',Project.getProject);
router.post('/',Project.addProject);

router.get('/md/:projectId',Project.getMarkDown);
router.get('/doc/:projectId',Project.getDoc);
router.get('/server/:projectId',Project.getServer);
router.all('/mock/:projectId/*',Project.getMock);
router.all('/mock/:projectId',Project.getMock);
export default router
