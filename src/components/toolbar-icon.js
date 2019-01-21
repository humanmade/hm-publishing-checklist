import { withSelect } from '@wordpress/data';
import { Dashicon } from '@wordpress/components';

import { STORES } from '../constants';

const ToolbarIcon = ( { isPublishable } ) => (
	<Dashicon icon={ isPublishable ? 'yes' : 'no' }/>
);

const applyWithSelect = select => ( {
	isPublishable: select( STORES.PLUGIN ).isPublishable(),
} );

export default withSelect( applyWithSelect )( ToolbarIcon );
