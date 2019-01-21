import { Fragment } from 'react';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';

import { PLUGIN_NAME, STORE } from '../constants';
import Checklist from './checklist';

const Plugin = ( {
	tests,
} ) => (
	<Fragment>
		<PluginSidebarMoreMenuItem target={ PLUGIN_NAME }>
			{ select( STORE.PLUGIN ).isPublishable() ? (
				<Fragment>{ __( 'Ready to publish.', 'hm-publishing-checklist' ) }</Fragment>
			) : (
				<Fragment>{ __( 'Not ready to publish. Click to view issues.', 'hm-publishing-checklist' ) }</Fragment>
			) }
		</PluginSidebarMoreMenuItem>
		<PluginSidebar
			name={ PLUGIN_NAME }
			title={ __( 'Publishing Checklist' ) }
		>
			<Checklist tests={ tests } />
		</PluginSidebar>
	</Fragment>
);

export default Plugin;
