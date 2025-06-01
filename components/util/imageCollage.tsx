import Image from 'next/image';

interface ImageProps {
	images?: string[];
}

export default function ImageCollage({}: ImageProps) {
	return <Image src={''} alt={''}></Image>;
}
