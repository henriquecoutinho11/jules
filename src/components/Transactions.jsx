import React, { useState } from 'react';
import { Search, Plus, Filter, Edit2, Trash2, X, ArrowUpRight, ArrowDownRight, Check } from 'lucide-react';
import { formatCurrency, formatDate, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/formatters';

export default function Transactions({ data, onUpdate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Form State
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('despesa');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Open modal for creating new item
  const openNewModal = () => {
    setEditItem(null);
    setDescription('');
    setAmount('');
    setType('despesa');
    setCategory(EXPENSE_CATEGORIES[0]);
    setDate(new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  // Open modal for editing existing item
  const openEditModal = (item) => {
    setEditItem(item);
    setDescription(item.description);
    setAmount(item.amount.toString());
    setType(item.type);
    setCategory(item.category);
    setDate(item.date);
    setIsModalOpen(true);
  };

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || Number(amount) <= 0) {
      alert("Por favor, preencha todos os campos obrigatórios com valores válidos.");
      return;
    }

    const value = parseFloat(amount);
    let updatedTransactions = [...data.transactions];
    const prevCategory = editItem ? editItem.category : null;
    const prevAmount = editItem ? editItem.amount : 0;
    const prevType = editItem ? editItem.type : null;

    if (editItem) {
      // Edit
      updatedTransactions = updatedTransactions.map((t) =>
        t.id === editItem.id ? { ...t, description, amount: value, type, category, date } : t
      );
    } else {
      // Add
      const newTransaction = {
        id: `t-${Date.now()}`,
        description,
        amount: value,
        type,
        category,
        date
      };
      updatedTransactions.push(newTransaction);
    }

    // Recalculate Budgets spent
    let updatedBudgets = [...data.budgets];

    // First, restore previous transaction spent values from its previous budget if it was an expense
    if (editItem && prevType === 'despesa') {
      updatedBudgets = updatedBudgets.map(b =>
        b.category === prevCategory ? { ...b, spent: Math.max(0, Number((b.spent - prevAmount).toFixed(2))) } : b
      );
    }

    // Second, calculate the new expense into appropriate budget category if type is despesa
    if (type === 'despesa') {
      updatedBudgets = updatedBudgets.map(b =>
        b.category === category ? { ...b, spent: Number((b.spent + value).toFixed(2)) } : b
      );
    }

    onUpdate({
      ...data,
      transactions: updatedTransactions,
      budgets: updatedBudgets
    });

    setIsModalOpen(false);
  };

  // Handle Delete
  const handleDelete = (id) => {
    if (window.confirm("Deseja realmente excluir esta transação?")) {
      const targetTransaction = data.transactions.find(t => t.id === id);
      const updatedTransactions = data.transactions.filter((t) => t.id !== id);

      let updatedBudgets = [...data.budgets];
      if (targetTransaction && targetTransaction.type === 'despesa') {
        updatedBudgets = updatedBudgets.map(b =>
          b.category === targetTransaction.category
            ? { ...b, spent: Math.max(0, Number((b.spent - targetTransaction.amount).toFixed(2))) }
            : b
        );
      }

      onUpdate({
        ...data,
        transactions: updatedTransactions,
        budgets: updatedBudgets
      });
    }
  };

  // Filter & Search Logic
  const filteredTransactions = data.transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Transações</h2>
          <p className="text-slate-500">Adicione, edite ou exclua suas movimentações financeiras</p>
        </div>
        <button
          onClick={openNewModal}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Nova Transação</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative md:col-span-2">
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar por descrição ou categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-100 focus:border-primary-500 rounded-xl text-sm transition-all focus:outline-none"
          />
        </div>

        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/50 border border-slate-100 focus:border-primary-500 rounded-xl text-sm transition-all focus:outline-none"
          >
            <option value="all">Todos os tipos</option>
            <option value="receita">Receitas</option>
            <option value="despesa">Despesas</option>
          </select>
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/50 border border-slate-100 focus:border-primary-500 rounded-xl text-sm transition-all focus:outline-none"
          >
            <option value="all">Todas as categorias</option>
            {[...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES].filter((v, i, a) => a.indexOf(v) === i).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid view of Transactions */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-xs uppercase text-slate-400 font-semibold">
                <th className="py-3 px-6">Tipo</th>
                <th className="py-3 px-6">Descrição</th>
                <th className="py-3 px-6">Categoria</th>
                <th className="py-3 px-6">Data</th>
                <th className="py-3 px-6 text-right">Valor</th>
                <th className="py-3 px-6 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <span className={`inline-flex p-1.5 rounded-lg ${t.type === 'receita' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {t.type === 'receita' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-800">{t.description}</td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                      {t.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-500">{formatDate(t.date)}</td>
                  <td className={`py-4 px-6 text-right font-bold text-base ${t.type === 'receita' ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {t.type === 'receita' ? '+' : '-'} {formatCurrency(t.amount)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(t)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400 text-sm">
                    Nenhuma transação encontrada com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">{editItem ? 'Editar Transação' : 'Nova Transação'}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Type Switch Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Tipo de Movimentação
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setType('despesa');
                      setCategory(EXPENSE_CATEGORIES[0]);
                    }}
                    className={`py-2 px-3 text-center text-sm font-semibold rounded-lg transition-all ${type === 'despesa' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
                  >
                    Despesa
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setType('receita');
                      setCategory(INCOME_CATEGORIES[0]);
                    }}
                    className={`py-2 px-3 text-center text-sm font-semibold rounded-lg transition-all ${type === 'receita' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
                  >
                    Receita
                  </button>
                </div>
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Descrição
                </label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Almoço no Restaurante"
                  className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-100 focus:border-primary-500 rounded-xl text-sm transition-all focus:outline-none"
                />
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Valor (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0,00"
                  className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-100 focus:border-primary-500 rounded-xl text-sm font-bold transition-all focus:outline-none"
                />
              </div>

              {/* Category selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/50 border border-slate-100 focus:border-primary-500 rounded-xl text-sm transition-all focus:outline-none"
                >
                  {type === 'despesa'
                    ? EXPENSE_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))
                    : INCOME_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                </select>
              </div>

              {/* Date Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Data
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/50 border border-slate-100 focus:border-primary-500 rounded-xl text-sm transition-all focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-sm rounded-xl transition-colors border border-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
