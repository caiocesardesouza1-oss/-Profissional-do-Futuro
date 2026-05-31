# Guia de Integração HTML com Python

## Como Integrar seus Arquivos HTML

### Passo 1: Atualizar Script em Todos os HTML

Em **CADA** arquivo HTML (login.html, index.html, unidade1.html, etc), faça:

```html
<!-- REMOVA ESTA LINHA -->
<script src="script.js"></script>

<!-- ADICIONE ESTA LINHA -->
<script src="script_api.js"></script>
```

---

## Exemplo: Modificar login.html

Se seu `login.html` tiver um formulário assim:

```html
<form id="loginForm" onsubmit="handleLogin(event)">
    <input type="text" id="usuario" placeholder="Usuário" required>
    <input type="text" id="nome" placeholder="Nome Completo" required>
    <button type="submit">Entrar</button>
</form>
```

Adicione este JavaScript no seu HTML:

```html
<script src="script_api.js"></script>
<script>
    async function handleLogin(event) {
        event.preventDefault();
        
        const usuario = document.getElementById('usuario').value;
        const nome = document.getElementById('nome').value;
        
        const sucesso = await fazerLogin(usuario, nome);
        
        if (sucesso) {
            window.location.href = 'index.html';
        }
    }
</script>
```

---

## Exemplo: Modificar Botões de Logout

Se seu HTML tem um botão de logout:

```html
<!-- Antes (JavaScript local) -->
<button onclick="logout()">Sair</button>

<!-- Depois (Mesmo! Funciona com a API agora) -->
<button onclick="logout()">Sair</button>
```

A função `logout()` continua a mesma, mas agora faz chamada ao servidor!

---

## Exemplo: Validar Quiz

Se seu quiz tem um botão assim:

```html
<button onclick="validarQuiz('unidade1')">Enviar Resposta</button>
```

Tudo continua funcionando igual! Agora as respostas são salvas no servidor Python.

---

## Exemplo: Gerar Certificado

```html
<button onclick="gerarCertificado()">Gerar Certificado</button>
```

Funciona exatamente igual! Os dados vêm do backend.

---

## Checklist de Integração

- [ ] Instalar dependências: `pip install -r requirements.txt`
- [ ] Executar servidor: `python app.py`
- [ ] Atualizar `<script src="script_api.js"></script>` em **todos** os HTML
- [ ] Testar login
- [ ] Testar progresso
- [ ] Testar quiz
- [ ] Testar certificado

---

## Funções Disponíveis no script_api.js

Todas essas funções agora vão se conectar ao Python:

```javascript
// Autenticação
fazerLogin(usuario, nome)
logout()
verificarLogin()
getNomeUsuario()

// Progresso
getProgresso()
salvarProgresso(chave, valor)
calcularProgresso()
atualizarBarraProgresso()
atualizarNomeNoHeader()

// Quiz
salvarRespostasQuiz(unidade, respostas)
carregarRespostasQuiz(unidade)
quizJaRespondido(unidade)
restaurarRespostasQuiz(unidade)
validarQuiz(unidade)
limparRespostasQuiz(unidade)

// Certificado
gerarCertificado()
compartilharCertificado()

// Conclusão
concluirUnidade(unidade)
concluirDeclaracaoAprendizagem()
finalizarCurso()
```

---

## Testando a Integração

### 1. Abra o Terminal

```bash
# Navegue até a pasta do projeto
cd "Curso PFSFT"
```

### 2. Instale as dependências

```bash
pip install -r requirements.txt
```

### 3. Execute o servidor Flask

```bash
python app.py
```

Você verá:
```
 * Running on http://127.0.0.1:5000 (Press CTRL+C to quit)
```

### 4. Abra o navegador

Abra seu `login.html` no navegador (pode arrastar para o navegador ou usar Live Server)

### 5. Teste as funcionalidades

- Faça login
- Navegue nas unidades
- Responda aos quizzes
- Veja o progresso atualizar
- Gere o certificado

---

## Troubleshooting

### "Failed to fetch" ou "Cannot POST /api/login"

**Problema**: Servidor Flask não está rodando

**Solução**:
1. Abra terminal
2. Navegue até a pasta do projeto
3. Execute: `python app.py`
4. Verifique se aparece: `Running on http://127.0.0.1:5000`

### Sessão perdida ao recarregar

**Problema**: Normal em desenvolvimento

**Solução**: Flask armazena dados em memória. Para persistência real, adicione um banco de dados.

### Erro 500 no servidor

**Problema**: Erro no Python

**Solução**: 
1. Procure no terminal por mensagens de erro
2. Verifique a sintaxe do seu HTML
3. Verifique se está enviando os dados corretos

---

## Estrutura de Dados Enviada

### Login
```json
{
  "usuario": "joao",
  "nome": "João Silva"
}
```

### Salvar Progresso
```json
{
  "chave": "unidade1",
  "valor": true
}
```

### Resposta Quiz
```json
{
  "resposta": "a"
}
```

---

## Próximos Passos

1. **Adicionar banco de dados**: Substitua `users_data = {}` por SQLite ou PostgreSQL
2. **Adicionar senha**: Use `werkzeug.security` para hash de senhas
3. **Deploy**: Use Heroku, PythonAnywhere ou seu servidor
4. **CORS**: Se frontend e backend em portas diferentes, instale `flask-cors`

---

## Dúvidas?

Consulte a documentação:
- Flask: https://flask.palletsprojects.com
- Python: https://python.org
- JavaScript Fetch: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
