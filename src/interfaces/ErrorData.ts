import type { ICopiable } from "../interfaces.js"
import type { IInputStream } from "./Stream.js"

/**
 * This is an interface representing an encapsulation-object of
 * a printable error-occurence position. It is (optionally) printable
 * via the `toString(): string` method and (optionally) convertible
 * to a numerical index within the string via `toNumber(): number`.
 * It is constructed via calling the `locate(): void` method,
 * which identifies the source from which the position is to
 * be read initially. The method for position-location is
 * implementation-specific.
 *
 * The two alternatives exist because it does not always make sense
 * to provide both. Consider the case when `toString = toNumber`.
 * A client that employs both will print out useless information,
 * duplicating call to `.toNumber()`. This is why it is preferable
 * in such implementations to enable omission of `toString`.
 */
export interface IPrintablePosition extends ICopiable {
	toString?(): string
	toNumber?(): number
	locate(): this
}

/**
 * This is an interface for representing a data of an error's
 * occurence during the process of parsing. It records a
 * `pos: IErrorPosition` instance, which represents the encapsulation
 * of a printable position of the error, `hasError: boolean` to
 * indicate that the object does indeed contain a live unhandled error
 * (with `markActive/markHandled` public methods to manipulate it).
 * It also encapsulates a map of user-provided information that
 * may be important for various user-defined errors. The map is
 * accessible via the `getInfo/setInfo` methods.
 */
export interface IErrorData extends ICopiable {
	readonly pos: IPrintablePosition
	readonly hasError: boolean
	getInfo(keyName: string): any
	setInfo(keyName: string, value: NonNullable<any>): void
	markHandled(): void
	refresh(): void
}

/**
 * This type represents a factory for `IErrorData` objects
 * relying upon an `inputStream: IInputStream`, and an
 * `input: InitType`
 */
export type IErrorDataMaker<InType = any, InitType = any> = (
	inputStream: IInputStream<InType, InitType>,
	input: InitType
) => IErrorData
