'use client';
import { ReactNode, useState } from 'react';
import { InView } from 'react-intersection-observer';

export default function ScrollViewCard({
	children,
}: {
	children: React.ReactElement<ReactNode>;
}) {
	const [getState, setState] = useState(false);

	return (
		<InView
			triggerOnce={true}
			as="div"
			onChange={(inView, entry) => {
				setState(inView);
			}}
		>
			<h2>
				Plain children are always rendered. Use onChange to monitor
				state.
			</h2>
			{children}
		</InView>
	);
}
