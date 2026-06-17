using System;

namespace InvestimentoApi.Models
{
    public class InvestimentoRequest
    {
        public decimal ValorPresente { get; set; }
        public decimal TaxaMensal { get; set; }
        public DateTime DataInicio { get; set; }
        public DateTime DataFim { get; set; }
        public bool TemResgate { get; set; }
        public DateTime? DataResgate { get; set; }
        public decimal? ValorResgate { get; set; }
    }
}