/* eslint-disable no-console */
/* global wp */

import { dispatch } from '@wordpress/data';

import { STORES } from './constants';
import TestCheckbox from './components/test-checkbox';
// import { registerTest } from './index';

console.log( 'hi' );

window.hmPublishingChecklistTests = [];

export const registerTest = (
	id,
	args,
) => {
	if ( window.hmPublishingChecklistTests.find( _t => _t.id === id ) ) {
		console.log( 'test already registered with this ID.' );
		return;
	}

	const {
		title,
		test,
		defaultState = false,
		children = null,
	} = args;

	dispatch( STORES.PLUGIN ).updateTest( id, defaultState );

	window.hmPublishingChecklistTests.push( {
		id,
		title,
		test,
		defaultState,
		children,
	} );
}

window.setTimeout( () => {

	registerTest( 'test-1', {
		title: 'This test always passes',
		test: () => {
			console.log( 'testing test-1' );
			return true;
		},
	} );

	registerTest( 'test-2', {
		title: 'Post has at least 1 category.',
		test: () => {
			const cats = wp.data.select( STORES.CORE_EDITOR ).getEditedPostAttribute( 'categories' );
			return cats.length >= 1;
		},
	} );

	registerTest( 'test-3', {
		title: 'Check the box.',
		defaultState: false,
		children: (
			<div>
				<TestCheckbox id="test-3" />
			</div>
		),
	} );
}, 500 );
