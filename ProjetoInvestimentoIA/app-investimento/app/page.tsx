'use client';
import { useState } from 'react';

export default function PainelFinanceiro() {
  const [abaAtiva, setAbaAtiva] = useState('investimento');
  
  // Estados para o Simulador de Imóvel
  const [imovelData, setImovelData] = useState({ area: 0, valorMetro: 0, quartos: 0, isPredio: false, totalAndares: 0, andar: 0 });
  const [resultadoImovel, setResultadoImovel] = useState<{ valorVenda: number, valorAluguel: number } | null>(null);

  // Estados para a Calculadora de Investimento (Baseado no C# POO)
  const [invData, setInvData] = useState({
    valor: 0,
    taxa: 0,
    inicio: '',
    fim: '',
    querResgate: false,
    dataResgate: '',
    valorResgate: 0
  });
  const [tabelaRendimento, setTabelaRendimento] = useState<any[]>([]);

  // Estados para o VP de Financiamento / Juros Compostos
  const [vpFinanciamento, setVpFinanciamento] = useState({ valorFuturo: 0, taxa: 0, parcelas: 0 });
  const [resultadoVP, setResultadoVP] = useState<number | null>(null);

  // Chamada da API para o cálculo do imóvel
  const handleCalcularImovel = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/investment/calcular-imovel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(imovelData)
      });
      setResultadoImovel(await res.json());
    } catch { alert("Erro ao conectar com a API C# para o Imóvel."); }
  };

  // Lógica da Tabela de Rendimento (Espelhada do algoritmo C#)
  const handleCalcularInvestimento = () => {
    if (!invData.inicio || !invData.fim) {
      alert("Por favor, preencha as datas de início e fim.");
      return;
    }

    let dataAtual = new Date(invData.inicio + 'T00:00:00');
    const dataFim = new Date(invData.fim + 'T00:00:00');
    const taxaMensalDecimal = invData.taxa / 100;
    
    let saldo = invData.valor;
    let novoValorPresente = invData.valor;
    let linhas = [];

    const temResgate = invData.querResgate;
    const dataResgate = temResgate && invData.dataResgate ? new Date(invData.dataResgate + 'T00:00:00') : null;

    while (dataAtual < dataFim) {
      let proximaData = new Date(dataAtual);
      proximaData.setMonth(proximaData.getMonth() + 1);
      let taxaDoPeriodo = taxaMensalDecimal;

      if (proximaData > dataFim) {
        proximaData = new Date(dataFim);
        const diasRestantes = Math.round((proximaData.getTime() - dataAtual.getTime()) / (1000 * 60 * 60 * 24));
        taxaDoPeriodo = (taxaMensalDecimal / 30) * diasRestantes;
      }

      saldo = saldo * (1 + taxaDoPeriodo);
      let rl = saldo - novoValorPresente;
      let ra = saldo;
      let resgateDestePeriodo = 0;

      if (temResgate && dataResgate && dataResgate > dataAtual && dataResgate <= proximaData) {
        resgateDestePeriodo = invData.valorResgate;
        if (resgateDestePeriodo > saldo) resgateDestePeriodo = saldo;
        saldo = saldo - resgateDestePeriodo;
        ra = saldo;
        novoValorPresente = saldo;
      }

      linhas.push({
        periodo: proximaData.toLocaleDateString('pt-BR'),
        taxa: taxaDoPeriodo,
        rendimento: ra + resgateDestePeriodo,
        rendLiquido: rl,
        rendAcumulado: ra,
        resgate: resgateDestePeriodo,
        saldoFinal: saldo
      });

      if (resgateDestePeriodo > 0) {
        novoValorPresente = saldo;
      }

      dataAtual = proximaData;
    }

    setTabelaRendimento(linhas);
  };

  // Cálculo de Valor Presente baseado na fórmula fornecida: VP = VF / (1 + i)^t
  const handleCalcularVPFinanciamento = () => {
    const vf = vpFinanciamento.valorFuturo;
    const i = vpFinanciamento.taxa / 100;
    const t = vpFinanciamento.parcelas;

    if (vf <= 0 || i < 0 || t <= 0) {
      alert("Por favor, preencha os campos com valores válidos maiores que zero.");
      return;
    }

    // Aplicação exata da fórmula base solicitada
    const vp = vf / Math.pow(1 + i, t);
    setResultadoVP(vp);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center text-blue-500">Sistema de Investimentos Financeiros</h1>
        
        {/* Menu de Abas */}
        <div className="flex justify-center flex-wrap gap-4 border-b border-gray-800 pb-4">
          <button onClick={() => setAbaAtiva('investimento')} className={`px-5 py-2 rounded-lg font-medium transition ${abaAtiva === 'investimento' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            Calculadora de Investimento & Extrato
          </button>
          <button onClick={() => setAbaAtiva('vp_financiamento')} className={`px-5 py-2 rounded-lg font-medium transition ${abaAtiva === 'vp_financiamento' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            Calcular VP (Financiamento)
          </button>
          <button onClick={() => setAbaAtiva('imovel')} className={`px-5 py-2 rounded-lg font-medium transition ${abaAtiva === 'imovel' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            Simulador de Imóvel (m²)
          </button>
        </div>

        {/* Conteúdo */}
        <div className="bg-gray-950 border border-gray-800 p-6 rounded-xl shadow-lg">
          
          {/* ABA INVESTIMENTO */}
          {abaAtiva === 'investimento' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-400">Parâmetros do Investimento</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm mb-1 text-gray-400">Valor Inicial (VP)</label>
                  <input type="number" placeholder="Ex: 1000" onChange={e => setInvData({...invData, valor: Number(e.target.value)})} className="bg-gray-800 border border-gray-700 p-2 w-full rounded text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-400">Taxa Mensal (%)</label>
                  <input type="number" placeholder="Ex: 1" step="0.1" onChange={e => setInvData({...invData, taxa: Number(e.target.value)})} className="bg-gray-800 border border-gray-700 p-2 w-full rounded text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-400">Data de Início</label>
                  <input type="date" onChange={e => setInvData({...invData, inicio: e.target.value})} className="bg-gray-800 border border-gray-700 p-2 w-full rounded text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-400">Data Fim</label>
                  <input type="date" onChange={e => setInvData({...invData, fim: e.target.value})} className="bg-gray-800 border border-gray-700 p-2 w-full rounded text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>

              {/* Opção de Resgate */}
              <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={invData.querResgate} onChange={e => setInvData({...invData, querResgate: e.target.checked})} className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-700 rounded focus:ring-blue-500" />
                  <span className="text-sm font-medium">Você deseja simular um resgate no período?</span>
                </label>

                {invData.querResgate && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-800">
                    <div>
                      <label className="block text-sm mb-1 text-gray-400">Data do Resgate</label>
                      <input type="date" onChange={e => setInvData({...invData, dataResgate: e.target.value})} className="bg-gray-800 border border-gray-700 p-2 w-full rounded text-white" />
                    </div>
                    <div>
                      <label className="block text-sm mb-1 text-gray-400">Valor a Resgatar (R$)</label>
                      <input type="number" placeholder="Ex: 500" onChange={e => setInvData({...invData, valorResgate: Number(e.target.value)})} className="bg-gray-800 border border-gray-700 p-2 w-full rounded text-white" />
                    </div>
                  </div>
                )}
              </div>

              <button onClick={handleCalcularInvestimento} className="bg-blue-600 hover:bg-blue-700 transition p-2.5 rounded font-bold w-full text-lg">
                Gerar Tabela de Rendimento & Extrato
              </button>

              {/* Tabela de Extrato Resultante */}
              {tabelaRendimento.length > 0 && (
                <div className="space-y-3 pt-4">
                  <h4 className="text-lg font-semibold text-gray-300">Extrato Consolidado do Período:</h4>
                  <div className="overflow-x-auto rounded-lg border border-gray-800">
                    <table className="w-full text-left bg-gray-900">
                      <thead>
                        <tr className="bg-gray-800 text-sm text-gray-300 border-b border-gray-700">
                          <th className="p-3">Período</th>
                          <th className="p-3">Taxa Juros</th>
                          <th className="p-3">Rendimento</th>
                          <th className="p-3">Rend. Líq.</th>
                          <th className="p-3">Renda Acum.</th>
                          <th className="p-3">Resgate</th>
                          <th className="p-3">Saldo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800 text-sm">
                        {tabelaRendimento.map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-850 transition">
                            <td className="p-3">{row.periodo}</td>
                            <td className="p-3 text-amber-500">{(row.taxa * 100).toFixed(2)}%</td>
                            <td className="p-3 text-gray-300">R$ {row.rendimento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            <td className="p-3 text-emerald-400">R$ {row.rendLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            <td className="p-3 text-gray-300">R$ {row.rendAcumulado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            <td className="p-3 text-red-400">{row.resgate > 0 ? `- R$ ${row.resgate.toLocaleString('pt-BR')}` : 'R$ 0,00'}</td>
                            <td className="p-3 font-semibold text-blue-400">R$ {row.saldoFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ABA CONFIGURADA COM A FÓRMULA CORRETA: VP = VF / (1 + i)^t */}
          {abaAtiva === 'vp_financiamento' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-blue-400">Calcular VP (Valor Presente)</h3>
              <p className="text-sm text-gray-400">Traz o valor de um montante futuro de volta ao valor presente, aplicando a taxa de juros pelo período definido.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-1 text-gray-400">Valor Futuro Desejado (VF)</label>
                  <input type="number" placeholder="Ex: 50000" onChange={e => setVpFinanciamento({...vpFinanciamento, valorFuturo: Number(e.target.value)})} className="bg-gray-800 border border-gray-700 p-2 w-full rounded text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-400">Taxa de Juros Mensal (i %)</label>
                  <input type="number" placeholder="Ex: 1.5" step="0.01" onChange={e => setVpFinanciamento({...vpFinanciamento, taxa: Number(e.target.value)})} className="bg-gray-800 border border-gray-700 p-2 w-full rounded text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-400">Tempo / Parcelas (t em meses)</label>
                  <input type="number" placeholder="Ex: 12" onChange={e => setVpFinanciamento({...vpFinanciamento, parcelas: Number(e.target.value)})} className="bg-gray-800 border border-gray-700 p-2 w-full rounded text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>

              <button onClick={handleCalcularVPFinanciamento} className="bg-blue-600 hover:bg-blue-700 p-2.5 rounded font-bold w-full transition">
                Calcular Valor Presente
              </button>

              {resultadoVP !== null && (
                <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-800">
                  <p className="text-gray-300">O Valor Presente calculado ($VP$) para este financiamento/investimento é:</p>
                  <span className="text-2xl font-bold text-emerald-400 block mt-1">
                    R$ {resultadoVP.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ABA IMÓVEL */}
          {abaAtiva === 'imovel' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-blue-400">Ajudar a calcular valor de imóvel</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-1">Área (m²)</label>
                  <input type="number" onChange={e => setImovelData({...imovelData, area: Number(e.target.value)})} className="bg-gray-800 border border-gray-700 p-2 w-full rounded text-white" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Valor do M² da Região</label>
                  <input type="number" onChange={e => setImovelData({...imovelData, valorMetro: Number(e.target.value)})} className="bg-gray-800 border border-gray-700 p-2 w-full rounded text-white" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Quartos</label>
                  <input type="number" onChange={e => setImovelData({...imovelData, quartos: Number(e.target.value)})} className="bg-gray-800 border border-gray-700 p-2 w-full rounded text-white" />
                </div>
              </div>
              
              <label className="flex items-center space-x-2 py-2 cursor-pointer">
                <input type="checkbox" checked={imovelData.isPredio} onChange={e => setImovelData({...imovelData, isPredio: e.target.checked})} className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-700 rounded" />
                <span className="text-sm">O imóvel fica em um prédio?</span>
              </label>

              {imovelData.isPredio && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 border-l-2 border-blue-500 bg-gray-900 rounded">
                  <div>
                    <label className="block text-sm mb-1">Total de andares</label>
                    <input type="number" onChange={e => setImovelData({...imovelData, totalAndares: Number(e.target.value)})} className="bg-gray-800 border border-gray-700 p-2 w-full rounded text-white" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Andar do imóvel</label>
                    <input type="number" onChange={e => setImovelData({...imovelData, andar: Number(e.target.value)})} className="bg-gray-800 border border-gray-700 p-2 w-full rounded text-white" />
                  </div>
                </div>
              )}

              <button onClick={handleCalcularImovel} className="bg-blue-600 hover:bg-blue-700 p-2 rounded font-bold w-full transition">Calcular Valores do Imóvel</button>
              
              {resultadoImovel && (
                <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-800 space-y-1">
                  <p><strong>Valor de Venda Estimado:</strong> <span className="text-emerald-400 font-medium">R$ {resultadoImovel.valorVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></p>
                  <p><strong>Sugestão de Aluguel:</strong> <span className="text-blue-400 font-medium">R$ {resultadoImovel.valorAluguel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}