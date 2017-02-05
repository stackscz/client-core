// @flow

export type ResourcesService = {
	getResource(): Promise;
	postResource(): Promise;
	putResource(): Promise;
	deleteResource(): Promise;
}

