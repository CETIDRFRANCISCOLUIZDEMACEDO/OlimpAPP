import { Router } from 'express'
import { getProgresso, updateProgresso } from '../controllers/progressoController'
import { authMiddleware } from '../middlewares/authMiddleware'

const router = Router()

router.use(authMiddleware)
router.get('/', getProgresso)
router.post('/', updateProgresso)

export default router
