import json
import os

def login(user_input, senha_input):
    caminho_arquivo = 'usuarios.json'
    
    # 1. Verifica se o arquivo existe antes de tentar abrir
    if not os.path.exists(caminho_arquivo):
        return False, "Erro: Nenhum usuário cadastrado."

    # 2. Carrega os dados do arquivo JSON
    with open(caminho_arquivo, 'r') as arquivo:
        usuarios = json.load(arquivo)

    # 3. Lógica de verificação
    if user_input not in usuarios:
        return False, "Erro: Usuário não encontrado."
    else:
        # Se o usuário existe, verifica a senha vinculada a ele
        if usuarios[user_input] == senha_input:
            return True, f"Bem-vindo, {user_input}!"
        else:
            return False, "Erro: Senha incorreta."

# Para testar, o arquivo 'usuarios.json' precisaria ser algo como:
# {"joao": "1234", "maria": "senha123"}
