import React from 'react';
import { IntlProvider } from 'react-intl';

export default function (intlConfig) {
	return function wrapWithIntl(IntlRoot) {
		return () => (
			<IntlProvider
				{...intlConfig}
			>
				<IntlRoot />
			</IntlProvider>
		);
	};
}
