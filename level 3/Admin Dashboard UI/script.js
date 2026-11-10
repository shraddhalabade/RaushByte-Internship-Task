
"use strict";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const STORAGE_KEY = "SLBlog_admin_v1";
const PROFILE_KEY = "SLBlog_admin_profile_v1";
const COLORS = ["#8066ec", "#55b99b", "#f0ad55", "#5c9be8", "#e77e9b", "#54b8c4"];

const DEFAULT_CATEGORIES = [
    { name: "Technology", description: "Technology, coding, and innovation." },
    { name: "Lifestyle", description: "Everyday living and personal growth." },
    { name: "Business", description: "Business, startups, and productivity." },
    { name: "Design", description: "Design inspiration and creative ideas." },
    { name: "Tutorials", description: "Practical guides and how-to articles." }
];

const DEFAULT_POSTS = [
    {
        id: 1,
        title: "Top 10 VS Code Extensions Every Developer Should Know",
        subtitle: "Discover useful development tools that can improve your coding workflow.",
        category: "Technology",
        status: "Published",
        views: 2450,
        date: "2026-11-05",
        image: "",
        content: "Explore useful extensions that can improve your development workflow."
    },
    {
        id: 2,
        title: "A Beginner's Guide to Building Modern Websites",
        subtitle: "Learn the essential steps to creating a clean and responsive website.",
        category: "Tutorials",
        status: "Published",
        views: 1820,
        date: "2026-11-04",
        image: "",
        content: "Learn how to plan, design, and develop your first modern website."
    },
    {
        id: 3,
        title: "How to Stay Productive While Working from Home",
        subtitle: "Simple strategies to improve your focus and daily routine.",
        category: "Lifestyle",
        status: "Published",
        views: 1640,
        date: "2026-11-03",
        image: "",
        content: "Build a better routine with simple productivity strategies."
    },
    {
        id: 4,
        title: "UI Design Trends Worth Exploring in 2026",
        subtitle: "Explore modern interface patterns and thoughtful design choices.",
        category: "Design",
        status: "Published",
        views: 1280,
        date: "2026-11-02",
        image: "",
        content: "Explore current interface design ideas and visual patterns."
    },
    {
        id: 5,
        title: "Building Your First Personal Portfolio",
        subtitle: "A practical guide to presenting your skills and projects.",
        category: "Tutorials",
        status: "Draft",
        views: 0,
        date: "2026-11-01",
        image: "",
        content: "Plan a portfolio that showcases your projects and skills."
    },
    {
        id: 6,
        title: "Smart Strategies for Growing a Small Business",
        subtitle: "Ideas for improving your workflow and reaching more customers.",
        category: "Business",
        status: "Draft",
        views: 0,
        date: "2026-10-30",
        image: "",
        content: "Learn practical approaches to growing a small business."
    }
];

const DEFAULT_COMMENTS = [
    {
        id: 101,
        author: "Aarav Sharma",
        email: "aarav@example.com",
        text: "This article was very helpful. Thanks for sharing!",
        postId: 1,
        status: "Pending"
    },
    {
        id: 102,
        author: "Priya Patel",
        email: "priya@example.com",
        text: "I have been using these tools in my own projects.",
        postId: 1,
        status: "Approved"
    },
    {
        id: 103,
        author: "Rohan Mehta",
        email: "rohan@example.com",
        text: "Could you share more tutorials on responsive design?",
        postId: 2,
        status: "Pending"
    },
    {
        id: 104,
        author: "Neha Joshi",
        email: "neha@example.com",
        text: "The productivity tips really helped me organize my day.",
        postId: 3,
        status: "Approved"
    }
];

function cloneData(data) {
    return JSON.parse(JSON.stringify(data));
}

function loadJSON(key, fallback) {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : cloneData(fallback);
    } catch (error) {
        console.warn("Could not read saved data:", error);
        return cloneData(fallback);
    }
}

let savedState = loadJSON(STORAGE_KEY, {
    posts: DEFAULT_POSTS,
    categories: DEFAULT_CATEGORIES,
    comments: DEFAULT_COMMENTS
});

let posts = Array.isArray(savedState.posts) ? savedState.posts : cloneData(DEFAULT_POSTS);
let categories = Array.isArray(savedState.categories) ? savedState.categories : cloneData(DEFAULT_CATEGORIES);
let comments = Array.isArray(savedState.comments) ? savedState.comments : cloneData(DEFAULT_COMMENTS);

let profile = loadJSON(PROFILE_KEY, {
    name: "Admin User",
    email: "admin@example.com",
    blogName: "SLBlog"
});

let postFilter = "all";
let commentFilter = "all";
let editingCategory = null;
let trafficChart = null;
let categoryChart = null;
let analyticsTrafficChart = null;
let analyticsCategoryChart = null;

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            posts,
            categories,
            comments
        }));
    } catch (error) {
        console.error("Could not save data:", error);
        showToast("Unable to save data. Browser storage may be full.", "error");
    }
}

function saveProfile() {
    try {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (error) {
        showToast("Unable to save profile settings.", "error");
    }
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function formatNumber(value) {
    return Number(value || 0).toLocaleString("en-IN");
}

function formatDate(dateString) {
    if (!dateString) return "—";

    const date = new Date(dateString + "T00:00:00");

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function todayISO() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getPost(id) {
    return posts.find((post) => post.id === Number(id));
}

function getPostTitle(postId) {
    return getPost(postId)?.title || "Deleted article";
}

function getCategoryIcon(name) {
    const icons = {
        Technology: "fa-laptop-code",
        Lifestyle: "fa-heart",
        Business: "fa-briefcase",
        Design: "fa-palette",
        Tutorials: "fa-graduation-cap"
    };

    return icons[name] || "fa-folder";
}

function getPostIcon(category) {
    return {
        Technology: "fa-laptop-code",
        Lifestyle: "fa-heart",
        Business: "fa-briefcase",
        Design: "fa-palette",
        Tutorials: "fa-book-open"
    }[category] || "fa-file-lines";
}

function showToast(message, type = "success") {
    const container = $("#toastContainer");
    const toast = document.createElement("div");

    toast.className = `toast ${type === "error" ? "error" : ""}`;

    const icon = document.createElement("i");
    icon.className = type === "error"
        ? "fa-solid fa-circle-exclamation"
        : "fa-solid fa-circle-check";

    const text = document.createElement("span");
    text.textContent = message;

    toast.append(icon, text);
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 3200);
}

function confirmAction(message) {
    return window.confirm(message);
}

function updateProfileDisplay() {
    const name = profile.name || "Admin User";
    const initials = name.trim().split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("");

    $("#profileName").textContent = name;
    $("#topProfileName").textContent = name;
    $("#welcomeName").textContent = name.split(/\s+/)[0];
    $("#adminName").value = name;
    $("#adminEmail").value = profile.email || "";
    $("#blogName").value = profile.blogName || "SLBlog";

    $$(".avatar").forEach((avatar) => {
        avatar.textContent = initials || "AD";
    });

    $$(".brand > span:last-child").forEach((brandName) => {
        brandName.innerHTML = `${escapeHTML(profile.blogName || "SLBlog")}<span class="brand-dot">.</span>`;
    });
}

function navigateTo(page) {
    const section = $(`#page-${page}`);

    if (!section) return;

    $$(".page-section").forEach((item) => item.classList.remove("active"));
    section.classList.add("active");

    $$(".nav-item").forEach((item) => {
        item.classList.toggle("active", item.dataset.page === page);
    });

    const activeNav = $(`.nav-item[data-page="${page}"] span`);

    $("#breadcrumbTitle").textContent = activeNav?.textContent.trim() || ({
        overview: "Overview",
        posts: "All Posts",
        analytics: "Analytics",
        categories: "Categories",
        comments: "Comments",
        settings: "Settings"
    }[page] || page);

    closeMobileSidebar();

    if (page === "analytics") {
        renderAnalyticsCharts();
        renderPopularPosts();
    }

    if (page === "overview") {
        renderOverviewCharts();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}

$$("[data-page]").forEach((button) => {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        navigateTo(button.dataset.page);
    });
});

const sidebar = $("#sidebar");
const overlay = $("#sidebarOverlay");

$("#menuToggle").addEventListener("click", () => {
    sidebar.classList.toggle("mobile-open");
    overlay.classList.toggle("visible");
});

function closeMobileSidebar() {
    sidebar.classList.remove("mobile-open");
    overlay.classList.remove("visible");
}

overlay.addEventListener("click", closeMobileSidebar);

document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        $("#globalSearch").focus();
    }

    if (event.key === "Escape") {
        closeMobileSidebar();
        closeAllModals();
    }
});

function openModal(id) {
    const modal = $(`#${id}`);

    if (!modal) return;

    modal.classList.add("open");
    document.body.style.overflow = "hidden";

    const input = modal.querySelector("input:not([type=hidden]), textarea, select");

    setTimeout(() => input?.focus(), 80);
}

function closeModal(id) {
    $(`#${id}`)?.classList.remove("open");

    if (!$(".modal-backdrop.open")) {
        document.body.style.overflow = "";
    }
}

function closeAllModals() {
    $$(".modal-backdrop").forEach((modal) => modal.classList.remove("open"));
    document.body.style.overflow = "";
}

$$("[data-close]").forEach((button) => {
    button.addEventListener("click", () => closeModal(button.dataset.close));
});

$$(".modal-backdrop").forEach((modal) => {
    modal.addEventListener("click", (event) => {
        if (event.target === modal) closeModal(modal.id);
    });
});

function getPostThumb(post) {
    const icon = getPostIcon(post.category);

    if (post.image) {
        return `
            <div class="article-thumb">
                <img src="${escapeHTML(post.image)}"
                     alt=""
                     loading="lazy"
                     onerror="this.style.display='none';this.parentElement.innerHTML='<i class=\\'fa-solid ${icon}\\'></i>'">
            </div>`;
    }

    return `
        <div class="article-thumb">
            <i class="fa-solid ${icon}"></i>
        </div>`;
}

function postRow(post, includeActions = true) {
    const statusClass = post.status === "Published" ? "published" : "draft";

    return `
        <tr>
            <td>
                <div class="article-cell">
                    ${getPostThumb(post)}
                    <div class="article-info">
                        <strong title="${escapeHTML(post.title)}">${escapeHTML(post.title)}</strong>
                        <small>${escapeHTML(post.subtitle || "No description added")}</small>
                    </div>
                </div>
            </td>
            <td><span class="category-pill">${escapeHTML(post.category)}</span></td>
            <td><span class="status status-${statusClass}">${escapeHTML(post.status)}</span></td>
            <td>${formatNumber(post.views)}</td>
            <td>${formatDate(post.date)}</td>
            <td>
                ${includeActions ? `
                    <div class="row-actions">
                        <button class="row-action" data-edit-post="${post.id}" title="Edit post" aria-label="Edit post">
                            <i class="fa-regular fa-pen-to-square"></i>
                        </button>
                        <button class="row-action delete" data-delete-post="${post.id}" title="Delete post" aria-label="Delete post">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>` : ""}
            </td>
        </tr>`;
}

function renderRecentPosts() {
    const recent = [...posts]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 5);

    $("#recentPostsBody").innerHTML = recent.map((post) => postRow(post, true)).join("");
    $("#recentEmpty").classList.toggle("hidden", recent.length > 0);
}

function populateCategorySelects() {
    const options = categories.map((category) =>
        `<option value="${escapeHTML(category.name)}">${escapeHTML(category.name)}</option>`
    ).join("");

    const categorySelect = $("#postCategory");
    const previousValue = categorySelect.value;

    categorySelect.innerHTML = options ||
        '<option value="">Add a category first</option>';

    if (categories.some((category) => category.name === previousValue)) {
        categorySelect.value = previousValue;
    }

    const filter = $("#categoryFilter");
    const currentFilter = filter.value;

    filter.innerHTML = '<option value="all">All categories</option>' + options;

    if (currentFilter === "all" || categories.some((category) => category.name === currentFilter)) {
        filter.value = currentFilter || "all";
    } else {
        filter.value = "all";
    }
}

function renderAllPosts() {
    const query = $("#postSearch").value.trim().toLowerCase();
    const selectedCategory = $("#categoryFilter").value;

    const filtered = posts.filter((post) => {
        const matchesFilter = postFilter === "all" || post.status === postFilter;
        const matchesQuery = `${post.title} ${post.subtitle} ${post.category}`
            .toLowerCase().includes(query);
        const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;

        return matchesFilter && matchesQuery && matchesCategory;
    }).sort((a, b) => b.date.localeCompare(a.date));

    $("#allPostsBody").innerHTML = filtered.map((post) => postRow(post)).join("");
    $("#postsEmpty").classList.toggle("hidden", filtered.length > 0);
    $("#postCountText").textContent = `${filtered.length} of ${posts.length} posts`;
}

function openPostModal(id = null) {
    $("#postForm").reset();
    $("#postId").value = "";
    $("#postModalTitle").textContent = id ? "Edit post" : "Create a new post";

    populateCategorySelects();

    if (id !== null) {
        const post = getPost(id);
        if (!post) return;

        $("#postId").value = post.id;
        $("#postTitle").value = post.title;
        $("#postSubtitle").value = post.subtitle || "";
        $("#postCategory").value = post.category;
        $("#postStatus").value = post.status;
        $("#postImage").value = post.image || "";
        $("#postContent").value = post.content || "";
    } else {
        if (categories.length === 0) {
            showToast("Add a category before creating a post.", "error");
            openCategoryModal();
            return;
        }

        $("#postStatus").value = "Draft";
    }

    openModal("postModal");
}

$("#addPostBtn").addEventListener("click", () => openPostModal());
$("#postsAddBtn").addEventListener("click", () => openPostModal());

$("#postForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const id = $("#postId").value;
    const title = $("#postTitle").value.trim();
    const subtitle = $("#postSubtitle").value.trim();
    const category = $("#postCategory").value;
    const status = $("#postStatus").value;
    const image = $("#postImage").value.trim();
    const content = $("#postContent").value.trim();

    if (!title || !category) {
        showToast("Please enter a title and select a category.", "error");
        return;
    }

    if (image) {
        try {
            const parsedURL = new URL(image);
            if (!["http:", "https:"].includes(parsedURL.protocol)) {
                throw new Error("Invalid image URL");
            }
        } catch {
            showToast("Please enter a valid HTTP or HTTPS image URL.", "error");
            return;
        }
    }

    if (id) {
        const index = posts.findIndex((post) => post.id === Number(id));
        if (index === -1) return;

        posts[index] = {
            ...posts[index],
            title,
            subtitle,
            category,
            status,
            image,
            content
        };

        showToast("Post updated successfully!");
    } else {
        posts.unshift({
            id: Date.now(),
            title,
            subtitle,
            category,
            status,
            views: 0,
            date: todayISO(),
            image,
            content
        });

        showToast("New post created successfully!");
    }

    saveState();
    closeModal("postModal");
    renderEverything();
});

function deletePost(id) {
    const post = getPost(id);
    if (!post) return;

    if (!confirmAction(`Delete "${post.title}"? This action cannot be undone.`)) return;

    posts = posts.filter((item) => item.id !== Number(id));

    comments = comments.filter((comment) => comment.postId !== Number(id));

    saveState();
    renderEverything();
    showToast("Post deleted successfully.");
}

document.addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-edit-post]");
    const deleteButton = event.target.closest("[data-delete-post]");

    if (editButton) openPostModal(editButton.dataset.editPost);
    if (deleteButton) deletePost(deleteButton.dataset.deletePost);
});

$("#postSearch").addEventListener("input", renderAllPosts);

$("#categoryFilter").addEventListener("change", renderAllPosts);

$("#postTabs").addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;

    postFilter = button.dataset.filter;

    $$("#postTabs .tab").forEach((tab) => {
        tab.classList.toggle("active", tab === button);
    });

    renderAllPosts();
});

function openCategoryModal(name = null) {
    editingCategory = name;

    $("#categoryForm").reset();
    $("#categoryOriginalName").value = name || "";
    $("#categoryModalTitle").textContent = name ? "Edit category" : "Add category";

    if (name) {
        const category = categories.find((item) => item.name === name);
        if (!category) return;

        $("#categoryName").value = category.name;
        $("#categoryDescription").value = category.description || "";
    }

    openModal("categoryModal");
}

$("#addCategoryBtn").addEventListener("click", () => openCategoryModal());

$("#categoryForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const originalName = $("#categoryOriginalName").value;
    const name = $("#categoryName").value.trim();
    const description = $("#categoryDescription").value.trim();

    if (!name) return;

    const duplicate = categories.some((category) =>
        category.name.toLowerCase() === name.toLowerCase() &&
        category.name !== originalName
    );

    if (duplicate) {
        showToast("A category with this name already exists.", "error");
        return;
    }

    if (originalName) {
        categories = categories.map((category) =>
            category.name === originalName
                ? { name, description }
                : category
        );

        posts = posts.map((post) =>
            post.category === originalName
                ? { ...post, category }
                : post
        );

        showToast("Category updated successfully.");
    } else {
        categories.push({ name, description });
        showToast("Category added successfully.");
    }

    saveState();
    closeModal("categoryModal");
    renderEverything();
});

function deleteCategory(name) {
    const relatedPosts = posts.filter((post) => post.category === name).length;

    if (relatedPosts > 0) {
        showToast(`Move or delete the ${relatedPosts} post(s) in this category first.`, "error");
        return;
    }

    if (!confirmAction(`Delete the "${name}" category?`)) return;

    categories = categories.filter((category) => category.name !== name);

    saveState();
    renderEverything();
    showToast("Category deleted successfully.");
}

function renderCategories() {
    const categoryCards = $("#categoryCards");
    const categoriesBody = $("#categoriesBody");

    categoryCards.innerHTML = categories.map((category, index) => {
        const count = posts.filter((post) => post.category === category.name).length;

        return `
            <article class="category-card">
                <div class="category-card-top">
                    <span class="category-card-icon">
                        <i class="fa-solid ${getCategoryIcon(category.name)}"></i>
                    </span>
                    <button class="row-action" data-edit-category="${escapeHTML(category.name)}" aria-label="Edit category">
                        <i class="fa-solid fa-ellipsis"></i>
                    </button>
                </div>
                <h3>${escapeHTML(category.name)}</h3>
                <p>${escapeHTML(category.description || "No description added.")}</p>
                <div class="category-card-bottom">
                    <span>Articles</span>
                    <strong>${count}</strong>
                </div>
            </article>`;
    }).join("");

    categoriesBody.innerHTML = categories.map((category) => {
        const count = posts.filter((post) => post.category === category.name).length;

        return `
            <tr>
                <td><strong>${escapeHTML(category.name)}</strong></td>
                <td>${escapeHTML(category.description || "—")}</td>
                <td>${count}</td>
                <td>
                    <div class="row-actions">
                        <button class="row-action" data-edit-category="${escapeHTML(category.name)}" title="Edit category">
                            <i class="fa-regular fa-pen-to-square"></i>
                        </button>
                        <button class="row-action delete" data-delete-category="${escapeHTML(category.name)}" title="Delete category">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            </tr>`;
    }).join("");

    $("#categoriesEmpty").classList.toggle("hidden", categories.length > 0);
    $("#categoryTotal").textContent = categories.length;
}

document.addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-edit-category]");
    const deleteButton = event.target.closest("[data-delete-category]");

    if (editButton) openCategoryModal(editButton.dataset.editCategory);
    if (deleteButton) deleteCategory(deleteButton.dataset.deleteCategory);
});

function renderComments() {
    const filtered = comments.filter((comment) =>
        commentFilter === "all" || comment.status === commentFilter
    );

    $("#commentsBody").innerHTML = filtered.map((comment) => `
        <tr>
            <td>
                <div class="article-info">
                    <strong>${escapeHTML(comment.author)}</strong>
                    <small>${escapeHTML(comment.email || "")}</small>
                </div>
            </td>
            <td style="white-space:normal;min-width:200px;max-width:320px">
                ${escapeHTML(comment.text)}
            </td>
            <td style="white-space:normal;min-width:140px">
                ${escapeHTML(getPostTitle(comment.postId))}
            </td>
            <td><span class="status status-${comment.status.toLowerCase()}">${escapeHTML(comment.status)}</span></td>
            <td>
                <div class="row-actions">
                    ${comment.status === "Pending" ? `
                        <button class="row-action" data-approve-comment="${comment.id}" title="Approve comment">
                            <i class="fa-solid fa-check"></i>
                        </button>` : ""}
                    <button class="row-action delete" data-delete-comment="${comment.id}" title="Delete comment">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join("");

    $("#commentsEmpty").classList.toggle("hidden", filtered.length > 0);
    $("#commentTotal").textContent = comments.length;
    $("#commentPending").textContent = comments.filter((c) => c.status === "Pending").length;
    $("#commentApproved").textContent = comments.filter((c) => c.status === "Approved").length;
    $("#navCommentCount").textContent = comments.filter((c) => c.status === "Pending").length;
}

$("#commentTabs").addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;

    commentFilter = button.dataset.filter;

    $$("#commentTabs .tab").forEach((tab) => {
        tab.classList.toggle("active", tab === button);
    });

    renderComments();
});

document.addEventListener("click", (event) => {
    const approveButton = event.target.closest("[data-approve-comment]");
    const deleteButton = event.target.closest("[data-delete-comment]");

    if (approveButton) {
        const comment = comments.find((item) => item.id === Number(approveButton.dataset.approveComment));

        if (comment) {
            comment.status = "Approved";
            saveState();
            renderEverything();
            showToast("Comment approved.");
        }
    }

    if (deleteButton) {
        const id = Number(deleteButton.dataset.deleteComment);

        if (confirmAction("Delete this comment?")) {
            comments = comments.filter((comment) => comment.id !== id);
            saveState();
            renderEverything();
            showToast("Comment deleted.");
        }
    }
});

function renderStats() {
    const published = posts.filter((post) => post.status === "Published");
    const drafts = posts.filter((post) => post.status === "Draft");

    $("#totalPosts").textContent = formatNumber(posts.length);
    $("#publishedPosts").textContent = formatNumber(published.length);
    $("#draftPosts").textContent = formatNumber(drafts.length);

    const views = published.reduce((total, post) => total + Number(post.views || 0), 0);

    $("#totalViews").textContent = formatNumber(views);
    $("#postsStatTotal").textContent = posts.length;
    $("#postsStatPublished").textContent = published.length;
    $("#postsStatDraft").textContent = drafts.length;
    $("#navPostCount").textContent = posts.length;

    $("#todayDate").textContent = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}


function makeTrafficData(days) {
    const count = Number(days) || 30;
    const points = Math.min(count, 30);
    const labels = [];
    const views = [];
    const visitors = [];

    for (let i = points - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        labels.push(date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short"
        }));

        const index = points - 1 - i;
        views.push(Math.round(
            170 + Math.sin(index * 0.55) * 65 +
            Math.cos(index * 0.23) * 45 + index * 3 +
            (index % 5) * 13
        ));

        visitors.push(Math.round(
            90 + Math.sin(index * 0.42 + 1) * 32 +
            Math.cos(index * 0.31) * 20 + index * 1.6
        ));
    }

    return { labels, views, visitors };
}

function getChartOptions() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: "#292541",
                padding: 11,
                cornerRadius: 8,
                titleFont: { family: "Inter", size: 11 },
                bodyFont: { family: "Inter", size: 10 }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                border: { display: false },
                ticks: {
                    color: "#9999ae",
                    font: { family: "Inter", size: 9 },
                    maxTicksLimit: 7,
                    maxRotation: 0
                }
            },
            y: {
                beginAtZero: true,
                border: { display: false, dash: [4, 4] },
                grid: { color: "#f0eff6" },
                ticks: {
                    color: "#9999ae",
                    font: { family: "Inter", size: 9 },
                    maxTicksLimit: 5
                }
            }
        }
    };
}

function createTrafficChart(canvasId, days) {
    const canvas = $(`#${canvasId}`);

    if (!canvas || typeof Chart === "undefined") return null;

    const data = makeTrafficData(days);
    const context = canvas.getContext("2d");

    const gradient = context.createLinearGradient(0, 0, 0, 240);
    gradient.addColorStop(0, "rgba(128, 102, 236, 0.22)");
    gradient.addColorStop(1, "rgba(128, 102, 236, 0.01)");

    return new Chart(context, {
        type: "line",
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: "Views",
                    data: data.views,
                    borderColor: "#8066ec",
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.42,
                    borderWidth: 2.5,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "#8066ec"
                },
                {
                    label: "Visitors",
                    data: data.visitors,
                    borderColor: "#8ecaf4",
                    backgroundColor: "transparent",
                    fill: false,
                    tension: 0.42,
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 5
                }
            ]
        },
        options: getChartOptions()
    });
}

function createCategoryChart(canvasId, showLegend = false) {
    const canvas = $(`#${canvasId}`);

    if (!canvas || typeof Chart === "undefined") return null;

    const published = posts.filter((post) => post.status === "Published");
    const counts = categories.map((category) =>
        published.filter((post) => post.category === category.name).length
    );

    const empty = counts.every((count) => count === 0);
    const chartValues = empty ? categories.map(() => 1) : counts;

    return new Chart(canvas, {
        type: "doughnut",
        data: {
            labels: categories.map((category) => category.name),
            datasets: [{
                data: chartValues.length ? chartValues : [1],
                backgroundColor: categories.map((_, index) => COLORS[index % COLORS.length]),
                borderWidth: 3,
                borderColor: "#ffffff",
                hoverOffset: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "74%",
            plugins: {
                legend: { display: showLegend },
                tooltip: {
                    enabled: !empty,
                    callbacks: {
                        label: (context) => `${context.label}: ${context.raw} posts`
                    }
                }
            }
        }
    });
}

function renderCategoryLegend() {
    const published = posts.filter((post) => post.status === "Published");

    $("#categoryLegend").innerHTML = categories.map((category, index) => {
        const count = published.filter((post) => post.category === category.name).length;

        return `
            <div class="category-legend-item">
                <span class="legend-swatch" style="background:${COLORS[index % COLORS.length]}"></span>
                <span>${escapeHTML(category.name)}</span>
                <strong>${count}</strong>
            </div>`;
    }).join("");
}

function destroyChart(chart) {
    if (chart) chart.destroy();
}

function renderOverviewCharts() {
    if (typeof Chart === "undefined") {
        showToast("Charts require an internet connection to load Chart.js.", "error");
        return;
    }

    destroyChart(trafficChart);
    destroyChart(categoryChart);

    const days = $("#overviewPeriod").value;
    trafficChart = createTrafficChart("trafficChart", days);
    categoryChart = createCategoryChart("categoryChart");
    renderCategoryLegend();
}

function renderAnalyticsCharts() {
    if (typeof Chart === "undefined") return;

    destroyChart(analyticsTrafficChart);
    destroyChart(analyticsCategoryChart);

    analyticsTrafficChart = createTrafficChart("analyticsTrafficChart", $("#analyticsPeriod").value);
    analyticsCategoryChart = createCategoryChart("analyticsCategoryChart", true);
}

$("#overviewPeriod").addEventListener("change", renderOverviewCharts);
$("#analyticsPeriod").addEventListener("change", renderAnalyticsCharts);

function renderPopularPosts() {
    const published = posts
        .filter((post) => post.status === "Published")
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);

    $("#popularPosts").innerHTML = published.length
        ? published.map((post, index) => `
            <div class="popular-item">
                <div class="popular-rank">${index + 1}</div>
                <div class="popular-info">
                    <strong>${escapeHTML(post.title)}</strong>
                    <small>${escapeHTML(post.category)}</small>
                </div>
                <span class="popular-views">${formatNumber(post.views)}</span>
            </div>
        `).join("")
        : '<div class="empty-state">Publish an article to see it here.</div>';
}

$("#globalSearch").addEventListener("input", (event) => {
    const query = event.target.value.trim();

    if (!query) return;

    navigateTo("posts");
    $("#postSearch").value = query;
    renderAllPosts();
});

$("#globalSearch").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        navigateTo("posts");
        $("#postSearch").value = event.target.value.trim();
        renderAllPosts();
    }
});

function exportPosts() {
    const headings = ["Title", "Description", "Category", "Status", "Views", "Date"];

    const rows = posts.map((post) => [
        post.title,
        post.subtitle,
        post.category,
        post.status,
        post.views,
        post.date
    ]);

    const csvCell = (value) => {
        let text = String(value ?? "");

        if (/^[\s]*[=+\-@]/.test(text)) {
            text = "'" + text;
        }

        return `"${text.replace(/"/g, '""')}"`;
    };

    const csv = [headings, ...rows]
        .map((row) => row.map(csvCell).join(","))
        .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "SLBlog-posts.csv";
    link.click();

    URL.revokeObjectURL(url);
    showToast("Posts exported to CSV.");
}

$("#exportBtn").addEventListener("click", exportPosts);

$("#profileForm").addEventListener("submit", (event) => {
    event.preventDefault();

    profile.name = $("#adminName").value.trim();
    profile.email = $("#adminEmail").value.trim();
    profile.blogName = $("#blogName").value.trim();

    if (!profile.name || !profile.email || !profile.blogName) {
        showToast("Please complete all profile fields.", "error");
        return;
    }

    saveProfile();
    updateProfileDisplay();
    showToast("Profile settings saved.");
});

$("#compactSidebar").addEventListener("change", (event) => {
    document.body.classList.toggle("compact-sidebar", event.target.checked);

    try {
        localStorage.setItem("SLBlog_compact_sidebar", String(event.target.checked));
    } catch (error) {
    }
});

$("#notificationsEnabled").addEventListener("change", (event) => {
    try {
        localStorage.setItem("SLBlog_notifications_enabled", String(event.target.checked));
    } catch (error) {
    }

    showToast(event.target.checked
        ? " notifications enabled."
        : " notifications disabled.");
});

$("#notificationBtn").addEventListener("click", () => {
    if ($("#notificationsEnabled").checked) {
        const pending = comments.filter((comment) => comment.status === "Pending").length;
        showToast(pending
            ? `You have ${pending} comment(s) awaiting review.`
            : "You're all caught up!");
    } else {
        showToast(" notifications are disabled.");
    }
});

$("#profileMenu").addEventListener("click", () => navigateTo("settings"));
$("#topProfile").addEventListener("click", () => navigateTo("settings"));
$("#helpBtn").addEventListener("click", () => {
    showToast("Use the sidebar to explore your dashboard.");
});

$("#resetDataBtn").addEventListener("click", () => {
    if (!confirmAction("Restore the original sample posts, categories, and comments? Your current content will be replaced.")) {
        return;
    }

    posts = cloneData(DEFAULT_POSTS);
    categories = cloneData(DEFAULT_CATEGORIES);
    comments = cloneData(DEFAULT_COMMENTS);

    saveState();
    renderEverything();
    showToast("Sample data restored.");
});

function renderEverything() {
    renderStats();
    populateCategorySelects();
    renderRecentPosts();
    renderAllPosts();
    renderCategories();
    renderComments();
    renderPopularPosts();

    if (typeof Chart !== "undefined") {
        renderOverviewCharts();

        if ($("#page-analytics").classList.contains("active")) {
            renderAnalyticsCharts();
        }
    }
}

function initializePreferences() {
    try {
        document.body.classList.toggle(
            "compact-sidebar",
            localStorage.getItem("SLBlog_compact_sidebar") === "true"
        );

        const notifications = localStorage.getItem("SLBlog_notifications_enabled");

        if (notifications !== null) {
            $("#notificationsEnabled").checked = notifications === "true";
        }
    } catch (error) {
    }
}

function initializeDashboard() {
    $$(".currentYear").forEach((element) => {
        element.textContent = new Date().getFullYear();
    });

    updateProfileDisplay();
    initializePreferences();
    renderEverything();

    if (typeof Chart === "undefined") {
        console.warn("Chart.js is unavailable. Analytics charts cannot be rendered.");
    }
}

initializeDashboard();
