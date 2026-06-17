using System;
namespace CalculadoraInvestimentopoo
{
    class Program
    {
        static void Main(string[] args)
        {

            Console.WriteLine("Digite o valor do investmento em reais (R$):");
            double valor = Convert.ToDouble(Console.ReadLine());

            Console.WriteLine("Qual a taxa de juros mensal? em %");
            double taxa = Convert.ToDouble(Console.ReadLine());

            Console.WriteLine("Digite a data de início do investimento (ex: 14/06/2026):");
            DateTime inicio = DateTime.Parse(Console.ReadLine() ?? "");

            Console.WriteLine("Até quando você quer deixar o dinheiro investido? (ex: 14/12/2026):");
            DateTime fim = DateTime.Parse(Console.ReadLine() ?? "");

            Investimento meuInvestimento = new Investimento(valor, taxa, inicio, fim);

            Console.WriteLine("Você quer fazer algum resgate? (sim/nao)");
            string res = Console.ReadLine()?.ToLower() ?? "";

            if (res == "sim")
            {
                Console.WriteLine("Em qual data você deseja fazer o resgate? (ex: 14/11/2026):");
                DateTime dataResgate = DateTime.Parse(Console.ReadLine() ?? "");

                Console.WriteLine("Qual o valor que deseja resgatar? (R$)");
                double valorResgate = Convert.ToDouble(Console.ReadLine());

                meuInvestimento.ConfigurarResgate(dataResgate, valorResgate);
            }
            meuInvestimento.GerarTabelaRendimento();
        }
    }

    namespace CalculadoraInvestimentopoo
    {
        public class Investimento
        {
            public double ValorPresente;
            public double TaxaMensal;
            public DateTime DataInicio;
            public DateTime DataFim;
            public DateTime DataResgate;
            public double ValorResgate;
            public bool TemResgate;
            public Investimento(double valorPresente, double taxaMensal, DateTime dataInicio, DateTime dataFim)
            {
                ValorPresente = valorPresente;
                TaxaMensal = taxaMensal;
                DataInicio = dataInicio;
                DataFim = dataFim;
                DataResgate = DateTime.MinValue;
                TemResgate = false;
            }
            public void ConfigurarResgate(DateTime data, double valor)
            {
                DataResgate = data;
                ValorResgate = valor;
                TemResgate = true;
            }
            public void GerarTabelaRendimento()
            {
                double taxaMensalDecimal = TaxaMensal / 100;
                double Saldo = ValorPresente;
                double novoValorpresente = ValorPresente;
                DateTime dataAtual = DataInicio;

                Console.WriteLine("=================================================================================================================");
                Console.WriteLine($"{"Período",-12} | {"Taxa Juros %",-11} | {"Rendimento",-11} | {"Rend. Líq.",-11} | {"Renda Acum.",-11} | {"Resgate",-10} |{"Saldo",-12}");
                Console.WriteLine("=================================================================================================================");

                while (dataAtual < DataFim)
                {
                    DateTime proximaData = dataAtual.AddMonths(1);
                    double taxaDoPeriodo = taxaMensalDecimal;

                    if (proximaData > DataFim)
                    {
                        proximaData = DataFim;
                        int diasRestantes = (proximaData - dataAtual).Days;
                        taxaDoPeriodo = (taxaMensalDecimal / 30) * diasRestantes;
                    }

                    Saldo = Saldo * (1 + taxaDoPeriodo);
                    double rl = Saldo - novoValorpresente;
                    double ra = Saldo;
                    double resgateDestePeriodo = 0;

                    if (TemResgate && DataResgate > dataAtual && DataResgate <= proximaData)
                    {
                        resgateDestePeriodo = ValorResgate;
                        if (resgateDestePeriodo > Saldo) resgateDestePeriodo = Saldo;
                        Saldo = Saldo - resgateDestePeriodo;
                        ra = Saldo;
                        novoValorpresente = Saldo;
                    }

                    Console.WriteLine($"{proximaData.ToString("dd/MM/yyyy"),-12} | {taxaDoPeriodo,-11:P2} | {ra + resgateDestePeriodo,-11:C2} | {rl,-11:C2} | {ra,-11:C2} |{resgateDestePeriodo,-12:C2} | {Saldo,-12:C2}");

                    if (resgateDestePeriodo > 0)
                    {
                        novoValorpresente = Saldo;
                    }

                    dataAtual = proximaData;
                }
                Console.WriteLine("=================================================================================================================");
            }
        }
    }




}








