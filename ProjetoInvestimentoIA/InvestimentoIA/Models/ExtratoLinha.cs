namespace InvestimentoApi.Models
{
    public class ExtratoLinha
    {
        public string Periodo { get; set; }= string.Empty;
        public decimal TaxaPeriodo { get; set; }
        public decimal RendimentoAcumulado { get; set; }
        public decimal RendimentoLiquido { get; set; }
        public decimal Resgate { get; set; }
        public decimal Saldo { get; set; }
    }
}