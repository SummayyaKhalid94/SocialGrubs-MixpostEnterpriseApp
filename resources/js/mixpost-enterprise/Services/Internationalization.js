import { nextTick } from 'vue'

const languageFiles = import.meta.glob('/resources/lang-json/mixpost-pro-team/*.json');

const Trans = {
    get locale() {
        return document.documentElement.lang;
    },
    get defaultLocale() {
        return document.querySelector('meta[name="default_locale"]').getAttribute('content');
    },
    get direction() {
        return document.querySelector('html').getAttribute('dir');
    },
    async bootstrap(i18n) {
        i18n.fallbackLocale.value = Trans.defaultLocale;

        const defaultMessages = await Trans.loadLanguageFile(Trans.defaultLocale);

        i18n.setLocaleMessage(Trans.defaultLocale, defaultMessages.default)

        if (Trans.locale !== Trans.defaultLocale) {
            i18n.setLocaleMessage(Trans.locale, await Trans.loadLanguageFile(Trans.locale).default)
        }

        await Trans.changeLocale(i18n, Trans.locale, Trans.direction);
    },
    changeLocale(i18n, locale, direction = 'ltr') {
        // if (i18n.locale.value === locale) return Promise.resolve(locale);

        return Trans.loadLanguageFile(locale).then(messages => {
            i18n.setLocaleMessage(locale, messages.default)
            i18n.locale.value = locale

            document.querySelector('html').setAttribute('lang', locale)
            document.querySelector('html').setAttribute('dir', direction)

            return nextTick();
        })
    },
    async loadLanguageFile(locale) {
        const path = `/resources/lang-json/mixpost-pro-team/${locale}.json`;
        const importer = languageFiles[path];
        if (!importer) {
            console.error(`Language file for locale "${locale}" not found.`);
            return {};
        }
        return importer();
    }
}

export { Trans }
