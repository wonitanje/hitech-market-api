import { Router } from 'express'
import userRouter from './user-router'
import componentsRouter from './components-router'
import modelsRouter from './models-router'
import catalogRouter from './catalog-router'

const router = new Router()

router.use('/user', userRouter)
router.use('/components', componentsRouter)
router.use('/models', modelsRouter)
router.use('/catalog', catalogRouter)

export default router