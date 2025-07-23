// // src/middleware.ts
// import { defineMiddleware } from 'astro/middleware';
// import { SITE_URL } from '@/lib/constants';

// export const onRequest = defineMiddleware(async (context, next) => {
//   const host = context.request.headers.get('host') || '';
//   const isApp = host.startsWith('app.');
//   context.locals.isApp = isApp;

//   if (isApp) {
//     // const sessionToken = await context.cookies.get('session');

//     // if (!sessionToken?.value || !isValidSession(sessionToken.value)) {
//     //   return context.redirect(SITE_URL);
//     // }
//   }

//   return next();
// });

// // Replace with real session validation
// function isValidSession(token: string): boolean {
//   return token === 'Admin12345!'; // stub for now
// }
