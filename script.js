const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const searchBtn = document.getElementById("search-btn");
const result = document.querySelector(".result");

// Function to create meaning details
function details(part, meaning, example) {
    return `
        <div class="details">
            <p><strong>Part of Speech:</strong> ${part}</p>
        </div>
        <p class="word-meaning">
            <strong>Definition:</strong> ${meaning}
        </p>
        <p class="word-example">
            <strong>Example:</strong> ${example || "No example available."}
        </p>
        <hr>
    `;
}

// Event listener for search button
searchBtn.addEventListener("click", function () {
    console.log("Search initiated");
    const inpWord = document.getElementById("inp-word").value.trim();
    document.getElementById("inp-word").value = ""
    if (!inpWord) {
        result.innerHTML = "<p class='noWord'>Please enter a word to search.</p>";
        return;
    }

    fetch(`${url}${inpWord}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Word not found: ${inpWord}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
            let meaningsHtml = "";
            data[0].meanings.forEach((meanings) => {
                const part = meanings.partOfSpeech || "Unknown";
                const def = meanings.definitions[0]?.definition || "No definition available.";
                const eg = meanings.definitions[0]?.example || "No example provided.";
                meaningsHtml += details(part, def, eg);
            });

            result.innerHTML = `
                <div class="result">
                    <div class="word">
                        <div>
                            <h3>${inpWord}</h3>
                            <span class ='phonetic' >(${data[0].phonetics[0]?.text||data[0].phonetics[1]?.text||""})</span>
                        </div>
                        <button id="audio-btn">
                            <img src="medium-volume.png" alt="Pronounce">
                        </button>
                    </div>
                    ${meaningsHtml}
                </div>
            `;

            // Audio functionality
            const audio = data[0]?.phonetics?.[0]?.audio || data[0]?.phonetics?.[1]?.audio;
            const audioBtn = document.getElementById("audio-btn");
            if (audio) {
                audioBtn.addEventListener("click", () => {
                    const audioElement = new Audio(audio);
                    audioElement.play();
                });
            } else {
                audioBtn.disabled = true;
                audioBtn.title = "Audio not available";
                document.querySelector("#audio-btn").remove()
            }
        })
        .catch((error) => {
            console.error(error);
            result.innerHTML = `<h3 class="error">Couldn't Find The Word</h3>`;
        });
});
