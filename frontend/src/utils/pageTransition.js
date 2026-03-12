export const MIN_ROUTE_LOADING_MS = 1100;
export const MANUAL_NAVIGATION_DELAY_MS = 90;

export function getTransitionMessage(pathname) {
    if (pathname.startsWith('/login')) {
        return 'Loading sign in...';
    }

    if (pathname.startsWith('/signup')) {
        return 'Loading sign up...';
    }

    if (pathname.startsWith('/read/')) {
        return 'Opening reader...';
    }

    if (pathname.startsWith('/settings')) {
        return 'Opening settings...';
    }

    if (pathname.startsWith('/books') || pathname.startsWith('/library')) {
        return 'Loading your library...';
    }

    return 'Loading page...';
}
