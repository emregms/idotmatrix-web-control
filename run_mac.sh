#!/bin/bash
if [ -f "backend/venv/bin/python" ]; then
    backend/venv/bin/python launcher.py
else
    echo "Python sanal ortamı bulunamadı (backend/venv). Lütfen önce kurulumu yapın."
    echo "Kurulum için: cd backend && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
fi
