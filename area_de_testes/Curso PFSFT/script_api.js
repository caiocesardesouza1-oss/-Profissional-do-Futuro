// ===== CONFIGURAÇÃO DA API =====
const API_URL = 'http://localhost:5000/api';

// ===== FUNÇÕES DE AUTENTICAÇÃO =====

async function fazerLogin(usuario, nome) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ usuario, nome })
        });
        
        const dados = await response.json();
        if (dados.sucesso) {
            atualizarNomeNoHeader();
            atualizarBarraProgresso();
            return true;
        } else {
            alert('Erro ao fazer login: ' + dados.mensagem);
            return false;
        }
    } catch (erro) {
        console.error('Erro na requisição de login:', erro);
        alert('Erro ao conectar com o servidor');
        return false;
    }
}

async function logout() {
    try {
        await fetch(`${API_URL}/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        window.location.href = 'login.html';
    } catch (erro) {
        console.error('Erro ao fazer logout:', erro);
    }
}

async function verificarLogin() {
    try {
        const response = await fetch(`${API_URL}/usuario`, {
            credentials: 'include'
        });
        
        if (!response.ok) {
            window.location.href = 'login.html';
        }
    } catch (erro) {
        console.error('Erro ao verificar login:', erro);
        window.location.href = 'login.html';
    }
}

async function getNomeUsuario() {
    try {
        const response = await fetch(`${API_URL}/usuario`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            const dados = await response.json();
            return dados.nome;
        }
        return null;
    } catch (erro) {
        console.error('Erro ao obter nome do usuário:', erro);
        return null;
    }
}

// ===== FUNÇÕES DE PROGRESSO =====

async function getProgresso() {
    try {
        const response = await fetch(`${API_URL}/progresso`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            const dados = await response.json();
            return dados.progresso;
        }
        return null;
    } catch (erro) {
        console.error('Erro ao obter progresso:', erro);
        return null;
    }
}

async function salvarProgresso(chave, valor) {
    try {
        const response = await fetch(`${API_URL}/progresso`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ chave, valor })
        });
        
        if (response.ok) {
            const dados = await response.json();
            atualizarBarraProgresso();
            return dados.percentual;
        }
    } catch (erro) {
        console.error('Erro ao salvar progresso:', erro);
    }
    return null;
}

async function calcularProgresso() {
    try {
        const response = await fetch(`${API_URL}/progresso`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            const dados = await response.json();
            return dados.percentual;
        }
    } catch (erro) {
        console.error('Erro ao calcular progresso:', erro);
    }
    return 0;
}

async function atualizarBarraProgresso() {
    const percentual = await calcularProgresso();
    const barraElement = document.querySelector('.progresso');
    if (barraElement) {
        barraElement.style.width = percentual + '%';
        barraElement.textContent = percentual + '%';
    }
}

async function atualizarNomeNoHeader() {
    const usuario = await getNomeUsuario();
    if (usuario) {
        const headerElement = document.querySelector('header .user-name');
        if (headerElement) {
            headerElement.textContent = `Bem-vindo, ${usuario}`;
        }
    }
}

// ===== FUNÇÕES DE QUIZ =====

async function salvarRespostasQuiz(unidade, respostas) {
    try {
        const response = await fetch(`${API_URL}/quiz/${unidade}/salvar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ respostas })
        });
        
        return response.ok;
    } catch (erro) {
        console.error('Erro ao salvar respostas do quiz:', erro);
        return false;
    }
}

async function carregarRespostasQuiz(unidade) {
    try {
        const response = await fetch(`${API_URL}/quiz/${unidade}/carregar`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            const dados = await response.json();
            return dados.respostas;
        }
    } catch (erro) {
        console.error('Erro ao carregar respostas do quiz:', erro);
    }
    return null;
}

async function quizJaRespondido(unidade) {
    try {
        const response = await fetch(`${API_URL}/quiz/${unidade}/carregar`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            const dados = await response.json();
            return dados.jaRespondido;
        }
    } catch (erro) {
        console.error('Erro ao verificar quiz:', erro);
    }
    return false;
}

async function restaurarRespostasQuiz(unidade) {
    const respostasArmazenadas = await carregarRespostasQuiz(unidade);
    if (respostasArmazenadas) {
        for (const [questionId, resposta] of Object.entries(respostasArmazenadas)) {
            const elemento = document.querySelector(`input[name="${questionId}"][value="${resposta}"]`);
            if (elemento) {
                elemento.checked = true;
            }
        }
    }
}

function desabilitarInputsQuiz() {
    const inputs = document.querySelectorAll('.quiz-container input[type="radio"]');
    inputs.forEach(input => {
        input.disabled = true;
    });
}

function mostrarMensagemQuizConcluido() {
    const quizContainer = document.querySelector('.quiz-container');
    if (quizContainer) {
        const mensagem = document.createElement('div');
        mensagem.style.marginTop = '20px';
        mensagem.style.padding = '15px';
        mensagem.style.backgroundColor = '#d4edda';
        mensagem.style.border = '1px solid #c3e6cb';
        mensagem.style.borderRadius = '8px';
        mensagem.style.color = '#155724';
        mensagem.style.fontSize = '1em';
        mensagem.innerHTML = '<strong>Quiz já foi respondido com sucesso!</strong> As suas respostas foram restauradas.';
        quizContainer.parentElement.insertBefore(mensagem, quizContainer.nextSibling);
    }
}

async function limparRespostasQuiz(unidade) {
    // Limpar no servidor salvando um quiz vazio
    await salvarRespostasQuiz(unidade, {});
    
    // Desmarcar todos os radio buttons
    const inputs = document.querySelectorAll('.quiz-container input[type="radio"]');
    inputs.forEach(input => {
        input.checked = false;
    });
    
    // Voltar à primeira questão se houver função de navegação
    if (typeof mostrarQuestao === 'function') {
        questaoAtual = 1;
        mostrarQuestao(1);
    }
}

async function validarQuiz(unidade) {
    const selecionada = document.querySelector(`input[name="resposta"]:checked`);
    
    if (!selecionada) {
        alert('Por favor, selecione uma resposta!');
        return false;
    }

    try {
        const response = await fetch(`${API_URL}/quiz/${unidade}/validar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ resposta: selecionada.value })
        });
        
        if (response.ok) {
            const dados = await response.json();
            alert(dados.mensagem);
            
            if (dados.acertou) {
                atualizarBarraProgresso();
            }
            return dados.acertou;
        }
    } catch (erro) {
        console.error('Erro ao validar quiz:', erro);
    }
    return false;
}

// ===== FUNÇÕES DE CERTIFICADO =====

async function gerarCertificado() {
    try {
        const response = await fetch(`${API_URL}/certificado`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            const dados = await response.json();
            
            // Abrir em nova aba para impressão
            const novaAba = window.open('', 'certificado');
            const nome = await getNomeUsuario();
            
            novaAba.document.write(`
                <!DOCTYPE html>
                <html lang="pt-br">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Certificado - ${nome}</title>
                    <link rel="stylesheet" href="styles.css">
                    <style>
                        body {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 20px;
                            background-color: #f5f5f5;
                        }
                        .certificado {
                            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                            border: 10px solid #1e3a8a;
                            border-radius: 15px;
                            padding: 60px 40px;
                            text-align: center;
                            max-width: 1000px;
                            width: 100%;
                            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
                        }
                    </style>
                </head>
                <body>
                    ${dados.certificado}
                    <div style="text-align: center; margin-top: 30px;">
                        <button class="btn btn-primary" onclick="window.print()">Imprimir Certificado</button>
                        <button class="btn btn-secondary" onclick="window.close()">Fechar</button>
                    </div>
                </body>
                </html>
            `);
            novaAba.document.close();
        } else {
            alert('Erro ao gerar certificado');
        }
    } catch (erro) {
        console.error('Erro ao gerar certificado:', erro);
    }
}

async function compartilharCertificado() {
    const nome = await getNomeUsuario();
    const texto = `Eu completei com sucesso o curso "Profissional do Futuro"! 
    
Conquista alcançada em: ${new Date().toLocaleDateString('pt-BR')}

Venha participar deste incrível programa de formação!
    `;

    if (navigator.share) {
        navigator.share({
            title: 'Certificado - Profissional do Futuro',
            text: texto,
            url: window.location.href
        }).catch(err => console.log('Erro ao compartilhar:', err));
    } else {
        const textoCompartilhar = `${texto}\n\nNome: ${nome}`;
        navigator.clipboard.writeText(textoCompartilhar).then(() => {
            alert('Texto copiado para a área de transferência! Você pode compartilhar em redes sociais.');
        }).catch(err => {
            alert('Erro ao copiar texto para compartilhar!');
        });
    }
}

// ===== FUNÇÕES DE CONCLUSÃO =====

async function concluirUnidade(unidade) {
    const percentual = await salvarProgresso(unidade, true);
    alert('Parabéns! Você concluiu a ' + unidade.toUpperCase() + '!');
}

async function concluirDeclaracaoAprendizagem() {
    try {
        const response = await fetch(`${API_URL}/declaracao/concluir`, {
            method: 'POST',
            credentials: 'include'
        });
        
        if (response.ok) {
            const dados = await response.json();
            alert('Parabéns! Você concluiu a declaração de aprendizagem "Profissional do Futuro"!');
            gerarCertificado();
        } else {
            const dados = await response.json();
            alert('Erro: ' + dados.mensagem);
        }
    } catch (erro) {
        console.error('Erro ao concluir declaração:', erro);
    }
}

async function finalizarCurso() {
    try {
        const progresso = await getProgresso();
        
        // Concluir a unidade 3 se ainda não foi concluída
        if (!progresso.unidade3) {
            await salvarProgresso('unidade3', true);
        }
        
        // Verificar se todas as unidades foram concluídas
        const unidadesCompletas = progresso.unidade1 && progresso.unidade2 && progresso.unidade3;
        
        if (unidadesCompletas) {
            await salvarProgresso('declaracaoAprendizagemConcluida', true);
            window.location.href = 'conclusao.html';
        } else {
            alert('Você precisa completar todas as unidades do curso para gerar o certificado!');
        }
    } catch (erro) {
        console.error('Erro ao finalizar curso:', erro);
    }
}

// ===== INICIALIZAR NA CARGA DA PÁGINA =====

document.addEventListener('DOMContentLoaded', async function() {
    await verificarLogin();
    await atualizarNomeNoHeader();
    await atualizarBarraProgresso();
});
