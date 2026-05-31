from flask import Flask, request, jsonify, session, render_template_string
from datetime import datetime, timedelta
import json
import os

app = Flask(__name__)
app.secret_key = 'sua_chave_secreta_aqui_mudeme'

# Dados em memória (em produção, use banco de dados)
users_data = {}

# ===== FUNÇÕES DE AUTENTICAÇÃO =====

def get_usuario_logado():
    """Obter usuário logado da sessão"""
    return session.get('usuarioLogado')

def get_nome_usuario():
    """Obter nome do usuário da sessão"""
    return session.get('nomeUsuario')

def verificar_login():
    """Verificar se o usuário está logado"""
    return get_usuario_logado() is not None

# ===== FUNÇÕES DE PROGRESSO =====

def get_progresso():
    """Obter progresso do usuário"""
    usuario = get_usuario_logado()
    if not usuario:
        return None
    
    if usuario not in users_data:
        users_data[usuario] = {
            'nome': get_nome_usuario(),
            'progresso': {
                'unidade1': False,
                'unidade2': False,
                'unidade3': False,
                'quizUnidade1': False,
                'quizUnidade2': False,
                'quizUnidade3': False,
                'declaracaoAprendizagemConcluida': False
            },
            'respostas_quiz': {}
        }
    
    return users_data[usuario]['progresso']

def salvar_progresso(chave, valor):
    """Salvar progresso do usuário"""
    usuario = get_usuario_logado()
    if usuario and usuario in users_data:
        users_data[usuario]['progresso'][chave] = valor
        return True
    return False

def calcular_progresso():
    """Calcular percentual de progresso"""
    progresso = get_progresso()
    if not progresso:
        return 0
    
    total = 7
    concluidos = sum(1 for v in progresso.values() if v is True)
    percentual = round((concluidos / total) * 100)
    return percentual

# ===== FUNÇÕES DE QUIZ =====

def salvar_respostas_quiz(unidade, respostas):
    """Salvar respostas do quiz"""
    usuario = get_usuario_logado()
    if usuario and usuario in users_data:
        users_data[usuario]['respostas_quiz'][unidade] = respostas
        return True
    return False

def carregar_respostas_quiz(unidade):
    """Carregar respostas salvas do quiz"""
    usuario = get_usuario_logado()
    if usuario and usuario in users_data:
        return users_data[usuario]['respostas_quiz'].get(unidade)
    return None

def quiz_ja_respondido(unidade):
    """Verificar se quiz já foi respondido com sucesso"""
    return carregar_respostas_quiz(unidade) is not None

# ===== FUNÇÕES DE CERTIFICADO =====

def gerar_certificado():
    """Gerar certificado em formato HTML"""
    progresso = get_progresso()
    nome = get_nome_usuario()
    
    if not progresso or not progresso.get('declaracaoAprendizagemConcluida'):
        return None
    
    data = datetime.now().strftime('%d de %B de %Y').replace(
        'January', 'janeiro'
    ).replace('February', 'fevereiro').replace('March', 'março').replace(
        'April', 'abril'
    ).replace('May', 'maio').replace('June', 'junho').replace(
        'July', 'julho'
    ).replace('August', 'agosto').replace('September', 'setembro').replace(
        'October', 'outubro'
    ).replace('November', 'novembro').replace('December', 'dezembro')
    
    certificado = f"""
    <div class="certificado">
        <div class="certificado-titulo">Certificado de Conclusão</div>
        <div class="certificado-texto">Certifica-se que</div>
        <div class="certificado-nome">{nome}</div>
        <div class="certificado-texto">
            Completou com sucesso a declaração de aprendizagem<br>
            <strong>"Profissional do Futuro"</strong>
        </div>
        <div class="certificado-texto">
            Demonstrando competência e conhecimento em todos os módulos apresentados.
        </div>
        <div class="certificado-data">
            Emitido em {data}
        </div>
    </div>
    """
    
    return certificado

# ===== ROTAS DA API =====

@app.route('/')
def index():
    """Página inicial"""
    return 'Backend Flask está rodando!'

@app.route('/api/login', methods=['POST'])
def login():
    """Fazer login do usuário"""
    dados = request.json
    usuario = dados.get('usuario')
    nome = dados.get('nome')
    
    if not usuario or not nome:
        return jsonify({'sucesso': False, 'mensagem': 'Dados inválidos'}), 400
    
    session['usuarioLogado'] = usuario
    session['nomeUsuario'] = nome
    session.permanent = True
    app.permanent_session_lifetime = timedelta(days=7)
    
    # Inicializar dados do usuário
    if usuario not in users_data:
        users_data[usuario] = {
            'nome': nome,
            'progresso': {
                'unidade1': False,
                'unidade2': False,
                'unidade3': False,
                'quizUnidade1': False,
                'quizUnidade2': False,
                'quizUnidade3': False,
                'declaracaoAprendizagemConcluida': False
            },
            'respostas_quiz': {}
        }
    
    return jsonify({'sucesso': True, 'mensagem': 'Login realizado com sucesso'})

@app.route('/api/logout', methods=['POST'])
def logout():
    """Fazer logout do usuário"""
    session.clear()
    return jsonify({'sucesso': True, 'mensagem': 'Logout realizado com sucesso'})

@app.route('/api/usuario', methods=['GET'])
def get_usuario():
    """Obter dados do usuário logado"""
    if not verificar_login():
        return jsonify({'logado': False}), 401
    
    return jsonify({
        'logado': True,
        'usuario': get_usuario_logado(),
        'nome': get_nome_usuario()
    })

@app.route('/api/progresso', methods=['GET'])
def get_progresso_route():
    """Obter progresso do usuário"""
    if not verificar_login():
        return jsonify({'erro': 'Não autenticado'}), 401
    
    progresso = get_progresso()
    percentual = calcular_progresso()
    
    return jsonify({
        'progresso': progresso,
        'percentual': percentual
    })

@app.route('/api/progresso', methods=['POST'])
def salvar_progresso_route():
    """Salvar progresso do usuário"""
    if not verificar_login():
        return jsonify({'erro': 'Não autenticado'}), 401
    
    dados = request.json
    chave = dados.get('chave')
    valor = dados.get('valor')
    
    if salvar_progresso(chave, valor):
        percentual = calcular_progresso()
        return jsonify({
            'sucesso': True,
            'percentual': percentual,
            'mensagem': 'Progresso atualizado'
        })
    
    return jsonify({'sucesso': False, 'mensagem': 'Erro ao salvar progresso'}), 400

@app.route('/api/quiz/<unidade>/salvar', methods=['POST'])
def salvar_quiz_route(unidade):
    """Salvar respostas do quiz"""
    if not verificar_login():
        return jsonify({'erro': 'Não autenticado'}), 401
    
    dados = request.json
    respostas = dados.get('respostas', {})
    
    if salvar_respostas_quiz(unidade, respostas):
        return jsonify({
            'sucesso': True,
            'mensagem': 'Respostas salvas com sucesso'
        })
    
    return jsonify({'sucesso': False, 'mensagem': 'Erro ao salvar respostas'}), 400

@app.route('/api/quiz/<unidade>/carregar', methods=['GET'])
def carregar_quiz_route(unidade):
    """Carregar respostas salvas do quiz"""
    if not verificar_login():
        return jsonify({'erro': 'Não autenticado'}), 401
    
    respostas = carregar_respostas_quiz(unidade)
    ja_respondido = quiz_ja_respondido(unidade)
    
    return jsonify({
        'respostas': respostas,
        'jaRespondido': ja_respondido
    })

@app.route('/api/quiz/<unidade>/validar', methods=['POST'])
def validar_quiz_route(unidade):
    """Validar resposta do quiz"""
    if not verificar_login():
        return jsonify({'erro': 'Não autenticado'}), 401
    
    dados = request.json
    resposta_usuario = dados.get('resposta')
    
    # Respostas corretas
    respostas_corretas = {
        'unidade1': 'a',
        'unidade2': 'b',
        'unidade3': 'c'
    }
    
    if unidade not in respostas_corretas:
        return jsonify({'sucesso': False, 'mensagem': 'Unidade inválida'}), 400
    
    resposta_correta = respostas_corretas[unidade]
    acertou = resposta_usuario == resposta_correta
    
    if acertou:
        chave_progresso = f'quiz{unidade.capitalize()}'
        salvar_progresso(chave_progresso, True)
    
    return jsonify({
        'acertou': acertou,
        'respostaCorreta': resposta_correta,
        'mensagem': 'Resposta Correta! Parabéns!' if acertou else 'Resposta Incorreta. Tente novamente!'
    })

@app.route('/api/unidade/<unidade>/concluir', methods=['POST'])
def concluir_unidade_route(unidade):
    """Concluir uma unidade"""
    if not verificar_login():
        return jsonify({'erro': 'Não autenticado'}), 401
    
    if salvar_progresso(unidade, True):
        percentual = calcular_progresso()
        return jsonify({
            'sucesso': True,
            'percentual': percentual,
            'mensagem': f'Parabéns! Você concluiu a {unidade.upper()}!'
        })
    
    return jsonify({'sucesso': False, 'mensagem': 'Erro ao concluir unidade'}), 400

@app.route('/api/declaracao/concluir', methods=['POST'])
def concluir_declaracao_route():
    """Concluir a declaração de aprendizagem"""
    if not verificar_login():
        return jsonify({'erro': 'Não autenticado'}), 401
    
    progresso = get_progresso()
    unidades_completas = (progresso.get('unidade1') and 
                         progresso.get('unidade2') and 
                         progresso.get('unidade3'))
    
    if not unidades_completas:
        return jsonify({
            'sucesso': False,
            'mensagem': 'Você precisa completar todas as unidades!'
        }), 400
    
    salvar_progresso('declaracaoAprendizagemConcluida', True)
    certificado = gerar_certificado()
    
    return jsonify({
        'sucesso': True,
        'certificado': certificado,
        'mensagem': 'Declaração de aprendizagem concluída!'
    })

@app.route('/api/certificado', methods=['GET'])
def get_certificado_route():
    """Obter certificado"""
    if not verificar_login():
        return jsonify({'erro': 'Não autenticado'}), 401
    
    certificado = gerar_certificado()
    
    if certificado:
        return jsonify({
            'sucesso': True,
            'certificado': certificado
        })
    
    return jsonify({
        'sucesso': False,
        'mensagem': 'Certificado não disponível'
    }), 400

@app.route('/api/status', methods=['GET'])
def status():
    """Verificar status da API"""
    return jsonify({
        'status': 'online',
        'usuarios_ativos': len(users_data)
    })

# ===== TRATAMENTO DE ERROS =====

@app.errorhandler(404)
def nao_encontrado(erro):
    return jsonify({'erro': 'Rota não encontrada'}), 404

@app.errorhandler(500)
def erro_servidor(erro):
    return jsonify({'erro': 'Erro no servidor'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)
