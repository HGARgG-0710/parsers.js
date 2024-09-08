import type { Currable, Endable } from "../BasicStream/interfaces.js"

export interface PreBasicStream<Type = any> extends Endable, Currable<Type> {}
