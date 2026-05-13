def app_function():
    
    escolha_app = int(input("Bem vindo ao NOME GENERICO, escolha uma opção: \n1- Começar curso \n 2- Ver todo conteudo disponivel do curso \n 3- Ver conteudo ja feito \n 4- Sair\n"))

    if escolha_app == 1:
        print("Iniciando o curso...")
    elif escolha_app == 2:
        print("Verificando conteudo disponivel...")
    elif escolha_app == 3:
        print("Verificando conteudo ja feito...")
    else:
        print("Saindo...")