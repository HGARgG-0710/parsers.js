import type {
	IEndableStream,
	ILineIndex,
	IStream,
	IStreamParser
} from "../../interfaces.js"

export type IIndexStream = IStreamParser<string, string> & {
	lineIndex: ILineIndex
}

export type IIndexStreamConstructor = new (
	value?: IEndableStream<string>,
	lineIndex?: ILineIndex
) => IIndexStream

export type INewlinePredicate = (x: IStream<string>) => boolean
