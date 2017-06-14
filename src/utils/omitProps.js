import { mapProps } from 'recompose';
import { omit, pipe } from 'lodash/fp';

const omitProps = pipe(omit, mapProps);

export default omitProps;
