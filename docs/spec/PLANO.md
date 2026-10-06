> Cópia do plano mantido no Claude Docs (fonte de verdade): https://claude.ai/code/artifact/89031bd1-bd5f-49cd-85e7-a90d7fadb23a
> Exportado em 5 de outubro de 2026. Diagramas aparecem só no documento original.

# Consultor Digital MRV Fortaleza — Diagnóstico e Plano Técnico

Oct 5, 2026 · @Nicolas

## Resumo executivo

O repositório ainda não tem código: há só um guia de Design System MRV (2 arquivos) e um zip com 279 imagens de 16 empreendimentos. Os dados para recomendar vêm de duas fontes externas ao repositório, ambas já verificadas: as páginas oficiais da MRV (JSON embutido com bairro, coordenadas, tipologias, metragens, lazer e status) e o projeto anterior *Dashboard de Bairros de Fortaleza* (121 bairros com saneamento, equipamentos, preço do m² e tempo de ônibus até 12 polos).

Achados que mudam o plano:

- **Os 16 produtos são quase iguais na planta.** Todos têm 2 quartos (só o Brisa do Mar tem 1 quarto), de 36,88 a 54,80 m². O quiz não deve perguntar "quantos quartos": o que diferencia é **localização, lazer, suíte/varanda, vaga de garagem e prazo de entrega**.
- **Vaga é um diferencial real.** A razão vagas/unidades vai de 0,21 (Flor do Sertão) a 1,11 (Vila do Sol). Ter carro vira pergunta de corte.
- **3 empreendimentos ficam fora de Fortaleza** (Ville de Lisboa e Ville de Porto em Caucaia, Eco Park no Eusébio) e não têm dados de bairro no projeto anterior.
- **4 bairros do site não batem com as coordenadas.** O caso grave é o Vila do Sol: o site diz Cocó, a coordenada cai no Parque Genibaú. Os dados precisam de curadoria manual antes do scoring.
- **Não há logo, fonte Averta nem fotos com pessoas no repositório.** As 279 imagens são renders 3D com selo "Imagem ilustrativa"; plantas e mapas aéreos têm texto embutido.

Escopo: produto oficial MRV, de uso interno, com acabamento de produto profissional. Decisões propostas: **Next.js (App Router) na Vercel, site majoritariamente estático (SSG)**, dados versionados em JSON no repositório, scoring determinístico no cliente (sem backend), imagens pré-processadas em AVIF/WebP. Jornada curta: Home → Quiz de 7 perguntas → Resultado com 3 empreendimentos e o motivo de cada um → Detalhe → CTA para falar com um corretor.

# Parte A — Diagnóstico

## Etapa 1 — Auditoria do repositório

O repositório `dashboard_mrv_fortaleza` está vazio de código: a branch `main` não tem nenhum commit, e os dois itens existentes estão fora do git (*untracked*). Não há framework, `package.json`, configuração, componentes, páginas nem API.

```
dashboard_mrv_fortaleza/
├── MRV DESIGN SYSTEM/
│   ├── MRV_MASTER_DESIGN_SYSTEM_AI_IMPLEMENTATION_GUIDE.md   (39 KB, 1.260 linhas)
│   └── mrv-design-tokens.json                               (8,5 KB)
└── empreendimentos_mrv_fotos.zip                            (252 MB)
    └── mrv_empreendimentos/
        ├── LEIA-ME.txt, links_oficiais.csv
        └── 01_RESIDENCIAL_FORTITUDINE … 16_ECO_PARK/   (16 pastas)
            ├── NN_<descrição>.jpg|jpeg|webp
            └── link_oficial.txt
```

**Ambiente local:** Node 22.20, npm 10.9, Python com Pillow 11.3. Nenhuma dependência instalada no projeto.

### Fontes externas ao repositório que entram no plano

| Fonte | O que tem | Como entra |
| --- | --- | --- |
| Páginas oficiais `mrv.com.br/imoveis/...` (16 links do CSV) | `<script id="mrv-property-details">` com bairro, cidade, CEP, lat/lon, status, tipologias e m², unidades, vagas, elevador, diferenciais (lazer, área comum, unidade), "próximo a", selo Minha Casa Minha Vida, promoções. Sem preço. | Script de extração → JSON revisado à mão → versionado no repo |
| Projeto `Dashboard_de_Bairros_de_Fortaleza` (seu, ao lado deste repo) | 121 bairros: saneamento (Censos 2010/2022), índice 0–100, equipamentos OSM (saúde, lazer, mobilidade, escolas, comércio), preço do m² por regional (PriceRadar), tempo de ônibus de cada bairro até 12 polos (r5py), polígonos GeoJSON, regionais | Exportar um `bairros.json` enxuto para este projeto |

### Código reutilizável do projeto anterior

- `dashboard/morar.js`: questionário "Onde morar" com pesos por nível (0, 1, 2, 4), notas em percentil entre os 121 bairros, redistribuição de peso quando falta dado, teto de financiamento pela tabela Price e resultado salvo na URL. **A lógica de scoring é a base do item 11.** A interface (pixels, Leaflet, cobalto) não serve: foi feita para outra identidade.
- `scripts/12_transporte.py`: tempos até os polos Centro, Beira-Mar, Aldeota, Papicu, Iguatemi, Unifor, Centro de Eventos, Parangaba, Messejana, UFC Benfica, UFC Pici e Aeroporto. **Alimenta a pergunta "para onde você vai todo dia?".**
- `scripts/10_equipamentos_osm.py`: dá para rodar de novo por raio de 1 km em torno de cada empreendimento, em vez do bairro inteiro.

## Etapa 2 — Auditoria dos empreendimentos

São 16 empreendimentos, 13 em Fortaleza e 3 na Região Metropolitana; 9 em lançamento e 7 em construção, todos ativos comercialmente. O bairro "no polígono" é onde a coordenada oficial cai na malha de bairros da Prefeitura (Seuma, 2025); as divergências estão em negrito.

| # | Empreendimento | Bairro no site → no polígono | Status | Área (m²) | Vagas por unidade | Itens de lazer | Fotos |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | Residencial Fortitudine | Antônio Bezerra | Lançamento | 43,34–45,14 | 0,30 | 6 | 13 |
| 02 | Residencial Flor do Sertão | Jacarecanga | Lançamento | sem tipologia no site | 0,21 | 7 | 18 |
| 03 | Ville de Lisboa | Parque Albano, Caucaia | Lançamento | 41,40–45,40 | 0,36 | 7 | 20 |
| 04 | Reserva da Lagoa | Passaré | Em construção | 36,88 | 0,80 | 6 | 17 |
| 05 | Residencial La Serena | Jangurussu | Lançamento | 38,40 | 0,35 | 7 | 12 |
| 06 | Forte Alencar | **Região do Cambeba → Cajazeiras** | Lançamento | 43,34–45,14 | 1,03 | 8 | 17 |
| 07 | Parque Marista | Centro | Lançamento | 38,80–40,44 | 0,30 | 13 | 20 |
| 08 | Residencial Farol do Atlântico | **Cocó → Manuel Dias Branco** | Lançamento | 43,34–45,14 | 1,07 | 7 | 17 |
| 09 | Sensia Reserva Vila do Sol | **Cocó → Parque Genibaú (coordenada provavelmente errada)** | Em construção | 54,58–54,80 | 1,11 | 8 | 15 |
| 10 | Ville de Porto | Parque Albano, Caucaia | Lançamento | sem tipologia no site | 0,40 | 6 | 16 |
| 11 | Torre do Mar | **Região da Maraponga → Mondubim** | Em construção | 36,88 | 1,07 | 4 | 17 |
| 12 | Porto das Marés | Barra do Ceará | Em construção | 43,34–45,14 | 1,00 | 8 | 27 |
| 13 | Residencial Mandacaru | Antônio Bezerra | Em construção | 36,88 | 0,46 | 7 | 16 |
| 14 | Reserva Brisa do Mar | Cocó | Em construção | 38,05 (1 quarto) – 46,74 | 0,82 | 7 | 22 |
| 15 | Residencial Valparaíso | Jangurussu | Em construção | 38,40 | 0,37 | 6 | 15 |
| 16 | Eco Park | Urucunema, Eusébio | Em construção | 41,40 | 1,00 | 8 | 17 |

Todos têm 2 quartos; o Brisa do Mar também tem 1 quarto. Suíte aparece em Fortitudine, Forte Alencar, Farol, Vila do Sol e Porto das Marés. Pares no mesmo bairro: Fortitudine e Mandacaru (Antônio Bezerra), La Serena e Valparaíso (Jangurussu), Ville de Lisboa e Ville de Porto (Parque Albano). O Vila do Sol é da linha **Sensia** e, com o Reserva da Lagoa, não exibe o selo Minha Casa Minha Vida.

### O que existe por empreendimento (página oficial)

Nome, cidade, bairro, CEP, endereço, latitude/longitude, status, elevador, nº de unidades e vagas, área do terreno, tipologias com m², diferenciais classificados (lazer, área comum, unidade, segurança), texto "Próximo a" em prosa, descrição comercial, selo MCMV e promoções com validade. Itens de lazer mais comuns: pet place (16 de 16), playground (15), piscina adulto (13).

### Imagens

279 arquivos (252 MB): 231 JPEG e 48 WebP, 271 horizontais. Todas são renders com selo "Imagem ilustrativa"; nenhuma mostra pessoas. Por tipo, cada pasta tem em média 4–5 internas, 3–4 plantas humanizadas, 1–2 implantações, 1 aérea com pontos de interesse desenhados e 4–6 de áreas comuns (piscina, pet, playground, gourmet).

| Uso | Imagem indicada | Observação |
| --- | --- | --- |
| Hero e card | Fachada ou portaria (de preferência ao entardecer) e piscina | Escolha por empreendimento no `manifest` (ex.: Torre do Mar 16, Porto das Marés 01, Forte Alencar 06, Parque Marista 19) |
| Galeria | Internas e áreas comuns | Cantos retos, como pede o guia para composições com muitas imagens |
| Destaques | Pet place, playground, gourmet, academia | Ligadas aos itens de lazer que o quiz pontua |
| Localização | Aérea com marcações | Texto embutido: só em tela cheia com zoom, nunca em card |
| Planta | Plantas humanizadas | Texto embutido e pequeno: visualizador com pinça, não miniatura |
| Fundo | Nenhuma | Renders cheios de detalhe competem com texto; usar cor sólida da marca |

**Qualidade:** 6 pastas têm imagens com 2.500 a 8.048 px de largura (Fortitudine, Flor do Sertão, Ville de Lisboa, Forte Alencar, Parque Marista, Farol), e até 23 MB por arquivo. As demais ficam entre 1.085 e 1.920 px, suficiente para cards mas fraco para hero em tela cheia no desktop. 15 arquivos têm menos de 1.200 px, como a fachada do Reserva da Lagoa (767×767) e a varanda do La Serena (431×767).

**Inconsistências:** 11 arquivos com extensão `.jpg`/`.jpeg` são WebP (Torre do Mar, Mandacaru, Valparaíso), então o pipeline deve detectar o formato pelo conteúdo. As fotos do Parque Marista se chamam `PQ_RECANTO_DAS_ARARAS_*`: é preciso confirmar se pertencem a ele.

### O que falta

- Preço ou "a partir de" e faixa do MCMV: nenhuma página publica valor.
- Previsão de entrega, andares, vista, valor estimado de condomínio.
- Tipologias do Flor do Sertão e do Ville de Porto; área PCD zerada no Valparaíso.
- Bairro correto de 4 empreendimentos e a coordenada do Vila do Sol.
- Dados de bairro para Caucaia e Eusébio (o projeto anterior só cobre Fortaleza).
- Distâncias reais até os polos: hoje o "Próximo a" é texto livre e desigual (o Reserva da Lagoa cita só a Arena Castelão).
- Logo de cada empreendimento, logo MRV em vetor, fotos com pessoas, vídeos (só 2 páginas têm).
- Autorização formal de uso das imagens: o LEIA-ME lembra que seguem sob direitos da MRV.

## Etapa 3 — Auditoria do Design System MRV

O material é um guia derivado do manual *Comunicação Comercial – Versão 02 / Março 2020*, não o manual em si. Cada regra vem marcada como **\[OFICIAL\]** (está no PDF), **\[INFERIDO\]** (padrão dos exemplos) ou **\[RECOMENDADO\]** (extensão digital criada pelo autor). Quase tudo que é de interface (botões, inputs, motion, breakpoints, radius) é RECOMENDADO; o que é oficial é marca, cor, tipografia, forma, ícone e logo. O `mrv-design-tokens.json` repete os valores do guia em formato de tokens.

### Regras oficiais que esta aplicação precisa cumprir

- **Verde escuro `#006B3F` como fio condutor**, com presença "constante e significativa" na comunicação de empreendimentos.
- Progressão de verdes `#079D56`, `#00D38D`, `#82EA5B`; acentos laranja, roxo, rosa e amarelo como apoio. Os tons escuros de apoio (`#1A4236` etc.) servem a texto, nunca como protagonistas.
- Degradês apenas a 45°.
- **Averta** como família (Light, Regular, Bold, Black); tracking de texto corrido nunca muda.
- Grafismos com **intersecção/sobreposição**, parte preenchida e parte em linha; com muitas imagens, **cantos retos** prevalecem.
- Ícones no grid 16×16, combinando preenchimento e linha.
- Logo: área de proteção 2x, mínimo digital 70 px, versão positiva sobre branco e negativa sobre verde escuro, sem alteração ou efeito.
- Linguagem: personalidade engajada, corajosa, acolhedora e íntegra; atitudes Mobiliza, Realiza, Valoriza; estimular a imaginação e apresentar o imóvel como parte de uma vida maior.
- MRV Class (`#00331F`, pesos leves, caixa alta) só para produtos da linha Class. Nenhum dos 16 é Class; o Vila do Sol é Sensia, linha que o guia não cobre.

### Lacunas do material

| Falta | Impacto | Encaminhamento |
| --- | --- | --- |
| Arquivos do logo (SVG) | Sem logo não há header nem favicon; recriar é proibido | Pedir à MRV os arquivos originais |
| Fonte Averta licenciada | Sem ela, a tipografia não é da marca | Pedir os WOFF2 e a licença web; até lá, fallback Manrope (Google Fonts), marcado como provisório |
| Biblioteca de ícones e grafismos | O guia descreve, mas não entrega | Lucide como base estrutural (permitido pelo guia), poucos ícones próprios nos pontos de marca |
| Fotos com pessoas | O guia pede pessoas reais; só há renders | Pedir banco de imagens; até lá, a Home usa grafismo + render, sem foto de banco genérica |
| "Território de marca MRV" | O manual manda consultar junto | Pedir à MRV |
| Regras da linha Sensia | 1 empreendimento sem regra visual | Tratar como MRV padrão com selo "Sensia" no card |

O guia foi escrito pensando também em dashboards internos, e esta aplicação é de consumidor. Por isso, a parte de dashboard, tabelas e KPI cards fica de fora, e a de marketing/institucional (mais respiro, cor em blocos, grafismos em pontos de marca) vale mais.

# Parte B — Plano (SDD)

## 1. Visão do produto

Um consultor digital da MRV que, em cerca de 2 minutos, entende a rotina da pessoa e mostra os 3 empreendimentos MRV da Grande Fortaleza que mais combinam com ela, explicando o porquê em linguagem simples. Nome de trabalho: **"Descubra seu MRV"** (a definir com a marca).

## 2. Objetivos

| Objetivo | Medida | Meta inicial |
| --- | --- | --- |
| Levar a pessoa até o fim do quiz | Conclusão (início → resultado) | ≥ 60% |
| Gerar contato comercial qualificado | Cliques em "Falar com corretor" / "Simular" por resultado | ≥ 15% |
| Ser rápido no celular | LCP no 4G (p75) | < 2,5 s |
| Ser explicável | Todo resultado mostra 2–3 motivos rastreáveis até um dado | 100% |

As metas são pontos de partida para calibrar depois do primeiro mês de uso.

## 3. Público

Pessoas que querem sair do aluguel e comprar o primeiro imóvel em Fortaleza, Caucaia ou Eusébio, na faixa do Minha Casa Minha Vida (14 dos 16 têm o selo). Em geral solteiros, casais jovens ou famílias pequenas, chegando pelo celular a partir de anúncio ou rede social, muitas vezes sem saber em que bairros a MRV tem obra. Sinais nos dados: todas as plantas têm 2 quartos, a maioria sem vaga para todas as unidades, e o "Próximo a" das páginas fala de terminal de ônibus, atacadista, UPA e universidade.

## 4. Problema

Hoje a pessoa precisa abrir 16 páginas parecidas, que descrevem o imóvel e não a vida em volta dele, para descobrir qual fica perto do trabalho, tem vaga ou fica pronto antes. Como as plantas são quase iguais, a escolha real é de **lugar e rotina**, e essa informação está espalhada em texto livre ("Próximo a…"). O produto resolve isso juntando localização, deslocamento e lazer numa recomendação curta e justificada.

## 5. Experiência desejada

A sensação deve ser de conversa com alguém que conhece a cidade, não de formulário nem de painel. Princípios:

1. **Uma decisão por tela.** Cada pergunta ocupa a tela inteira, com 3 a 5 opções grandes; a escolha avança sozinha.
2. **Resultado antes de detalhe.** O resultado mostra 3 cards com foto, nome, bairro, um selo de compatibilidade e 2 motivos. Números e listas completas só no detalhe.
3. **Nada de índice negativo.** O produto destaca o que o bairro tem de bom para aquela pessoa; nunca usa segurança ou renda do bairro nem exibe ranking de bairro ruim (risco de marca e de leitura injusta).
4. **Sempre há saída.** Voltar uma pergunta, refazer o quiz, pular para "ver todos" e ajustar uma resposta direto no resultado, sem recomeçar.
5. **Tom MRV.** Frases curtas, verbos de ação, imaginação ("Imagine voltar do trabalho em 20 minutos"), sem entusiasmo artificial.
6. **Honestidade visual.** Selo "Imagem ilustrativa" preservado; tempo de ônibus apresentado como estimativa de tabela.

## 6. Jornada do usuário

A jornada proposta tem 5 passos no caminho principal (Home → Quiz → Resultado → Detalhe → Contato), um atalho para quem não quer o quiz e um desvio opcional para comparar.

&#91;embedded content: jornada · caminho principal e 2 desvios\]

Em relação à jornada inicial, duas mudanças: **"sugestão de bairros" deixa de ser uma tela** e vira uma frase no topo do resultado ("Seu perfil combina com a região Oeste e Centro"), porque recomendar bairro sem MRV não leva a nada; e **a comparação é opcional**, a partir do resultado, em vez de etapa obrigatória. Entre o quiz e o resultado há uma transição curta (item 14). Páginas de região ficam acessíveis pelo resultado e pela navegação, como apoio, fora do caminho principal.

## 7. Arquitetura de informação

O quiz é a porta principal; explorar é a porta lateral para quem já sabe o que quer. Navegação global com só 3 destinos: **Descobrir** (quiz), **Empreendimentos**, **Regiões**. No celular, isso vira uma barra inferior com 3 itens, escondida durante o quiz para manter o foco.

Hierarquia de informação do empreendimento, do mais visível ao mais profundo:

1. Card: foto, nome, bairro e cidade, selo de compatibilidade, até 2 motivos.
2. Topo do detalhe: galeria, status (Lançamento / Em construção), 2 quartos · m² · vaga · suíte, CTA.
3. Por que combina com você: os motivos completos, ligados às respostas.
4. A região: tempo até o destino escolhido, pontos próximos, o que o bairro tem de forte.
5. Lazer e condomínio: ícones dos itens.
6. Plantas e implantação: visualizador em tela cheia.
7. Detalhes técnicos: unidades, vagas, elevador, endereço, link para a página oficial.

**Regiões em vez de bairros soltos.** Com MRV em só 9 a 11 bairros de Fortaleza (9 pelo site, 11 pelas coordenadas), mais Caucaia e Eusébio, recomendar um bairro sem empreendimento frustra. A exploração agrupa os 16 em 5 regiões de fácil leitura (validado; a regional oficial fica só nos dados, para uso interno):

| Região | Empreendimentos |
| --- | --- |
| Oeste e Centro | Parque Marista, Flor do Sertão, Porto das Marés, Fortitudine, Mandacaru |
| Leste (Cocó e entorno) | Brisa do Mar, Farol do Atlântico, Vila do Sol |
| Sul | Reserva da Lagoa, Torre do Mar, La Serena, Valparaíso, Forte Alencar |
| Caucaia | Ville de Lisboa, Ville de Porto |
| Eusébio | Eco Park |

## 8. Estrutura de páginas e rotas

Sete rotas cobrem a jornada; todas são geradas no build (SSG), exceto o resultado, que é montado no navegador a partir das respostas codificadas na URL.

| Rota | Página | Renderização | Conteúdo essencial |
| --- | --- | --- | --- |
| `/` | Home | Estática | Promessa ("Vamos descobrir qual MRV combina com você"), 1 CTA para o quiz, faixa com 3–4 empreendimentos, atalho "ver todos" |
| `/descobrir` | Quiz | Estática + estado no cliente | Uma pergunta por tela, barra de progresso, voltar |
| `/descobrir/resultado?r=…` | Resultado | Cliente (sem SEO, `noindex`) | Leitura do perfil em 1 frase, região sugerida, 3 cards, "ver mais 3", ajustar respostas, comparar |
| `/empreendimentos` | Explorar | Estática, filtros no cliente | Grade de cards, 4 filtros (região, status, vaga, suíte) |
| `/empreendimentos/[slug]` | Detalhe | Estática (16 páginas) | Ver hierarquia do item 7; se veio do quiz, bloco "Por que combina com você" |
| `/regioes/[slug]` | Região | Estática (5 páginas) | Retrato curto da região, tempos até os polos, empreendimentos dela |
| `/comparar?ids=a,b,c` | Comparar | Cliente, `noindex` | 2 a 3 empreendimentos lado a lado (empilhados no celular), só atributos que diferem |

O CTA final não é uma rota própria: é uma folha (bottom sheet) com 3 caminhos — falar com corretor no WhatsApp, deixar contato, abrir a simulação na página oficial — levando o empreendimento e o perfil como contexto (UTM e mensagem pré-preenchida).

## 9. Arquitetura técnica e stack

Como o repositório não tem stack, a proposta é **Next.js (App Router) + TypeScript + Tailwind CSS**, com dados estáticos e nenhum servidor próprio no MVP. São 16 empreendimentos que mudam poucas vezes por mês: gerar tudo no build é mais rápido, mais barato e mais simples de manter do que um banco.

| Camada | Escolha | Por quê |
| --- | --- | --- |
| Framework | Next.js App Router, SSG | Nativo da Vercel; páginas de empreendimento indexáveis; Server Components enviam pouco JS |
| Linguagem | TypeScript estrito + Zod | Os dados vindos do site da MRV são validados no build; erro de dado quebra o build, não a página |
| Estilo | Tailwind CSS v4 com tokens MRV em CSS variables | Tokens do `mrv-design-tokens.json` viram `@theme`; nenhum HEX solto em componente |
| Componentes base | Radix Primitives só onde há acessibilidade difícil (Dialog/Sheet, RadioGroup, Tabs) | Comportamento acessível pronto, visual 100% MRV |
| Motion | CSS transitions + Motion (`motion/react`) com `LazyMotion` só no quiz e no resultado | Entradas/saídas e layout compartilhado sem pesar o resto do site |
| Estado do quiz | `useReducer` + respostas na URL (`?r=` compacto) | Resultado compartilhável, recarregar não perde nada, sem biblioteca de estado |
| Imagens | Pré-processamento no build com `sharp` (AVIF + WebP em larguras fixas) servidas de `/public` com CDN da Vercel | Sem custo de otimização por requisição; controle de recorte por imagem |
| Mapa | SVG estático das 5 regiões, gerado do GeoJSON no build | Sem Leaflet/Mapbox no MVP (\~150 KB a menos) |
| Contato | Link de WhatsApp + Route Handler `/api/lead` que repassa a um webhook | Uma função serverless só, quando o CRM for definido |
| Medição | Vercel Analytics + Speed Insights; eventos do funil (pergunta respondida, resultado, CTA) | Ver onde as pessoas desistem |
| Testes | Vitest (scoring e dados), Playwright (jornada no celular), Lighthouse CI | O scoring precisa de teste de regressão |

Pipeline de dados (scripts Node em `scripts/`, rodados à mão quando a MRV atualiza algo):

1. `extract-mrv.ts` lê as 16 páginas oficiais e grava `data/raw/mrv/*.json`.
2. Revisão manual em `data/curated/empreendimentos.json` (bairro correto, região, textos, imagem de capa). O curado sempre vence o extraído.
3. `build-bairros.ts` importa do projeto de bairros só os indicadores necessários e os tempos até os polos.
4. `build-images.ts` gera as variantes e o `images.manifest.json` com dimensões, cor dominante e placeholder.
5. `validate.ts` (Zod) roda no `prebuild`.

## 10. Modelo de dados

Quatro entidades versionadas em JSON (Empreendimento, Bairro, Região, Polo) e duas que só existem no navegador (Respostas e Resultado). Tudo em português nos nomes de domínio, para casar com os dados de origem.

```ts
type Status = "lancamento" | "em_construcao" | "pronto";
type Lazer = "piscina" | "pet" | "playground" | "kids" | "gourmet" | "festas"
  | "academia" | "funcional" | "quadra" | "jogos" | "caminhada" | "piquenique";

interface Empreendimento {
  slug: string;               // "parque-marista"
  nome: string;
  linha: "mrv" | "sensia";
  cidade: "Fortaleza" | "Caucaia" | "Eusébio";
  bairroId: number | null;    // id da malha Seuma; null fora de Fortaleza
  bairroNome: string;         // nome curado, exibido
  regiao: RegiaoSlug;
  coord: { lat: number; lon: number };
  status: Status;
  tipologias: { quartos: 1 | 2; suite: boolean; pcd: boolean; areaM2: number[] }[];
  varanda: boolean; elevador: boolean;
  unidades: number; vagas: number;     // vagasPorUnidade = vagas / unidades
  lazer: Lazer[];
  diferenciais: string[];     // área comum e unidade, texto curto
  proximoA: string[];         // quebrado do texto oficial
  mcmv: boolean;
  urlOficial: string;
  imagens: { capa: ImagemRef; card: ImagemRef; galeria: ImagemRef[];
             plantas: ImagemRef[]; implantacao?: ImagemRef; aerea?: ImagemRef };
  fonte: { extraidoEm: string; revisadoEm: string };
}

interface Bairro {             // só os bairros que têm MRV + vizinhos usados no texto
  id: number; nome: string; regional: number;
  notas: { saude: number; lazer: number; mobilidade: number;
           escolas: number; comercio: number; seguranca: number }; // percentil 0–100
  tempoAtePolo: Record<PoloId, number>; // minutos de ônibus, mediana
}

interface Polo { id: PoloId; nome: string; lat: number; lon: number }

interface ImagemRef { id: string; alt: string; w: number; h: number;
  cor: string; blur: string; foco?: [number, number] } // ponto de recorte

interface Respostas { destino?: PoloId; tempoMax?: 30 | 45 | 60; carro?: 0 | 1 | 2;
  moradores?: "so" | "casal" | "filhos" | "pet"; lazer?: Lazer[];
  prazo?: "logo" | "tanto_faz"; prioridades?: (keyof Bairro["notas"])[] }
```

Para Caucaia e Eusébio, `Bairro` não existe; as notas de entorno vêm de uma contagem OSM num raio de 1 km em torno do empreendimento (mesmo script do projeto anterior), e o tempo até os polos, de uma rodada do r5py com origem na coordenada. Se essa rodada não for feita, o critério fica de fora para esses 3, e a tela avisa.

## 11. Sistema de recomendação

Um scoring ponderado e determinístico: cada resposta liga ou desliga critérios e define o peso deles; cada critério dá a cada empreendimento uma nota de 0 a 100 vinda de um dado verificável; a nota final é a média ponderada. É a mesma lógica do "Onde morar" do projeto anterior, agora no nível do empreendimento. A mesma entrada sempre gera o mesmo ranking, e cada ponto da nota pode ser explicado.

### Perguntas (7, cerca de 2 minutos)

Quartos e tamanho ficam fora: os 16 têm 2 quartos, e perguntar criaria falsa escolha. Orçamento também, até a MRV fornecer preço ou faixa (item 23).

| # | Pergunta | Opções | O que muda | Dado usado |
| --- | --- | --- | --- | --- |
| 1 | Onde você topa morar? | Só Fortaleza · Fortaleza ou Região Metropolitana · Escolher regiões | **Filtro** | `cidade`, `regiao` |
| 2 | Para onde você vai quase todo dia? | 12 polos (Centro, Aldeota, Unifor, UFC Benfica…) · Trabalho de casa | Critério deslocamento, peso 3 | `tempoAtePolo` (r5py, ônibus e metrô) |
| 3 | Como você se desloca? | Ônibus ou metrô · Carro ou moto · Bicicleta ou a pé · Aplicativo | Ativa vaga (carro) ou mobilidade (ônibus) | `vagas/unidades`, nota `mobilidade` |
| 4 | Quem vai morar com você? | Sozinho(a) · Casal · Com filhos (+ "tenho pet") | Liga escolas e kids (filhos), suíte (casal) | nota `escolas`, `lazer`, `tipologias.suite` |
| 5 | O que não pode faltar no condomínio? (até 3) | Piscina · Academia · Playground/kids · Festas/gourmet · Quadra/jogos · Caminhada/piquenique | Critério lazer, peso 2 | `lazer[]` |
| 6 | E no bairro, o que pesa mais? (até 2) | Saúde perto · Escolas · Comércio do dia a dia · Parques e lazer · Ônibus fácil | Cada escolha vira critério, peso 1,5 | notas do bairro (percentil entre os 121) |
| 7 | Quando você quer se mudar? | O quanto antes · Em 1 a 2 anos · Tanto faz | Critério prazo, peso 1,5 | `status` |

Pet place existe nos 16, então "tenho pet" não muda a ordem; só aparece como motivo. Segurança e renda do bairro ficam fora do produto, nem como critério nem como texto (decisão MRV).

### Notas por critério (0 a 100)

| Critério | Nota do empreendimento | Peso |
| --- | --- | --- |
| Deslocamento | 100 até 15 min; cai linearmente até 0 em 75 min (mediana de ônibus do bairro até o polo) | 3 |
| Vaga (se vai de carro) | `min(100, 100 × vagas/unidades)` | 2,5 |
| Mobilidade (se vai de ônibus) | Nota `mobilidade` do bairro | 1,5 |
| Lazer do condomínio | % dos itens escolhidos que o empreendimento tem | 2 |
| Prioridades do bairro | Percentil do bairro no tema | 1,5 cada |
| Família com filhos | Média de `escolas` do bairro e presença de playground/kids | 1 |
| Casal | 100 se há opção com suíte, 40 se não | 1 |
| Prazo "o quanto antes" | Em construção 100, lançamento 40 | 1,5 |

```latex
\text{score}(e) = \frac{\sum_c w_c \, s_c(e)}{\sum_c w_c} \times p(e)
```

`p(e)` é uma penalidade só para requisito explícito não atendido: quem vai de carro e cai num empreendimento com menos de 0,5 vaga por unidade recebe ×0,85 e um aviso ("vagas limitadas"). Critério sem dado para um empreendimento (Caucaia/Eusébio sem tempo de ônibus) sai da conta dele e o peso se redistribui, como no projeto anterior.

### Ranking

1. Aplicar o filtro da pergunta 1.
2. Calcular `score(e)` para os que sobram e ordenar; desempate pelo deslocamento e depois pelo número de itens de lazer.
3. **Diversidade:** no máximo 1 por bairro entre os 3 primeiros, a menos que o segundo do mesmo bairro esteja 8+ pontos acima do próximo candidato (evita mostrar Fortitudine e Mandacaru juntos só por estarem no mesmo lugar).
4. **Região sugerida** = região com a maior média dos 2 melhores empreendimentos dela. Aparece como frase acima dos cards ("Seu perfil combina com a região Oeste e Centro").
5. Selo de compatibilidade: ≥ 80 "Combina muito", 65–79 "Combina bem", abaixo de 65 "Vale conhecer". O número exato fica no detalhe.

### Explicação

Cada critério gera um motivo quando sua nota é ≥ 70 e seu peso é > 0; os motivos são ordenados pela contribuição `w × s`. O card mostra os 2 primeiros, o detalhe mostra todos e, se houver, 1 ponto de atenção. Os textos vêm de modelos com dado real:

- "Cerca de 25 min de ônibus até a Unifor"
- "Tem os 3 itens de lazer que você escolheu: piscina, academia e playground"
- "1 vaga por apartamento"
- "Bairro entre os 20% de Fortaleza com mais comércio por perto"
- "Já em construção: a mudança tende a ser mais cedo"
- Atenção: "Vagas para 30% das unidades"

Os pesos e limiares ficam num único `scoring.config.ts`, cobertos por testes com perfis de referência (ex.: "estudante da UFC Benfica sem carro" deve trazer Parque Marista ou Flor do Sertão no top 3).

## 12. Design System operacional

Base branca com muito respiro, verde escuro `#006B3F` em toda ação principal e nos blocos de destaque, acentos oficiais só em selos e grafismos, Averta em só 3 pesos (400, 600, 800). Os valores vêm do guia; o que foi adaptado para consumidor está marcado com *(adaptado)*.

### Tokens

```css
:root {
  /* marca [OFICIAL] */
  --green-900: #006B3F; --green-700: #079D56; --green-500: #00D38D; --green-300: #82EA5B;
  --green-950: #00331F; --ink: #1A4236;
  --orange-500: #FF8B22; --orange-300: #FFB719; --purple-700: #793F98;
  --peach-100: #FCD9B4; --sage-200: #CDE1B3; --lilac-300: #C595C3;

  /* semântica [RECOMENDADO] */
  --bg: #FFFFFF; --bg-subtle: rgba(0,107,63,.04); --bg-brand: var(--green-900);
  --text: var(--ink); --text-muted: rgba(26,66,54,.68); --text-on-brand: #FFFFFF;
  --border: rgba(26,66,54,.18); --border-strong: rgba(26,66,54,.32);
  --action: var(--green-900); --action-hover: var(--green-700); --action-active: var(--ink);
  --focus: var(--green-500); --error: #BA4726; --warning: var(--orange-300);
  --selected-bg: rgba(0,107,63,.06);

  /* forma */
  --r-sm: 6px; --r-md: 8px; --r-lg: 12px; --r-xl: 16px;
  --e-1: 0 1px 2px rgba(26,66,54,.08); --e-2: 0 4px 12px rgba(26,66,54,.10);
  --e-3: 0 12px 28px rgba(26,66,54,.14);

  /* motion */
  --t-fast: 120ms; --t-base: 180ms; --t-slow: 240ms; --t-emph: 320ms;
  --ease: cubic-bezier(.2,.8,.2,1); --ease-out: cubic-bezier(.16,1,.3,1);
}
```

O projeto não terá dark mode: o guia não o define e lista "preto puro com neon" como anti-padrão.

### Tipografia

Família `"Averta", "Manrope", system-ui, sans-serif`; Manrope via `next/font` enquanto a Averta não chega. Tamanhos fluidos com `clamp()` entre 360 e 1280 px.

| Papel | Mobile → Desktop | Peso | Linha |
| --- | --- | --- | --- |
| Display (Home, resultado) | 36 → 56 px | 800 | 1,05 |
| Título da pergunta | 26 → 36 px | 800 | 1,15 |
| H2 de seção | 24 → 32 px | 800 | 1,2 |
| Título de card | 18 → 20 px | 600 | 1,3 |
| Corpo | 16 px | 400 | 1,5 |
| Apoio / legenda | 14 / 12 px | 400 | 1,45 |
| Botão, selo, label | 15 / 13 px | 600 | 1,3 |

### Espaço e grid

Escala de 4 px: 4, 8, 12, 16, 24, 32, 48, 64, 80. Grid de 4 colunas no celular (margem 20 px *(adaptado: 16 do guia fica apertado com cards de foto)*), 8 no tablet (margem 32), 12 no desktop (gutter 24, conteúdo até 1200 px). Entre seções, 48 no celular e 80 no desktop.

### Componentes base

| Componente | Especificação | Estados |
| --- | --- | --- |
| Botão primário | Fundo `--action`, texto branco, 48 px de altura no celular / 44 no desktop, radius 8, 15 px/600; largura total no celular | hover `--action-hover`, ativo `--action-active`, foco anel 2 px `--focus` com 2 px de afastamento, carregando mantém a largura, desabilitado com fundo e texto alfa |
| Botão secundário / fantasma | Borda 1 px verde ou sem borda, texto verde | hover fundo `--selected-bg` |
| Opção do quiz *(adaptado)* | Bloco de toque ≥ 56 px (linha) ou cartão 1:1 com ícone 32 px; borda 1,5 px `--border`, radius 12 | selecionado: borda 2 px verde, fundo `--selected-bg`, ícone de check; foco: anel verde; múltipla escolha mostra contador "2 de 3" |
| Card de empreendimento | Foto 4:3 no topo **com cantos retos** (guia: muitas imagens), corpo branco, borda `--border`, radius 12 no contêiner, sem sombra | hover no desktop: `--e-2` e zoom de 1,03 na foto; pressionado no celular: escala 0,98 |
| Selo | Pill 24 px de altura, 13 px/600, texto `--ink` | Lançamento: fundo `--green-300`; Em construção: `--peach-100`; Sensia: `--lilac-300`; compatibilidade: fundo verde escuro, texto branco |
| Chip de lazer | Ícone 20 px verde + rótulo 14 px, sem fundo | — |
| Folha inferior (sheet) | Radius 16 só no topo, overlay `rgba(0,51,31,.40)`, alça de arraste | foco preso dentro, fecha com Esc e arrastando para baixo |
| Campo (contato) | 48 px, label sempre acima, borda 1 px `--border-strong`, radius 8 | foco 2 px verde, erro `--error` + texto |
| Skeleton | Bloco `--bg-subtle` com o mesmo tamanho do conteúdo final | pulso de opacidade lento, desligado em reduced-motion |

### Grafismos, ícones e imagens

- Grafismo próprio em SVG com 2 a 3 formas em intersecção (uma em linha, uma preenchida), em verde e um acento por tela. Usado só na Home, no início do quiz e no topo do resultado. Nunca derivado do logo.
- Ícones Lucide com traço 1,75 px, tamanhos 20/24; 6 a 8 ícones de lazer redesenhados no grid 16×16 numa etapa posterior.
- Fotos sempre com cantos retos dentro de cards e galerias; selo "Imagem ilustrativa" do render preservado (sem recorte que o elimine) ou repetido em legenda.
- Texto sobre foto só com degradê escuro de 45° ou faixa sólida verde; nunca texto direto sobre render.

## 13. Componentes

Três camadas: **primitivos** sem regra de negócio (`components/ui`), **domínio** que conhece empreendimento e quiz (`components/<domínio>`) e **seções** de página. Por padrão, tudo é Server Component; só vira Client Component (●) o que tem estado ou gesto.

| Componente | Camada | Faz | Onde |
| --- | --- | --- | --- |
| `Button`, `IconButton`, `LinkButton` | ui | Variantes primary / secondary / ghost, tamanhos sm/md/lg, `loading` | Tudo |
| `Badge` | ui | Status, linha (Sensia), compatibilidade | Cards, detalhe |
| `Sheet` ● | ui | Folha inferior no celular, modal centrado no desktop (Radix Dialog) | CTA, filtros, plantas |
| `Img` | ui | `<picture>` com AVIF/WebP, `srcset` do manifest, placeholder de cor + blur, `priority` opcional | Toda imagem |
| `Shape` | ui | Grafismo MRV em SVG (2–3 formas em intersecção) | Home, quiz, resultado |
| `Header`, `BottomNav` | layout | Logo + 3 destinos; barra inferior no celular, escondida no quiz | Global |
| `QuizShell` ● | quiz | Estado, progresso, URL, voltar, transição entre passos | `/descobrir` |
| `QuizProgress` | quiz | Barra fina com segmentos + "3 de 7" para leitor de tela | Quiz |
| `QuizQuestion` | quiz | Título, ajuda opcional, grupo de opções | Quiz |
| `QuizOption` ● | quiz | Opção única (radio) ou múltipla (checkbox) com ícone, avança sozinha na única | Quiz |
| `DestinationPicker` ● | quiz | Lista dos 12 polos com busca curta e agrupamento por região | Pergunta 2 |
| `ProfileSummary` | resultado | Uma frase do perfil + chips das respostas, toque para ajustar | Resultado |
| `RecommendationCard` | resultado | `PropertyCard` + selo de compatibilidade + 2 motivos | Resultado |
| `MatchBadge` | resultado | Rótulo ("Combina muito") e, no detalhe, a nota | Card, detalhe |
| `ReasonList` | resultado | Motivos com ícone, ponto de atenção separado | Card, detalhe |
| `PropertyCard` | empreendimento | Foto 4:3, nome, bairro · cidade, status, 3 atributos | Explorar, região, resultado |
| `PropertyFacts` | empreendimento | 2 quartos · m² · vaga · suíte em linha, sem tabela | Detalhe, comparar |
| `PropertyGallery` ● | empreendimento | Carrossel com scroll-snap e arraste, contador, tela cheia sob demanda | Detalhe |
| `FloorPlanViewer` ● | empreendimento | Planta em tela cheia com pinça/zoom | Detalhe |
| `AmenityList` | empreendimento | Chips de lazer com ícone; os escolhidos no quiz aparecem primeiro | Detalhe |
| `CommuteInfo` | região | Tempo até o destino escolhido e até 3 outros polos | Detalhe, região |
| `RegionMap` | região | SVG das 5 regiões com pinos; região sugerida em destaque | Resultado, região |
| `FilterBar` ● | explorar | 4 filtros visíveis; no celular, um botão abre `Sheet` | Explorar |
| `CompareTray` ● | comparar | Bandeja fixa com até 3 selecionados e "Comparar" | Resultado, explorar |
| `ComparisonView` | comparar | Colunas lado a lado (desktop), cards empilhados com destaque das diferenças (celular) | `/comparar` |
| `ContactCTA` ● | conversão | Botão fixo no rodapé do detalhe que abre a folha com WhatsApp, formulário e simulação | Detalhe, resultado |

Regras: nenhum componente de domínio recebe cor por prop (usa tokens); todo componente de imagem passa por `Img`; todo texto de motivo vem do módulo de scoring, nunca escrito dentro do componente.

## 14. Motion System

O movimento serve para mostrar direção (avançar/voltar), confirmar uma escolha e revelar o resultado em ordem de importância. Só se anima `transform` e `opacity`; nada anima largura, altura, `top` ou sombra pesada. Toda duração vem dos tokens do guia (120 / 180 / 240 / 320 ms).

| Onde | Por quê | Transição | Duração | Celular | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Toque numa opção | Confirmar a escolha | Escala 0,98 ao pressionar; borda e fundo mudam; check entra com escala 0,6 → 1 | 120 ms + 180 ms | Igual | Só cor, sem escala |
| Avançar pergunta | Mostrar progresso e direção | Atual sai 24 px para a esquerda + fade; próxima entra da direita; inverso ao voltar | 240 ms saída, 320 ms entrada, `--ease-out` | Deslocamento 16 px | Fade de 120 ms |
| Pausa antes de avançar | Deixar ver o que foi marcado | Espera de 260 ms após escolha única | — | Igual | Igual |
| Barra de progresso | Saber quanto falta | Segmento preenche com `scaleX` | 240 ms | Igual | Sem animação |
| Transição quiz → resultado | Dar peso ao momento | Tela verde com o grafismo, frase "Encontramos 3 empreendimentos para você" por 900 ms; cálculo já está pronto, é só cerimônia curta | 900 ms total, pulável com toque | Igual | Sem cerimônia, vai direto |
| Cards do resultado | Ler na ordem do ranking | Entrada em cascata: 16 px de baixo + fade, 60 ms entre cards | 320 ms cada | Igual | Fade simultâneo |
| Selo de compatibilidade | Destacar o principal | Rótulo entra depois do card; sem contador numérico girando | 180 ms, atraso 120 ms | Igual | Sem atraso |
| Card → detalhe | Manter contexto da foto | Foto do card vira a capa do detalhe (View Transitions API onde houver suporte; senão, fade) | 320 ms | Igual | Corte seco |
| Fotos carregando | Evitar salto e tela vazia | Cor dominante → blur → imagem com fade | 240 ms | Igual | Sem fade |
| Galeria | Gesto natural | Scroll-snap nativo com inércia do sistema; nada de carrossel automático | Do sistema | Arraste | Igual |
| Sheet de CTA e filtros | Origem do painel | Sobe de baixo; overlay em fade | 240–320 ms | Arrastar para fechar | Fade |
| Hover de card (desktop) | Indicar clicável | Sombra `--e-2` + zoom 1,03 na foto | 180 ms | Não existe | Sem zoom |
| Filtros em Explorar | Mostrar o que mudou | Itens que saem fazem fade; os que ficam se reposicionam (layout animation) | 240 ms | Igual | Corte seco |

Regras de implementação: CSS para hover, press, progresso e skeleton; Motion com `LazyMotion` + `domAnimation` só para `AnimatePresence` do quiz, cascata do resultado e layout dos filtros (carregado apenas nessas rotas). `prefers-reduced-motion` é lido num hook único e também em CSS (`@media`). Nenhuma animação bloqueia interação: o próximo toque sempre funciona, mesmo durante uma transição.

## 15. Responsividade e mobile first

O desenho começa em 360 × 740 px (Android de entrada) e cresce; o desktop ganha colunas, não elementos novos. Breakpoints do guia: 480, 768, 1024, 1280.

| Tela | Celular (< 768) | Desktop (≥ 1024) |
| --- | --- | --- |
| Home | Promessa, 1 botão fixo na zona do polegar, faixa horizontal de cards com scroll-snap | Promessa à esquerda, mosaico de 3 renders à direita |
| Quiz | Pergunta no topo, opções em lista ou grade 2×N, "Voltar" e "Continuar" fixos embaixo; sem header e sem barra inferior | Coluna central de 640 px, opções em grade 3×N |
| Resultado | Cards empilhados em largura total, mapa recolhido num botão "ver no mapa" | 3 cards lado a lado, mapa ao lado da frase do perfil |
| Detalhe | Galeria em largura total no topo, CTA fixo no rodapé ("Falar com corretor") | Galeria + coluna lateral fixa com fatos e CTA |
| Comparar | Um card por empreendimento, rolagem vertical, diferenças em destaque | Colunas lado a lado |
| Explorar | Botão "Filtros" abre folha; grade de 1 coluna | Filtros visíveis em linha; grade de 3 colunas |

Regras de celular:

- Área de toque mínima de 48 × 48 px; botões principais a menos de 25% da altura a partir da borda inferior.
- Respeitar `env(safe-area-inset-*)` no CTA fixo e na barra inferior.
- Usar `100dvh` nas telas do quiz (a barra do navegador não empurra o botão para fora).
- Gestos só como atalho: arrastar na galeria e na folha; voltar do quiz também pelo botão do sistema (cada pergunta é um estado do histórico).
- Tipografia fluida com piso de 16 px no corpo (evita zoom automático do iOS em campos).
- Imagens do card em 480 ou 768 px de largura no celular; nunca baixar a variante de desktop.
- Teste de referência: Moto G de entrada com CPU 4× mais lenta e rede 4G lenta no Chrome DevTools.

## 16. Performance

O maior risco é o peso das imagens: os originais somam 252 MB, com arquivos de até 23 MB e 8.048 px. Nenhum original chega ao navegador; tudo passa pelo pipeline de build.

### Orçamento (p75, celular 4G)

| Métrica | Meta |
| --- | --- |
| LCP | < 2,0 s na Home, < 2,5 s no detalhe |
| INP | < 150 ms (toque numa opção do quiz) |
| CLS | < 0,05 |
| JS inicial da Home (gzip) | < 90 KB |
| JS da rota do quiz (gzip, incluindo Motion) | < 130 KB |
| Peso da Home antes de rolar | < 400 KB |

### Estratégias

- **Imagens.** `build-images.ts` com `sharp`: larguras 480, 768, 1200, 1600 e 2400 px (a última só quando o original permite), AVIF (qualidade \~50) e WebP (\~70), metadados removidos, formato detectado pelo conteúdo (há WebP com extensão `.jpg`). O manifest guarda largura, altura, cor dominante e um blur de \~300 bytes. `sizes` correto em cada uso. Só a capa do card acima da dobra recebe `fetchpriority="high"`; o resto é `loading="lazy"` + `decoding="async"`.
- **Seleção.** Nem todas as 279 imagens entram: por empreendimento, capa, card, até 10 de galeria, plantas e implantação, definidas no `empreendimentos.json`.
- **Pré-carga inteligente.** Durante o quiz, ao chegar na pergunta 5, o app já pode calcular um ranking parcial e pré-carregar (`<link rel="preload">` via JS, baixa prioridade) as capas dos prováveis 3 primeiros. No resultado, `prefetch` das rotas de detalhe dos 3 cards.
- **Rotas e bundle.** Server Components por padrão; `QuizShell`, galeria, folha e filtros como ilhas de cliente. Motion e Radix carregados só nas rotas que os usam (`next/dynamic` para galeria em tela cheia e visualizador de planta). Sem biblioteca de mapa no MVP. Dados do scoring (\~20 KB: 16 empreendimentos + tempos até 12 polos) embutidos na rota do quiz.
- **Fontes.** `next/font` com subset latin, 3 pesos, `display: swap` e fallback com métricas ajustadas (evita CLS). Quando a Averta chegar: WOFF2 self-hosted, mesmos 3 pesos.
- **Carregamento inicial.** Home 100% estática; texto e botão pintam antes de qualquer imagem; mosaico entra com cor dominante + blur. Skeletons só onde há espera real (imagens), com o tamanho exato do conteúdo.
- **Animações.** Só `transform`/`opacity`, `will-change` aplicado durante a transição e removido depois; nada roda em loop fora do skeleton.
- **Cache.** Páginas SSG na CDN da Vercel; imagens com nome por hash e `Cache-Control: public, max-age=31536000, immutable`; dados versionados junto com o deploy (nenhuma chamada em tempo de execução).
- **Repositório.** O zip de 252 MB não entra no git (o GitHub recusa arquivos acima de 100 MB). Originais ficam fora do repo (pasta local ignorada, ou Git LFS / storage); só as variantes processadas são versionadas.

Verificação contínua: Lighthouse CI nos PRs para Home, quiz e um detalhe, falhando se passar do orçamento; Speed Insights em produção.

## 17. Acessibilidade

Meta WCAG 2.2 AA, verificada com axe no CI e teste manual com TalkBack e VoiceOver antes do lançamento.

- **Contraste.** Branco sobre `#006B3F` e `#1A4236` sobre os verdes e amarelos claros, como o guia prevê; nunca texto branco sobre `#00D38D`, `#82EA5B` ou `#FFB719`.
- **Quiz.** Cada pergunta é um `fieldset` com `legend`; opção única = `radiogroup` (setas navegam), múltipla = checkboxes com limite anunciado ("escolha até 3; 2 escolhidas"). Ao trocar de pergunta, o foco vai para o título e uma região `aria-live` anuncia "Pergunta 3 de 7".
- **Avanço automático.** Com teclado ou leitor de tela, a escolha não avança sozinha: aparece o botão "Continuar" (evita perder o contexto).
- **Resultado.** Cards são `article` com título `h2`; a compatibilidade é texto ("Combina muito"), não só cor.
- **Imagens.** `alt` descritivo no manifest ("Piscina adulto do Parque Marista ao entardecer"); plantas têm resumo em texto (2 quartos, 43 m², varanda).
- **Foco e teclado.** Anel de foco verde de 2 px sempre visível; folhas e modais prendem o foco e devolvem ao fechar; ordem de foco igual à visual.
- **Movimento.** `prefers-reduced-motion` desliga deslocamentos e a cerimônia do resultado (item 14).
- **Zoom e leitura.** Layout funciona a 200% e com fonte do sistema aumentada; nenhuma informação só em tooltip.

## 18. SEO

Como produto interno, o site fica fora dos buscadores e não disputa com as páginas oficiais em `mrv.com.br`. Os metadados continuam caprichados, porque links compartilhados internamente (WhatsApp, Teams) precisam abrir com título e capa corretos.

- `generateMetadata` por página: título ("Parque Marista – Apartamentos de 2 quartos no Centro de Fortaleza"), descrição com bairro e lazer, Open Graph com a capa em 1200 × 630 gerada no build.
- `noindex, nofollow` global no layout e `robots.txt` com `Disallow: /`; sem `sitemap.xml`, `canonical` ou JSON-LD.
- HTML semântico e conteúdo visível no HTML estático (SSG), sem depender de JS para o texto.
- Resultado compartilhável com imagem OG dinâmica (`@vercel/og`) mostrando os 3 nomes, sem dados pessoais na URL.

## 19. Estrutura de arquivos

```
/
├── app/
│   ├── layout.tsx                  fontes, Header, BottomNav, analytics
│   ├── page.tsx                    Home
│   ├── descobrir/
│   │   ├── page.tsx                quiz (QuizShell)
│   │   └── resultado/page.tsx
│   ├── empreendimentos/
│   │   ├── page.tsx                explorar
│   │   └── [slug]/page.tsx         detalhe (generateStaticParams)
│   ├── regioes/[slug]/page.tsx
│   ├── comparar/page.tsx
│   ├── api/lead/route.ts           repasse para webhook/CRM
│   ├── robots.ts, opengraph-image.tsx
│   └── globals.css                 tokens (@theme) + base
├── components/
│   ├── ui/                         Button, Badge, Sheet, Img, Shape
│   ├── layout/                     Header, BottomNav, Footer
│   ├── quiz/                       QuizShell, QuizQuestion, QuizOption, QuizProgress, DestinationPicker
│   ├── resultado/                  ProfileSummary, RecommendationCard, MatchBadge, ReasonList
│   ├── empreendimento/             PropertyCard, PropertyFacts, PropertyGallery, FloorPlanViewer, AmenityList
│   ├── regiao/                     RegionMap, CommuteInfo
│   └── comparar/                   CompareTray, ComparisonView
├── lib/
│   ├── data.ts                     leitura tipada dos JSON
│   ├── schema.ts                   Zod
│   ├── quiz/questions.ts           perguntas e opções (conteúdo)
│   ├── quiz/url.ts                 codificar/decodificar respostas em ?r=
│   ├── scoring/config.ts           pesos e limiares
│   ├── scoring/score.ts            notas, ranking, diversidade
│   ├── scoring/reasons.ts          textos dos motivos
│   └── motion.ts                   variantes e hook de reduced motion
├── data/
│   ├── raw/mrv/*.json              extração das páginas (não editar)
│   ├── curated/empreendimentos.json  fonte de verdade revisada
│   ├── curated/regioes.json
│   ├── bairros.json, polos.json    gerados do projeto de bairros
│   └── images.manifest.json        gerado
├── public/img/<slug>/<id>-<w>.{avif,webp}   gerado
├── scripts/                        extract-mrv, build-bairros, build-images, validate
├── tests/                          unit (scoring, url), e2e (Playwright)
├── design-system/                  o atual "MRV DESIGN SYSTEM/" (renomear sem espaço)
├── docs/duvidas/Dúvidas.md         pontos a confirmar com a MRV
└── docs/spec/                      este plano exportado em Markdown (SDD)
```

Os originais das fotos ficam em `assets-src/` (no `.gitignore`), descompactados do zip.

## 20. Deploy na Vercel

Projeto Next.js padrão ligado ao GitHub: cada PR ganha um Preview Deployment com Lighthouse CI, e a `main` publica em produção. Não há banco nem cron no MVP.

- **Build:** `prebuild` roda `validate` (Zod); as imagens são geradas localmente e versionadas, para o build da Vercel não processar 252 MB a cada deploy.
- **Runtime:** quase tudo estático na CDN; uma única função (`/api/lead`) e a geração da imagem OG.
- **Variáveis:** `LEAD_WEBHOOK_URL`, `NEXT_PUBLIC_WHATSAPP`, `NEXT_PUBLIC_SITE_URL`; nada sensível no cliente.
- **Imagens:** servidas de `/public` com cache imutável, sem passar pelo Image Optimization da Vercel (evita custo por transformação e dá controle de recorte).
- **Observabilidade:** Vercel Analytics (funil), Speed Insights (Web Vitals reais), logs da função de lead.
- **Domínio:** subdomínio interno da MRV, definido com a TI, com headers de segurança (`CSP`, `X-Frame-Options`) em `next.config`.
- **Atualização de dados:** rodar `extract-mrv` → revisar diff do JSON → PR → deploy. Promoções com data de validade são filtradas pela data do build; um GitHub Action semanal chama um Deploy Hook da Vercel e mantém isso em dia.

## 21. Roadmap de desenvolvimento

As 12 fases sugeridas foram reagrupadas em 4 etapas com um portão entre elas; a mudança principal é uma **Fase 0 de decisões e curadoria de dados** antes de qualquer tela, porque o scoring depende de bairros corretos. O MVP utilizável termina na etapa 2.

&#91;embedded content: roadmap · 4 etapas, 12 fases, 3 portões\]

| Fase | Entrega | Pronto quando |
| --- | --- | --- |
| F0 Decisões e dados | Respostas do item 23; `extract-mrv`; `empreendimentos.json` curado; `bairros.json` e `polos.json` exportados | Os 16 com bairro, região e capa revisados |
| F1 Fundação | Next.js + TS + Tailwind, lint, Vitest, Playwright, deploy de preview na Vercel; `build-images` | Preview no ar com uma página e imagens otimizadas |
| F2 Design System | Tokens, fontes, primitivos (`Button`, `Badge`, `Sheet`, `Img`, `Shape`), página interna `/dev/ui` | Checklist "parece MRV?" do guia passa |
| F3 Dados e scoring | `scoring/` com config, notas, ranking, diversidade e motivos; 10 perfis de referência em teste | Testes verdes e rankings revisados por você |
| F4 Quiz | 7 perguntas, progresso, voltar, URL, teclado e leitor de tela | Quiz completo em menos de 2 min no celular |
| F5 Resultado | Perfil em 1 frase, região sugerida, 3 cards com motivos, ajustar respostas | **G2:** 5 pessoas fazem o fluxo sem ajuda |
| F6 Detalhe e regiões | 16 detalhes, galeria, plantas, lazer, deslocamento; 5 páginas de região; Explorar com filtros | Todas as páginas geradas no build |
| F7 Comparar e contato | Bandeja e tela de comparação; folha de CTA com WhatsApp, formulário e simulação | Lead chega ao destino definido |
| F8 Motion e mobile | Especificação do item 14 aplicada; passada completa em 360 px e em aparelho real | **G3:** jornada inteira fluida num Android de entrada |
| F9 Perf, a11y e SEO | Orçamentos do item 16 no CI, axe, metadata, JSON-LD, sitemap | Lighthouse ≥ 90 nas 4 categorias |
| F10 Teste com pessoas | 5 a 8 testes moderados, ajuste de textos e pesos | Conclusão do quiz ≥ 60% no teste |
| F11 Produção Vercel | Domínio, analytics, headers, Deploy Hook semanal | Autorização da MRV e go-live |

Animações e mobile não ficam só para F8: cada componente já nasce mobile first e com reduced motion; F8 é a passada de acabamento.

## 22. Riscos técnicos

| Risco | Efeito | Mitigação |
| --- | --- | --- |
| Dados de localização errados (4 bairros divergentes, coordenada do Vila do Sol) | Recomendação e tempo de ônibus errados | Curadoria manual obrigatória antes do scoring; o curado vence o extraído; teste que falha se a coordenada cair fora do bairro curado |
| Site da MRV muda a estrutura do JSON | Extração quebra | Extração é offline e versionada; o app nunca depende do site em tempo de execução |
| Direitos de uso das imagens e da marca | Bloqueio do lançamento | Produto oficial MRV: validar com Marketing as fotos e a versão final da marca antes do go-live |
| Sem logo e sem Averta | Produto não parece MRV | Placeholder textual e Manrope só até receber os arquivos; checklist do guia antes do go-live |
| Segurança e renda por bairro expostas ao cliente | Leitura de estigma, risco de marca | Decisão MRV: segurança e renda ficam fora do produto (nem critério, nem tela) |
| Tempos de ônibus de tabela (GTFS de 2023, sem trânsito) | Promessa otimista no pico | Texto "cerca de", arredondado para 5 min; fonte visível no detalhe |
| Produtos muito parecidos | Ranking com empates e notas próximas | Desempate explícito, regra de diversidade, selo em faixas em vez de % exato |
| Caucaia e Eusébio sem dados de bairro | 3 empreendimentos sempre em desvantagem | Rodar OSM e r5py na coordenada; até lá, critério fica fora da conta para eles (sem nota zero) |
| Imagens pesadas e de baixa resolução misturadas | LCP alto ou hero borrado | Variantes por largura real do original; hero de tela cheia só quando o original tem ≥ 2.400 px |
| Promoções vencidas no site | Informação comercial falsa | Filtrar por `dataExpiracao` no build + redeploy semanal |

## 23. Pontos ainda não definidos

As quatro primeiras perguntas bloqueiam a Fase 1; as outras podem ser respondidas durante o desenvolvimento.

- [x] **Escopo de uso:** protótipo de portfólio, projeto interno ou produto oficial da MRV? Isso decide autorização de imagens, domínio, SEO (`canonical`) e o destino do lead.
- [x] **Logo e Averta:** quem fornece os arquivos e a licença web?
- [x] **Bairros corretos:** confirmar o bairro e a coordenada de Forte Alencar, Farol do Atlântico, Vila do Sol e Torre do Mar, e se as fotos `RECANTO_DAS_ARARAS` são do Parque Marista.
- [x] **Regiões:** validar o agrupamento em 5 regiões do item 7 (ou usar as 12 regionais oficiais da Prefeitura, mais precisas e menos legíveis).
- [x] **Preço e orçamento:** há "a partir de" ou faixa do MCMV por empreendimento? Com isso, entra uma 8ª pergunta (renda ou parcela) usando o cálculo de teto do projeto anterior.
- [x] **Previsão de entrega:** existe data por empreendimento? Melhoraria o critério de prazo, hoje baseado só no status.
- [x] **Compatibilidade:** mostrar faixa ("Combina muito") ou percentual?
- [x] **CTA:** WhatsApp de qual equipe, qual CRM recebe o lead e com que consentimento (LGPD)?
- [x] **Nome do produto:** "Descubra seu MRV" é provisório.
- [x] **Linha Sensia:** tratar visualmente como MRV padrão com selo, ou há diretriz própria?
- [x] **Onde fica este plano:** manter só aqui ou exportar para `docs/spec/` no repositório quando o desenvolvimento começar.
