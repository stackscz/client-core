import { get as g, isObject } from 'lodash';
import hash from 'utils/hash';
import normalizeLink2 from 'modules/resources/utils/normalizeLink2';
import { schema as NS } from 'normalizr';

const generalResourceSchema = new NS.Entity('collection');

export default class ResourceSchema {
	constructor(key, schema, resource) {
		this._key = key;
		this.schema = schema;
		this._resource = resource;
	}

	get key() {
		return this._key;
	}

	getLink(input, parent, key) {
		const resource = this._resource;
		const resourceLinkName = g(resource, 'x-linkName');

		const link = normalizeLink2(
			{
				name: resourceLinkName,
				params: { ...input, parent },
			},
			{ [resourceLinkName]: resource },
		);
		return link;
	}

	getId(input, parent, key) {
		const link = this.getLink(input, parent, key);
		return `${hash(link)}`;
	}

	merge(entityA, entityB) {
		return entityA;
	}

	normalize(input, parent, key, visit, addEntity) {
		const visitedEntity = visit(input, parent, key, this.schema, addEntity);
		const id = this.getId(input, parent, key);
		addEntity(this, { content: visitedEntity, id, link: this.getLink(input, parent, key) }, input, parent, key);
		return id;
	}

	denormalize(entity, unvisit) {
		let c = entity;
		// if (this._key !== this.schema._key) {
			c = g(unvisit(entity, generalResourceSchema), 'content');
		// }
		return unvisit(c, this.schema);
	}
}
