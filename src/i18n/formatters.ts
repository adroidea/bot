import type { Formatters, Locales, TranslationFunctions } from './i18n-types';
import { i18nObject, isLocale } from './i18n-util';
import type { FormattersInitializer } from 'typesafe-i18n';
import { loadLocaleAsync } from './i18n-util.async';

export const initFormatters: FormattersInitializer<Locales, Formatters> = (/*locale: Locales*/) => {
    const formatters: Formatters = {
        // add your formatter functions here
    };

    return formatters;
};

export async function loadLL(localestr: string = 'en'): Promise<TranslationFunctions> {
    let locale: Locales = localestr as Locales;
    if (!isLocale(localestr)) locale = 'en';
    await loadLocaleAsync(locale);
    return i18nObject(locale);
}
