document.addEventListener('DOMContentLoaded', function () {
    const autoRefreshToggle = document.getElementById('autoRefreshToggle');
    let autoRefreshInterval;

    function refreshData() {
        // Add your data refreshing logic here
        console.log('Refreshing data...');
    }

    autoRefreshToggle.addEventListener('change', function () {
        if (this.checked) {
            autoRefreshInterval = setInterval(refreshData, 5000); // Refresh every 5 seconds
        } else {
            clearInterval(autoRefreshInterval);
        }
    });

    // Other functions from the original file
    function toggleSection(header, sectionId) {
        const section = document.getElementById(sectionId);
        const icon = header.querySelector('.toggle-icon');
        section.classList.toggle('collapsed');
        icon.classList.toggle('collapsed');
    }

    window.toggleSection = toggleSection;
});
