const fs = require( 'fs' );

const config = [
	{
		name: 'hm-publishing-checklist',
		path: '',
		https: {
			key: fs.readFileSync('.localhost-ssl/key.pem'),
			cert: fs.readFileSync('.localhost-ssl/cert.pem'),
		},
		entry: {
			'plugin-editor': './src/index.js',
			'plugin-style': './src/index.scss',
		},
	},
];

module.exports = {
	config,
};
