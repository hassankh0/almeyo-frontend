/**
 * Notification System
 * Shows notifications in a banner format for 3 seconds
 */

function showNotification(message, type = 'info') {
  // Create or get notification container
  let container = document.getElementById('notification-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notification-container';
    document.body.appendChild(container);
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = message;

  // Add to container
  container.appendChild(notification);

  // Trigger animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Inject CSS styles
function injectNotificationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    #notification-container {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    }

    .notification {
      padding: 16px 24px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      pointer-events: auto;
      opacity: 0;
      transition: opacity 0.3s ease;
      max-width: 500px;
      text-align: center;
      word-wrap: break-word;
      animation: slideDown 0.3s ease-out;
    }

    .notification.show {
      opacity: 1;
    }

    .notification-success {
      background-color: #10b981;
      color: white;
      border-left: 4px solid #059669;
    }

    .notification-error {
      background-color: #ef4444;
      color: white;
      border-left: 4px solid #dc2626;
    }

    .notification-info {
      background-color: #3b82f6;
      color: white;
      border-left: 4px solid #2563eb;
    }

    @keyframes slideDown {
      from {
        transform: translateY(-20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 0;
      }
    }

    @media (max-width: 640px) {
      .notification {
        max-width: 90vw;
        font-size: 13px;
        padding: 12px 16px;
      }

      #notification-container {
        left: 10px;
        right: 10px;
        transform: none;
      }
    }
  `;
  document.head.appendChild(style);
}

// Initialize styles when script loads
injectNotificationStyles();
