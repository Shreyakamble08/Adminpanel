// Project Management Module - Main Script

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
  industries: [
    { value: "residential", label: "Residential", color: "tag-residential" },
    { value: "commercial", label: "Commercial", color: "tag-commercial" },
    { value: "industrial", label: "Industrial", color: "tag-industrial" },
    {
      value: "infrastructure",
      label: "Infrastructure",
      color: "tag-infrastructure",
    },
    {
      value: "institutional",
      label: "Institutional",
      color: "tag-institutional",
    },
  ],
  projectTypes: ["new-construction", "renovation", "turnkey", "epc"],
  statuses: [
    { value: "upcoming", label: "Upcoming", class: "status-upcoming" },
    { value: "ongoing", label: "Ongoing", class: "status-ongoing" },
    { value: "completed", label: "Completed", class: "status-completed" },
    { value: "on-hold", label: "On Hold", class: "status-on-hold" },
  ],
};

// ===== PROJECT DATA MANAGEMENT =====
class ProjectManager {
  constructor() {
    this.projects = this.loadFromStorage();
    this.currentProjectId = null;
    this.currentFilter = null;
  }

  // Load projects from localStorage
  loadFromStorage() {
    try {
      const saved = localStorage.getItem("constructpro_projects");
      return saved ? JSON.parse(saved) : this.getSampleProjects();
    } catch (error) {
      console.error("Error loading projects:", error);
      return this.getSampleProjects();
    }
  }

  // Save projects to localStorage
  saveToStorage() {
    try {
      localStorage.setItem(
        "constructpro_projects",
        JSON.stringify(this.projects),
      );
    } catch (error) {
      console.error("Error saving projects:", error);
    }
  }

  // Get sample projects for initial setup
  getSampleProjects() {
    return [
      {
        id: 1,
        title: "Luxury Residential Complex",
        slug: "luxury-residential-complex",
        code: "RES-001",
        industry: "residential",
        type: "new-construction",
        status: "ongoing",
        visibility: "public",
        featured: true,
        priority: 1,
        clientName: "Elite Builders",
        clientType: "private-company",
        clientLogo: null,
        confidentialClient: false,
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        siteAddress: "Marine Drive",
        mapsUrl: "https://maps.google.com",
        startDate: "2024-01-01",
        expectedCompletion: "2025-12-31",
        actualCompletion: null,
        warranty: "2 years",
        builtArea: "500000 sq ft",
        plotArea: "10 acres",
        floors: 20,
        units: 150,
        costRange: "500 Cr",
        shortDescription: "High-end residential project",
        detailedOverview: "Detailed description here",
        scope: "Full construction",
        challenges: "Urban location constraints",
        solutions: "Innovative engineering",
        achievements: "On-time phase 1 completion",
        highlights: [{ text: "Green certified", icon: "leaf" }],
        images: [
          {
            url: null,
            category: "cover",
            caption: "Main view",
            primary: true,
            alt: "Project view",
            visibility: true,
          },
        ],
        services: ["civil-construction", "structural-work"],
        compliance: [
          {
            title: "RERA",
            description: "Registered",
            document: null,
            visibility: true,
          },
        ],
        metaTitle: "Luxury Residential in Mumbai",
        metaDescription: "Premium construction project",
        seoKeywords: "residential, luxury, mumbai",
        canonical: "/projects/residential/luxury",
        ogImage: null,
        createdBy: "Admin",
        createdDate: "2024-05-15T10:30:00",
        updatedBy: "Admin",
        updatedDate: "2024-05-15T10:30:00",
      },
      {
        id: 2,
        title: "Commercial Office Tower",
        slug: "commercial-office-tower",
        code: "COM-001",
        industry: "commercial",
        type: "turnkey",
        status: "completed",
        visibility: "public",
        featured: false,
        priority: 2,
        clientName: "Tech Corp",
        clientType: "private-company",
        clientLogo: null,
        confidentialClient: false,
        city: "Bangalore",
        state: "Karnataka",
        country: "India",
        siteAddress: "MG Road",
        mapsUrl: "https://maps.google.com",
        startDate: "2023-06-01",
        expectedCompletion: "2024-03-31",
        actualCompletion: "2024-03-15",
        warranty: "1 year",
        builtArea: "300000 sq ft",
        plotArea: "5 acres",
        floors: 15,
        units: 50,
        costRange: "300 Cr",
        shortDescription: "Modern office space",
        detailedOverview: "Detailed description here",
        scope: "Turnkey delivery",
        challenges: "Tight deadline",
        solutions: "Efficient management",
        achievements: "Under budget",
        highlights: [{ text: "LEED certified", icon: "certificate" }],
        images: [
          {
            url: null,
            category: "completed",
            caption: "Exterior",
            primary: true,
            alt: "Tower view",
            visibility: true,
          },
        ],
        services: ["interior-fit-out", "electrical-plumbing"],
        compliance: [
          {
            title: "ISO 9001",
            description: "Compliant",
            document: null,
            visibility: true,
          },
        ],
        metaTitle: "Commercial Tower in Bangalore",
        metaDescription: "Completed office project",
        seoKeywords: "commercial, office, bangalore",
        canonical: "/projects/commercial/tower",
        ogImage: null,
        createdBy: "Admin",
        createdDate: "2024-05-20T14:15:00",
        updatedBy: "Admin",
        updatedDate: "2024-05-20T14:15:00",
      },
    ];
  }

  // Get all projects with optional filter
  getAllProjects(filter = null) {
    if (!filter) return this.projects;

    switch (filter) {
      case "upcoming":
        return this.projects.filter((p) => p.status === "upcoming");
      case "ongoing":
        return this.projects.filter((p) => p.status === "ongoing");
      case "completed":
        return this.projects.filter((p) => p.status === "completed");
      case "on-hold":
        return this.projects.filter((p) => p.status === "on-hold");
      default:
        return this.projects;
    }
  }

  // Get project by ID
  getProjectById(id) {
    return this.projects.find((p) => p.id === id);
  }

  // Create new project
  createProject(data) {
    const newProject = {
      id: Date.now(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.projects.unshift(newProject);
    this.saveToStorage();
    return newProject;
  }

  // Update existing project
  updateProject(id, data) {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) return null;

    this.projects[index] = {
      ...this.projects[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    this.saveToStorage();
    return this.projects[index];
  }

  // Delete project
  deleteProject(id) {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) return false;

    this.projects.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Toggle project status
  toggleProjectStatus(id) {
    const project = this.getProjectById(id);
    if (!project) return null;

    project.status = project.status === "ongoing" ? "on-hold" : "ongoing";
    project.updatedAt = new Date().toISOString();
    this.saveToStorage();
    return project;
  }

  // Validate project data
  validateProject(data) {
    const errors = [];

    if (!data.title?.trim()) {
      errors.push("Project title is required");
    }

    if (!data.industry) {
      errors.push("Industry is required");
    }

    if (!data.startDate || !data.expectedCompletion) {
      errors.push("Start and completion dates are required");
    } else if (new Date(data.startDate) > new Date(data.expectedCompletion)) {
      errors.push("Completion date must be after start date");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// ===== UI MANAGER =====
class UIManager {
  constructor(projectManager) {
    this.projectManager = projectManager;
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
    const sidebarToggle = document.querySelector(".sidebar-toggle");

    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener("click", () => {
        sidebar.classList.toggle("sidebar-collapsed");
        const icon = sidebarToggle.querySelector("i");
        if (sidebar.classList.contains("sidebar-collapsed")) {
          icon.classList.replace("fa-chevron-left", "fa-chevron-right");
        } else {
          icon.classList.replace("fa-chevron-right", "fa-chevron-left");
        }
      });
    }
  }

  // Load view based on URL parameters
  loadView() {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get("action");
    const filter = urlParams.get("filter");

    this.projectManager.currentFilter = filter;

    if (action === "create" || action === "edit") {
      const id = urlParams.get("id");
      this.showProjectForm(action, id);
    } else {
      this.showProjectList(filter);
    }
  }

  // Get filter title
  getFilterTitle(filter) {
    const titles = {
      upcoming: "Upcoming Projects",
      ongoing: "Ongoing Projects",
      completed: "Completed Projects",
      "on-hold": "On Hold Projects",
      null: "Project Management",
    };
    return titles[filter] || "Project Management";
  }

  // Show project list view
  showProjectList(filter = null) {
    const projects = this.projectManager.getAllProjects(filter);
    document.getElementById("pageTitle").textContent =
      this.getFilterTitle(filter);

    const content = `
            <div class="content-header">
                <div>
                    <h2 class="text-xl font-bold text-gray-800">${this.getFilterTitle(filter)}</h2>
                    <p class="text-gray-600 text-sm">${projects.length} project${projects.length !== 1 ? "s" : ""} found</p>
                </div>
                
                <div class="flex gap-3">
                    <div class="filter-bar">
                        <button class="filter-btn ${!filter ? "active" : ""}" onclick="uiManager.setFilter(null)">
                            All (${this.projectManager.projects.length})
                        </button>
                        <button class="filter-btn ${filter === "upcoming" ? "active" : ""}" onclick="uiManager.setFilter('upcoming')">
                            Upcoming (${this.projectManager.projects.filter((p) => p.status === "upcoming").length})
                        </button>
                        <button class="filter-btn ${filter === "ongoing" ? "active" : ""}" onclick="uiManager.setFilter('ongoing')">
                            Ongoing (${this.projectManager.projects.filter((p) => p.status === "ongoing").length})
                        </button>
                        <button class="filter-btn ${filter === "completed" ? "active" : ""}" onclick="uiManager.setFilter('completed')">
                            Completed (${this.projectManager.projects.filter((p) => p.status === "completed").length})
                        </button>
                        <button class="filter-btn ${filter === "on-hold" ? "active" : ""}" onclick="uiManager.setFilter('on-hold')">
                            On Hold (${this.projectManager.projects.filter((p) => p.status === "on-hold").length})
                        </button>
                    </div>
                    
                    <button class="btn btn-primary" onclick="uiManager.openProjectForm()">
                        <i class="fas fa-plus"></i>
                        <span>Add Project</span>
                    </button>
                </div>
            </div>
            
            ${
              projects.length > 0
                ? `
                <div class="project-grid">
                    ${projects.map((project) => this.renderProjectCard(project)).join("")}
                </div>
            `
                : `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-project-diagram"></i>
                    </div>
                    <h3 class="empty-title">No projects found</h3>
                    <p class="empty-message">
                        ${filter ? "Try changing your filter or" : ""} create your first project to get started
                    </p>
                    <button class="btn btn-primary" onclick="uiManager.openProjectForm()">
                        <i class="fas fa-plus"></i>
                        Create New Project
                    </button>
                </div>
            `
            }
        `;

    document.getElementById("contentArea").innerHTML = content;
  }

  // Render project card
  renderProjectCard(project) {
    const industryConfig = CONFIG.industries.find(
      (i) => i.value === project.industry,
    );
    const statusConfig = CONFIG.statuses.find(
      (s) => s.value === project.status,
    );

    return `
            <div class="project-card" data-id="${project.id}">
                <div class="project-image">
                    <div class="project-overlay">
                        <button class="overlay-btn" onclick="uiManager.editProject(${project.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="overlay-btn" onclick="uiManager.toggleProjectStatus(${project.id})" title="${project.status === "ongoing" ? "Hold" : "Resume"}">
                            <i class="fas ${project.status === "ongoing" ? "fa-pause" : "fa-play"}"></i>
                        </button>
                        <button class="overlay-btn" onclick="uiManager.showDeleteModal(${project.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div class="project-content">
                    <div class="project-header">
                        <h3 class="project-title">${project.title}</h3>
                        <span class="status-badge ${statusConfig.class}">
                            <i class="fas fa-circle"></i>
                            ${statusConfig.label}
                        </span>
                    </div>
                    
                    <div class="project-meta">
                        <div class="meta-row">
                            <span class="meta-label">Industry:</span>
                            <span class="industry-tag ${industryConfig.color}">${industryConfig.label}</span>
                        </div>
                        
                        <div class="meta-row">
                            <span class="meta-label">Type:</span>
                            <span class="meta-value">${project.type.replace("-", " ").charAt(0).toUpperCase() + project.type.replace("-", " ").slice(1)}</span>
                        </div>
                        
                        <div class="meta-row">
                            <span class="meta-label">Client:</span>
                            <span class="meta-value">${project.clientName}</span>
                        </div>
                        
                        <div class="meta-row">
                            <span class="meta-label">Location:</span>
                            <span class="meta-value">${project.city}, ${project.state}</span>
                        </div>
                        
                        <div class="meta-row">
                            <span class="meta-label">Timeline:</span>
                            <div class="text-right">
                                <div class="text-sm">${this.formatDate(project.startDate)}</div>
                                <div class="text-xs text-gray-500">to ${this.formatDate(project.expectedCompletion)}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="project-actions">
                        <button class="action-btn" onclick="uiManager.editProject(${project.id})">
                            <i class="fas fa-edit"></i>
                            Edit
                        </button>
                        <button class="action-btn" onclick="uiManager.toggleProjectStatus(${project.id})">
                            <i class="fas ${project.status === "ongoing" ? "fa-pause" : "fa-play"}"></i>
                            ${project.status === "ongoing" ? "Hold" : "Resume"}
                        </button>
                    </div>
                </div>
            </div>
        `;
  }

  // Open project form overlay
  openProjectForm(id = null) {
    const action = id ? "edit" : "create";
    const project = id ? this.projectManager.getProjectById(id) : null;

    const formOverlay = document.createElement("div");
    formOverlay.className = "form-overlay";
    formOverlay.innerHTML = `
            <div class="form-container">
                <div class="form-header">
                    <h2>${action === "create" ? "Add New Project" : "Edit Project"}</h2>
                    <button class="preview-close" onclick="uiManager.closeForm()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="form-body">
                    <!-- Basic Info -->
                    <div class="form-group">
                        <label class="form-label required">Project Title</label>
                        <input type="text" id="projectTitle" class="form-input" value="${project ? project.title : ""}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Project Slug</label>
                        <input type="text" id="projectSlug" class="form-input" value="${project ? project.slug : ""}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Project Code</label>
                        <input type="text" id="projectCode" class="form-input" value="${project ? project.code : ""}">
                    </div>
                    <div class="form-group">
                        <label class="form-label required">Industry</label>
                        <select id="projectIndustry" class="form-select">
                            ${CONFIG.industries
                              .map(
                                (ind) => `
                                <option value="${ind.value}" ${project && project.industry === ind.value ? "selected" : ""}>
                                    ${ind.label}
                                </option>
                            `,
                              )
                              .join("")}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label required">Project Type</label>
                        <select id="projectType" class="form-select">
                            ${CONFIG.projectTypes
                              .map(
                                (type) => `
                                <option value="${type}" ${project && project.type === type ? "selected" : ""}>
                                    ${type.replace("-", " ").charAt(0).toUpperCase() + type.replace("-", " ").slice(1)}
                                </option>
                            `,
                              )
                              .join("")}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label required">Status</label>
                        <select id="projectStatus" class="form-select">
                            ${CONFIG.statuses
                              .map(
                                (status) => `
                                <option value="${status.value}" ${project && project.status === status.value ? "selected" : ""}>
                                    ${status.label}
                                </option>
                            `,
                              )
                              .join("")}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Visibility</label>
                        <select id="projectVisibility" class="form-select">
                            <option value="public" ${project && project.visibility === "public" ? "selected" : ""}>Public</option>
                            <option value="private" ${project && project.visibility === "private" ? "selected" : ""}>Private</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">
                            <input type="checkbox" id="projectFeatured" ${project && project.featured ? "checked" : ""}>
                            Featured Project
                        </label>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Display Order</label>
                        <input type="number" id="projectPriority" class="form-input" value="${project ? project.priority : "1"}">
                    </div>

                    <!-- Client & Location -->
                    <div class="form-group">
                        <label class="form-label">Client Name</label>
                        <input type="text" id="clientName" class="form-input" value="${project ? project.clientName : ""}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Client Type</label>
                        <select id="clientType" class="form-select">
                            <option value="individual" ${project && project.clientType === "individual" ? "selected" : ""}>Individual</option>
                            <option value="government" ${project && project.clientType === "government" ? "selected" : ""}>Government</option>
                            <option value="private-company" ${project && project.clientType === "private-company" ? "selected" : ""}>Private Company</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">
                            <input type="checkbox" id="confidentialClient" ${project && project.confidentialClient ? "checked" : ""}>
                            Confidential Client
                        </label>
                    </div>
                    <div class="form-group">
                        <label class="form-label">City</label>
                        <input type="text" id="city" class="form-input" value="${project ? project.city : ""}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">State</label>
                        <input type="text" id="state" class="form-input" value="${project ? project.state : ""}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Country</label>
                        <input type="text" id="country" class="form-input" value="${project ? project.country : ""}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Site Address</label>
                        <input type="text" id="siteAddress" class="form-input" value="${project ? project.siteAddress : ""}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Google Maps URL</label>
                        <input type="url" id="mapsUrl" class="form-input" value="${project ? project.mapsUrl : ""}">
                    </div>

                    <!-- Timeline & Scale -->
                    <div class="form-group">
                        <label class="form-label">Start Date</label>
                        <input type="date" id="startDate" class="form-input" value="${project ? project.startDate : ""}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Expected Completion</label>
                        <input type="date" id="expectedCompletion" class="form-input" value="${project ? project.expectedCompletion : ""}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Actual Completion</label>
                        <input type="date" id="actualCompletion" class="form-input" value="${project ? project.actualCompletion : ""}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Warranty Period</label>
                        <input type="text" id="warranty" class="form-input" value="${project ? project.warranty : ""}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Built-up Area</label>
                        <input type="text" id="builtArea" class="form-input" value="${project ? project.builtArea : ""}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Plot Area</label>
                        <input type="text" id="plotArea" class="form-input" value="${project ? project.plotArea : ""}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Number of Floors</label>
                        <input type="number" id="floors" class="form-input" value="${project ? project.floors : ""}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Number of Units</label>
                        <input type="number" id="units" class="form-input" value="${project ? project.units : ""}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Cost Range</label>
                        <input type="text" id="costRange" class="form-input" value="${project ? project.costRange : ""}">
                    </div>

                    <!-- Description & Content -->
                    <div class="form-group">
                        <label class="form-label">Short Description</label>
                        <textarea id="shortDescription" class="form-textarea" rows="3">${project ? project.shortDescription : ""}</textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Detailed Overview</label>
                        <textarea id="detailedOverview" class="form-textarea" rows="5">${project ? project.detailedOverview : ""}</textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Scope of Work</label>
                        <textarea id="scope" class="form-textarea" rows="4">${project ? project.scope : ""}</textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Challenges</label>
                        <textarea id="challenges" class="form-textarea" rows="4">${project ? project.challenges : ""}</textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Solutions</label>
                        <textarea id="solutions" class="form-textarea" rows="4">${project ? project.solutions : ""}</textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Key Achievements</label>
                        <textarea id="achievements" class="form-textarea" rows="4">${project ? project.achievements : ""}</textarea>
                    </div>

                    <!-- Images & Media -->
                    <div class="form-group">
                        <label class="form-label">Images</label>
                        <div class="upload-area" onclick="document.getElementById('imageUpload').click()">
                            <div class="upload-icon">
                                <i class="fas fa-cloud-upload-alt"></i>
                            </div>
                            <p class="upload-text">Click to upload images</p>
                            <p class="upload-hint">Multiple images supported</p>
                            <input type="file" id="imageUpload" multiple accept="image/*" class="file-input">
                        </div>
                    </div>

                    <!-- Services & Compliance -->
                    <div class="form-group">
                        <label class="form-label">Services</label>
                        <select id="services" multiple class="form-select">
                            <option value="civil-construction" ${project && project.services.includes("civil-construction") ? "selected" : ""}>Civil Construction</option>
                            <option value="structural-work" ${project && project.services.includes("structural-work") ? "selected" : ""}>Structural Work</option>
                            <option value="interior-fit-out" ${project && project.services.includes("interior-fit-out") ? "selected" : ""}>Interior Fit-Out</option>
                            <option value="electrical-plumbing" ${project && project.services.includes("electrical-plumbing") ? "selected" : ""}>Electrical & Plumbing</option>
                            <option value="project-management" ${project && project.services.includes("project-management") ? "selected" : ""}>Project Management</option>
                            <option value="turnkey-solutions" ${project && project.services.includes("turnkey-solutions") ? "selected" : ""}>Turnkey Solutions</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Compliance</label>
                        <textarea id="compliance" class="form-textarea" rows="4">${project ? project.compliance.map((c) => c.title + ": " + c.description).join("\n") : ""}</textarea>
                    </div>

                    <!-- SEO -->
                    <div class="form-group">
                        <label class="form-label">Meta Title</label>
                        <input type="text" id="metaTitle" class="form-input" value="${project ? project.metaTitle : ""}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Meta Description</label>
                        <textarea id="metaDescription" class="form-textarea" rows="3">${project ? project.metaDescription : ""}</textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">SEO Keywords</label>
                        <input type="text" id="seoKeywords" class="form-input" value="${project ? project.seoKeywords : ""}">
                    </div>
                </div>
                
                <div class="form-header border-t">
                    <button class="btn btn-secondary" onclick="uiManager.closeForm()">
                        Cancel
                    </button>
                    <button class="btn btn-primary" onclick="uiManager.saveProjectForm(${id ? `'edit', ${id}` : "'create'"})">
                        ${action === "create" ? "Create Project" : "Update Project"}
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

  // Save project form
  saveProjectForm(action, id = null) {
    // Collect form data (simplified; expand as needed)
    const formData = {
      title: document.getElementById("projectTitle")?.value,
      slug: document.getElementById("projectSlug")?.value,
      code: document.getElementById("projectCode")?.value,
      industry: document.getElementById("projectIndustry")?.value,
      type: document.getElementById("projectType")?.value,
      status: document.getElementById("projectStatus")?.value,
      visibility: document.getElementById("projectVisibility")?.value,
      featured: document.getElementById("projectFeatured")?.checked,
      priority: parseInt(
        document.getElementById("projectPriority")?.value || 1,
      ),
      clientName: document.getElementById("clientName")?.value,
      clientType: document.getElementById("clientType")?.value,
      confidentialClient:
        document.getElementById("confidentialClient")?.checked,
      city: document.getElementById("city")?.value,
      state: document.getElementById("state")?.value,
      country: document.getElementById("country")?.value,
      siteAddress: document.getElementById("siteAddress")?.value,
      mapsUrl: document.getElementById("mapsUrl")?.value,
      startDate: document.getElementById("startDate")?.value,
      expectedCompletion: document.getElementById("expectedCompletion")?.value,
      actualCompletion: document.getElementById("actualCompletion")?.value,
      warranty: document.getElementById("warranty")?.value,
      builtArea: document.getElementById("builtArea")?.value,
      plotArea: document.getElementById("plotArea")?.value,
      floors: parseInt(document.getElementById("floors")?.value || 0),
      units: parseInt(document.getElementById("units")?.value || 0),
      costRange: document.getElementById("costRange")?.value,
      shortDescription: document.getElementById("shortDescription")?.value,
      detailedOverview: document.getElementById("detailedOverview")?.value,
      scope: document.getElementById("scope")?.value,
      challenges: document.getElementById("challenges")?.value,
      solutions: document.getElementById("solutions")?.value,
      achievements: document.getElementById("achievements")?.value,
      services: Array.from(
        document.getElementById("services").selectedOptions,
      ).map((opt) => opt.value),
      compliance: document
        .getElementById("compliance")
        ?.value.split("\n")
        .map((line) => {
          const [title, desc] = line.split(":");
          return {
            title: title?.trim(),
            description: desc?.trim(),
            visibility: true,
          };
        }),
      metaTitle: document.getElementById("metaTitle")?.value,
      metaDescription: document.getElementById("metaDescription")?.value,
      seoKeywords: document.getElementById("seoKeywords")?.value,
    };

    // Validate
    const validation = this.projectManager.validateProject(formData);
    if (!validation.isValid) {
      this.showToast(validation.errors[0], "error");
      return;
    }

    // Save project
    if (action === "create") {
      const newProject = this.projectManager.createProject(formData);
      this.showToast("Project created successfully!", "success");
      this.closeForm();
      this.showProjectList(this.projectManager.currentFilter);
    } else {
      const updatedProject = this.projectManager.updateProject(id, formData);
      if (updatedProject) {
        this.showToast("Project updated successfully!", "success");
        this.closeForm();
        this.showProjectList(this.projectManager.currentFilter);
      }
    }
  }

  // Edit project
  editProject(id) {
    this.openProjectForm(id);
  }

  // Set filter and reload view
  setFilter(filter) {
    window.location.href = `?filter=${filter}`;
  }

  // Toggle project status
  toggleProjectStatus(id) {
    const project = this.projectManager.toggleProjectStatus(id);
    if (project) {
      this.showToast(
        `Project ${project.status === "ongoing" ? "held" : "resumed"}`,
        "success",
      );
      this.showProjectList(this.projectManager.currentFilter);
    }
  }

  // Show delete modal
  showDeleteModal(id) {
    this.projectManager.currentProjectId = id;
    document.getElementById("deleteModal").classList.add("show");
  }

  // Close modal
  closeModal() {
    document.getElementById("deleteModal").classList.remove("show");
    this.projectManager.currentProjectId = null;
  }

  // Confirm delete
  confirmDelete() {
    if (this.projectManager.currentProjectId) {
      const success = this.projectManager.deleteProject(
        this.projectManager.currentProjectId,
      );
      if (success) {
        this.showToast("Project deleted successfully", "success");
        this.closeModal();
        this.showProjectList(this.projectManager.currentFilter);
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
      // Ctrl/Cmd + N for new project
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        this.openProjectForm();
      }

      // Escape to close modals
      if (e.key === "Escape") {
        this.closeModal();
      }
    });
  }
}

// ===== INITIALIZATION =====
// Initialize project manager and UI
const projectManager = new ProjectManager();
const uiManager = new UIManager(projectManager);

// Make available globally
window.projectManager = projectManager;
window.uiManager = uiManager;

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  uiManager.init();
});

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
    window.location.href = "../login.html"; // ← CHANGE TO YOUR REAL LOGIN PAGE
  }, 1200);
}
