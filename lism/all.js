const body = document.querySelector('body');
const info = document.querySelector('.info-background');
const option = document.querySelector('.option');

function copyLink() {
    navigator.clipboard.writeText('jeryum.github.io');
    hide(option);
}

function show(element) {
    element.style.display = 'flex';
    setTimeout(() => {
        element.style.opacity = '1';
    }, 1);
}

function hide(element) {
    element.style.opacity = '0';
    setTimeout(() => {
        element.style.display = 'none'
    }, 300);
}

function updateCount(dataKey, count) {
    const countElement = document.querySelector('.count');
    if (countElement) {
        countElement.textContent = `${count} lists`;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const sections = [
        { id: "anime", dataKey: "anime", className: "anime" },
        { id: "movie", dataKey: "movie", className: "movie" },
        { id: "music", dataKey: "music", className: "music" },
        { id: "game", dataKey: "game", className: "game" },
        { id: "channel", dataKey: "channel", className: "channel" },
        { id: "books", dataKey: "books", className: "books" },
        { id: "manga", dataKey: "manga", className: "manga" },
   { id: "manhwa", dataKey: "manhwa", className: "manhwa" },
   { id: "animem", dataKey: "animem", className: "animem" }
    ];

    console.log("Starting to fetch JSON data...");
    fetch("all.json")
        .then(response => {
            console.log("Response status:", response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Successfully parsed JSON:", data);
            sections.forEach(section => {
                const { id, dataKey, className } = section;
                const sectionEl = document.getElementById(id);
                console.log(`Looking for section ${id}:`, sectionEl);

                if (!sectionEl) {
                    console.log(`Section ${id} not found in this page`);
                    return;
                }

                const sectionData = data[dataKey];
                if (!sectionData || !Array.isArray(sectionData)) {
                    console.log(`No valid data found for ${dataKey}:`, sectionData);
                    return;
                }

                // Update the count for this section
                updateCount(dataKey, sectionData.length);

                sectionData.forEach((item, index) => {
                    try {
                        const link = document.createElement("a");
                        link.classList.add(className);
                        link.href = item.url;
                        link.target = "_blank";

                        const coverImg = document.createElement("img");
                        coverImg.classList.add("cover");
                        coverImg.src = item.cover;
                        coverImg.alt = item.title;
                        coverImg.loading = "lazy";
                        link.appendChild(coverImg);

                        const title = document.createElement("p");
                        title.classList.add("title");
                        title.textContent = item.title;
                        link.appendChild(title);

                        const releaseDate = document.createElement("p");
                        releaseDate.classList.add("release");
                        const year = new Date(item.release).getFullYear();
                        releaseDate.textContent = year;
                        link.appendChild(releaseDate);

                        sectionEl.appendChild(link);
                        console.log(`Successfully added ${item.title} to ${id}`);
                    } catch (err) {
                        console.error(`Error adding item ${index} to ${id}:`, err);
                    }
                });
            });
        })
        .catch(error => {
            console.error("Error loading or processing data:", error);
        });
});
