import koaRouter from 'koa-router';
import Module from '../controllers/module';
import Check from '../middlewares/check'
import validate from "../middlewares/validate"
const router=koaRouter()
router.prefix('/module');




router.delete('/:moduleId',validate("DELMOD"),Check.token,Module.deleteModule);
router.put('/:moduleId',validate("UPMOD"),Check.token,Module.updateModule);
router.post('/',validate("ADDMOD"),Check.token,Module.addModule);


export default router
