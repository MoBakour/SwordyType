/**
 * SwordyType © 2021 - present | MoBakour
 * linkedin: https://www.linkedin.com/in/mobakour/
 * github: https://www.github.com/MoBakour
 *
 * This code is a property of MoBakour
 *
 * if you see this code and be like "how bad is this"
 * then excuse me cuz I was a JS newbie when I wrote it :)
 */

/*
    Element selectors can be found in ./selectors.js
*/

// App Variables
let menuOpened = false;
let text = [];
let currentLetter = 0;
let testStarted = false;
let counter = 1;
let lineSpaces = 0;
let spaces = 0;
let breakNow = false;
let inputs = [];
let resultShowed = false;
let testFinished = false;
let testTime = 60;
let timeLeft;
let timerInterval;
let mistakes = 0;
let refreshNow = true;
let soundEffectOne = new Audio("../assets/sounds/soundEffect_1.wav");
let soundEffectTwo = new Audio("../assets/sounds/soundEffect_2.wav");
let testMode = 0;
let testLang = engMedium;
let spaceDimensions = [22.47, 55];
let currentFont = ["Roboto Mono", 2.5];
let allSpaces = document.querySelector(".test-size-css");
let allSwitches = document.querySelectorAll(".switch-btn");
let soundEnabled = true;
let showMistakes = true;
let backWord = true;
let mobileUser = false;

// Local Storage Variables
let storedTheme = localStorage.getItem("theme");
let storedMode = localStorage.getItem("mode");
let storedTime = localStorage.getItem("time");
let storedLang = localStorage.getItem("lang");
let storedTimer = localStorage.getItem("timer");
let storedSize = localStorage.getItem("size");
let storedFont = localStorage.getItem("font");
let storedScroll = localStorage.getItem("scroll");
let storedMistakes = localStorage.getItem("mistakes");
let storedSound = localStorage.getItem("sound");
let storedBackWord = localStorage.getItem("backWord");

// Menu Opening
menuBtn.addEventListener("click", () => {
    if (menuOpened) {
        menuBtn.classList.remove("menu-btn-opened");
        menu.classList.remove("menu-opened");
        menuOpened = false;
        customTheme(false);
    } else {
        menuBtn.classList.add("menu-btn-opened");
        menu.classList.add("menu-opened");
        menuOpened = true;
        menuContent.scrollTop = 0;
    }

    if (testStarted) {
        refreshBtn.click();
    }
});

// Generate Words
function generateWord(num) {
    testLang.leftToRight == true
        ? (words.style.direction = "ltr")
        : (words.style.direction = "rtl");

    for (let i = 0; i < num; i++) {
        currentLetter++;

        const randomNumber = Math.floor(
            Math.random() * (testLang.words.length - 1 - 0 + 1) + 0
        );
        const selectedWord = testLang.words[randomNumber];
        const wordLetters = selectedWord.split("");

        wordLetters.forEach((letter) => {
            words.innerHTML += `<span>${letter.toLowerCase()}</span>`;
            text.push(letter.toLowerCase());
        });
        words.innerHTML += `<span class="space"> </span>`;
        text.push(" ");

        if (currentLetter == 5) {
            currentLetter = 0;
            words.innerHTML += "<br class='line-break'>";
        }
    }
}

// Generate Article
function generateWords() {
    words.style.opacity = 0;

    setTimeout(() => {
        words.innerHTML = "";
        text = [];
        inputs = [];
        words.scrollTop = 0;
        counter = 1;
        lineSpaces = 0;
        spaces = 0;
        breakNow = false;

        generateWord(20);

        document
            .querySelector(`.words span:nth-of-type(1)`)
            .classList.add("current");
        words.style.opacity = 1;
    }, 300);
}
generateWords();

// Key Press Processing
const russianKeys = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя".split("");
const englishKeys = "qwertyuiopasdfghjklzxcvbnm".split("");
const arabicKeys = "ضصثقفغعهخحظنمكطئءؤرلاىزجدشسيبلاتذةو".split("");
const keys = ["Backspace", " "].concat(russianKeys, englishKeys, arabicKeys);
window.addEventListener("keydown", (e) => {
    if (keys.includes(e.key)) {
        if (testFinished) return;

        if (e.key != "Backspace" && testStarted == false && !resultShowed) {
            startTest();
        }

        if (e.key != "Backspace") {
            inputs.push(e.key);
        }

        let backspaceEnabled = true;

        if (testMode == 1 || testMode == 2) backspaceEnabled = false;

        if (e.key == "Backspace" && backspaceEnabled) {
            inputs.pop();
        }

        if (
            document.querySelector(".current").classList.contains("space") &&
            e.key != "Backspace"
        ) {
            lineSpaces++;
            spaces++;
            generateWord(1);
        }

        if (
            e.key == document.querySelector(".current").innerText ||
            (e.key == " " &&
                document.querySelector(".current").classList.contains("space"))
        ) {
            document.querySelector(".current").classList.remove("wrong");
            document.querySelector(".current").classList.add("correct");
            document.querySelector(".current").classList.remove("current");
            counter++;
            document
                .querySelector(`.words span:nth-of-type(${counter})`)
                .classList.add("current");
            clickSound(true);
        } else if (e.key == "Backspace") {
            if (!backspaceEnabled) return;

            if (
                document
                    .querySelector(".words span:nth-of-type(1)")
                    .classList.contains("current")
            )
                return;

            if (
                document
                    .querySelector(`.words span:nth-of-type(${counter - 1})`)
                    .classList.contains("space") &&
                !backWord
            )
                return;

            if (
                document
                    .querySelector(`.words span:nth-of-type(${counter - 1})`)
                    .classList.contains("space")
            ) {
                lineSpaces--;
                spaces--;
            }

            document.querySelector(".current").classList.remove("current");
            counter--;
            document
                .querySelector(`.words span:nth-of-type(${counter})`)
                .classList.add("current");
            document.querySelector(".current").classList.remove("correct");
            document.querySelector(".current").classList.remove("wrong");
            clickSound(true);
        } else {
            document.querySelector(".current").classList.add("wrong");
            document.querySelector(".current").classList.remove("current");
            counter++;
            document
                .querySelector(`.words span:nth-of-type(${counter})`)
                .classList.add("current");
            mistakes++;
            clickSound(false);

            if (testMode == 2) {
                timer.style.animation = "";
                endTest();
                clearInterval(timerInterval);
            }
        }
        if (
            document.querySelector(".current").classList.contains("line-break")
        ) {
            counter++;
            document
                .querySelector(`.words span:nth-of-type(${counter})`)
                .classList.add("current");
        }
        if (spaces < 5) {
            breakNow = false;
        }

        if (lineSpaces == 10) {
            words.scrollTop += spaceDimensions[1];
            lineSpaces = 0;
            breakNow = true;
        }

        if (lineSpaces == 5 && breakNow) {
            words.scrollTop += spaceDimensions[1];
            lineSpaces = 0;
        }

        if (lineSpaces == -1) {
            words.scrollTop -= spaceDimensions[1];
            lineSpaces = 4;
        }
    }
});

// Trigger Sounds
function clickSound(sound) {
    if (!soundEnabled) return;

    if (!showMistakes) sound = true;

    switch (sound) {
        case true:
            soundEffectOne.cloneNode().play();
            break;
        case false:
            soundEffectTwo.cloneNode().play();
            break;
    }
}

// Start Test and Timer
timer.innerText = testTime;
function startTest() {
    testStarted = true;
    timeLeft = testTime;

    timerInterval = setInterval(() => {
        timeLeft -= 0.1;
        timer.innerText = Math.ceil(timeLeft);

        if (timeLeft <= 5) {
            timer.style.animation = "1s flashTimer linear infinite";
        }

        if (timeLeft <= 0) {
            timer.style.animation = "";
            endTest();
            clearInterval(timerInterval);
        }
    }, 100);
}

// End Test
function endTest() {
    testStarted = false;
    testFinished = true;

    // Hide and Show
    resultShowed = true;
    words.style.opacity = 0;
    timer.style.opacity = 0;

    setTimeout(() => {
        words.style.display = "none";
        result.style.display = "flex";
        result.style.opacity = 1;
    }, 300);

    // Get corrects and wrongs
    let corrects = 0;
    let wrongs = 0;
    let correct = true;

    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i] != text[i]) {
            correct = false;
        }

        if (inputs[i] == text[i] && text[i + 1] == " " && correct) {
            corrects++;
        }

        if (text[i + 1] == " " && !correct) {
            wrongs++;
        }

        if (inputs[i] == text[i] && text[i] == " ") {
            correct = true;
        }
    }

    // Calculate and display results
    let allCorrects = document.querySelectorAll(".correct").length;
    let allWrongs = document.querySelectorAll(".wrong").length;
    let wpmResult = Math.round((corrects / (testTime - timeLeft)) * 60);

    if (isNaN(wpmResult)) {
        wpm.innerText = 0;
    } else {
        wpm.innerText = wpmResult;
    }

    acc.innerText = `${Math.floor(
        100 - (mistakes / (allCorrects + allWrongs)) * 100
    )}%`;
    testDuration.innerText = `${testTime} sec`;
    testModeEL.innerText =
        testMode == 0 ? "Cold" : testMode == 1 ? "Hot" : "Fire";
    testType.innerText = testLang.name;
    totalChars.innerText = `${allCorrects + allWrongs} total`;
    correctChars.innerText = `${allCorrects} correct`;
    wrongChars.innerText = `${allWrongs} wrong`;

    // Reset
    timeLeft = testTime;
    mistakes = 0;
    corrects = 0;
    wrongs = 0;
    correct = true;
}

// Refresh Test
function refreshTest() {
    if (!refreshNow) return;
    refreshNow = false;

    setTimeout(() => {
        refreshNow = true;
    }, 1000);

    generateWords();

    clearInterval(timerInterval);
    timer.style.animation = "";
    testFinished = false;
    timer.innerText = testTime;
    testStarted = false;
    currentLetter = 0;
    mistakes = 0;
    resultShowed = false;
    result.style.opacity = 0;

    setTimeout(() => {
        result.style.display = "none";
        words.style.display = "block";
        words.scrollTop = 0;
        test.style.opacity = 1;
        timer.style.opacity = 1;
    }, 300);
}

// Enter Refresh
window.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        refreshTest();
    }
});

// Settings
// Timer Display Settings
function timerDisplay(status, self) {
    switch (status) {
        case true:
            timer.classList.remove("hidden-timer");
            self.classList.add("current-selected");
            self.nextElementSibling.classList.remove("current-selected");
            break;
        case false:
            timer.classList.add("hidden-timer");
            self.classList.add("current-selected");
            self.previousElementSibling.classList.remove("current-selected");
            break;
    }

    localStorage.setItem("timer", status);
}

if (storedTimer)
    document
        .querySelector(`div[onclick="timerDisplay(${storedTimer}, this)"]`)
        .click();

// Font Size Settings
function changeFontSize(size, self) {
    document
        .querySelector(".font-size .sizes .current-selected")
        .classList.remove("current-selected");
    self.classList.add("current-selected");
    editFontSize(size);
    localStorage.setItem("size", size);
}

function editFontSize(size = currentFont[1]) {
    words.style.fontSize = `${size}em`;
    currentFont[1] = size;

    switch (size) {
        case 1:
            switch (currentFont[0]) {
                case "Nova Mono":
                    spaceDimensions[0] = 8.98;
                    spaceDimensions[1] = 22;
                    break;
                case "Roboto Mono":
                    spaceDimensions[0] = 9.61;
                    spaceDimensions[1] = 21;
                    break;
                case "Xanh Mono":
                    spaceDimensions[0] = 8;
                    spaceDimensions[1] = 20;
                    break;
                case "DM Mono":
                    spaceDimensions[0] = 9.61;
                    spaceDimensions[1] = 21;
                    break;
            }
            break;
        case 1.5:
            switch (currentFont[0]) {
                case "Nova Mono":
                    spaceDimensions[0] = 13.48;
                    spaceDimensions[1] = 33;
                    break;
                case "Roboto Mono":
                    spaceDimensions[0] = 14.41;
                    spaceDimensions[1] = 32;
                    break;
                case "Xanh Mono":
                    spaceDimensions[0] = 12;
                    spaceDimensions[1] = 28;
                    break;
                case "DM Mono":
                    spaceDimensions[0] = 14.41;
                    spaceDimensions[1] = 31;
                    break;
            }
            break;
        case 2:
            switch (currentFont[0]) {
                case "Nova Mono":
                    spaceDimensions[0] = 17.97;
                    spaceDimensions[1] = 45;
                    break;
                case "Roboto Mono":
                    spaceDimensions[0] = 19.2;
                    spaceDimensions[1] = 43;
                    break;
                case "Xanh Mono":
                    spaceDimensions[0] = 16;
                    spaceDimensions[1] = 38;
                    break;
                case "DM Mono":
                    spaceDimensions[0] = 19.2;
                    spaceDimensions[1] = 42;
                    break;
            }
            break;
        case 2.5:
            switch (currentFont[0]) {
                case "Nova Mono":
                    spaceDimensions[0] = 22.47;
                    spaceDimensions[1] = 55;
                    break;
                case "Roboto Mono":
                    spaceDimensions[0] = 24.02;
                    spaceDimensions[1] = 53;
                    break;
                case "Xanh Mono":
                    spaceDimensions[0] = 20;
                    spaceDimensions[1] = 48;
                    break;
                case "DM Mono":
                    spaceDimensions[0] = 24;
                    spaceDimensions[1] = 52;
                    break;
            }
            break;
        case 3:
            switch (currentFont[0]) {
                case "Nova Mono":
                    spaceDimensions[0] = 26.95;
                    spaceDimensions[1] = 67;
                    break;
                case "Roboto Mono":
                    spaceDimensions[0] = 28.81;
                    spaceDimensions[1] = 63;
                    break;
                case "Xanh Mono":
                    spaceDimensions[0] = 24;
                    spaceDimensions[1] = 58;
                    break;
                case "DM Mono":
                    spaceDimensions[0] = 28.81;
                    spaceDimensions[1] = 63;
                    break;
            }
            break;
    }

    allSpaces.innerHTML = `
    main .words {
        height: ${spaceDimensions[1] * 3}px;
    }
    main .words span.space {
        width: ${spaceDimensions[0]}px;
    }
`;
}

editFontSize();

if (storedSize)
    document
        .querySelector(`div[onclick="changeFontSize(${storedSize}, this)"]`)
        .click();

// Font Family Settings
function changeFontFamily(font, self) {
    document
        .querySelector(".font-family .families .current-selected")
        .classList.remove("current-selected");
    self.classList.add("current-selected");
    words.style.fontFamily = `"${font}"`;
    currentFont[0] = font;
    editFontSize();
    localStorage.setItem("font", font);
}

if (storedFont)
    document
        .querySelector(`div[onclick="changeFontFamily('${storedFont}', this)"]`)
        .click();

// Theme Settings
const themes = [
    {
        app_bg: [100, 50, 0],
        logo_clr: [180, 255, 0],
        text_clr: [127, 233, 242],
        current_clr: [60, 50, 0],
        correct_clr: [0, 255, 1],
        wrong_clr: [255, 69, 0],
        wrong_bg: [138, 0, 0],
        menu_bg: [0, 0, 0],
        theme_name: "Default",
    },
    {
        app_bg: [50, 100, 0],
        logo_clr: [255, 180, 0],
        text_clr: [233, 242, 127],
        current_clr: [60, 50, 0],
        correct_clr: [0, 255, 1],
        wrong_clr: [255, 69, 0],
        wrong_bg: [138, 0, 0],
        menu_bg: [0, 0, 0],
        theme_name: "Flipped",
    },
    {
        app_bg: [127, 0, 123],
        logo_clr: [255, 100, 250],
        text_clr: [0, 255, 255],
        current_clr: [60, 50, 0],
        correct_clr: [0, 255, 1],
        wrong_clr: [255, 69, 0],
        wrong_bg: [138, 0, 0],
        menu_bg: [0, 0, 0],
        theme_name: "Sweet Dreams",
    },
    {
        app_bg: [30, 0, 0],
        logo_clr: [150, 50, 0],
        text_clr: [255, 0, 0],
        current_clr: [60, 50, 0],
        correct_clr: [255, 100, 0],
        wrong_clr: [255, 255, 0],
        wrong_bg: [120, 120, 0],
        menu_bg: [0, 0, 0],
        theme_name: "Blood Eyes",
    },
    {
        app_bg: [120, 120, 120],
        logo_clr: [240, 240, 240],
        text_clr: [40, 40, 40],
        current_clr: [200, 200, 200],
        correct_clr: [0, 255, 1],
        wrong_clr: [255, 69, 0],
        wrong_bg: [138, 0, 0],
        menu_bg: [170, 170, 170],
        theme_name: "Lead",
    },
    {
        app_bg: [41, 50, 80],
        logo_clr: [255, 213, 90],
        text_clr: [109, 212, 126],
        current_clr: [60, 50, 0],
        correct_clr: [0, 255, 1],
        wrong_clr: [255, 69, 0],
        wrong_bg: [138, 0, 0],
        menu_bg: [0, 0, 0],
        theme_name: "Mario",
    },
    {
        app_bg: [42, 43, 45],
        logo_clr: [45, 168, 216],
        text_clr: [217, 81, 78],
        current_clr: [60, 50, 0],
        correct_clr: [0, 255, 1],
        wrong_clr: [255, 69, 0],
        wrong_bg: [138, 0, 0],
        menu_bg: [0, 0, 0],
        theme_name: "Bullet",
    },
    {
        app_bg: [40, 51, 80],
        logo_clr: [249, 56, 0],
        text_clr: [255, 181, 0],
        current_clr: [60, 50, 0],
        correct_clr: [0, 255, 1],
        wrong_clr: [255, 69, 0],
        wrong_bg: [138, 0, 0],
        menu_bg: [0, 0, 0],
        theme_name: "Orellue",
    },
];

for (let theme in themes) {
    let newBtn = `<div onclick="themeChanger(${theme})">${themes[theme].theme_name}</div>`;
    themesList.innerHTML += newBtn;
}
themesList.children[0].classList.add("current-selected");
var themeBtns = document.querySelectorAll(".themes div");

for (let i = 0; i < themeBtns.length; i++) {
    themeBtns[
        i
    ].style.background = `linear-gradient(to right, rgb(${themes[i].logo_clr}),rgb(${themes[i].app_bg}),rgb(${themes[i].text_clr}))`;
}

themesList.innerHTML += `
    <div onclick="themeChanger(-1)">Random Theme</div>
    <div onclick="customTheme(true)" class="custom-theme-btn">Custom Theme</div>
`;

function themeChanger(theme = "undefined", customCalled = false) {
    if (!storedTheme && theme == "undefined") theme = 0;

    if (storedTheme && theme == "undefined") theme = storedTheme;

    if (theme == -1) {
        theme = Math.floor(Math.random() * (themes.length - 1 - 0 + 1) + 0);
    }

    document
        .querySelector(".themes .current-selected")
        .classList.remove("current-selected");

    if (customCalled) {
        document
            .querySelector(".custom-theme-btn")
            .classList.add("current-selected");
    } else {
        document
            .querySelector(`.themes div[onclick="themeChanger(${theme})"]`)
            .classList.add("current-selected");
    }

    themeRoot.innerHTML = `
        :root {
            --background-color: rgb(${themes[theme].app_bg});
            --menu-cont-bg: rgba(${themes[theme].app_bg},0.4);
            --logo-color: rgb(${themes[theme].logo_clr});
            --text-color: rgb(${themes[theme].text_clr});
            --current-color: rgb(${themes[theme].current_clr});
            --correct: rgb(${themes[theme].correct_clr});
            --wrong: rgb(${themes[theme].wrong_clr});
            --wrong-bg: rgb(${themes[theme].wrong_bg});
            --menu-bg: rgba(${themes[theme].menu_bg},0.8);
        }
    `;

    // Set Custom Theme Box Default Values
    APP_BG_R.value = themes[theme].app_bg[0];
    APP_BG_G.value = themes[theme].app_bg[1];
    APP_BG_B.value = themes[theme].app_bg[2];
    LOGO_CLR_R.value = themes[theme].logo_clr[0];
    LOGO_CLR_G.value = themes[theme].logo_clr[1];
    LOGO_CLR_B.value = themes[theme].logo_clr[2];
    TEXT_CLR_R.value = themes[theme].text_clr[0];
    TEXT_CLR_G.value = themes[theme].text_clr[1];
    TEXT_CLR_B.value = themes[theme].text_clr[2];
    CURRENT_CLR_R.value = themes[theme].current_clr[0];
    CURRENT_CLR_G.value = themes[theme].current_clr[1];
    CURRENT_CLR_B.value = themes[theme].current_clr[2];
    CORRECT_CLR_R.value = themes[theme].correct_clr[0];
    CORRECT_CLR_G.value = themes[theme].correct_clr[1];
    CORRECT_CLR_B.value = themes[theme].correct_clr[2];
    WRONG_CLR_R.value = themes[theme].wrong_clr[0];
    WRONG_CLR_G.value = themes[theme].wrong_clr[1];
    WRONG_CLR_B.value = themes[theme].wrong_clr[2];
    WRONG_BG_R.value = themes[theme].wrong_bg[0];
    WRONG_BG_G.value = themes[theme].wrong_bg[1];
    WRONG_BG_B.value = themes[theme].wrong_bg[2];
    MENU_BG_R.value = themes[theme].menu_bg[0];
    MENU_BG_G.value = themes[theme].menu_bg[1];
    MENU_BG_B.value = themes[theme].menu_bg[2];

    // Set Theme in localStorage
    if (customCalled) theme = 0;
    localStorage.setItem("theme", theme);
}

themeChanger();

function customTheme(command) {
    switch (command) {
        case true:
            customThemeBox.style.opacity = 1;
            customThemeBox.style.zIndex = 1;
            break;
        case false:
            customThemeBox.style.opacity = 0;
            customThemeBox.style.zIndex = -1;
            break;
    }
}

function setCustomTheme() {
    let allCustomInputs = document.querySelectorAll(
        ".custom-theme-box input[type='number']"
    );

    let continueToCustomTheme = true;

    for (let i = 0; i < allCustomInputs.length; i++) {
        if (allCustomInputs[i].value < 0 || allCustomInputs[i].value > 255) {
            continueToCustomTheme = false;
            allCustomInputs[i].style.backgroundColor = "red";
            allCustomInputs[i].style.color = "white";
        } else {
            allCustomInputs[i].style.backgroundColor = "white";
            allCustomInputs[i].style.color = "black";
        }
    }

    if (!continueToCustomTheme) {
        return alert("All colors should be between 0 and 255");
    }

    let selectedColors = {
        app_bg: [APP_BG_R.value, APP_BG_G.value, APP_BG_B.value],
        logo_clr: [LOGO_CLR_R.value, LOGO_CLR_G.value, LOGO_CLR_B.value],
        text_clr: [TEXT_CLR_R.value, TEXT_CLR_G.value, TEXT_CLR_B.value],
        current_clr: [
            CURRENT_CLR_R.value,
            CURRENT_CLR_G.value,
            CURRENT_CLR_B.value,
        ],
        correct_clr: [
            CORRECT_CLR_R.value,
            CORRECT_CLR_G.value,
            CORRECT_CLR_B.value,
        ],
        wrong_clr: [WRONG_CLR_R.value, WRONG_CLR_G.value, WRONG_CLR_B.value],
        wrong_bg: [WRONG_BG_R.value, WRONG_BG_G.value, WRONG_BG_B.value],
        menu_bg: [MENU_BG_R.value, MENU_BG_G.value, MENU_BG_B.value],
    };

    themes.push(selectedColors);
    themeChanger(themes.length - 1, true);
    themes.pop();
}

// Test Mode
function changeMode(mode) {
    document
        .querySelector(".test-modes .current-selected")
        .classList.remove("current-selected");
    document
        .querySelector(`.test-modes div[onclick="changeMode(${mode})"]`)
        .classList.add("current-selected");
    testMode = mode;
    localStorage.setItem("mode", mode);
}

if (storedMode) changeMode(storedMode);
// Test Time
function changeDuration(dur) {
    document
        .querySelector(".test-durations .current-selected")
        .classList.remove("current-selected");
    document
        .querySelector(`.test-durations div[onclick="changeDuration(${dur})"]`)
        .classList.add("current-selected");
    testTime = dur;
    timer.innerText = testTime;
    localStorage.setItem("time", dur);
}

if (storedTime) changeDuration(storedTime);
// Test Language
function changeLanguage(lang, self) {
    if (self.classList.contains("current-option")) return;

    document
        .querySelector(".languages .current-option")
        .classList.remove("current-option");
    self.classList.add("current-option");
    opener.click();

    switch (lang) {
        case "engEasy":
            testLang = engEasy;
            break;
        case "engMedium":
            testLang = engMedium;
            break;
        case "engHard":
            testLang = engHard;
            break;
        case "arabic":
            testLang = arabic;
            break;
        case "russian":
            testLang = russian;
            break;
    }

    opener.innerText = testLang.name;
    refreshBtn.click();
    localStorage.setItem("lang", lang);
}

if (storedLang) {
    document
        .querySelector(`div[onclick="changeLanguage('${storedLang}', this)"]`)
        .click();
}

// Dropdown Format
function dropdownAction(dropdown) {
    let toOperate = document.querySelector(`.${dropdown}`);

    if (toOperate.classList.contains("dropdown-opened")) {
        toOperate.classList.remove("dropdown-opened");
    } else {
        toOperate.classList.add("dropdown-opened");
    }
}

// Switches
for (let i = 0; i < allSwitches.length; i++) {
    allSwitches[i].addEventListener("click", () => {
        if (allSwitches[i].classList.contains("switch-opened")) {
            allSwitches[i].classList.remove("switch-opened");
        } else {
            allSwitches[i].classList.add("switch-opened");
        }
    });
}

function smoothScroll_switch(self) {
    let smoothScroll;

    if (self.classList.contains("switch-opened")) {
        words.style.scrollBehavior = "unset";
        smoothScroll = false;
    } else {
        words.style.scrollBehavior = "smooth";
        smoothScroll = true;
    }

    localStorage.setItem("scroll", smoothScroll);
}

if (storedScroll) {
    let scrollBtn = document.querySelector(
        'div[onclick="smoothScroll_switch(this)"]'
    );

    switch (storedScroll) {
        case "true":
            if (!scrollBtn.classList.contains("switch-opened"))
                scrollBtn.click();
            break;
        case "false":
            if (scrollBtn.classList.contains("switch-opened"))
                scrollBtn.click();
            break;
    }
}

function showMistakes_switch(self) {
    if (self.classList.contains("switch-opened")) {
        showMistakes = false;
        mistakesDisplay.innerHTML = `
            .wrong {
                color: var(--correct);
                background-color: unset;
            }
        `;
    } else {
        showMistakes = true;
        mistakesDisplay.innerHTML = `
            .wrong {
                color: var(--wrong);
                background-color: var(--wrong-bg);
            }
        `;
    }

    localStorage.setItem("mistakes", showMistakes);
}
if (storedMistakes) {
    let mistakesBtn = document.querySelector(
        'div[onclick="showMistakes_switch(this)"]'
    );

    switch (storedMistakes) {
        case "true":
            if (!mistakesBtn.classList.contains("switch-opened"))
                mistakesBtn.click();
            break;
        case "false":
            if (mistakesBtn.classList.contains("switch-opened"))
                mistakesBtn.click();
            break;
    }
}
function enableSound_switch(self) {
    if (self.classList.contains("switch-opened")) {
        soundEnabled = false;
    } else {
        soundEnabled = true;
    }

    localStorage.setItem("sound", soundEnabled);
}
if (storedSound) {
    let soundBtn = document.querySelector(
        'div[onclick="enableSound_switch(this)"]'
    );

    switch (storedSound) {
        case "true":
            if (!soundBtn.classList.contains("switch-opened")) soundBtn.click();
            break;
        case "false":
            if (soundBtn.classList.contains("switch-opened")) soundBtn.click();
            break;
    }
}
function backWord_switch(self) {
    if (self.classList.contains("switch-opened")) {
        backWord = false;
    } else {
        backWord = true;
    }

    localStorage.setItem("backWord", backWord);
}
if (storedBackWord) {
    let backWordBtn = document.querySelector(
        'div[onclick="backWord_switch(this)"]'
    );

    switch (storedBackWord) {
        case "true":
            if (!backWordBtn.classList.contains("switch-opened"))
                backWordBtn.click();
            break;
        case "false":
            if (backWordBtn.classList.contains("switch-opened"))
                backWordBtn.click();
            break;
    }
}
// Detect Mobile Users
function detectMobileUsers() {
    let check = false;

    (function (a) {
        if (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
                a
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                a.substr(0, 4)
            )
        )
            check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);

    if (check) {
        mobileUser = true;
    }
}

// Show Keyboard On Mobile
words.addEventListener("click", () => {
    if (mobileUser) {
        fakeInput.focus();
    }
});

// Show Discord Id
function showDiscord() {
    discordDiv.style.zIndex = 3;
    discordDiv.style.opacity = 1;
}

// Hide Discord Id
discordDiv.addEventListener("click", (e) => {
    if (e.target !== discordDiv) return;

    discordDiv.style.zIndex = -1;
    discordDiv.style.opacity = 0;
});

// Discord Id Hovering Note
discordId.addEventListener("mouseover", () => {
    discordIdNote.style.opacity = 1;
});

discordId.addEventListener("mouseout", () => {
    discordIdNote.style.opacity = 0;
});

// Copy Discord Id
discordId.addEventListener("click", () => {
    let inputToCopy = document.createElement("input");

    document.querySelector("body").appendChild(inputToCopy);
    inputToCopy.value = myDiscord.innerText;
    inputToCopy.select();
    inputToCopy.setSelectionRange(0, 99999);
    document.execCommand("copy");
    inputToCopy.remove();
    discordIdNote.innerText = "Copied!";

    setTimeout(() => {
        discordIdNote.innerText = "Click to copy";
    }, 1000);
});

// Console Project Info
function project_info(pass) {
    if (pass != 1242005) return console.error("Wrong Password");

    console.table(INFORMATION);
}

// Console Project Updates
function project_updates(pass) {
    if (pass != 1242005) return console.error("Wrong Password");

    console.table(UPDATES);
}

// Development Support Code
let fullHeightShown = false;
function enable_developer(pass) {
    if (pass != 1242005) return console.error("Wrong Password");

    console.log(
        "%cDeveloper Functions Enabled",
        "font-size: 20px; font-weight: bold; color: #b4ff00"
    );

    window.addEventListener("keydown", (e) => {
        if (e.key == 1) {
            words.style.display = "block";
            words.style.opacity = 1;
            result.style.display = "none";
            result.style.opacity = 0;
        } else if (e.key == 2) {
            result.style.display = "flex";
            result.style.opacity = 1;
            words.style.display = "none";
            words.style.opacity = 0;
        } else if (e.key == 3) {
            if (fullHeightShown) {
                words.style.height = `${spaceDimensions[1] * 3}px`;
                return (fullHeightShown = false);
            }

            words.style.height = "fit-content";
            fullHeightShown = true;
        }
    });
}
