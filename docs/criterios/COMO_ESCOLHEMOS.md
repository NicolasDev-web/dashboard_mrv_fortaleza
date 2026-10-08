# Como o "Descubra seu MRV" escolhe os empreendimentos

Este documento explica, em linguagem simples, como o quiz decide quais dos 16 empreendimentos MRV da Grande Fortaleza aparecem para cada pessoa e em que ordem. Tudo aqui foi conferido no código (`lib/scoring/score.ts`, `lib/scoring/config.ts`, `lib/quiz/questions.ts`). Se o código mudar, este texto precisa mudar junto.

Documentos relacionados:

- [FICHA_EMPREENDIMENTOS.md](FICHA_EMPREENDIMENTOS.md): uma ficha por empreendimento, com o que conta a favor e contra cada um. É gerada por `npm run data:ficha`.
- [AUDITORIA_SCORING.md](AUDITORIA_SCORING.md): pontos do cálculo que podem levar a uma escolha errada ou a um texto enganoso, com a correção proposta.

---

## 1. Resumo em um minuto

1. A pessoa responde 9 perguntas. Cada resposta **liga** um ou mais critérios (tempo até o destino, vaga, lazer, bairro, prazo, orçamento…). O que a pessoa não pediu não entra na conta.
2. Para cada critério ligado, cada empreendimento recebe uma **nota de 0 a 100**, sempre a partir de um dado verificável (página oficial da MRV, tabela de ônibus, mapa do bairro, tabela de preços).
3. A nota final é a **média ponderada** dessas notas: critérios mais importantes têm peso maior. Algumas situações **multiplicam** a nota por um redutor (orçamento apertado, poucas vagas para quem vai de carro).
4. Os empreendimentos são ordenados pela nota. Quem está **acima do orçamento vai sempre para o fim**. O resultado mostra os **5 primeiros** (o 1º em destaque), evitando repetir bairro.
5. Cada critério com nota alta vira um **motivo** ("Cerca de 30 min de ônibus até a UFC Benfica"); alguns critérios ruins viram **ponto de atenção** ("Vagas limitadas…").

O cálculo é determinístico: as mesmas respostas sempre dão o mesmo resultado.

---

## 2. As 9 perguntas e o que cada resposta liga

| # | Pergunta | Respostas | O que liga na conta |
| --- | --- | --- | --- |
| 1 | Onde você topa morar? | Só em Fortaleza · Fortaleza ou Região Metropolitana · Quero escolher as regiões | **Filtro**, não é nota. "Só em Fortaleza" tira os 3 de Caucaia e Eusébio (sobram 13). "Escolher regiões" deixa só as regiões marcadas (Oeste e Centro, Leste, Sul, Caucaia, Eusébio). |
| 2 | Para onde você vai quase todo dia? | Um dos 12 lugares mais procurados (Centro, Aldeota, Beira-Mar, Papicu, Iguatemi, Unifor, Centro de Eventos, Messejana, Parangaba, UFC Benfica, UFC Pici, Aeroporto), qualquer um dos 121 bairros de Fortaleza, ou "Trabalho ou estudo de casa" | Critério **Deslocamento**. "De casa" não liga nada. |
| 3 | Como você costuma se deslocar? | Ônibus ou metrô · Carro ou moto · Bicicleta ou a pé · Aplicativo | **Carro ou moto** liga o critério **Vaga**. **Ônibus** liga **Mobilidade do bairro**, mas só para quem não tem destino fixo (respondeu "de casa"): com destino, o tempo de ônibus já mede isso. Bicicleta e aplicativo não ligam critério. |
| 4 | Quem vai morar com você? (+ "tenho pet") | Só eu · Eu e meu par · Família com crianças | **Eu e meu par** liga **Casal** (suíte). **Família com crianças** liga **Filhos** (playground + escolas do bairro). "Só eu" não liga nada. Marcar **pet** só acrescenta um motivo; não muda a nota. |
| 5 | O que não pode faltar no condomínio? (até 3) | Piscina · Academia · Playground · Festas e churrasco · Quadra ou jogos · Área verde | Critério **Lazer**. |
| 6 | E no bairro, o que pesa mais? (até 2) | Saúde por perto · Escolas · Comércio do dia a dia · Praças e parques · Ônibus fácil | Um critério **Bairro** para cada tema escolhido. |
| 7 | Quando você quer se mudar? | O quanto antes · Em 1 a 2 anos · Tanto faz | Critério **Prazo** (com peso diferente para "o quanto antes" e "1 a 2 anos"). "Tanto faz" não liga nada. |
| 8 | Quanto a família ganha por mês? | 5 faixas (até R$ 2.850 … mais de R$ 12.000) · Prefiro não informar | Junto com a pergunta 9, liga o critério **Orçamento**. "Prefiro não informar" desliga o orçamento e encerra o quiz. |
| 9 | Quanto dá para dar de entrada? | Nada · até R$ 10 mil · R$ 10–30 mil · R$ 30–60 mil · mais de R$ 60 mil | Entra na conta do **Orçamento**. |

---

## 3. Os critérios: peso e como cada nota é dada

O **peso** diz quanto o critério importa na média. A **nota** vai de 0 (não combina nada) a 100 (combina totalmente).

| Critério | Liga quando | Peso | Como a nota (0–100) é dada |
| --- | --- | :-: | --- |
| **Orçamento** | Informou renda (pergunta 8) | **5** | Compara o quanto a pessoa consegue pagar com o preço de tabela (ver abaixo). Cabe folgado = 100; no limite = 50 a 100; abaixo de 70% do preço = 0. |
| **Deslocamento** | Escolheu um destino (pergunta 2) | **4** | Tempo de ônibus/metrô até o destino. Até **20 min = 100**; cai em linha reta até **0 em 80 min**. Ex.: 30 min = 83; 50 min = 50; 62 min = 30. Se o empreendimento fica no próprio bairro de destino, conta 10 min (nota 100). |
| **Vaga** | Vai de carro ou moto | **2,5** | Vagas por apartamento × 100, no máximo 100. Ex.: 0,3 vaga por apto = 30; 1 vaga = 100. |
| **Lazer** | Escolheu itens na pergunta 5 | **2** | Fração dos itens pedidos que o condomínio tem. Pediu 2 e tem 1 = 50. Ter "mais" de um item (duas piscinas, academia maior) não muda nada: é tem ou não tem. |
| **Bairro** (cada tema) | Escolheu tema na pergunta 6 | **1,5** cada (até 2 temas = 3) | Nota do bairro naquele tema: posição entre os 121 bairros de Fortaleza (0 = pior, 100 = melhor). |
| **Mobilidade** | Ônibus **e** sem destino fixo | **1,5** | Nota "mobilidade" do bairro (posição entre os 121). |
| **Prazo: o quanto antes** | "O quanto antes" | **1,5** | Em construção ou pronto = 100; lançamento = **40**. |
| **Prazo: em 1 a 2 anos** | "Em 1 a 2 anos" | **0,5** | Em construção ou pronto = 100; lançamento = **80**. |
| **Filhos** | Família com crianças | **1** | Média entre playground no condomínio (tem = 100, não tem = 0) e a nota de escolas do bairro. Se a pessoa já escolheu "Escolas" na pergunta 6, aqui conta só o playground (para não contar escolas duas vezes). |
| **Casal** | Eu e meu par | **1** | Tem opção com suíte = 100; não tem = 40. |
| **Pet** | Marcou "tenho pet" | **0** | Não entra na média (todos os 16 têm pet place). Só gera o motivo "Pet place para o seu bicho". |

### Ordem de importância

1. **Orçamento (5)**: o que mais pesa. Não adianta combinar com a rotina e não caber no bolso.
2. **Deslocamento (4)**: o tempo até onde a pessoa vai todo dia.
3. **Vaga (2,5)**, para quem tem carro.
4. **Lazer do condomínio (2)**.
5. **Bairro (1,5 por tema; até 3 somando os dois)**, **Mobilidade (1,5)** e **Prazo "o quanto antes" (1,5)**.
6. **Filhos (1)** e **Casal (1)**.
7. **Prazo "1 a 2 anos" (0,5)**.

Numa pessoa que ligou quase tudo (renda, destino, carro, 3 itens de lazer, 2 temas de bairro, filhos, "o quanto antes"), a soma dos pesos é 19: o orçamento responde por cerca de 26% da nota e o deslocamento por 21%.

### Orçamento: como "cabe", "no limite" e "acima" são calculados

O preço **nunca aparece na tela** nem neste documento. A conta é:

> **Quanto a pessoa consegue pagar** = valor financiado + subsídio + entrada

- **Valor financiado:** parcela de até **30% da renda**, em **420 meses** (35 anos), tabela Price.
- **Renda usada na conta:** um valor perto do **topo** de cada faixa do quiz: R$ 2.600, R$ 4.200, R$ 7.500, R$ 11.000 e R$ 15.000.
- **Juros ao ano:** os do Minha Casa Minha Vida da faixa da pessoa (faixa 1: 4,25%; faixa 2: 6%; faixa 3: 7,66%; faixa 4: 10%), **desde que** o imóvel esteja no programa e a faixa da pessoa não seja menor que a menor faixa que o imóvel atende. Caso contrário (ou renda acima de R$ 12.000), juros de mercado de **11,5%**.
- **Subsídio:** R$ 45 mil (faixa 1) ou R$ 15 mil (faixa 2), só quando o imóvel atende exatamente a faixa da pessoa.
- **Entrada usada na conta:** um valor perto do **piso** de cada faixa: R$ 0, 8 mil, 20 mil, 45 mil e 70 mil.

Depois, **razão = quanto consegue pagar ÷ preço de tabela**:

| Razão | Situação | Nota do orçamento | Efeito extra |
| --- | --- | :-: | --- |
| 1 ou mais | **Cabe** | 100 | Motivo "Cabe no seu orçamento…" |
| de 0,85 a 1 | **No limite** | 50 a 100 | Nota final × **0,92** e ponto de atenção "No limite do seu orçamento…" |
| abaixo de 0,85 | **Acima** | 0 a 50 (0 abaixo de 0,7) | Nota final × **0,6**, ponto de atenção "Acima do orçamento…" e **vai para o fim da lista** |

Fórmula da nota: `nota = (razão − 0,7) ÷ 0,3 × 100`, limitada entre 0 e 100. São valores de referência do MCMV: servem para ordenar as sugestões e **não substituem a simulação da Caixa**.

---

## 4. Como a nota final é calculada

```
nota final = arredondar( (soma de peso × nota) ÷ (soma dos pesos)  ×  redutores )
```

- Entram só os critérios ligados pelas respostas e que têm dado para aquele empreendimento. **Critério sem dado sai da conta** daquele empreendimento e o peso dele "se redistribui" entre os outros (ex.: Caucaia e Eusébio não têm notas de bairro).
- **Redutores** (multiplicam a nota):
  - Vai de carro e o empreendimento tem **menos de 0,5 vaga por apartamento**: × **0,85**.
  - Orçamento **no limite**: × **0,92**.
  - Orçamento **acima**: × **0,6**.
- Se nenhum critério foi ligado (ex.: trabalha de casa, de bicicleta, "tanto faz" e sem renda), todos ficam com **70**.

---

## 5. Ordem, desempate, top 5, região sugerida e selo

**Filtro:** primeiro a pergunta 1 tira quem está fora das cidades/regiões aceitas.

**Ordem:**

1. Quem está **acima do orçamento** vai para o fim, por melhor que seja a nota.
2. Entre os demais, **maior nota** primeiro (a nota já arredondada para inteiro).
3. Empate na nota: **menor tempo** até o destino.
4. Empate também no tempo (ou sem destino): **mais itens de lazer** na página oficial.
5. Empate em tudo: fica a ordem do arquivo de dados (ver auditoria).

**Top 5 com diversidade de bairro:** o resultado mostra 5 empreendimentos (o 1º em destaque, do 2º ao 5º em lista; os demais aparecem abaixo). Um segundo empreendimento do **mesmo bairro** só entra no top 5 se estiver **5 pontos ou mais** à frente do melhor candidato de outro bairro. A diversidade nunca troca um que cabe no orçamento por um que está acima. Bairros com mais de um MRV: Antônio Bezerra (Fortitudine e Mandacaru), Cocó (Farol do Atlântico, Sensia Vila do Sol e Brisa do Mar), Jangurussu (La Serena e Valparaíso) e Parque Albano, em Caucaia (Ville de Lisboa e Ville de Porto).

**Região sugerida:** para cada uma das 5 regiões, faz a média das notas dos **2 melhores** empreendimentos dela; ganha a maior média. (Eusébio só tem 1 empreendimento, então a "média" dele é a nota do Eco Park; ver auditoria.)

**Selo de compatibilidade** (a nota também aparece como "%"):

| Nota | Selo |
| --- | --- |
| 75 a 100 | **Combina muito** |
| 60 a 74 | **Combina bem** |
| 0 a 59 | **Vale conhecer** |

---

## 6. Quando um critério vira "motivo" e quando vira "ponto de atenção"

- **Motivo:** o critério tem texto, nota **70 ou mais** e não é ponto de atenção. Os motivos aparecem do mais forte para o mais fraco (peso × nota). Exemplos reais:
  - "Cerca de 30 min de ônibus até a UFC Benfica" (deslocamento; os minutos são arredondados para 5 e marcados "(estimativa)" quando não vêm da tabela de ônibus)
  - "Fica no próprio bairro Cocó, onde você vai todo dia"
  - "Uma vaga de garagem por apartamento" / "Vagas para 82% dos apartamentos"
  - "Tem tudo o que você pediu no lazer: piscina e playground"
  - "Bairro entre os 10% de Fortaleza com hospitais e postos de saúde por perto"
  - "Playground no condomínio e escolas no bairro" / "Playground para as crianças"
  - "Tem opção de apartamento com suíte"
  - "Já em construção: a mudança tende a ser mais cedo"
  - "Cabe no seu orçamento, com as condições do Minha Casa Minha Vida"
  - "Pet place para o seu bicho"
- **Ponto de atenção:**
  - Deslocamento com nota **abaixo de 30** (mais de 62 min): "Cerca de 70 min de ônibus até a Unifor".
  - Vaga: menos de 0,5 por apartamento, para quem vai de carro: "Vagas limitadas: dá para 30% dos apartamentos".
  - Orçamento no limite ou acima.
- Entre 30 e 70 o critério conta na nota, mas não aparece como texto.
- No 2º ao 5º lugar, uma linha curta explica a diferença para o 1º ("+10 min até a UFC Benfica · sem academia"). Ela compara orçamento, tempo, lazer pedido, vagas (carro), prazo ("o quanto antes") e suíte (casal). Se nada disso difere, diz "Quase empatado com o 1º".

---

## 7. De onde vem cada dado

| Dado | Fonte | Observações |
| --- | --- | --- |
| Lazer do condomínio, vagas e unidades, suíte, varanda, área, status (lançamento / em construção / pronto), coordenadas, selo MCMV | **Páginas oficiais da MRV** (`npm run data:mrv` → `data/raw/mrv/`), juntadas em `data/empreendimentos.json` por `npm run data:build` | Bairro, região e coordenada passam por curadoria manual (`data/curated/empreendimentos.json`), que vence o site. Suíte = a palavra "suíte" aparece nas plantas ou nos diferenciais. Vagas por apto = vagas ÷ unidades. |
| Lazer conferido à mão | `data/curated/lazer.json` | Fonte de verdade revisada à mão, com fonte e data de cada decisão. Vence a lista automática. Ver a seção 8. |
| Tempo de ônibus e metrô | Projeto *Dashboard de Bairros de Fortaleza* → `data/bairros.json` | **Mediana** do tempo na tabela GTFS da **ETUFOR e do Metrofor**, dia útil, saída entre 6h30 e 8h, **sem trânsito**. É medido **do bairro** do empreendimento (não da porta) até os 12 lugares mais procurados e até cada um dos 121 bairros. |
| Tempo em **Caucaia e Eusébio** | Estimativa | Não há tabela de ônibus para essas cidades. O tempo é estimado pela distância em linha reta: **23 + 4,49 × km** (ajustado nos 13 empreendimentos de Fortaleza, 144 pares; erro típico de 11 min). A tela sempre diz "(estimativa)". |
| Notas do bairro (saúde, escolas, comércio, praças e parques, mobilidade) | Projeto *Dashboard de Bairros* → `data/bairros.json` | Equipamentos do OpenStreetMap em cada bairro, transformados em **posição entre os 121 bairros** (0 a 100). É do bairro inteiro, não de um raio em volta do prédio. Caucaia e Eusébio não têm nota. **Segurança e renda do bairro ficam fora por decisão da MRV.** |
| Preço de tabela e faixas do MCMV | `data/curated/precos.json` (tabela interna MRV) | **Uso interno: nunca aparece na tela.** Só entra no critério de orçamento, que mostra apenas "cabe", "no limite" ou "acima". |

---

## 8. A regra do lazer

- **Só conta o lazer do condomínio.** O texto "Próximo a" da página oficial (shopping, academias, parques da vizinhança) descreve o **entorno** e **nunca** conta como lazer.
- Os itens da página oficial são agrupados nos 6 grupos que o quiz pergunta, mais pet place:

| Grupo do quiz | Itens da página que contam |
| --- | --- |
| Piscina | qualquer piscina (adulto, infantil, com deck) |
| Academia | academia ou fitness (ex.: "Academia Coberta") |
| Playground | playground, playbaby, espaço kids, brinquedoteca |
| Festas e churrasco | churrasqueira, espaço gourmet, espaço pizza, salão de festas, happy hour |
| Quadra ou jogos | quadra, salão de jogos, futmesa |
| Área verde | pista de caminhada, cooper, espaço piquenique, pomar, espaço zen |
| Pet place | pet place |

- **"Espaço Funcional Descoberto" (barras e rampa ao ar livre) NÃO conta como academia.** Decisão do time MRV em 07/10/2026. Na página do empreendimento ele aparece como "Espaço funcional ao ar livre".
- A fonte de verdade revisada à mão é **`data/curated/lazer.json`**: cada decisão traz `tem`, `fonte`, trecho, data da conferência e, quando falta reconferir, `pendente`. Ela vence a lista automática. A ficha de cada empreendimento mostra o que o quiz usa hoje e o que foi conferido à mão.
- A nota de lazer é "tem ou não tem" por grupo: um condomínio com academia coberta completa e outro com uma sala pequena valem o mesmo.

---

## 9. Exemplos com a conta aberta

Calculados com os dados de 08/10/2026, já com a revisão de lazer do commit 076c8b6. Para ver no app, abra `/descobrir/resultado?` seguido das respostas indicadas.

### Exemplo A: estudante da UFC Benfica, de ônibus, mora só

Respostas: só Fortaleza · UFC Benfica · ônibus · só eu · "tanto faz" · prefere não informar a renda.
`o=fortaleza&d=ufc_benfica&t=onibus&m=so&z=tanto_faz`

Só **um critério** está ligado: deslocamento (peso 4). A nota final é a própria nota do tempo.

| Posição | Empreendimento | Tempo até a UFC Benfica | Conta | Nota | Selo |
| :-: | --- | :-: | --- | :-: | --- |
| 1º | Parque Marista (Centro) | 30 min | (80 − 30) ÷ 60 × 100 = 83,3 | **83** | Combina muito |
| 2º | Flor do Sertão (Jacarecanga) | 33 min | (80 − 33) ÷ 60 × 100 = 78,3 | **78** | Combina muito |
| 3º | Fortitudine (Antônio Bezerra) | 41 min | 65 | **65** | Combina bem |
| 4º | Mandacaru (Antônio Bezerra) | 41 min | 65 | **65** | Combina bem |
| 5º | Torre do Mar (Maraponga) | 46 min | 56,7 | **57** | Vale conhecer |

- **Por que o 1º ganhou do 2º:** 3 minutos a menos de ônibus = 5 pontos a mais.
- **Fortitudine × Mandacaru:** empate total (mesma nota, mesmo tempo, 7 itens de lazer cada). O Fortitudine fica na frente só porque vem antes no arquivo de dados.
- **Diversidade:** o Mandacaru é do mesmo bairro do Fortitudine, mas entra no top 5 porque está 8 pontos à frente do próximo de outro bairro (Torre do Mar, 57), mais que os 5 exigidos.

### Exemplo B: casal que vai de carro para Messejana, com renda informada

Respostas: Fortaleza ou Região Metropolitana · Messejana · carro · eu e meu par · piscina e área verde · saúde por perto · em 1 a 2 anos · renda de R$ 4.700 a R$ 8.600 · entrada até R$ 10 mil.
`o=metropolitana&d=messejana&t=carro&m=casal&l=piscina,verde&b=saude&z=medio&r=r3&e=e1`

| Critério | Peso | Forte Alencar (1º) | Reserva Brisa do Mar (2º) |
| --- | :-: | --- | --- |
| Orçamento | 5 | 100 (cabe) | 100 (cabe) |
| Deslocamento | 4 | 78,3 (33 min) | 41,7 (55 min) |
| Vaga | 2,5 | 100 (1,03 vaga por apto) | 82 (0,82 vaga por apto) |
| Lazer: piscina + área verde | 2 | 100 | 100 |
| Bairro: saúde | 1,5 | 70 (Cambeba) | 79 (Cocó) |
| Casal: suíte | 1 | 100 (tem) | 40 (não tem) |
| Prazo 1 a 2 anos | 0,5 | 80 (lançamento) | 100 (em construção) |
| **Soma de peso × nota** | **16,5** | **1.508,3** | **1.280,2** |
| **Nota final** | | 1.508,3 ÷ 16,5 = **91** (Combina muito) | 1.280,2 ÷ 16,5 = **78** (Combina muito) |

- **Por que o Forte Alencar ganhou:** 22 minutos a menos até Messejana (+146,7 pontos ponderados), vaga para todos (+45) e opção de suíte (+60). O Brisa do Mar só leva vantagem em saúde do bairro (−13,5) e prazo (−10). Saldo: +228 pontos ponderados ÷ 16,5 = **+14 na nota**.
- Top 5: Forte Alencar 91, Brisa do Mar 78, Reserva da Lagoa 75, Porto das Marés 72, Torre do Mar 71.
- **Efeito da vaga:** o Valparaíso fica a só 28 min de Messejana e faria 78, mas tem 0,37 vaga por apto: a nota é multiplicada por 0,85 e cai para **66**, fora do top 5. O Porto das Marés, a 77 min, fica à frente dele por ter vaga para todos, suíte e o lazer pedido.

### Exemplo C: família que vai à Unifor de ônibus, com renda de faixa 2

Respostas: Fortaleza ou Região Metropolitana · Unifor · ônibus · família com crianças + pet · piscina e playground · escolas · o quanto antes · renda de R$ 2.850 a R$ 4.700 · entrada de R$ 10 a 30 mil.
`o=metropolitana&d=unifor&t=onibus&m=filhos&p=1&l=piscina,kids&b=escolas&z=logo&r=r2&e=e2`

| Critério | Peso | Valparaíso (1º) | Eco Park (2º) |
| --- | :-: | --- | --- |
| Orçamento | 5 | 100 (cabe) | 100 (cabe) |
| Deslocamento | 4 | 13,3 (72 min) | 0 (91 min, estimativa) |
| Lazer: piscina + playground | 2 | 100 | 100 |
| Bairro: escolas | 1,5 | 58 (Jangurussu) | sem dado: **sai da conta** |
| Filhos (só playground, porque escolas já contou na pergunta 6) | 1 | 100 | 100 |
| Prazo o quanto antes | 1,5 | 100 (em construção) | 100 (em construção) |
| Pet | 0 | só motivo | só motivo |
| **Soma** | | 1.090,3 ÷ 15 = **73** (Combina bem) | 950 ÷ 13,5 = **70** (Combina bem) |

- **Por que o Valparaíso ganhou:** é 19 minutos mais perto da Unifor. Mesmo assim, o tempo dele (72 min) vira ponto de atenção.
- **Por que os do Cocó (35 min da Unifor) não aparecem no topo:** com essa renda, os três do Cocó ficam **acima do orçamento** (eles atendem só as faixas 3 ou 4 do MCMV; para quem é da faixa 2, a conta usa juros de mercado e não há subsídio) e vão para o fim, com nota × 0,6. Sem informar a renda, Sensia Vila do Sol e Brisa do Mar ficariam em 1º e 2º com 77.
- **Região sugerida: Eusébio.** O Eco Park sozinho tem 70, enquanto a média dos 2 melhores do Sul é (73 + 61) ÷ 2 = 67. Isso acontece mesmo com o Eco Park a 91 min da Unifor (ver auditoria).

---

## 10. Onde mudar os números

Todos os pesos e limites estão em `lib/scoring/config.ts` (PESOS, TEMPO, VAGA, PRAZO, SUITE, ORCAMENTO, FINANCIAMENTO, RENDA, ENTRADA, LIMIAR_MOTIVO, LIMIAR_ATENCAO, FAIXAS, DIVERSIDADE_FOLGA, TOP). Depois de mudar, rode `npm test` (os perfis de referência em `tests/scoring.test.ts` mostram o efeito no ranking) e `npm run data:ficha` (atualiza a ficha).
