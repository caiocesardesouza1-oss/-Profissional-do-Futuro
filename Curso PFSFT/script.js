// ===== GERENCIAMENTO DE USUÁRIO =====

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
        const headerElement = document.querySelector('header .user-name');
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

// Imprimir certificado
function imprimirCertificado() {
    const element = document.getElementById('certificadoArea');
    const nome = getNomeUsuario();
    
    if (!element) {
        alert('Erro: Certificado não encontrado!');
        return;
    }

    // Criar uma cópia com estilos inline para impressão
    const printWindow = window.open('', '', 'height=1200,width=1000');
    
    const html = `
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Certificado - ${nome}</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                html, body {
                    width: 100%;
                    height: 100%;
                    font-family: 'Georgia', serif;
                }
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
                .certificado-titulo {
                    font-size: 2.8em;
                    color: #1e3a8a;
                    margin-bottom: 20px;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
                    font-weight: bold;
                }
                .certificado-nome {
                    font-size: 2.2em;
                    color: #d97706;
                    margin: 30px 0;
                    border-bottom: 3px solid #1e3a8a;
                    padding-bottom: 15px;
                    font-weight: bold;
                }
                .certificado-texto {
                    font-size: 1.1em;
                    color: #333;
                    line-height: 1.8;
                    margin: 20px 0;
                }
                .certificado-texto p {
                    margin: 10px 0;
                }
                .certificado-data {
                    margin-top: 50px;
                    color: #555;
                    font-size: 1em;
                }
                @media print {
                    body {
                        background-color: white;
                        padding: 0;
                    }
                    .certificado {
                        box-shadow: none;
                    }
                }
            </style>
        </head>
        <body>
            ${element.outerHTML}
        </body>
        </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Esperar o documento carregar antes de imprimir
    printWindow.onload = function() {
        printWindow.print();
    };
}

// Baixar certificado como PDF
function baixarCertificado() {
    const element = document.getElementById('certificadoArea');
    const nome = getNomeUsuario();
    
    if (!element || !nome) {
        alert('Erro: Dados do certificado não encontrados!');
        return;
    }

    // Usar html2pdf para gerar PDF
    if (typeof html2pdf !== 'undefined') {
        // Desabilitar botão
        event.target.disabled = true;
        const textoOriginal = event.target.textContent;
        event.target.textContent = 'Processando...';

        // Criar um container para o certificado com tamanho A4 em paisagem
        const container = document.createElement('div');
        container.style.width = '297mm'; // A4 paisagem largura
        container.style.height = '210mm'; // A4 paisagem altura
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.padding = '15mm';
        container.style.backgroundColor = 'white';
        
        // Clone do certificado
        const clone = element.cloneNode(true);
        clone.style.maxWidth = '100%';
        clone.style.width = '100%';
        
        container.appendChild(clone);

        // Opções do PDF
        const opt = {
            margin: 0,
            filename: `Certificado_${nome}.pdf`,
            image: { type: 'png', quality: 0.98 },
            html2canvas: { 
                scale: 3,
                logging: false,
                backgroundColor: '#ffffff',
                allowTaint: true,
                useCORS: true,
                windowHeight: 650,
                windowWidth: 1100
            },
            jsPDF: { 
                orientation: 'landscape', 
                unit: 'mm', 
                format: 'a4',
                compress: true,
                precision: 10
            },
            pagebreak: { mode: 'avoid-all' }
        };

        html2pdf().set(opt).from(container).save().then(() => {
            // Restaurar botão
            event.target.disabled = false;
            event.target.textContent = textoOriginal;
        }).catch(err => {
            console.error('Erro ao gerar PDF:', err);
            alert('Erro ao gerar PDF. Tente novamente!');
            event.target.disabled = false;
            event.target.textContent = textoOriginal;
        });
    } else {
        alert('Erro: Biblioteca de PDF não carregada. Recarregue a página!');
        event.target.disabled = false;
    }
}
    


// Compartilhar certificado
function compartilharCertificado() {
    const nome = getNomeUsuario();
    const texto = `🎓 Eu completei com sucesso o curso "Profissional do Futuro"! 
    
Conquista alcançada em: ${new Date().toLocaleDateString('pt-BR')}

Venha participar deste incrível programa de formação!
    `;

    // Verificar se o navegador suporta a API de compartilhamento
    if (navigator.share) {
        navigator.share({
            title: 'Certificado - Profissional do Futuro',
            text: texto,
            url: window.location.href
        }).catch(err => console.log('Erro ao compartilhar:', err));
    } else {
        // Fallback: copiar para clipboard
        const textoCompartilhar = `${texto}\n\nNome: ${nome}`;
        navigator.clipboard.writeText(textoCompartilhar).then(() => {
            alert('Texto copiado para a área de transferência! Você pode compartilhar em redes sociais.');
        }).catch(err => {
            alert('Erro ao copiar texto para compartilhar!');
        });
    }
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
        alert(' Parabéns! Você concluiu a declaração de aprendizagem "Profissional do Futuro"!');
        gerarCertificado();
    } else {
        alert('Você precisa completar todas as unidades para concluir a declaração de aprendizagem!');
    }
}

// Finalizar curso e gerar certificado
function finalizarCurso() {
    const progresso = getProgresso();
    
    // Concluir a unidade 3 se ainda não foi concluída
    if (!progresso.unidade3) {
        salvarProgresso('unidade3', true);
    }
    
    // Verificar se todas as unidades foram concluídas
    const unidadesCompletas = progresso.unidade1 && progresso.unidade2 && progresso.unidade3;
    
    if (unidadesCompletas) {
        // Salvar que a declaração foi concluída
        salvarProgresso('declaracaoAprendizagemConcluida', true);
        
        // Redirecionar para a página de conclusão
        window.location.href = 'conclusao.html';
    } else {
        alert('Você precisa completar todas as unidades do curso para gerar o certificado!');
    }
}

// ===== INICIALIZAR NA CARGA DA PÁGINA =====

document.addEventListener('DOMContentLoaded', function() {
    verificarLogin();
    atualizarNomeNoHeader();
    atualizarBarraProgresso();
});
