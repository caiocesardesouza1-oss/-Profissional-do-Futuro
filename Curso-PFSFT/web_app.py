from flask import Flask, request, jsonify
from flask_cors import CORS
from sistema_login import login
from sistema_cadastro import cadastro

app = Flask(__name__)
CORS(app) # Permite que o HTML acesse o Python

@app.route('/api/login', methods=['POST'])
def api_login():
    dados = request.json
    sucesso, mensagem = login(dados['usuario'], dados['senha'])
    return jsonify({"sucesso": sucesso, "mensagem": mensagem})

@app.route('/api/cadastro', methods=['POST'])
def api_cadastro():
    dados = request.json
    sucesso, mensagem = cadastro(dados['usuario'], dados['senha'])
    return jsonify({"sucesso": sucesso, "mensagem": mensagem})

if __name__ == "__main__":
    app.run(debug=True, port=5000)