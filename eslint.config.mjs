import ljharb from '@ljharb/eslint-config/flat';

export default [
	...ljharb,
	{
		rules: {
			'func-style': 'off',
			'multiline-comment-style': 'off',
			'sort-keys': 'off',
		},
	},
	{
		ignores: [
			'coverage/**',
			'example/bundle.js',
		],
	},
	{
		files: ['example/**'],
		rules: {
			'no-console': 'off',
		},
	},
];
