import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export default class I18n {
    public static config() {
        i18n
        .use(initReactI18next)
        .init({
            resources: {
            en: {
                translation: {
                    "userName": "User name",
                    "firstName": "First name",
                    "submit": "Send",
                    "reset": "Reset",
                    "loading": "Loading..."
                }
            }
            },
            lng: "en",
            fallbackLng: "en",

            interpolation: {
            escapeValue: false
            }
        });
    }
}