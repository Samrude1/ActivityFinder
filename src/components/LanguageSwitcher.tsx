import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LANGUAGES = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'pt', label: 'Português', flag: '🇵🇹' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'fi', label: 'Suomi', flag: '🇫🇮' },
    { code: 'ko', label: '한국어', flag: '🇰🇷' }
];

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = React.useState(false);

    const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

    return (
        <div className="language-switcher">
            <button
                className="lang-btn"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Select Language"
                title={currentLang.label}
            >
                <span className="lang-flag">{currentLang.flag}</span>
                <span className="lang-code">{currentLang.code.toUpperCase()}</span>
            </button>

            {isOpen && (
                <div className="lang-dropdown">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            className={`lang-option ${i18n.language === lang.code ? 'active' : ''}`}
                            onClick={() => {
                                i18n.changeLanguage(lang.code);
                                setIsOpen(false);
                            }}
                        >
                            <span className="lang-flag">{lang.flag}</span>
                            <span className="lang-label">{lang.label}</span>
                        </button>
                    ))}
                </div>
            )}

            {isOpen && (
                <div
                    className="lang-overlay"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
