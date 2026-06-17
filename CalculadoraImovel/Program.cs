using System;
namespace CalculadoraImovel
/*
Calculadora de venda e aluguelde imóvel
Entradas:
Área do imóvel (m²)
Valor do metro quadrado da região
N° quartos se for >4 aumento de 10%
É prédio? (S/N)
Se for, perguntar andar,e quanto mais alto mais caro 5%

*/
//* declaração variáveis
double area, valorMetro, valorVenda, aluguel, aumentoAndar;
int quartos, totalAndares, andar;
string predio;

//*entradas
Console.WriteLine("Digite a área do imóvel (m²):");
area = Convert.ToDouble(Console.ReadLine());

Console.WriteLine("Digite o valor do metro quadrado do imóvel na região:");
valorMetro = Convert.ToDouble(Console.ReadLine());

Console.WriteLine("Digite a quantidade de quartos do imóvel:");
quartos = Convert.ToInt32(Console.ReadLine());

valorVenda = area * valorMetro;

if (quartos > 4)
{
valorVenda *= 1.10;
}

Console.WriteLine("O imóvel é um prédio? (S/N):");
predio = Console.ReadLine().ToLower();
if (predio == "s")
{
    Console.WriteLine("Digite o total de andares do prédio:");
    totalAndares = Convert.ToInt32(Console.ReadLine());

    Console.WriteLine("Digite o andar do imóvel:");
    andar = Convert.ToInt32(Console.ReadLine());
    aumentoAndar = 1 + ((double)andar / totalAndares) * 0.05;
    valorVenda *= aumentoAndar;
}

aluguel = valorVenda * 0.01;

//saidas

Console.WriteLine("\n==============Resultado==============");
Console.WriteLine(" O valor de venda do imóvel é: R$ " + valorVenda.ToString("F2"));
Console.WriteLine(" O valor de ALUGUEL do imóvel é: R$ " + aluguel.ToString("F2"));


