import { Router } from 'express'
import { getMe, updateProfile } from '../controllers/profileController'
import { authMiddleware } from '../middlewares/authMiddleware'

const router = Router()

router.use(authMiddleware)
router.get('/', getMe)
router.put('/', updateProfile)

export default router
