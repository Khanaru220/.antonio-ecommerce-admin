import { authMiddleware } from '@clerk/nextjs';

// Clerk protected all routes at default. No 'real' public route until settings
export default authMiddleware({
	publicRoutes: ['/api/:path*'],
});

export const config = {
	matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
