import ws from 'ws'
import { createExpressMiddleware } from "@trpc/server/adapters/express"
import {applyWSSHandler} from '@trpc/server/adapters/ws'
import express from "express"
import cors from "cors"
import dotenv from 'dotenv'
import { createContext } from "./context" 
import { appRouter } from "./router"

dotenv.config()

const port = process.env.PORT || 3000

const app = express()

app.use(cors({ origin: process.env.ORIGIN }))

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext
  })
)

const server = app.listen(
  port, 
  () => console.log(`Server is running on port ${port}`)
)

applyWSSHandler({
  wss: new ws.Server({server}),
  router: appRouter,
  createContext
})
