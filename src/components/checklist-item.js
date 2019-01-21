import classNames from 'classnames';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';

import { STORES } from '../constants';

const ChecklistItem = ( { title, isOK, children } ) => (
	<div className={ classNames( 'hm-checklist__item', { 'hm-checklist__item--valid': isOK } ) }>
		<b>{ title }</b>
		{ children && (
			<div>{ children }</div>
		) }
	</div>
);

const applyWithDispatch = ( dispatch, ownProps ) => ( {
	updateTest: isOK => dispatch( STORES.PLUGIN ).updateTest( ownProps.id, isOK ),
} );

const applyWithSelect = ( select, ownProps ) => {
	const test = window.hmPublishingChecklistTests.find( check => check.id === ownProps.id );
	const isOK = select( STORES.PLUGIN ).isTestOK( ownProps.id );
	return {
		isOK,
		children: test ? test.getChildren( isOK, ownProps.updateTest ) : null,
	};
}

export default compose( [
	withDispatch( applyWithDispatch ),
	withSelect( applyWithSelect ),
] )( ChecklistItem );
