import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { match as matchLocale } from '@formatjs/intl-localematcher';
import { i18n } from '@/app/i18n';

function getLocale(request: NextRequest): string | undefined {
	/*
        // An HTTP content negotiator for Node.js.
        // Returns an array of preferred languages ordered by the client preference.
        const negotiatorHeaders: Record<string, string> = {};
        request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
        const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
	*/

	// @ts-ignore locales are readonly
	const locales: string[] = i18n.locales;

	return matchLocale(locales, locales, i18n.defaultLocale);
}

export function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;

	if (
		[
			'/favicon_package/site.webmanifest',
			// Your other files in `public`
		].includes(pathname)
	)
		return;

	const pathnameIsMissingLocale = i18n.locales.every(
		(locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}/`,
	);

	// Redirect if there is no locale
	if (pathnameIsMissingLocale) {
		const locale = getLocale(request);
		return NextResponse.redirect(new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url));
	}
}

export const config = {
	// Matcher ignoring `/_next/` and `/api/`
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

// TODO: Навести порядок с кодом
// TODO: Интернациализировать мета данные
// TODO: Разобраться с подключением метаданных почему не раотают линки
// TODO: Доверстать главный экран
// TODO: Настроить все согласно замечаниям PageSpeed
// TODO:
