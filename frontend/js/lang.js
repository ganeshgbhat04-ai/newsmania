const translations = {
    en: {
        trending: "Trending Now",
        searchResults: "Search Results",
        selectCategory: "Select Category",
        categoryNews: "Category News",
        latestNews: "Latest News",
        readMore: "Read More",


        loginTitle: "Login",
        emailLabel: "Email",
        passwordLabel: "Password",
        loginBtn: "Login",
        noAccount: "Don't have an account?",
        signupNow: "Sign Up",

        registerTitle: "Register",
        nameLabel: "Full Name",
        confirmPasswordLabel: "Confirm Password",
        registerBtn: "Create Account",
        haveAccount: "Already have an account?",
        loginNow: "Login Now"
    },

    hi: {
        trending: "ट्रेंडिंग",
        searchResults: "खोज परिणाम",
        selectCategory: "श्रेणी चुनें",
        categoryNews: "श्रेणी समाचार",
        latestNews: "ताज़ा खबरें",
        readMore: "और पढ़ें",

        loginTitle: "लॉगिन",
        emailLabel: "ईमेल",
        passwordLabel: "पासवर्ड",
        loginBtn: "लॉगिन",
        noAccount: "खाता नहीं है?",
        signupNow: "साइन अप करें",

        registerTitle: "रजिस्टर करें",
        nameLabel: "पूरा नाम",
        confirmPasswordLabel: "पासवर्ड की पुष्टि करें",
        registerBtn: "खाता बनाएं",
        haveAccount: "पहले से खाता है?",
        loginNow: "लॉगिन करें"
    },

    kn: {
        trending: "ಟ್ರೆಂಡಿಂಗ್",
        searchResults: "ಹುಡುಕಾಟ ಫಲಿತಾಂಶಗಳು",
        selectCategory: "ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
        categoryNews: "ವರ್ಗ ಸುದ್ದಿ",
        latestNews: "ತಾಜಾ ಸುದ್ದಿ",
        readMore: "ಇನ್ನಷ್ಟು ಓದಿ",

        loginTitle: "ಲಾಗಿನ್",
        emailLabel: "ಇಮೇಲ್",
        passwordLabel: "ಪಾಸ್ವರ್ಡ್",
        loginBtn: "ಲಾಗಿನ್",
        noAccount: "ಖಾತೆ ಇಲ್ಲವೆ?",
        signupNow: "ಸೈನ್ ಅಪ್",

        registerTitle: "ನೋಂದಣಿ",
        nameLabel: "ಪೂರ್ಣ ಹೆಸರು",
        confirmPasswordLabel: "ಪಾಸ್ವರ್ಡ್ ದೃಢೀಕರಿಸಿ",
        registerBtn: "ಖಾತೆ ರಚಿಸಿ",
        haveAccount: "ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೆ?",
        loginNow: "ಲಾಗಿನ್ ಮಾಡಿ"
    },

    ta: {
        trending: "டிரெண்டிங் செய்திகள்",
        searchResults: "தேடல் முடிவுகள்",
        selectCategory: "வகையைத் தேர்ந்தெடுக்கவும்",
        categoryNews: "வகை செய்திகள்",
        latestNews: "அண்மைச் செய்திகள்",
        readMore: "மேலும் படிக்க",

        loginTitle: "உள்நுழைவு",
        emailLabel: "மின்னஞ்சல்",
        passwordLabel: "கடவுச்சொல்",
        loginBtn: "உள்நுழைவு",
        noAccount: "கணக்கு இல்லையா?",
        signupNow: "பதிவு செய்யவும்",

        registerTitle: "பதிவு",
        nameLabel: "முழு பெயர்",
        confirmPasswordLabel: "கடவுச்சொல்லை உறுதிப்படுத்தவும்",
        registerBtn: "கணக்கை உருவாக்கவும்",
        haveAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
        loginNow: "உள்நுழைய"
    },

    te: {
        trending: "ట్రెండింగ్ వార్తలు",
        searchResults: "శోధన ఫలితాలు",
        selectCategory: "వర్గాన్ని ఎంచుకోండి",
        categoryNews: "వర్గ వార్తలు",
        latestNews: "తాజా వార్తలు",
        readMore: "మరింత చదవండి",

        loginTitle: "లాగిన్",
        emailLabel: "ఇమెయిల్",
        passwordLabel: "పాస్‌వర్డ్",
        loginBtn: "లాగిన్",
        noAccount: "ఖాతా లేదా?",
        signupNow: "సైన్ అప్ చేయండి",

        registerTitle: "నమోదు",
        nameLabel: "పూర్తి పేరు",
        confirmPasswordLabel: "పాస్‌వర్డ్ నిర్ధారించండి",
        registerBtn: "ఖాతా సృష్టించండి",
        haveAccount: "ఖాతా ఉందా?",
        loginNow: "లాగిన్ చేయండి"
    }
};



function applyLanguage(lang) {
    localStorage.setItem("lang", lang);


    document.querySelectorAll("[data-text]").forEach(el => {
        const key = el.getAttribute("data-text");
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    document.querySelectorAll(".read-btn").forEach(btn => {
        btn.textContent = translations[lang]["readMore"];
    });


    const select = document.getElementById("langSelect");
    if (select) select.value = lang;
}



document.addEventListener("DOMContentLoaded", () => {
    const savedLang = localStorage.getItem("lang") || "en";
    applyLanguage(savedLang);

    const langDropdown = document.getElementById("langSelect");
    if (langDropdown) {
        langDropdown.addEventListener("change", e => {
            applyLanguage(e.target.value);
        });
    }
});
