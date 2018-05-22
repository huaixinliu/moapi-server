import koaRouter from 'koa-router';
import User from '../controllers/user';
import Check from '../middlewares/check'
import validate from "../middlewares/validate"
const router=koaRouter()
router.prefix('/users');


router.get('/',Check.token,User.getUserList);
router.post('/add',validate("ADDUSER"),Check.token,Check.admin,User.addUser);
router.post('/delete',Check.token,Check.admin,User.deleteUser);
router.post('/signup',validate("SIGNUP"),User.signup);
router.post('/signin',validate("SIGNIN"),User.signin);
router.post('/signout',User.signout);

router.get('/watch-project',Check.token,User.getWatchProject);
router.post('/watch-project',Check.token,User.addWatchProject);
router.put('/watch-project',Check.token,User.deleteWatchProject);

export default router
