import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { SettingForm } from './components/setting-form';
import { prismadb } from '@/lib/prismadb';

interface SettingsPageProps {
	params: {
		storeId: string;
	};
}

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {
	const { userId } = auth();

	if (!userId) {
		redirect('/sign-in');
	}

	const store = await prismadb.store.findFirst({
		where: {
			id: params.storeId,
			userId,
		},
	});

	// (FIXME) duplicate with [storeId]'s layout but it get rid of TS warning about initialData
	// if (!store) {
	// redirect('/');
	// }

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<SettingForm initialData={store} />
			</div>
		</div>
	);
};

export default SettingsPage;
