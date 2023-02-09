import { CreateExpressContextOptions } from "@trpc/server/adapters/express"

// export const createContext = ({req, res}: CreateExpressContextOptions) => {
// 	return {
// 		req, 
// 		res,
// 		isAdmin: true
// 	}
// }

export const createContext = () => {
	return {
		isAdmin: true
	}
}