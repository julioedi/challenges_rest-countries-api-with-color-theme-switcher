
interface LangItem {
    [translation: string]: string
}
interface LangList {
    [langcode: string]: LangItem
}

class coreLang {
    defaultLang = "en";
    currentLang:string|null = null;;
    langs: LangList = {};
    __ = (translation: string):string => {
        const {currentLang,langs} = this;
        if (currentLang && currentLang in langs && translation in langs[currentLang]) {
            return langs[currentLang][translation];
        }

        return translation;
    }
}
const Lang = new coreLang();
const { __ } = Lang;

export { __ }