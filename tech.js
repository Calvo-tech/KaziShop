// Load job listings
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("jobList")) {
    loadJobs();
  } else if (document.getElementById("jobDetail")) {
    loadJobDetail();
  }
});

// Fetch jobs from localStorage
function getJobs() {
  return JSON.parse(localStorage.getItem("jobs")) || [];
}

// ================= JOB LIST PAGE =================
function loadJobs() {
  const container = document.getElementById("jobList");
  const jobs = getJobs();

  if (jobs.length === 0) {
    container.innerHTML = "<p>No jobs available at the moment.</p>";
    return;
  }

  // Sort newest first
  const sortedJobs = jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  container.innerHTML = sortedJobs
    .map((job, index) => {
      return `
        <div class="job-card">
          <h3>${job.title}</h3>
          <p><strong>${job.company}</strong> — ${job.category}</p>
          <p>${job.shortDesc}</p>
          <p><strong>Deadline:</strong> ${job.deadline}</p>
          <button onclick="viewDetails('${job.id}')" class="view-btn">View Details</button>

        </div>
      `;
    })
    .join("");
}

// Go to job details page

function viewDetails(id) {
  localStorage.setItem("selectedJobId", id);
  window.location.href = "job-details.html";
}


// ================= JOB DETAILS PAGE =================
function loadJobDetail() {
  const jobs = getJobs();
  const jobId = localStorage.getItem("selectedJobId");
const job = jobs.find(j => j.id === jobId);

if (!job) {
  document.getElementById("jobDetail").innerHTML = "<p>Job not found.</p>";
  return;
}

  const today = new Date().toISOString().split("T")[0];
  const isExpired = job.deadline < today;

  document.getElementById("jobDetail").innerHTML = `
    <div class="job-detail-card">
      <h2>${job.title}</h2>
      <p><strong>${job.company}</strong> — ${job.category}</p>
      <p><strong>Deadline:</strong> ${job.deadline} ${isExpired ? "(Expired)" : ""}</p>
      <hr>
      <div class="full-description">${job.description}</div>
      <br>
      <a href="${job.applyLink}" target="_blank" class="apply-btn">Apply Now</a>
    </div>
  `;
}
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("form-status");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      status.textContent = "Sending message...";
      const formData = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: formData,
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          status.textContent = "✅ Message sent successfully!";
          form.reset();
        } else {
          status.textContent = "❌ Failed to send message. Please try again.";
        }
      } catch (error) {
        status.textContent = "⚠️ Network error. Please try again later.";
      }
    });
  }
});
// WhatsApp popup toggle and message sending
document.addEventListener("DOMContentLoaded", function () {
  const openChat = document.getElementById("openChat");
  const chatPopup = document.getElementById("chatPopup");
  const closeChat = document.getElementById("closeChat");
  const sendWhatsapp = document.getElementById("sendWhatsapp");
  const chatBody = document.getElementById("chatBody");

  if (!openChat || !chatPopup || !closeChat || !chatBody) return;

  // Open chat with typing animation
  openChat.addEventListener("click", function () {
    chatPopup.style.display = "flex";
    chatBody.innerHTML = ""; // clear old messages

    // Simulate typing
    const typingDiv = document.createElement("p");
    typingDiv.classList.add("bot-msg", "typing");
    typingDiv.textContent = "KaziShop Support is typing...";
    chatBody.appendChild(typingDiv);

    // After 1.5s, show first message
    setTimeout(() => {
      chatBody.removeChild(typingDiv);
      const msg1 = document.createElement("p");
      msg1.classList.add("bot-msg");
      msg1.textContent = "👋 Hello there! Welcome to KaziShop Support.";
      chatBody.appendChild(msg1);
      scrollToBottom();

      // After 1s, show second message
      setTimeout(() => {
        const msg2 = document.createElement("p");
        msg2.classList.add("bot-msg");
        msg2.textContent = "💬 How can we help you today?";
        chatBody.appendChild(msg2);
        scrollToBottom();
      }, 1000);
    }, 1500);
  });

  // Close chat
  closeChat.addEventListener("click", function () {
    chatPopup.style.display = "none";
  });

  // Send message to WhatsApp
  sendWhatsapp.addEventListener("click", function () {
    const msgInput = document.getElementById("whatsappMessage");
    const message =
      msgInput.value.trim() ||
      "Hello! I’d like to inquire about KaziShop services.";
    const phoneNumber = "+254795828952"; // <-- replace with your number
    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMsg}`, "_blank");
    msgInput.value = "";
  });

  function scrollToBottom() {
    chatBody.scrollTop = chatBody.scrollHeight;
  }
});
