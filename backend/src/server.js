// =============================================
// GlobeTrotter — Express Server Entry Point
// =============================================
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import rateLimit from 'express-rate-limit'

import router from './routes/index.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// ---- Security Middleware ----
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
)

// ---- CORS ----
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
]

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error(`CORS policy: Origin ${origin} not allowed`))
      }
    },
    credentials: true,
  })
)

// ---- Rate Limiting ----
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
})

app.use('/api', limiter)

// ---- Body Parsers ----
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ---- HTTP Logging ----
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// ---- Static Files (uploads) ----
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ---- API Routes ----
app.use('/api', router)

// ---- Health Check ----
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '🌍 GlobeTrotter API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
})

// ---- 404 Handler ----
app.use(notFoundHandler)

// ---- Global Error Handler ----
app.use(errorHandler)

// ---- Start Server ----
const PORT = parseInt(process.env.PORT) || 5000

app.listen(PORT, () => {
  console.log(`\n🌍 GlobeTrotter API`)
  console.log(`   ├─ Environment : ${process.env.NODE_ENV || 'development'}`)
  console.log(`   ├─ Port        : ${PORT}`)
  console.log(`   ├─ API URL     : http://localhost:${PORT}/api`)
  console.log(`   └─ Health      : http://localhost:${PORT}/health\n`)
})

export default app
