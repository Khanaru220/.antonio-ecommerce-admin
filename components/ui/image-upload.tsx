// Mission: (1) display preview of ONE image - via <Image/> of 'next'
// (2) gather the uploaded image URLs as inputs 'imageUrl' of 'form'
// - to create billboard later

'use client';

import { useState, useEffect } from 'react';
import { Trash } from 'lucide-react';
import { ImagePlus } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';

import { Button } from '@/components/ui/button';

interface ImageUploadProps {
	disabled?: boolean;
	onChange: (value: string) => void;
	onRemove: (value: string) => void;
	value: string[]; // array of image URLs
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
	disabled,
	onChange,
	onRemove,
	value,
}) => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const onUpload = (result: any) => {
		// (?) how different this 'result' with 'value' from prop - both relate URLs

		// (1) upload image
		// (2) take that uploaded image URL as argument for field.onChange
		// --> change data of 'imageUrl' field
		// prop passed from parent: onChange={(url) => field.onChange(url)}
		onChange(result.info.secure_url);
	};

	if (!isMounted) {
		return null;
	}

	return (
		<div>
			<div className="mb-4 flex items-center gap-4">
				{value.map((url) => (
					// iterate uploaded images
					<div
						key={url}
						className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
					>
						<div className="z-10 absolute top-2 right-2">
							<Button
								type="button"
								onClick={() => onRemove(url)}
								variant="destructive"
								size="icon"
							>
								<Trash />
							</Button>
						</div>
						<Image fill className="object-cover" alt="Image" src={url} />
					</div>
				))}
			</div>
			<CldUploadWidget onUpload={onUpload} uploadPreset="n7lscoj0">
				{({ open }) => {
					// destructuring 'open' - function to open Cloudinary vision
					const onClick = () => {
						open();
					};

					return (
						<Button
							type="button"
							disabled={disabled}
							variant="secondary"
							onClick={onClick}
						>
							<ImagePlus className="h-4 w-4 mr-2" />
							Upload an Image
						</Button>
					);
				}}
			</CldUploadWidget>
		</div>
	);
};
