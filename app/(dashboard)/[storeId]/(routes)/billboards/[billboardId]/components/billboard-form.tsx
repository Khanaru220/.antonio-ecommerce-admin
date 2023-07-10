'use client';

import * as z from 'zod';
import { Billboard } from '@prisma/client';
import { Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
	FormItem,
	Form,
	FormField,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AlertModal } from '@/components/modals/alert-modal';
import { ApiAlert } from '@/components/ui/api-alert';
import { useOrigin } from '@/hooks/use-origin';
import { ImageUpload } from '@/components/ui/image-upload';

const formSchema = z.object({
	label: z.string().min(1),
	imageUrl: z.string().min(1),
});

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
	initialData: Billboard | null; // 'null' for case not found billboard
}

export const BillboardForm: React.FC<BillboardFormProps> = ({
	initialData,
}) => {
	const params = useParams();
	const router = useRouter();
	const origin = useOrigin();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const title = initialData ? 'Edit billboard' : 'Create billboard';
	const description = initialData ? 'Edit a billboard' : 'Add a new billboard';
	const toastSubmitMessage = initialData
		? 'Billboard updated.'
		: 'Billboard created.';
	const action = initialData ? 'Save changes' : 'Create';

	const form = useForm<BillboardFormValues>({
		resolver: zodResolver(formSchema),
		// (?) defaultValues will destruct to take only what include in z.object()
		// handled initialData null --> return default object
		defaultValues: initialData || {
			label: '',
			imageUrl: '',
		},
	});

	const onSubmit = async (values: BillboardFormValues) => {
		try {
			setLoading(true);
			if (initialData) {
				await axios.patch(
					`/api/${params.storeId}/billboards/${params.billboardId}`,
					values
				);
			} else {
				await axios.post(`/api/${params.storeId}/billboards`, values);
			}

			router.refresh();
			router.push(`/${params.storeId}/billboards`);
			toast.success(toastSubmitMessage);
		} catch (error) {
			toast.error('Something went wrong.');
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setLoading(true);
			await axios.delete(
				`/api/${params.storeId}/billboards/${params.billboardId}`
			);

			// (?) compare two options below: router.push() has delay on redirect
			// router.refresh();
			// router.push('/');
			window.location.assign('/');
			toast.success('Billboard deleted.');
		} catch (error) {
			toast.error(
				'Make sure you removed all categories using this billboard first.'
			);
		} finally {
			setLoading(false);
			setOpen(false);
		}
	};

	return (
		<>
			<AlertModal
				onClose={() => setOpen(false)}
				isOpen={open}
				onConfirm={onDelete}
				loading={loading}
			/>
			<div className="flex items-center justify-between">
				<Heading title={title} description={description} />
				{initialData && (
					<Button
						disabled={loading}
						variant="destructive"
						size="icon"
						onClick={() => setOpen(true)}
					>
						<Trash className="h-4 w-4" />
					</Button>
				)}
			</div>
			<Separator />
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8 w-full"
				>
					<FormField
						control={form.control}
						name="imageUrl"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Background image</FormLabel>
								<FormControl>
									<ImageUpload
										value={field.value ? [field.value] : []}
										disabled={loading}
										onChange={(url) => field.onChange(url)}
										onRemove={() => field.onChange('')}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="grid grid-cols-3 gap-8">
						<FormField
							control={form.control}
							name="label"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Label</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="Billboard name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button disabled={loading} type="submit" className="ml-auto">
						{action}
					</Button>
				</form>
			</Form>
			<Separator />
			<ApiAlert
				title="NEXT_PUBLIC_API_URL"
				description={`${origin}/api/${params.storeId}`}
				variant="public"
			/>
		</>
	);
};
