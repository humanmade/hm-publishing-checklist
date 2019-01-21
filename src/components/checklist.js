import ChecklistItem from './checklist-item';

const Checklist = ( { tests } ) => (
	<div className="hm-checklist">
		{ tests.map( test => (
			<ChecklistItem key={ test.id } { ...test } />
		) ) }
	</div>
);

export default Checklist;
