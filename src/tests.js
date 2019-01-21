/* eslint-disable no-console */
/* global wp */

import { Fragment } from '@wordpress/element';
import { dispatch, select } from '@wordpress/data';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { STORES } from './constants';

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
		getChildren = () => null,
	} = args;

	dispatch( STORES.PLUGIN ).updateTest( id, defaultState );

	window.hmPublishingChecklistTests.push( {
		id,
		title,
		test,
		defaultState,
		getChildren,
	} );
}

window.setTimeout( () => {
	registerTest( 'test-1', {
		title: 'Test is OK by default but can be updated externally.',
		defaultState: true,
	} );

	registerTest( 'test-2', {
		title: 'Post has at least 1 category.',
		test: () => {
			const cats = wp.data.select( STORES.CORE_EDITOR ).getEditedPostAttribute( 'categories' );
			return cats.length >= 1;
		},
	} );

	registerTest( 'test-3', {
		title: 'Check the box to approve.',
		defaultState: false,
		getChildren: ( isOK, updateTest ) => (
			<label >
				<input type="checkbox" checked={ isOK } onChange={ () => updateTest( ! isOK ) } />
				I have checked this manually.
			</label>
		),
	} );

	registerTest( 'test-4', {
		title: 'Title has been set.',
		test: () => !! select( STORES.CORE_EDITOR ).getEditedPostAttribute( 'title' ).length,
	} );

	registerTest( 'test-5', {
		title: 'Post has at least 1 tag.',
		test: () => wp.data.select( STORES.CORE_EDITOR ).getEditedPostAttribute( 'tags' ).length > 0,
		getChildren: isOK => (
			<Fragment>
				{ ! isOK && (
					<Button
						isSmall
						onClick={ () => wp.data.dispatch( STORES.CORE_EDIT_POST ).openGeneralSidebar( 'edit-post/document' ) }
					>
						{ __( 'Add tags', 'siemens' ) }
					</Button>
				) }
			</Fragment>
		),
	} );
}, 500 );
