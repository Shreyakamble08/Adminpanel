// Career Management Module - Main Script

// ===== CONSTANTS & CONFIG =====
const CONFIG = {
  colors: {
    primary: "#211832",
    accent: "#412B6B",
    success: "#10b981",
    danger: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
  },
  careerDepartments: [
    { value: "engineering", label: "Engineering", color: "tag-engineering" },
    { value: "marketing", label: "Marketing", color: "tag-marketing" },
    { value: "hr", label: "HR", color: "tag-hr" },
    { value: "finance", label: "Finance", color: "tag-finance" },
    { value: "operations", label: "Operations", color: "tag-operations" },
  ],
  careerTypes: ["full-time", "part-time", "contract", "internship"],
  statuses: [
    { value: "active", label: "Active", class: "status-active" },
    { value: "inactive", label: "Inactive", class: "status-inactive" },
    { value: "scheduled", label: "Scheduled", class: "status-scheduled" },
  ],
};

// ===== CAREER DATA MANAGEMENT =====
class CareerManager {
  constructor() {
    this.careers = this.loadFromStorage();
    this.currentCareerId = null;
    this.currentFilter = null;
  }

  // Load careers from localStorage
  loadFromStorage() {
    try {
      const saved = localStorage.getItem("constructpro_careers");
      return saved ? JSON.parse(saved) : this.getSampleCareers();
    } catch (error) {
      console.error("Error loading careers:", error);
      return this.getSampleCareers();
    }
  }

  // Save careers to localStorage
  saveToStorage() {
    try {
      localStorage.setItem(
        "constructpro_careers",
        JSON.stringify(this.careers),
      );
    } catch (error) {
      console.error("Error saving careers:", error);
    }
  }

  // Get sample careers for initial setup
  getSampleCareers() {
    return [
      {
        id: 1,
        title: "Senior Civil Engineer",
        description: "Lead construction projects and teams",
        department: "engineering",
        type: "full-time",
        location: "Pune, India",
        status: "active",
        priority: 1,
        startDate: "2024-06-01",
        endDate: "2024-12-31",
        requirements: "5+ years experience, BE Civil",
        responsibilities: "Project management, site supervision",
        applicationUrl: "/apply/engineer",
        isVisible: true,
        createdAt: "2024-05-15T10:30:00",
        updatedAt: "2024-05-15T10:30:00",
      },
      {
        id: 2,
        title: "Marketing Specialist",
        description: "Handle digital marketing for construction services",
        department: "marketing",
        type: "part-time",
        location: "Remote",
        status: "scheduled",
        priority: 2,
        startDate: "2024-07-01",
        endDate: "2024-07-31",
        requirements: "3+ years in marketing, SEO knowledge",
        responsibilities: "Content creation, social media",
        applicationUrl: "/apply/marketing",
        isVisible: true,
        createdAt: "2024-05-20T14:15:00",
        updatedAt: "2024-05-20T14:15:00",
      },
    ];
  }

  // Get all careers with optional filter
  getAllCareers(filter = null) {
    if (!filter) return this.careers;

    switch (filter) {
      case "active":
        return this.careers.filter((c) => c.status === "active");
      case "inactive":
        return this.careers.filter((c) => c.status === "inactive");
      case "scheduled":
        return this.careers.filter((c) => c.status === "scheduled");
      default:
        return this.careers;
    }
  }

  // Get career by ID
  getCareerById(id) {
    return this.careers.find((c) => c.id === id);
  }

  // Create new career
  createCareer(data) {
    const newCareer = {
      id: Date.now(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.careers.unshift(newCareer);
    this.saveToStorage();
    return newCareer;
  }

  // Update existing career
  updateCareer(id, data) {
    const index = this.careers.findIndex((c) => c.id === id);
    if (index === -1) return null;

    this.careers[index] = {
      ...this.careers[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    this.saveToStorage();
    return this.careers[index];
  }

  // Delete career
  deleteCareer(id) {
    const index = this.careers.findIndex((c) => c.id === id);
    if (index === -1) return false;

    this.careers.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Toggle career status
  toggleCareerStatus(id) {
    const career = this.getCareerById(id);
    if (!career) return null;

    career.status = career.status === "active" ? "inactive" : "active";
    career.updatedAt = new Date().toISOString();
    this.saveToStorage();
    return career;
  }

  // Validate career data
  validateCareer(data) {
    const errors = [];

    if (!data.title?.trim()) {
      errors.push("Career title is required");
    }

    if (!data.department) {
      errors.push("Department is required");
    }

    if (!data.startDate || !data.endDate) {
      errors.push("Start and end dates are required");
    } else if (new Date(data.startDate) > new Date(data.endDate)) {
      errors.push("End date must be after start date");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// ===== UI MANAGER =====
class UIManager {
  constructor(careerManager) {
    this.careerManager = careerManager;
    this.currentView = null;
    this.isFormOpen = false;
    this.isPreviewOpen = false;
  }

  // Initialize UI
  init() {
    this.setupSidebar();
    this.loadView();
    this.setupEventListeners();
  }

  // Setup sidebar toggle
  setupSidebar() {
    const sidebar = document.querySelector(".sidebar");
    const toggle = document.querySelector(".sidebar-toggle");
    const mainContent = document.querySelector(".main-content");

    if (toggle && sidebar && mainContent) {
      toggle.addEventListener("click", () => {
        sidebar.classList.toggle("sidebar-collapsed");

        // Explicitly toggle a class on main-content for more reliable detection
        mainContent.classList.toggle("sidebar-collapsed");

        const icon = toggle.querySelector("i");
        icon.classList.toggle("fa-chevron-left");
        icon.classList.toggle("fa-chevron-right");
      });
    }
  }

  // Load view based on URL parameters
  loadView() {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get("action");
    const filter = urlParams.get("filter");

    this.careerManager.currentFilter = filter;

    if (action === "create" || action === "edit") {
      const id = urlParams.get("id");
      this.showCareerForm(action, id);
    } else {
      this.showCareerList(filter);
    }
  }

  // Get filter title
  getFilterTitle(filter) {
    const titles = {
      active: "Active Postings",
      inactive: "Inactive Postings",
      scheduled: "Scheduled Postings",
      null: "Career Management",
    };
    return titles[filter] || "Career Management";
  }

  // Show career list view
  showCareerList(filter = null) {
    const careers = this.careerManager.getAllCareers(filter);
    document.getElementById("pageTitle").textContent =
      this.getFilterTitle(filter);

    const content = `
            <div class="content-header">
                <div>
                    <h2 class="text-xl font-bold text-gray-800">${this.getFilterTitle(filter)}</h2>
                    <p class="text-gray-600 text-sm">${careers.length} posting${careers.length !== 1 ? "s" : ""} found</p>
                </div>
                
                <div class="flex gap-3">
                    <div class="filter-bar">
                        <button class="filter-btn ${!filter ? "active" : ""}" onclick="uiManager.setFilter(null)">
                            All (${this.careerManager.careers.length})
                        </button>
                        <button class="filter-btn ${filter === "active" ? "active" : ""}" onclick="uiManager.setFilter('active')">
                            Active (${this.careerManager.careers.filter((c) => c.status === "active").length})
                        </button>
                        <button class="filter-btn ${filter === "scheduled" ? "active" : ""}" onclick="uiManager.setFilter('scheduled')">
                            Scheduled (${this.careerManager.careers.filter((c) => c.status === "scheduled").length})
                        </button>
                        <button class="filter-btn ${filter === "inactive" ? "active" : ""}" onclick="uiManager.setFilter('inactive')">
                            Inactive (${this.careerManager.careers.filter((c) => c.status === "inactive").length})
                        </button>
                    </div>
                    
                    <button class="btn btn-primary" onclick="uiManager.openCareerForm()">
                        <i class="fas fa-plus"></i>
                        <span>Add Posting</span>
                    </button>
                </div>
            </div>
            
            ${
              careers.length > 0
                ? `
                <div class="career-grid">
                    ${careers.map((career) => this.renderCareerCard(career)).join("")}
                </div>
            `
                : `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-briefcase"></i>
                    </div>
                    <h3 class="empty-title">No postings found</h3>
                    <p class="empty-message">
                        ${filter ? "Try changing your filter or" : ""} create your first posting to get started
                    </p>
                    <button class="btn btn-primary" onclick="uiManager.openCareerForm()">
                        <i class="fas fa-plus"></i>
                        Create New Posting
                    </button>
                </div>
            `
            }
        `;

    document.getElementById("contentArea").innerHTML = content;
  }

  // Render career card
  renderCareerCard(career) {
    const deptConfig = CONFIG.careerDepartments.find(
      (d) => d.value === career.department,
    );
    const statusConfig = CONFIG.statuses.find((s) => s.value === career.status);

    return `
            <div class="career-card" data-id="${career.id}">
                <div class="career-content">
                    <div class="career-header">
                        <h3 class="career-title">${career.title}</h3>
                        <span class="status-badge ${statusConfig.class}">
                            <i class="fas fa-circle"></i>
                            ${statusConfig.label}
                        </span>
                    </div>
                    
                    <div class="career-meta">
                        <div class="meta-row">
                            <span class="meta-label">Department:</span>
                            <span class="department-tag ${deptConfig.color}">${deptConfig.label}</span>
                        </div>
                        
                        <div class="meta-row">
                            <span class="meta-label">Type:</span>
                            <span class="meta-value">${career.type.charAt(0).toUpperCase() + career.type.slice(1)}</span>
                        </div>
                        
                        <div class="meta-row">
                            <span class="meta-label">Location:</span>
                            <span class="meta-value">${career.location}</span>
                        </div>
                        
                        <div class="meta-row">
                            <span class="meta-label">Schedule:</span>
                            <div class="text-right">
                                <div class="text-sm">${this.formatDate(career.startDate)}</div>
                                <div class="text-xs text-gray-500">to ${this.formatDate(career.endDate)}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="career-actions">
                        <button class="action-btn" onclick="uiManager.editCareer(${career.id})">
                            <i class="fas fa-edit"></i>
                            Edit
                        </button>
                        <button class="action-btn" onclick="uiManager.toggleCareerStatus(${career.id})">
                            <i class="fas ${career.status === "active" ? "fa-pause" : "fa-play"}"></i>
                            ${career.status === "active" ? "Deactivate" : "Activate"}
                        </button>
                    </div>
                </div>
            </div>
        `;
  }

  // Open career form overlay
  openCareerForm(id = null) {
    const action = id ? "edit" : "create";
    const career = id ? this.careerManager.getCareerById(id) : null;

    const formOverlay = document.createElement("div");
    formOverlay.className = "form-overlay";
    formOverlay.innerHTML = `
            <div class="form-container">
                <div class="form-header">
                    <h2>${action === "create" ? "Create New Posting" : "Edit Posting"}</h2>
                    <button class="preview-close" onclick="uiManager.closeForm()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="form-body">
                    <div class="form-grid-2">
                        <div class="form-group">
                            <label class="form-label required">Job Title</label>
                            <input type="text" id="formTitle" class="form-input"
                                   placeholder="Senior Civil Engineer"
                                   value="${career ? career.title : ""}">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label required">Department</label>
                            <select id="formDepartment" class="form-select">
                                ${CONFIG.careerDepartments
                                  .map(
                                    (dept) => `
                                    <option value="${dept.value}" ${career && career.department === dept.value ? "selected" : ""}>
                                        ${dept.label}
                                    </option>
                                `,
                                  )
                                  .join("")}
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-grid-2">
                        <div class="form-group">
                            <label class="form-label required">Job Type</label>
                            <select id="formType" class="form-select">
                                ${CONFIG.careerTypes
                                  .map(
                                    (type) => `
                                    <option value="${type}" ${career && career.type === type ? "selected" : ""}>
                                        ${type.charAt(0).toUpperCase() + type.slice(1)}
                                    </option>
                                `,
                                  )
                                  .join("")}
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label required">Location</label>
                            <input type="text" id="formLocation" class="form-input"
                                   placeholder="Pune, India"
                                   value="${career ? career.location : ""}">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Description</label>
                        <textarea id="formDescription" class="form-textarea"
                                  placeholder="Brief job description...">${career ? career.description || "" : ""}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Requirements</label>
                        <textarea id="formRequirements" class="form-textarea"
                                  placeholder="Job requirements...">${career ? career.requirements || "" : ""}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Responsibilities</label>
                        <textarea id="formResponsibilities" class="form-textarea"
                                  placeholder="Job responsibilities...">${career ? career.responsibilities || "" : ""}</textarea>
                    </div>
                    
                    <div class="form-grid-2">
                        <div class="form-group">
                            <label class="form-label required">Start Date</label>
                            <input type="date" id="formStartDate" class="form-input"
                                   value="${career ? career.startDate : new Date().toISOString().split("T")[0]}">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label required">End Date</label>
                            <input type="date" id="formEndDate" class="form-input"
                                   value="${career ? career.endDate : new Date(Date.now() + 86400000).toISOString().split("T")[0]}">
                        </div>
                    </div>
                    
                    <div class="form-grid-2">
                        <div class="form-group">
                            <label class="form-label required">Status</label>
                            <select id="formStatus" class="form-select">
                                ${CONFIG.statuses
                                  .map(
                                    (status) => `
                                    <option value="${status.value}" ${career && career.status === status.value ? "selected" : status.value === "active" ? "selected" : ""}>
                                        ${status.label}
                                    </option>
                                `,
                                  )
                                  .join("")}
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label required">Display Order</label>
                            <select id="formPriority" class="form-select">
                                ${[1, 2, 3, 4, 5]
                                  .map(
                                    (num) => `
                                    <option value="${num}" ${career && career.priority === num ? "selected" : num === 1 ? "selected" : ""}>
                                        Position ${num} ${num === 1 ? "(First)" : num === 5 ? "(Last)" : ""}
                                    </option>
                                `,
                                  )
                                  .join("")}
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label required">Application URL/Email</label>
                        <input type="text" id="formApplicationUrl" class="form-input"
                               placeholder="/apply/job or careers@company.com"
                               value="${career ? career.applicationUrl : ""}">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">
                            <input type="checkbox" id="formVisible" ${career?.isVisible !== false ? "checked" : ""}>
                            Make posting visible
                        </label>
                    </div>
                </div>
                
                <div class="form-header border-t">
                    <button class="btn btn-secondary" onclick="uiManager.closeForm()">
                        Cancel
                    </button>
                    <button class="btn btn-primary" onclick="uiManager.saveCareerForm(${id ? `'edit', ${id}` : "'create'"})">
                        ${action === "create" ? "Create Posting" : "Update Posting"}
                    </button>
                </div>
            </div>
        `;

    document.body.appendChild(formOverlay);
    this.isFormOpen = true;
  }

  // Close form overlay
  closeForm() {
    const formOverlay = document.querySelector(".form-overlay");
    if (formOverlay) {
      formOverlay.remove();
    }
    this.isFormOpen = false;
  }

  // Save career form
  saveCareerForm(action, id = null) {
    // Collect form data
    const formData = {
      title: document.getElementById("formTitle")?.value,
      description: document.getElementById("formDescription")?.value,
      department: document.getElementById("formDepartment")?.value,
      type: document.getElementById("formType")?.value,
      location: document.getElementById("formLocation")?.value,
      requirements: document.getElementById("formRequirements")?.value,
      responsibilities: document.getElementById("formResponsibilities")?.value,
      status: document.getElementById("formStatus")?.value,
      priority: parseInt(document.getElementById("formPriority")?.value || 1),
      startDate: document.getElementById("formStartDate")?.value,
      endDate: document.getElementById("formEndDate")?.value,
      applicationUrl: document.getElementById("formApplicationUrl")?.value,
      isVisible: document.getElementById("formVisible")?.checked || true,
    };

    // Validate
    const validation = this.careerManager.validateCareer(formData);
    if (!validation.isValid) {
      this.showToast(validation.errors[0], "error");
      return;
    }

    // Save career
    if (action === "create") {
      const newCareer = this.careerManager.createCareer(formData);
      this.showToast("Posting created successfully!", "success");
      this.closeForm();
      this.showCareerList(this.careerManager.currentFilter);
    } else {
      const updatedCareer = this.careerManager.updateCareer(id, formData);
      if (updatedCareer) {
        this.showToast("Posting updated successfully!", "success");
        this.closeForm();
        this.showCareerList(this.careerManager.currentFilter);
      }
    }
  }

  // Edit career
  editCareer(id) {
    this.openCareerForm(id);
  }

  // Set filter and reload view
  setFilter(filter) {
    window.location.href = `?filter=${filter}`;
  }

  // Toggle career status
  toggleCareerStatus(id) {
    const career = this.careerManager.toggleCareerStatus(id);
    if (career) {
      this.showToast(
        `Posting ${career.status === "active" ? "activated" : "deactivated"}`,
        "success",
      );
      this.showCareerList(this.careerManager.currentFilter);
    }
  }

  // Show delete modal
  showDeleteModal(id) {
    this.careerManager.currentCareerId = id;
    document.getElementById("deleteModal").classList.add("show");
  }

  // Close modal
  closeModal() {
    document.getElementById("deleteModal").classList.remove("show");
    this.careerManager.currentCareerId = null;
  }

  // Confirm delete
  confirmDelete() {
    if (this.careerManager.currentCareerId) {
      const success = this.careerManager.deleteCareer(
        this.careerManager.currentCareerId,
      );
      if (success) {
        this.showToast("Posting deleted successfully", "success");
        this.closeModal();
        this.showCareerList(this.careerManager.currentFilter);
      }
    }
  }

  // Format date
  formatDate(dateString) {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  // Show toast notification
  showToast(message, type = "info") {
    const toastContainer = document.getElementById("toastContainer");
    if (!toastContainer) {
      const container = document.createElement("div");
      container.id = "toastContainer";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `
            <i class="fas fa-${this.getToastIcon(type)} toast-icon"></i>
            <p class="toast-message">${message}</p>
        `;

    document.getElementById("toastContainer").appendChild(toast);

    // Show toast
    setTimeout(() => toast.classList.add("show"), 10);

    // Auto remove after 4 seconds
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Get toast icon based on type
  getToastIcon(type) {
    const icons = {
      success: "check-circle",
      error: "exclamation-circle",
      warning: "exclamation-triangle",
      info: "info-circle",
    };
    return icons[type] || "info-circle";
  }

  // Setup event listeners
  setupEventListeners() {
    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      // Ctrl/Cmd + N for new career
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        this.openCareerForm();
      }

      // Escape to close modals
      if (e.key === "Escape") {
        this.closeModal();
      }
    });
  }
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
    window.location.href = "./index.html"; // ← CHANGE TO YOUR REAL LOGIN PAGE
  }, 1200);
}

// ===== INITIALIZATION =====
// Initialize career manager and UI
const careerManager = new CareerManager();
const uiManager = new UIManager(careerManager);

// Make available globally
window.careerManager = careerManager;
window.uiManager = uiManager;

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  uiManager.init();
});
