import { get as g } from 'lodash';
import { entityIndexSelectorFactory } from 'one-app-core/modules/entityIndexes/selectors';

export const getInfiniteScrollProps = (entityIndex) => {
	const entityIndexContent = g(entityIndex, 'content');
	const error = g(entityIndex, 'error');
	const isLoading = g(entityIndex, 'fetching');
	const hasMorePosts = (
		!entityIndex
		||
		isLoading
		||
		!!error
		||
		!!(entityIndexContent && entityIndexContent.length)
	);

	return {
		error,
		isLoading,
		hasMorePosts,
	};
};

export const getInfiniteScrollPropsFactory = (modelName, filter) => state => {
	const entityIndex = entityIndexSelectorFactory(
		modelName,
		filter,
	)(state);

	return getInfiniteScrollProps(entityIndex);
};

