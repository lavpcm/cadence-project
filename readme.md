# Cadance - Achieve your Goals

Este projeto é um gerenciador de hábitos simples, projetado para ajudar pessoas a criar, acompanhar e manter hábitos ao longo de determinado período de tempo. Seu objetivo principal é facilitar a construção de rotinas alinhadas a metas pessoais do usuário. O projeto segue o padrão MVC (Model-View-Controller), utilizando PostgreSQL como banco de dados.

## Requisitos

- Node.js (versão 22.15.0)
- PostgreSQL (versão 15.8.0)

## Instalação

1. **Clonar o repositório:**

```bash
   git clone https://github.com/lavpcm/mvc-boilerplate.git
   cd seu-projeto
```

2. **Instalar as dependências:**
    
```bash
npm install
```
    
3. **Configurar o arquivo `.env`:**
    
No arquivo `.env` configure as variáveis de ambiente necessárias 
    

Configuração do Banco de Dados
------------------------------

1. **Criar banco de dados:**
    
    Crie um banco de dados PostgreSQL com o nome especificado no seu arquivo `.env`.
    
2. **Executar o script SQL de inicialização:**
    
```bash
npm run init-db
```
    
Cria as tabelas e estruturas necessárias no banco de dados, conforme definido nos modelos do projeto.

3. **Verificar a conexão com o banco de dados:**

    Certifique-se de que o banco de dados está em execução e que as credenciais no arquivo `.env` estão corretas. Você pode testar a conexão executando o comando:

    ```bash
    npm run check-db
    ```

    Este comando verificará se o banco de dados está acessível e se as tabelas foram criadas corretamente.
    

Funcionalidades
---------------

## Funcionalidades

- **Gerenciamento de Hábitos**: Criação, edição e exclusão de hábitos personalizados.
- **Acompanhamento de Progresso**: Visualização do progresso diário, semanal e mensal dos hábitos.
- **Configuração Personalizada**: Permite que os usuários ajustem preferências e metas individuais.

Scripts Disponíveis
-------------------

* `npm start`: Inicia o servidor Node.js.
* `npm run dev`: Inicia o servidor com `nodemon`, reiniciando automaticamente após alterações no código.
* `npm run test`: Executa os testes automatizados.
* `npm run test:coverage`: Executa os testes e gera um relatório de cobertura de código.

Estrutura de Diretórios 
-----------------------

* **`config/`**: Configurações do banco de dados e outras configurações do projeto.
* **`controllers/`**: Controladores da aplicação (lógica de negócio).
* **`models/`**: Modelos da aplicação (definições de dados e interações com o banco de dados).
* **`routes/`**: Rotas da aplicação.
* **`tests/`**: Testes automatizados.
* **`views/`**: Views da aplicação (ainda não aplicável, a ser desenvolvido ).


Licença
-------

Este projeto está licenciado sob a Licença MIT.

Este README.md fornece uma visão geral clara do boilerplate, incluindo instruções de instalação, configuração do banco de dados, funcionalidades principais, scripts disponíveis, estrutura de diretórios, como contribuir e informações de licença. Certifique-se de personalizar as seções com detalhes específicos do seu projeto conforme necessário.