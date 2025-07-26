document.addEventListener('DOMContentLoaded', function () {
    // Mock data for error logs
    const errorLogs = [
        { id: 1, key: 'key1', errorType: 'Error', errorCode: 500, modelName: 'model1', requestTime: new Date().toISOString() },
        { id: 2, key: 'key2', errorType: 'Error', errorCode: 500, modelName: 'model2', requestTime: new Date().toISOString() },
    ];

    const tableBody = document.getElementById('errorLogsTable');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const noDataMessage = document.getElementById('noDataMessage');

    function renderTable(logs) {
        tableBody.innerHTML = '';
        if (logs.length === 0) {
            noDataMessage.classList.remove('hidden');
            return;
        }
        noDataMessage.classList.add('hidden');
        logs.forEach(log => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-3 py-3 text-center"><input type="checkbox" class="form-checkbox h-4 w-4 text-blue-500 border-gray-500 rounded focus:ring-blue-500 bg-transparent" /></td>
                <td class="px-5 py-3">${log.id}</td>
                <td class="px-5 py-3">${log.key}</td>
                <td class="px-5 py-3">${log.errorType}</td>
                <td class="px-5 py-3">${log.errorCode}</td>
                <td class="px-5 py-3">${log.modelName}</td>
                <td class="px-5 py-3">${log.requestTime}</td>
                <td class="px-5 py-3 text-center"><button class="btn-view-details">View</button></td>
            `;
            tableBody.appendChild(row);
        });
    }

    loadingIndicator.classList.add('hidden');
    renderTable(errorLogs);
});
