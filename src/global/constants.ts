/**
 * Constant used to designate an invalid index position.
 *
 * Applied in contexts:
 *
 * 1. checking an index for correctness
 * 2. checking non-emptiness of an array
 * 3. invalidating an obsolete `IPointer` instance
 * 4. as a default value whene using a valid value makes no sense
 * 5. for presence of something using a public "counting" variable/method
 */
export const BadIndex = -1

/**
 * Designates explicit usage of a default.
 * Largely syntax sugar over just passing an `undefined`.
 * Useful when the order of optional arguments is inopportune.
 */
export const MissingArgument = undefined

/**
 * A constant used by `Autocache` to represent its lack of
 * a certain item inside its "cach"-like key-value data
 * structure, with read-write capabilities.
 */
export const NotCached = undefined

// ! pre-doc: for objects that keep an Entity 'id'
// Specifically, it's used as either:
// 		1. INITIAL STATE, or
// 		2. a PLACEHOLDER, to show that one DOES NOT connect to an object with a valid ID
export const BadId = -1

// ! pre-doc: a basic way to obtain a new Entity id (via increments)
export const IncrementId = (oldId: number) => oldId + 1
