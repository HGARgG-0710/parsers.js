import type { IResultStateStream } from "../../interfaces.js"

export interface IStreamProvider<T = any> {
	lastStream(): IResultStateStream<T>
	currStream(): IResultStateStream<T>
}
