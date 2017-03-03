// @flow

type LoopbackWhereParam = string | {
	like?: string,
	ilike?: string,
	lt?: number,
	lte?: number,
	gt?: number,
	gte?: number,
	between?: number,
	inq?: Array<string>,
	nin?: Array<string>,
};

type LoopbackWhere = {
	[key: string]: LoopbackWhereParam,
};

export type LoopbackFilter = void | {
	offset?: number,
	limit?: number,
	page?: void,
	where?: LoopbackWhere,
	order?: Array<string>,
};
