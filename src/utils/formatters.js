// Default initial data structure (clean initial state without preloaded mock transactions)
export const defaultMockData = {
  "transactions": [],
  "budgets": [
    {
      "category": "Alimentação",
      "limit": 800.0,
      "spent": 0.0
    },
    {
      "category": "Moradia",
      "limit": 1500.0,
      "spent": 0.0
    },
    {
      "category": "Transporte",
      "limit": 400.0,
      "spent": 0.0
    },
    {
      "category": "Lazer",
      "limit": 500.0,
      "spent": 0.0
    },
    {
      "category": "Saúde",
      "limit": 300.0,
      "spent": 0.0
    },
    {
      "category": "Educação",
      "limit": 600.0,
      "spent": 0.0
    },
    {
      "category": "Outros",
      "limit": 300.0,
      "spent": 0.0
    }
  ],
  "goals": []
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

  localStorage.setItem("finances_data", JSON.stringify(defaultMockData));
  return defaultMockData;
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
