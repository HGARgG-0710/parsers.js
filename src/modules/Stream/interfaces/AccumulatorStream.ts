import type { ICopiable, IPushable } from "../../../interfaces.js"

export type IStorage<T = any> = IPushable<T> & ICopiable
