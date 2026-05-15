import { db, collection, addDoc } from './firebase-config.js';

// --- BANCO DE QUESTÕES (50 Questões) ---
const questions = [
    {
        id: 1, type: "single",
        question: "Antes de formatar um computador de um cliente, qual deve ser uma das primeiras ações do técnico?",
        options: ["Apagar todas as partições imediatamente", "Fazer backup dos arquivos importantes", "Instalar os drivers de vídeo", "Atualizar o navegador"],
        correctAnswer: [1],
        explanation: "Antes de qualquer formatação, o técnico deve verificar se existem arquivos importantes e realizar backup para evitar perda de dados."
    },
    {
        id: 2, type: "true_false",
        question: "O acesso ao Setup (BIOS/UEFI) geralmente é feito pressionando uma tecla específica (como DEL, F2 ou F10) logo após ligar o computador.",
        options: ["Verdadeiro", "Falso"],
        correctAnswer: [0],
        explanation: "Verdadeiro. Cada fabricante define uma tecla (DEL, F2, F10, etc.) que deve ser pressionada durante o POST para acessar o Setup."
    },
    {
        id: 3, type: "single",
        question: "Qual a diferença principal entre BIOS e UEFI?",
        options: ["A BIOS é mais recente e suporta mouse, a UEFI é antiga e apenas em texto", "UEFI é a interface moderna que substituiu a BIOS, suportando discos maiores que 2TB e interface gráfica", "Ambas são idênticas, mudando apenas o nome", "A BIOS é usada apenas no Linux e UEFI no Windows"],
        correctAnswer: [1],
        explanation: "O UEFI (Unified Extensible Firmware Interface) é o padrão moderno que substitui a antiga BIOS, permitindo boot mais rápido, interface gráfica e suporte a discos muito grandes (GPT)."
    },
    {
        id: 4, type: "multiple",
        question: "Quais dos sistemas de arquivos abaixo são suportados nativamente e comumente usados no Windows e Linux, respectivamente? (Marque 2 opções)",
        options: ["NTFS (Windows)", "EXT4 (Linux)", "APFS (Apple)", "FAT16 (Ambos)"],
        correctAnswer: [0, 1],
        explanation: "O NTFS é o sistema de arquivos padrão do Windows atual, enquanto o EXT4 é amplamente utilizado nas distribuições Linux."
    },
    {
        id: 5, type: "single",
        question: "O que significa alterar a 'Ordem de Boot' (Boot Sequence) no Setup?",
        options: ["Aumentar a velocidade do processador", "Mudar a ordem em que o computador procura um sistema operacional para iniciar", "Formatar o disco rígido", "Atualizar a versão da BIOS"],
        correctAnswer: [1],
        explanation: "A Ordem de Boot define qual dispositivo (Pendrive, HD, SSD, DVD) o computador tentará ler primeiro para carregar o sistema operacional."
    },
    {
        id: 6, type: "single",
        question: "Para instalar o Windows via pendrive, você precisa criar uma 'mídia de instalação bootável'. Qual ferramenta oficial da Microsoft faz isso?",
        options: ["Windows Defender", "Media Creation Tool", "Gerenciador de Tarefas", "Prompt de Comando"],
        correctAnswer: [1],
        explanation: "O Media Creation Tool (Ferramenta de Criação de Mídia) é o utilitário oficial da Microsoft para baixar a ISO do Windows e criar um pendrive bootável."
    },
    {
        id: 7, type: "single",
        question: "O que é um 'Dual Boot'?",
        options: ["Usar dois monitores no mesmo computador", "Configurar o computador para ter dois sistemas operacionais instalados, permitindo escolher qual iniciar", "Instalar o Windows duas vezes para backup", "Usar dois processadores na mesma placa-mãe"],
        correctAnswer: [1],
        explanation: "Dual Boot é a configuração onde dois ou mais sistemas operacionais (ex: Windows e Ubuntu) estão instalados no mesmo disco, oferecendo um menu de escolha ao ligar o PC."
    },
    {
        id: 8, type: "true_false",
        question: "Durante uma 'Instalação Limpa' (Clean Install) do Windows, todos os arquivos, programas e configurações do disco C: são apagados.",
        options: ["Verdadeiro", "Falso"],
        correctAnswer: [0],
        explanation: "Verdadeiro. A Instalação Limpa envolve a formatação da partição do sistema, apagando tudo para instalar o sistema operacional do zero."
    },
    {
        id: 9, type: "single",
        question: "Ao particionar um disco MBR, qual o limite de partições PRIMÁRIAS que podem ser criadas?",
        options: ["2", "4", "8", "Sem limite"],
        correctAnswer: [1],
        explanation: "O padrão MBR (Master Boot Record) tem um limite arquitetural de no máximo 4 partições primárias por disco."
    },
    {
        id: 10, type: "single",
        question: "Qual o principal objetivo de particionar o disco separando o Sistema Operacional (C:) e os Arquivos de Usuário (D:)?",
        options: ["Deixar o PC mais lento", "Facilitar uma futura formatação do sistema sem precisar apagar os arquivos pessoais", "Aumentar o espaço total do disco", "Evitar a instalação de vírus"],
        correctAnswer: [1],
        explanation: "Separar o sistema dos dados permite formatar apenas a unidade C: quando o Windows der problema, preservando os arquivos do usuário na unidade D:."
    },
    { id: 11, type: "multiple", question: "Quais dessas ações fazem parte do diagnóstico inicial de um computador ANTES de decidir formatá-lo? (Marque as corretas)", options: ["Verificar a saúde do disco (SMART)", "Testar se há superaquecimento", "Apagar todos os dados do cliente", "Testar a memória RAM"], correctAnswer: [0, 1, 3], explanation: "O diagnóstico de hardware (Disco, Temperatura, RAM) é crucial, pois se o HD estiver danificado, formatar não resolverá a lentidão." },
    { id: 12, type: "single", question: "Ao iniciar a formatação, o pendrive bootável não é reconhecido. Qual o procedimento mais provável para corrigir isso?", options: ["Trocar o monitor", "Acessar a BIOS/UEFI e desativar o Secure Boot ou mudar o modo UEFI/Legacy", "Limpar a memória RAM", "Comprar um novo HD"], correctAnswer: [1], explanation: "Muitas vezes o pendrive não dá boot porque a UEFI está configurada para Secure Boot ativado ou está apenas em modo UEFI e o pendrive foi criado em modo Legacy (CSM)." },
    { id: 13, type: "true_false", question: "Sistemas de arquivos FAT32 suportam arquivos individuais maiores que 4GB.", options: ["Verdadeiro", "Falso"], correctAnswer: [1], explanation: "Falso. O limite máximo para um único arquivo no sistema FAT32 é de 4GB. Para arquivos maiores, deve-se usar NTFS ou exFAT." },
    { id: 14, type: "single", question: "Após instalar o Windows, a tela está com resolução muito baixa e os ícones enormes. Qual é a provável causa?", options: ["O monitor está quebrado", "Falta instalar o driver de vídeo (Placa Gráfica)", "O Windows está com vírus", "A memória RAM está cheia"], correctAnswer: [1], explanation: "Sem o driver de vídeo correto instalado pelo fabricante, o Windows usa um driver genérico básico de baixa resolução." },
    { id: 15, type: "single", question: "O que é o Windows Update?", options: ["Um programa de edição de imagens", "Uma ferramenta integrada do Windows responsável por baixar e instalar atualizações de segurança e drivers", "Um antivírus pago", "Um jogo do Windows"], correctAnswer: [1], explanation: "O Windows Update é essencial após a instalação para garantir que o sistema receba patches de segurança e drivers de hardware atualizados." },
    { id: 16, type: "multiple", question: "Quais desses são softwares essenciais que um técnico deve instalar após formatar um PC para um usuário comum? (Marque as opções corretas)", options: ["Navegador de Internet atualizado (ex: Chrome, Firefox)", "Leitor de PDF", "Ambiente de Desenvolvimento (IDE) como Visual Studio", "Pacote Office ou alternativa livre (ex: LibreOffice)"], correctAnswer: [0, 1, 3], explanation: "Navegador, Leitor de PDF e pacote Office são softwares de uso cotidiano de quase 100% dos usuários domésticos e de escritório." },
    { id: 17, type: "true_false", question: "É uma boa prática entregar o computador formatado ao cliente sem nenhum antivírus instalado, para não pesar o sistema.", options: ["Verdadeiro", "Falso"], correctAnswer: [1], explanation: "Falso. A segurança é fundamental. O Windows já vem com o Windows Defender, que deve estar ativo e atualizado antes de entregar a máquina." },
    { id: 18, type: "single", question: "Ao criar um pendrive bootável do Linux (ex: Ubuntu), qual formato de arquivo é mais comumente recomendado pela ferramenta Rufus para manter compatibilidade UEFI?", options: ["NTFS", "FAT32", "EXT2", "HFS+"], correctAnswer: [1], explanation: "Para partições de boot UEFI, o padrão amplamente exigido pelas placas-mãe é que a partição EFI esteja em FAT32." },
    { id: 19, type: "single", question: "Qual a função do 'Gerenciador de Dispositivos' (Device Manager) no Windows?", options: ["Desinstalar jogos", "Visualizar todo o hardware conectado e verificar se há drivers faltando ou com erro", "Aumentar a memória RAM", "Acessar a internet"], correctAnswer: [1], explanation: "É a ferramenta principal do técnico para auditar se todos os componentes (rede, vídeo, som) foram instalados corretamente pós-formatação." },
    { id: 20, type: "multiple", question: "O que pode acontecer se o computador for desligado repentinamente DURANTE a instalação do sistema operacional? (Marque as opções possíveis)", options: ["Corromper os arquivos do sistema", "A instalação ser cancelada e o computador não iniciar", "A instalação continuar normalmente depois", "O disco rígido pode apresentar erros lógicos"], correctAnswer: [0, 1, 3], explanation: "Interromper a gravação de arquivos de sistema fatalmente corrompe a instalação, exigindo recomeçar do zero, e pode gerar erros lógicos na tabela de partições." },
    { id: 21, type: "true_false", question: "A partição 'Reservada pelo Sistema' (System Reserved) ou partição 'EFI' deve ser sempre excluída para liberar espaço para o usuário.", options: ["Verdadeiro", "Falso"], correctAnswer: [1], explanation: "Falso. Essas partições contêm os arquivos essenciais de inicialização (bootloader). Apagá-las fará com que o Windows não inicie mais." },
    { id: 22, type: "single", question: "Um cliente pede para manter os arquivos dele durante a formatação, mas ele só possui uma partição (C:) no disco. O que o técnico deve fazer?", options: ["Formatar normalmente, não tem como salvar", "Fazer o backup dos arquivos para um HD Externo ou Pendrive antes de iniciar a formatação", "Criar uma pasta nova e instalar o Windows dentro dela", "Tentar instalar por cima sem formatar e torcer para dar certo"], correctAnswer: [1], explanation: "A regra de ouro é: os dados devem ser salvos em uma mídia externa segura antes de tocar nas partições do cliente." },
    { id: 23, type: "single", question: "No Linux, o diretório equivalente ao C: onde os arquivos do sistema principal ficam armazenados é representado por qual símbolo?", options: ["C:\\", "/ (Raiz ou Root)", "/home", "/system"], correctAnswer: [1], explanation: "No Linux, a estrutura de diretórios inicia a partir do diretório raiz, representado por uma barra invertida (/). Tudo é montado a partir dele." },
    { id: 24, type: "multiple", question: "Quais são desvantagens de instalar um sistema operacional pirateado ou modificado (não original)?", options: ["Maior desempenho", "Presença de malwares ou backdoors ocultos", "Falta de atualizações de segurança críticas", "Instabilidade e telas azuis frequentes"], correctAnswer: [1, 2, 3], explanation: "ISOs baixadas de fontes não oficiais frequentemente contêm vírus ou removem serviços essenciais do Windows, causando instabilidade e riscos graves de segurança." },
    { id: 25, type: "true_false", question: "Após a instalação do Windows e dos drivers, é recomendável verificar se o som, o Wi-Fi e a câmera estão funcionando antes de entregar o equipamento.", options: ["Verdadeiro", "Falso"], correctAnswer: [0], explanation: "Verdadeiro. O processo de Manutenção de Computadores só termina após a etapa de Qualidade e Testes." },
    { id: 26, type: "single", question: "O cliente reclama que o PC demora muito para ligar após a formatação. Ele tem um HD mecânico (Disco Rígido). Qual a melhor sugestão de hardware para resolver isso definitivamente?", options: ["Colocar mais coolers", "Trocar o HD Mecânico por um SSD", "Mudar a fonte de alimentação", "Instalar outro antivírus"], correctAnswer: [1], explanation: "A troca de HD por SSD é a atualização que mais impacta positivamente na velocidade de inicialização e abertura de programas de qualquer computador." },
    { id: 27, type: "single", question: "Ao instalar o Ubuntu (Linux), o assistente pergunta onde você quer instalar e oferece criar uma partição 'Swap'. O que é Swap?", options: ["Uma partição para fotos", "Área de troca no disco rígido usada como extensão da memória RAM", "A partição de boot", "Um vírus do Linux"], correctAnswer: [1], explanation: "A memória Swap é usada pelo Linux quando a memória RAM física fica cheia, evitando que o sistema trave ao custo de lentidão (pois o disco é mais lento que a RAM)." },
    { id: 28, type: "multiple", question: "Como você pode obter os drivers corretos para uma placa-mãe após a instalação do sistema? (Marque as opções recomendadas)", options: ["Baixar do site oficial do fabricante (ex: ASUS, Gigabyte)", "Usar o Windows Update", "Baixar do primeiro link do Google, não importa o site", "Usar programas genéricos desconhecidos que prometem atualizar tudo sozinhos"], correctAnswer: [0, 1], explanation: "A forma mais segura é via Windows Update ou baixando diretamente na página de suporte do fabricante da placa-mãe ou notebook." },
    { id: 29, type: "true_false", question: "Se o computador tem 16GB de RAM, eu devo obrigatoriamente instalar um sistema operacional de 64-bits para usar toda a memória.", options: ["Verdadeiro", "Falso"], correctAnswer: [0], explanation: "Verdadeiro. Sistemas operacionais de 32-bits só conseguem gerenciar e utilizar no máximo cerca de 3.5 a 4GB de memória RAM." },
    { id: 30, type: "single", question: "Qual comando é usado no Windows (via Prompt) para verificar a integridade dos arquivos do sistema operacional?", options: ["ping", "ipconfig", "sfc /scannow", "format c:"], correctAnswer: [2], explanation: "O SFC (System File Checker) varre os arquivos do Windows em busca de corrupções e tenta restaurá-los automaticamente." },
    { id: 31, type: "single", question: "Durante a formatação do Windows 10/11, o sistema pede para se conectar ao Wi-Fi e entrar com uma conta Microsoft. O que acontece se o PC estiver sem internet?", options: ["A instalação é cancelada imediatamente", "É possível criar uma 'Conta Local' offline para prosseguir", "O Windows bloqueia o computador", "O HD é apagado por segurança"], correctAnswer: [1], explanation: "Para criar usuários sem vinculação com a nuvem, a opção de 'Conta Offline' ou 'Conta Local' pode ser usada quando o PC está desconectado." },
    { id: 32, type: "multiple", question: "Quais componentes de hardware devem ter seu estado avaliado num diagnóstico antes da formatação para evitar surpresas? (Marque as opções corretas)", options: ["A saúde do HD/SSD", "O funcionamento das portas USB", "O modelo da impressora do vizinho", "O carregador e a bateria (no caso de notebooks)"], correctAnswer: [0, 1, 3], explanation: "Problemas no disco, falhas em portas USB (usadas para o pendrive bootável) ou bateria viciada que faz o note desligar no meio da instalação são falhas comuns que atrapalham o processo." },
    { id: 33, type: "true_false", question: "GPT (GUID Partition Table) é o esquema de particionamento moderno usado em conjunto com a UEFI, suportando discos maiores que 2TB.", options: ["Verdadeiro", "Falso"], correctAnswer: [0], explanation: "Verdadeiro. O GPT substitui o antigo MBR, removendo o limite de tamanho e permitindo até 128 partições primárias no Windows." },
    { id: 34, type: "single", question: "Se após instalar o Windows você nota que não tem acesso à internet via cabo, e na barra de tarefas aparece um ícone de 'Sem conexão', qual o problema?", options: ["A internet mundial caiu", "O driver do adaptador de rede (Placa de Rede/LAN) não está instalado", "A BIOS queimou", "O navegador precisa ser atualizado"], correctAnswer: [1], explanation: "Se o Windows não tiver um driver genérico compatível com a placa de rede da placa-mãe, ele não conseguirá acender a porta nem negociar o IP." },
    { id: 35, type: "single", question: "Qual a melhor definição para 'Partição de Recuperação' (Recovery Partition)?", options: ["Uma partição onde o cliente salva suas músicas", "Uma partição escondida que contém a imagem original do sistema de fábrica para reinstalação de emergência", "Uma partição que duplica a memória RAM", "A partição usada apenas pelo antivírus"], correctAnswer: [1], explanation: "Fabricantes de notebooks (Dell, HP, etc.) criam essa partição para permitir que o usuário restaure o Windows para as configurações de fábrica rapidamente sem precisar de pendrive." },
    { id: 36, type: "multiple", question: "Quais cuidados preventivos um usuário deve adotar logo após receber seu computador recém-formatado? (Marque as corretas)", options: ["Não clicar em links desconhecidos por e-mail", "Usar pendrives de estranhos sem cautela", "Manter o Windows e antivírus atualizados", "Baixar ativadores piratas"], correctAnswer: [0, 2], explanation: "Segurança básica de navegação e manter o sistema sempre com as últimas atualizações são as melhores defesas." },
    { id: 37, type: "true_false", question: "Formatação de Baixo Nível (Low-Level Format) é exatamente a mesma coisa que a formatação comum feita na instalação do Windows.", options: ["Verdadeiro", "Falso"], correctAnswer: [1], explanation: "Falso. A formatação do Windows é de 'Alto Nível', apenas recriando o sistema de arquivos. A formatação de Baixo Nível reescreve os setores físicos e só é feita na fábrica ou com ferramentas especiais pesadas." },
    { id: 38, type: "single", question: "No particionamento MBR, caso precise de mais de 4 partições, como você deve proceder?", options: ["Criar 3 partições Primárias e 1 Estendida, e dentro da Estendida criar partições Lógicas", "Comprar outro HD, pois é impossível", "Forçar a criação pelo prompt", "Mudar a RAM do PC"], correctAnswer: [0], explanation: "A arquitetura MBR contorna o limite de 4 primárias usando o conceito de 'Partição Estendida', que funciona como um container para inúmeras 'Partições Lógicas'." },
    { id: 39, type: "single", question: "Qual a finalidade de usar uma Máquina Virtual (VirtualBox, VMware) no ensino de instalação de sistemas?", options: ["Para jogar jogos pesados", "Para treinar o processo de particionamento e formatação de forma segura, sem risco de apagar o computador real do aluno", "Para baixar músicas mais rápido", "Para transformar um Windows em Linux permanentemente"], correctAnswer: [1], explanation: "A virtualização é o ambiente perfeito para testes destrutivos, pois emula um PC inteiro dentro de um programa, mantendo o sistema hospedeiro seguro." },
    { id: 40, type: "multiple", question: "Ao criar um pendrive bootável no Windows usando o Rufus, se a ISO for do Windows 11, o Rufus oferece opções extras. Quais são essas opções comuns para facilitar a vida do técnico? (Marque as opções corretas)", options: ["Remover a exigência do TPM 2.0", "Remover a exigência de ter uma conta online da Microsoft", "Acelerar o processador", "Aumentar a memória RAM do pendrive"], correctAnswer: [0, 1], explanation: "O Rufus moderno permite contornar restrições de hardware e conta online do Windows 11 diretamente na criação do pendrive." },
    { id: 41, type: "true_false", question: "Durante a instalação do Windows 10, a opção 'Atualização' (Upgrade) mantém os arquivos e aplicativos, enquanto a 'Personalizada' (Custom) permite criar partições e fazer a instalação limpa.", options: ["Verdadeiro", "Falso"], correctAnswer: [0], explanation: "Verdadeiro. Essa é a escolha crucial. Técnicos na maioria das vezes usam 'Personalizada' para ter controle do particionamento e limpar o disco." },
    { id: 42, type: "single", question: "Qual a maneira correta de verificar qual é a placa-mãe de um PC que não liga ou que não tem sistema instalado?", options: ["Olhar o manual do monitor", "Abrir o gabinete e procurar o modelo impresso no circuito impresso (PCB) da placa-mãe", "Chutar a marca", "Ligar na tomada 220V"], correctAnswer: [1], explanation: "A inspeção visual é a técnica padrão de hardware para identificar placas quando ferramentas de software não estão disponíveis." },
    { id: 43, type: "single", question: "Ao conectar o pendrive bootável, o computador ignora o pendrive e entra direto no Windows antigo. Qual tecla, geralmente, aciona o 'Menu de Boot' (Boot Menu) para escolher o pendrive manualmente sem entrar no Setup?", options: ["CTRL", "F8, F11 ou F12 (dependendo do fabricante)", "Barra de Espaço", "Tecla Windows"], correctAnswer: [1], explanation: "Os fabricantes fornecem uma tecla de atalho para o Menu de Boot rápido, evitando ter que entrar e modificar a ordem fixa na BIOS." },
    { id: 44, type: "multiple", question: "Após a instalação do Linux (ex: Ubuntu), você nota que o sistema não toca MP3 ou não roda certos vídeos. O que o técnico deve instalar?", options: ["Codecs multimídia proprietários (Ubuntu Restricted Extras)", "Um antivírus", "Um driver de placa de rede", "O pacote de fontes da Microsoft, caso precise de compatibilidade de documentos"], correctAnswer: [0, 3], explanation: "Por questões de licenciamento (código aberto), formatos fechados como MP3 e fontes Arial/Times requerem a instalação de pacotes 'Restritos' no Ubuntu." },
    { id: 45, type: "true_false", question: "Se o cliente não possui backup e o HD está falhando fisicamente (fazendo barulhos de clique), o técnico deve iniciar a formatação imediatamente para tentar salvar o disco.", options: ["Verdadeiro", "Falso"], correctAnswer: [1], explanation: "Falso. HDs fazendo barulho físico estão morrendo. O técnico deve parar o disco e usar softwares especializados de clonagem para tentar salvar os dados ANTES de estressar o HD com uma formatação." },
    { id: 46, type: "single", question: "Qual é a ferramenta nativa do Windows usada para desfragmentar e otimizar discos rígidos mecânicos?", options: ["Desfragmentador de Disco (Otimizar Unidades)", "Gerenciador de Tarefas", "Painel de Controle", "Bloco de Notas"], correctAnswer: [0], explanation: "A ferramenta de Otimização reorganiza os dados espalhados nos pratos físicos do HD mecânico, melhorando a velocidade de leitura." },
    { id: 47, type: "single", question: "O que é uma partição 'Ativa' no contexto do MBR?", options: ["Uma partição que está com vírus", "A partição primária que contém o sistema operacional responsável por inicializar o computador", "Uma partição que apaga dados sozinha", "Uma partição apenas para jogos"], correctAnswer: [1], explanation: "No esquema antigo MBR, a placa-mãe procura no disco a partição marcada como 'Ativa' para transferir o controle e iniciar o boot." },
    { id: 48, type: "multiple", question: "Por que é importante manter os cabos organizados dentro do gabinete de um PC Desktop durante a montagem e instalação? (Marque as opções corretas)", options: ["Para melhorar o fluxo de ar e evitar superaquecimento", "Para facilitar futuras manutenções", "Para deixar o PC mais rápido na internet", "Para aumentar o tamanho do HD"], correctAnswer: [0, 1], explanation: "O 'Cable Management' (Gerenciamento de Cabos) é estética e técnica: não obstrui ventoinhas, não acumula tanta poeira e torna o diagnóstico de peças mais fácil." },
    { id: 49, type: "true_false", question: "A pasta térmica é um componente de software instalado via Windows Update para resfriar a CPU.", options: ["Verdadeiro", "Falso"], correctAnswer: [1], explanation: "Falso. A pasta térmica é um composto físico aplicado entre o processador (CPU) e o dissipador de calor metálico do cooler para ajudar na transferência de temperatura." },
    { id: 50, type: "single", question: "Qual a melhor atitude de um Técnico em Informática ao entregar o computador pronto ao cliente?", options: ["Apenas entregar e ir embora rápido", "Ligar o computador na frente do cliente, mostrar que o sistema e drivers estão instalados, testar som/internet e tirar dúvidas", "Cobrar o dobro do combinado", "Exigir que o cliente aprenda a formatar"], correctAnswer: [1], explanation: "O atendimento de excelência exige transparência. Testar o funcionamento na entrega evita retrabalho e gera confiança." }
];

// --- VARIÁVEIS DE ESTADO ---
let currentQuestionIndex = 0;
let score = 0;
let correctCount = 0;
let wrongCount = 0;
let unansweredCount = 0;
let studentName = "";
let studentClass = "";
let selectedAvatar = "";
let soundEnabled = true;
let timerInterval;
let timeLeft = 30;
let startTime;
let userAnswers = []; // Armazenar histórico
const TIME_PER_QUESTION = 30;
const MAX_POINTS = 1000;

// --- ELEMENTOS DO DOM ---
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const btnStart = document.getElementById('btn-start');
const inputName = document.getElementById('student-name');
const selectClass = document.getElementById('student-class');
const startError = document.getElementById('start-error');
const avatarGrid = document.getElementById('avatar-grid');
const btnSoundToggle = document.getElementById('btn-sound-toggle');

const elQuestionCounter = document.getElementById('question-counter');
const elProgressFill = document.getElementById('progress-fill');
const elTimer = document.getElementById('timer');
const elQuestionType = document.getElementById('question-type');
const elQuestionText = document.getElementById('question-text');
const elOptionsContainer = document.getElementById('options-container');

const elCurrentScore = document.getElementById('current-score');
const btnBack = document.getElementById('btn-back');
const btnRestartQuiz = document.getElementById('btn-restart-quiz');
const btnConfirm = document.getElementById('btn-confirm');
const btnNext = document.getElementById('btn-next');
const feedbackContainer = document.getElementById('feedback-container');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackExplanation = document.getElementById('feedback-explanation');

let selectedOptions = new Set(); // Para suportar múltipla escolha

// --- INICIALIZAÇÃO ---
btnStart.addEventListener('click', startQuiz);
btnConfirm.addEventListener('click', confirmAnswer);
btnNext.addEventListener('click', nextQuestion);
btnBack.addEventListener('click', previousQuestion);
btnRestartQuiz.addEventListener('click', restartQuizConfirm);
document.getElementById('btn-restart').addEventListener('click', () => location.reload());

btnSoundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    btnSoundToggle.textContent = soundEnabled ? '🔊 Som Ativado' : '🔇 Som Desativado';
});

// Inicializar Avatares
function initAvatars() {
    for (let i = 1; i <= 24; i++) {
        const num = i.toString().padStart(2, '0');
        const img = document.createElement('img');
        img.src = `avatars/avatar-${num}.svg`;
        img.className = 'avatar-item';
        img.dataset.avatar = `avatar-${num}.svg`;
        img.addEventListener('click', () => {
            document.querySelectorAll('.avatar-item').forEach(el => el.classList.remove('selected'));
            img.classList.add('selected');
            selectedAvatar = img.dataset.avatar;
            startError.classList.add('hidden');
        });
        avatarGrid.appendChild(img);
    }
}
initAvatars();

// --- SINTETIZADOR DE ÁUDIO ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    if (!soundEnabled) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'timeout') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.4);
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
    } else if (type === 'finish') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.setValueAtTime(600, audioCtx.currentTime + 0.1);
        osc.frequency.setValueAtTime(800, audioCtx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
    }
}

function restartQuizConfirm() {
    if (confirm("Tem certeza que deseja reiniciar o quiz? Seu progresso atual será perdido.")) {
        startQuiz();
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        const lastAnswer = userAnswers.pop();
        
        score -= lastAnswer.points;
        if (lastAnswer.status === 'correct') correctCount--;
        else if (lastAnswer.status === 'wrong') wrongCount--;
        else if (lastAnswer.status === 'unanswered') unansweredCount--;
        
        elCurrentScore.textContent = score;
        loadQuestion();
    }
}

function startQuiz() {
    studentName = inputName.value.trim();
    studentClass = selectClass.value;

    if (!studentName || !studentClass || !selectedAvatar) {
        startError.textContent = "Por favor, preencha todos os campos e escolha um avatar.";
        startError.classList.remove('hidden');
        return;
    }

    startError.classList.add('hidden');
    document.getElementById('display-name').textContent = studentName;
    document.getElementById('display-class').textContent = studentClass;

    // Persistência local de segurança
    localStorage.setItem('quizStudentName', studentName);
    localStorage.setItem('quizStudentClass', studentClass);

    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    
    startTime = Date.now();
    currentQuestionIndex = 0;
    score = 0;
    correctCount = 0;
    wrongCount = 0;
    unansweredCount = 0;
    userAnswers = [];
    elCurrentScore.textContent = "0";
    
    loadQuestion();
}

// --- LÓGICA DA QUESTÃO ---
function loadQuestion() {
    resetState();
    
    const question = questions[currentQuestionIndex];
    
    elQuestionCounter.textContent = `Questão ${currentQuestionIndex + 1} de ${questions.length}`;
    elProgressFill.style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;
    elQuestionText.textContent = question.question;
    
    if (question.type === 'single') elQuestionType.textContent = "Múltipla Escolha (1 resposta)";
    else if (question.type === 'multiple') elQuestionType.textContent = "Múltipla Escolha (Várias respostas)";
    else if (question.type === 'true_false') elQuestionType.textContent = "Verdadeiro ou Falso";

    question.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        
        // Add visual indicator for type
        const inputType = question.type === 'multiple' ? 'checkbox' : 'radio';
        btn.innerHTML = `<input type="${inputType}" name="q-option" value="${index}" style="pointer-events: none;"> ${option}`;
        
        btn.addEventListener('click', () => selectOption(index, btn, question.type));
        elOptionsContainer.appendChild(btn);
    });

    startTimer();
}

function resetState() {
    selectedOptions.clear();
    elOptionsContainer.innerHTML = '';
    btnConfirm.disabled = true;
    btnConfirm.classList.remove('hidden');
    btnNext.classList.add('hidden');
    if (currentQuestionIndex > 0) {
        btnBack.classList.remove('hidden');
    } else {
        btnBack.classList.add('hidden');
    }
    feedbackContainer.classList.add('hidden');
    feedbackContainer.className = 'feedback-box hidden';
    elTimer.className = 'timer';
    clearInterval(timerInterval);
}

function selectOption(index, btnElement, type) {
    if (feedbackContainer.classList.contains('hidden') === false) return; // bloqueia após responder

    if (type === 'single' || type === 'true_false') {
        selectedOptions.clear();
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('selected');
            btn.querySelector('input').checked = false;
        });
    }

    if (selectedOptions.has(index)) {
        selectedOptions.delete(index);
        btnElement.classList.remove('selected');
        btnElement.querySelector('input').checked = false;
    } else {
        selectedOptions.add(index);
        btnElement.classList.add('selected');
        btnElement.querySelector('input').checked = true;
    }

    btnConfirm.disabled = selectedOptions.size === 0;
}

// --- TEMPORIZADOR ---
function startTimer() {
    timeLeft = TIME_PER_QUESTION;
    elTimer.textContent = timeLeft;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        elTimer.textContent = timeLeft;
        
        if (timeLeft <= 10) {
            elTimer.classList.add('warning');
            elTimer.classList.add('pulse');
            setTimeout(() => elTimer.classList.remove('pulse'), 500);
        }
        if (timeLeft <= 5) {
            elTimer.classList.remove('warning');
            elTimer.classList.add('danger');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeOut();
        }
    }, 1000);
}

function handleTimeOut() {
    const question = questions[currentQuestionIndex];
    unansweredCount++;
    
    // Salvar no histórico
    userAnswers.push({
        questionId: question.id,
        selectedAnswer: [],
        correctAnswer: question.correctAnswer,
        isCorrect: false,
        points: 0,
        status: 'unanswered'
    });

    showFeedback(false, "Tempo Esgotado!", true);
    playSound('timeout');
    document.querySelector('.question-container').classList.add('shake');
    setTimeout(() => document.querySelector('.question-container').classList.remove('shake'), 500);
}

// --- VALIDAÇÃO E PONTUAÇÃO ---
function confirmAnswer() {
    clearInterval(timerInterval);
    const question = questions[currentQuestionIndex];
    const selectedArray = Array.from(selectedOptions).sort();
    const correctArray = [...question.correctAnswer].sort();
    
    // Comparar arrays (funciona para múltipla ou única)
    const isCorrect = JSON.stringify(selectedArray) === JSON.stringify(correctArray);
    let points = 0;

    if (isCorrect) {
        // Cálculo de pontos: min 1, máx 1000 baseado no tempo
        points = Math.max(1, Math.round((timeLeft / TIME_PER_QUESTION) * MAX_POINTS));
        score += points;
        correctCount++;
    } else {
        wrongCount++;
    }
    elCurrentScore.textContent = score;

    // Salvar histórico
    userAnswers.push({
        questionId: question.id,
        selectedAnswer: selectedArray,
        correctAnswer: correctArray,
        isCorrect: isCorrect,
        points: points,
        status: isCorrect ? 'correct' : 'wrong'
    });

    showFeedback(isCorrect, isCorrect ? "Correto!" : "Incorreto!");
    playSound(isCorrect ? 'correct' : 'wrong');
    
    if (!isCorrect) {
        document.querySelector('.question-container').classList.add('shake');
        setTimeout(() => document.querySelector('.question-container').classList.remove('shake'), 500);
    }
}

function showFeedback(isCorrect, title, isTimeout = false) {
    const question = questions[currentQuestionIndex];
    const optionBtns = document.querySelectorAll('.option-btn');
    
    // Pintar opções corretas e erradas
    optionBtns.forEach((btn, index) => {
        btn.disabled = true; // Desabilita cliques
        if (question.correctAnswer.includes(index)) {
            btn.classList.add('correct');
        } else if (selectedOptions.has(index)) {
            btn.classList.add('wrong');
        }
    });

    feedbackContainer.classList.remove('hidden');
    if (isTimeout) {
        feedbackContainer.classList.add('timeout');
    } else if (isCorrect) {
        feedbackContainer.classList.add('correct');
    } else {
        feedbackContainer.classList.add('wrong');
    }

    feedbackTitle.textContent = title;
    feedbackExplanation.textContent = question.explanation;

    btnConfirm.classList.add('hidden');
    btnNext.classList.remove('hidden');
    btnBack.classList.add('hidden');
    
    // Change button text if last question
    if (currentQuestionIndex === questions.length - 1) {
        btnNext.textContent = "Ver Relatório Final";
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

// --- RESULTADOS E FIREBASE ---
async function showResults() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');

    const totalTimeSeconds = Math.floor((Date.now() - startTime) / 1000);
    const percentage = Math.round((correctCount / questions.length) * 100);

    document.getElementById('result-student-name').textContent = `${studentName} - ${studentClass}`;
    document.getElementById('final-score').textContent = score;
    document.getElementById('final-percentage').textContent = `${percentage}%`;
    
    document.getElementById('stat-correct').textContent = correctCount;
    document.getElementById('stat-wrong').textContent = wrongCount;
    document.getElementById('stat-unanswered').textContent = unansweredCount;
    document.getElementById('stat-time').textContent = `${totalTimeSeconds}s`;

    const perfMessage = document.getElementById('performance-message');
    if (percentage >= 90) {
        perfMessage.textContent = "Excelente desempenho! Você demonstrou ótimo domínio dos procedimentos de instalação de sistemas operacionais.";
        perfMessage.className = "performance-message text-success";
    } else if (percentage >= 70) {
        perfMessage.textContent = "Bom desempenho! Você compreendeu a maior parte do conteúdo, mas ainda pode revisar alguns pontos.";
        perfMessage.className = "performance-message text-success";
    } else if (percentage >= 50) {
        perfMessage.textContent = "Desempenho regular. Revise os procedimentos de boot, particionamento, backup e instalação de drivers.";
        perfMessage.className = "performance-message text-warning";
    } else {
        perfMessage.textContent = "Atenção! É importante revisar o conteúdo e praticar novamente os procedimentos em laboratório.";
        perfMessage.className = "performance-message text-danger";
    }

    // Definir Avatar na tela final
    document.getElementById('result-avatar-img').src = `avatars/${selectedAvatar}`;
    document.querySelector('.result-podium-glow').classList.remove('hidden');
    playSound('finish');

    buildReviewList();

    // Preparar objeto para salvar
    const resultData = {
        studentName: studentName,
        className: studentClass,
        avatar: selectedAvatar,
        score: score,
        correctAnswers: correctCount,
        wrongAnswers: wrongCount,
        unanswered: unansweredCount,
        percentage: percentage,
        totalTimeSeconds: totalTimeSeconds,
        completedAt: new Date().toISOString(),
    };

    // Backup local
    const localResults = JSON.parse(localStorage.getItem('quizBackupResults') || '[]');
    localResults.push(resultData);
    localStorage.setItem('quizBackupResults', JSON.stringify(localResults));

    // Enviar Firebase
    const statusEl = document.getElementById('upload-status');
    if (!db) {
        statusEl.textContent = "Modo offline/demonstração. Resultado salvo apenas no navegador (Firebase não configurado).";
        statusEl.className = "upload-status error";
        return;
    }

    try {
        await addDoc(collection(db, "quizResults"), resultData);
        statusEl.textContent = "Resultado enviado para o ranking com sucesso!";
        statusEl.className = "upload-status success";
    } catch (e) {
        console.error("Erro ao adicionar documento: ", e);
        statusEl.textContent = "Erro de conexão ao enviar resultado. Salvo no backup local.";
        statusEl.className = "upload-status error";
    }
}

function buildReviewList() {
    const container = document.getElementById('review-container');
    container.innerHTML = '';

    userAnswers.forEach((ans, idx) => {
        const q = questions.find(qst => qst.id === ans.questionId);
        
        const item = document.createElement('div');
        item.className = `review-item ${ans.status}`;

        let statusText = ans.status === 'correct' ? '✅ Correto' : ans.status === 'wrong' ? '❌ Incorreto' : '⏳ Não respondida';
        
        // Formatar respostas
        const getAnswerText = (arr) => arr.length > 0 ? arr.map(i => q.options[i]).join(" | ") : "Nenhuma";
        
        item.innerHTML = `
            <div class="review-header">
                <span>Questão ${idx + 1}</span>
                <span>${statusText} (+${ans.points} pts)</span>
            </div>
            <div class="review-q">${q.question}</div>
            <div class="review-answers">
                <p><strong>Sua resposta:</strong> ${getAnswerText(ans.selectedAnswer)}</p>
                <p><strong>Resposta correta:</strong> ${getAnswerText(ans.correctAnswer)}</p>
                <p><em>${q.explanation}</em></p>
            </div>
        `;
        container.appendChild(item);
    });
}
