import koaRouter from 'koa-router';
import Module from '../controllers/module';
import Check from '../middlewares/check'
import validate from "../middlewares/validate"
import Record from '../middlewares/record'
const router=koaRouter()
router.prefix('/module');




router.delete('/:moduleId',validate("DELMOD"),Check.token,Record.addModuleRecord,Module.deleteModule);
router.put('/:moduleId',validate("UPMOD"),Check.token,Record.addModuleRecord,Module.updateModule);
router.post('/',validate("ADDMOD"),Check.token,Record.addModuleRecord,Module.addModule);


export default router
