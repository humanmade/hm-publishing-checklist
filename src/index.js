/* eslint-disable no-console */
/* global wp */

import _ from 'lodash';
import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';
import { registerStore, select } from '@wordpress/data';

import { PLUGIN_NAME, STORES } from './constants';
import ToolbarIcon from './components/toolbar-icon';
import Plugin from './components/plugin';
import { actions, reducer, selectors } from './data';

registerStore( 'hm/publishing-checklist', {
	reducer,
	actions,
	selectors,
} );

import './tests';

// Clone original core function to check if is publishable.
const coreIsEditedPostPublishable = select( 'core/editor' ).isEditedPostPublishable.bind( {} )

select( 'core/editor' ).isEditedPostPublishable = state => {
	if ( ! coreIsEditedPostPublishable ) {
		return false;
	}

	return select( STORES.PLUGIN ).isPublishable();
}

registerPlugin( PLUGIN_NAME, {
	icon: <ToolbarIcon />,
	title: __( 'Pre-publish validation checks', 'hm-publishing-checklist' ),
	render: () => (
		<Plugin tests={ window.hmPublishingChecklistTests || [] } />
	),
} );

let edits;
let content;

const hasChanged = () => {
	const newEdits = wp.data.select( 'core/editor' ).getPostEdits();
	const newContent = wp.data.select( 'core/editor' ).getEditedPostContent();

	if ( _.isEqual( edits, newEdits ) && _.isEqual( content, newContent ) ) {
		return false;
	}

	edits = newEdits;
	content = newContent;

	return true;
}

const handleChange = () => {
	if ( ! hasChanged() ) {
		return;
	}

	window.hmPublishingChecklistTests
		.filter( t => typeof t.test === 'function' )
		.forEach( t => {
			wp.data.dispatch( STORES.PLUGIN ).updateTest( t.id, t.test() )
		} );
}

window.setTimeout( () => {
	const debouncedHandleChange = _.debounce( handleChange, 500 );
	wp.data.subscribe( debouncedHandleChange );
}, 1000 );
