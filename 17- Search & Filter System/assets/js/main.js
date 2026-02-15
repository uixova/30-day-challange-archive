const videoContainer = document.querySelector(".video-container"),
    searchBar = document.querySelector(".search-bar"),
    filterModel = document.getElementById("filter-model"),
    playerModel = document.getElementById("video-player-model"),
    filterBtn = document.querySelector(".filter-btn"),
    closeModel = document.querySelector(".close-model"),
    applyFilters = document.getElementById("apply-filters"),
    clearFilters = document.getElementById("clear-filters"),
    mainVideo = document.getElementById("main-video"),
    playerTitle = document.getElementById("player-title"),
    playerDesc = document.getElementById("player-description"),
    backHomeBtn = document.getElementById("back-home-btn"),
    descToggle = document.getElementById("desc-toggle"),
    descBody = document.getElementById("desc-body");

let allVideos = [];

filterBtn.onclick = () => filterModel.style.display = "block";
closeModel.onclick = () => filterModel.style.display = "none";

window.onclick = (e) => {
    if (e.target == filterModel) filterModel.style.display = "none";
};

async function fetchVideos() {
    try {
        const response = await fetch('assets/data/videos.json');
        allVideos = await response.json(); 
        renderVideos(allVideos);
    } catch (error) {
        console.error("Veri yüklenirken hata oluştu:", error);
    }
}

function renderVideos(videos) {
    videoContainer.innerHTML = ""; 

    videos.forEach(video => {
        const card = document.createElement("div");
        card.className = "video-card"; 
        
        card.innerHTML = `
            <div class="video-box">
                <video src="${video.videoUrl}"></video>
                <span class="category-badge">${video.category}</span>
            </div>
            <div class="video-info">
                <div class="video-title">
                    <h3>${video.title}</h3>
                </div>
                <div class="video-meta">
                    <span>${video.timeAgo}</span>
                </div>
            </div>
        `;

        card.onclick = () => openPlayer(video); 
        videoContainer.appendChild(card);
    });
}

searchBar.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase().trim();
    const filtered = allVideos.filter(v =>
        v.title.toLowerCase().includes(term)
    );
    renderVideos(filtered);
});

applyFilters.addEventListener("click", () => {
    const selectedCheckboxes = document.querySelectorAll(".category-filter:checked");
    const selectedCategories = Array.from(selectedCheckboxes).map(cb => cb.value);
    const sortType = document.getElementById("sort-select").value;

    let filteredList = [...allVideos];

    if (selectedCategories.length > 0) {
        filteredList = filteredList.filter(video =>
            selectedCategories.includes(video.category)
        );
    }

    if (sortType === "alphabetical") {
        filteredList.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortType === "newest") {
        filteredList.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    renderVideos(filteredList);
    filterModel.style.display = "none";
});

clearFilters.addEventListener("click", () => {
    document.querySelectorAll(".category-filter").forEach(cb => cb.checked = false);
    document.getElementById("sort-select").value = "default";
    renderVideos(allVideos);
});

function openPlayer(video) {
    mainVideo.src = video.videoUrl;
    playerTitle.innerText = video.title;
    playerDesc.innerText = video.description || "Bu video için açıklama bulunmuyor.";
    
    playerModel.style.display = "block";
    document.body.style.overflow = "hidden"; 
}

backHomeBtn.onclick = () => {
    playerModel.style.display = "none";
    mainVideo.pause();
    mainVideo.src = "";
    document.body.style.overflow = "auto";
};

descToggle.onclick = () => {
    descBody.classList.toggle("active");
};

fetchVideos();