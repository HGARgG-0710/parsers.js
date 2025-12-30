import type { IErrorData } from "../../../interfaces.js"

export interface IErrorObjectFactory<T = any> {
	getErrorObject(errData: IErrorData): T
}
