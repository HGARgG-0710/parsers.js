import type { IBaseParseStream } from "../../interfaces.js"

export interface IStreamProvider<T = any> {
	lastStream(): IBaseParseStream<T>
	currStream(): IBaseParseStream<T>
}
