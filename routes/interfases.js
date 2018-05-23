import koaRouter from 'koa-router';
import Interfase from '../controllers/interfase';
import Check from '../middlewares/check'
import Record from '../middlewares/record'
import validate from "../middlewares/validate"


const router=koaRouter()
router.prefix('/interfase');


router.get('/:interfaseId',Interfase.getInterfase);
router.put('/:interfaseId',validate("UPINT"),Check.token,Record.addInterfaseRecord,Interfase.updateInterfase);
router.delete('/:interfaseId',validate("DELINT"),Check.token,Record.addInterfaseRecord,Interfase.deleteInterfase);
router.post('/',validate("ADDINT"),Check.token,Record.addInterfaseRecord,Interfase.addInterfase);


export default router
