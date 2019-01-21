/* eslint-disable no-console */
/* global wp */

import { Fragment } from '@wordpress/element';
import { dispatch, select } from '@wordpress/data';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { STORE } from './constants';

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

	dispatch( STORE.PLUGIN ).updateTest( id, defaultState );

	window.hmPublishingChecklistTests.push( {
		id,
		title,
		test,
		defaultState,
		getChildren,
	} );
}

window.setTimeout( () => {
	// This is a simple test with a title and test callback.
	// The callback should return boolean value to indicate pass/fail.
	// The plugin runs these tests whenever there is a change.
	registerTest( 'test-title', {
		title: 'A title has been set and is less than 50 characters.',
		test: () => {
			const title = select( STORE.CORE_EDITOR ).getEditedPostAttribute( 'title' );
			return title.length > 0 && title.length < 50;
		},
	} );

	// This test demonstrates how you can use the `getChildren` callback to add extra information.
	// In this case, it is used to add a link to the edit-post sidebar so the user could add a category.
	// Note that the text is customised to reflect the reason the test has failed.
	registerTest( 'test-cats', {
		title: 'The post has a category.',
		test: () => wp.data.select( STORE.CORE_EDITOR ).getEditedPostAttribute( 'categories' ).length === 1,
		getChildren: isOK => {
			if ( isOK ) {
				return;
			}

			const catCount = wp.data.select( STORE.CORE_EDITOR ).getEditedPostAttribute( 'categories' ).length;

			return (
				<Fragment>
					<p>{ catCount === 0 ? __( 'Post has not been assigned a category' ) : __( 'Post must only be assigned to 1 category.' ) }</p>
					<Button
						isSmall
						onClick={ () => wp.data.dispatch( STORE.CORE_EDIT_POST ).openGeneralSidebar( 'edit-post/document' ) }
					>
						{ catCount === 0 ? __( 'Add Category', 'siemens' ) : __( 'Select Category', 'siemens' ) }
					</Button>
				</Fragment>
			);
		},
	} );

	// Tests don't have to have a callback.
	// This test just has a default state of true.
	// You can then build your own logic to set this test as pass/fail.
	registerTest( 'test-no-callback', {
		title: 'Test has no test callback and is OK by default.',
		defaultState: true,
	} );

	// This test also has no callback.
	// Instead it uses the getChildren option to add a checkbox.
	// An updateTest function is passed to this function that allows you to update the test state.
	// This is used to update the test state when checked.
	// Note this value does not persist - you will have to use post meta or build additional logic if you wish to support this.
	registerTest( 'test-checkbox', {
		title: 'Check the box to approve (Does not persist).',
		defaultState: false,
		getChildren: ( isOK, updateTest ) => (
			<label >
				<input type="checkbox" checked={ isOK } onChange={ () => updateTest( ! isOK ) } />
				I have checked this manually.
			</label>
		),
	} );
}, 500 );
