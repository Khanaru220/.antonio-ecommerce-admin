import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import { prismadb } from '@/lib/prismadb';

// PATCH: Update a store
export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();
		const body = await req.json();

		const { name } = body;

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}

		if (!name) {
			return new NextResponse('Name is required', { status: 400 });
		}

		// store's id is accessed via URL's params
		if (!params.storeId) {
			return new NextResponse('Store id is required', { status: 400 });
		}

		// (?) why not use 'update' method for a single store
		// --> it trigger TS warning 'userId not exist in StoreWhereUniqueInput'
		const store = await prismadb.store.updateMany({
			where: {
				id: params.storeId,
				userId,
			},
			data: {
				name,
			},
		});

		return NextResponse.json(store);
	} catch (error) {
		console.log('[STORE_PATCH', error);

		return new NextResponse('Internal error', { status: 500 });
	}
}

// DELETE: Delete a store
export async function DELETE(
	_req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}

		// store's id is accessed via URL's params
		if (!params.storeId) {
			return new NextResponse('Store id is required', { status: 400 });
		}

		const store = await prismadb.store.deleteMany({
			where: {
				id: params.storeId,
				userId,
			},
		});

		return NextResponse.json(store);
	} catch (error) {
		console.log('[STORE_DELETE', error);

		return new NextResponse('Internal error', { status: 500 });
	}
}
