import { db, collection, onSnapshot, query, orderBy } from './firebase-config.js';

const ADMIN_PASSWORD = "ceet2026"; // Senha didática simples

const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const btnLogin = document.getElementById('btn-login');
const inputPassword = document.getElementById('admin-password');
const loginError = document.getElementById('login-error');
const podiumContainer = document.getElementById('podium-container');
const rankingList = document.getElementById('ranking-list');
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

    console.log("Firebase conectado! Inicializando listener para a coleção 'quizResults'...");
    connectionStatus.textContent = "Conectado ao vivo";
    connectionStatus.style.background = "#ECFDF5";
    connectionStatus.style.color = "#059669";

    const q = query(collection(db, "quizResults"));
    
    // Escuta em tempo real
    onSnapshot(q, (snapshot) => {
        console.log(`Coleção encontrada. Quantidade de documentos recebidos: ${snapshot.size}`);
        const data = [];
        snapshot.forEach((doc) => {
            console.log(`Dados recebidos do documento ${doc.id}:`, doc.data());
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
    // Regras de Ordenação: 1. Pontuação (desc), 2. Tempo Total (asc)
    data.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.totalTimeSeconds - b.totalTimeSeconds; // Menor tempo ganha
    });

    resultsData = data; // Guardar para exportação
    renderRanking(data);
}

function renderRanking(data) {
    if (data.length === 0) {
        podiumContainer.innerHTML = '';
        rankingList.innerHTML = '<div class="center" style="padding: 20px;">Nenhum resultado registrado ainda.</div>';
        return;
    }

    // --- RENDER PODIUM (Top 3) ---
    const top3 = data.slice(0, 3);
    podiumContainer.innerHTML = '';
    
    // Ordem visual do Pódio: 2º, 1º, 3º
    const podiumOrder = [1, 0, 2];
    podiumOrder.forEach(idx => {
        if (top3[idx]) {
            const item = top3[idx];
            const place = idx + 1;
            const avatarPath = item.avatar ? `avatars/${item.avatar}` : 'avatars/avatar-01.svg';
            const html = `
                <div class="podium-place place-${place} animate-up">
                    <img src="${avatarPath}" class="podium-avatar" alt="Avatar">
                    <div class="podium-block">
                        <span class="podium-name">${item.studentName || 'N/A'}</span>
                        <span class="podium-score">${item.score || 0} pts</span>
                    </div>
                </div>
            `;
            podiumContainer.innerHTML += html;
        }
    });

    // --- RENDER LISTA ---
    rankingList.innerHTML = '';
    data.forEach((item, index) => {
        const place = index + 1;
        const avatarPath = item.avatar ? `avatars/${item.avatar}` : 'avatars/avatar-01.svg';
        
        let rankStyle = '';
        if (place === 1) rankStyle = 'color: #D97706;';
        else if (place === 2) rankStyle = 'color: #6B7280;';
        else if (place === 3) rankStyle = 'color: #92400E;';

        const card = document.createElement('div');
        card.className = 'ranking-card';
        card.dataset.id = item.id;
        card.innerHTML = `
            <div class="card-pos" style="${rankStyle}">${place}º</div>
            <img src="${avatarPath}" class="card-avatar" alt="Avatar">
            <div class="card-info">
                <div class="card-name">${item.studentName || 'N/A'}</div>
                <div class="card-class">${item.className || 'N/A'}</div>
            </div>
            <div class="card-stats">
                <div class="card-score">${item.score || 0} pts</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">
                    ${item.correctAnswers !== undefined ? item.correctAnswers : 'N/A'} acertos | ${item.totalTimeSeconds !== undefined ? item.totalTimeSeconds : 0}s
                </div>
            </div>
        `;
        rankingList.appendChild(card);
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
