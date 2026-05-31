# Conversão de JavaScript para Python com Flask

## Descrição
Este projeto converte a lógica do JavaScript (`script.js`) para um backend em Python usando Flask, mantendo a funcionalidade do HTML intacta através de requisições AJAX.

## Arquivos Criados

### 1. `app.py` - Backend Python com Flask
- Implementa todas as funções de negócio em Python
- Gerencia autenticação, progresso, quiz e certificados
- Fornece uma API REST para o frontend

### 2. `script_api.js` - JavaScript integrado com API
- Substitui as funções locais por chamadas ao backend
- Mantém a mesma interface para o HTML
- Usa `async/await` para requisições HTTP

### 3. `requirements.txt` - Dependências Python
- Flask: framework web
- Werkzeug: utilities para Flask

## Instalação e Execução

### 1. Instalar Python (se não tiver)
- Download em https://www.python.org

### 2. Instalar Dependências
```bash
# Abra o terminal na pasta do projeto
pip install -r requirements.txt
```

### 3. Executar o Servidor Flask
```bash
python app.py
```

Você verá algo como:
```
Running on http://127.0.0.1:5000
```

### 4. Atualizar o HTML
**Altere todos os arquivos HTML para usar `script_api.js` ao invés de `script.js`**

Exemplo (em login.html, index.html, etc):

```html
<!-- Antes -->
<script src="script.js"></script>

<!-- Depois -->
<script src="script_api.js"></script>
```

## Funcionalidades Convertidas

✅ Autenticação e Login  
✅ Gerenciamento de Progresso  
✅ Sistema de Quiz com Validação  
✅ Geração de Certificados  
✅ Persistência de Dados no Backend  

## API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/login` | Login do usuário |
| POST | `/api/logout` | Logout |
| GET | `/api/usuario` | Dados do usuário logado |
| GET | `/api/progresso` | Obter progresso |
| POST | `/api/progresso` | Salvar progresso |
| POST | `/api/quiz/<unidade>/salvar` | Salvar respostas do quiz |
| GET | `/api/quiz/<unidade>/carregar` | Carregar respostas do quiz |
| POST | `/api/quiz/<unidade>/validar` | Validar resposta do quiz |
| POST | `/api/unidade/<unidade>/concluir` | Concluir uma unidade |
| POST | `/api/declaracao/concluir` | Concluir declaração |
| GET | `/api/certificado` | Gerar certificado |

## Vantagens da Conversão

1. **Segurança**: Lógica de negócio no servidor
2. **Escalabilidade**: Fácil adicionar banco de dados
3. **Manutenibilidade**: Código Python bem estruturado
4. **Portabilidade**: Pode usar em diferentes interfaces
5. **Backup**: Dados persistem no servidor

## Próximos Passos (Opcional)

### Adicionar Banco de Dados
Substitua `users_data = {}` por um banco SQL:

```python
import sqlite3
# ou
from sqlalchemy import create_engine
```

### Adicionar Autenticação Real
Implemente hash de senha:

```python
from werkzeug.security import generate_password_hash, check_password_hash
```

### Adicionar CORS (se Frontend em outro servidor)
```python
from flask_cors import CORS
CORS(app)
```

### Deploy em Produção
- Use Gunicorn: `gunicorn app:app`
- Configure um servidor Nginx
- Use um serviço de cloud (Heroku, PythonAnywhere, etc)

## Troubleshooting

**Erro: "Cannot POST /api/login"**
- Certifique-se de que o servidor Flask está rodando
- Verifique se a URL está correta

**Erro: CORS bloqueado**
- Instale flask-cors: `pip install flask-cors`
- Adicione no app.py: `CORS(app)`

**Sessão perdida após recarregar**
- Configure `session.permanent = True` (já feito no código)
- Aumentar tempo de sessão se necessário

## Estrutura do Projeto

```
Curso PFSFT/
├── app.py                 # Backend Python
├── script_api.js          # JavaScript integrado
├── requirements.txt       # Dependências Python
├── login.html            # Páginas HTML (atualize o script)
├── index.html
├── unidade1.html
├── unidade2.html
├── unidade3.html
├── conclusao.html
├── styles.css
└── img/
```

## Mudanças Necessárias no HTML

Em TODOS os seus arquivos HTML, faça esta mudança:

```html
<!-- Remova ou comente esta linha -->
<!-- <script src="script.js"></script> -->

<!-- Adicione esta linha -->
<script src="script_api.js"></script>
```

## Suporte

Para dúvidas ou problemas, consulte a documentação do Flask:
- https://flask.palletsprojects.com
