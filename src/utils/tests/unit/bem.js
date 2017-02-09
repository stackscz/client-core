import test from 'tape';

import * as bem from 'client-core/src/utils/bem';

test('bem.module: Module', t => {
	t.equal(
		bem.module('Button'),
		'Button'
	);

	t.end();
});

test('bem.module: Module with modifier as string', t => {
	t.equal(
		bem.module('Button', 'full'),
		'Button Button--full'
	);

	t.end();
});

test('bem.module: Module with modifier as array', t => {
	t.equal(
		bem.module('Button', ['full', 'small']),
		'Button Button--full Button--small'
	);

	t.end();
});

test('bem.module: Module with modifier as object', t => {
	t.equal(
		bem.module('Button', { full: true, small: true }),
		'Button Button--full Button--small'
	);

	t.end();
});

test('bem.module: Module with modifier as object 2', t => {
	t.equal(
		bem.module('Button', { full: true, small: false }),
		'Button Button--full'
	);

	t.end();
});

test('bem.module: Module with modifier as array with object', t => {
	t.equal(
		bem.module('Button', ['large', { active: true }]),
		'Button Button--large Button--active'
	);

	t.end();
});

test('bem.module: Module with modifier and other classes in string', t => {
	t.equal(
		bem.module('Button', 'large', 'isActive'),
		'Button Button--large isActive'
	);

	t.end();
});

test('bem.module: Module with modifier and other classes in array', t => {
	t.equal(
		bem.module('Button', 'large', ['isActive', 'isFocused']),
		'Button Button--large isActive isFocused'
	);

	t.end();
});

test('bem.module: Module with modifier and other classes in object', t => {
	t.equal(
		bem.module('Button', 'large', { isActive: true, isFocused: true }),
		'Button Button--large isActive isFocused'
	);

	t.end();
});

test('bem.module: Module with modifier and other classes in array with object', t => {
	t.equal(
		bem.module('Button', 'large', ['isActive', { isFocused: true }]),
		'Button Button--large isActive isFocused'
	);

	t.end();
});

test('bem.module: Module with modifier and empty array', t => {
	t.equal(
		bem.module('Button', 'large', []),
		'Button Button--large'
	);

	t.end();
});

test('bem.module: Module and odd array 1', t => {
	t.equal(
		bem.module('Button', null, [undefined]),
		'Button'
	);

	t.end();
});

test('bem.module: Module and odd array 2', t => {
	t.equal(
		bem.module('Button', null, [null]),
		'Button'
	);

	t.end();
});

test('bem.module: Module and other classes in object 1', t => {
	t.equal(
		bem.module('Button', null, { isActive: true, isFocused: true }),
		'Button isActive isFocused'
	);

	t.end();
});

test('bem.module: Module and other classes in object 2', t => {
	t.equal(
		bem.module('Button', null, { isActive: true, isFocused: false }),
		'Button isActive'
	);

	t.end();
});

test('bem.module: Module and other classes in empty object', t => {
	t.equal(
		bem.module('Button', null, {}),
		'Button'
	);

	t.end();
});

test('bem.module: Module with modifiers', t => {
	t.equal(
		bem.module('Button', 'large convenient'),
		'Button Button--large Button--convenient'
	);

	t.end();
});

test('bem.module: Module with modifiers with extra spaces', t => {
	t.equal(
		bem.module('Button', '  large bulky '),
		'Button Button--large Button--bulky'
	);

	t.end();
});


test('bem.element: Element', t => {
	t.equal(
		bem.element('Header', 'title'),
		'Header-title'
	);

	t.end();
});

test('bem.element: Element with modifiers', t => {
	t.equal(
		bem.element('Header', 'title', 'large convenient'),
		'Header-title Header-title--large Header-title--convenient'
	);

	t.end();
});
