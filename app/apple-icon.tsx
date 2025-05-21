import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export function generateImageMetadata() {
	return [
		{
			contentType: 'image/png',
			size: {
				width: 57,
				height: 57,
			},
			id: 'xxs',
		},
		{
			contentType: 'image/png',
			size: {
				width: 60,
				height: 60,
			},
			id: 'xs',
		},
		{
			contentType: 'image/png',
			size: {
				width: 72,
				height: 72,
			},
			id: 's',
		},
		{
			contentType: 'image/png',
			size: {
				width: 76,
				height: 76,
			},
			id: 'm',
		},
		{
			contentType: 'image/png',
			size: {
				width: 114,
				height: 114,
			},
			id: 'l',
		},

		{
			contentType: 'image/png',
			size: {
				width: 120,
				height: 120,
			},
			id: 'xl',
		},
		{
			contentType: 'image/png',
			size: {
				width: 144,
				height: 144,
			},
			id: 'xxl',
		},
		{
			contentType: 'image/png',
			size: {
				width: 152,
				height: 152,
			},
			id: 'xxxl',
		},
	];
}

export default async function Icon({ size }: any) {
	const data = await readFile(join(process.cwd(), 'public/images/logo.png'));

	const base64Image = data.toString('base64');
	const src = `data:image/png;base64,${base64Image}`;

	return new ImageResponse(
		(
			<img
				style={{
					width: '100%',
					height: '100%',
					background: '#c01a21',
				}}
				src={src}
				alt="samsoc"
			/>
		),
		{ ...size },
	);
}
