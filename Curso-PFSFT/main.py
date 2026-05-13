import json
import os
from sistema_login import login
from sistema_cadastro import cadastro
from app import app_function

def main():

    while True:
        
        escolha1 = int(input("Bem vindo ao NOME GENERICO, escolha uma opção: \n1- Login \n2- Cadastro \n3- Sair\n"))

        if escolha1 == 1:
            u = input("Usuário: ")
            s = input("Senha: ")
            sucesso, mensagem = login(u, s)
            print(mensagem)
            if sucesso:
                app_function()

        elif escolha1 == 2:
            u = input("Novo Usuário: ")
            s = input("Nova Senha: ")
            sucesso, mensagem = cadastro(u, s)
            print(mensagem)

        else:
            print("Saindo do sistema...")
            break

if __name__ == "__main__":
    main()
