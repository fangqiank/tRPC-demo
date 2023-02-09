import {t} from '../trpc'
import {z} from 'zod'
import {userRouter} from './user'

export const appRouter = t.router({
  sayHi: t.procedure.query(() => 'Hi'),

  logToServer: t.procedure.input(v => {
    if(typeof v === 'string')
      return v
    
    throw new Error('Invalid input: expected string ')
  }).mutation(req => {
    console.log(`Client says: ${req.input}`)
    return true
  }),

	greeting: t.procedure
		.input(z.object({
			name: z.string()
		}))
		.query(req => {
			console.log(req)
			return `Hello ${req.input.name}`
		}),
	
	errors: t.procedure.query(() => {
		throw new Error('error nessage')
	}),

	users: userRouter
})

// export const mergedRoute = t.mergeRouters(appRouter, userRouter)

export type AppRouter = typeof appRouter
