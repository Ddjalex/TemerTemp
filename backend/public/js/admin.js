// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Initialize tooltips
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Auto-hide alerts after 5 seconds
  const alerts = document.querySelectorAll('.alert:not(.alert-permanent)');
  alerts.forEach(alert => {
    setTimeout(() => {
      const bsAlert = new bootstrap.Alert(alert);
      bsAlert.close();
    }, 5000);
  });

  // Confirm delete actions
  const deleteButtons = document.querySelectorAll('[data-confirm-delete]');
  deleteButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const message = this.getAttribute('data-confirm-message') || 'Are you sure you want to delete this item?';
      if (confirm(message)) {
        const form = this.closest('form');
        if (form) {
          form.submit();
        } else {
          // Handle AJAX delete
          const url = this.getAttribute('href') || this.getAttribute('data-url');
          if (url) {
            deleteItem(url);
          }
        }
      }
    });
  });

  // Image preview functionality
  const imageInputs = document.querySelectorAll('input[type="file"][accept*="image"]');
  imageInputs.forEach(input => {
    input.addEventListener('change', function(e) {
      previewImages(this, e.target.files);
    });
  });

  // Form validation
  const forms = document.querySelectorAll('.needs-validation');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      }
      form.classList.add('was-validated');
    });
  });

  // Search functionality
  const searchInput = document.querySelector('#searchInput');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        performSearch(this.value);
      }, 500);
    });
  }

  // Sidebar active link highlighting
  highlightActiveNavLink();

  // Auto-resize textareas
  const textareas = document.querySelectorAll('textarea[data-auto-resize]');
  textareas.forEach(textarea => {
    autoResizeTextarea(textarea);
    textarea.addEventListener('input', () => autoResizeTextarea(textarea));
  });
});

// Delete item function
function deleteItem(url) {
  showSpinner();
  
  fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
  .then(response => response.json())
  .then(data => {
    hideSpinner();
    if (data.success) {
      showAlert('success', data.message || 'Item deleted successfully');
      // Reload page after short delay
      setTimeout(() => {
        location.reload();
      }, 1000);
    } else {
      showAlert('danger', data.error || 'Failed to delete item');
    }
  })
  .catch(error => {
    hideSpinner();
    console.error('Delete error:', error);
    showAlert('danger', 'An error occurred while deleting the item');
  });
}

// Image preview function
function previewImages(input, files) {
  const previewContainer = document.querySelector('#imagePreview') || createPreviewContainer(input);
  previewContainer.innerHTML = '';

  Array.from(files).forEach((file, index) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const previewDiv = document.createElement('div');
        previewDiv.className = 'image-preview-container';
        previewDiv.innerHTML = `
          <img src="${e.target.result}" class="image-preview" alt="Preview ${index + 1}">
          <button type="button" class="image-preview-remove" onclick="removeImagePreview(this)">
            <i class="bi bi-x"></i>
          </button>
        `;
        previewContainer.appendChild(previewDiv);
      };
      reader.readAsDataURL(file);
    }
  });
}

// Create preview container
function createPreviewContainer(input) {
  const container = document.createElement('div');
  container.id = 'imagePreview';
  container.className = 'mt-3';
  input.parentNode.insertBefore(container, input.nextSibling);
  return container;
}

// Remove image preview
function removeImagePreview(button) {
  button.parentElement.remove();
}

// Show alert
function showAlert(type, message) {
  const alertContainer = document.querySelector('#alertContainer') || createAlertContainer();
  const alert = document.createElement('div');
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  alertContainer.appendChild(alert);

  // Auto-hide after 5 seconds
  setTimeout(() => {
    const bsAlert = new bootstrap.Alert(alert);
    bsAlert.close();
  }, 5000);
}

// Create alert container
function createAlertContainer() {
  const container = document.createElement('div');
  container.id = 'alertContainer';
  container.className = 'position-fixed top-0 end-0 p-3';
  container.style.zIndex = '9999';
  document.body.appendChild(container);
  return container;
}

// Show loading spinner
function showSpinner() {
  let spinner = document.querySelector('#loadingSpinner');
  if (!spinner) {
    spinner = document.createElement('div');
    spinner.id = 'loadingSpinner';
    spinner.className = 'spinner-overlay';
    spinner.innerHTML = `
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    `;
    document.body.appendChild(spinner);
  }
  spinner.style.display = 'flex';
}

// Hide loading spinner
function hideSpinner() {
  const spinner = document.querySelector('#loadingSpinner');
  if (spinner) {
    spinner.style.display = 'none';
  }
}

// Highlight active navigation link
function highlightActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.sidebar .nav-link');
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    const linkPath = new URL(link.href).pathname;
    
    if (currentPath === linkPath || (linkPath !== '/admin/dashboard' && currentPath.startsWith(linkPath))) {
      link.classList.add('active');
    }
  });
}

// Auto-resize textarea
function autoResizeTextarea(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}

// Perform search
function performSearch(query) {
  if (query.length < 2) return;
  
  const currentUrl = new URL(window.location);
  currentUrl.searchParams.set('search', query);
  currentUrl.searchParams.set('page', '1'); // Reset to first page
  
  window.location.href = currentUrl.toString();
}

// Utility functions
const AdminUtils = {
  // Format currency
  formatCurrency: function(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  },

  // Format date
  formatDate: function(date, options = {}) {
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(new Date(date));
  },

  // Debounce function
  debounce: function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Copy to clipboard
  copyToClipboard: function(text) {
    navigator.clipboard.writeText(text).then(() => {
      showAlert('success', 'Copied to clipboard');
    }).catch(() => {
      showAlert('danger', 'Failed to copy to clipboard');
    });
  }
};

// Make AdminUtils globally available
window.AdminUtils = AdminUtils;