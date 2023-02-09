import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import {AppRouter} from '../../server/router'

const client =createTRPCProxyClient<AppRouter>({
	links: [httpBatchLink({
		url: 'http://localhost:3001/trpc'
	})]
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
}

main()