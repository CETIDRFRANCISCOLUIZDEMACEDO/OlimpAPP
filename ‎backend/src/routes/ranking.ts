import { Router } from 'express'
import { getRanking } from '../controllers/rankingController'
import { authMiddleware } from '../middlewares/authMiddleware'

const router = Router()

router.use(authMiddleware)
router.get('/', getRanking)

export default router
