import React, { useState } from 'react';
import { Plus, Check, Edit2, AlertTriangle, HelpCircle } from 'lucide-react';
import { formatCurrency, EXPENSE_CATEGORIES } from '../utils/formatters';

export default function Budgets({ data, onUpdate }) {
  const budgets = data.budgets || [];
  const [editingCategory, setEditingCategory] = useState(null);
  const [newLimit, setNewLimit] = useState('');

  // Handle Edit Limit Trigger
  const startEdit = (b) => {
    setEditingCategory(b.category);
    setNewLimit(b.limit.toString());
  };

  // Handle Save Limit
  const saveLimit = (category) => {
    const limitVal = parseFloat(newLimit);
    if (isNaN(limitVal) || limitVal < 0) {
      alert("Por favor, digite um limite numérico válido superior ou igual a zero.");
      return;
    }

    const updatedBudgets = budgets.map((b) =>
      b.category === category ? { ...b, limit: limitVal } : b
    );

    onUpdate({
      ...data,
      budgets: updatedBudgets
    });

    setEditingCategory(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Orçamentos Planejados</h2>
        <p className="text-slate-500">Planeje e acompanhe os seus limites de gastos por categoria de despesas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map((b) => {
          const progress = b.limit > 0 ? (b.spent / b.limit) * 100 : 0;
          const isExceeded = b.spent > b.limit;
          const isWarning = b.spent >= b.limit * 0.8 && b.spent <= b.limit;

          // Progress bar color matching status
          let progressColor = "bg-primary-500"; // Safe (Green)
          let cardBorder = "border-slate-100";
          let badgeText = "text-emerald-700 bg-emerald-50";
          let badgeMessage = "Dentro do planejado";

          if (isExceeded) {
            progressColor = "bg-red-500";
            cardBorder = "border-red-100";
            badgeText = "text-red-700 bg-red-50";
            badgeMessage = "Limite estourado!";
          } else if (isWarning) {
            progressColor = "bg-amber-500";
            cardBorder = "border-amber-100";
            badgeText = "text-amber-700 bg-amber-50";
            badgeMessage = "Atenção: Limite próximo";
          }

          return (
            <div
              key={b.category}
              className={`bg-white p-6 rounded-2xl border ${cardBorder} shadow-sm space-y-4 transition-all hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-slate-800">{b.category}</h3>
                  <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1 ${badgeText}`}>
                    {badgeMessage}
                  </span>
                </div>

                {/* Dynamic Inline Edit Mode */}
                {editingCategory === b.category ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="10"
                      value={newLimit}
                      onChange={(e) => setNewLimit(e.target.value)}
                      className="w-24 px-2 py-1 text-sm font-bold border border-slate-200 rounded-lg focus:border-primary-500 focus:outline-none"
                    />
                    <button
                      onClick={() => saveLimit(b.category)}
                      className="p-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      title="Salvar"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEdit(b)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
                    title="Ajustar Limite"
                  >
                    <Edit2 className="w-4.5 h-4.5" />
                  </button>
                )}
              </div>

              {/* Progress Display */}
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-semibold text-slate-800 text-base">{formatCurrency(b.spent)}</span>
                  <span className="text-slate-400 text-xs">
                    de limite <span className="font-bold text-slate-600">{formatCurrency(b.limit)}</span>
                  </span>
                </div>

                {/* Progress bar visual container */}
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className={`${progressColor} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>Consumido: {Math.round(progress)}%</span>
                  {b.limit > 0 && (
                    <span>Disponível: {formatCurrency(Math.max(0, b.limit - b.spent))}</span>
                  )}
                </div>
              </div>

              {/* Warnings details */}
              {isExceeded && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50/55 p-2 rounded-lg font-medium">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Você ultrapassou o orçamento em {formatCurrency(b.spent - b.limit)}!</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
