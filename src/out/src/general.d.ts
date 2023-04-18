export type Tuple<Type, Num extends number> = Num extends Num ? number extends Num ? Type[] : _TupleOf<Type, Num, []> : never;
export type _TupleOf<Tuple, Num extends number, Recurring extends unknown[] = []> = Recurring["length"] extends Num ? Recurring : _TupleOf<Tuple, Num, [Tuple, ...Recurring]>;
export type Table<Type> = {
    [a: Key]: Type;
};
export type Key = string | number | symbol;
