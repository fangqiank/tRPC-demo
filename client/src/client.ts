import { createTRPCProxyClient, httpBatchLink, loggerLink, wsLink, createWSClient, splitLink } from "@trpc/client"

import {AppRouter} from '../../server/router'

const wsClient = createWSClient({
	url: 'ws://localhost:3001/trpc',
})

const client =createTRPCProxyClient<AppRouter>({
	links: [
		// loggerLink(),
		
		// wsLink({
		// 	client: wsClient
		// }),

		// httpBatchLink({
		// url: 'http://localhost:3001/trpc',
		// headers: {
		// 	Authorization: 'TOKEN'
		// }}),

		splitLink({
			condition: op => {
				return op.type === 'subscription' 
			},
			true: wsLink({
				client: wsClient
			}),
			false: httpBatchLink({
				url: 'http://localhost:3001/trpc',
				headers: {
				Authorization: 'TOKEN'
				}}), 
		})
	]
})

const main = async () => {
	const result = await client.sayHi.query()
	console.log(result)

	const result1 = await client.logToServer.mutate('hi from client')
	console.log(result1)

	const newUser = await client.users.create.mutate({
		name: 'zhangsan',
		age: 12
	})
	console.log(newUser)

	const getNewUser = await client.users.byId.query(newUser.id)
	console.log(getNewUser)

	const updatedUser = await client.users.update.mutate({userId: '12', name: 'lisi'})
	console.log(updatedUser)

	const secretData = await client.secretData.query()
	console.log(secretData)

	client.users.onUpdate.subscribe(undefined, {
		onData: id => {
			console.log('Update', id)
		}
	})

	// wsClient.close()
}

document.addEventListener('click', () => {
	client.users.update.mutate({
		userId: '1',
		name: 'wang wu'
	})
})

main()