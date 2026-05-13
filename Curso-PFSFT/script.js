// ===== GERENCIAMENTO DE USUÁRIO =====

// Função para comunicar com o servidor Python (Login)
async function realizarLogin(usuario, senha) {
    try {
        const resposta = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario: usuario, senha: senha })
        });
        const dados = await resposta.json();
        if (dados.sucesso) {
            localStorage.setItem('usuarioLogado', 'true');
            localStorage.setItem('nomeUsuario', usuario);
            window.location.href = 'index.html';
        } else {
            alert(dados.mensagem);
        }
    } catch (erro) {
        alert("Erro ao conectar com o servidor Python. Verifique se o web_app.py está rodando!");
    }
}

// Função para comunicar com o servidor Python (Cadastro)
async function realizarCadastro(usuario, senha) {
    const resposta = await fetch('http://localhost:5000/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: usuario, senha: senha })
    });
    const dados = await resposta.json();
    alert(dados.mensagem);
    if (dados.sucesso) {
        window.location.href = 'login.html';
    }
}

// Obter usuário logado
function getUsuarioLogado() {
    return localStorage.getItem('usuarioLogado');
}

// Obter nome do usuário
function getNomeUsuario() {
    return localStorage.getItem('nomeUsuario');
}

// Fazer logout
function logout() {
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('nomeUsuario');
    localStorage.removeItem('progresso');
    window.location.href = 'login.html';
}

// Redirecionar se não estiver logado
function verificarLogin() {
    if (!getUsuarioLogado()) {
        window.location.href = 'login.html';
    }
}

// Atualizar nome do usuário no header
function atualizarNomeNoHeader() {
    const usuario = getNomeUsuario();
    if (usuario) {
        const headerElement = document.querySelector('.user-name');
        if (headerElement) {
            headerElement.textContent = `Bem-vindo, ${usuario}`;
        }
    }
}

// ===== GERENCIAMENTO DE PROGRESSO =====

// Obter progresso da declaração de aprendizagem
function getProgresso() {
    const progresso = localStorage.getItem('progresso');
    return progresso ? JSON.parse(progresso) : {
        unidade1: false,
        unidade2: false,
        unidade3: false,
        quizUnidade1: false,
        quizUnidade2: false,
        quizUnidade3: false,
        declaracaoAprendizagemConcluida: false
    };
}

// Salvar progresso
function salvarProgresso(chave, valor) {
    const progresso = getProgresso();
    progresso[chave] = valor;
    localStorage.setItem('progresso', JSON.stringify(progresso));
    atualizarBarraProgresso();
}

// Calcular percentual de progresso
function calcularProgresso() {
    const progresso = getProgresso();
    const total = 7;
    const concluidos = Object.values(progresso).filter(v => v === true).length;
    return Math.round((concluidos / total) * 100);
}

// Atualizar barra de progresso
function atualizarBarraProgresso() {
    const percentual = calcularProgresso();
    const barraElement = document.querySelector('.progresso');
    if (barraElement) {
        barraElement.style.width = percentual + '%';
        barraElement.textContent = percentual + '%';
    }
}

// ===== QUIZ =====

// Validar resposta de quiz
function validarQuiz(unidade) {
    const respostas = {
        unidade1: 'a',
        unidade2: 'b',
        unidade3: 'c'
    };

    const selecionada = document.querySelector(`input[name="resposta"]:checked`);
    
    if (!selecionada) {
        alert('Por favor, selecione uma resposta!');
        return false;
    }

    const respostaCorreta = respostas[unidade];
    
    if (selecionada.value === respostaCorreta) {
        alert('✓ Resposta Correta! Parabéns!');
        salvarProgresso(`quiz${unidade.charAt(0).toUpperCase() + unidade.slice(1)}`, true);
        return true;
    } else {
        alert('✗ Resposta Incorreta. Tente novamente!');
        return false;
    }
}

// ===== CERTIFICADO =====

// Gerar certificado
function gerarCertificado() {
    const progresso = getProgresso();
    
    if (!progresso.declaracaoAprendizagemConcluida) {
        alert('Você precisa completar todas as unidades para gerar o certificado!');
        return;
    }

    const nome = getNomeUsuario();
    const data = new Date();
    const dataFormatada = data.toLocaleDateString('pt-BR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    const certificadoHTML = `
        <div class="certificado">
            <div class="certificado-titulo">Certificado de Conclusão</div>
            <div class="certificado-texto">Certifica-se que</div>
            <div class="certificado-nome">${nome}</div>
            <div class="certificado-texto">
                Completou com sucesso a declaração de aprendizagem<br>
                <strong>"Profissional do Futuro"</strong>
            </div>
            <div class="certificado-texto">
                Demonstrando competência e conhecimento em todos os módulos apresentados.
            </div>
            <div class="certificado-data">
                Emitido em ${dataFormatada}
            </div>
        </div>
    `;

    // Abrir em nova aba para impressão
    const novaAba = window.open('', 'certificado');
    novaAba.document.write(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Certificado - ${nome}</title>
            <link rel="stylesheet" href="styles.css">
        </head>
        <body>
            ${certificadoHTML}
            <div style="text-align: center; margin-top: 30px;">
                <button class="btn btn-primary" onclick="window.print()">Imprimir Certificado</button>
                <button class="btn btn-secondary" onclick="window.close()">Fechar</button>
            </div>
        </body>
        </html>
    `);
    novaAba.document.close();
}

// ===== CONCLUSÃO DE UNIDADE =====

function concluirUnidade(unidade) {
    salvarProgresso(unidade, true);
    alert('Parabéns! Você concluiu a ' + unidade.toUpperCase() + '!');
}

// ===== CONCLUSÃO DE DECLARAÇÃO DE APRENDIZAGEM =====/

function concluirDeclaracaoAprendizagem() {
    const progresso = getProgresso();
    const unidadesCompletas = progresso.unidade1 && progresso.unidade2 && progresso.unidade3;
    
    if (unidadesCompletas) {
        salvarProgresso('declaracaoAprendizagemConcluida', true);
        alert('🎉 Parabéns! Você concluiu a declaração de aprendizagem "Profissional do Futuro"!');
        gerarCertificado();
    } else {
        alert('Você precisa completar todas as unidades para concluir a declaração de aprendizagem!');
    }
}

// ===== INICIALIZAR NA CARGA DA PÁGINA =====

document.addEventListener('DOMContentLoaded', function() {
    verificarLogin();
    atualizarNomeNoHeader();
    atualizarBarraProgresso();
});
