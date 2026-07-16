# 💰 OrganizaFin - Organização Financeira Pessoal

O **OrganizaFin** é uma aplicação web interativa de página única (SPA) projetada para ajudar você a gerenciar e otimizar as suas finanças pessoais. Desenvolvido com **React**, **Vite** e **Tailwind CSS**, o sistema oferece uma interface de alta fidelidade visual, limpa e responsiva para controle total do seu patrimônio.

---

## ✨ Funcionalidades Principais

*   **📊 Painel Geral (Dashboard)**:
    *   Indicadores chave (KPIs) de Saldo Geral, Total de Receitas e Total de Despesas.
    *   Gráfico de Rosca interativo (SVG customizado) para distribuição de despesas por categoria.
    *   Avisos de Orçamento crítico com alertas automáticos baseados no consumo real.
    *   Painel rápido de progresso de Metas de Poupança e visualização das últimas transações.
*   **💸 Transações**:
    *   Lançamento e controle de receitas (Salário, Investimentos, etc.) e despesas (Alimentação, Moradia, Lazer, etc.).
    *   Busca rápida textual por descrição ou categoria.
    *   Filtros inteligentes por tipo (receita/despesa) e categoria.
    *   Fluxo de criação, edição e exclusão de transações (CRUD Completo) com validações em tempo real.
*   **🎯 Orçamentos**:
    *   Definição e acompanhamento de limites mensais de gastos por categoria de despesas.
    *   Barras de progresso dinâmicas com alerta visual de status (Verde para seguro, Amarelo para atenção, Vermelho para estouro de limite).
    *   Edição ágil inline dos limites de orçamento de forma simples e intuitiva.
*   **🐷 Metas de Economia**:
    *   Planejamento de objetivos de economia (Ex: Reserva de Emergência, Nova Viagem, Macbook).
    *   Cálculo automático de porcentagem de progresso e prazo de entrega.
    *   Funcionalidade integrada para efetuar aportes/depósitos diretos nas metas.
*   **⚙️ Configurações e Backup**:
    *   Backup completo através de exportação das transações e configurações em arquivo JSON.
    *   Restauração rápida de arquivos de backup.
    *   Apagar todos os dados para começar do zero.
    *   Restaurar dados de simulação dinâmica em português com um único clique.

---

## 🛠️ Tecnologias Utilizadas

*   **Frontend**: React (v18), Vite, Tailwind CSS, Lucide React (ícones elegantes).
*   **Persistência**: LocalStorage do navegador (seus dados não saem do seu computador!).
*   **Geração de Dados**: Script em Python 3 para simulação automática de dados reais com base no mês e ano correntes.

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para rodar o projeto localmente em sua máquina.

### Pré-requisitos
Certifique-se de ter instalado em sua máquina:
*   [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
*   [NPM](https://www.npmjs.com/) ou Yarn

---

### 1. Instalar as Dependências

No diretório raiz do projeto, execute o comando abaixo para baixar e configurar as dependências necessárias:

```bash
npm install
```

---

### 2. Rodar o Servidor de Desenvolvimento

Para iniciar o servidor local do Vite, execute o comando abaixo:

```bash
npm run dev
```

Por padrão, a aplicação estará acessível através de:
👉 **[http://localhost:3000](http://localhost:3000)**

---

### 3. Compilar para Produção (Build)

Para gerar os artefatos de produção otimizados na pasta `dist/`, execute:

```bash
npm run build
```

Para visualizar a build de produção localmente:

```bash
npm run preview
```

---

## ⚙️ Gerando Dados de Simulação Dinâmicos (Python)

Se você desejar regenerar ou atualizar o arquivo estático de simulações com datas relativas ao dia de hoje, você pode rodar o script utilitário em Python localizado sob `/home/jules/self_created_tools/`:

```bash
python3 /home/jules/self_created_tools/generate_mock_finances.py
```

O aplicativo já carrega dinamicamente essas transações de forma autônoma na primeira inicialização!
