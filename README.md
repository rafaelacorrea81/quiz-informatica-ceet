# Quiz Técnico — Instalação de Sistemas Operacionais

Sistema de quiz educacional interativo desenvolvido para o **Módulo 1 do Curso Técnico em Informática do CEET Vasco Coutinho**.

## Objetivo
Aplicar 50 questões práticas sobre instalação de sistemas operacionais (Windows e Linux), hardware básico, particionamento e formatação, gerando um ranking automático e em tempo real para avaliação e revisão da turma.

## Público-alvo
Alunos iniciantes do curso técnico. A interface foi desenhada com linguagem clara, botões grandes e feedback imediato para funcionar não apenas como teste, mas como ferramenta de fixação de conhecimento.

---

## Como abrir o quiz localmente (Sem Internet/Firebase)
Você pode testar a aplicação no seu próprio computador sem precisar configurar o banco de dados online.
1. Baixe os arquivos desta pasta.
2. Dê um duplo clique no arquivo `index.html`.
3. O quiz abrirá no seu navegador. Os resultados serão salvos temporariamente apenas no navegador (`localStorage`) onde o teste for feito.

---

## Passo a passo para a Professora: Configurando o Ranking Online

Para que os alunos acessem o quiz pelo celular ou laboratório e você receba todas as notas em um **Ranking Centralizado em Tempo Real**, siga os passos abaixo:

### Parte 1: Criar o Banco de Dados no Firebase
1. Acesse o [Console do Firebase](https://console.firebase.google.com/) usando uma conta Google.
2. Clique em **Criar um projeto**. Dê um nome (ex: `Quiz CEET`) e prossiga (não precisa ativar o Google Analytics).
3. No painel principal do projeto, clique no ícone da Web `</>` (Adicionar Firebase a um app web).
4. Dê um nome ao app (ex: `QuizWeb`) e clique em **Registrar app**.
5. O Firebase mostrará um bloco de código contendo o `firebaseConfig`. **Copie esse bloco de código** (ele contém a `apiKey`, `projectId`, etc.).
6. Clique em **Continuar no console**.
7. No menu lateral, vá em **Compilação > Firestore Database** e clique em **Criar banco de dados**.
8. Inicie no **Modo de teste** (vamos ajustar as regras depois) e escolha o local (ex: `nam5 (us-central)`). Clique em **Ativar**.

### Parte 2: Configurar o Código
1. Abra o arquivo `firebase-config.js` em um editor de texto (Bloco de Notas, VS Code).
2. Substitua o objeto `firebaseConfig` que está lá pelos dados reais que você copiou no Passo 5 da Parte 1.
3. Salve o arquivo.

### Parte 3: Regras de Segurança do Firestore
> [!WARNING]
> **Aviso Obrigatório:** As regras abaixo permitem que qualquer pessoa com o link envie resultados. Elas são adequadas para um ambiente controlado de laboratório escolar. Para um aplicativo comercial, o Firebase Authentication seria necessário.

1. No console do Firebase, dentro de **Firestore Database**, clique na aba **Regras**.
2. Apague o que estiver lá e cole o seguinte código:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /quizResults/{document} {
         allow create: if true;
         allow read: if true;
         allow update, delete: if false; // Impede alterar ou apagar notas
       }
     }
   }
   ```
3. Clique em **Publicar**.

### Parte 4: Publicar no GitHub Pages
1. Crie um repositório público no seu [GitHub](https://github.com/).
2. Faça o upload de todos os arquivos (`index.html`, `style.css`, `script.js`, `admin.html`, `admin.js`, `firebase-config.js`).
3. Vá na aba **Settings** (Configurações) do repositório.
4. No menu esquerdo, clique em **Pages**.
5. Na seção **Build and deployment**, selecione o Branch `main` e clique em **Save**.
6. Aguarde alguns minutos. O link oficial do seu quiz será gerado no topo da página. Compartilhe este link com os alunos!

---

## Área Administrativa e Exportação
1. Acesse o link oficial do seu quiz e adicione `/admin.html` no final (ex: `https://seunome.github.io/quiz/admin.html`).
2. A senha inicial padrão para acessar o painel é: **`ceet2026`**
3. O painel mostrará a tabela atualizando ao vivo conforme os alunos terminam.
4. Clique em **Exportar CSV** para baixar as notas no Excel e lançar no diário.

> **Nota sobre Segurança:** A senha inicial é controlada via JavaScript. Qualquer aluno experiente pode ver a senha inspecionando o código. Use isso como barreira didática (e um bom exemplo prático para explicar falhas de segurança Front-end nas aulas!).

---

## Limitações e Melhorias Futuras
- **Senhas no JS:** Para proteger completamente o `admin.html`, você precisará integrar o módulo *Firebase Authentication* no futuro.
- **LocalStorage:** É usado aqui apenas como backup (caso falhe o envio para o Firebase) e para não perder a prova caso o aluno dê *F5* acidentalmente.
- **Identificação:** O ranking aceita alunos com o mesmo nome repetido. Numa evolução 2.0, você pode bloquear apelidos duplicados consultando o Firestore antes de iniciar o teste.
