namespace InvestimentoApi.Models
{
    public class ImovelRequest
    {
        public decimal Area { get; set; }
        public decimal ValorMetro { get; set; }
        public int Quartos { get; set; }
        public bool IsPredio { get; set; }
        public int TotalAndares { get; set; }
        public int Andar { get; set; }
    }
}