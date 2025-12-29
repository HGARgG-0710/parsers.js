import type { IParseStream } from "../../interfaces.js"

export interface IStreamProvider<T = any> {
	lastStream(): IParseStream<T>
	currStream(): IParseStream<T>
}
