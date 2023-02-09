import { createExpressMiddleware } from "@trpc/server/adapters/express"
import express from "express"
import cors from "cors"
import dotenv from 'dotenv'
import { t } from "./trpc"
import { appRouter } from "./router"

dotenv.config()

const port = process.env.PORT || 3000

const app = express()

app.use(cors({ origin: process.env.ORIGIN }))

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: ({ req, res }) => {
      return {}
    },
  })
)

app.listen(port, () => console.log(`Server is running on port ${port}`))
