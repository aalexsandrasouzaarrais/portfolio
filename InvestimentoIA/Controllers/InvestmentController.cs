using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using InvestimentoApi.Models; // <-- Isso aqui conecta essa pasta com a pasta Models!

namespace InvestimentoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvestmentController : ControllerBase
    {
        // ENDPOINT 1: Cálculo do Imóvel baseado no m²
        [HttpPost("calcular-imovel")]
        public ActionResult<ImovelResponse> CalcularImovel([FromBody] ImovelRequest request)
        {
            decimal valorVenda = request.Area * request.ValorMetro;

            if (request.Quartos > 4)
            {
                valorVenda *= 1.10m;
            }

            if (request.IsPredio && request.TotalAndares > 0)
            {
                decimal aumentoAndar = 1 + ((decimal)request.Andar / request.TotalAndares) * 0.05m;
                valorVenda *= aumentoAndar;
            }

            decimal aluguel = valorVenda * 0.01m;

            return Ok(new ImovelResponse { ValorVenda = valorVenda, ValorAluguel = aluguel });
        }

        // ENDPOINT 2: Rendimento do Investimento com Extrato de Resgate
        [HttpPost("gerar-extrato")]
        public ActionResult<List<ExtratoLinha>> GerarExtrato([FromBody] InvestimentoRequest request)
        {
            var extrato = new List<ExtratoLinha>();
            decimal taxaMensalDecimal = request.TaxaMensal / 100;
            decimal saldo = request.ValorPresente;
            decimal novoValorPresente = request.ValorPresente;
            DateTime dataAtual = request.DataInicio;

            while (dataAtual < request.DataFim)
            {
                DateTime proximaData = dataAtual.AddMonths(1);
                decimal taxaDoPeriodo = taxaMensalDecimal;

                if (proximaData > request.DataFim)
                {
                    proximaData = request.DataFim;
                    int diasRestantes = (proximaData - dataAtual).Days;
                    taxaDoPeriodo = (taxaMensalDecimal / 30) * diasRestantes;
                }

                saldo = saldo * (1 + taxaDoPeriodo);
                decimal rl = saldo - novoValorPresente;
                decimal ra = saldo;
                decimal resgateDestePeriodo = 0;

                if (request.TemResgate && request.DataResgate.HasValue && request.ValorResgate.HasValue)
                {
                    if (request.DataResgate.Value > dataAtual && request.DataResgate.Value <= proximaData)
                    {
                        resgateDestePeriodo = request.ValorResgate.Value;
                        if (resgateDestePeriodo > saldo) resgateDestePeriodo = saldo;
                        saldo -= resgateDestePeriodo;
                        ra = saldo;
                    }
                }

                extrato.Add(new ExtratoLinha
                {
                    Periodo = proximaData.ToString("dd/MM/yyyy"),
                    TaxaPeriodo = taxaDoPeriodo,
                    RendimentoAcumulado = ra + resgateDestePeriodo,
                    RendimentoLiquido = rl,
                    Resgate = resgateDestePeriodo,
                    Saldo = saldo
                });

                if (resgateDestePeriodo > 0)
                {
                    novoValorPresente = saldo;
                }

                dataAtual = proximaData;
            }

            return Ok(extrato);
        }
    }
}