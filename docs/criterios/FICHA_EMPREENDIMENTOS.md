<!-- ARQUIVO GERADO por `npm run data:ficha` (scripts/build-ficha.ts). NÃO EDITE À MÃO: corrija os dados ou o script e gere de novo. -->

# Ficha dos empreendimentos

> **Arquivo gerado automaticamente. Não edite à mão.** Para atualizar: `npm run data:ficha`.
> Como cada critério funciona está em [COMO_ESCOLHEMOS.md](COMO_ESCOLHEMOS.md); o que pode estar errado no cálculo, em [AUDITORIA_SCORING.md](AUDITORIA_SCORING.md).

Fontes desta versão:

- Páginas oficiais da MRV, extraídas em 2026-10-05 (`data/empreendimentos.json`).
- Notas do bairro e tempo de ônibus: `data/bairros.json` (OpenStreetMap e tabela GTFS ETUFOR/Metrofor).
- Faixas do MCMV: tabela interna `data/curated/precos.json` (atualizada em 2026-10-07). O preço não aparece nesta ficha.
- Lazer conferido à mão: `data/curated/lazer.json` (10 empreendimentos).

Orçamento: cada ficha traz uma tabela "cabe / limite / acima" por faixa de renda e de entrada, calculada pela mesma regra do quiz, sem mostrar preço. A conta usa um valor perto do **topo** de cada faixa de renda (R$ 2.600, R$ 4.200, R$ 7.500, R$ 11.000, R$ 15.000) e perto do **piso** de cada faixa de entrada (R$ 0, R$ 8.000, R$ 20.000, R$ 45.000, R$ 70.000).

## Resumo

✔ tem · ✖ não tem · ⚠ o lazer conferido à mão diverge do que o quiz usa hoje · (p) conferência pendente. Lazer: só o que fica dentro do condomínio.

| # | Empreendimento | Região | Status | Suíte | Vaga/apto | MCMV | Piscina | Academia | Playground | Festas e churrasco | Quadra ou jogos | Área verde | Pet place | Itens de lazer | Escolas | Saúde | Ônibus |
| --: | --- | --- | --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| 1 | [Residencial Fortitudine](#1-residencial-fortitudine) | Oeste e Centro (Antônio Bezerra) | Lançamento | ✔ | 0,3 ⚠ | 2, 3 | ✔ | ✖ | ✔ | ✔ | ✖ | ✖ | ✔ | 7 | 80 | 74 | 69 |
| 2 | [Residencial Flor do Sertão](#2-residencial-flor-do-sertão) | Oeste e Centro (Jacarecanga) | Lançamento | ✖ | 0,21 ⚠ | 2, 3 | ✔ | ✔ | ✔ | ✔ | ✖ | ✔ | ✔ | 7 | 86 | 39 | 93 |
| 3 | [Ville de Lisboa](#3-ville-de-lisboa) | Caucaia (Parque Albano) | Lançamento | ✖ | 0,36 ⚠ | 1, 2 | ✔ | ✖ | ✔ | ✔ | ✔ | ✔ | ✔ | 12 | — | — | — |
| 4 | [Reserva da Lagoa](#4-reserva-da-lagoa) | Sul (Passaré) | Em construção | ✖ | 0,8 | 2, 3 | ✔ | ✖ | ✔ | ✔ | ✖ | ✖ | ✔ | 6 | 10 | 57 | 55 |
| 5 | [Residencial La Serena](#5-residencial-la-serena) | Sul (Jangurussu) | Lançamento | ✖ | 0,35 ⚠ | 1, 2 | ✔ | ✖ | ✔ | ✔ | ✖ | ✔ | ✔ | 7 | 58 | 35 | 13 |
| 6 | [Forte Alencar](#6-forte-alencar) | Sul (Cambeba) | Lançamento | ✔ | 1,03 | 3 | ✔ | ✔ (p) | ✔ | ✔ | ✖ | ✔ | ✔ | 9 | 4 | 70 | 50 |
| 7 | [Parque Marista](#7-parque-marista) | Oeste e Centro (Centro) | Lançamento | ✖ | 0,3 ⚠ | 2, 3 | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | 18 | 95 | 90 | 95 |
| 8 | [Residencial Farol do Atlântico](#8-residencial-farol-do-atlântico) | Leste (Cocó) | Lançamento | ✔ | 1,07 | 3 | ✔ | ✔ | ✔ | ✔ | ✖ | ✖ | ✔ | 7 | 16 | 79 | 40 |
| 9 | [Sensia Reserva Vila do Sol](#9-sensia-reserva-vila-do-sol) | Leste (Cocó) | Em construção | ✔ | 1,11 | 4 | ✔ | ✔ | ✔ | ✔ | ✖ | ✔ | ✔ | 9 | 16 | 79 | 40 |
| 10 | [Ville de Porto](#10-ville-de-porto) | Caucaia (Parque Albano) | Lançamento | ✖ | 0,4 ⚠ | 1, 2 | ✔ | ✖ | ✔ | ✔ | ✖ | ✔ | ✔ | 8 | — | — | — |
| 11 | [Torre do Mar](#11-torre-do-mar) | Sul (Maraponga) | Em construção | ✖ | 1,07 | 2, 3 | ✔ | ✖ | ✔ | ✔ | ✖ | ✖ | ✔ | 6 | 48 | 31 | 64 |
| 12 | [Porto das Marés](#12-porto-das-marés) | Oeste e Centro (Barra do Ceará) | Em construção | ✔ | 1 | 2, 3 | ✔ | ✖ | ✔ | ✔ | ✖ | ✔ | ✔ | 8 | 63 | 44 | 17 |
| 13 | [Residencial Mandacaru](#13-residencial-mandacaru) | Oeste e Centro (Antônio Bezerra) | Em construção | ✖ | 0,46 ⚠ | 3 | ✔ | ✔ | ✔ | ✔ | ✖ | ✖ | ✔ | 7 | 80 | 74 | 69 |
| 14 | [Reserva Brisa do Mar](#14-reserva-brisa-do-mar) | Leste (Cocó) | Em construção | ✖ | 0,82 | 3 | ✔ | ✖ | ✔ | ✔ | ✖ | ✔ | ✔ | 7 | 16 | 79 | 40 |
| 15 | [Residencial Valparaíso](#15-residencial-valparaíso) | Sul (Jangurussu) | Em construção | ✖ | 0,37 ⚠ | 1, 2 | ✔ | ✖ | ✔ | ✔ | ✖ | ✔ | ✔ | 6 | 58 | 35 | 13 |
| 16 | [Eco Park](#16-eco-park) | Eusébio (Urucunema) | Em construção | ✖ | 1 | 1, 2 | ✔ | ✖ | ✔ | ✔ | ✖ | ✖ | ✔ | 7 | — | — | — |

Vaga/apto com ⚠: menos de 0,5 vaga por apartamento, penalidade para quem vai de carro. Escolas, Saúde e Ônibus: nota do bairro (0 a 100); "—" = sem dado (Caucaia e Eusébio).

## 1. Residencial Fortitudine

- **Onde:** Antônio Bezerra, Fortaleza · região Oeste e Centro
- **Status (prazo):** Lançamento
- **Planta:** 2 quartos · suíte: tem opção · varanda: opcional · área: 43,34 a 45,14 m²
- **Vagas:** 116 vagas para 384 apartamentos = **0,3 vaga por apartamento**
- **Minha Casa Minha Vida:** atende as faixas 2 e 3 (preço de tabela: uso interno, não aparece aqui)
- **Página oficial:** https://www.mrv.com.br/imoveis/ceara/fortaleza/apartamentos-residencial-fortitudine (extraída em 2026-10-05)

### Lazer do condomínio

Itens de lazer na página oficial: Churrasqueira, Piscina Infantil, Piscina Adulto, Happy Hour, Playground, Pet Place, Espaço funcional ao ar livre.

| Grupo do quiz | O quiz usa hoje | Conferência à mão | Fonte | Trecho |
| --- | :-: | --- | --- | --- |
| Piscina | ✔ | automático (lista oficial) | — | — |
| Academia | ✖ | ✖ não tem · em 2026-10-08 | lista oficial (data/raw/mrv/01.json) + decisão do time MRV de 07/10/2026 (funcional não é academia) | Espaço Funcional Descoberto |
| Playground | ✔ | automático (lista oficial) | — | — |
| Festas e churrasco | ✔ | automático (lista oficial) | — | — |
| Quadra ou jogos | ✖ | automático (lista oficial) | — | — |
| Área verde | ✖ | automático (lista oficial) | — | — |
| Pet place | ✔ | automático (lista oficial) | — | — |

> **Obs.** Academia: A foto 01-07 (antes 'Espaço fitness') mostra barras, rampa e cordas ao ar livre: é o espaço funcional. Não há imagem de implantação deste empreendimento para conferir a legenda.
>

### Notas do bairro (posição entre os 121 bairros de Fortaleza, 0 a 100)

| Tema (pergunta 6) | Nota | Leitura |
| --- | :-: | --- |
| Saúde por perto | 74 | entre os 30%: vira motivo |
| Escolas | 80 | entre os 20%: vira motivo |
| Comércio do dia a dia | 31 | baixa: puxa a nota para baixo |
| Praças e parques | 9 | baixa: puxa a nota para baixo |
| Ônibus fácil | 69 | média |

### Tempo até os lugares mais procurados

Mediana da tabela de ônibus e metrô (GTFS ETUFOR/Metrofor), dia útil, saída 6h30–8h, sem trânsito.

| Destino | Minutos | Nota no quiz |
| --- | :-: | :-: |
| Centro (Praça do Ferreira) | 50 | 50 |
| Beira-Mar | 65 | 25 · atenção |
| Aldeota (Av. Santos Dumont) | 63 | 28 · atenção |
| Papicu (terminal) | 70 | 17 · atenção |
| Iguatemi | 66 | 23 · atenção |
| Unifor | 80 | 0 · atenção |
| Centro de Eventos | 75 | 8 · atenção |
| Parangaba (terminal) | 41 | 65 |
| Messejana (terminal) | 75 | 8 · atenção |
| UFC Benfica | 41 | 65 |
| UFC Pici | 32 | 80 · motivo |
| Aeroporto | 75 | 8 · atenção |

### Onde ganha pontos

- **Deslocamento (peso 4):** vira motivo para quem vai todo dia a UFC Pici (30 min).
- **Lazer (peso 2):** conta para quem pede piscina, playground e festas e churrasco.
- **Bairro (peso 1,5 cada tema escolhido):** forte em saúde por perto (74) e escolas (80): vira motivo.
- **Família com crianças (peso 1):** tem playground; escolas do bairro 80 → nota 90 (só 100 se a pessoa também escolheu "Escolas" na pergunta 6, porque aí as escolas já contam lá).
- **Casal (peso 1):** tem opção com suíte → nota 100.
- **Orçamento (peso 5):** atende faixa 2 do MCMV: quem tem essa renda recebe subsídio e juros menores na conta.

### Onde perde pontos

- **Deslocamento (peso 4):** mais de 62 min até Beira-Mar, Aldeota, Papicu, Iguatemi, Unifor, Centro de Eventos, Messejana e Aeroporto: nota abaixo de 30 e ponto de atenção.
- **Vaga (peso 2,5, quem vai de carro):** só 30% dos apartamentos têm vaga (menos de 0,5 por unidade): nota 30 **e** a nota final é multiplicada por 0,85; aviso "Vagas limitadas".
- **Lazer (peso 2):** não pontua para quem pede academia, quadra ou jogos e área verde (a nota é a fração dos itens pedidos que o condomínio tem).
- **Bairro (peso 1,5 cada tema escolhido):** nota baixa em comércio do dia a dia (31) e praças e parques (9).
- **Mobilidade (peso 1,5, quem anda de ônibus e não tem destino fixo):** nota 69.
- **Prazo:** lançamento → nota 40 para quem quer mudar "o quanto antes" (peso 1,5) e 80 para "em 1 a 2 anos" (peso 0,5).
- **Orçamento (peso 5):** quem é da faixa 1 não usa as condições do MCMV aqui (a conta usa juros de mercado e não há subsídio).

### Observações

- Mesmo bairro de Residencial Mandacaru: pela regra de diversidade, só um deles entra no top 5, a não ser que o segundo esteja 5 pontos ou mais à frente do próximo de outro bairro.
- Desempate (nota e tempo iguais): 7 itens de lazer na página oficial, 7º entre os 16.
- Tem pet place: o motivo "Pet place para o seu bicho" é verdadeiro aqui (o quiz hoje mostra esse motivo sem checar; ver auditoria).

### Orçamento no quiz (cabe / limite / acima, sem preço)

Ver a nota sobre os valores usados na conta no início desta ficha.

| Renda \ Entrada | Por enquanto, nada | Até R$ 10 mil | De R$ 10 mil a R$ 30 mil | De R$ 30 mil a R$ 60 mil | Mais de R$ 60 mil |
| --- | :-: | :-: | :-: | :-: | :-: |
| Até R$ 2.850 | acima | acima | acima | acima | acima |
| De R$ 2.850 a R$ 4.700 | acima | acima | acima | limite | cabe |
| De R$ 4.700 a R$ 8.600 | cabe | cabe | cabe | cabe | cabe |
| De R$ 8.600 a R$ 12.000 | cabe | cabe | cabe | cabe | cabe |
| Mais de R$ 12.000 | cabe | cabe | cabe | cabe | cabe |

## 2. Residencial Flor do Sertão

- **Onde:** Jacarecanga, Fortaleza · região Oeste e Centro
- **Status (prazo):** Lançamento
- **Planta:** 2 quartos · suíte: não · varanda: opcional · área: não informada
- **Vagas:** 46 vagas para 216 apartamentos = **0,21 vaga por apartamento**
- **Minha Casa Minha Vida:** atende as faixas 2 e 3 (preço de tabela: uso interno, não aparece aqui)
- **Página oficial:** https://www.mrv.com.br/imoveis/ceara/fortaleza/apartamentos-residencial-flor-do-sertao (extraída em 2026-10-05)

### Lazer do condomínio

Itens de lazer na página oficial: Churrasqueira, Espaço Piquenique, Playground, Piscina Infantil, Piscina com Deck, Pet Place, Academia Coberta.

| Grupo do quiz | O quiz usa hoje | Conferência à mão | Fonte | Trecho |
| --- | :-: | --- | --- | --- |
| Piscina | ✔ | automático (lista oficial) | — | — |
| Academia | ✔ | automático (lista oficial) | — | — |
| Playground | ✔ | automático (lista oficial) | — | — |
| Festas e churrasco | ✔ | automático (lista oficial) | — | — |
| Quadra ou jogos | ✖ | automático (lista oficial) | — | — |
| Área verde | ✔ | automático (lista oficial) | — | — |
| Pet place | ✔ | automático (lista oficial) | — | — |

### Notas do bairro (posição entre os 121 bairros de Fortaleza, 0 a 100)

| Tema (pergunta 6) | Nota | Leitura |
| --- | :-: | --- |
| Saúde por perto | 39 | baixa: puxa a nota para baixo |
| Escolas | 86 | entre os 15%: vira motivo |
| Comércio do dia a dia | 66 | média |
| Praças e parques | 79 | entre os 25%: vira motivo |
| Ônibus fácil | 93 | entre os 10%: vira motivo |

### Tempo até os lugares mais procurados

Mediana da tabela de ônibus e metrô (GTFS ETUFOR/Metrofor), dia útil, saída 6h30–8h, sem trânsito.

| Destino | Minutos | Nota no quiz |
| --- | :-: | :-: |
| Centro (Praça do Ferreira) | 25 | 92 · motivo |
| Beira-Mar | 35 | 75 · motivo |
| Aldeota (Av. Santos Dumont) | 46 | 57 |
| Papicu (terminal) | 47 | 55 |
| Iguatemi | 57 | 38 |
| Unifor | 71 | 15 · atenção |
| Centro de Eventos | 66 | 23 · atenção |
| Parangaba (terminal) | 46 | 57 |
| Messejana (terminal) | 59 | 35 |
| UFC Benfica | 33 | 78 · motivo |
| UFC Pici | 46 | 57 |
| Aeroporto | 63 | 28 · atenção |

### Onde ganha pontos

- **Deslocamento (peso 4):** vira motivo para quem vai todo dia a Centro (25 min), Beira-Mar (35 min) e UFC Benfica (35 min).
- **Lazer (peso 2):** conta para quem pede piscina, academia, playground, festas e churrasco e área verde.
- **Bairro (peso 1,5 cada tema escolhido):** forte em escolas (86), praças e parques (79) e ônibus fácil (93): vira motivo.
- **Mobilidade (peso 1,5, quem anda de ônibus e não tem destino fixo):** nota 93, vira motivo.
- **Família com crianças (peso 1):** tem playground; escolas do bairro 86 → nota 93 (só 100 se a pessoa também escolheu "Escolas" na pergunta 6, porque aí as escolas já contam lá).
- **Orçamento (peso 5):** atende faixa 2 do MCMV: quem tem essa renda recebe subsídio e juros menores na conta.

### Onde perde pontos

- **Deslocamento (peso 4):** mais de 62 min até Unifor, Centro de Eventos e Aeroporto: nota abaixo de 30 e ponto de atenção.
- **Vaga (peso 2,5, quem vai de carro):** só 21% dos apartamentos têm vaga (menos de 0,5 por unidade): nota 21 **e** a nota final é multiplicada por 0,85; aviso "Vagas limitadas".
- **Lazer (peso 2):** não pontua para quem pede quadra ou jogos (a nota é a fração dos itens pedidos que o condomínio tem).
- **Bairro (peso 1,5 cada tema escolhido):** nota baixa em saúde por perto (39).
- **Casal (peso 1):** sem suíte → nota 40.
- **Prazo:** lançamento → nota 40 para quem quer mudar "o quanto antes" (peso 1,5) e 80 para "em 1 a 2 anos" (peso 0,5).
- **Orçamento (peso 5):** quem é da faixa 1 não usa as condições do MCMV aqui (a conta usa juros de mercado e não há subsídio).

### Observações

- Desempate (nota e tempo iguais): 7 itens de lazer na página oficial, 7º entre os 16.
- Tem pet place: o motivo "Pet place para o seu bicho" é verdadeiro aqui (o quiz hoje mostra esse motivo sem checar; ver auditoria).

### Orçamento no quiz (cabe / limite / acima, sem preço)

Ver a nota sobre os valores usados na conta no início desta ficha.

| Renda \ Entrada | Por enquanto, nada | Até R$ 10 mil | De R$ 10 mil a R$ 30 mil | De R$ 30 mil a R$ 60 mil | Mais de R$ 60 mil |
| --- | :-: | :-: | :-: | :-: | :-: |
| Até R$ 2.850 | acima | acima | acima | acima | acima |
| De R$ 2.850 a R$ 4.700 | acima | acima | limite | limite | cabe |
| De R$ 4.700 a R$ 8.600 | cabe | cabe | cabe | cabe | cabe |
| De R$ 8.600 a R$ 12.000 | cabe | cabe | cabe | cabe | cabe |
| Mais de R$ 12.000 | cabe | cabe | cabe | cabe | cabe |

## 3. Ville de Lisboa

- **Onde:** Parque Albano, Caucaia · região Caucaia
- **Status (prazo):** Lançamento
- **Planta:** 2 quartos · suíte: não · varanda: sim · área: 41,4 a 45,4 m²
- **Vagas:** 109 vagas para 300 apartamentos = **0,36 vaga por apartamento**
- **Minha Casa Minha Vida:** atende as faixas 1 e 2 (preço de tabela: uso interno, não aparece aqui)
- **Página oficial:** https://www.mrv.com.br/imoveis/ceara/caucaia/apartamentos-ville-de-lisboa (extraída em 2026-10-05)

### Lazer do condomínio

Itens de lazer na página oficial: Playground, Espaço Piquenique, Piscina Adulto, Pet Place, Churrasqueira, Playbaby, Happy Hour, Futmesa, Espaço funcional ao ar livre, Piscina Infantil, Espaço Zen, Pista de Caminhada.

| Grupo do quiz | O quiz usa hoje | Conferência à mão | Fonte | Trecho |
| --- | :-: | --- | --- | --- |
| Piscina | ✔ | automático (lista oficial) | — | — |
| Academia | ✖ | ✖ não tem · em 2026-10-08 | lista oficial (data/raw/mrv/03.json) + legenda da implantação oficial (foto 03-19, item 8 'Funcional') + decisão do time MRV de 07/10/2026 (funcional não é academia) | Espaço Funcional Descoberto |
| Playground | ✔ | ✔ tem · em 2026-10-08 | lista oficial (data/raw/mrv/03.json: 'Playground' como 'Diferenciais de Card', 'Playbaby' sem tipo) + legenda da implantação oficial (foto 03-19, itens 1 'Playground' e 2 'Playbaby') + foto 03-11 | O lazer do seu novo endereço conta com piscinas adulto e infantil, churrasqueiras, espaço funcional, playground, playbaby |
| Festas e churrasco | ✔ | automático (lista oficial) | — | — |
| Quadra ou jogos | ✔ | automático (lista oficial) | — | — |
| Área verde | ✔ | automático (lista oficial) | — | — |
| Pet place | ✔ | automático (lista oficial) | — | — |

> **Obs.** Playground: Antes ficava fora porque o build só olhava itens do tipo 'Diferenciais de Lazer'.
>

### Notas do bairro (posição entre os 121 bairros de Fortaleza, 0 a 100)

Sem notas: Caucaia não está na base dos 121 bairros de Fortaleza. Para este empreendimento os critérios de bairro (pergunta 6), a parte de escolas do critério "família com crianças" e a mobilidade do bairro **saem da conta**, e o peso vai para os outros critérios.

### Tempo até os lugares mais procurados

Estimativa pela distância em linha reta (Caucaia não tem tabela de ônibus); erro típico de 11 min.

| Destino | Minutos | Nota no quiz |
| --- | :-: | :-: |
| Centro (Praça do Ferreira) | 68 (est.) | 20 · atenção |
| Beira-Mar | 83 (est.) | 0 · atenção |
| Aldeota (Av. Santos Dumont) | 80 (est.) | 0 · atenção |
| Papicu (terminal) | 88 (est.) | 0 · atenção |
| Iguatemi | 86 (est.) | 0 · atenção |
| Unifor | 92 (est.) | 0 · atenção |
| Centro de Eventos | 91 (est.) | 0 · atenção |
| Parangaba (terminal) | 53 (est.) | 45 |
| Messejana (terminal) | 94 (est.) | 0 · atenção |
| UFC Benfica | 61 (est.) | 32 |
| UFC Pici | 43 (est.) | 62 |
| Aeroporto | 67 (est.) | 22 · atenção |

### Onde ganha pontos

- **Lazer (peso 2):** conta para quem pede piscina, playground, festas e churrasco, quadra ou jogos e área verde.
- **Sem dado de bairro:** quem escolhe temas na pergunta 6 (ou anda de ônibus sem destino fixo) não tem esses critérios contados aqui, então eles **não puxam a nota para baixo**. Ver a auditoria: isso pode pôr este empreendimento à frente de bairros com notas reais.
- **Família com crianças (peso 1):** tem playground → nota 100.
- **Orçamento (peso 5):** atende faixas 1 e 2 do MCMV: quem tem essa renda recebe subsídio e juros menores na conta.

### Onde perde pontos

- **Deslocamento (peso 4):** mais de 62 min até Centro, Beira-Mar, Aldeota, Papicu, Iguatemi, Unifor, Centro de Eventos, Messejana e Aeroporto: nota abaixo de 30 e ponto de atenção.
- **Tempo é estimativa** (distância em linha reta, erro típico de 11 min), mas entra na nota com o mesmo peso de um tempo medido. A tela avisa "(estimativa)".
- **Vaga (peso 2,5, quem vai de carro):** só 36% dos apartamentos têm vaga (menos de 0,5 por unidade): nota 36 **e** a nota final é multiplicada por 0,85; aviso "Vagas limitadas".
- **Lazer (peso 2):** não pontua para quem pede academia (a nota é a fração dos itens pedidos que o condomínio tem).
- **Casal (peso 1):** sem suíte → nota 40.
- **Prazo:** lançamento → nota 40 para quem quer mudar "o quanto antes" (peso 1,5) e 80 para "em 1 a 2 anos" (peso 0,5).

### Observações

- Mesmo bairro de Ville de Porto: pela regra de diversidade, só um deles entra no top 5, a não ser que o segundo esteja 5 pontos ou mais à frente do próximo de outro bairro.
- Desempate (nota e tempo iguais): 12 itens de lazer na página oficial, 2º entre os 16.
- Tem pet place: o motivo "Pet place para o seu bicho" é verdadeiro aqui (o quiz hoje mostra esse motivo sem checar; ver auditoria).

### Orçamento no quiz (cabe / limite / acima, sem preço)

Ver a nota sobre os valores usados na conta no início desta ficha.

| Renda \ Entrada | Por enquanto, nada | Até R$ 10 mil | De R$ 10 mil a R$ 30 mil | De R$ 30 mil a R$ 60 mil | Mais de R$ 60 mil |
| --- | :-: | :-: | :-: | :-: | :-: |
| Até R$ 2.850 | acima | acima | limite | limite | cabe |
| De R$ 2.850 a R$ 4.700 | limite | limite | limite | cabe | cabe |
| De R$ 4.700 a R$ 8.600 | cabe | cabe | cabe | cabe | cabe |
| De R$ 8.600 a R$ 12.000 | cabe | cabe | cabe | cabe | cabe |
| Mais de R$ 12.000 | cabe | cabe | cabe | cabe | cabe |

## 4. Reserva da Lagoa

- **Onde:** Passaré, Fortaleza · região Sul
- **Status (prazo):** Em construção
- **Planta:** 2 quartos · suíte: não · varanda: não informado · área: 36,88 m²
- **Vagas:** 299 vagas para 372 apartamentos = **0,8 vaga por apartamento**
- **Minha Casa Minha Vida:** atende as faixas 2 e 3 · o site oficial não mostra o selo MCMV (preço de tabela: uso interno, não aparece aqui)
- **Página oficial:** https://www.mrv.com.br/imoveis/ceara/fortaleza/apartamentos-reserva-da-lagoa (extraída em 2026-10-05)

### Lazer do condomínio

Itens de lazer na página oficial: Espaço Gourmet, Pet Place, Piscina Adulto, Piscina Infantil, Playground, Salão de Festas com Copa.

| Grupo do quiz | O quiz usa hoje | Conferência à mão | Fonte | Trecho |
| --- | :-: | --- | --- | --- |
| Piscina | ✔ | automático (lista oficial) | — | — |
| Academia | ✖ | automático (lista oficial) | — | — |
| Playground | ✔ | automático (lista oficial) | — | — |
| Festas e churrasco | ✔ | automático (lista oficial) | — | — |
| Quadra ou jogos | ✖ | automático (lista oficial) | — | — |
| Área verde | ✖ | automático (lista oficial) | — | — |
| Pet place | ✔ | automático (lista oficial) | — | — |

> Nenhuma correção em data/curated/lazer.json: vale a lista de lazer da página oficial.

### Notas do bairro (posição entre os 121 bairros de Fortaleza, 0 a 100)

| Tema (pergunta 6) | Nota | Leitura |
| --- | :-: | --- |
| Saúde por perto | 57 | média |
| Escolas | 10 | baixa: puxa a nota para baixo |
| Comércio do dia a dia | 23 | baixa: puxa a nota para baixo |
| Praças e parques | 57 | média |
| Ônibus fácil | 55 | média |

### Tempo até os lugares mais procurados

Mediana da tabela de ônibus e metrô (GTFS ETUFOR/Metrofor), dia útil, saída 6h30–8h, sem trânsito.

| Destino | Minutos | Nota no quiz |
| --- | :-: | :-: |
| Centro (Praça do Ferreira) | 63 | 28 · atenção |
| Beira-Mar | 70 | 17 · atenção |
| Aldeota (Av. Santos Dumont) | 54 | 43 |
| Papicu (terminal) | 63 | 28 · atenção |
| Iguatemi | 64 | 27 · atenção |
| Unifor | 62 | 30 |
| Centro de Eventos | 64 | 27 · atenção |
| Parangaba (terminal) | 43 | 62 |
| Messejana (terminal) | 40 | 67 |
| UFC Benfica | 66 | 23 · atenção |
| UFC Pici | 88 | 0 · atenção |
| Aeroporto | 77 | 5 · atenção |

### Onde ganha pontos

- **Vaga (peso 2,5, quem vai de carro):** nota 80, motivo "Vagas para 80% dos apartamentos".
- **Lazer (peso 2):** conta para quem pede piscina, playground e festas e churrasco.
- **Família com crianças (peso 1):** tem playground; escolas do bairro 10 → nota 55 (só 100 se a pessoa também escolheu "Escolas" na pergunta 6, porque aí as escolas já contam lá).
- **Prazo:** em construção → nota 100 para quem quer mudar logo (peso 1,5) ou em 1 a 2 anos (peso 0,5).
- **Orçamento (peso 5):** atende faixa 2 do MCMV: quem tem essa renda recebe subsídio e juros menores na conta.

### Onde perde pontos

- **Deslocamento (peso 4):** mais de 62 min até Centro, Beira-Mar, Papicu, Iguatemi, Centro de Eventos, UFC Benfica, UFC Pici e Aeroporto: nota abaixo de 30 e ponto de atenção.
- **Lazer (peso 2):** não pontua para quem pede academia, quadra ou jogos e área verde (a nota é a fração dos itens pedidos que o condomínio tem).
- **Bairro (peso 1,5 cada tema escolhido):** nota baixa em escolas (10) e comércio do dia a dia (23).
- **Mobilidade (peso 1,5, quem anda de ônibus e não tem destino fixo):** nota 55.
- **Casal (peso 1):** sem suíte → nota 40.
- **Orçamento (peso 5):** quem é da faixa 1 não usa as condições do MCMV aqui (a conta usa juros de mercado e não há subsídio).

### Observações

- Desempate (nota e tempo iguais): 6 itens de lazer na página oficial, 14º entre os 16.
- Tem pet place: o motivo "Pet place para o seu bicho" é verdadeiro aqui (o quiz hoje mostra esse motivo sem checar; ver auditoria).

### Orçamento no quiz (cabe / limite / acima, sem preço)

Ver a nota sobre os valores usados na conta no início desta ficha.

| Renda \ Entrada | Por enquanto, nada | Até R$ 10 mil | De R$ 10 mil a R$ 30 mil | De R$ 30 mil a R$ 60 mil | Mais de R$ 60 mil |
| --- | :-: | :-: | :-: | :-: | :-: |
| Até R$ 2.850 | acima | acima | acima | acima | acima |
| De R$ 2.850 a R$ 4.700 | acima | acima | acima | limite | limite |
| De R$ 4.700 a R$ 8.600 | cabe | cabe | cabe | cabe | cabe |
| De R$ 8.600 a R$ 12.000 | cabe | cabe | cabe | cabe | cabe |
| Mais de R$ 12.000 | cabe | cabe | cabe | cabe | cabe |

## 5. Residencial La Serena

- **Onde:** Jangurussu, Fortaleza · região Sul
- **Status (prazo):** Lançamento
- **Planta:** 2 quartos · suíte: não · varanda: não informado · área: 38,4 m²
- **Vagas:** 85 vagas para 240 apartamentos = **0,35 vaga por apartamento**
- **Minha Casa Minha Vida:** atende as faixas 1 e 2 (preço de tabela: uso interno, não aparece aqui)
- **Página oficial:** https://www.mrv.com.br/imoveis/ceara/fortaleza/apartamentos-residencial-la-serena (extraída em 2026-10-05)

### Lazer do condomínio

Itens de lazer na página oficial: Churrasqueira, Pet Place, Piscina Adulto, Piscina com Deck, Piscina Infantil, Pista de Caminhada, Playground.

| Grupo do quiz | O quiz usa hoje | Conferência à mão | Fonte | Trecho |
| --- | :-: | --- | --- | --- |
| Piscina | ✔ | automático (lista oficial) | — | — |
| Academia | ✖ | automático (lista oficial) | — | — |
| Playground | ✔ | automático (lista oficial) | — | — |
| Festas e churrasco | ✔ | automático (lista oficial) | — | — |
| Quadra ou jogos | ✖ | automático (lista oficial) | — | — |
| Área verde | ✔ | automático (lista oficial) | — | — |
| Pet place | ✔ | automático (lista oficial) | — | — |

> Nenhuma correção em data/curated/lazer.json: vale a lista de lazer da página oficial.

### Notas do bairro (posição entre os 121 bairros de Fortaleza, 0 a 100)

| Tema (pergunta 6) | Nota | Leitura |
| --- | :-: | --- |
| Saúde por perto | 35 | baixa: puxa a nota para baixo |
| Escolas | 58 | média |
| Comércio do dia a dia | 8 | baixa: puxa a nota para baixo |
| Praças e parques | 17 | baixa: puxa a nota para baixo |
| Ônibus fácil | 13 | baixa: puxa a nota para baixo |

### Tempo até os lugares mais procurados

Mediana da tabela de ônibus e metrô (GTFS ETUFOR/Metrofor), dia útil, saída 6h30–8h, sem trânsito.

| Destino | Minutos | Nota no quiz |
| --- | :-: | :-: |
| Centro (Praça do Ferreira) | 75 | 8 · atenção |
| Beira-Mar | 94 | 0 · atenção |
| Aldeota (Av. Santos Dumont) | 82 | 0 · atenção |
| Papicu (terminal) | 80 | 0 · atenção |
| Iguatemi | 71 | 15 · atenção |
| Unifor | 72 | 13 · atenção |
| Centro de Eventos | 68 | 20 · atenção |
| Parangaba (terminal) | 66 | 23 · atenção |
| Messejana (terminal) | 28 | 87 · motivo |
| UFC Benfica | 79 | 2 · atenção |
| UFC Pici | 103 | 0 · atenção |
| Aeroporto | 94 | 0 · atenção |

### Onde ganha pontos

- **Deslocamento (peso 4):** vira motivo para quem vai todo dia a Messejana (30 min).
- **Lazer (peso 2):** conta para quem pede piscina, playground, festas e churrasco e área verde.
- **Família com crianças (peso 1):** tem playground; escolas do bairro 58 → nota 79 (só 100 se a pessoa também escolheu "Escolas" na pergunta 6, porque aí as escolas já contam lá).
- **Orçamento (peso 5):** atende faixas 1 e 2 do MCMV: quem tem essa renda recebe subsídio e juros menores na conta.

### Onde perde pontos

- **Deslocamento (peso 4):** mais de 62 min até Centro, Beira-Mar, Aldeota, Papicu, Iguatemi, Unifor, Centro de Eventos, Parangaba, UFC Benfica, UFC Pici e Aeroporto: nota abaixo de 30 e ponto de atenção.
- **Vaga (peso 2,5, quem vai de carro):** só 35% dos apartamentos têm vaga (menos de 0,5 por unidade): nota 35 **e** a nota final é multiplicada por 0,85; aviso "Vagas limitadas".
- **Lazer (peso 2):** não pontua para quem pede academia e quadra ou jogos (a nota é a fração dos itens pedidos que o condomínio tem).
- **Bairro (peso 1,5 cada tema escolhido):** nota baixa em saúde por perto (35), comércio do dia a dia (8), praças e parques (17) e ônibus fácil (13).
- **Mobilidade (peso 1,5, quem anda de ônibus e não tem destino fixo):** nota 13.
- **Casal (peso 1):** sem suíte → nota 40.
- **Prazo:** lançamento → nota 40 para quem quer mudar "o quanto antes" (peso 1,5) e 80 para "em 1 a 2 anos" (peso 0,5).

### Observações

- Mesmo bairro de Residencial Valparaíso: pela regra de diversidade, só um deles entra no top 5, a não ser que o segundo esteja 5 pontos ou mais à frente do próximo de outro bairro.
- Desempate (nota e tempo iguais): 7 itens de lazer na página oficial, 7º entre os 16.
- Tem pet place: o motivo "Pet place para o seu bicho" é verdadeiro aqui (o quiz hoje mostra esse motivo sem checar; ver auditoria).

### Orçamento no quiz (cabe / limite / acima, sem preço)

Ver a nota sobre os valores usados na conta no início desta ficha.

| Renda \ Entrada | Por enquanto, nada | Até R$ 10 mil | De R$ 10 mil a R$ 30 mil | De R$ 30 mil a R$ 60 mil | Mais de R$ 60 mil |
| --- | :-: | :-: | :-: | :-: | :-: |
| Até R$ 2.850 | acima | limite | limite | cabe | cabe |
| De R$ 2.850 a R$ 4.700 | limite | limite | limite | cabe | cabe |
| De R$ 4.700 a R$ 8.600 | cabe | cabe | cabe | cabe | cabe |
| De R$ 8.600 a R$ 12.000 | cabe | cabe | cabe | cabe | cabe |
| Mais de R$ 12.000 | cabe | cabe | cabe | cabe | cabe |

## 6. Forte Alencar

- **Onde:** Cambeba, Fortaleza · região Sul
- **Status (prazo):** Lançamento
- **Planta:** 2 quartos · suíte: tem opção · varanda: sim · área: 43,34 a 45,14 m²
- **Vagas:** 505 vagas para 492 apartamentos = **1,03 vaga por apartamento**
- **Minha Casa Minha Vida:** atende a faixa 3 (preço de tabela: uso interno, não aparece aqui)
- **Página oficial:** https://www.mrv.com.br/imoveis/ceara/fortaleza/apartamentos-forte-alencar (extraída em 2026-10-05)

### Lazer do condomínio

Itens de lazer na página oficial: Espaço Gourmet, Espaço Kids, Pet Place, Piscina Adulto, Piscina Infantil, Playground, Salão de Festas com Copa, Espaço Piquenique, Academia.

| Grupo do quiz | O quiz usa hoje | Conferência à mão | Fonte | Trecho |
| --- | :-: | --- | --- | --- |
| Piscina | ✔ | automático (lista oficial) | — | — |
| Academia | ✔ | ✔ tem · **pendente** · em 2026-10-08 | site oficial MRV, informado pelo usuário (time MRV) em 07/10/2026 | "dentro do site já fala que tem academia" |
| Playground | ✔ | automático (lista oficial) | — | — |
| Festas e churrasco | ✔ | automático (lista oficial) | — | — |
| Quadra ou jogos | ✖ | automático (lista oficial) | — | — |
| Área verde | ✔ | automático (lista oficial) | — | — |
| Pet place | ✔ | automático (lista oficial) | — | — |

> **Obs.** Academia: NÃO confirmado na conferência: a lista oficial extraída em 05/10/2026 (06.json), a legenda da implantação oficial (foto 06-05, 19 itens) e as buscas na web de 08/10/2026 não citam academia; 'academias' só aparece no 'Próximo a' (entorno). Reconferir na página oficial assim que o acesso ao site for liberado (formato novo: /imoveis/apartamentos/ceara/fortaleza/cajazeiras/forte-alencar).
>
> **Item acrescentado à mão:** Academia (grupo academia) · fonte: site oficial MRV, informado pelo usuário (time MRV) em 07/10/2026 · em 2026-10-08 · **pendente**
>

### Notas do bairro (posição entre os 121 bairros de Fortaleza, 0 a 100)

| Tema (pergunta 6) | Nota | Leitura |
| --- | :-: | --- |
| Saúde por perto | 70 | entre os 30%: vira motivo |
| Escolas | 4 | baixa: puxa a nota para baixo |
| Comércio do dia a dia | 40 | média |
| Praças e parques | 74 | entre os 30%: vira motivo |
| Ônibus fácil | 50 | média |

### Tempo até os lugares mais procurados

Mediana da tabela de ônibus e metrô (GTFS ETUFOR/Metrofor), dia útil, saída 6h30–8h, sem trânsito.

| Destino | Minutos | Nota no quiz |
| --- | :-: | :-: |
| Centro (Praça do Ferreira) | 71 | 15 · atenção |
| Beira-Mar | 75 | 8 · atenção |
| Aldeota (Av. Santos Dumont) | 62 | 30 |
| Papicu (terminal) | 53 | 45 |
| Iguatemi | 43 | 62 |
| Unifor | 44 | 60 |
| Centro de Eventos | 40 | 67 |
| Parangaba (terminal) | 71 | 15 · atenção |
| Messejana (terminal) | 33 | 78 · motivo |
| UFC Benfica | 72 | 13 · atenção |
| UFC Pici | 98 | 0 · atenção |
| Aeroporto | 93 | 0 · atenção |

### Onde ganha pontos

- **Deslocamento (peso 4):** vira motivo para quem vai todo dia a Messejana (35 min).
- **Vaga (peso 2,5, quem vai de carro):** nota 100, motivo "Uma vaga de garagem por apartamento".
- **Lazer (peso 2):** conta para quem pede piscina, academia, playground, festas e churrasco e área verde.
- **Bairro (peso 1,5 cada tema escolhido):** forte em saúde por perto (70) e praças e parques (74): vira motivo.
- **Família com crianças (peso 1):** tem playground; escolas do bairro 4 → nota 52 (só 100 se a pessoa também escolheu "Escolas" na pergunta 6, porque aí as escolas já contam lá).
- **Casal (peso 1):** tem opção com suíte → nota 100.

### Onde perde pontos

- **Deslocamento (peso 4):** mais de 62 min até Centro, Beira-Mar, Parangaba, UFC Benfica, UFC Pici e Aeroporto: nota abaixo de 30 e ponto de atenção.
- **Lazer (peso 2):** não pontua para quem pede quadra ou jogos (a nota é a fração dos itens pedidos que o condomínio tem).
- **Bairro (peso 1,5 cada tema escolhido):** nota baixa em escolas (4).
- **Mobilidade (peso 1,5, quem anda de ônibus e não tem destino fixo):** nota 50.
- **Prazo:** lançamento → nota 40 para quem quer mudar "o quanto antes" (peso 1,5) e 80 para "em 1 a 2 anos" (peso 0,5).
- **Orçamento (peso 5):** quem é das faixas 1 e 2 não usa as condições do MCMV aqui (a conta usa juros de mercado e não há subsídio).

### Observações

- Desempate (nota e tempo iguais): 9 itens de lazer na página oficial, 3º entre os 16.
- Tem pet place: o motivo "Pet place para o seu bicho" é verdadeiro aqui (o quiz hoje mostra esse motivo sem checar; ver auditoria).

### Orçamento no quiz (cabe / limite / acima, sem preço)

Ver a nota sobre os valores usados na conta no início desta ficha.

| Renda \ Entrada | Por enquanto, nada | Até R$ 10 mil | De R$ 10 mil a R$ 30 mil | De R$ 30 mil a R$ 60 mil | Mais de R$ 60 mil |
| --- | :-: | :-: | :-: | :-: | :-: |
| Até R$ 2.850 | acima | acima | acima | acima | acima |
| De R$ 2.850 a R$ 4.700 | acima | acima | acima | acima | acima |
| De R$ 4.700 a R$ 8.600 | cabe | cabe | cabe | cabe | cabe |
| De R$ 8.600 a R$ 12.000 | cabe | cabe | cabe | cabe | cabe |
| Mais de R$ 12.000 | cabe | cabe | cabe | cabe | cabe |

## 7. Parque Marista

- **Onde:** Centro, Fortaleza · região Oeste e Centro
- **Status (prazo):** Lançamento
- **Planta:** 2 quartos · suíte: não · varanda: não informado · área: 38,8 a 40,44 m²
- **Vagas:** 170 vagas para 576 apartamentos = **0,3 vaga por apartamento**
- **Minha Casa Minha Vida:** atende as faixas 2 e 3 (preço de tabela: uso interno, não aparece aqui)
- **Página oficial:** https://www.mrv.com.br/imoveis/ceara/fortaleza/apartamentos-parque-marista (extraída em 2026-10-05)

### Lazer do condomínio

Itens de lazer na página oficial: Academia Coberta, Churrasqueira, Espaço Piquenique, Salão de Jogos, Salão de Festas com Copa, Quadra Recreativa, Playground, Piscina Infantil, Piscina com Deck, Pet Place, Espaço Kids, Happy Hour, Playbaby, Espaço Zen, Espaço Pizza, Mini Quadra, Pet Care, Pista de Caminhada.

| Grupo do quiz | O quiz usa hoje | Conferência à mão | Fonte | Trecho |
| --- | :-: | --- | --- | --- |
| Piscina | ✔ | automático (lista oficial) | — | — |
| Academia | ✔ | automático (lista oficial) | — | — |
| Playground | ✔ | automático (lista oficial) | — | — |
| Festas e churrasco | ✔ | automático (lista oficial) | — | — |
| Quadra ou jogos | ✔ | automático (lista oficial) | — | — |
| Área verde | ✔ | automático (lista oficial) | — | — |
| Pet place | ✔ | automático (lista oficial) | — | — |

### Notas do bairro (posição entre os 121 bairros de Fortaleza, 0 a 100)

| Tema (pergunta 6) | Nota | Leitura |
| --- | :-: | --- |
| Saúde por perto | 90 | entre os 10%: vira motivo |
| Escolas | 95 | entre os 5%: vira motivo |
| Comércio do dia a dia | 88 | entre os 15%: vira motivo |
| Praças e parques | 90 | entre os 10%: vira motivo |
| Ônibus fácil | 95 | entre os 5%: vira motivo |

### Tempo até os lugares mais procurados

Mediana da tabela de ônibus e metrô (GTFS ETUFOR/Metrofor), dia útil, saída 6h30–8h, sem trânsito.

| Destino | Minutos | Nota no quiz |
| --- | :-: | :-: |
| Centro (Praça do Ferreira) | 3 | 100 · motivo |
| Beira-Mar | 35 | 75 · motivo |
| Aldeota (Av. Santos Dumont) | 34 | 77 · motivo |
| Papicu (terminal) | 41 | 65 |
| Iguatemi | 44 | 60 |
| Unifor | 58 | 37 |
| Centro de Eventos | 52 | 47 |
| Parangaba (terminal) | 45 | 58 |
| Messejana (terminal) | 41 | 65 |
| UFC Benfica | 30 | 83 · motivo |
| UFC Pici | 50 | 50 |
| Aeroporto | 58 | 37 |

### Onde ganha pontos

- **Deslocamento (peso 4):** vira motivo para quem vai todo dia a Centro (5 min), Beira-Mar (35 min), Aldeota (35 min) e UFC Benfica (30 min).
- **Lazer (peso 2):** conta para quem pede piscina, academia, playground, festas e churrasco, quadra ou jogos e área verde.
- **Bairro (peso 1,5 cada tema escolhido):** forte em saúde por perto (90), escolas (95), comércio do dia a dia (88), praças e parques (90) e ônibus fácil (95): vira motivo.
- **Mobilidade (peso 1,5, quem anda de ônibus e não tem destino fixo):** nota 95, vira motivo.
- **Família com crianças (peso 1):** tem playground; escolas do bairro 95 → nota 97,5 (só 100 se a pessoa também escolheu "Escolas" na pergunta 6, porque aí as escolas já contam lá).
- **Orçamento (peso 5):** atende faixa 2 do MCMV: quem tem essa renda recebe subsídio e juros menores na conta.

### Onde perde pontos

- **Vaga (peso 2,5, quem vai de carro):** só 30% dos apartamentos têm vaga (menos de 0,5 por unidade): nota 30 **e** a nota final é multiplicada por 0,85; aviso "Vagas limitadas".
- **Casal (peso 1):** sem suíte → nota 40.
- **Prazo:** lançamento → nota 40 para quem quer mudar "o quanto antes" (peso 1,5) e 80 para "em 1 a 2 anos" (peso 0,5).
- **Orçamento (peso 5):** quem é da faixa 1 não usa as condições do MCMV aqui (a conta usa juros de mercado e não há subsídio).

### Observações

- Desempate (nota e tempo iguais): 18 itens de lazer na página oficial, 1º entre os 16.
- Tem pet place: o motivo "Pet place para o seu bicho" é verdadeiro aqui (o quiz hoje mostra esse motivo sem checar; ver auditoria).

### Orçamento no quiz (cabe / limite / acima, sem preço)

Ver a nota sobre os valores usados na conta no início desta ficha.

| Renda \ Entrada | Por enquanto, nada | Até R$ 10 mil | De R$ 10 mil a R$ 30 mil | De R$ 30 mil a R$ 60 mil | Mais de R$ 60 mil |
| --- | :-: | :-: | :-: | :-: | :-: |
| Até R$ 2.850 | acima | acima | acima | acima | acima |
| De R$ 2.850 a R$ 4.700 | acima | acima | acima | limite | limite |
| De R$ 4.700 a R$ 8.600 | cabe | cabe | cabe | cabe | cabe |
| De R$ 8.600 a R$ 12.000 | cabe | cabe | cabe | cabe | cabe |
| Mais de R$ 12.000 | cabe | cabe | cabe | cabe | cabe |

## 8. Residencial Farol do Atlântico

- **Onde:** Cocó, Fortaleza · região Leste
- **Status (prazo):** Lançamento
- **Planta:** 2 quartos · suíte: tem opção · varanda: sim · área: 43,34 a 45,14 m²
- **Vagas:** 218 vagas para 204 apartamentos = **1,07 vaga por apartamento**
- **Minha Casa Minha Vida:** atende a faixa 3 (preço de tabela: uso interno, não aparece aqui)
- **Página oficial:** https://www.mrv.com.br/imoveis/ceara/fortaleza/apartamentos-residencial-farol-do-atlantico (extraída em 2026-10-05)

### Lazer do condomínio

Itens de lazer na página oficial: Academia Coberta, Espaço funcional ao ar livre, Espaço Gourmet, Pet Place, Piscina Adulto, Piscina Infantil, Playground.

| Grupo do quiz | O quiz usa hoje | Conferência à mão | Fonte | Trecho |
| --- | :-: | --- | --- | --- |
| Piscina | ✔ | automático (lista oficial) | — | — |
| Academia | ✔ | ✔ tem · em 2026-10-08 | lista oficial (data/raw/mrv/08.json: 'Academia Coberta') + legenda da implantação oficial (foto 08-17, item 12 'Academia Coberta') + descrição oficial | o Farol do Atlântico conta com uma academia coberta e espaço crossfit |
| Playground | ✔ | automático (lista oficial) | — | — |
| Festas e churrasco | ✔ | automático (lista oficial) | — | — |
| Quadra ou jogos | ✖ | automático (lista oficial) | — | — |
| Área verde | ✖ | automático (lista oficial) | — | — |
| Pet place | ✔ | automático (lista oficial) | — | — |

### Notas do bairro (posição entre os 121 bairros de Fortaleza, 0 a 100)

| Tema (pergunta 6) | Nota | Leitura |
| --- | :-: | --- |
| Saúde por perto | 79 | entre os 25%: vira motivo |
| Escolas | 16 | baixa: puxa a nota para baixo |
| Comércio do dia a dia | 62 | média |
| Praças e parques | 96 | entre os 5%: vira motivo |
| Ônibus fácil | 40 | média |

### Tempo até os lugares mais procurados

Mediana da tabela de ônibus e metrô (GTFS ETUFOR/Metrofor), dia útil, saída 6h30–8h, sem trânsito.

| Destino | Minutos | Nota no quiz |
| --- | :-: | :-: |
| Centro (Praça do Ferreira) | 50 | 50 |
| Beira-Mar | 40 | 67 |
| Aldeota (Av. Santos Dumont) | 34 | 77 · motivo |
| Papicu (terminal) | 17 | 100 · motivo |
| Iguatemi | 28 | 87 · motivo |
| Unifor | 35 | 75 · motivo |
| Centro de Eventos | 29 | 85 · motivo |
| Parangaba (terminal) | 61 | 32 |
| Messejana (terminal) | 55 | 42 |
| UFC Benfica | 54 | 43 |
| UFC Pici | 75 | 8 · atenção |
| Aeroporto | 77 | 5 · atenção |

### Onde ganha pontos

- **Deslocamento (peso 4):** vira motivo para quem vai todo dia a Aldeota (35 min), Papicu (15 min), Iguatemi (30 min), Unifor (35 min) e Centro de Eventos (30 min).
- **Vaga (peso 2,5, quem vai de carro):** nota 100, motivo "Uma vaga de garagem por apartamento".
- **Lazer (peso 2):** conta para quem pede piscina, academia, playground e festas e churrasco.
- **Bairro (peso 1,5 cada tema escolhido):** forte em saúde por perto (79) e praças e parques (96): vira motivo.
- **Família com crianças (peso 1):** tem playground; escolas do bairro 16 → nota 58 (só 100 se a pessoa também escolheu "Escolas" na pergunta 6, porque aí as escolas já contam lá).
- **Casal (peso 1):** tem opção com suíte → nota 100.

### Onde perde pontos

- **Deslocamento (peso 4):** mais de 62 min até UFC Pici e Aeroporto: nota abaixo de 30 e ponto de atenção.
- **Lazer (peso 2):** não pontua para quem pede quadra ou jogos e área verde (a nota é a fração dos itens pedidos que o condomínio tem).
- **Bairro (peso 1,5 cada tema escolhido):** nota baixa em escolas (16).
- **Mobilidade (peso 1,5, quem anda de ônibus e não tem destino fixo):** nota 40.
- **Prazo:** lançamento → nota 40 para quem quer mudar "o quanto antes" (peso 1,5) e 80 para "em 1 a 2 anos" (peso 0,5).
- **Orçamento (peso 5):** quem é das faixas 1 e 2 não usa as condições do MCMV aqui (a conta usa juros de mercado e não há subsídio).

### Observações

- Mesmo bairro de Sensia Reserva Vila do Sol e Reserva Brisa do Mar: pela regra de diversidade, só um deles entra no top 5, a não ser que o segundo esteja 5 pontos ou mais à frente do próximo de outro bairro.
- Desempate (nota e tempo iguais): 7 itens de lazer na página oficial, 7º entre os 16.
- Tem pet place: o motivo "Pet place para o seu bicho" é verdadeiro aqui (o quiz hoje mostra esse motivo sem checar; ver auditoria).

### Orçamento no quiz (cabe / limite / acima, sem preço)

Ver a nota sobre os valores usados na conta no início desta ficha.

| Renda \ Entrada | Por enquanto, nada | Até R$ 10 mil | De R$ 10 mil a R$ 30 mil | De R$ 30 mil a R$ 60 mil | Mais de R$ 60 mil |
| --- | :-: | :-: | :-: | :-: | :-: |
| Até R$ 2.850 | acima | acima | acima | acima | acima |
| De R$ 2.850 a R$ 4.700 | acima | acima | acima | acima | acima |
| De R$ 4.700 a R$ 8.600 | limite | limite | limite | limite | cabe |
| De R$ 8.600 a R$ 12.000 | cabe | cabe | cabe | cabe | cabe |
| Mais de R$ 12.000 | cabe | cabe | cabe | cabe | cabe |

## 9. Sensia Reserva Vila do Sol

- **Onde:** Cocó, Fortaleza · região Leste · localização aproximada (centro do bairro)
- **Status (prazo):** Em construção
- **Planta:** 2 quartos · suíte: tem opção · varanda: sim · área: 54,58 m²
- **Vagas:** 293 vagas para 264 apartamentos = **1,11 vaga por apartamento**
- **Minha Casa Minha Vida:** atende a faixa 4 · o site oficial não mostra o selo MCMV (preço de tabela: uso interno, não aparece aqui)
- **Página oficial:** https://www.mrv.com.br/imoveis/ceara/fortaleza/apartamentos-sensia-reserva-vila-do-sol (extraída em 2026-10-05)

### Lazer do condomínio

Itens de lazer na página oficial: Salão de festas, Playground, Piscina Infantil, Piscina com Deck, Piscina Adulto, Pet Place, Espaço Gourmet, Espaço Piquenique, Academia.

| Grupo do quiz | O quiz usa hoje | Conferência à mão | Fonte | Trecho |
| --- | :-: | --- | --- | --- |
| Piscina | ✔ | automático (lista oficial) | — | — |
| Academia | ✔ | ✔ tem · em 2026-10-08 | descrição da página oficial (data/raw/mrv/09.json) + legenda da implantação oficial (foto 09-15, item 19 'Academia') | condomínio moderno com lazer premium: piscina, espaço gourmet, academia, salão de festas |
| Playground | ✔ | automático (lista oficial) | — | — |
| Festas e churrasco | ✔ | automático (lista oficial) | — | — |
| Quadra ou jogos | ✖ | automático (lista oficial) | — | — |
| Área verde | ✔ | automático (lista oficial) | — | — |
| Pet place | ✔ | automático (lista oficial) | — | — |

> **Obs.** Academia: A lista oficial de diferenciais omite a academia. Anúncios de terceiros (busca de 08/10/2026) citam 'Academia' / 'Fitness coberto'.
>
> **Item acrescentado à mão:** Academia (grupo academia) · fonte: legenda da implantação oficial (foto 09-15, item 19) e descrição oficial · em 2026-10-08
>

### Notas do bairro (posição entre os 121 bairros de Fortaleza, 0 a 100)

| Tema (pergunta 6) | Nota | Leitura |
| --- | :-: | --- |
| Saúde por perto | 79 | entre os 25%: vira motivo |
| Escolas | 16 | baixa: puxa a nota para baixo |
| Comércio do dia a dia | 62 | média |
| Praças e parques | 96 | entre os 5%: vira motivo |
| Ônibus fácil | 40 | média |

### Tempo até os lugares mais procurados

Mediana da tabela de ônibus e metrô (GTFS ETUFOR/Metrofor), dia útil, saída 6h30–8h, sem trânsito.

| Destino | Minutos | Nota no quiz |
| --- | :-: | :-: |
| Centro (Praça do Ferreira) | 50 | 50 |
| Beira-Mar | 40 | 67 |
| Aldeota (Av. Santos Dumont) | 34 | 77 · motivo |
| Papicu (terminal) | 17 | 100 · motivo |
| Iguatemi | 28 | 87 · motivo |
| Unifor | 35 | 75 · motivo |
| Centro de Eventos | 29 | 85 · motivo |
| Parangaba (terminal) | 61 | 32 |
| Messejana (terminal) | 55 | 42 |
| UFC Benfica | 54 | 43 |
| UFC Pici | 75 | 8 · atenção |
| Aeroporto | 77 | 5 · atenção |

### Onde ganha pontos

- **Deslocamento (peso 4):** vira motivo para quem vai todo dia a Aldeota (35 min), Papicu (15 min), Iguatemi (30 min), Unifor (35 min) e Centro de Eventos (30 min).
- **Vaga (peso 2,5, quem vai de carro):** nota 100, motivo "Uma vaga de garagem por apartamento".
- **Lazer (peso 2):** conta para quem pede piscina, academia, playground, festas e churrasco e área verde.
- **Bairro (peso 1,5 cada tema escolhido):** forte em saúde por perto (79) e praças e parques (96): vira motivo.
- **Família com crianças (peso 1):** tem playground; escolas do bairro 16 → nota 58 (só 100 se a pessoa também escolheu "Escolas" na pergunta 6, porque aí as escolas já contam lá).
- **Casal (peso 1):** tem opção com suíte → nota 100.
- **Prazo:** em construção → nota 100 para quem quer mudar logo (peso 1,5) ou em 1 a 2 anos (peso 0,5).

### Onde perde pontos

- **Deslocamento (peso 4):** mais de 62 min até UFC Pici e Aeroporto: nota abaixo de 30 e ponto de atenção.
- **Lazer (peso 2):** não pontua para quem pede quadra ou jogos (a nota é a fração dos itens pedidos que o condomínio tem).
- **Bairro (peso 1,5 cada tema escolhido):** nota baixa em escolas (16).
- **Mobilidade (peso 1,5, quem anda de ônibus e não tem destino fixo):** nota 40.
- **Orçamento (peso 5):** quem é das faixas 1, 2 e 3 não usa as condições do MCMV aqui (a conta usa juros de mercado e não há subsídio).

### Observações

- Mesmo bairro de Residencial Farol do Atlântico e Reserva Brisa do Mar: pela regra de diversidade, só um deles entra no top 5, a não ser que o segundo esteja 5 pontos ou mais à frente do próximo de outro bairro.
- Desempate (nota e tempo iguais): 9 itens de lazer na página oficial, 3º entre os 16.
- Tem pet place: o motivo "Pet place para o seu bicho" é verdadeiro aqui (o quiz hoje mostra esse motivo sem checar; ver auditoria).

### Orçamento no quiz (cabe / limite / acima, sem preço)

Ver a nota sobre os valores usados na conta no início desta ficha.

| Renda \ Entrada | Por enquanto, nada | Até R$ 10 mil | De R$ 10 mil a R$ 30 mil | De R$ 30 mil a R$ 60 mil | Mais de R$ 60 mil |
| --- | :-: | :-: | :-: | :-: | :-: |
| Até R$ 2.850 | acima | acima | acima | acima | acima |
| De R$ 2.850 a R$ 4.700 | acima | acima | acima | acima | acima |
| De R$ 4.700 a R$ 8.600 | acima | acima | acima | acima | acima |
| De R$ 8.600 a R$ 12.000 | acima | acima | acima | acima | limite |
| Mais de R$ 12.000 | limite | limite | limite | cabe | cabe |

## 10. Ville de Porto

- **Onde:** Parque Albano, Caucaia · região Caucaia
- **Status (prazo):** Lançamento
- **Planta:** 2 quartos · suíte: não · varanda: sim · área: não informada
- **Vagas:** 127 vagas para 320 apartamentos = **0,4 vaga por apartamento**
- **Minha Casa Minha Vida:** atende as faixas 1 e 2 (preço de tabela: uso interno, não aparece aqui)
- **Página oficial:** https://www.mrv.com.br/imoveis/ceara/caucaia/apartamentos-ville-de-porto (extraída em 2026-10-05)

### Lazer do condomínio

Itens de lazer na página oficial: Churrasqueira, Espaço funcional ao ar livre, Pet Place, Piscina Adulto, Playground, Espaço Piquenique, Piscina Infantil, Pista de Caminhada.

| Grupo do quiz | O quiz usa hoje | Conferência à mão | Fonte | Trecho |
| --- | :-: | --- | --- | --- |
| Piscina | ✔ | automático (lista oficial) | — | — |
| Academia | ✖ | ✖ não tem · em 2026-10-08 | lista oficial (data/raw/mrv/10.json) + legenda da implantação oficial (foto 10-16, item 3 'Espaço Funcional') + decisão do time MRV de 07/10/2026 (funcional não é academia) | Espaço Funcional Descoberto |
| Playground | ✔ | automático (lista oficial) | — | — |
| Festas e churrasco | ✔ | automático (lista oficial) | — | — |
| Quadra ou jogos | ✖ | automático (lista oficial) | — | — |
| Área verde | ✔ | automático (lista oficial) | — | — |
| Pet place | ✔ | automático (lista oficial) | — | — |

> **Item acrescentado à mão:** Piscina Infantil (grupo piscina) · fonte: legenda da implantação oficial (foto 10-16, item 8) e descrição oficial ('piscinas adulto e infantil') · em 2026-10-08
>
> **Item acrescentado à mão:** Pista de Caminhada (grupo verde) · fonte: legenda da implantação oficial (foto 10-16, item 11) · em 2026-10-08
>

### Notas do bairro (posição entre os 121 bairros de Fortaleza, 0 a 100)

Sem notas: Caucaia não está na base dos 121 bairros de Fortaleza. Para este empreendimento os critérios de bairro (pergunta 6), a parte de escolas do critério "família com crianças" e a mobilidade do bairro **saem da conta**, e o peso vai para os outros critérios.

### Tempo até os lugares mais procurados

Estimativa pela distância em linha reta (Caucaia não tem tabela de ônibus); erro típico de 11 min.

| Destino | Minutos | Nota no quiz |
| --- | :-: | :-: |
| Centro (Praça do Ferreira) | 68 (est.) | 20 · atenção |
| Beira-Mar | 82 (est.) | 0 · atenção |
| Aldeota (Av. Santos Dumont) | 80 (est.) | 0 · atenção |
| Papicu (terminal) | 88 (est.) | 0 · atenção |
| Iguatemi | 86 (est.) | 0 · atenção |
| Unifor | 92 (est.) | 0 · atenção |
| Centro de Eventos | 90 (est.) | 0 · atenção |
| Parangaba (terminal) | 53 (est.) | 45 |
| Messejana (terminal) | 94 (est.) | 0 · atenção |
| UFC Benfica | 61 (est.) | 32 |
| UFC Pici | 43 (est.) | 62 |
| Aeroporto | 67 (est.) | 22 · atenção |

### Onde ganha pontos

- **Lazer (peso 2):** conta para quem pede piscina, playground, festas e churrasco e área verde.
- **Sem dado de bairro:** quem escolhe temas na pergunta 6 (ou anda de ônibus sem destino fixo) não tem esses critérios contados aqui, então eles **não puxam a nota para baixo**. Ver a auditoria: isso pode pôr este empreendimento à frente de bairros com notas reais.
- **Família com crianças (peso 1):** tem playground → nota 100.
- **Orçamento (peso 5):** atende faixas 1 e 2 do MCMV: quem tem essa renda recebe subsídio e juros menores na conta.

### Onde perde pontos

- **Deslocamento (peso 4):** mais de 62 min até Centro, Beira-Mar, Aldeota, Papicu, Iguatemi, Unifor, Centro de Eventos, Messejana e Aeroporto: nota abaixo de 30 e ponto de atenção.
- **Tempo é estimativa** (distância em linha reta, erro típico de 11 min), mas entra na nota com o mesmo peso de um tempo medido. A tela avisa "(estimativa)".
- **Vaga (peso 2,5, quem vai de carro):** só 40% dos apartamentos têm vaga (menos de 0,5 por unidade): nota 40 **e** a nota final é multiplicada por 0,85; aviso "Vagas limitadas".
- **Lazer (peso 2):** não pontua para quem pede academia e quadra ou jogos (a nota é a fração dos itens pedidos que o condomínio tem).
- **Casal (peso 1):** sem suíte → nota 40.
- **Prazo:** lançamento → nota 40 para quem quer mudar "o quanto antes" (peso 1,5) e 80 para "em 1 a 2 anos" (peso 0,5).

### Observações

- Mesmo bairro de Ville de Lisboa: pela regra de diversidade, só um deles entra no top 5, a não ser que o segundo esteja 5 pontos ou mais à frente do próximo de outro bairro.
- Desempate (nota e tempo iguais): 8 itens de lazer na página oficial, 5º entre os 16.
- Tem pet place: o motivo "Pet place para o seu bicho" é verdadeiro aqui (o quiz hoje mostra esse motivo sem checar; ver auditoria).

### Orçamento no quiz (cabe / limite / acima, sem preço)

Ver a nota sobre os valores usados na conta no início desta ficha.

| Renda \ Entrada | Por enquanto, nada | Até R$ 10 mil | De R$ 10 mil a R$ 30 mil | De R$ 30 mil a R$ 60 mil | Mais de R$ 60 mil |
| --- | :-: | :-: | :-: | :-: | :-: |
| Até R$ 2.850 | limite | limite | limite | cabe | cabe |
| De R$ 2.850 a R$ 4.700 | limite | limite | cabe | cabe | cabe |
| De R$ 4.700 a R$ 8.600 | cabe | cabe | cabe | cabe | cabe |
| De R$ 8.600 a R$ 12.000 | cabe | cabe | cabe | cabe | cabe |
| Mais de R$ 12.000 | cabe | cabe | cabe | cabe | cabe |

## 11. Torre do Mar

- **Onde:** Maraponga, Fortaleza · região Sul
- **Status (prazo):** Em construção
- **Planta:** 2 quartos · suíte: não · varanda: não informado · área: 36,88 m²
- **Vagas:** 409 vagas para 384 apartamentos = **1,07 vaga por apartamento**
- **Minha Casa Minha Vida:** atende as faixas 2 e 3 (preço de tabela: uso interno, não aparece aqui)
- **Página oficial:** https://www.mrv.com.br/imoveis/ceara/fortaleza/apartamentos-torre-do-mar (extraída em 2026-10-05)

### Lazer do condomínio

Itens de lazer na página oficial: Espaço Gourmet, Pet Place, Playground, Salão de festas, Piscina Adulto, Piscina Infantil.

| Grupo do quiz | O quiz usa hoje | Conferência à mão | Fonte | Trecho |
| --- | :-: | --- | --- | --- |
| Piscina | ✔ | ✔ tem · em 2026-10-08 | descrição da página oficial (data/raw/mrv/11.json) + legenda da implantação oficial (foto 11-15: itens 14 'Piscina Infantil' e 15 'Piscina Adulto') + fotos 11-06 e 11-07 (piscinas adulto e infantil) | área de lazer para toda a família incluindo piscina adulto e infantil, salão de festas, espaço de gourmet |
| Academia | ✖ | automático (lista oficial) | — | — |
| Playground | ✔ | automático (lista oficial) | — | — |
| Festas e churrasco | ✔ | automático (lista oficial) | — | — |
| Quadra ou jogos | ✖ | automático (lista oficial) | — | — |
| Área verde | ✖ | automático (lista oficial) | — | — |
| Pet place | ✔ | automático (lista oficial) | — | — |

> **Obs.** Piscina: A lista oficial de diferenciais (Espaço Gourmet, Pet Place, Playground, Salão de festas) omite as piscinas. Pedir à MRV para corrigir a lista do site.
>
> **Item acrescentado à mão:** Piscina Adulto (grupo piscina) · fonte: legenda da implantação oficial (foto 11-15, item 15) e descrição oficial · em 2026-10-08
>
> **Item acrescentado à mão:** Piscina Infantil (grupo piscina) · fonte: legenda da implantação oficial (foto 11-15, item 14) e descrição oficial · em 2026-10-08
>

### Notas do bairro (posição entre os 121 bairros de Fortaleza, 0 a 100)

| Tema (pergunta 6) | Nota | Leitura |
| --- | :-: | --- |
| Saúde por perto | 31 | baixa: puxa a nota para baixo |
| Escolas | 48 | média |
| Comércio do dia a dia | 79 | entre os 25%: vira motivo |
| Praças e parques | 54 | média |
| Ônibus fácil | 64 | média |

### Tempo até os lugares mais procurados

Mediana da tabela de ônibus e metrô (GTFS ETUFOR/Metrofor), dia útil, saída 6h30–8h, sem trânsito.

| Destino | Minutos | Nota no quiz |
| --- | :-: | :-: |
| Centro (Praça do Ferreira) | 57 | 38 |
| Beira-Mar | 76 | 7 · atenção |
| Aldeota (Av. Santos Dumont) | 69 | 18 · atenção |
| Papicu (terminal) | 76 | 7 · atenção |
| Iguatemi | 75 | 8 · atenção |
| Unifor | 80 | 0 · atenção |
| Centro de Eventos | 81 | 0 · atenção |
| Parangaba (terminal) | 18 | 100 · motivo |
| Messejana (terminal) | 52 | 47 |
| UFC Benfica | 46 | 57 |
| UFC Pici | 66 | 23 · atenção |
| Aeroporto | 54 | 43 |

### Onde ganha pontos

- **Deslocamento (peso 4):** vira motivo para quem vai todo dia a Parangaba (20 min).
- **Vaga (peso 2,5, quem vai de carro):** nota 100, motivo "Uma vaga de garagem por apartamento".
- **Lazer (peso 2):** conta para quem pede piscina, playground e festas e churrasco.
- **Bairro (peso 1,5 cada tema escolhido):** forte em comércio do dia a dia (79): vira motivo.
- **Família com crianças (peso 1):** tem playground; escolas do bairro 48 → nota 74 (só 100 se a pessoa também escolheu "Escolas" na pergunta 6, porque aí as escolas já contam lá).
- **Prazo:** em construção → nota 100 para quem quer mudar logo (peso 1,5) ou em 1 a 2 anos (peso 0,5).
- **Orçamento (peso 5):** atende faixa 2 do MCMV: quem tem essa renda recebe subsídio e juros menores na conta.

### Onde perde pontos

- **Deslocamento (peso 4):** mais de 62 min até Beira-Mar, Aldeota, Papicu, Iguatemi, Unifor, Centro de Eventos e UFC Pici: nota abaixo de 30 e ponto de atenção.
- **Lazer (peso 2):** não pontua para quem pede academia, quadra ou jogos e área verde (a nota é a fração dos itens pedidos que o condomínio tem).
- **Bairro (peso 1,5 cada tema escolhido):** nota baixa em saúde por perto (31).
- **Mobilidade (peso 1,5, quem anda de ônibus e não tem destino fixo):** nota 64.
- **Casal (peso 1):** sem suíte → nota 40.
- **Orçamento (peso 5):** quem é da faixa 1 não usa as condições do MCMV aqui (a conta usa juros de mercado e não há subsídio).

### Observações

- Desempate (nota e tempo iguais): 6 itens de lazer na página oficial, 14º entre os 16.
- Tem pet place: o motivo "Pet place para o seu bicho" é verdadeiro aqui (o quiz hoje mostra esse motivo sem checar; ver auditoria).

### Orçamento no quiz (cabe / limite / acima, sem preço)

Ver a nota sobre os valores usados na conta no início desta ficha.

| Renda \ Entrada | Por enquanto, nada | Até R$ 10 mil | De R$ 10 mil a R$ 30 mil | De R$ 30 mil a R$ 60 mil | Mais de R$ 60 mil |
| --- | :-: | :-: | :-: | :-: | :-: |
| Até R$ 2.850 | acima | acima | acima | acima | acima |
| De R$ 2.850 a R$ 4.700 | acima | acima | acima | acima | limite |
| De R$ 4.700 a R$ 8.600 | limite | cabe | cabe | cabe | cabe |
| De R$ 8.600 a R$ 12.000 | cabe | cabe | cabe | cabe | cabe |
| Mais de R$ 12.000 | cabe | cabe | cabe | cabe | cabe |

## 12. Porto das Marés

- **Onde:** Barra do Ceará, Fortaleza · região Oeste e Centro
- **Status (prazo):** Em construção
- **Planta:** 2 quartos · suíte: tem opção · varanda: não informado · área: 43,34 a 45,14 m²
- **Vagas:** 576 vagas para 576 apartamentos = **1 vaga por apartamento**
- **Minha Casa Minha Vida:** atende as faixas 2 e 3 (preço de tabela: uso interno, não aparece aqui)
- **Página oficial:** https://www.mrv.com.br/imoveis/ceara/fortaleza/apartamentos-porto-das-mares (extraída em 2026-10-05)

### Lazer do condomínio

Itens de lazer na página oficial: Espaço Gourmet, Espaço Kids, Pet Place, Piscina Adulto, Piscina Infantil, Playground, Salão de Festas com Copa, Espaço Piquenique.

| Grupo do quiz | O quiz usa hoje | Conferência à mão | Fonte | Trecho |
| --- | :-: | --- | --- | --- |
| Piscina | ✔ | automático (lista oficial) | — | — |
| Academia | ✖ | automático (lista oficial) | — | — |
| Playground | ✔ | automático (lista oficial) | — | — |
| Festas e churrasco | ✔ | automático (lista oficial) | — | — |
| Quadra ou jogos | ✖ | automático (lista oficial) | — | — |
| Área verde | ✔ | automático (lista oficial) | — | — |
| Pet place | ✔ | automático (lista oficial) | — | — |

> Nenhuma correção em data/curated/lazer.json: vale a lista de lazer da página oficial.

### Notas do bairro (posição entre os 121 bairros de Fortaleza, 0 a 100)

| Tema (pergunta 6) | Nota | Leitura |
| --- | :-: | --- |
| Saúde por perto | 44 | média |
| Escolas | 63 | média |
| Comércio do dia a dia | 21 | baixa: puxa a nota para baixo |
| Praças e parques | 21 | baixa: puxa a nota para baixo |
| Ônibus fácil | 17 | baixa: puxa a nota para baixo |

### Tempo até os lugares mais procurados

Mediana da tabela de ônibus e metrô (GTFS ETUFOR/Metrofor), dia útil, saída 6h30–8h, sem trânsito.

| Destino | Minutos | Nota no quiz |
| --- | :-: | :-: |
| Centro (Praça do Ferreira) | 42 | 63 |
| Beira-Mar | 46 | 57 |
| Aldeota (Av. Santos Dumont) | 60 | 33 |
| Papicu (terminal) | 58 | 37 |
| Iguatemi | 70 | 17 · atenção |
| Unifor | 83 | 0 · atenção |
| Centro de Eventos | 77 | 5 · atenção |
| Parangaba (terminal) | 56 | 40 |
| Messejana (terminal) | 77 | 5 · atenção |
| UFC Benfica | 48 | 53 |
| UFC Pici | 49 | 52 |
| Aeroporto | 78 | 3 · atenção |

### Onde ganha pontos

- **Vaga (peso 2,5, quem vai de carro):** nota 100, motivo "Uma vaga de garagem por apartamento".
- **Lazer (peso 2):** conta para quem pede piscina, playground, festas e churrasco e área verde.
- **Família com crianças (peso 1):** tem playground; escolas do bairro 63 → nota 81,5 (só 100 se a pessoa também escolheu "Escolas" na pergunta 6, porque aí as escolas já contam lá).
- **Casal (peso 1):** tem opção com suíte → nota 100.
- **Prazo:** em construção → nota 100 para quem quer mudar logo (peso 1,5) ou em 1 a 2 anos (peso 0,5).
- **Orçamento (peso 5):** atende faixa 2 do MCMV: quem tem essa renda recebe subsídio e juros menores na conta.

### Onde perde pontos

- **Deslocamento (peso 4):** mais de 62 min até Iguatemi, Unifor, Centro de Eventos, Messejana e Aeroporto: nota abaixo de 30 e ponto de atenção.
- **Lazer (peso 2):** não pontua para quem pede academia e quadra ou jogos (a nota é a fração dos itens pedidos que o condomínio tem).
- **Bairro (peso 1,5 cada tema escolhido):** nota baixa em comércio do dia a dia (21), praças e parques (21) e ônibus fácil (17).
- **Mobilidade (peso 1,5, quem anda de ônibus e não tem destino fixo):** nota 17.
- **Orçamento (peso 5):** quem é da faixa 1 não usa as condições do MCMV aqui (a conta usa juros de mercado e não há subsídio).

### Observações

- Desempate (nota e tempo iguais): 8 itens de lazer na página oficial, 5º entre os 16.
- Tem pet place: o motivo "Pet place para o seu bicho" é verdadeiro aqui (o quiz hoje mostra esse motivo sem checar; ver auditoria).

### Orçamento no quiz (cabe / limite / acima, sem preço)

Ver a nota sobre os valores usados na conta no início desta ficha.

| Renda \ Entrada | Por enquanto, nada | Até R$ 10 mil | De R$ 10 mil a R$ 30 mil | De R$ 30 mil a R$ 60 mil | Mais de R$ 60 mil |
| --- | :-: | :-: | :-: | :-: | :-: |
| Até R$ 2.850 | acima | acima | acima | acima | acima |
| De R$ 2.850 a R$ 4.700 | acima | acima | acima | limite | limite |
| De R$ 4.700 a R$ 8.600 | cabe | cabe | cabe | cabe | cabe |
| De R$ 8.600 a R$ 12.000 | cabe | cabe | cabe | cabe | cabe |
| Mais de R$ 12.000 | cabe | cabe | cabe | cabe | cabe |

## 13. Residencial Mandacaru

- **Onde:** Antônio Bezerra, Fortaleza · região Oeste e Centro
- **Status (prazo):** Em construção
- **Planta:** 2 quartos · suíte: não · varanda: sim · área: 36,88 m²
- **Vagas:** 93 vagas para 204 apartamentos = **0,46 vaga por apartamento**
- **Minha Casa Minha Vida:** atende a faixa 3 (preço de tabela: uso interno, não aparece aqui)
- **Página oficial:** https://www.mrv.com.br/imoveis/ceara/fortaleza/apartamentos-residencial-mandacaru (extraída em 2026-10-05)

### Lazer do condomínio

Itens de lazer na página oficial: Academia Coberta, Espaço Gourmet, Pet Place, Piscina Adulto, Piscina Infantil, Playground, Salão de Festas com Copa.

| Grupo do quiz | O quiz usa hoje | Conferência à mão | Fonte | Trecho |
| --- | :-: | --- | --- | --- |
| Piscina | ✔ | automático (lista oficial) | — | — |
| Academia | ✔ | automático (lista oficial) | — | — |
| Playground | ✔ | automático (lista oficial) | — | — |
| Festas e churrasco | ✔ | automático (lista oficial) | — | — |
| Quadra ou jogos | ✖ | automático (lista oficial) | — | — |
| Área verde | ✖ | automático (lista oficial) | — | — |
| Pet place | ✔ | automático (lista oficial) | — | — |

### Notas do bairro (posição entre os 121 bairros de Fortaleza, 0 a 100)

| Tema (pergunta 6) | Nota | Leitura |
| --- | :-: | --- |
| Saúde por perto | 74 | entre os 30%: vira motivo |
| Escolas | 80 | entre os 20%: vira motivo |
| Comércio do dia a dia | 31 | baixa: puxa a nota para baixo |
| Praças e parques | 9 | baixa: puxa a nota para baixo |
| Ônibus fácil | 69 | média |

### Tempo até os lugares mais procurados

Mediana da tabela de ônibus e metrô (GTFS ETUFOR/Metrofor), dia útil, saída 6h30–8h, sem trânsito.

| Destino | Minutos | Nota no quiz |
| --- | :-: | :-: |
| Centro (Praça do Ferreira) | 50 | 50 |
| Beira-Mar | 65 | 25 · atenção |
| Aldeota (Av. Santos Dumont) | 63 | 28 · atenção |
| Papicu (terminal) | 70 | 17 · atenção |
| Iguatemi | 66 | 23 · atenção |
| Unifor | 80 | 0 · atenção |
| Centro de Eventos | 75 | 8 · atenção |
| Parangaba (terminal) | 41 | 65 |
| Messejana (terminal) | 75 | 8 · atenção |
| UFC Benfica | 41 | 65 |
| UFC Pici | 32 | 80 · motivo |
| Aeroporto | 75 | 8 · atenção |

### Onde ganha pontos

- **Deslocamento (peso 4):** vira motivo para quem vai todo dia a UFC Pici (30 min).
- **Lazer (peso 2):** conta para quem pede piscina, academia, playground e festas e churrasco.
- **Bairro (peso 1,5 cada tema escolhido):** forte em saúde por perto (74) e escolas (80): vira motivo.
- **Família com crianças (peso 1):** tem playground; escolas do bairro 80 → nota 90 (só 100 se a pessoa também escolheu "Escolas" na pergunta 6, porque aí as escolas já contam lá).
- **Prazo:** em construção → nota 100 para quem quer mudar logo (peso 1,5) ou em 1 a 2 anos (peso 0,5).

### Onde perde pontos

- **Deslocamento (peso 4):** mais de 62 min até Beira-Mar, Aldeota, Papicu, Iguatemi, Unifor, Centro de Eventos, Messejana e Aeroporto: nota abaixo de 30 e ponto de atenção.
- **Vaga (peso 2,5, quem vai de carro):** só 46% dos apartamentos têm vaga (menos de 0,5 por unidade): nota 46 **e** a nota final é multiplicada por 0,85; aviso "Vagas limitadas".
- **Lazer (peso 2):** não pontua para quem pede quadra ou jogos e área verde (a nota é a fração dos itens pedidos que o condomínio tem).
- **Bairro (peso 1,5 cada tema escolhido):** nota baixa em comércio do dia a dia (31) e praças e parques (9).
- **Mobilidade (peso 1,5, quem anda de ônibus e não tem destino fixo):** nota 69.
- **Casal (peso 1):** sem suíte → nota 40.
- **Orçamento (peso 5):** quem é das faixas 1 e 2 não usa as condições do MCMV aqui (a conta usa juros de mercado e não há subsídio).

### Observações

- Mesmo bairro de Residencial Fortitudine: pela regra de diversidade, só um deles entra no top 5, a não ser que o segundo esteja 5 pontos ou mais à frente do próximo de outro bairro.
- Desempate (nota e tempo iguais): 7 itens de lazer na página oficial, 7º entre os 16.
- Tem pet place: o motivo "Pet place para o seu bicho" é verdadeiro aqui (o quiz hoje mostra esse motivo sem checar; ver auditoria).

### Orçamento no quiz (cabe / limite / acima, sem preço)

Ver a nota sobre os valores usados na conta no início desta ficha.

| Renda \ Entrada | Por enquanto, nada | Até R$ 10 mil | De R$ 10 mil a R$ 30 mil | De R$ 30 mil a R$ 60 mil | Mais de R$ 60 mil |
| --- | :-: | :-: | :-: | :-: | :-: |
| Até R$ 2.850 | acima | acima | acima | acima | acima |
| De R$ 2.850 a R$ 4.700 | acima | acima | acima | acima | acima |
| De R$ 4.700 a R$ 8.600 | limite | limite | cabe | cabe | cabe |
| De R$ 8.600 a R$ 12.000 | cabe | cabe | cabe | cabe | cabe |
| Mais de R$ 12.000 | cabe | cabe | cabe | cabe | cabe |

## 14. Reserva Brisa do Mar

- **Onde:** Cocó, Fortaleza · região Leste
- **Status (prazo):** Em construção
- **Planta:** 1 ou 2 quartos · suíte: não · varanda: não informado · área: 38,05 a 46,74 m²
- **Vagas:** 223 vagas para 272 apartamentos = **0,82 vaga por apartamento**
- **Minha Casa Minha Vida:** atende a faixa 3 (preço de tabela: uso interno, não aparece aqui)
- **Página oficial:** https://www.mrv.com.br/imoveis/ceara/fortaleza/apartamentos-reserva-brisa-do-mar (extraída em 2026-10-05)

### Lazer do condomínio

Itens de lazer na página oficial: Espaço Gourmet, Pet Place, Piscina Adulto, Piscina Infantil, Playground, Salão de Festas com Copa, Espaço Piquenique.

| Grupo do quiz | O quiz usa hoje | Conferência à mão | Fonte | Trecho |
| --- | :-: | --- | --- | --- |
| Piscina | ✔ | automático (lista oficial) | — | — |
| Academia | ✖ | automático (lista oficial) | — | — |
| Playground | ✔ | automático (lista oficial) | — | — |
| Festas e churrasco | ✔ | automático (lista oficial) | — | — |
| Quadra ou jogos | ✖ | automático (lista oficial) | — | — |
| Área verde | ✔ | automático (lista oficial) | — | — |
| Pet place | ✔ | automático (lista oficial) | — | — |

> Nenhuma correção em data/curated/lazer.json: vale a lista de lazer da página oficial.

### Notas do bairro (posição entre os 121 bairros de Fortaleza, 0 a 100)

| Tema (pergunta 6) | Nota | Leitura |
| --- | :-: | --- |
| Saúde por perto | 79 | entre os 25%: vira motivo |
| Escolas | 16 | baixa: puxa a nota para baixo |
| Comércio do dia a dia | 62 | média |
| Praças e parques | 96 | entre os 5%: vira motivo |
| Ônibus fácil | 40 | média |

### Tempo até os lugares mais procurados

Mediana da tabela de ônibus e metrô (GTFS ETUFOR/Metrofor), dia útil, saída 6h30–8h, sem trânsito.

| Destino | Minutos | Nota no quiz |
| --- | :-: | :-: |
| Centro (Praça do Ferreira) | 50 | 50 |
| Beira-Mar | 40 | 67 |
| Aldeota (Av. Santos Dumont) | 34 | 77 · motivo |
| Papicu (terminal) | 17 | 100 · motivo |
| Iguatemi | 28 | 87 · motivo |
| Unifor | 35 | 75 · motivo |
| Centro de Eventos | 29 | 85 · motivo |
| Parangaba (terminal) | 61 | 32 |
| Messejana (terminal) | 55 | 42 |
| UFC Benfica | 54 | 43 |
| UFC Pici | 75 | 8 · atenção |
| Aeroporto | 77 | 5 · atenção |

### Onde ganha pontos

- **Deslocamento (peso 4):** vira motivo para quem vai todo dia a Aldeota (35 min), Papicu (15 min), Iguatemi (30 min), Unifor (35 min) e Centro de Eventos (30 min).
- **Vaga (peso 2,5, quem vai de carro):** nota 82, motivo "Vagas para 82% dos apartamentos".
- **Lazer (peso 2):** conta para quem pede piscina, playground, festas e churrasco e área verde.
- **Bairro (peso 1,5 cada tema escolhido):** forte em saúde por perto (79) e praças e parques (96): vira motivo.
- **Família com crianças (peso 1):** tem playground; escolas do bairro 16 → nota 58 (só 100 se a pessoa também escolheu "Escolas" na pergunta 6, porque aí as escolas já contam lá).
- **Prazo:** em construção → nota 100 para quem quer mudar logo (peso 1,5) ou em 1 a 2 anos (peso 0,5).

### Onde perde pontos

- **Deslocamento (peso 4):** mais de 62 min até UFC Pici e Aeroporto: nota abaixo de 30 e ponto de atenção.
- **Lazer (peso 2):** não pontua para quem pede academia e quadra ou jogos (a nota é a fração dos itens pedidos que o condomínio tem).
- **Bairro (peso 1,5 cada tema escolhido):** nota baixa em escolas (16).
- **Mobilidade (peso 1,5, quem anda de ônibus e não tem destino fixo):** nota 40.
- **Casal (peso 1):** sem suíte → nota 40.
- **Orçamento (peso 5):** quem é das faixas 1 e 2 não usa as condições do MCMV aqui (a conta usa juros de mercado e não há subsídio).

### Observações

- Mesmo bairro de Residencial Farol do Atlântico e Sensia Reserva Vila do Sol: pela regra de diversidade, só um deles entra no top 5, a não ser que o segundo esteja 5 pontos ou mais à frente do próximo de outro bairro.
- Desempate (nota e tempo iguais): 7 itens de lazer na página oficial, 7º entre os 16.
- Tem pet place: o motivo "Pet place para o seu bicho" é verdadeiro aqui (o quiz hoje mostra esse motivo sem checar; ver auditoria).

### Orçamento no quiz (cabe / limite / acima, sem preço)

Ver a nota sobre os valores usados na conta no início desta ficha.

| Renda \ Entrada | Por enquanto, nada | Até R$ 10 mil | De R$ 10 mil a R$ 30 mil | De R$ 30 mil a R$ 60 mil | Mais de R$ 60 mil |
| --- | :-: | :-: | :-: | :-: | :-: |
| Até R$ 2.850 | acima | acima | acima | acima | acima |
| De R$ 2.850 a R$ 4.700 | acima | acima | acima | acima | acima |
| De R$ 4.700 a R$ 8.600 | limite | cabe | cabe | cabe | cabe |
| De R$ 8.600 a R$ 12.000 | cabe | cabe | cabe | cabe | cabe |
| Mais de R$ 12.000 | cabe | cabe | cabe | cabe | cabe |

## 15. Residencial Valparaíso

- **Onde:** Jangurussu, Fortaleza · região Sul
- **Status (prazo):** Em construção
- **Planta:** 2 quartos · suíte: não · varanda: sim · área: 38,4 m²
- **Vagas:** 88 vagas para 240 apartamentos = **0,37 vaga por apartamento**
- **Minha Casa Minha Vida:** atende as faixas 1 e 2 (preço de tabela: uso interno, não aparece aqui)
- **Página oficial:** https://www.mrv.com.br/imoveis/ceara/fortaleza/apartamentos-residencial-valparaiso (extraída em 2026-10-05)

### Lazer do condomínio

Itens de lazer na página oficial: Churrasqueira, Pet Place, Piscina Adulto, Piscina Infantil, Pista de Caminhada, Playground.

| Grupo do quiz | O quiz usa hoje | Conferência à mão | Fonte | Trecho |
| --- | :-: | --- | --- | --- |
| Piscina | ✔ | automático (lista oficial) | — | — |
| Academia | ✖ | automático (lista oficial) | — | — |
| Playground | ✔ | automático (lista oficial) | — | — |
| Festas e churrasco | ✔ | automático (lista oficial) | — | — |
| Quadra ou jogos | ✖ | automático (lista oficial) | — | — |
| Área verde | ✔ | automático (lista oficial) | — | — |
| Pet place | ✔ | automático (lista oficial) | — | — |

> Nenhuma correção em data/curated/lazer.json: vale a lista de lazer da página oficial.

### Notas do bairro (posição entre os 121 bairros de Fortaleza, 0 a 100)

| Tema (pergunta 6) | Nota | Leitura |
| --- | :-: | --- |
| Saúde por perto | 35 | baixa: puxa a nota para baixo |
| Escolas | 58 | média |
| Comércio do dia a dia | 8 | baixa: puxa a nota para baixo |
| Praças e parques | 17 | baixa: puxa a nota para baixo |
| Ônibus fácil | 13 | baixa: puxa a nota para baixo |

### Tempo até os lugares mais procurados

Mediana da tabela de ônibus e metrô (GTFS ETUFOR/Metrofor), dia útil, saída 6h30–8h, sem trânsito.

| Destino | Minutos | Nota no quiz |
| --- | :-: | :-: |
| Centro (Praça do Ferreira) | 75 | 8 · atenção |
| Beira-Mar | 94 | 0 · atenção |
| Aldeota (Av. Santos Dumont) | 82 | 0 · atenção |
| Papicu (terminal) | 80 | 0 · atenção |
| Iguatemi | 71 | 15 · atenção |
| Unifor | 72 | 13 · atenção |
| Centro de Eventos | 68 | 20 · atenção |
| Parangaba (terminal) | 66 | 23 · atenção |
| Messejana (terminal) | 28 | 87 · motivo |
| UFC Benfica | 79 | 2 · atenção |
| UFC Pici | 103 | 0 · atenção |
| Aeroporto | 94 | 0 · atenção |

### Onde ganha pontos

- **Deslocamento (peso 4):** vira motivo para quem vai todo dia a Messejana (30 min).
- **Lazer (peso 2):** conta para quem pede piscina, playground, festas e churrasco e área verde.
- **Família com crianças (peso 1):** tem playground; escolas do bairro 58 → nota 79 (só 100 se a pessoa também escolheu "Escolas" na pergunta 6, porque aí as escolas já contam lá).
- **Prazo:** em construção → nota 100 para quem quer mudar logo (peso 1,5) ou em 1 a 2 anos (peso 0,5).
- **Orçamento (peso 5):** atende faixas 1 e 2 do MCMV: quem tem essa renda recebe subsídio e juros menores na conta.

### Onde perde pontos

- **Deslocamento (peso 4):** mais de 62 min até Centro, Beira-Mar, Aldeota, Papicu, Iguatemi, Unifor, Centro de Eventos, Parangaba, UFC Benfica, UFC Pici e Aeroporto: nota abaixo de 30 e ponto de atenção.
- **Vaga (peso 2,5, quem vai de carro):** só 37% dos apartamentos têm vaga (menos de 0,5 por unidade): nota 37 **e** a nota final é multiplicada por 0,85; aviso "Vagas limitadas".
- **Lazer (peso 2):** não pontua para quem pede academia e quadra ou jogos (a nota é a fração dos itens pedidos que o condomínio tem).
- **Bairro (peso 1,5 cada tema escolhido):** nota baixa em saúde por perto (35), comércio do dia a dia (8), praças e parques (17) e ônibus fácil (13).
- **Mobilidade (peso 1,5, quem anda de ônibus e não tem destino fixo):** nota 13.
- **Casal (peso 1):** sem suíte → nota 40.

### Observações

- Mesmo bairro de Residencial La Serena: pela regra de diversidade, só um deles entra no top 5, a não ser que o segundo esteja 5 pontos ou mais à frente do próximo de outro bairro.
- Desempate (nota e tempo iguais): 6 itens de lazer na página oficial, 14º entre os 16.
- Tem pet place: o motivo "Pet place para o seu bicho" é verdadeiro aqui (o quiz hoje mostra esse motivo sem checar; ver auditoria).

### Orçamento no quiz (cabe / limite / acima, sem preço)

Ver a nota sobre os valores usados na conta no início desta ficha.

| Renda \ Entrada | Por enquanto, nada | Até R$ 10 mil | De R$ 10 mil a R$ 30 mil | De R$ 30 mil a R$ 60 mil | Mais de R$ 60 mil |
| --- | :-: | :-: | :-: | :-: | :-: |
| Até R$ 2.850 | limite | limite | limite | cabe | cabe |
| De R$ 2.850 a R$ 4.700 | limite | limite | cabe | cabe | cabe |
| De R$ 4.700 a R$ 8.600 | cabe | cabe | cabe | cabe | cabe |
| De R$ 8.600 a R$ 12.000 | cabe | cabe | cabe | cabe | cabe |
| Mais de R$ 12.000 | cabe | cabe | cabe | cabe | cabe |

## 16. Eco Park

- **Onde:** Urucunema, Eusébio · região Eusébio
- **Status (prazo):** Em construção
- **Planta:** 2 quartos · suíte: não · varanda: não informado · área: 41,4 m²
- **Vagas:** 200 vagas para 200 apartamentos = **1 vaga por apartamento**
- **Minha Casa Minha Vida:** atende as faixas 1 e 2 (preço de tabela: uso interno, não aparece aqui)
- **Página oficial:** https://www.mrv.com.br/imoveis/ceara/eusebio/apartamentos-eco-park (extraída em 2026-10-05)

### Lazer do condomínio

Itens de lazer na página oficial: Churrasqueira, Espaço Gourmet, Pet Place, Piscina Adulto, Piscina Infantil, Playground, Salão de festas.

| Grupo do quiz | O quiz usa hoje | Conferência à mão | Fonte | Trecho |
| --- | :-: | --- | --- | --- |
| Piscina | ✔ | automático (lista oficial) | — | — |
| Academia | ✖ | automático (lista oficial) | — | — |
| Playground | ✔ | automático (lista oficial) | — | — |
| Festas e churrasco | ✔ | automático (lista oficial) | — | — |
| Quadra ou jogos | ✖ | automático (lista oficial) | — | — |
| Área verde | ✖ | automático (lista oficial) | — | — |
| Pet place | ✔ | automático (lista oficial) | — | — |

> Nenhuma correção em data/curated/lazer.json: vale a lista de lazer da página oficial.

### Notas do bairro (posição entre os 121 bairros de Fortaleza, 0 a 100)

Sem notas: Eusébio não está na base dos 121 bairros de Fortaleza. Para este empreendimento os critérios de bairro (pergunta 6), a parte de escolas do critério "família com crianças" e a mobilidade do bairro **saem da conta**, e o peso vai para os outros critérios.

### Tempo até os lugares mais procurados

Estimativa pela distância em linha reta (Eusébio não tem tabela de ônibus); erro típico de 11 min.

| Destino | Minutos | Nota no quiz |
| --- | :-: | :-: |
| Centro (Praça do Ferreira) | 117 (est.) | 0 · atenção |
| Beira-Mar | 114 (est.) | 0 · atenção |
| Aldeota (Av. Santos Dumont) | 108 (est.) | 0 · atenção |
| Papicu (terminal) | 107 (est.) | 0 · atenção |
| Iguatemi | 98 (est.) | 0 · atenção |
| Unifor | 91 (est.) | 0 · atenção |
| Centro de Eventos | 93 (est.) | 0 · atenção |
| Parangaba (terminal) | 106 (est.) | 0 · atenção |
| Messejana (terminal) | 66 (est.) | 23 · atenção |
| UFC Benfica | 113 (est.) | 0 · atenção |
| UFC Pici | 122 (est.) | 0 · atenção |
| Aeroporto | 97 (est.) | 0 · atenção |

### Onde ganha pontos

- **Vaga (peso 2,5, quem vai de carro):** nota 100, motivo "Uma vaga de garagem por apartamento".
- **Lazer (peso 2):** conta para quem pede piscina, playground e festas e churrasco.
- **Sem dado de bairro:** quem escolhe temas na pergunta 6 (ou anda de ônibus sem destino fixo) não tem esses critérios contados aqui, então eles **não puxam a nota para baixo**. Ver a auditoria: isso pode pôr este empreendimento à frente de bairros com notas reais.
- **Família com crianças (peso 1):** tem playground → nota 100.
- **Prazo:** em construção → nota 100 para quem quer mudar logo (peso 1,5) ou em 1 a 2 anos (peso 0,5).
- **Orçamento (peso 5):** atende faixas 1 e 2 do MCMV: quem tem essa renda recebe subsídio e juros menores na conta.

### Onde perde pontos

- **Deslocamento (peso 4):** mais de 62 min até Centro, Beira-Mar, Aldeota, Papicu, Iguatemi, Unifor, Centro de Eventos, Parangaba, Messejana, UFC Benfica, UFC Pici e Aeroporto: nota abaixo de 30 e ponto de atenção.
- **Tempo é estimativa** (distância em linha reta, erro típico de 11 min), mas entra na nota com o mesmo peso de um tempo medido. A tela avisa "(estimativa)".
- **Lazer (peso 2):** não pontua para quem pede academia, quadra ou jogos e área verde (a nota é a fração dos itens pedidos que o condomínio tem).
- **Casal (peso 1):** sem suíte → nota 40.

### Observações

- Desempate (nota e tempo iguais): 7 itens de lazer na página oficial, 7º entre os 16.
- Tem pet place: o motivo "Pet place para o seu bicho" é verdadeiro aqui (o quiz hoje mostra esse motivo sem checar; ver auditoria).

### Orçamento no quiz (cabe / limite / acima, sem preço)

Ver a nota sobre os valores usados na conta no início desta ficha.

| Renda \ Entrada | Por enquanto, nada | Até R$ 10 mil | De R$ 10 mil a R$ 30 mil | De R$ 30 mil a R$ 60 mil | Mais de R$ 60 mil |
| --- | :-: | :-: | :-: | :-: | :-: |
| Até R$ 2.850 | acima | limite | limite | cabe | cabe |
| De R$ 2.850 a R$ 4.700 | limite | limite | cabe | cabe | cabe |
| De R$ 4.700 a R$ 8.600 | cabe | cabe | cabe | cabe | cabe |
| De R$ 8.600 a R$ 12.000 | cabe | cabe | cabe | cabe | cabe |
| Mais de R$ 12.000 | cabe | cabe | cabe | cabe | cabe |
