document.addEventListener("DOMContentLoaded", () => {

    const hamburgerMenu = document.querySelector(".hamburger-menu");
    const sidebar = document.querySelector(".sidebar");
    const body = document.body;

    if (hamburgerMenu && sidebar) {
        hamburgerMenu.addEventListener("click", () => {
            sidebar.classList.toggle("closed");
            body.classList.toggle("sidebar-closed");
        });
    }

    const categories = document.querySelectorAll(".category-pill");

    function updateSections(filter) {
        const allSections = document.querySelectorAll(".content");
        const searchInput = document.querySelector(".search-bar");
        if (searchInput) searchInput.value = "";

        allSections.forEach(section => {
            let targetId =
                filter === "all"
                    ? "home-section"
                    : `${filter.replace(/\s+/g, "-")}-section`;

            if (section.id === targetId) {
                section.style.display = "grid";
            } else {
                section.style.display = "none";
            }
        });
    }

    categories.forEach(category => {
        category.addEventListener("click", () => {
            document.querySelector(".category-pill.active")?.classList.remove("active");
            category.classList.add("active");
            const filter = category.textContent.trim().toLowerCase();
            updateSections(filter);
        });
    });

    const sidebarLinks = document.querySelectorAll(".sidebar-link");

    sidebarLinks.forEach(link => {
        link.addEventListener("click", () => {
            document.querySelector(".sidebar-link.active")?.classList.remove("active");
            link.classList.add("active");

            const text = link.querySelector("div")?.textContent.trim().toLowerCase();

            if (text === "home") {
                updateSections("all");

                const allBtn = [...categories].find(c => c.textContent.trim() === "All");

                document.querySelector(".category-pill.active")?.classList.remove("active");

                allBtn?.classList.add("active");

            } else {
                const sections = document.querySelectorAll(".content");
                sections.forEach(sec => sec.style.display = "none");

                const result = document.getElementById("search-results-section");

                result.style.display = "grid";

                result.innerHTML = `
        <div style="grid-column:1/-1;padding:60px;text-align:center;color:#606060;font-size:20px">
        <p>You clicked <b>${text}</b></p>
        <p style="font-size:14px;margin-top:10px">Section under construction</p>
        </div>
        `;
            }
        });
    });

    const searchInput = document.querySelector(".search-bar");
    const searchBtn = document.querySelector(".search-button");

    function handleSearch() {
        const query = searchInput.value.trim().toLowerCase();
        const result = document.getElementById("search-results-section");
        const allSections = document.querySelectorAll(".content");

        if (query === "") {
            const activeCategory = document.querySelector(".category-pill.active");
            const filter = activeCategory ? activeCategory.textContent.trim().toLowerCase() : "all";
            updateSections(filter);
            return;
        }

        result.innerHTML = "";

        allSections.forEach(sec => {
            if (sec.id !== "search-results-section") sec.style.display = "none";
        });

        result.style.display = "grid";

        const videos = document.querySelectorAll(".content:not(#search-results-section) .video");

        let found = false;

        videos.forEach(video => {
            const title = video.querySelector("h4")?.textContent.toLowerCase() || "";
            const channel = video.querySelector(".channel")?.textContent.toLowerCase() || "";

            if (title.includes(query) || channel.includes(query)) {
                result.appendChild(video.cloneNode(true));
                found = true;
            }
        });

        if (!found) {
            result.innerHTML = `
      <div style="grid-column:1/-1;padding:40px;text-align:center;color:#606060">
      No results found for "<b>${query}</b>"
      </div>
      `;
        }
    }

    searchBtn?.addEventListener("click", handleSearch);

    searchInput?.addEventListener("keypress", e => {
        if (e.key === "Enter") handleSearch();
    });

    searchInput?.addEventListener("input", () => {
        if (searchInput.value.trim() === "") handleSearch();
    });

    function attachVideoClickListeners() {
        const videos = document.querySelectorAll(".video");

        videos.forEach(video => {
            video.addEventListener("click", e => {
                e.preventDefault();

                const title = video.querySelector("h4")?.textContent || "Video";
                const channel = video.querySelector(".channel")?.textContent || "Channel";
                const thumb = video.querySelector(".thumb img")?.src || "";

                const main = document.querySelector("main");
                const original = main.innerHTML;

                main.innerHTML = `
        <div style="padding:24px;max-width:1000px;margin:auto">
        <div style="width:100%;aspect-ratio:16/9;background:black;border-radius:12px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden">
        <img src="${thumb}" style="width:100%;height:100%;object-fit:cover;opacity:.4">
        <div style="position:absolute;color:white;font-size:24px">▶ Playing ${title}</div>
        </div>
        <h2 style="margin-top:20px">${title}</h2>
        <p style="color:#606060">${channel}</p>
        <button id="back-btn" style="margin-top:20px;padding:10px 16px;border:none;border-radius:18px;background:#f2f2f2;cursor:pointer">
        ← Go Back
        </button>
        </div>
        `;

                document.getElementById("back-btn").addEventListener("click", () => {
                    main.innerHTML = original;
                    attachVideoClickListeners();

                    const activeCategory = document.querySelector(".category-pill.active");

                    const filter = activeCategory
                        ? activeCategory.textContent.trim().toLowerCase()
                        : "all";

                    updateSections(filter);
                });
            });
        });
    }

    attachVideoClickListeners();

    const themeToggleBtn = document.querySelector(".theme-toggle-button");
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            if (document.body.classList.contains("dark-mode")) {
                themeToggleBtn.textContent = "☀️";
            } else {
                themeToggleBtn.textContent = "🌙";
            }
        });
    }
});