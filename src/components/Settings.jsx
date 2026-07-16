import React from 'react';
import { RefreshCw, Download, Upload, Trash2, Heart, ShieldAlert, Sparkles } from 'lucide-react';
import { defaultMockData, loadData } from '../utils/formatters';

export default function Settings({ data, onUpdate }) {

  // Wipe all custom local storage data and reset everything
  const handleResetData = () => {
    if (window.confirm("ATENÇÃO: Isso irá apagar PERMANENTEMENTE todas as suas transações, orçamentos e metas registradas. Deseja prosseguir?")) {
      const cleanData = {
        transactions: [],
        budgets: [
          { category: "Alimentação", limit: 800.0, spent: 0.0 },
          { category: "Moradia", limit: 1500.0, spent: 0.0 },
          { category: "Transporte", limit: 400.0, spent: 0.0 },
          { category: "Lazer", limit: 500.0, spent: 0.0 },
          { category: "Saúde", limit: 300.0, spent: 0.0 },
          { category: "Educação", limit: 600.0, spent: 0.0 },
          { category: "Outros", limit: 300.0, spent: 0.0 }
        ],
        goals: []
      };
      onUpdate(cleanData);
      alert("Todos os dados foram redefinidos com sucesso.");
    }
  };

  // Import dynamic default mock data perfectly
  const handleRestoreMockData = () => {
    if (window.confirm("Deseja restaurar os dados de simulação padrão? Seus dados atuais serão substituídos.")) {
      localStorage.removeItem("finances_data");
      const freshlyLoadedMock = loadData();
      onUpdate(freshlyLoadedMock);
      alert("Dados de simulação restaurados com sucesso!");
    }
  };

  // Export current finances state to JSON format file
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `organizacao_financeira_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON format dynamic backup file
  const handleImportData = (e) => {
    const fileReader = new FileReader();
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    fileReader.onload = (event) => {
      try {
        const parsedJson = JSON.parse(event.target.result);
        if (parsedJson.transactions && parsedJson.budgets && parsedJson.goals) {
          onUpdate(parsedJson);
          alert("Backup importado com sucesso!");
        } else {
          alert("O arquivo de backup fornecido é inválido ou está corrompido.");
        }
      } catch (err) {
        alert("Erro ao ler o arquivo JSON. Certifique-se de que é um JSON válido.");
      }
    };
    fileReader.readAsText(uploadedFile);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Configurações</h2>
        <p className="text-slate-500">Gerencie seus dados, faça backup ou redefina o aplicativo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backup settings container */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Backup e Exportação</h3>
          </div>
          <p className="text-slate-500 text-sm">
            Exporte seus lançamentos e metas para um arquivo de texto criptografado JSON para garantir que suas informações não se percam.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleExportData}
              className="flex-1 py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Dados (JSON)</span>
            </button>

            <label className="flex-1 py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-center">
              <Upload className="w-4 h-4" />
              <span>Importar Dados</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Danger zone settings container */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Zona de Perigo</h3>
          </div>
          <p className="text-slate-500 text-sm">
            Restaure os dados de simulação padrão com receitas e despesas dinâmicas ou apague todo o banco de dados local permanentemente.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleRestoreMockData}
              className="flex-1 py-2.5 px-4 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Restaurar Simulação</span>
            </button>

            <button
              onClick={handleResetData}
              className="flex-1 py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Limpar Tudo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Nice footer */}
      <div className="text-center py-8 text-slate-400 text-xs flex flex-col items-center justify-center gap-1.5">
        <div className="flex items-center gap-1">
          <span>Criado com</span>
          <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
          <span>para uma vida financeira equilibrada e saudável.</span>
        </div>
        <span>Organizador Financeiro Pessoal © {new Date().getFullYear()} - Todos os direitos reservados.</span>
      </div>
    </div>
  );
}
