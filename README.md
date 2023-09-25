# business-finance-telebot
Telegram bot that accepts the messages and communicates them with the monitor-api for documentation

Needs docker-compose.yml for it to work with docker:
version: '1.0'
services:

  bfm-telebot:
    build: .
    container_name: bfm-telebot
    environment:
      - uri="http://localhost:9090/"
      - botToken=6204729808:AAGp9jPdvhA7ZFVwPyBqbJJ86Lesr07Jc2o
