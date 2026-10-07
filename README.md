# Descubra seu MRV

Consultor digital da MRV para a Grande Fortaleza: 9 perguntas sobre a rotina e o orçamento da pessoa e, no fim, os 3 empreendimentos que mais combinam, com o motivo de cada um. Produto oficial MRV de uso interno (fora dos buscadores).

O plano completo está em [`docs/spec/PLANO.md`](docs/spec/PLANO.md); o que ainda falta confirmar com a MRV, em [`docs/duvidas/Dúvidas.md`](docs/duvidas/Dúvidas.md).

## Rodar

```sh
npm install
npm run dev            # http://localhost:3000
npm test               # scoring, URL e frases (Vitest)
npm run test:e2e       # jornada no celular e no desktop (Playwright; na 1ª vez: npx playwright install chromium)
npm run build          # build de produção: todas as páginas são estáticas
```

## Páginas

| Rota | O que é |
| --- | --- |
| `/` | Home: promessa, um botão para o quiz, trilho de empreendimentos, regiões |
| `/descobrir` | Quiz, uma pergunta por tela; as respostas ficam na URL |
| `/descobrir/resultado?…` | Os 3 que mais combinam, motivos, região sugerida, comparar |
| `/empreendimentos` e `/empreendimentos/[slug]` | Lista com filtros e detalhe (galeria, plantas, região, lazer, contato) |
| `/regioes` e `/regioes/[slug]` | Mapa das 5 regiões, tempos típicos de ônibus, pontos fortes do entorno |
| `/comparar?ids=a,b,c` | 2 ou 3 lado a lado, só o que difere |

## Dados

Nada é buscado em tempo de execução: os dados são gerados por scripts e versionados.

```sh
npm run data:mrv       # lê as 16 páginas oficiais da MRV           -> data/raw/mrv/*.json
npm run data:bairros   # importa do projeto Dashboard_de_Bairros_de_Fortaleza (ao lado deste repo)
                       #   -> data/bairros.json (com tempo de ônibus até os 121 bairros), data/polos.json,
                       #      data/destinos.json, data/mapa.json
npm run data:imagens   # fotos de assets-src/ -> public/img/ (AVIF + WebP) e data/imagens.json
npm run data:build     # junta tudo com a curadoria -> data/empreendimentos.json, data/regioes.json
npm run data:grade     # grade do mapa em pixels (Fortaleza + Caucaia e Eusébio do IBGE) -> data/grade.json
npm run data           # os cinco, em ordem
```

- **Curadoria:** `data/curated/empreendimentos.json` vence o que vem do site (bairro, região, foto de capa, tipo de foto).
- **Fotos originais:** descompacte `empreendimentos_mrv_fotos.zip` em `assets-src/`. O zip e a pasta ficam fora do git (252 MB); só as variantes otimizadas (~45 MB) são versionadas.
- **Fora do produto por decisão da MRV:** segurança e renda dos bairros não são critério nem aparecem na tela.

## Recomendação

Scoring ponderado e determinístico em `lib/scoring/`: cada resposta liga critérios (deslocamento até o destino, vaga, lazer, entorno, família, prazo), cada critério dá uma nota de 0 a 100 vinda de um dado verificável, e a nota final é a média ponderada. Pesos e limiares ficam em `lib/scoring/config.ts`; os perfis de referência em `tests/scoring.test.ts` mostram se uma mudança estragou o ranking.

Destino diário: qualquer um dos 121 bairros de Fortaleza (busca sem acento) ou um dos 12 lugares mais procurados. Tempo de ônibus: mediana da tabela GTFS (ETUFOR e Metrofor) em dia útil, sem trânsito. Para Caucaia e Eusébio, estimativa pela distância (`23 + 4,49 × km`, erro típico de 11 min), sempre sinalizada na tela.

## Mapa vivo

`components/mapa/CidadeMapa.tsx`: Fortaleza em pixels verdes, com a mesma técnica de onda do dashboard de bairros, e os 16 empreendimentos como marcadores clicáveis (mini cartão com foto). A grade vem pré-calculada de `data/grade.json`; o desenho pausa fora da tela e respeita `prefers-reduced-motion`.

O mesmo mapa reage ao quiz (`lib/quiz/mapa.ts` traduz as respostas parciais em brilho e contador), faz a revelação do ranking no resultado e tem um modo "Mapa" no Explorar.

## Filme do empreendimento

`components/filme/Filme.tsx`: as fotos passam sozinhas com zoom lento, como stories, em capítulos (Fachada, Piscina, Lazer, Apartamento, Planta, Vista aérea; montados em `lib/filme.ts`). No resultado, cada motivo do ranking aparece sobre o capítulo que o comprova (`lib/scoring/apresentacao.ts`). Pausa fora da tela, com a aba oculta e ao segurar; com reduced motion, não anda sozinho.

## Marca

Tokens em `app/globals.css`, derivados de `design-system/`. Logos oficiais em `logos/`, recortados sem alteração para `public/brand/`. A fonte é Manrope até a MRV enviar a Averta licenciada.

## Deploy (Vercel)

Projeto Next.js padrão, sem banco nem serviço próprio. Variáveis:

| Variável | Para quê |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL final, usada nos metadados de compartilhamento |
| `NEXT_PUBLIC_WHATSAPP` | Número do WhatsApp comercial; sem ele, o contato leva à página oficial |
