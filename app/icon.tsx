import { ImageResponse } from 'next/og';
import Samsoc from '@/public/images/logo.png';

export function generateImageMetadata() {
	return [
		{
			contentType: 'image/png',
			size: {
				width: 16,
				height: 16,
			},
			id: 's',
		},
		{
			contentType: 'image/png',
			size: {
				width: 32,
				height: 32,
			},
			id: 'm',
		},
		{
			contentType: 'image/png',
			size: {
				width: 96,
				height: 96,
			},
			id: 'l',
		},
		{
			contentType: 'image/png',
			size: {
				width: 128,
				height: 128,
			},
			id: 'xl',
		},
		{
			contentType: 'image/png',
			size: {
				width: 196,
				height: 196,
			},
			id: 'xxl',
		},
	];
}

export default function Icon({ size }: any) {
	return new ImageResponse(
		(
			<img
				style={{
					width: '100%',
					height: '100%',
					background: 'transparent',
				}}
				src={Samsoc.src}
				alt="samsoc"
			/>
		),
		{ ...size },
	);
}
