import React from 'react';
import { get as g } from 'lodash';
import { values, keys, mapValues, flow, map, orderBy, isNumber } from 'lodash/fp';
import { compose, withState, withPropsOnChange } from 'recompose';
import { bm, be } from 'utils/bliss';

import './index.sass';

const Viewport = ({ width, height, children }) => {
	const styleWidth = isNumber(width) ? `${width}px` : width;
	const styleHeight = isNumber(height) ? `${height}px` : height;
	const style = {
		width: styleWidth,
		height: styleHeight,
		border: '10px solid #ddd',
	};
	return (
		<div style={{ border: '1px solid' }}>
			<div>width: {styleWidth}, height: {styleHeight}</div>
			<div style={style}>{children}</div>
		</div>
	)
};

const withShowcase = compose(
	withState('activeExampleKey', 'setActiveExampleKey', null),
	withPropsOnChange(
		['examples'],
		({ examples }) => {
			return {
				examplesKeysList: flow(
					mapValues.convert({ 'cap': false })((example, key) => ({ key, ...example })),
					values,
					orderBy(['title', 'key'], []),
					map(({ key }) => key),
				)(examples),
			};
		},
	),
	withPropsOnChange(
		['activeExampleKey', 'examples'],
		({ activeExampleKey, examples }) => {
			const activeExample = g(examples, [activeExampleKey]);
			// const activeExample = examples[activeExampleKey];
			// console.log(activeExampleKey);
			// console.log(activeExample);
			return {
				activeExample,
			};
		},
	),
);

const renderShowcase = ({
	moduleName = 'Showcase',
	examplesKeysList,
	examples,
	activeExample: {
		component: ShowcasedComponent,
		initialProps: showcasedComponentProps,
		viewports = [],
	} = {},
	activeExampleKey,
	setActiveExampleKey,
}) => {
	console.log('viewports', viewports);
	return (
		<div className={bm(moduleName)}>
			<div className={be(moduleName, 'componentsList')}>
				<ul>
					{examplesKeysList.map((exampleKey) => {
						const example = examples[exampleKey];
						const title = g(example, 'title', exampleKey);
						return (
							<li key={exampleKey}>
								<a onClick={() => setActiveExampleKey(exampleKey)}>{title}</a>
								{exampleKey === activeExampleKey && <strong>*</strong>}
							</li>
						)
					})}
				</ul>
			</div>
			<div className={be(moduleName, 'componentConfig')}>
				fds
			</div>
			<div className={be(moduleName, 'componentShowcase')}>
				<div className={be(moduleName, 'componentShowcaseWrapper')}>
					{!!ShowcasedComponent && (
						!viewports.length ? (
							<ShowcasedComponent {...showcasedComponentProps} />
						) : (
							viewports.map(([width, height], key) => {
								return (
									<Viewport key={key} width={width} height={height}>
										<ShowcasedComponent {...showcasedComponentProps} />
									</Viewport>
								);
							})
						)
					)}

				</div>
			</div>
		</div>
	)
};

const Showcase = withShowcase(renderShowcase);

export default Showcase;
