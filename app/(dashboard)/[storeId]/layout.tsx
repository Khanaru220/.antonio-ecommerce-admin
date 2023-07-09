import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { prismadb } from '@/lib/prismadb';
import { Navbar } from '@/components/navbar';

export default async function DashboardLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { storeId: string };
}) {
	const { userId } = auth();

	if (!userId) {
		redirect('/sign-in');
	}

	// display the store via store's id attach to URL path
	const store = await prismadb.store.findFirst({
		where: {
			id: params.storeId,
			// only store owner can view
			userId,
		},
	});

	// validate store's id input
	if (!store) {
		redirect('/');
	}

	return (
		<>
			<Navbar />
			{children}
		</>
	);
}
