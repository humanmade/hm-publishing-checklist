## Local development.

Run `npm install`

Run `npm run start`. This will watch for changes in JS and CSS files and live reload the page.

If you are using HTTPS locally, you will need to generate a local certificate. [Follow the instructions here](https://certsimple.com/blog/localhost-ssl-fix), and then update the `.wepback/config.js` file to pass this - something like this:

```
const fs = require( 'fs' );

const config = [
	{
		name: 'hm-publishing-checklist',
		...
		https: {
			key: fs.readFileSync('.localhost-ssl/key.pem'),
			cert: fs.readFileSync('.localhost-ssl/cert.pem'),
		},
		...
	},
];

module.exports = {
	config,
};
```
