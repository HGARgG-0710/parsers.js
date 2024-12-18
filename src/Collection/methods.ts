import { IterableCollection } from "./abstract.js"
export const iterator = IterableCollection.prototype[Symbol.iterator]
export * as Buffer from "./Buffer/methods.js"
