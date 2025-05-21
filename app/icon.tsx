import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

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
					background: 'transparent',
				}}
				src={src}
				alt="samsoc"
			/>
		),
		{ ...size },
	);
}
