export type IStep<T = any> = number | IStepPredicate<T>

export type IStepPredicate<In = any> = (
	item: In,
	pos?: number
) => boolean | number
