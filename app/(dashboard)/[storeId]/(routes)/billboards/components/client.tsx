'use client';

import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export const BillboardClient = () => {
	const router = useRouter();
	const params = useParams();

	return (
		<>
			<div className="flex items-center justify-between">
				<Heading
					title="Billboards (0)"
					description="Manage billboards for your store"
				/>
				<Button
					onClick={() => router.push(`/${params.storeId}/billboards/new`)}
				>
					{/* hard code non-exist[id] as 'new' to represent 'no initialdata' to trigger 'Create' mode */}
					<Plus className="mr-2 h-4 w-4" />
					Add New
				</Button>
			</div>
			<Separator />
		</>
	);
};
