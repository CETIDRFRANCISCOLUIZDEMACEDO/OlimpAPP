import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import profileRoutes from './routes/profile'
import trilhasRoutes from './routes/trilhas'
import progressoRoutes from './routes/progresso'
import rankingRoutes from './routes/ranking'

dotenv.config()

const app = express()
const PORT = process.env['PORT'] ?? 3333

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use(express.json())

app.use('/auth', authRoutes)
app.use('/me', profileRoutes)
app.use('/trilhas', trilhasRoutes)
app.use('/progresso', progressoRoutes)
app.use('/ranking', rankingRoutes)

app.listen(PORT, () => {
  console.log(`OlimpAPP backend rodando na porta ${PORT}`)
})
