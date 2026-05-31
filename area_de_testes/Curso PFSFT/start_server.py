#!/usr/bin/env python3
"""
Script de inicialização rápida do servidor Flask
Execute: python start_server.py
"""

import os
import sys
import subprocess
from pathlib import Path

def main():
    print("=" * 60)
    print("🚀 Iniciando Servidor - Profissional do Futuro")
    print("=" * 60)
    
    # Verificar se Python está instalado
    print("\n✓ Python detectado: ", sys.version)
    
    # Verificar se Flask está instalado
    print("\nVerificando dependências...")
    try:
        import flask
        print("✓ Flask instalado:", flask.__version__)
    except ImportError:
        print("\n❌ Flask não instalado!")
        print("Instale com: pip install -r requirements.txt")
        return False
    
    # Iniciar servidor
    print("\n" + "=" * 60)
    print("Iniciando servidor em http://localhost:5000")
    print("=" * 60)
    print("\nDicas:")
    print("- Abra seu navegador em http://localhost:5000")
    print("- Ou abra o arquivo login.html")
    print("- Use Ctrl+C para parar o servidor\n")
    
    # Importar e executar
    try:
        from app import app
        app.run(debug=True, host='localhost', port=5000)
    except Exception as e:
        print(f"\n❌ Erro ao iniciar servidor: {e}")
        return False
    
    return True

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
