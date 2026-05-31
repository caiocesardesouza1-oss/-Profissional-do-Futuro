# Resumo Rápido: JavaScript → Python com Flask

## 🚀 Start Rápido (5 minutos)

### 1. Abra PowerShell/Terminal na pasta do projeto

```powershell
cd "C:\Users\Acla0\Downloads\-Profissional-do-Futuro-main\-Profissional-do-Futuro-main\Curso PFSFT"
```

### 2. Instale Flask

```powershell
pip install -r requirements.txt
```

### 3. Execute o servidor

```powershell
python app.py
```

Deve aparecer:
```
 * Running on http://127.0.0.1:5000
```

### 4. Abra seu login.html

Arraste o arquivo para o navegador ou use Live Server (VS Code)

### 5. Teste o login

- Usuário: `joao`
- Nome: `João Silva`
- Clique em Entrar

---

## 📝 Mudanças Necessárias no HTML

**EM CADA ARQUIVO HTML:**

```html
<!-- Antes -->
<script src="script.js"></script>

<!-- Depois -->
<script src="script_api.js"></script>
```

---

## 📊 O que foi Convertido

| Função JS | Para Python | Localização |
|-----------|------------|------------|
| Login/Logout | POST /api/login | `app.py` |
| getProgresso() | GET /api/progresso | `app.py` |
| salvarProgresso() | POST /api/progresso | `app.py` |
| validarQuiz() | POST /api/quiz/.../validar | `app.py` |
| gerarCertificado() | GET /api/certificado | `app.py` |

---

## 🔧 Estrutura do Projeto

```
Curso PFSFT/
│
├── app.py                    ← Backend Python (NOVO!)
├── script_api.js             ← JavaScript integrado (NOVO!)
├── script.js                 ← Antigo (pode deletar)
├── requirements.txt          ← Dependências (NOVO!)
│
├── login.html               ← Atualize o script!
├── index.html               ← Atualize o script!
├── unidade1.html            ← Atualize o script!
├── unidade2.html            ← Atualize o script!
├── unidade3.html            ← Atualize o script!
├── conclusao.html           ← Atualize o script!
│
├── styles.css
└── img/
```

---

## 💡 Exemplos de Uso

### Login
```html
<button onclick="fazerLogin('joao', 'João Silva')">Entrar</button>
```

### Progresso
```html
<button onclick="salvarProgresso('unidade1', true)">Completar Unidade 1</button>
```

### Quiz
```html
<button onclick="validarQuiz('unidade1')">Enviar Resposta</button>
```

### Certificado
```html
<button onclick="gerarCertificado()">Gerar Certificado</button>
```

---

## ✅ Checklist de Instalação

- [ ] Python instalado
- [ ] Dependências instaladas (`pip install -r requirements.txt`)
- [ ] Servidor Flask rodando (`python app.py`)
- [ ] HTML atualizado com `script_api.js`
- [ ] Testado login
- [ ] Testado progresso
- [ ] Testado quiz

---

## 🐛 Problemas Comuns

### Erro: "Cannot POST /api/login"
→ Servidor Flask não está rodando. Execute: `python app.py`

### Erro: "ERR_FAILED"
→ Verifique se Flask está em http://localhost:5000

### Arquivo não encontrado
→ Certifique-se que os arquivos estão na mesma pasta

### Session não persiste
→ Normal em desenvolvimento. Dados em memória são perdidos ao reiniciar o servidor

---

## 📌 Mudança Principal

Todas essas funções **agora se conectam ao Python**:

```javascript
// Autenticação
fazerLogin()          ← Conecta a /api/login
logout()              ← Conecta a /api/logout

// Progresso
getProgresso()        ← Conecta a /api/progresso
salvarProgresso()     ← Conecta a /api/progresso

// Quiz
validarQuiz()         ← Conecta a /api/quiz/.../validar
carregarRespostasQuiz()  ← Conecta a /api/quiz/.../carregar

// Certificado
gerarCertificado()    ← Conecta a /api/certificado
```

---

## 🔐 Dados São Salvos Aonde?

- **Desenvolvimento**: Em memória (Python)
- **Produção**: Banco de dados (configure em app.py)

---

## 📦 Próximas Melhorias

1. **Banco de dados**: SQLite, PostgreSQL
2. **Senha segura**: Hash com werkzeug
3. **Deploy**: Heroku, PythonAnywhere
4. **CORS**: Para frontend em outro servidor

---

## 🎓 Exemplo Completo

Ver arquivo: `login_exemplo.html`

---

## ❓ FAQ

**P: Preciso deletar script.js?**  
R: Não obrigatório, mas pode deletar para evitar confusão.

**P: Posso usar ambos JS e Python?**  
R: Sim, use `script_api.js` para chamar Python via API.

**P: Dados são salvos permanentemente?**  
R: Não. Reiniciar o servidor perde dados. Use banco de dados para persistência.

**P: Preciso de Node.js?**  
R: Não! Apenas Python e Flask.

---

## 📞 Suporte

1. Verifique o terminal para mensagens de erro
2. Consulte README_PYTHON.md para mais detalhes
3. Veja INTEGRACAO_HTML.md para integração
4. Verifique login_exemplo.html para exemplo completo
