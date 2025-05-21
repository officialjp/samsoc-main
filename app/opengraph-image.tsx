import { ImageResponse } from 'next/og';
import { join } from 'node:path';
import { readFile } from 'node:fs/promises';

export const alt = 'samsoc logo';
export const size = {
	height: 400,
	width: 400,
};
export const contentType = 'image/png';

export default async function Image() {
	const data = await readFile(join(process.cwd(), 'public/images/logo.png'));
	const src = Uint8Array.from(data).buffer;

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
