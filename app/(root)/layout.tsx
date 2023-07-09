import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { prismadb } from '@/lib/prismadb';

export default async function SetupLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { userId } = auth();

	if (!userId) {
		redirect('/');
	}

	// check whether user has stores in order to redirect or require create
	const store = await prismadb.store.findFirst({
		where: {
			userId,
		},
	});

	if (store) {
		redirect(`/${store.id}`);
	}

	return <>{children}</>;
}
