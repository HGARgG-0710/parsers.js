import type { IOwnedStream } from "./OwnedStream.js"

/**
 * This is a type for representing a validator-function for 
 * custom user logic employed by the `ValidatorStream`. 
 */
export type IValidator<T = any> = (resource: IOwnedStream<T>) => void
