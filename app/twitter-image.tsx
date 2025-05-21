import { ImageResponse } from 'next/og';
import Samsoc from '@/public/images/logo.png';

export const alt = 'samsoc logo';
export const size = {
	height: 400,
	width: 400,
};
export const contentType = 'image/png';

export default function Image() {
	return new ImageResponse(
		(
			<img
				style={{
					width: '100%',
					height: '100%',
					background: '#c01a21',
				}}
				src={Samsoc.src}
				alt="samsoc"
			/>
		),
		{ ...size },
	);
}
