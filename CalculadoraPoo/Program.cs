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
}
