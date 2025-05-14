import { createMiddleware } from '@tanstack/react-start';
import { getCookie, setCookie } from '@tanstack/react-start/server';

export const authMiddleware = createMiddleware().server(async ({ next }) => {
    const firstVisit = getCookie('firstVisit');
    const visit = firstVisit ?? new Date().toISOString();
    if (!firstVisit) {
        setCookie('firstVisit', visit);
    } else {
        console.log('firstVisit', firstVisit);
    }
    return next({
        context: {
            visit,
        },
    });
});
