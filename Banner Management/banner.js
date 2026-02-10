// Banner Management Module - Main Script

// ===== CONSTANTS & CONFIG =====
const CONFIG = {
    colors: {
        primary: '#211832',
        accent: '#412B6B',
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    },
    bannerTypes: ['image'],
    pages: [
        { value: 'homepage', label: 'Homepage', color: 'tag-homepage' },
        { value: 'services', label: 'Services', color: 'tag-services' },
        { value: 'projects', label: 'Projects', color: 'tag-projects' },
        { value: 'about', label: 'About Us', color: 'tag-about' },
        { value: 'contact', label: 'Contact', color: 'tag-contact' }
    ],
    statuses: [
        { value: 'active', label: 'Active', class: 'status-active' },
        { value: 'inactive', label: 'Inactive', class: 'status-inactive' },
        { value: 'scheduled', label: 'Scheduled', class: 'status-scheduled' }
    ]
};

// ===== BANNER DATA MANAGEMENT =====
class BannerManager {
    constructor() {
        this.banners = this.loadFromStorage();
        this.currentBannerId = null;
        this.currentFilter = null;
    }

    // Load banners from localStorage
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('constructpro_banners');
            return saved ? JSON.parse(saved) : this.getSampleBanners();
        } catch (error) {
            console.error('Error loading banners:', error);
            return this.getSampleBanners();
        }
    }

    // Save banners to localStorage
    saveToStorage() {
        try {
            localStorage.setItem('constructpro_banners', JSON.stringify(this.banners));
        } catch (error) {
            console.error('Error saving banners:', error);
        }
    }

    // Get sample banners for initial setup
    getSampleBanners() {
        return [
            {
                id: 1,
                title: "Summer Construction Sale",
                description: "Promotional banner for summer discounts",
                type: "image",
                page: "homepage",
                status: "active",
                priority: 1,
                startDate: "2024-06-01",
                endDate: "2024-06-30",
                heading: "Summer Construction Sale",
                subHeading: "Up to 30% off all services",
                ctaText: "Get Quote",
                ctaUrl: "/contact",
                alignment: "center",
                imageUrl: null,
                isVisible: true,
                createdAt: "2024-05-15T10:30:00",
                updatedAt: "2024-05-15T10:30:00"
            },
            {
                id: 2,
                title: "Project Showcase",
                description: "Showcase our latest construction projects",
                type: "image",
                page: "projects",
                status: "scheduled",
                priority: 2,
                startDate: "2024-07-01",
                endDate: "2024-07-31",
                heading: "Our Latest Projects",
                subHeading: "See our construction excellence",
                ctaText: "View Projects",
                ctaUrl: "/projects",
                alignment: "left",
                imageUrl: null,
                isVisible: true,
                createdAt: "2024-05-20T14:15:00",
                updatedAt: "2024-05-20T14:15:00"
            }
        ];
    }

    // Get all banners with optional filter
    getAllBanners(filter = null) {
        if (!filter) return this.banners;
        
        switch(filter) {
            case 'active':
                return this.banners.filter(b => b.status === 'active');
            case 'inactive':
                return this.banners.filter(b => b.status === 'inactive');
            case 'scheduled':
                return this.banners.filter(b => b.status === 'scheduled');
            default:
                return this.banners;
        }
    }

    // Get banner by ID
    getBannerById(id) {
        return this.banners.find(b => b.id === id);
    }

    // Create new banner
    createBanner(data) {
        const newBanner = {
            id: Date.now(),
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.banners.unshift(newBanner);
        this.saveToStorage();
        return newBanner;
    }

    // Update existing banner
    updateBanner(id, data) {
        const index = this.banners.findIndex(b => b.id === id);
        if (index === -1) return null;
        
        this.banners[index] = {
            ...this.banners[index],
            ...data,
            updatedAt: new Date().toISOString()
        };
        
        this.saveToStorage();
        return this.banners[index];
    }

    // Delete banner
    deleteBanner(id) {
        const index = this.banners.findIndex(b => b.id === id);
        if (index === -1) return false;
        
        this.banners.splice(index, 1);
        this.saveToStorage();
        return true;
    }

    // Toggle banner status
    toggleBannerStatus(id) {
        const banner = this.getBannerById(id);
        if (!banner) return null;
        
        banner.status = banner.status === 'active' ? 'inactive' : 'active';
        banner.updatedAt = new Date().toISOString();
        this.saveToStorage();
        return banner;
    }

    // Validate banner data
    validateBanner(data) {
        const errors = [];
        
        if (!data.title?.trim()) {
            errors.push('Banner title is required');
        }
        
        if (!data.page) {
            errors.push('Page placement is required');
        }
        
        if (!data.startDate || !data.endDate) {
            errors.push('Start and end dates are required');
        } else if (new Date(data.startDate) > new Date(data.endDate)) {
            errors.push('End date must be after start date');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

// ===== UI MANAGER =====
class UIManager {
    constructor(bannerManager) {
        this.bannerManager = bannerManager;
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
        const action = urlParams.get('action');
        const filter = urlParams.get('filter');
        
        this.bannerManager.currentFilter = filter;
        
        if (action === 'create' || action === 'edit') {
            const id = urlParams.get('id');
            this.showBannerForm(action, id);
        } else {
            this.showBannerList(filter);
        }
    }

    // Get filter title
    getFilterTitle(filter) {
        const titles = {
            'active': 'Active Banners',
            'inactive': 'Inactive Banners',
            'scheduled': 'Scheduled Banners',
            null: 'Banner Management'
        };
        return titles[filter] || 'Banner Management';
    }

    // Show banner list view
    showBannerList(filter = null) {
        const banners = this.bannerManager.getAllBanners(filter);
        document.getElementById('pageTitle').textContent = this.getFilterTitle(filter);
        
        const content = `
            <div class="content-header">
                <div>
                    <h2 class="text-xl font-bold text-gray-800">${this.getFilterTitle(filter)}</h2>
                    <p class="text-gray-600 text-sm">${banners.length} banner${banners.length !== 1 ? 's' : ''} found</p>
                </div>
                
                <div class="flex gap-3">
                    <div class="filter-bar">
                        <button class="filter-btn ${!filter ? 'active' : ''}" onclick="uiManager.setFilter(null)">
                            All (${this.bannerManager.banners.length})
                        </button>
                        <button class="filter-btn ${filter === 'active' ? 'active' : ''}" onclick="uiManager.setFilter('active')">
                            Active (${this.bannerManager.banners.filter(b => b.status === 'active').length})
                        </button>
                        <button class="filter-btn ${filter === 'scheduled' ? 'active' : ''}" onclick="uiManager.setFilter('scheduled')">
                            Scheduled (${this.bannerManager.banners.filter(b => b.status === 'scheduled').length})
                        </button>
                        <button class="filter-btn ${filter === 'inactive' ? 'active' : ''}" onclick="uiManager.setFilter('inactive')">
                            Inactive (${this.bannerManager.banners.filter(b => b.status === 'inactive').length})
                        </button>
                    </div>
                    
                    <button class="btn btn-primary" onclick="uiManager.openBannerForm()">
                        <i class="fas fa-plus"></i>
                        <span>Add Banner</span>
                    </button>
                </div>
            </div>
            
            ${banners.length > 0 ? `
                <div class="banner-grid">
                    ${banners.map(banner => this.renderBannerCard(banner)).join('')}
                </div>
            ` : `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-images"></i>
                    </div>
                    <h3 class="empty-title">No banners found</h3>
                    <p class="empty-message">
                        ${filter ? 'Try changing your filter or' : ''} create your first banner to get started
                    </p>
                    <button class="btn btn-primary" onclick="uiManager.openBannerForm()">
                        <i class="fas fa-plus"></i>
                        Create New Banner
                    </button>
                </div>
            `}
        `;
        
        document.getElementById('contentArea').innerHTML = content;
    }

    // Render banner card
    renderBannerCard(banner) {
        const pageConfig = CONFIG.pages.find(p => p.value === banner.page);
        const statusConfig = CONFIG.statuses.find(s => s.value === banner.status);
        
        return `
            <div class="banner-card" data-id="${banner.id}">
                <div class="banner-image">
                    <div class="banner-overlay">
                        <button class="overlay-btn" onclick="uiManager.editBanner(${banner.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="overlay-btn" onclick="uiManager.toggleBannerStatus(${banner.id})" title="${banner.status === 'active' ? 'Deactivate' : 'Activate'}">
                            <i class="fas ${banner.status === 'active' ? 'fa-pause' : 'fa-play'}"></i>
                        </button>
                        <button class="overlay-btn" onclick="uiManager.openPreview(${banner.id})" title="Preview">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="overlay-btn" onclick="uiManager.showDeleteModal(${banner.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div class="banner-content">
                    <div class="banner-header">
                        <h3 class="banner-title">${banner.title}</h3>
                        <span class="status-badge ${statusConfig.class}">
                            <i class="fas fa-circle"></i>
                            ${statusConfig.label}
                        </span>
                    </div>
                    
                    <div class="banner-meta">
                        <div class="meta-row">
                            <span class="meta-label">Page:</span>
                            <span class="page-tag ${pageConfig.color}">${pageConfig.label}</span>
                        </div>
                        
                        <div class="meta-row">
                            <span class="meta-label">Type:</span>
                            <span class="meta-value">${banner.type.charAt(0).toUpperCase() + banner.type.slice(1)}</span>
                        </div>
                        
                        <div class="meta-row">
                            <span class="meta-label">Schedule:</span>
                            <div class="text-right">
                                <div class="text-sm">${this.formatDate(banner.startDate)}</div>
                                <div class="text-xs text-gray-500">to ${this.formatDate(banner.endDate)}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="banner-actions">
                        <button class="action-btn" onclick="uiManager.editBanner(${banner.id})">
                            <i class="fas fa-edit"></i>
                            Edit
                        </button>
                        <button class="action-btn" onclick="uiManager.toggleBannerStatus(${banner.id})">
                            <i class="fas ${banner.status === 'active' ? 'fa-pause' : 'fa-play'}"></i>
                            ${banner.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button class="action-btn" onclick="uiManager.openPreview(${banner.id})">
                            <i class="fas fa-eye"></i>
                            Preview
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Open banner form overlay
    openBannerForm(id = null) {
        const action = id ? 'edit' : 'create';
        const banner = id ? this.bannerManager.getBannerById(id) : null;
        
        const formOverlay = document.createElement('div');
        formOverlay.className = 'form-overlay';
        formOverlay.innerHTML = `
            <div class="form-container">
                <div class="form-header">
                    <h2>${action === 'create' ? 'Create New Banner' : 'Edit Banner'}</h2>
                    <button class="preview-close" onclick="uiManager.closeForm()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="form-body">
                    <div class="form-grid-2">
                        <div class="form-group">
                            <label class="form-label required">Banner Title</label>
                            <input type="text" id="formTitle" class="form-input" 
                                   placeholder="Summer Construction Sale" 
                                   value="${banner ? banner.title : ''}">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label required">Page Placement</label>
                            <select id="formPage" class="form-select">
                                ${CONFIG.pages.map(page => `
                                    <option value="${page.value}" ${banner && banner.page === page.value ? 'selected' : ''}>
                                        ${page.label}
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Description</label>
                        <textarea id="formDescription" class="form-textarea" 
                                  placeholder="Brief description of this banner...">${banner ? banner.description || '' : ''}</textarea>
                    </div>
                    
                    <div class="form-grid-2">
                        <div class="form-group">
                            <label class="form-label required">Start Date</label>
                            <input type="date" id="formStartDate" class="form-input" 
                                   value="${banner ? banner.startDate : new Date().toISOString().split('T')[0]}">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label required">End Date</label>
                            <input type="date" id="formEndDate" class="form-input" 
                                   value="${banner ? banner.endDate : new Date(Date.now() + 86400000).toISOString().split('T')[0]}">
                        </div>
                    </div>
                    
                    <div class="form-grid-2">
                        <div class="form-group">
                            <label class="form-label required">Status</label>
                            <select id="formStatus" class="form-select">
                                ${CONFIG.statuses.map(status => `
                                    <option value="${status.value}" ${banner && banner.status === status.value ? 'selected' : status.value === 'active' ? 'selected' : ''}>
                                        ${status.label}
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label required">Display Order</label>
                            <select id="formPriority" class="form-select">
                                ${[1,2,3,4,5].map(num => `
                                    <option value="${num}" ${banner && banner.priority === num ? 'selected' : num === 1 ? 'selected' : ''}>
                                        Position ${num} ${num === 1 ? '(First)' : num === 5 ? '(Last)' : ''}
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-grid-2">
                        <div class="form-group">
                            <label class="form-label">Heading Text</label>
                            <input type="text" id="formHeading" class="form-input" 
                                   placeholder="Welcome to ConstructPro" 
                                   value="${banner ? banner.heading : ''}">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Sub-heading</label>
                            <input type="text" id="formSubHeading" class="form-input" 
                                   placeholder="Building excellence since 1995" 
                                   value="${banner ? banner.subHeading : ''}">
                        </div>
                    </div>
                    
                    <div class="form-grid-2">
                        <div class="form-group">
                            <label class="form-label">CTA Button Text</label>
                            <input type="text" id="formCtaText" class="form-input" 
                                   placeholder="Get Started" 
                                   value="${banner ? banner.ctaText : 'Learn More'}">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label required">CTA URL</label>
                            <input type="url" id="formCtaUrl" class="form-input" 
                                   placeholder="https://example.com/action" 
                                   value="${banner ? banner.ctaUrl : ''}">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Text Alignment</label>
                        <div class="form-radio-group">
                            <label class="radio-label">
                                <input type="radio" name="formAlignment" value="left" 
                                       ${banner && banner.alignment === 'left' ? 'checked' : ''}>
                                Left
                            </label>
                            <label class="radio-label">
                                <input type="radio" name="formAlignment" value="center" 
                                       ${(!banner || banner.alignment === 'center') ? 'checked' : 'checked'}>
                                Center
                            </label>
                            <label class="radio-label">
                                <input type="radio" name="formAlignment" value="right" 
                                       ${banner && banner.alignment === 'right' ? 'checked' : ''}>
                                Right
                            </label>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label required">Banner Image</label>
                        <div class="upload-area" onclick="document.getElementById('formImage').click()">
                            <div class="upload-icon">
                                <i class="fas fa-cloud-upload-alt"></i>
                            </div>
                            <p class="upload-text">Click to upload banner image</p>
                            <p class="upload-hint">Recommended: 1920x600px (JPG, PNG, WebP)</p>
                            <input type="file" id="formImage" class="file-input" accept="image/*">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">
                            <input type="checkbox" id="formVisible" ${(banner?.isVisible !== false) ? 'checked' : ''}>
                            Make banner visible
                        </label>
                    </div>
                </div>
                
                <div class="form-header border-t">
                    <button class="btn btn-secondary" onclick="uiManager.closeForm()">
                        Cancel
                    </button>
                    <button class="btn btn-primary" onclick="uiManager.saveBannerForm(${id ? `'edit', ${id}` : "'create'"})">
                        ${action === 'create' ? 'Create Banner' : 'Update Banner'}
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(formOverlay);
        this.isFormOpen = true;
        
        // Setup form listeners
        const uploadArea = formOverlay.querySelector('.upload-area');
        const fileInput = formOverlay.querySelector('#formImage');
        
        if (uploadArea && fileInput) {
            uploadArea.addEventListener('click', () => fileInput.click());
            
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.showToast('Image uploaded successfully', 'success');
                }
            });
        }
    }

    // Close form overlay
    closeForm() {
        const formOverlay = document.querySelector('.form-overlay');
        if (formOverlay) {
            formOverlay.remove();
        }
        this.isFormOpen = false;
    }

    // Open preview overlay
    openPreview(id) {
        const banner = this.bannerManager.getBannerById(id);
        if (!banner) return;
        
        const previewOverlay = document.createElement('div');
        previewOverlay.className = 'preview-overlay';
        previewOverlay.innerHTML = `
            <div class="preview-container">
                <div class="preview-header">
                    <h3>Banner Preview - ${banner.title}</h3>
                    <button class="preview-close" onclick="uiManager.closePreview()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="preview-content">
                    <div class="preview-device">
                        <div class="preview-screen">
                            <div class="preview-banner" style="text-align: ${banner.alignment || 'center'}">
                                <div style="max-width: 600px; margin: 0 auto; padding: 2rem;">
                                    <h2 class="preview-heading">${banner.heading || 'Your Heading Here'}</h2>
                                    <p class="preview-subheading">${banner.subHeading || 'Your sub-heading text here'}</p>
                                    <a href="#" class="preview-button">${banner.ctaText || 'Learn More'}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="p-4 bg-gray-50 rounded-lg">
                        <h4 class="font-semibold mb-2">Banner Details</h4>
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p class="text-gray-600">Page:</p>
                                <p class="font-medium">${CONFIG.pages.find(p => p.value === banner.page)?.label || 'N/A'}</p>
                            </div>
                            <div>
                                <p class="text-gray-600">Status:</p>
                                <p class="font-medium">${CONFIG.statuses.find(s => s.value === banner.status)?.label || 'N/A'}</p>
                            </div>
                            <div>
                                <p class="text-gray-600">Schedule:</p>
                                <p class="font-medium">${this.formatDate(banner.startDate)} - ${this.formatDate(banner.endDate)}</p>
                            </div>
                            <div>
                                <p class="text-gray-600">Alignment:</p>
                                <p class="font-medium">${banner.alignment?.charAt(0).toUpperCase() + banner.alignment?.slice(1) || 'Center'}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="preview-header border-t">
                    <button class="btn btn-secondary" onclick="uiManager.closePreview()">
                        Close Preview
                    </button>
                    <button class="btn btn-primary" onclick="uiManager.editBanner(${id})">
                        <i class="fas fa-edit"></i>
                        Edit Banner
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(previewOverlay);
        this.isPreviewOpen = true;
    }

    // Close preview overlay
    closePreview() {
        const previewOverlay = document.querySelector('.preview-overlay');
        if (previewOverlay) {
            previewOverlay.remove();
        }
        this.isPreviewOpen = false;
    }

    // Save banner form
    saveBannerForm(action, id = null) {
        // Collect form data
        const formData = {
            title: document.getElementById('formTitle')?.value,
            description: document.getElementById('formDescription')?.value,
            page: document.getElementById('formPage')?.value,
            type: 'image',
            status: document.getElementById('formStatus')?.value,
            priority: parseInt(document.getElementById('formPriority')?.value || 1),
            startDate: document.getElementById('formStartDate')?.value,
            endDate: document.getElementById('formEndDate')?.value,
            heading: document.getElementById('formHeading')?.value,
            subHeading: document.getElementById('formSubHeading')?.value,
            ctaText: document.getElementById('formCtaText')?.value,
            ctaUrl: document.getElementById('formCtaUrl')?.value,
            alignment: document.querySelector('input[name="formAlignment"]:checked')?.value || 'center',
            isVisible: document.getElementById('formVisible')?.checked || true
        };

        // Validate
        const validation = this.bannerManager.validateBanner(formData);
        if (!validation.isValid) {
            this.showToast(validation.errors[0], 'error');
            return;
        }

        // Save banner
        if (action === 'create') {
            const newBanner = this.bannerManager.createBanner(formData);
            this.showToast('Banner created successfully!', 'success');
            this.closeForm();
            this.showBannerList(this.bannerManager.currentFilter);
        } else {
            const updatedBanner = this.bannerManager.updateBanner(id, formData);
            if (updatedBanner) {
                this.showToast('Banner updated successfully!', 'success');
                this.closeForm();
                this.showBannerList(this.bannerManager.currentFilter);
            }
        }
    }

    // Edit banner
    editBanner(id) {
        if (this.isPreviewOpen) {
            this.closePreview();
        }
        setTimeout(() => {
            this.openBannerForm(id);
        }, 300);
    }

    // Set filter and reload view
    setFilter(filter) {
        window.location.href = `?filter=${filter}`;
    }

    // Toggle banner status
    toggleBannerStatus(id) {
        const banner = this.bannerManager.toggleBannerStatus(id);
        if (banner) {
            this.showToast(`Banner ${banner.status === 'active' ? 'activated' : 'deactivated'}`, 'success');
            this.showBannerList(this.bannerManager.currentFilter);
        }
    }

    // Show delete modal
    showDeleteModal(id) {
        this.bannerManager.currentBannerId = id;
        document.getElementById('deleteModal').classList.add('show');
    }

    // Close modal
    closeModal() {
        document.getElementById('deleteModal').classList.remove('show');
        this.bannerManager.currentBannerId = null;
    }

    // Confirm delete
    confirmDelete() {
        if (this.bannerManager.currentBannerId) {
            const success = this.bannerManager.deleteBanner(this.bannerManager.currentBannerId);
            if (success) {
                this.showToast('Banner deleted successfully', 'success');
                this.closeModal();
                this.showBannerList(this.bannerManager.currentFilter);
            }
        }
    }

    // Format date
    formatDate(dateString) {
        if (!dateString) return 'Not set';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    // Show toast notification
    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            const container = document.createElement('div');
            container.id = 'toastContainer';
            document.body.appendChild(container);
        }
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${this.getToastIcon(type)} toast-icon"></i>
            <p class="toast-message">${message}</p>
        `;
        
        document.getElementById('toastContainer').appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // Get toast icon based on type
    getToastIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Setup event listeners
    setupEventListeners() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + N for new banner
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                this.openBannerForm();
            }
            
            // Escape to close overlays
            if (e.key === 'Escape') {
                if (this.isFormOpen) {
                    this.closeForm();
                } else if (this.isPreviewOpen) {
                    this.closePreview();
                } else {
                    this.closeModal();
                }
            }
        });
    }
}

// ===== INITIALIZATION =====
// Initialize banner manager and UI
const bannerManager = new BannerManager();
const uiManager = new UIManager(bannerManager);

// Make available globally
window.bannerManager = bannerManager;
window.uiManager = uiManager;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
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