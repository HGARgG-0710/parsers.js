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
export interface IErrorPosition {
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
 */
export interface IErrorData {
	readonly pos: IErrorPosition
	readonly hasError: boolean
	markActive(): void
	markHandled(): void
}

/**
 * This is a version of `IErrorData<Info>` that stores
 * the uid of a source during the course of parsing of
 * which the error ocurred. This can be a filename/filepath
 * (`Id = string` - default), or a `number` (descriptor),
 * etc
 */
export interface IIdErrorData<Id = string> extends IErrorData {
	readonly sourceId: Id
	setSourceId?(name: Id): void
}
