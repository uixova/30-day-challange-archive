const blogCards = document.getElementById("blogCards");
const addBlogModel = document.getElementById("add-blog-model");
const viewBlogModel = document.getElementById("view-blog-model");
const viewInner = document.getElementById("view-inner");
const searchInput = document.getElementById("searchInput");

let allBlogs = [];
let systemBlogs = [];
let currentPage = 1;
let postsPerPage = 6;
let searchTimeout;
let currentFilteredData = []; 

async function initApp() {
    try {
        const response = await fetch('assets/data/blog.json');
        const systemBlog = await response.json();
        systemBlogs = systemBlog;

        const userBlogs = JSON.parse(localStorage.getItem("blogs")) || [];
        allBlogs = [...userBlogs, ...systemBlog];
        
        currentFilteredData = allBlogs; 
        renderBlogs(currentFilteredData);
    } catch (error) {
        console.error("Veri yükleme hatası:", error);
    }
}

function renderBlogs(data) {
    blogCards.innerHTML = "";
    const container = document.querySelector(".pagination-container");
    currentFilteredData = data;

    if (data.length === 0) {
        blogCards.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 50px; color: #64748b;">
                <i class="fa-solid fa-magnifying-glass" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                <h3 style="font-size: 1.5rem; color: #0f172a;">Aramanızla eşleşen bir yazı bulunamadı</h3>
                <p>Farklı anahtar kelimeler denemeye ne dersin kanka?</p>
            </div>
        `;
        if (container) container.style.display = "none";
        return; 
    }

    if (container) container.style.display = "flex";

    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);

    blogCards.innerHTML = paginatedData.map((blog) => `
        <div class="blog-card">
            <div class="card-img-box">
                <img src="${blog.img || 'https://picsum.photos/400/250'}" alt="blog">
            </div>
            <div class="card-body">
                <span class="category-tag">${blog.category}</span>
                <h2>${blog.title}</h2>
                <p>${blog.text.substring(0, 100)}...</p>
                <div class="card-footer-info">
                    <span class="post-date">
                        <i class="fa-regular fa-calendar"></i> ${blog.date}
                    </span>
                    <a href="javascript:void(0)" onclick="openViewModal('${blog.id}')" class="read-btn">Read More</a>
                </div>
            </div>
        </div>
    `).join("");

    renderPagination(data.length); 
}

function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / postsPerPage);
    const container = document.querySelector(".pagination-container");
    container.innerHTML = "";

    if (totalPages <= 1) {
        container.style.display = "none";
        return;
    }

    const prevBtn = document.createElement("button");
    prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderBlogs(currentFilteredData); 
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    container.appendChild(prevBtn);

    const pageInfo = document.createElement("span");
    pageInfo.className = "page-info";
    pageInfo.style.cssText = "display: flex; align-items: center; font-weight: 600; color: #0f172a; padding: 0 15px;";
    pageInfo.innerText = `${currentPage} / ${totalPages}`;
    container.appendChild(pageInfo);

    const nextBtn = document.createElement("button");
    nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderBlogs(currentFilteredData);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    container.appendChild(nextBtn);
}

function openViewModal(id) {
    const selectedBlog = allBlogs.find(blog => blog.id == id);
    if (selectedBlog) {
        viewInner.innerHTML = `
            <div class="view-post-container">
                <div class="view-post-header">
                    <span class="category-tag">${selectedBlog.category}</span>
                    <h1 style="font-size: 2rem; margin-top: 15px; color: #0f172a;">${selectedBlog.title}</h1>
                    <div class="post-date" style="margin: 15px 0; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px;">
                        <i class="fa-regular fa-calendar"></i> ${selectedBlog.date}
                    </div>
                </div>
                <div class="view-post-image" style="margin-bottom: 25px;">
                    <img src="${selectedBlog.img || 'https://picsum.photos/800/400'}" alt="${selectedBlog.title}" style="width: 100%; border-radius: 16px; object-fit: cover; max-height: 400px;">
                </div>
                <div class="view-post-body">
                    <p style="font-size: 16px; line-height: 1.8; color: #334155; white-space: pre-line;">${selectedBlog.text}</p>
                </div>
            </div>
        `;
        viewBlogModel.style.display = "flex";
    }
}

function openModel(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "flex";
}

function closeModel(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "none";
}

function saveBlog() {
    const titleInput = document.getElementById("blogTitle");
    const textInput = document.getElementById("blogText");
    const categoryInput = document.getElementById("blogCategory");

    const title = titleInput.value.trim();
    const text = textInput.value.trim();

    if (!title || !text) {
        alert("Aga boş bırakma buraları!");
        return;
    }

    const publishBtn = document.querySelector(".publish-btn"); 
    if(publishBtn) publishBtn.disabled = true;

    const newBlog = {
        id: "user_" + Date.now(),
        title: title,
        category: categoryInput.value,
        text: text,
        img: 'https://picsum.photos/400/250?random=' + Math.floor(Math.random() * 1000),
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    let userBlogs = JSON.parse(localStorage.getItem("blogs") || "[]");
    userBlogs.unshift(newBlog);
    localStorage.setItem("blogs", JSON.stringify(userBlogs));

    allBlogs = [...userBlogs, ...systemBlogs];
    currentPage = 1; 
    applyFilters();

    titleInput.value = "";
    textInput.value = "";
    if(publishBtn) publishBtn.disabled = false; 
    closeModel('add-blog-model'); 
}

searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        applyFilters(); 
    }, 500);
});

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const sortInput = document.querySelector('input[name="sort"]:checked');
    const selectedSort = sortInput ? sortInput.parentElement.textContent.trim() : "Newest";
    
    let filtered = allBlogs.filter(b => 
        b.title.toLowerCase().includes(searchTerm) || 
        b.text.toLowerCase().includes(searchTerm)
    );

    const checkedInputs = document.querySelectorAll('.checkbox-group input:checked');
    const activeCategories = Array.from(checkedInputs).map(cb => cb.parentElement.textContent.trim());
    
    if (activeCategories.length > 0) {
        filtered = filtered.filter(b => activeCategories.includes(b.category));
    }

    if (selectedSort === "Newest") {
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (selectedSort === "Oldest") {
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    currentPage = 1; 
    renderBlogs(filtered);
}

document.querySelectorAll('input[name="sort"], .checkbox-group input').forEach(input => {
    input.addEventListener('change', applyFilters);
});

initApp();