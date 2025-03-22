const unformattedTextArea = document.getElementById("user-input");
const xIcon = document.querySelector(".fa-xmark");
const copyIcon = document.querySelector(".copy-icon");
const copyTextTooltip = document.querySelector(".tooltiptext");
const cutIcon = document.querySelector(".cut-icon");
const cutTextTooltip = document.querySelector(".tooltiptext-cut");

let lastSelection = null; // Store last selection range

// Track the last selected range inside user-input
document.getElementById("user-input").addEventListener("mouseup", () => {
    saveSelection();
});

document.getElementById("user-input").addEventListener("keyup", () => {
    saveSelection();
});

document.getElementById("user-input").addEventListener("paste", function (event) {
    event.preventDefault(); // Prevent default pasting behavior

    const text = (event.clipboardData || window.clipboardData).getData("text"); // Get plain text
    document.execCommand("insertText", false, text); // Insert as unformatted text
});

function saveSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        lastSelection = selection.getRangeAt(0);
    }
}

// Mapping diacritic marks to vowels
const diacriticMap = {
    pahilis: { a: "á", e: "é", i: "í", o: "ó", u: "ú" },
    paiwa: { a: "à", e: "è", i: "ì", o: "ò", u: "ù" },
    pakupya: { a: "â", e: "ê", i: "î", o: "ô", u: "û" }
};

// Function to apply diacritic marks
function applyDiacritic(diacriticType) {
    if (!lastSelection) return;

    const selectedText = lastSelection.toString().trim();
    if (!selectedText) return;

    const modifiedText = selectedText.replace(/[aeiou]/gi, (match) => {
        const lowerChar = match.toLowerCase();
        const isUpperCase = match === match.toUpperCase();
        const replacement = diacriticMap[diacriticType][lowerChar] || match;
        return isUpperCase ? replacement.toUpperCase() : replacement;
    });

    lastSelection.deleteContents();
    lastSelection.insertNode(document.createTextNode(modifiedText));
    lastSelection = null;
}

// Function to replace selection with 'ñ'
function replaceSelection(character) {
    if (!lastSelection) return;

    lastSelection.deleteContents();
    lastSelection.insertNode(document.createTextNode(character));
    lastSelection = null;
}

// Function to underline selected vowels (or all characters if easier)
function applyUnderline() {
    if (!lastSelection) return;

    const selectedText = lastSelection.toString().trim();
    if (!selectedText) return;

    const modifiedText = selectedText.replace(/[aeiou]/gi, (match) => {
        return `<u>${match}</u>`;
    });

    const tempElement = document.createElement("span");
    tempElement.innerHTML = modifiedText;

    lastSelection.deleteContents();
    lastSelection.insertNode(tempElement);
    lastSelection = null;
}

// Attach event listener to diacritic buttons
document.querySelectorAll(".diacritic-buttons__group > div").forEach((button) => {
    button.addEventListener("click", function () {
        if (this.classList.contains("diacritic-buttons__button--pahilis")) {
            applyDiacritic("pahilis");
        } else if (this.classList.contains("diacritic-buttons__button--paiwa")) {
            applyDiacritic("paiwa");
        } else if (this.classList.contains("diacritic-buttons__button--pakupya")) {
            applyDiacritic("pakupya");
        } else if (this.classList.contains("diacritic-buttons__button--enye")) {
            replaceSelection("ñ");
        } else if (this.classList.contains("diacritic-buttons__button--underline")) {
            applyUnderline();
        }
    });
});

xIcon.addEventListener("click", () => {
    unformattedTextArea.innerHTML = "";
});

copyIcon.addEventListener("click", () => {
    // Create a range to select all text in user-input div
    const range = document.createRange();
    range.selectNodeContents(unformattedTextArea);

    // Get the current selection and replace it with our range
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    // Execute copy command
    document.execCommand("copy");
    
    // Clear selection after copying
    selection.removeAllRanges();
    
    copyTextTooltip.textContent = "Text copied!";
    copyTextTooltip.classList.add("copied");
    setTimeout(() => {
        copyTextTooltip.textContent = "Copy text";
        copyTextTooltip.classList.remove("copied");
    }, 3000);
});

cutIcon.addEventListener("click", () => {
    const range = document.createRange();
    range.selectNodeContents(unformattedTextArea);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    document.execCommand("cut");
    
    selection.removeAllRanges();
    
    cutTextTooltip.textContent = "Text cut!";
    cutTextTooltip.classList.add("cut");
    unformattedTextArea.value = "";

    setTimeout(() => {
        cutTextTooltip.textContent = "Cut text";
        cutTextTooltip.classList.remove("cut");
    }, 3000);
});
