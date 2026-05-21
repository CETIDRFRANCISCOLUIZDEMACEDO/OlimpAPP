import { Router } from 'express'
import { listTrilhas, listModulos } from '../controllers/trilhasController'

const router = Router()

router.get('/', listTrilhas)
router.get('/:trilhaId/modulos', listModulos)

export default router
