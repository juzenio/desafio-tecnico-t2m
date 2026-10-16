# Automação de testes com Cypress

Projeto de testes automatizados com Cypress e TypeScript para dois alvos públicos: a API [Restful Booker](https://restful-booker.herokuapp.com/) e a aplicação web [Sauce Demo](https://www.saucedemo.com/).

A suíte contém **13 cenários funcionais**: 6 de API e 7 de interface. O objetivo é validar comportamentos importantes para o usuário e para as integrações, incluindo fluxos positivos, validações e respostas a operações não autorizadas.

> **Sobre a cobertura:** os números deste README descrevem os comportamentos e fluxos exercitados pelos testes. O projeto não instrumenta o código das aplicações para calcular percentual de cobertura de linhas, funções ou branches. Como os sistemas testados são serviços externos, esse percentual não está disponível neste repositório.

## Por que esses testes

A seleção prioriza fluxos que, se falharem, impedem o uso das funcionalidades principais ou podem comprometer dados:

- **API:** autenticação e operações de reserva são verificadas com recursos criados pelo próprio teste. Isso valida o contrato HTTP e evita dependência de IDs ou dados previamente existentes.
- **Autorização:** tentativas de atualizar ou excluir uma reserva com token inválido devem ser recusadas, e a reserva deve permanecer inalterada.
- **Interface:** login, checkout e logout cobrem o caminho principal do usuário, enquanto credenciais inválidas, campos obrigatórios, usuário bloqueado e remoção do carrinho exercitam respostas a erros comuns.
- **Valores da compra:** o teste confere item, subtotal, imposto e total antes de finalizar. Isso detecta divergências na apresentação do resumo do pedido.
- **Manutenção:** os specs de API e interface estão separados; Page Objects concentram as interações da interface e comandos de suporte reutilizam operações HTTP.

## O que está coberto

| Área | Cenários | O que é verificado | Por que é importante |
|---|---:|---|---|
| API - autenticação | 2 | Token para credenciais válidas; rejeição de credenciais inválidas sem token | Confirma o início da sessão e a resposta para dados incorretos |
| API - reservas | 2 | Criar, consultar, atualizar e excluir uma reserva; atualizar parcialmente com PATCH | Verifica o ciclo de vida do recurso e a preservação dos campos não alterados |
| API - autorização e erro | 2 | PUT e DELETE com token inválido; consulta com identificador não numérico | Confirma que operações protegidas são recusadas e identificadores inválidos não retornam uma reserva |
| Interface - login | 3 | Campos vazios, credenciais inválidas e usuário bloqueado | Valida mensagens e comportamentos de erro antes de acessar a aplicação |
| Interface - compra | 3 | Campos obrigatórios do checkout, remoção do carrinho e compra completa com valores conferidos | Protege o fluxo principal e valida o resumo financeiro apresentado |
| Interface - logout | 1 | Encerrar a sessão e retornar à tela de login | Confirma que o usuário consegue sair da aplicação |

Os testes da API criam reservas próprias e tentam removê-las ao final. A limpeza também aceita HTTP 404 quando o serviço público já removeu o recurso. Os testes de interface usam dados de demonstração do Sauce Demo.

## Estrutura do projeto

```text
cypress/
|-- e2e/
|   |-- api/                 # autenticação, reservas e cenários negativos
|   `-- ui/                  # login, compra e logout
|-- fixtures/                # dados de reserva e usuários de demonstração
|-- pages/                   # Page Objects do Sauce Demo
|-- support/
|   |-- api.commands.ts      # operações HTTP reutilizáveis
|   |-- commands.ts          # comando de login da interface
|   `-- e2e.ts               # registro e configuração de suporte
`-- types/                   # tipos TypeScript compartilhados da API
```

## Requisitos

- Node.js 20 ou superior
- npm
- Acesso à internet para instalar dependências e acessar os serviços públicos

## Instalação e execução

Na raiz do repositório, instale as dependências usando o lockfile para obter versões consistentes:

```bash
npm ci
```

Execute toda a suíte em modo headless:

```bash
npm test
```

O Cypress também pode ser executado por alvo:

```bash
npm run test:api
npm run test:ui
```

Para abrir a interface do Cypress, selecionar um spec e acompanhar os comandos e as asserções:

```bash
npm run test:open
```

Na interface, escolha **E2E Testing**, selecione um navegador disponível e abra o spec desejado em `cypress/e2e/api/` ou `cypress/e2e/ui/`. Para inspecionar uma requisição de autenticação da API, abra `cypress/e2e/api/auth.cy.ts` e selecione o comando `apiAuthenticate` no Command Log. O plugin de API exibe detalhes da requisição e da resposta; a senha é mascarada.

## Configuração de credenciais

Os acessos públicos de demonstração do Sauce Demo ficam centralizados em `cypress/fixtures/users.json`. Os testes de interface usam os perfis `standard`, `lockedOut` e `invalid`; a senha válida é compartilhada no campo `password` do fixture. Esses dados são específicos dos testes de UI e não são configurados no `cypress.config.ts`.

As credenciais da API Restful Booker podem ser sobrescritas por variáveis de ambiente. Os valores padrão são credenciais públicas de demonstração:

| Variável | Uso | Padrão |
|---|---|---|
| `RESTFULBOOKER_USERNAME` | Usuário da API Restful Booker | `admin` |
| `RESTFULBOOKER_PASSWORD` | Senha da API Restful Booker | `password123` |

Exemplo no PowerShell:

```powershell
$env:RESTFULBOOKER_USERNAME = "admin"
$env:RESTFULBOOKER_PASSWORD = "password123"
npm test
```

Não armazene credenciais privadas ou segredos no fixture nem no repositório. Para ambientes privados, injete as credenciais da API por variáveis de ambiente ou secrets da CI.

## Decisoes tecnicas

- **Cypress com TypeScript:** mantém os cenários tipados e usa o mesmo runner para API e interface.
- **Separação entre API e UI:** permite executar e diagnosticar cada alvo de forma independente.
- **Page Objects e comandos reutilizáveis:** evitam repetir seletores, interações e chamadas HTTP nos cenários.
- **Seletores `data-test`:** reduzem a dependência da estrutura visual do Sauce Demo.
- **Asserções sobre estados observáveis:** o Cypress aguarda as condições verificadas em vez de depender de esperas fixas por tempo.
- **Limpeza de dados de teste:** reservas criadas pela suíte são removidas ao final do teste sempre que possível.
- **Evidências e execução:** o vídeo está desativado para manter a execução mais leve; a interface do Cypress pode ser usada para inspecionar comandos interativamente.

## Limites conhecidos

- Restful Booker e Sauce Demo são serviços públicos. Indisponibilidade, lentidão, alterações externas ou limites de acesso podem afetar os resultados sem que isso represente necessariamente um defeito nos testes.
- A API é compartilhada com outros usuários, portanto os dados podem mudar externamente. A suíte cria reservas específicas para seus fluxos e não pressupõe dados preexistentes.
- A cobertura atual é funcional e focada nos riscos descritos acima; não inclui todos os usuários, produtos, combinações de payload ou navegadores.
- O projeto não possui pipeline de CI nem relatório de cobertura de código configurados.

## Evolução possível

- Ampliar os casos de erro da API, como ausência de token e payloads inválidos, após validar o contrato atual do serviço.
- Adicionar cenários de negócio da interface e navegadores conforme a necessidade e a estabilidade dos ambientes.
- Configurar execução em CI, armazenamento de evidências em falhas e histórico de resultados.
- Avaliar a instrumentação e um relatório de cobertura de código caso o código da aplicação sob teste passe a estar disponível no projeto.
