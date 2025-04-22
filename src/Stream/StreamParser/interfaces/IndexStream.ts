import type {
	IConcreteStreamParser,
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
) => IConcreteIndexStream

export type INewlinePredicate = (x: IStream<string>) => boolean

export type IConcreteIndexStream = IIndexStream &
	IConcreteStreamParser<string, string>
