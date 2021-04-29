const supportedLanguages = {
    "fr-FR": "fr" // alias for html attr
}

const settingsLanguages = [
    {
        label: 'English (UK)',
        value: 'en-GB'
    },
    {
        label: 'Français',
        value: 'fr-FR'
    },
    {
        label: 'Auto (default)',
        value: 'auto'
    },
]

function translatePage() {
    const language = localStorage.getItem('lang') || window.navigator.userLanguage || window.navigator.language;
    vm.selectedLanguage = language
    if(supportedLanguages[language] == undefined) return
    const attr = 'translate-' + supportedLanguages[language]
    document.querySelectorAll(`[${attr}]`).forEach(e => {
        let translated = e.getAttribute(attr)
        e.innerText = translated
    })
}

export {translatePage, settingsLanguages}