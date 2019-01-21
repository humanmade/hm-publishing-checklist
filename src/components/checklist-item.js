import classNames from 'classnames';
import { withSelect } from '@wordpress/data';

import { STORES } from '../constants';

const ChecklistItem = ( { title, isOK, children } ) => (
	<div className={ classNames( 'hm-checklist__item', { 'hm-checklist__item--valid': isOK } ) }>
		<b>{ title }</b>
		{ children }
	</div>
);

const applyWithSelect = ( select, ownProps ) => {
	return {
		isOK: select( STORES.PLUGIN ).isTestOK( ownProps.id ),
		children: window.hmPublishingChecklistTests.find( check => check.id === ownProps.id ).children || null,
	};
}

export default withSelect( applyWithSelect )( ChecklistItem );
