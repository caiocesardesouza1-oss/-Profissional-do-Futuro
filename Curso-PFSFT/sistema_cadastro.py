import json
import os

def cadastro(nome_usuario, senha_usuario):
    
    arquivo_nome = "usuarios.json"
    usuarios = {}

    # 1. Carrega os dados existentes se o arquivo já existir
    if os.path.exists(arquivo_nome):
        with open(arquivo_nome, "r", encoding='utf-8') as arquivo:
            try:
                usuarios = json.load(arquivo)
            except json.JSONDecodeError:
                usuarios = {}

    # 2. Verifica se o usuário já está cadastrado no dicionário
    if nome_usuario in usuarios:
        return False, f"Erro: O usuário '{nome_usuario}' já existe."

    # 3. Adiciona o novo usuário e salva no arquivo (modo "w" para escrita)
    usuarios[nome_usuario] = senha_usuario
    
    with open(arquivo_nome, "w", encoding='utf-8') as arquivo:
        json.dump(usuarios, arquivo, ensure_ascii=False, indent=4)
    
    return True, f"Usuário '{nome_usuario}' criado com sucesso!"