import { db, collection, onSnapshot, query, orderBy } from './firebase-config.js';

const ADMIN_PASSWORD = "ceet2026"; // Senha didática simples

const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const btnLogin = document.getElementById('btn-login');
const inputPassword = document.getElementById('admin-password');
const loginError = document.getElementById('login-error');
const rankingBody = document.getElementById('ranking-body');
const connectionStatus = document.getElementById('connection-status');
const btnExport = document.getElementById('btn-export');
const btnLogout = document.getElementById('btn-logout');

let resultsData = [];

// --- LOGIN SIMPLES ---
btnLogin.addEventListener('click', checkLogin);
inputPassword.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkLogin();
});
btnLogout.addEventListener('click', () => {
    sessionStorage.removeItem('adminLogged');
    location.reload();
});

function checkLogin() {
    if (inputPassword.value === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminLogged', 'true');
        loginError.classList.add('hidden');
        showDashboard();
    } else {
        loginError.classList.remove('hidden');
    }
}

// Verifica se já logou na sessão atual
if (sessionStorage.getItem('adminLogged') === 'true') {
    showDashboard();
}

function showDashboard() {
    loginScreen.classList.add('hidden');
    dashboardScreen.classList.remove('hidden');
    initFirebaseListener();
}

// --- INTEGRAÇÃO FIREBASE (RANKING) ---
function initFirebaseListener() {
    if (!db) {
        connectionStatus.textContent = "Offline (Mostrando dados locais)";
        connectionStatus.style.background = "#FEF2F2";
        connectionStatus.style.color = "#B91C1C";
        
        // Puxar do localStorage se o firebase não estiver configurado
        const localData = JSON.parse(localStorage.getItem('quizBackupResults') || '[]');
        processRankingData(localData);
        return;
    }

    connectionStatus.textContent = "Conectado ao vivo";
    connectionStatus.style.background = "#ECFDF5";
    connectionStatus.style.color = "#059669";

    const q = query(collection(db, "quizResults"));
    
    // Escuta em tempo real
    onSnapshot(q, (snapshot) => {
        const data = [];
        snapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });
        processRankingData(data);
    }, (error) => {
        console.error("Erro ao escutar Firestore:", error);
        connectionStatus.textContent = "Erro de conexão";
        connectionStatus.style.background = "#FEF2F2";
    });
}

function processRankingData(data) {
    // Regras de Ordenação: 1. Pontuação (desc), 2. % Acertos (desc), 3. Tempo Total (asc)
    data.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.percentage !== a.percentage) return b.percentage - a.percentage;
        return a.totalTimeSeconds - b.totalTimeSeconds; // Menor tempo ganha
    });

    resultsData = data; // Guardar para exportação
    renderTable(data);
}

function renderTable(data) {
    rankingBody.innerHTML = '';

    if (data.length === 0) {
        rankingBody.innerHTML = '<tr><td colspan="7" class="center">Nenhum resultado registrado ainda.</td></tr>';
        return;
    }

    data.forEach((item, index) => {
        const tr = document.createElement('tr');
        
        // Estilo de pódio
        let rankClass = '';
        if (index === 0) rankClass = 'rank-1';
        else if (index === 1) rankClass = 'rank-2';
        else if (index === 2) rankClass = 'rank-3';

        const dateObj = new Date(item.completedAt);
        const dateStr = !isNaN(dateObj) ? dateObj.toLocaleString('pt-BR') : 'Data inválida';

        tr.innerHTML = `
            <td class="${rankClass}">${index + 1}º</td>
            <td style="font-weight: 500;">${item.studentName}</td>
            <td>${item.className}</td>
            <td style="font-weight: bold; color: var(--primary-color);">${item.score}</td>
            <td>${item.percentage}% (${item.correctAnswers}/${item.correctAnswers + item.wrongAnswers + item.unanswered})</td>
            <td>${item.totalTimeSeconds}s</td>
            <td style="font-size: 0.85rem; color: var(--text-muted);">${dateStr}</td>
        `;
        rankingBody.appendChild(tr);
    });
}

// --- EXPORTAÇÃO CSV ---
btnExport.addEventListener('click', exportCSV);

function exportCSV() {
    if (resultsData.length === 0) {
        alert("Não há dados para exportar.");
        return;
    }

    // Cabeçalhos
    const headers = [
        "Posicao", "Aluno", "Turma", "Pontuacao", 
        "Acertos", "Erros", "Nao Respondidas", 
        "Percentual", "Tempo_Segundos", "Data_Hora"
    ];

    // Linhas
    const rows = resultsData.map((item, index) => {
        return [
            index + 1,
            `"${item.studentName}"`,
            `"${item.className}"`,
            item.score,
            item.correctAnswers,
            item.wrongAnswers,
            item.unanswered,
            item.percentage,
            item.totalTimeSeconds,
            `"${item.completedAt}"`
        ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ranking_quiz_info_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    
    link.click();
    document.body.removeChild(link);
}
