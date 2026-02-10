// Contact Management Module - Matches Banner Management style

// ===== CONFIG =====
const CONFIG = {
  colors: {
    primary: "#211832",
    accent: "#412B6B",
    success: "#10b981",
    danger: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
  },
  enquiryTypes: [
    {
      value: "general",
      label: "General Contact",
      class: "contact-type general",
    },
    {
      value: "project",
      label: "Project Enquiry",
      class: "contact-type project",
    },
    {
      value: "service",
      label: "Service Enquiry",
      class: "contact-type service",
    },
    {
      value: "registration",
      label: "Registration",
      class: "contact-type registration",
    },
    { value: "career", label: "Career Enquiry", class: "contact-type career" },
  ],
  sources: [
    "Website Contact Form",
    "Project Page",
    "Service Page",
    "Registration Page",
  ],
};

// ===== CONTACT MANAGER =====
class ContactManager {
  constructor() {
    this.contacts = this.loadFromStorage();
    this.currentContactId = null;
    this.currentFilter = null;
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem("constructpro_contacts");
      return saved ? JSON.parse(saved) : this.getSampleContacts();
    } catch (err) {
      console.error("Error loading contacts:", err);
      return this.getSampleContacts();
    }
  }

  saveToStorage() {
    localStorage.setItem(
      "constructpro_contacts",
      JSON.stringify(this.contacts),
    );
  }

  getSampleContacts() {
    return [
      {
        id: 1,
        enquiryId: "ENQ-0001",
        fullName: "Rahul Sharma",
        email: "rahul.sharma@email.com",
        mobile: "+91 98765 43210",
        enquiryType: "project",
        enquirySource: "Project Page",
        message:
          "Interested in your residential project in Pune. Can you share estimated cost and timeline?",
        submissionDate: "2025-02-10T14:30:00",
        ipAddress: "122.167.45.89",
        status: "new",
      },
      {
        id: 2,
        enquiryId: "ENQ-0002",
        fullName: "Priya Patil",
        email: "priya.patil@gmail.com",
        mobile: "+91 97654 32109",
        enquiryType: "career",
        enquirySource: "Career Enquiry",
        message:
          "I have 5 years experience in civil engineering. Are there any openings?",
        submissionDate: "2025-02-12T09:15:00",
        ipAddress: "117.232.78.45",
        status: "read",
      },
    ];
  }

  getAllContacts(filter = null) {
    return filter
      ? this.contacts.filter((c) => c.enquiryType === filter)
      : this.contacts;
  }

  getContactById(id) {
    return this.contacts.find((c) => c.id === id);
  }

  markAsRead(id) {
    const contact = this.getContactById(id);
    if (contact && contact.status === "new") {
      contact.status = "read";
      this.saveToStorage();
    }
  }

  deleteContact(id) {
    const index = this.contacts.findIndex((c) => c.id === id);
    if (index === -1) return false;
    this.contacts.splice(index, 1);
    this.saveToStorage();
    return true;
  }
}

// ===== UI MANAGER =====
class UIManager {
  constructor(contactManager) {
    this.contactManager = contactManager;
    this.currentFilter = null;
  }

  init() {
    this.setupSidebar();
    this.loadView();
    this.setupEventListeners();
  }

  setupSidebar() {
    const sidebar = document.querySelector(".sidebar");
    const toggle = document.querySelector(".sidebar-toggle");
    if (toggle && sidebar) {
      toggle.addEventListener("click", () => {
        sidebar.classList.toggle("sidebar-collapsed");
        const icon = toggle.querySelector("i");
        icon.classList.toggle("fa-chevron-left");
        icon.classList.toggle("fa-chevron-right");
      });
    }
  }

  loadView() {
    const params = new URLSearchParams(window.location.search);
    const filter = params.get("filter");
    this.currentFilter = filter;
    this.showContactList(filter);
  }

  showContactList(filter = null) {
    const contacts = this.contactManager.getAllContacts(filter);
    document.getElementById("pageTitle").textContent = filter
      ? CONFIG.enquiryTypes.find((t) => t.value === filter)?.label +
        " Enquiries"
      : "Contact Management";

    const content = `
      <div class="content-header">
        <div>
          <h2 class="text-xl font-bold text-gray-800">${document.getElementById("pageTitle").textContent}</h2>
          <p class="text-gray-600 text-sm">${contacts.length} enquiry${contacts.length !== 1 ? "ies" : ""}</p>
        </div>
        
        <div class="flex gap-3 flex-wrap">
          <div class="filter-bar">
            <button class="filter-btn ${!filter ? "active" : ""}" onclick="uiManager.setFilter(null)">
              All (${this.contactManager.contacts.length})
            </button>
            ${CONFIG.enquiryTypes
              .map(
                (t) => `
              <button class="filter-btn ${filter === t.value ? "active" : ""}" onclick="uiManager.setFilter('${t.value}')">
                ${t.label} (${this.contactManager.contacts.filter((c) => c.enquiryType === t.value).length})
              </button>
            `,
              )
              .join("")}
          </div>
        </div>
      </div>
      
      ${
        contacts.length > 0
          ? `
        <div class="contact-grid">
          ${contacts.map((contact) => this.renderContactCard(contact)).join("")}
        </div>
      `
          : `
        <div class="empty-state">
          <div class="empty-icon"><i class="fas fa-envelope"></i></div>
          <h3 class="empty-title">No enquiries found</h3>
          <p class="empty-message">${filter ? "Try another filter or" : ""} new enquiries will appear here</p>
        </div>
      `
      }
    `;

    document.getElementById("contentArea").innerHTML = content;
  }

  renderContactCard(contact) {
    const typeConfig = CONFIG.enquiryTypes.find(
      (t) => t.value === contact.enquiryType,
    );

    return `
      <div class="contact-card" data-id="${contact.id}">
        <div class="contact-header">
          <h3 class="contact-name">${contact.fullName}</h3>
          <span class="${typeConfig.class}">${typeConfig.label}</span>
        </div>
        
        <div class="contact-content">
          <div class="contact-meta">
            <div class="meta-row">
              <span class="meta-label">Email:</span>
              <span class="meta-value">${contact.email}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Mobile:</span>
              <span class="meta-value">${contact.mobile}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Source:</span>
              <span class="meta-value">${contact.enquirySource}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Submitted:</span>
              <span class="meta-value">${this.formatDate(contact.submissionDate)}</span>
            </div>
          </div>
          
          <div class="contact-message">
            ${contact.message.substring(0, 140)}${contact.message.length > 140 ? "..." : ""}
          </div>
          
          <div class="contact-actions">
            <button class="action-btn" onclick="uiManager.markAsRead(${contact.id})">
              <i class="fas fa-envelope-open"></i> Mark Read
            </button>
            <button class="action-btn" onclick="uiManager.showDeleteModal(${contact.id})">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    `;
  }

  markAsRead(id) {
    this.contactManager.markAsRead(id);
    this.showContactList(this.currentFilter);
    showToast("Enquiry marked as read", "success");
  }

  setFilter(filter) {
    window.location.href = filter ? `?filter=${filter}` : "?";
  }

  showDeleteModal(id) {
    this.contactManager.currentContactId = id;
    document.getElementById("deleteModal").classList.add("show");
  }

  closeModal() {
    document.getElementById("deleteModal").classList.remove("show");
    this.contactManager.currentContactId = null;
  }

  confirmDelete() {
    if (this.contactManager.currentContactId) {
      const success = this.contactManager.deleteContact(
        this.contactManager.currentContactId,
      );
      if (success) {
        showToast("Enquiry deleted successfully", "success");
        this.closeModal();
        this.showContactList(this.currentFilter);
      }
    }
  }

  formatDate(dateStr) {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  setupEventListeners() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closeModal();
    });
  }
}

// ===== IMPROVED TOAST NOTIFICATION =====
function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) {
    const newContainer = document.createElement("div");
    newContainer.id = "toastContainer";
    document.body.appendChild(newContainer);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-inner">
      <i class="fas fa-${
        type === "success"
          ? "check-circle"
          : type === "error"
            ? "exclamation-circle"
            : type === "warning"
              ? "exclamation-triangle"
              : "info-circle"
      } toast-icon"></i>
      <p class="toast-message">${message}</p>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
    <div class="toast-progress"></div>
  `;

  document.getElementById("toastContainer").appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add("show"), 10);

  // Auto dismiss after 4 seconds
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

// ===== LOGOUT CONFIRMATION =====
function showLogoutConfirm() {
  document.getElementById("logoutModal").classList.add("show");
}

function closeLogoutModal() {
  document.getElementById("logoutModal").classList.remove("show");
}

function performLogout() {
  showToast("Logging out...", "info");

  // Simulate logout delay (replace with actual auth logout in production)
  setTimeout(() => {
    window.location.href = "../index.html"; // ← CHANGE TO YOUR REAL LOGIN PAGE
  }, 1200);
}

// ===== INITIALIZATION =====
const contactManager = new ContactManager();
const uiManager = new UIManager(contactManager);

window.uiManager = uiManager;

document.addEventListener("DOMContentLoaded", () => {
  uiManager.init();
});
