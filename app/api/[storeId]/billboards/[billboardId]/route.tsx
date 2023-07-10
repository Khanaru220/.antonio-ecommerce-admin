import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import { prismadb } from '@/lib/prismadb';

// GET: Get a billboard
export async function GET(
	_req: Request,
	{ params }: { params: { storeId: string; billboardId: string } }
) {
	try {
		const { storeId, billboardId } = params;

		if (!storeId) {
			return new NextResponse('Store id is required', { status: 400 });
		}

		if (!billboardId) {
			return new NextResponse('Billboard ID is required', { status: 400 });
		}

		const billboard = await prismadb.billboard.findFirst({
			// (?) why findUnique() warning - only require billboardId to findUnique
			// - is it mean storeId is only reference, not parent or hierachy of billboard?
			// - is it mean only billboardId is enough to make it unique, instead of each storeId
			// has groups of billboard --> it's mean billboardId could be similar but
			// can't have same reference --> stronger unique
			where: {
				id: billboardId,
				storeId,
			},
		});

		return NextResponse.json(billboard);
	} catch (error) {
		console.log('[BILLBOARD_DELETE', error);

		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; billboardId: string } }
) {
	try {
		const { userId } = auth();
		const body = await req.json();

		const { label, imageUrl } = body;
		const { storeId, billboardId } = params;

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}

		if (!label) {
			return new NextResponse('Label is required', { status: 400 });
		}
		if (!imageUrl) {
			return new NextResponse('Image URL is required', { status: 400 });
		}

		if (!storeId) {
			return new NextResponse('Store ID is required', { status: 400 });
		}

		if (!billboardId) {
			return new NextResponse('Billboard ID is required', { status: 400 });
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: storeId,
				userId,
			},
		});

		if (!storeByUserId) {
			// we checked userId first, therefore only wrong storeId make 'storeByUserId' not found
			// Message: user has logged in but isn't the owner and can't modify this store/billboard
			return new NextResponse('Unauthorized', { status: 403 });
		}

		const billboard = await prismadb.billboard.updateMany({
			where: {
				id: billboardId,
				storeId,
			},
			data: {
				label,
				imageUrl,
			},
		});

		return NextResponse.json(billboard);
	} catch (error) {
		console.log('[BILLBOARD_PATCH', error);

		return new NextResponse('Internal error', { status: 500 });
	}
}

// DELETE: Delete a billboard
export async function DELETE(
	_req: Request,
	{ params }: { params: { storeId: string; billboardId: string } }
) {
	try {
		const { userId } = auth();

		const { storeId, billboardId } = params;

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}

		if (!storeId) {
			return new NextResponse('Store id is required', { status: 400 });
		}

		if (!billboardId) {
			return new NextResponse('Billboard ID is required', { status: 400 });
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: storeId,
				userId,
			},
		});

		if (!storeByUserId) {
			// we checked userId first, therefore only wrong storeId make 'storeByUserId' not found
			// Message: user has logged in but isn't the owner and can't modify this store/billboard
			return new NextResponse('Unauthorized', { status: 403 });
		}

		const billboard = await prismadb.billboard.deleteMany({
			where: {
				id: billboardId,
				storeId,
			},
		});

		return NextResponse.json(billboard);
	} catch (error) {
		console.log('[BILLBOARD_DELETE', error);

		return new NextResponse('Internal error', { status: 500 });
	}
}
