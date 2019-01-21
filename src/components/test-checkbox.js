import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';

import { STORES } from '../constants';

const testCheckbox = ( { isOK, updateTest } ) => (
	<label >
		<input type="checkbox" checked={ isOK } onChange={ () => updateTest( ! isOK ) } />
		I have checked this manually.
	</label>
);

const applyWithSelect = ( select, ownProps ) => ( {
	isOK: select( STORES.PLUGIN ).isTestOK( ownProps.id ),
} );

const applyWithDispatch = ( dispatch, ownProps ) => ( {
	updateTest: isOK => dispatch( STORES.PLUGIN ).updateTest( ownProps.id, isOK ),
} );

export default compose( [
	withSelect( applyWithSelect ),
	withDispatch( applyWithDispatch ),
] )( testCheckbox );
