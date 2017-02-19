import React from 'react';
import { bm } from 'client-core/src/utils/bem';

const Link = ({
	moduleName = 'Link',
	to,
	onClick,
	children,
	small
}) => {
	const LinkComponent = onClick ? 'span' : 'a';

	return (
		<LinkComponent
			className={bm(moduleName, { small })}
			to={to}
			onClick={onClick}
		>
			{children}
		</LinkComponent>
	);
};

export default Link;
