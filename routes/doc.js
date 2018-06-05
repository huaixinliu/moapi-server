import koaRouter from 'koa-router';
import Doc from '../controllers/doc';
import Check from '../middlewares/check'
import validate from "../middlewares/validate"
import multer from 'koa-multer';

const storage = multer.diskStorage({
  //文件保存路径
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  //修改文件名称
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    cb(null,fileFormat[0]+Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
})

const upload = multer({ storage: storage });

const router=koaRouter()
router.prefix('/doc');

router.post('/upload',Check.token,upload.single('file'),Doc.uploadDoc);
router.post('/',Check.token,Doc.addDoc);
router.get('/:docId',Check.token,Doc.getDoc);
router.get('/preview/:docId',Doc.previewDoc);
router.delete('/:docId',Check.token,Doc.deleteDoc);
router.put('/:docId',Check.token,Doc.updateDoc);


export default router
