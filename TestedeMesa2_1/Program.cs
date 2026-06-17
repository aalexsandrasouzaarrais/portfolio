
/* Dada a fórmula do VALOR FUTURO (juros compostos a.m.) para cálcular investimento:   F = p * ( 1 + i ) ^n 
p= valor presente
i= taxa de juros
n= tempo a.m
f=valor final do investimento
*/
using System;
namespace TestedeMesa2
{
    class Program
    {
        static void Main(string[] args)
        {

            double p;
            double i;
            double n;
            string tipon;
            double f;

            Console.WriteLine("Digite o valor do investimento em reais (R$):");
            p = Convert.ToDouble(Console.ReadLine());

            Console.WriteLine("Qual a taxa de juros? em %");
            i = Convert.ToDouble(Console.ReadLine());

            Console.WriteLine("Você quer investir em meses ou em anos?(meses/anos)");
            tipon = Console.ReadLine()?.ToLower() ?? "";

            Console.WriteLine("Quanto tempo você quer investir?");
            n = Convert.ToDouble(Console.ReadLine());

            if (tipon == "anos")

            {
                n = n * 12;
            }

            f = p * Math.Pow(1 + (i / 100), n);



            Console.WriteLine($" {f:C2}");

        }
    }
}


