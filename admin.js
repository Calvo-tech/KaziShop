// ✅ Initialize Quill editor
let quill;
document.addEventListener("DOMContentLoaded", function () {
  quill = new Quill("#editor", {
    theme: "snow",
    placeholder: "Write job details, add links, bullet points, etc...",
    modules: {
      toolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
      ],
    },
  });
  renderJobs();
});

let editIndex = null;

// =================== STORAGE ===================
function getJobs() {
  return JSON.parse(localStorage.getItem("jobs")) || [];
}

function saveJobs(jobs) {
  localStorage.setItem("jobs", JSON.stringify(jobs));
}

// =================== RENDER JOBS ===================
function renderJobs() {
  const container = document.getElementById("adminJobList");
  const jobs = getJobs();

  if (jobs.length === 0) {
    container.innerHTML = "<p>No jobs added yet.</p>";
    return;
  }

  const sortedJobs = jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  container.innerHTML = sortedJobs
    .map((job, i) => {
      const today = new Date().toISOString().split("T")[0];
      const isExpired = job.deadline < today;
      const statusClass = isExpired ? "expired" : "active";
      const statusTag = isExpired
        ? `<span class="status-tag expired-tag">Expired</span>`
        : `<span class="status-tag active-tag">Active</span>`;

      return `
        <div class="job-card ${statusClass}">
          <h3>${job.title}</h3>
          <p><strong>${job.company}</strong> — ${job.category}</p>
          <p>${job.shortDesc}</p>
          <p><strong>Deadline:</strong> ${job.deadline} ${statusTag}</p>
          <div class="job-actions">
            <button class="edit-btn" onclick="editJob(${i})">Edit</button>
            <button class="delete-btn" onclick="deleteJob(${i})">Delete</button>
          </div>
        </div>`;
    })
    .join("");
}

// =================== ADD / EDIT JOB ===================
document.getElementById("jobForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("jobTitle").value.trim();
  const company = document.getElementById("companyName").value.trim();
  const category = document.getElementById("jobCategory").value;
  const shortDesc = document.getElementById("shortDesc").value.trim();
  const description = quill.root.innerHTML.trim();
  const applyLink = document.getElementById("applyLink").value.trim();
  const deadline = document.getElementById("deadline").value;

  if (!title || !company || !category || !shortDesc || !description || !deadline) {
    alert("⚠️ Please fill in all required fields.");
    return;
  }

  let jobs = getJobs();

  const job = {
    id: editIndex !== null ? jobs[editIndex].id : Date.now().toString(),
    title,
    company,
    category,
    shortDesc,
    description,
    applyLink,
    deadline,
    createdAt: new Date().toISOString(),
  };

  if (editIndex !== null) {
    jobs[editIndex] = job;
    alert("✅ Job updated successfully!");
    editIndex = null;
    document.getElementById("submitBtn").textContent = "Add Job";
  } else {
    jobs.push(job);
    alert("✅ Job added successfully!");
  }

  saveJobs(jobs);
  this.reset();
  quill.root.innerHTML = "";
  renderJobs();
});

// =================== EDIT JOB ===================
function editJob(index) {
  const jobs = getJobs();
  const job = jobs[index];

  document.getElementById("jobTitle").value = job.title;
  document.getElementById("companyName").value = job.company;
  document.getElementById("jobCategory").value = job.category;
  document.getElementById("shortDesc").value = job.shortDesc;
  document.getElementById("deadline").value = job.deadline;
  document.getElementById("applyLink").value = job.applyLink;

  quill.root.innerHTML = job.description;

  editIndex = index;
  document.getElementById("submitBtn").textContent = "Update Job";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// =================== DELETE JOB ===================
function deleteJob(index) {
  const jobs = getJobs();
  if (confirm("Delete this job permanently?")) {
    jobs.splice(index, 1);
    saveJobs(jobs);
    renderJobs();
  }
}
