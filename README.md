# Controle de Banco de Horas

Esta é uma aplicação simples em React para calcular e gerenciar seu banco de horas.

## Funcionalidades

- **Calcular Saldo de Horas:** Insira seus horários de entrada e saída para calcular o total de horas trabalhadas no dia e o saldo final, considerando a jornada de trabalho padrão de 8 horas.
- **Calcular Hora de Saída Ideal:** Se você ainda não registrou sua última saída, a aplicação calcula qual seria o horário ideal para sair a fim de completar a jornada de 8 horas.
- **Saldo Inicial:** É possível informar um saldo de horas (positivo ou negativo) de dias anteriores, que será considerado no cálculo do saldo final.
- **Importar Horários:** Cole um texto qualquer que contenha seus horários (no formato `HH:MM`) e a aplicação irá extrair e preencher os campos de entrada e saída automaticamente.
- **Persistência Local:** Os horários e o saldo inicial são salvos no seu navegador, para que você não perca os dados ao recarregar a página.

## Como Usar

1.  **Informe o Saldo Inicial (Opcional):** Se você tem um saldo de horas de dias anteriores, insira-o no campo "Saldo Inicial". Use formatos como `2h30min`, `-1h15min` ou apenas os minutos (ex: `150` ou `-75`).
2.  **Preencha os Horários:** Insira os horários de entrada e saída nos campos correspondentes.
3.  **Calcular:**
    -   Se preencher os 4 campos, clique em **Calcular** para ver o total trabalhado e o saldo final do dia.
    -   Se preencher apenas as 3 primeiras entradas, clique em **Calcular** para descobrir a hora ideal da sua última saída.
4.  **Limpar:** Use o botão **Limpar** para apagar todos os campos e recomeçar.

## Como Executar o Projeto Localmente

Para executar este projeto em sua máquina, siga os passos abaixo:

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/Clopes1997/timebank.git
    ```
2.  **Navegue até o diretório do projeto:**
    ```bash
    cd timebank
    ```
3.  **Instale as dependências:**
    ```bash
    npm install
    ```
4.  **Inicie a aplicação:**
    ```bash
    npm start
    ```

A aplicação estará disponível em `http://localhost:3000`.
