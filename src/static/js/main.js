document.getElementById("copyright-year").textContent = new Date().getFullYear();

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function scrollToBottom() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
    });
}

function showNotification(message, type = "success", duration = 3000) {
    const notification = document.getElementById("notification") || createNotificationElement();
    if (!notification) return;

    notification.textContent = message;
    notification.className = "notification show";
    if (type === "error") {
        notification.classList.add("error");
    }

    if (notification.timeoutId) {
        clearTimeout(notification.timeoutId);
    }

    notification.timeoutId = setTimeout(() => {
        notification.classList.remove("show");
    }, duration);
}

function createNotificationElement() {
    let notification = document.getElementById("notification");
    if (!notification) {
        notification = document.createElement("div");
        notification.id = "notification";
        notification.className = "notification";
        document.body.appendChild(notification);
    }
    return notification;
}

function refreshPage(button) {
    if (button) {
        const icon = button.querySelector("i");
        if (icon) {
            icon.classList.add("loading-spin");
        }
    }
    setTimeout(() => {
        window.location.reload();
    }, 300);
}

const versionInfoContainer = document.getElementById("version-info-container");

async function fetchVersionInfo() {
    if (!versionInfoContainer) return;
    versionInfoContainer.innerHTML = '<span class="mx-1">|</span><span class="text-xs text-gray-700">检查更新中...</span>';

    try {
        const response = await fetch("/api/version/check");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        let versionHtml = `<span class="mx-1">|</span><span class="text-xs text-gray-800">v${data.current_version}</span>`;
        if (data.update_available) {
            versionHtml += `
                        <span class="mx-1">|</span>
                        <a href="https://github.com/snailyp/gemini-balance/releases/latest" target="_blank" class="text-yellow-600 hover:text-yellow-800 transition duration-300 animate-pulse">
                            <i class="fas fa-arrow-up"></i> 新版本: v${data.latest_version}
                        </a>`;
        } else if (data.error_message) {
            versionHtml += `
                        <span class="mx-1">|</span>
                        <span class="text-xs text-red-500" title="${data.error_message}">更新检查失败</span>`;
        } else {
            versionHtml += `<span class="mx-1">|</span><span class="text-xs text-green-500">已是最新</span>`;
        }
        versionInfoContainer.innerHTML = versionHtml;
    } catch (error) {
        console.error("Error fetching version info:", error);
        versionInfoContainer.innerHTML = `<span class="mx-1">|</span><span class="text-xs text-red-500" title="无法连接到服务器或解析响应">更新检查失败</span>`;
    }
}

fetchVersionInfo();

setInterval(fetchVersionInfo, 3600000);
