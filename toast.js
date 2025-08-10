(function () {
  // Ensure a single shared container
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    document.body.appendChild(toastContainer);
  }

  /**
   * Display a toast notification.
   * @param {string} message   - Text to show.
   * @param {string} [type]    - 'info' | 'success' | 'warning' | 'error' (CSS driven).
   * @param {number} [duration]- Visible time in ms before fade (default 4000).
   */
  window.showToast = function (message, type = "info", duration = 4000) {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.textContent = message;

    // Optional: click to dismiss early
    toast.addEventListener("click", () => {
      fadeAndRemoveToast(toast);
    });

    toastContainer.appendChild(toast);

    // (If using CSS transition for entrance)
    requestAnimationFrame(() => {
      toast.classList.add("show"); // style this in CSS if you want fade-in
    });

    // Auto-dismiss after duration
    const hideTimer = setTimeout(() => {
      fadeAndRemoveToast(toast);
    }, duration);

    // Store so we can clear if user clicks
    toast._hideTimer = hideTimer;
  };

  function fadeAndRemoveToast(toastEl) {
    if (toastEl._hideTimer) clearTimeout(toastEl._hideTimer);
    toastEl.classList.add("fade-out");
    // Wait for CSS transition end, then remove
    toastEl.addEventListener(
      "transitionend",
      () => {
        toastEl.remove();
      },
      { once: true }
    );
    // Fallback remove in 600ms if transition not supported
    setTimeout(() => {
      if (toastEl.isConnected) toastEl.remove();
    }, 600);
  }
})();

