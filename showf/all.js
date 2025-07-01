const body = document.querySelector('body');
const info = document.querySelector('.info-background');
const option = document.querySelector('.option');

function copyLink() {
    navigator.clipboard.writeText('roegie.github.io');
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

document.addEventListener("DOMContentLoaded", function() {
    const sections = [
        { id: "anime", dataKey: "anime", className: "anime" },
        { id: "movie", dataKey: "movie", className: "movie" },
        { id: "music", dataKey: "music", className: "music" },
        { id: "game", dataKey: "game", className: "game" },
        { id: "channel", dataKey: "channel", className: "channel" }
    ];

    fetch("../files/all.json")
        .then(response => response.json())
        .then(data => {
            sections.forEach(section => {
                const { id, dataKey, className } = section;
                const sectionEl = document.getElementById(id);

                if (!sectionEl) return; // ✅ Prevent error if section is not on this page

                const sectionData = data[dataKey];

                sectionData.forEach(item => {
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
                });
            });
        });
});