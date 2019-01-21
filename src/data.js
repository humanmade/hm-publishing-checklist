/* global wp */

import { ACTIONS } from './constants';

const DEFAULT_STATE = {
	isPublishable: false,
	tests: {},
};

export const actions = {
	updateTest( testId, isOK ) {
		return {
			type: ACTIONS.UPDATE_IS_TEST_OK,
			testId,
			isOK,
		};
	},
};

export const reducer = ( state = DEFAULT_STATE, action ) => {

	switch ( action.type ) {
		case ACTIONS.UPDATE_IS_PUBLISHABLE:
			return {
				...state,
				isPublishable: action.isOK,
			};

		case ACTIONS.UPDATE_IS_TEST_OK:
			return {
				...state,
				tests: {
					...state.tests,
					[`${action.testId}`]: action.isOK,
				},
				isPublishable: Object.values( {
					...state.tests,
					[`${action.testId}`]: action.isOK,
				} ).indexOf( false ) === -1,
			};

		default:
			return state;
	}
};

export const selectors = {
	isPublishable( state ) {
		return state.isPublishable;
	},

	isTestOK( state, testId ) {
		return !! state.tests[ testId ];
	},
};
