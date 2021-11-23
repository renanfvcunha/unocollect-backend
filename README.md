<img
  src="./logo.png"
  width="300"
  style="display: block; margin-left: auto; margin-right: auto;"
/>

# Uno Collect - API

## Sobre o Projeto

O aplicativo Uno Collect permite o cadastro de formulários personalizados e a
inserção de respostas por usuários cadastrados.

O projeto atual é uma API Rest que irá contém todas as funcionalidades do sistema.

## Tecnologias e Estrutura
O projeto foi escrito utilizando as seguintes tecnologias:

* Linguagem: Typescript
* Plataforma: NodeJS
* Framework Principal: ExpressJs
* Mapeamento Objeto-Relacional: TypeORM
* Banco de dados preferencial: MySQL 5.7

O projeto foi estruturado no padrão Model-View-Controller (MVC), onde as views
não foram utilizadas por se tratar de uma API Rest. A estrutura de pastas se
divide em:

* src: Pasta principal que contém todos os arquivos importantes do projeto.
* src/app: Pasta que contém subpastas relacionas à regra de negócio da aplicação.
* src/app/controllers: Pasta que contém os controllers da aplicação.
* src/app/middlewares: Pasta que contém os middlewares utilizados nas rotas da
aplicação.
* src/app/models: Pasta que contém as entidades da aplicação, que são utilizadas
  pelo TypeORM.
* src/app/utils: Pasta que contém funções utilitárias.
* src/app/validators: Pasta que contém middlewares de validação, utilizados
  antes de alguns controllers.
* src/config: Pasta que contém arquivos de configurações.

## Como executar o projeto
### Desenvolvimento
1. Instalar as dependências.
```bash
$ npm i

$ yarn
```

2. Copiar o arquivo .env.example nomeando como .env e setar as variáveis de
ambiente necessárias. OBS: As variáveis já setadas devem permanecer como estão.

3. Executar o projeto para a sincronização do TypeORM com o banco de dados.
```bash
$ npm run dev

$ yarn dev
```

4. Após isso o projeto estará pronto para ser utilizado em desenvolvimento.

### Produção
1. Instalar as dependências.
```bash
$ npm i

$ yarn
```

2. Gerar a build de produção.
```bash
$ npm run build

$ yarn build
```

3. Repetir o passo 2 da execução de desenvolvimento, com a diferença de que
os paths do typeorm deverão ser absolutos (desde a raiz do sistema) e deverão
apontar para os arquivos JS dentro da pasta build.

4. Executar o projeto para a sincronização do TypeORM com o banco de dados.
```bash
$ node build/server.js
```

5. Após isso o projeto estará pronto para ser utilizado em produção.