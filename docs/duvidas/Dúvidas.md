# Dúvidas e pontos a confirmar

## Em aberto

- [ ] **Preço e orçamento.** Existe "a partir de" ou faixa do Minha Casa Minha Vida por empreendimento? Com isso, entra uma 8ª pergunta (renda ou parcela). Hoje o quiz não pergunta orçamento.
- [ ] **Linha Sensia.** O guia do repositório só cobre MRV e MRV Class. Hoje: logo Sensia no detalhe e selo "Sensia" no card. Aguardando o book para fechar o visual.
- [ ] **Averta.** A fonte ainda é Manrope (`app/layout.tsx`). Falta receber os arquivos WOFF2 com licença web.
- [ ] **CTA.** Qual número de WhatsApp comercial usar (`NEXT_PUBLIC_WHATSAPP`) e qual CRM recebe o lead? Sem o número, o botão leva só à página oficial (com UTM).
- [ ] **Coordenada do Sensia Reserva Vila do Sol.** O bairro (Cocó) está confirmado, inclusive pelo CEP 60192-800 (Loteamento Gleba 4S). A coordenada da página oficial cai no Parque Genibaú. No mapa, o pino está no centro do Cocó e o cartão diz "local aproximado". Falta a MRV passar a coordenada exata.
- [ ] **Versão do logo.** Há duas versões coloridas em `logos/`. Usei `logo-mrv-engenharia-2048.png` (degradê mais vivo). Confirmar com o Marketing qual é a vigente.
- [ ] **Meta de JavaScript.** O plano previa até 90 KB (gzip) na Home. Só o React 19 com o roteador do Next 16 já ocupa ~125 KB, então a Home está em ~140 KB antes do `load` (o código do app soma ~15 KB). Proposta: meta de 150 KB, mantendo LCP abaixo de 2,5 s e CLS em 0.

## Já decidido

| Tema | Decisão |
| --- | --- |
| Escopo | Produto oficial MRV, uso interno, acabamento profissional |
| SEO | `noindex` em tudo, `robots.txt` bloqueando |
| Segurança e renda do bairro | Fora do produto: nem critério, nem tela |
| Regiões | 5 regiões na tela (Oeste e Centro, Leste, Sul, Caucaia, Eusébio); a regional oficial fica só nos dados |
| Prazo | Só pelo status (lançamento, em construção, pronto) |
| Bairros e fotos | Bairros do site e fotos do Parque Marista confirmados |
| Logo MRV | Arquivos oficiais recebidos em `logos/` e aplicados |
| Ranking | Top 5 em destaque (o 1º em filme, do 2º ao 5º em lista) + ranking completo sob demanda |
| Compatibilidade | Percentual + faixa ("77% · Combina muito") |
| Mapa | Fundo verde profundo com pixels claros, como o dashboard de bairros |
| Filme do 1º lugar | Começa sozinho, sem som, sempre pausável; parado com reduced motion |
| Destino diário | Qualquer um dos 121 bairros de Fortaleza ou um dos 12 lugares mais procurados |
