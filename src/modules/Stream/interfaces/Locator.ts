import type { IInputStream } from "../../../interfaces/Stream.js"

/**
 * This is an interface used by some of the library implementations
 * of the `IErrorPosition`. These are strategy objects that
 * provide the algorithm for locating the positions of a specified
 * type.
 */
export interface IStreamLocator<T = any> {
	locate(inputStream: IInputStream): T | null
}
