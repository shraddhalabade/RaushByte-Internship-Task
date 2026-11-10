document.addEventListener("DOMContentLoaded", () => {
    const homePage = document.getElementById("homePage");
    const articlePage = document.getElementById("articlePage");
    const blogGrid = document.getElementById("blogGrid");
    let blogCards = Array.from(
    document.querySelectorAll(".blog-card")
);

    const categoryCards = document.querySelectorAll(".category-card");
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");
    const blogCount = document.getElementById("blogCount");
    const emptyState = document.getElementById("emptyState");
    const resetFilters = document.getElementById("resetFilters");
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const newsletterForm = document.getElementById("newsletterForm");
    const newsletterEmail = document.getElementById("newsletterEmail");
    const newsletterMessage = document.getElementById("newsletterMessage");
    const shareArticle = document.getElementById("shareArticle");
    const shareMessage = document.getElementById("shareMessage");
    const articleCategory = document.getElementById("articleCategory");
    const articleTitle = document.getElementById("articleTitle");
    const articleSubtitle = document.getElementById("articleSubtitle");
    const articleMeta = document.getElementById("articleMeta");
    const articleCover = document.getElementById("articleCover");
    const articleBody = document.getElementById("articleBody");
    const articleFooterTag = document.getElementById("articleFooterTag");
    const relatedGrid = document.getElementById("relatedGrid");
    const featuredSection = document.getElementById("featuredSection");
    let currentCategory = "All";
    let currentArticleId = "ai-future";
 
    const articles = {
        "ai-future": {
            title: "The Future of Artificial Intelligence",
            category: "Technology",
            date: "Nov 5, 2026",
            readTime: "6 min read",
            subtitle:
                "Explore how artificial intelligence is changing the way we work, learn, communicate, and solve real-world problems.",
            image:
                "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=85",
            alt: "Modern robotics and artificial intelligence",
            body: `
                <p>
                    Artificial intelligence is becoming an important part
                    of everyday life. From recommendation systems to
                    conversational assistants, AI is helping people solve
                    problems and work more efficiently.
                </p>
                <h2>Why AI matters</h2>
                <p>
                    AI systems can identify patterns, process large amounts
                    of information, and assist with tasks that previously
                    required considerable manual effort. These capabilities
                    are creating opportunities in education, healthcare,
                    software development, and many other fields.
                </p>
                <h2>Practical applications of AI</h2>
                <p>
                    Businesses use AI to analyse information, improve
                    customer experiences, and automate repetitive tasks.
                    Developers use AI tools to explore ideas, understand
                    code, and support their workflows.
                </p>
                <blockquote>
                    The most useful technology is the technology that
                    helps people solve meaningful problems.
                </blockquote>
                <h2>Challenges to consider</h2>
                <p>
                    AI also raises important questions about privacy,
                    accuracy, fairness, and responsible use. Human review
                    and careful evaluation remain essential when the
                    consequences of a decision matter.
                </p>
                <h2>Final thoughts</h2>
                <p>
                    Learning the fundamentals of AI can help us understand
                    its possibilities and limitations. Stay curious,
                    experiment with practical projects, and keep learning
                    as the technology evolves.
                </p>`},

        "vscode": {
            title:
                "Top 10 VS Code Extensions Every Developer Should Know",
            category: "Technology",
            date: "Nov 5, 2026",
            readTime: "5 min read",
            subtitle:
                "Discover useful development tools that can improve your coding workflow and productivity.",
            image:
                "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85",
            alt: "Laptop displaying source code",
            body: `
                <p>
                    Visual Studio Code is a popular code editor because it
                    combines a simple interface with a flexible extension
                    ecosystem. The right extensions can make everyday
                    development tasks easier.
                </p>
                <h2>1. Prettier — Code Formatter</h2>
                <p>
                    Prettier automatically formats supported files so that
                    your code follows consistent styling rules.
                </p>
                <h2>2. ESLint — Code Linter</h2>
                <p>
                    ESLint helps identify potential problems and enforce
                    coding conventions in JavaScript and related projects.
                </p>
                <h2>3. Live Server</h2>
                <p>
                    Live Server launches a local development server and
                    refreshes your browser when supported files change.
                </p>
                <h2>4. GitLens</h2>
                <p>
                    GitLens adds useful Git information to the editor,
                    helping developers understand file history and changes.
                </p>
                <h2>5. Continue and other AI coding assistants</h2>
                <p>
                    AI coding assistants can help explain code, suggest
                    implementations, and support debugging. Review their
                    output rather than accepting suggestions blindly.
                </p>
                <h2>Other useful extensions</h2>
                <p>
                    Depending on your project, consider extensions for
                    Python, Docker, REST API testing, CSS productivity,
                    and GitHub integration. Choose tools that genuinely
                    improve your workflow.
                </p>
                <h2>Final thoughts</h2>
                <p>
                    Start with a few extensions and learn how they help
                    before installing many more. A lightweight editor
                    configured for your needs can be more productive
                    than an overloaded one.
                </p>`},

        "travel": {
            title: "Best Travel Destinations for Nature Lovers",
            category: "Travel",
            date: "Nov 4, 2026",
            readTime: "6 min read",
            subtitle:
                "Discover beautiful landscapes and practical ideas for your next relaxing adventure.",
            image:
                "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85",
            alt: "Mountain peaks surrounded by nature",
            body: `
                <p>
                    Spending time in nature offers a chance to slow down,
                    explore new places, and experience landscapes beyond
                    the everyday routine.
                </p>
                <h2>Explore the mountains</h2>
                <p>
                    Mountain destinations offer scenic trails, fresh air,
                    peaceful viewpoints, and opportunities for photography.
                    Research the season and trail difficulty before leaving.
                </p>
                <h2>Discover forests and lakes</h2>
                <p>
                    Forest walks and lakeside stays can be ideal for a
                    quieter trip. Choose responsible accommodation and
                    follow local guidance to protect natural environments.
                </p>
                <h2>Plan a comfortable trip</h2>
                <p>
                    Check the weather, transport, local regulations, and
                    accommodation options in advance. Keep essential items
                    with you and leave room in your schedule for rest.
                </p>
                <blockquote>
                    Sometimes the best travel memories come from slowing
                    down and noticing the world around you.
                </blockquote>
                <h2>Travel responsibly</h2>
                <p>
                    Avoid littering, respect local communities, and follow
                    marked routes. Small decisions can help preserve the
                    destinations that make travel special.
                </p>
                <h2>Final thoughts</h2>
                <p>
                    The perfect nature trip does not have to be complicated.
                    Choose a destination that suits your interests, plan
                    thoughtfully, and enjoy the journey.
                </p>`},

        "habits": {
            title: "Simple Daily Habits for a Productive Life",
            category: "Lifestyle",
            date: "Nov 3, 2026",
            readTime: "4 min read",
            subtitle:
                "Build better routines, manage your time, and make room for meaningful progress.",
            image:
                "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
            alt: "Organised workspace",
            body: `
                <p>
                    Productivity is not about filling every minute with
                    work. It is about choosing meaningful priorities and
                    creating routines that make progress easier.
                </p>
                <h2>Start with a short daily plan</h2>
                <p>
                    Write down your most important tasks and choose one
                    priority to complete first. A simple plan can help
                    reduce distraction and make the day feel manageable.
                </p>
                <h2>Reduce distractions</h2>
                <p>
                    Put your phone aside during focused work and close
                    unnecessary tabs. Short, uninterrupted sessions can
                    make difficult tasks easier to approach.
                </p>
                <h2>Take breaks and protect your energy</h2>
                <p>
                    Regular breaks, adequate sleep, movement, and time
                    away from screens can help support a sustainable
                    routine.
                </p>
                <blockquote>
                    Consistency matters more than trying to change
                    everything in a single day.
                </blockquote>
                <h2>Final thoughts</h2>
                <p>
                    Choose one small habit, practise it regularly, and
                    adjust it to your needs. Sustainable progress starts
                    with realistic expectations.
                </p>`},

        "generative-ai": {
            title: "How Generative AI Is Changing the World",
            category: "Technology",
            date: "Nov 2, 2026",
            readTime: "7 min read",
            subtitle:
                "Understand generative AI and the new possibilities it creates across different industries.",
            image:
                "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=85",
            alt: "Artificial intelligence concept",
            body: `
                <p>
                    Generative AI describes systems that can create new
                    content, including text, images, audio, and code,
                    based on patterns learned during training.
                </p>
                <h2>How generative AI works</h2>
                <p>
                    These systems learn statistical patterns from training
                    data and use them to generate responses to prompts.
                    Different models are designed for different kinds
                    of content and tasks.
                </p>
                <h2>Applications across industries</h2>
                <p>
                    Generative AI can support writing, design, software
                    development, education, and research. Its usefulness
                    depends on the task, data quality, and human oversight.
                </p>
                <h2>Limitations and responsible use</h2>
                <p>
                    AI-generated output can be inaccurate, incomplete,
                    or biased. Important facts should be verified, and
                    sensitive information should be handled carefully.
                </p>
                <blockquote>
                    AI can support human creativity, but thoughtful
                    evaluation is still essential.
                </blockquote>
                <h2>Final thoughts</h2>
                <p>
                    Understanding both the strengths and limitations of
                    generative AI helps us use it more effectively and
                    responsibly.
                </p>`},
        "business": {
            title: "Smart Business Strategies for Beginners",
            category: "Business",
            date: "Nov 1, 2026",
            readTime: "5 min read",
            subtitle:
                "Learn practical ways to plan, understand customers, and grow a new business.",
            image:
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85",
            alt: "Business analytics dashboard",
            body: `
                <p>
                    Starting a business involves more than having a good
                    idea. Understanding customer needs, controlling costs,
                    and learning from feedback can help turn an idea into
                    a practical plan.
                </p>
                <h2>Understand your customers</h2>
                <p>
                    Identify the problem you want to solve and learn who
                    experiences it. Conversations, surveys, and competitor
                    research can help validate your assumptions.
                </p>
                <h2>Start with a focused plan</h2>
                <p>
                    Define your product, audience, costs, and priorities.
                    A small and realistic initial plan makes it easier
                    to test ideas before investing heavily.
                </p>
                <h2>Measure what matters</h2>
                <p>
                    Track relevant measures such as customer feedback,
                    expenses, sales, and repeat engagement. Use the
                    information to identify what needs improvement.
                </p>
                <h2>Keep learning</h2>
                <p>
                    Seek feedback, adjust your approach, and invest in
                    the areas that create real value for customers.
                </p>
                <h2>Final thoughts</h2>
                <p>
                    Sustainable growth usually comes from understanding
                    customers and making informed improvements over time.
                </p>`},

        "programming": {
            title: "How to Learn Programming Effectively",
            category: "Education",
            date: "Oct 30, 2026",
            readTime: "5 min read",
            subtitle:
                "Discover practical learning techniques, coding exercises, and project-based practice.",
            image:
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85",
            alt: "Laptop and study materials",
            body: `
                <p>
                    Learning programming becomes easier when you combine
                    basic concepts with regular practice. You do not need
                    to memorise everything before writing your first
                    useful program.
                </p>

                <h2>Learn the fundamentals</h2>
                <p>
                    Begin with variables, conditions, loops, functions,
                    data structures, and debugging. Understand how the
                    concepts work before moving to more complex topics.
                </p>
                <h2>Practise by writing code</h2>
                <p>
                    Solve small problems and gradually increase their
                    difficulty. When you encounter an error, read the
                    message, isolate the problem, and test a correction.
                </p>
                <h2>Build practical projects</h2>
                <p>
                    Create small applications such as a to-do list,
                    weather website, or personal blog. Projects help
                    connect concepts and provide work you can demonstrate.
                </p>
                <h2>Review your progress</h2>
                <p>
                    Read your previous code, improve its structure, and
                    explain how it works. Consistent revision helps
                    reinforce what you learn.
                </p>
                <h2>Final thoughts</h2>
                <p>
                    Focus on understanding and practical application.
                    Regular effort and curiosity will help you become
                    a more confident programmer.
                </p>`},

        "healthy-food": {
            title: "Healthy Eating Habits for Busy People",
            category: "Health",
            date: "Oct 28, 2026",
            readTime: "4 min read",
            subtitle:
                "Explore simple meal-planning ideas and balanced food choices for everyday life.",
            image:
                "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=85",
            alt: "A balanced meal with fresh food",
            body: `
                <p>
                    Busy schedules can make meal planning challenging,
                    but simple preparation and balanced choices can
                    make everyday eating more manageable.
                </p>
                <h2>Plan a few meals ahead</h2>
                <p>
                    Decide on a few meals before the week begins. Keeping
                    basic ingredients available can reduce last-minute
                    decisions and food waste.
                </p>
                <h2>Choose a variety of foods</h2>
                <p>
                    Include a variety of vegetables, fruits, whole grains,
                    protein sources, and other foods that fit your needs
                    and preferences.
                </p>
                <h2>Make convenience work for you</h2>
                <p>
                    Simple recipes, prepared ingredients, and practical
                    snacks can help you maintain a routine on busy days.
                </p>
                <h2>Final thoughts</h2>
                <p>
                    Small, realistic changes are easier to maintain than
                    complicated routines. Choose approaches that work
                    with your schedule and circumstances.
                </p>`},

        "morning": {
            title: "How to Build a Better Morning Routine",
            category: "Lifestyle",
            date: "Oct 26, 2026",
            readTime: "4 min read",
            subtitle:
                "Start your day with simple habits that support focus, energy, and consistency.",
            image:
                "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85",
            alt: "Coffee prepared for a calm morning",
            body: `
                <p>
                    A morning routine can help create a calm transition
                    into the day. It does not need to be complicated
                    or follow somebody else's schedule.
                </p>
                <h2>Prepare the night before</h2>
                <p>
                    Decide on your first priority and prepare the items
                    you need. This can reduce small decisions in the
                    morning.
                </p>
                <h2>Give yourself time</h2>
                <p>
                    Allow enough time for a comfortable start rather
                    than rushing through a long list of activities.
                </p>
                <h2>Choose habits you enjoy</h2>
                <p>
                    Reading, stretching, planning, or enjoying a quiet
                    breakfast may help you start the day in a way that
                    suits your preferences.
                </p>
                <h2>Stay flexible</h2>
                <p>
                    Some days will be different. A useful routine should
                    support your life rather than become another source
                    of pressure.
                </p>
                <h2>Final thoughts</h2>
                <p>
                    Start small, repeat what works, and adjust when
                    necessary. A good routine is one you can realistically
                    maintain.
                </p>`} };

    function addManagementButtons() {
        blogCards.forEach(card => {
            if (card.querySelector(".blog-management")) {
                return; }
            const articleLink = card.querySelector(".article-link");
            const articleId = articleLink?.dataset.article;
            if (!articleId) return;
            const management = document.createElement("div");
            management.className = "blog-management";

            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.className = "edit-blog-btn";
            editButton.textContent = "Edit";
            editButton.dataset.editBlog = articleId;

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "delete-blog-btn";
            deleteButton.textContent = "Delete";
            deleteButton.dataset.deleteBlog = articleId;

            management.append(editButton, deleteButton);
            card.querySelector(".blog-content").appendChild(management);
        });
    }

    addManagementButtons();
    // OPEN BLOG EDITOR
    const addBlogBtn = document.getElementById("addBlogBtn");
    const blogEditorSection = document.getElementById("blogEditorSection");
    const blogEditorForm = document.getElementById("blogEditorForm");
    const blogEditorTitle = document.getElementById("blogEditorTitle");
    const editBlogId = document.getElementById("editBlogId");
    const blogTitleInput = document.getElementById("blogTitleInput");
    const blogCategoryInput = document.getElementById("blogCategoryInput");
    const blogImageInput = document.getElementById("blogImageInput");
    const blogSubtitleInput = document.getElementById("blogSubtitleInput");
    const blogBodyInput = document.getElementById("blogBodyInput");
    const cancelBlogBtn = document.getElementById("cancelBlogBtn");

    // empty form for a new blog
    addBlogBtn.addEventListener("click", () => {
        blogEditorForm.reset();
        editBlogId.value = "";
        blogEditorTitle.textContent = "Add New Blog";

        blogEditorSection.hidden = false;
        blogEditorSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });});

    document.addEventListener("click", event => {
        const editButton = event.target.closest(".edit-blog-btn");

        if (!editButton) return;
        const id = editButton.dataset.editBlog;
        const article = articles[id];

        if (!article) return;

        editBlogId.value = id;
        blogTitleInput.value = article.title;
        blogCategoryInput.value = article.category;
        blogImageInput.value = article.image;
        blogSubtitleInput.value = article.subtitle;

        const temp = document.createElement("div");
        temp.innerHTML = article.body;
        blogBodyInput.value = temp.innerText;

        blogEditorTitle.textContent = "Edit Blog";

        blogEditorSection.hidden = false;
        blogEditorSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

    cancelBlogBtn.addEventListener("click", () => {
        blogEditorSection.hidden = true;
        blogEditorForm.reset();
        editBlogId.value = "";
    });


    let blogCardIds = blogCards
        .map(card => card.querySelector(".article-link")?.dataset.article)
        .filter(id => id && articles[id]);

    try {
        const savedData = JSON.parse(
            localStorage.getItem("SLBlogData")
        );

        if (savedData?.articles && Array.isArray(savedData.cardIds)) {
            Object.keys(articles).forEach(id => delete articles[id]);
            Object.assign(articles, savedData.articles);

            blogCardIds = savedData.cardIds.filter(id => articles[id]);
        }
    } catch (error) {
        console.error("Could not load saved blogs:", error);
    }

    function saveBlogs() {
        localStorage.setItem(
            "SLBlogData",
            JSON.stringify({
                articles,
                cardIds: blogCardIds
            })
        );
    }

    function escapeBlogText(value) {
        const element = document.createElement("div");
        element.textContent = value;
        return element.innerHTML;
    }

    function renderBlogCards() {
        blogGrid.innerHTML = "";

        blogCardIds.forEach(id => {
            const article = articles[id];
            if (!article) return;

            const card = document.createElement("article");
            card.className = "blog-card";
            card.dataset.category = article.category;
            card.dataset.title = article.title.toLowerCase();

            card.innerHTML = `
                <a href="#article" class="blog-image article-link"
                   data-article="${escapeBlogText(id)}">
                    <img src="${escapeBlogText(article.image)}"
                         alt="${escapeBlogText(article.alt || article.title)}"
                         loading="lazy">
                    <span class="tag image-tag">
                        ${escapeBlogText(article.category)}
                    </span>
                </a>

                <div class="blog-content">
                    <div class="article-meta">
                        <span>${escapeBlogText(article.date || "Recently published")}</span>
                        <span>${escapeBlogText(article.readTime || "1 min read")}</span>
                    </div>

                    <h3>
                        <a href="#article" class="article-link"
                           data-article="${escapeBlogText(id)}">
                            ${escapeBlogText(article.title)}
                        </a>
                    </h3>

                    <p>${escapeBlogText(article.subtitle)}</p>

                    <a href="#article" class="read-more article-link"
                       data-article="${escapeBlogText(id)}">
                        Read Article <span>→</span>
                    </a>
                </div>
            `;

            blogGrid.appendChild(card);
        });

        blogCards = Array.from(blogGrid.querySelectorAll(".blog-card"));
        addManagementButtons();
        filterBlogs();
    }

    blogEditorForm.addEventListener("submit", event => {
        event.preventDefault();

        const title = blogTitleInput.value.trim();
        const category = blogCategoryInput.value;
        const image = blogImageInput.value.trim();
        const subtitle = blogSubtitleInput.value.trim();
        const bodyText = blogBodyInput.value.trim();

        if (!title || !category || !image || !subtitle || !bodyText) {
            alert("Please fill in all blog fields.");
            return;
        }

        const existingId = editBlogId.value;
        const id = existingId ||
            "blog-" + Date.now().toString(36);

        const oldArticle = articles[id];
        const date = oldArticle?.date ||
            new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
            });

        const wordCount = bodyText.split(/\s+/).filter(Boolean).length;
        const readTime = Math.max(1, Math.ceil(wordCount / 200)) + " min read";

        const body = bodyText
            .split(/\n+/)
            .map(line => line.trim())
            .filter(Boolean)
            .map(line => `<p>${escapeBlogText(line)}</p>`)
            .join("\n");

        articles[id] = {
            title,
            category,
            date,
            readTime,
            subtitle,
            image,
            alt: title,
            body
        };

        if (!existingId) {
            blogCardIds.unshift(id);
        }

        try {
            saveBlogs();
        } catch (error) {
            alert("Could not save blogs in this browser. Storage may be full or unavailable.");
            console.error(error);
            return;
        }

        renderBlogCards();
        blogEditorSection.hidden = true;
        blogEditorForm.reset();
        editBlogId.value = "";

        document.getElementById("blogs").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        alert(existingId ? "Blog updated successfully!" : "Blog added successfully!");
    });
    document.addEventListener("click", event => {
        const deleteButton = event.target.closest(".delete-blog-btn");
        if (!deleteButton) return;

        const id = deleteButton.dataset.deleteBlog;
        const article = articles[id];

        if (!article) return;

        const confirmed = confirm(
            `Are you sure you want to delete "${article.title}"?`
        );

        if (!confirmed) return;

        const previousArticle = articles[id];
        const previousIds = [...blogCardIds];

        delete articles[id];
        blogCardIds = blogCardIds.filter(blogId => blogId !== id);

        try {
            saveBlogs();
        } catch (error) {
            articles[id] = previousArticle;
            blogCardIds = previousIds;
            alert("Could not save this deletion. Please try again.");
            console.error(error);
            return;
        }

        if (currentArticleId === id) {
            showHomePage();
        }

        renderBlogCards();
        alert("Blog deleted successfully!");
    });

    renderBlogCards();

    // UPDATE BLOG COUNT

    function updateBlogCount(count) {
        blogCount.textContent = count;

        const visibleText = count === 1 ? "article" : "articles";

        const countContainer = blogCount.parentElement;

        if (countContainer) {
            countContainer.setAttribute(
                "aria-label",
                `${count} ${visibleText} displayed`
            );
        }
    }

    // SEARCH AND CATEGORY FILTERING

    function filterBlogs() {

        const searchTerm = searchInput.value
            .trim()
            .toLowerCase();

        let visibleCount = 0;

        blogCards.forEach(card => {

            const category = card.dataset.category;
            const title = card.dataset.title || "";
            const description =
                card.querySelector(".blog-content p")?.textContent || "";

            const categoryMatch =
                currentCategory === "All" ||
                category === currentCategory;

            const searchableText =
                `${title} ${category} ${description}`.toLowerCase();

            const searchMatch =
                searchableText.includes(searchTerm);

            const shouldShow = categoryMatch && searchMatch;

            card.hidden = !shouldShow;

            if (shouldShow) {
                visibleCount++;
            }

        });

        updateBlogCount(visibleCount);

        emptyState.hidden = visibleCount !== 0;
        blogGrid.hidden = visibleCount === 0;

        loadMoreBtn.hidden = visibleCount === 0;

    }

    categoryCards.forEach(button => {

        button.addEventListener("click", () => {

            currentCategory = button.dataset.category;

            categoryCards.forEach(categoryButton => {
                categoryButton.classList.toggle(
                    "active",
                    categoryButton === button
                );
            });

            filterBlogs();

            closeMobileMenu();
            document.getElementById("blogs").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });

    searchInput.addEventListener("input", () => {
        filterBlogs();
    });
    searchForm.addEventListener("submit", event => {

        event.preventDefault();

        filterBlogs();

        document.getElementById("blogs").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });
    function resetAllFilters() {

        currentCategory = "All";
        searchInput.value = "";

        categoryCards.forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.category === "All"
            );
        });

        filterBlogs();

    }

    resetFilters.addEventListener("click", () => {

        resetAllFilters();

        document.getElementById("blogs").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

    loadMoreBtn.addEventListener("click", () => {

        loadMoreBtn.textContent = "All Articles Displayed ✓";
        loadMoreBtn.disabled = true;

    });
    // MOBILE NAVIGATION

    function closeMobileMenu() {

        navLinks.classList.remove("open");

        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.textContent = "☰";

    }

    menuToggle.addEventListener("click", () => {

        const isOpen = navLinks.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));

        menuToggle.textContent = isOpen ? "✕" : "☰";

    });


    navLinks.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {
            closeMobileMenu();
        });

    });
    // ARTICLE

    function openArticle(articleId) {

        const article = articles[articleId];

        if (!article) {
            return;
        }

        currentArticleId = articleId;

        articleCategory.textContent = article.category;
        articleTitle.textContent = article.title;
        articleSubtitle.textContent = article.subtitle;

        articleMeta.textContent =
            `${article.date} · ${article.readTime}`;

        articleCover.src = article.image;
        articleCover.alt = article.alt;

        articleBody.innerHTML = article.body;
        articleFooterTag.textContent = article.category;
        document.title = `${article.title} | SLBlog`;
        renderRelatedArticles(articleId);
        homePage.hidden = true;
        articlePage.hidden = false;
        window.scrollTo({
            top: 0,
            behavior: "auto"
        });

        closeMobileMenu();

    }

    // RELATED ARTICLES

    function renderRelatedArticles(currentId) {

        relatedGrid.innerHTML = "";

        const current = articles[currentId];

        const relatedArticles = Object.entries(articles)
            .filter(([id, article]) => {
                return (
                    id !== currentId &&
                    article.category === current.category
                );
            })
            .slice(0, 2);
        if (relatedArticles.length < 2) {

            const additionalArticles = Object.entries(articles)
                .filter(([id]) => {
                    return (
                        id !== currentId &&
                        !relatedArticles.some(([relatedId]) => {
                            return relatedId === id;
                        })
                    );
                });

            relatedArticles.push(
                ...additionalArticles.slice(
                    0,
                    2 - relatedArticles.length
                )
            );

        }

        relatedArticles.forEach(([id, article]) => {

            const card = document.createElement("article");

            card.className = "related-card";

            const image = document.createElement("img");
            image.src = article.image;
            image.alt = article.alt;
            image.loading = "lazy";

            const content = document.createElement("div");
            content.className = "related-card-content";

            const tag = document.createElement("span");
            tag.className = "tag";
            tag.textContent = article.category;

            const heading = document.createElement("h3");
            const link = document.createElement("a");

            link.href = "#article";
            link.textContent = article.title;

            link.addEventListener("click", event => {

                event.preventDefault();

                openArticle(id);

                history.replaceState(
                    { page: "article", articleId: id },
                    "",
                    "#article"
                );

            });

            heading.appendChild(link);

            content.append(tag, heading);
            card.append(image, content);

            relatedGrid.appendChild(card);

        });

    }

    // ARTICLE CLICK HANDLERS

    document.addEventListener("click", event => {
        const articleLink = event.target.closest(".article-link");
        if (!articleLink) {
            return;
        }

        event.preventDefault();

        const articleId = articleLink.dataset.article;

        if (articleId && articles[articleId]) {

            openArticle(articleId);

            history.pushState(
                { page: "article", articleId },
                "",
                "#article"
            );

        }

    });
    document.getElementById("backToBlogs").addEventListener(
        "click",
        event => {
            event.preventDefault();
            showHomePage();
            history.pushState(
                { page: "home" },
                "",
                window.location.pathname + window.location.search
            );

        }
    );

    function showHomePage() {
        articlePage.hidden = true;
        homePage.hidden = false;
        document.title = "SLBlog | Read. Learn. Grow.";
        window.scrollTo({
            top: 0,
            behavior: "auto"
        });

        closeMobileMenu();
    }

    window.addEventListener("popstate", event => {

        const state = event.state;

        if (state?.page === "article" && articles[state.articleId]) {

            openArticle(state.articleId);

        } else if (window.location.hash === "#article") {

            openArticle(currentArticleId);

        } else {

            showHomePage();

        }

    });
    // NAVIGATION TO HOMEPAGE

    function goHome(event) {

        event.preventDefault();

        showHomePage();

        resetAllFilters();

        history.pushState(
            { page: "home" },
            "",
            window.location.pathname + window.location.search
        );

    }

    document.getElementById("homeLogo").addEventListener(
        "click",
        goHome
    );

    document.getElementById("footerLogo").addEventListener(
        "click",
        goHome
    );

    document.getElementById("homeLink").addEventListener(
        "click",
        goHome
    );
    // Footer 
    document.querySelectorAll("[data-footer-category]").forEach(link => {

        link.addEventListener("click", event => {

            event.preventDefault();

            const selectedCategory = link.dataset.footerCategory;

            const matchingButton = Array.from(categoryCards).find(
                button => button.dataset.category === selectedCategory
            );

            showHomePage();

            if (matchingButton) {
                matchingButton.click();
            }

        });

    });



    newsletterForm.addEventListener("submit", event => {

        event.preventDefault();

        const email = newsletterEmail.value.trim();

        newsletterMessage.className = "form-message";

        if (!email || !newsletterEmail.checkValidity()) {

            newsletterMessage.textContent =
                "Please enter a valid email address.";

            newsletterMessage.classList.add("error");

            newsletterEmail.focus();

            return;

        }

        /*
         * Frontend demo only:
         * No email is sent or stored.
         * A backend or newsletter service is required
         * for real subscriptions.
         */

        newsletterMessage.textContent =
            "Thanks for your interest! This demo does not yet save subscriptions.";

        newsletterMessage.classList.add("success");

        newsletterForm.reset();

    });



    shareArticle.addEventListener("click", async () => {

        const article = articles[currentArticleId];

        if (!article) {
            return;
        }

        const shareData = {
            title: article.title,
            text: article.subtitle,
            url: window.location.href
        };

        shareMessage.className = "form-message";
        shareMessage.textContent = "";

        try {

            if (navigator.share) {

                await navigator.share(shareData);

                shareMessage.textContent = "Article shared.";
                shareMessage.classList.add("success");

            } else if (navigator.clipboard?.writeText) {

                await navigator.clipboard.writeText(
                    `${article.title}\n${window.location.href}`
                );

                shareMessage.textContent =
                    "Article link copied to clipboard.";

                shareMessage.classList.add("success");

            } else {

                shareMessage.textContent =
                    "Copy the article URL from your browser's address bar.";

            }

        } catch (error) {

            if (error.name !== "AbortError") {

                shareMessage.textContent =
                    "Sharing is unavailable. Copy the article URL manually.";

                shareMessage.classList.add("error");

            }

        }

    });

    document.getElementById("currentYear").textContent =
        new Date().getFullYear();

    if (window.location.hash === "#article") {

        openArticle(currentArticleId);

    } else {

        homePage.hidden = false;
        articlePage.hidden = true;

    }
    resetAllFilters();
});

const discoverStoriesBtn = document.getElementById("discoverStoriesBtn");
const aboutDetailsSection = document.getElementById("about-details");

if (discoverStoriesBtn && aboutDetailsSection) {
    discoverStoriesBtn.addEventListener("click", function (event) {
        event.preventDefault();

        aboutDetailsSection.classList.add("show-about");

        aboutDetailsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
}
const contactNavLink = document.querySelector('.nav-links a[href="#contact"]');
const contactFooter = document.getElementById("contact");

if (contactNavLink && contactFooter) {
    contactNavLink.addEventListener("click", function (event) {
        event.preventDefault();

        contactFooter.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
}
