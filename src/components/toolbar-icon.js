import { withSelect } from '@wordpress/data';
import { Dashicon } from '@wordpress/components';

import { STORE } from '../constants';

const ToolbarIcon = ( { isPublishable } ) => (
	<Dashicon icon={ isPublishable ? 'yes' : 'no' }/>
);

const applyWithSelect = select => ( {
	isPublishable: select( STORE.PLUGIN ).isPublishable(),
} );

export default withSelect( applyWithSelect )( ToolbarIcon );
