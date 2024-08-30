
# Teste Desenvolvimento Web - Backend - Shopper

Este projeto foi desenvolvido para cumprir os requisitos do desafio técnico de desenvolvimento web da Shopper, etapa de backend.

## Rodando localmente

Seguindo as instruções do desafio técnico o projeto está containerizado, portando será necessário possuir o Docker instalado para iniciar a aplicação.

Clone o projeto

```bash
  git clone https://link-para-o-projeto
```

Entre no diretório do projeto

```bash
  cd my-project
```

Inicie o servidor

- As dependências serão instaladas
- O banco de dados seráiniciado
- As migrações serão realizadas
- O servidor será inicializado na porta 3000

```bash
  npm run start
```

## Testes unitários

Seguindo boas práticas de programação, o projeto conta com testes unitários em sua camada de serviços. Para iniciar os testes, rode o seguinte comando:

```bash
  npm run test
```

## Documentação

Após iniciar a aplicação, acesse o swagger para verificar sua  
[Documentação](http://localhost:3000/docs/)

## Aprendizados

Neste projeto pude aplicar e solidificar conhecimentos que já tinha sobre Express, APIs REST e boas práticas de programação, como testes unitários e Design Patterns (Repository Pattern, Service Layer, Singleton).

Enfrentei um desafio para containerizar os dois serviços de forma que não fosse necessário rodar nenhum comando manualmente, enfrentei esse desafio criando e testando diferentes configurações do DockerFile e docker-compose e isso me trouxe grande aprendizado em Docker.

Também enfrentei um desafio para a LLM retornar o valor correto da leitura enviada na imagem, o qual solucionei realizando engenharia de prompt e testando a quais comandos o Gemini respondia melhor.

## Para a equipe Shopper

Primeiramente, gostaria de agradecer pela oportunidade de realizar o desafio técnico.

Por meio deste, gostaria de informar que achei que alguns pontos de concordância nos requisitos do desafio poderiam estar incorretos, mas criei a API seguindo integralmente as instruções do desafio, apenas adicionando processos em requisitos que estavam implícitos.

A independer do resultado do desafio, estarei disponível para contato!
