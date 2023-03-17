// * Contains general things...

// * N-tuple type (supports unions (a | b | c) and Num = number cases...);
export type Tuple<Type, Num extends number> = Num extends Num
	? number extends Num
		? Type[]
		: _TupleOf<Type, Num, []>
	: never

// * N-tuple type (without unions and Num = number cases...)
export type _TupleOf<
	Tuple,
	Num extends number,
	Recurring extends unknown[]
> = Recurring["length"] extends Num
	? Recurring
	: _TupleOf<Tuple, Num, [Tuple, ...Recurring]>
