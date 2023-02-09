import { t } from "../trpc"
import { z } from "zod"
import { randomUUID } from "crypto"
import { observable } from "@trpc/server/observable"
import { EventEmitter } from "stream"

type User = {
	id: string,
	name: string, 
	age: number
}

const Users: User[] =[
	{ id: "1", name: "Kyle", age: 27 },
  { id: "2", name: "Julie", age: 45 },
]

const eventEmitter = new EventEmitter()

export const userRouter = t.router({
	byId: t.procedure.input(z.string()).query(req => Users.find(user => user.id === req.input)),

	update: t.procedure.input(
		z.object({
			userId: z.string()
		})
	)
	.input(z.object({
		name: z.string()
	}))
	.output(z.object({
		name: z.string(),
		id:z.string()
	}))
	.mutation(req => {
		console.log(req.ctx.isAdmin)
		console.log(`Updating user ${req.input.userId} to have the name ${req.input.name}`)
		eventEmitter.emit('Updated', req.input.name)
		return {id: req.input.userId, name: req.input.name}
	}),

	onUpdate: t.procedure.subscription(() => {
		return observable<string>(emit => {
			eventEmitter.on('Updated', emit.next)

			return () => {
				eventEmitter.off('Updated', emit.next)
			}
		})
	}),

	create: t.procedure
		.input(z.object({
			name:z.string(),
			age: z.number()
		}))
		.mutation(req => {
			const {name, age} = req.input
			const user: User = {id: randomUUID(), name, age}
			Users.push(user)
			return user
		})
})

