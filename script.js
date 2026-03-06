let notes = JSON.parse(localStorage.getItem("notes")) || [];

let userProfile = JSON.parse(localStorage.getItem("userProfile")) || {
    name: "Akshita Anand",
    desc: "Computer Science Student"
};

let notificationHistory = [];

window.onload = function () {
    refreshAll();
    loadProfileData();

    console.log(JSON.parse(localStorage.getItem("notes"))); // Debug

    if (localStorage.getItem("loggedIn") !== "true") {
        document.getElementById("loginModal").style.display = "flex";
    }

    showPage("home"); // ensures Trending Notes are visible
};



function handleAuth() {
    const user = document.getElementById("loginUser").value;
    const pass = document.getElementById("loginPass").value;

    if (user && pass) {
        localStorage.setItem("loggedIn", "true");
        document.getElementById("loginModal").style.display = "none";
        document.getElementById("authBtn").innerText = "Logout";
        showNotify("Welcome back! 👋");
        refreshAll();
    } else {
        alert("Please enter credentials");
    }
}


function showPage(pageId) {
    const isLoggedIn = localStorage.getItem("loggedIn");

    if (!isLoggedIn && (pageId === "upload" || pageId === "profile" || pageId === "chat")) {
        openLoginModal();
        return;
    }

    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");

    // Always refresh notes when switching pages
    refreshAll();
}

function toggleDarkMode() {
    document.body.classList.toggle("dark");
    document.getElementById("themeToggle").innerText =
        document.body.classList.contains("dark") ? "🌙" : "🌑";
}

function openLoginModal() {
    document.getElementById("loginModal").style.display = "flex";
}

function closeLoginModal() {
    document.getElementById("loginModal").style.display = "none";
}

function handleUpload() {
    const title = document.getElementById("uploadTitle").value;
    const subj = document.getElementById("uploadSubject").value;
    const file = document.getElementById("uploadFile").files[0];

    if (!title || !file) return alert("Fill all fields!");

    const reader = new FileReader();

  reader.onload = function (e) {
    notes.push({
        id: Date.now(),
        title,
        subject: subj,
        fileData: e.target.result,
        fileName: file.name,
        likes: 0,
        dislikes: 0
    });

    localStorage.setItem("notes", JSON.stringify(notes));

    console.log(JSON.parse(localStorage.getItem("notes"))); // Debug: check notes after upload

    alert("Uploaded!");
    showPage("home");
};

    reader.readAsDataURL(file);
}

function refreshAll() {
    renderNotes(notes, "trending", false);
    renderNotes(notes.filter(n => n.isSaved), "savedNotes", false);
    renderNotes(notes, "myUploads", true);
}

function renderNotes(data, containerId, canDelete) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = data.map(n => `
        <div class="card">
            <span style="color:#6a5cff;font-weight:bold;font-size:0.7rem;">
                ${n.subject || "General"}
            </span>

            <h3>${n.title}</h3>
            ${n.description ? `<p style="color:#555;font-size:0.85rem;">${n.description}</p>` : ""}
            ${n.uploader ? `<p style="font-size:0.75rem;color:#888;">Uploaded by: ${n.uploader}</p>` : ""}

            <div style="margin:10px 0;display:flex;gap:5px;">
                <button class="action-btn" onclick="viewNote(${n.id})">👁️ View</button>
                <button class="action-btn" onclick="downloadNote(${n.id})">⬇️ Download</button>
                <button class="action-btn" onclick="handleAction(${n.id},'save')"  
                    style="color:${n.isSaved ? "#6a5cff" : "#ccc"}">🔖</button>
            </div>

            <div class="note-actions">
                <button class="action-btn" onclick="handleAction(${n.id},'like')">🔥 ${n.likes || 0}</button>
                <button class="action-btn" onclick="handleAction(${n.id},'dislike')">👎 ${n.dislikes || 0}</button>
                <button class="action-btn" onclick="handleAction(${n.id},'comment')">💬</button>
            </div>

            ${n.comments && n.comments.length > 0 ? `
                <div class="comment-box">
                    ${n.comments.map(c => `<div class="comment-item">${c}</div>`).join("")}
                </div>
            ` : ""}

            ${canDelete ? `<button class="btn-delete" onclick="deleteNote(${n.id})">Delete</button>` : ""}
        </div>
    `).join("");
}

function viewNote(id) {

    const note = notes.find(n => n.id === id);

    if (!note || !note.fileData) {
        alert("No file found.");
        return;
    }

    const win = window.open();

    win.document.write(`
        <iframe src="${note.fileData}" 
        style="width:100%;height:100%;border:none;"></iframe>
    `);
}

function downloadNote(id) {

    const note = notes.find(n => n.id === id);
    if (!note || !note.fileData) return alert("No file found.");

    const a = document.createElement("a");
    a.href = note.fileData;
    a.download = note.fileName || "downloaded_note";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function searchNotes() {

    const query = document.getElementById("searchInput").value.toLowerCase();

    const filtered = notes.filter(n =>
        n.title.toLowerCase().includes(query) ||
        n.subject.toLowerCase().includes(query)
    );

    renderNotes(filtered, "trending");
}

function deleteNote(id) {

    if (confirm("Are you sure you want to delete this note?")) {

        notes = notes.filter(n => n.id !== id);

        localStorage.setItem("notes", JSON.stringify(notes));

        showNotify("Note Deleted");

        refreshAll();
    }
}

function showNotify(text) {
    const box = document.getElementById("notification");
    if (!box) {
        console.error("Notification element not found!");
        return;
    }
    
    // Set text and make it visible
    box.innerText = text;
    box.style.display = "block";
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        box.style.display = "none";
    }, 3000);
}

function handleAction(id, type) {

    const note = notes.find(n => n.id === id);
if (!note) return;

    let actionMessage = "Action performed";

    if (type === "like") {
        note.likes = (note.likes || 0) + 1;
        actionMessage = "Liked! 🔥";
    }

    else if (type === "dislike") {
        note.dislikes = (note.dislikes || 0) + 1;
        actionMessage = "Disliked 👎";
    }

    else if (type === "save") {
        note.isSaved = !note.isSaved;
        actionMessage = note.isSaved ? "Saved to Library 🔖" : "Removed from Library";
    }

    else if (type === "comment") {

        let msg = prompt("Write your comment:");

        if (msg && msg.trim() !== "") {

            if (!note.comments) note.comments = [];

            note.comments.push(msg);

            actionMessage = "Commented! 💬";
        } else {
            return;
        }
    }

    localStorage.setItem("notes", JSON.stringify(notes));

    showNotify(actionMessage);

    refreshAll();
}

function loadProfileData() {

    const profile = JSON.parse(localStorage.getItem("userProfile")) || userProfile;

    document.getElementById("display-name").innerText = profile.name;
    document.getElementById("display-desc").innerText = profile.desc;

    if (profile.profilePic) {
        document.getElementById("profilePic").src = profile.profilePic;
    }
}
