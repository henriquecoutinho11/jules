// Default dynamic mock data structure matching the python generated file
export const defaultMockData = {
  "transactions": [
    {
      "id": "t-1",
      "description": "Salário Mensal",
      "amount": 5500.0,
      "type": "receita",
      "category": "Salário",
      "date": "2026-06-21"
    },
    {
      "id": "t-2",
      "description": "Projeto Freelance Website",
      "amount": 1200.0,
      "type": "receita",
      "category": "Freelance",
      "date": "2026-07-06"
    },
    {
      "id": "t-3",
      "description": "Dividendos FIIs",
      "amount": 150.0,
      "type": "receita",
      "category": "Investimentos",
      "date": "2026-07-04"
    },
    {
      "id": "t-4",
      "description": "Supermercado Carrefour",
      "amount": 350.5,
      "type": "despesa",
      "category": "Alimentação",
      "date": "2026-06-26"
    },
    {
      "id": "t-5",
      "description": "Aluguel & Condomínio",
      "amount": 1200.0,
      "type": "despesa",
      "category": "Moradia",
      "date": "2026-06-21"
    },
    {
      "id": "t-6",
      "description": "Conta de Luz Coelba",
      "amount": 180.0,
      "type": "despesa",
      "category": "Moradia",
      "date": "2026-06-28"
    },
    {
      "id": "t-7",
      "description": "Combustível Posto Shell",
      "amount": 150.0,
      "type": "despesa",
      "category": "Transporte",
      "date": "2026-07-01"
    },
    {
      "id": "t-8",
      "description": "Uber Viagens",
      "amount": 85.4,
      "type": "despesa",
      "category": "Transporte",
      "date": "2026-07-08"
    },
    {
      "id": "t-9",
      "description": "Jantar Restaurante Japonês",
      "amount": 180.0,
      "type": "despesa",
      "category": "Lazer",
      "date": "2026-07-11"
    },
    {
      "id": "t-10",
      "description": "Cinema e Pipoca",
      "amount": 65.0,
      "type": "despesa",
      "category": "Lazer",
      "date": "2026-07-02"
    },
    {
      "id": "t-11",
      "description": "Assinatura Netflix",
      "amount": 55.9,
      "type": "despesa",
      "category": "Lazer",
      "date": "2026-06-22"
    },
    {
      "id": "t-12",
      "description": "Farmácia Drogaria",
      "amount": 92.3,
      "type": "despesa",
      "category": "Saúde",
      "date": "2026-07-05"
    },
    {
      "id": "t-13",
      "description": "Curso Online React",
      "amount": 250.0,
      "type": "despesa",
      "category": "Educação",
      "date": "2026-06-24"
    },
    {
      "id": "t-14",
      "description": "Assinatura Spotify",
      "amount": 34.9,
      "type": "despesa",
      "category": "Lazer",
      "date": "2026-06-25"
    },
    {
      "id": "t-15",
      "description": "Manutenção Bicicleta",
      "amount": 120.0,
      "type": "despesa",
      "category": "Transporte",
      "date": "2026-07-13"
    },
    {
      "id": "t-16",
      "description": "Almoço Executivo",
      "amount": 42.0,
      "type": "despesa",
      "category": "Alimentação",
      "date": "2026-07-14"
    },
    {
      "id": "t-17",
      "description": "Supermercado Pão de Açúcar",
      "amount": 220.1,
      "type": "despesa",
      "category": "Alimentação",
      "date": "2026-07-15"
    }
  ],
  "budgets": [
    {
      "category": "Alimentação",
      "limit": 800.0,
      "spent": 612.6
    },
    {
      "category": "Moradia",
      "limit": 1500.0,
      "spent": 1380.0
    },
    {
      "category": "Transporte",
      "limit": 400.0,
      "spent": 355.4
    },
    {
      "category": "Lazer",
      "limit": 500.0,
      "spent": 335.8
    },
    {
      "category": "Saúde",
      "limit": 300.0,
      "spent": 92.3
    },
    {
      "category": "Educação",
      "limit": 600.0,
      "spent": 250.0
    },
    {
      "category": "Outros",
      "limit": 300.0,
      "spent": 0.0
    }
  ],
  "goals": [
    {
      "id": "g-1",
      "title": "Reserva de Emergência",
      "target": 10000.0,
      "current": 4500.0,
      "deadline": "2027-06-30",
      "category": "Investimentos"
    },
    {
      "id": "g-2",
      "title": "Viagem de Fim de Ano",
      "target": 5000.0,
      "current": 2200.0,
      "deadline": "2026-12-25",
      "category": "Lazer"
    },
    {
      "id": "g-3",
      "title": "Novo Macbook Pro",
      "target": 12000.0,
      "current": 3000.0,
      "deadline": "2028-03-15",
      "category": "Educação"
    }
  ]
};

// Local storage helpers
export const loadData = () => {
  const localData = localStorage.getItem("finances_data");
  if (localData) {
    try {
      return JSON.parse(localData);
    } catch (e) {
      console.error("Error loading local storage data", e);
    }
  }

  // Set default mock dates dynamically to matches the current year and month perfectly
  const today = new Date();
  const formatOffset = (daysAgo) => {
    const d = new Date();
    d.setDate(today.getDate() - daysAgo);
    return d.toISOString().split("T")[0];
  };

  const dynamicData = { ...defaultMockData };
  dynamicData.transactions = dynamicData.transactions.map((t, index) => {
    // Generate dates matching the same offsets as python code
    const offsets = [
      25, 10, 12, 20, 25, 18, 15, 8, 5, 14, 24, 11, 22, 21, 3, 2, 1
    ];
    return {
      ...t,
      date: formatOffset(offsets[index] || 5)
    };
  });

  localStorage.setItem("finances_data", JSON.stringify(dynamicData));
  return dynamicData;
};

export const saveData = (data) => {
  localStorage.setItem("finances_data", JSON.stringify(data));
};

// Formats number as Brazilian Real (BRL)
export const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Formats string date YYYY-MM-DD to DD/MM/YYYY
export const formatDate = (dateString) => {
  if (!dateString) return "";
  const parts = dateString.split("-");
  if (parts.length !== 3) return dateString;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

// Expense Categories
export const EXPENSE_CATEGORIES = [
  "Alimentação",
  "Moradia",
  "Transporte",
  "Lazer",
  "Saúde",
  "Educação",
  "Outros"
];

// Income Categories
export const INCOME_CATEGORIES = [
  "Salário",
  "Investimentos",
  "Freelance",
  "Outros"
];
