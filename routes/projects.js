import koaRouter from 'koa-router';
import Project from '../controllers/project';
import Check from '../middlewares/check'
import validate from "../middlewares/validate"
const router=koaRouter()
router.prefix('/project');



router.get('/',Check.token,Project.getProjectList);
router.get('/self',Check.token,Project.getSelfProjectList);
router.get('/relate',Check.token,Project.getRelateProjectList);
router.get('/develop',Check.token,Project.getDevelopProjectList);
router.get('/:projectId',Check.token,Project.getProject);
router.get('/info/:projectId',Check.token,Project.getProjectInfo);
router.post('/',validate("addPRO"),Check.token,Project.addProject);
router.put('/:projectId',validate("UPPRO"),Check.token,Project.updateProject);
router.delete('/:projectId',validate("DELPRO"),Check.token,Project.deleteProject);


router.get('/md/:projectId',Project.getMarkDown);
router.get('/doc/:projectId',Project.getDoc);
router.get('/server/:projectId',Project.getServer);
router.all('/mock/:projectId/*',Project.getMock);
router.all('/mock/:projectId',Project.getMock);

router.all('/test/:projectId/*',Project.getMock);
router.all('/test/:projectId',Project.getMock);
export default router
