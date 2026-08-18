const API_URL = window.location.hostname === 'localhost' 
    ? '/api/posts' 
    : 'https://webworkers-serviceworkers-iaam.onrender.com/api/posts';

class App {
    constructor() {
        this.elements = {
            loadingState: document.getElementById('loadingState'),
            errorState: document.getElementById('errorState'),
            dataContent: document.getElementById('dataContent'),
            dataList: document.getElementById('dataList'),
            retryButton: document.getElementById('retryButton'),
            statusText: document.getElementById('statusText'),
            statusIndicator: document.getElementById('statusIndicator'),
            errorStatusText: document.getElementById('errorStatusText'),
            errorStatusIndicator: document.getElementById('errorStatusIndicator'),
            errorMessage: document.getElementById('errorMessage'),
            dataStatusText: document.getElementById('dataStatusText'),
            dataStatusIndicator: document.getElementById('dataStatusIndicator')
        };
        this.init();
    }

    init() {
        this.elements.retryButton.addEventListener('click', () => this.loadData());

        window.addEventListener('online', () => {
            this.updateNetworkStatus();
            if (this.elements.errorState.style.display !== 'none') {
                this.loadData();
            }
        });

        window.addEventListener('offline', () => {
            this.updateNetworkStatus();
            this.showError('Нет подключения к сети');
        });

        this.loadData();
    }

    updateNetworkStatus() {
        const isOnline = navigator.onLine;
        const statusText = isOnline ? 'Подключено' : 'Нет подключения';
        const indicatorClass = isOnline ? 'online' : 'offline';

        if (this.elements.loadingState.style.display !== 'none') {
            this.elements.statusText.textContent = statusText;
            this.elements.statusIndicator.className = `status-indicator ${indicatorClass}`;
        }
    }

    async loadData() {
        this.showLoading();

        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            await new Promise(resolve => setTimeout(resolve, 1500));
            this.displayData(data);
            this.showSuccess();
        } catch (error) {
            console.error('Error:', error);
            if (!navigator.onLine) {
                this.showError('Нет подключения к интернету');
            } else {
                this.showError('Ошибка загрузки данных. Попробуйте позже.');
            }
        }
    }

    showLoading() {
        this.elements.loadingState.style.display = 'block';
        this.elements.errorState.style.display = 'none';
        this.elements.dataContent.classList.remove('visible');
        this.elements.statusText.textContent = 'Загрузка...';
        this.elements.statusIndicator.className = 'status-indicator online';
    }

    displayData(data) {
        const list = this.elements.dataList;
        list.innerHTML = '';
        data.slice(0, 5).forEach(post => {
            const item = document.createElement('div');
            item.className = 'data-item';
            item.innerHTML = `
                <h3>${this.escapeHtml(post.title)}</h3>
                <p>${this.escapeHtml(post.body)}</p>
            `;
            list.appendChild(item);
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showSuccess() {
        this.elements.loadingState.style.display = 'none';
        this.elements.errorState.style.display = 'none';
        this.elements.dataContent.classList.add('visible');
        this.elements.dataStatusText.textContent = 'Данные успешно загружены';
        this.elements.dataStatusIndicator.className = 'status-indicator online';
    }

    showError(message) {
        this.elements.loadingState.style.display = 'none';
        this.elements.errorState.style.display = 'block';
        this.elements.errorMessage.textContent = `${message}`;
        this.elements.errorMessage.classList.add('visible');
        this.elements.retryButton.classList.add('visible');
        this.elements.errorStatusText.textContent = message;
        this.elements.errorStatusIndicator.className = 'status-indicator offline';
    }
}

export default App;