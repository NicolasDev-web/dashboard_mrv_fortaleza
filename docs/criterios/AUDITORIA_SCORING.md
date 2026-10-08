# Auditoria do cálculo de recomendação

Pontos do cálculo (`lib/scoring/`) e dos textos que podem levar a uma **escolha errada** ou a uma **frase enganosa** para o cliente. Este documento só descreve e propõe: **nenhuma regra, peso ou texto foi alterado**. Cada item traz onde está no código, um exemplo real e uma proposta de correção para decisão do time.

Como funciona o cálculo: [COMO_ESCOLHEMOS.md](COMO_ESCOLHEMOS.md). Dados de cada empreendimento: [FICHA_EMPREENDIMENTOS.md](FICHA_EMPREENDIMENTOS.md).

Exemplos calculados com os dados de 08/10/2026. Para ver no app: `/descobrir/resultado?` + as respostas indicadas. Alguns números de frequência vêm de um teste com **29.700 combinações de respostas** (11 destinos × 3 meios de transporte × 3 perfis de moradores × 5 escolhas de lazer × 4 de bairro × 3 prazos × 5 de renda/entrada). Esse teste mostra tendências do cálculo; não é a distribuição real de clientes.

## Resumo por prioridade

| # | Ponto | Tipo | Prioridade |
| :-: | --- | --- | :-: |
| 1 | Falta de dado do bairro vira vantagem (Caucaia e Eusébio) | Escolha errada | **Alta** |
| 2 | Região sugerida favorece o Eusébio, que tem 1 empreendimento só | Escolha errada | **Alta** |
| 3 | Quem vai de carro vê tempo de ônibus como se fosse de carro | Texto enganoso + escolha | **Alta** |
| 4 | "Quase empatado com o 1º" com 30 pontos de diferença | Texto enganoso | **Alta** |
| 5 | "Pet place para o seu bicho" sem checar se tem pet place | Texto sem checagem | Média |
| 6 | "Área verde para caminhar" quando só há espaço piquenique | Texto enganoso | Média |
| 7 | Playground conta duas vezes e gera motivo repetido | Peso dobrado + texto | Média |
| 8 | "Ônibus fácil" conta duas vezes para quem anda de ônibus | Peso dobrado | Média |
| 9 | Nota "100%" com um único critério | Texto enganoso | Média |
| 10 | Orçamento que cabe para todos infla o selo | Selo enganoso | Média |
| 11 | Renda calculada pelo topo da faixa | Escolha otimista | Média |
| 12 | Empates resolvidos pela ordem do arquivo | Escolha arbitrária | Média |
| 13 | Decisão de lazer "pendente" já conta como certa (Forte Alencar) | Dado não confirmado | Média |
| 14 | Lazer "tem ou não tem"; família olha só playground | Critério raso | Baixa |
| 15 | Outros textos de lazer que dizem mais do que o dado | Texto enganoso | Baixa |
| 16 | Tempo estimado de Caucaia/Eusébio pesa igual a tempo medido | Incerteza escondida | Baixa |
| 17 | "Playground no condomínio e escolas no bairro" checa só escolas | Texto sem checagem | Baixa |
| 18 | Ícone de academia para o espaço funcional | Visual enganoso | Corrigido |
| 19 | README e PLANO desatualizados | Documentação | Baixa |

---

## 1. Falta de dado do bairro vira vantagem (Caucaia e Eusébio) · Alta

**Onde:** `lib/scoring/score.ts:184` (mobilidade), `:206` (temas de bairro), `:213-216` (filhos). Ville de Lisboa, Ville de Porto e Eco Park têm `bairroId = null`, sem notas de bairro.

**O que acontece:** quando o empreendimento não tem a nota, o critério **sai da conta só para ele**. Os de Fortaleza são avaliados nesses temas (às vezes com nota baixa); os de Caucaia e Eusébio, não. Na prática, "sem dado" vale mais que uma nota real média.

**Exemplos:**

- Trabalha de casa, anda de **ônibus**, quer mudar logo: `o=metropolitana&d=casa&t=onibus&m=so&z=logo`. **Eco Park 100% "Combina muito"** em 1º (só o prazo contou), à frente do Mandacaru (85), cujo bairro está entre os 35% com mais ônibus. Justo para quem depende de ônibus, o 1º é o que fica no Eusébio.
- Trabalha de casa, ônibus, quer **saúde por perto**, renda R$ 4.700–8.600: `o=metropolitana&d=casa&t=onibus&m=so&b=saude&z=tanto_faz&r=r3&e=e2`. **Ville de Lisboa, Ville de Porto e Eco Park, todos com 100**, à frente do Parque Marista (97), que está no Centro, entre os 5% com mais ônibus e os 10% com mais saúde.
- Família com crianças: no critério "filhos", os de Fortaleza fazem a média de playground com escolas do bairro (Cocó: (100 + 16) ÷ 2 = 58); os de Caucaia/Eusébio ficam só com o playground (100).
- No teste de 29.700 combinações, **Eco Park (18%) e Ville de Porto (16%) são os dois que mais aparecem em 1º lugar**.

**Correção proposta (escolher uma):**

- a) Dar uma nota **neutra** quando falta dado (ex.: 50, ou a mediana dos 121 bairros), em vez de tirar o critério.
- b) Calcular as notas para esses 3 com os equipamentos do OpenStreetMap num raio de 1 km do empreendimento (já previsto no `docs/spec/PLANO.md`, seção 10).
- c) No mínimo, mostrar um ponto de atenção: "Sem dados de saúde e escolas para Caucaia; não entrou na conta".

---

## 2. Região sugerida favorece o Eusébio · Alta

**Onde:** `lib/scoring/score.ts:289-301`. A região sugerida é a de maior **média dos 2 melhores** empreendimentos. O Eusébio só tem o Eco Park, então a "média" é a nota dele sozinho; as outras regiões têm o 2º colocado puxando a média para baixo. Notas de empreendimentos "acima do orçamento" também entram.

**Exemplo:** família que vai à Unifor de ônibus, renda R$ 2.850–4.700 (`o=metropolitana&d=unifor&t=onibus&m=filhos&p=1&l=piscina,kids&b=escolas&z=logo&r=r2&e=e2`). Eco Park 70 → Eusébio = 70. Sul: (73 + 61) ÷ 2 = 67. A tela mostra **"Região Eusébio"**, mesmo com o Eco Park a cerca de 90 min (estimativa) da Unifor e o 1º colocado (Valparaíso) sendo do Sul.

No teste de 29.700 combinações, **Eusébio é a região mais sugerida (27%)**, e em 2.553 desses casos o 1º colocado nem é do Eusébio.

**Correção proposta:** a) para região com 1 empreendimento, completar a média com a nota do 2º melhor da cidade toda (ou exigir 2); b) ignorar quem está acima do orçamento; c) ou simplesmente sugerir a região do 1º colocado.

---

## 3. Quem vai de carro vê tempo de ônibus como se fosse de carro · Alta

**Onde:** `lib/scoring/score.ts:156` (`const meio = r.transporte === "carro" ? "" : " de ônibus"`). A conta de deslocamento usa sempre o **tempo de ônibus** (tabela GTFS), mas para quem marcou "carro ou moto" o texto tira o "de ônibus".

**Exemplo:** casal de carro para Messejana (`o=metropolitana&d=messejana&t=carro&m=casal&l=piscina,verde&b=saude&z=medio&r=r3&e=e1`): o motivo do Forte Alencar diz "Cerca de 35 min até Messejana". São 33 min **de ônibus**; de carro é bem menos. Para quem vai de carro, o ranking também ordena por tempo de ônibus, que pode não refletir a distância de carro (ex.: lugares com ônibus ruim mas perto de carro).

**Correção proposta:** a) curto prazo: manter "de ônibus" no texto para todos ("Cerca de 35 min de ônibus até Messejana"); b) depois: tabela de tempo de carro (ou distância por rua) para quem marca carro/moto.

---

## 4. "Quase empatado com o 1º" com 30 pontos de diferença · Alta

**Onde:** `lib/scoring/apresentacao.ts:58`. A linha que explica a diferença para o 1º só olha orçamento, tempo, lazer pedido, vagas (carro), prazo "o quanto antes" e suíte (casal). Se nenhum desses difere, escreve "Quase empatado com o 1º", **qualquer que seja a diferença de nota**. Notas de bairro, mobilidade, filhos, prazo "1 a 2 anos" e diferenças de orçamento dentro de "cabe" não são citadas.

**Exemplo:** `o=metropolitana&d=casa&t=onibus&m=so&z=logo`: Eco Park 100; Mandacaru 85, Torre do Mar 82, Reserva da Lagoa 78 e Sensia **70**, todos com "Quase empatado com o 1º". No teste de combinações, isso acontece em 1.631 casos com 10 pontos ou mais de diferença, todos de quem trabalha de casa (sem destino, a linha não tem tempo para comparar).

**Correção proposta:** só dizer "quase empatado" quando a diferença for menor que 5 pontos; acima disso, citar o critério com a maior diferença de peso × nota (ex.: "bairro com menos ônibus").

---

## 5. "Pet place para o seu bicho" sem checar se tem pet place · Média

**Onde:** `lib/scoring/score.ts:239`: `if (r.pet) lista.push({ id: "pet", peso: 0, nota: 100, motivo: "Pet place para o seu bicho" })`. Não confere `e.lazer.includes("pet")`.

**Hoje:** os 16 têm pet place, então a frase é verdadeira. Mas qualquer empreendimento novo (ou uma correção em `data/curated/lazer.json` que tire o pet place) passaria a mostrar a frase sem ter o item. Além disso, como todos têm, o motivo não diferencia ninguém e ocupa espaço de um motivo útil.

**Correção proposta:** `if (r.pet && e.lazer.includes("pet"))`; sem pet place, virar ponto de atenção ("Sem pet place no condomínio"). Opcional: mostrar o motivo só no 1º colocado.

---

## 6. "Área verde para caminhar" quando só há espaço piquenique · Média

**Onde:** frase em `lib/quiz/types.ts:49` (`verde: "área verde para caminhar"`); grupo "verde" em `scripts/lazer-regras.ts:31` inclui **piquenique, pomar e espaço zen**, além de caminhada e cooper.

**Exemplo:** Reserva Brisa do Mar, Forte Alencar, Porto das Marés, Sensia Vila do Sol e Flor do Sertão têm "área verde" **só por causa do Espaço Piquenique**, sem pista de caminhada. No exemplo do casal de carro (item 3), o Brisa do Mar recebe "Tem tudo o que você pediu no lazer: piscina e área verde para caminhar", e a Reserva da Lagoa recebe "sem área verde para caminhar" na comparação com o Forte Alencar, que também não tem pista.

**Correção proposta:** a) trocar a frase para "área verde ou espaço ao ar livre"; ou b) separar "pista de caminhada" de "espaço piquenique/zen" e só usar "para caminhar" quando houver pista.

---

## 7. Playground conta duas vezes e gera motivo repetido · Média

**Onde:** `lib/scoring/score.ts:189-204` (lazer) e `:212-223` (filhos). Quem marca "Família com crianças" **e** "Playground" na pergunta 5 tem o playground contado no lazer (peso 2) e de novo no critério filhos (peso 1). Para escolas, o código já evita a contagem dupla (`:215`); para playground, não.

**Exemplo:** `o=metropolitana&d=casa&t=bike&m=filhos&l=kids&b=escolas,saude&z=tanto_faz`: os motivos do 1º são "Tem playground, que você pediu" **e** "Playground para as crianças", a mesma informação duas vezes.

**Correção proposta:** se a pessoa pediu playground na pergunta 5, o critério filhos usa só as escolas (ou sai da conta), e o motivo repetido some.

---

## 8. "Ônibus fácil" conta duas vezes para quem anda de ônibus · Média

**Onde:** `lib/scoring/score.ts:184` (mobilidade, peso 1,5, para ônibus sem destino) e `:206` (tema "Ônibus fácil" da pergunta 6, peso 1,5). Os dois usam a **mesma nota** do bairro.

**Exemplo:** `o=metropolitana&d=casa&t=onibus&b=mobilidade`: a nota de mobilidade do bairro pesa 3, o dobro de qualquer outro tema de bairro, e gera quase a mesma frase duas vezes: "Bairro entre os 5% de Fortaleza com mais opções de ônibus e metrô" e "Bairro entre os 5% de Fortaleza com opções de ônibus e metrô" (Parque Marista).

**Correção proposta:** não ligar o critério mobilidade quando a pessoa já escolheu "Ônibus fácil" na pergunta 6 (o mesmo cuidado que já existe para escolas).

---

## 9. Nota "100%" com um único critério · Média

**Onde:** `components/resultado/Resultado.tsx:128` mostra a nota como "%"; `lib/scoring/score.ts:249` faz a média só dos critérios ligados.

**Exemplo:** no item 1, o Eco Park aparece com **"100% Combina muito"** porque só o prazo foi avaliado. O cliente lê "100% de compatibilidade", quando a conta só olhou um aspecto (e deixou de fora os que não tinham dado). O `docs/spec/PLANO.md` (riscos) já sugeria "selo em faixas em vez de % exato".

**Correção proposta:** mostrar só o selo ("Combina muito") no resultado e deixar o número para o detalhe; ou não passar de "Combina bem" quando menos de 2 critérios com peso foram avaliados.

---

## 10. Orçamento que cabe para todos infla o selo · Média

**Onde:** `lib/scoring/config.ts:15` (peso 5) e `lib/scoring/score.ts:249`. Quando o imóvel cabe, o orçamento soma 5 × 100 à média. Entre os que cabem, isso não muda a ordem, mas **empurra todas as notas para cima**, e o selo sobe junto.

**Exemplo:** família que vai à Unifor (item 2): o Valparaíso tem nota de deslocamento 13 (72 min, ponto de atenção) e mesmo assim sai com **73, "Combina bem"**, quase "Combina muito". Sem o orçamento na média, a nota dele seria 59, "Vale conhecer".

**Correção proposta:** usar o orçamento só para **reduzir** (limite/acima) e ordenar, e calcular o selo sem ele; ou ajustar as faixas do selo para quem informa renda.

---

## 11. Renda calculada pelo topo da faixa · Média

**Onde:** `lib/scoring/config.ts:37-43`. Para "Até R$ 2.850" a conta usa R$ 2.600; para "R$ 2.850 a 4.700", R$ 4.200; e assim por diante. A entrada, ao contrário, usa o piso da faixa.

**Exemplo:** uma família que ganha R$ 1.900 marca "Até R$ 2.850" e é calculada como se ganhasse R$ 2.600. O valor financiado é proporcional à renda, então a conta supõe cerca de **37% a mais de financiamento** do que ela teria. O quiz pode dizer "Cabe no seu orçamento" quando não cabe.

**Correção proposta:** usar o meio da faixa (ou um valor mais conservador nas faixas 1 e 2) e manter o aviso de que não substitui a simulação da Caixa. Vale também mostrar "no limite" de forma mais conservadora para a faixa 1.

---

## 12. Empates resolvidos pela ordem do arquivo · Média

**Onde:** `lib/scoring/score.ts:250` arredonda a nota **antes** de ordenar; `:264-272` desempata por tempo e depois pelo **número bruto de itens de lazer**; se ainda empatar, vale a ordem de `data/empreendimentos.json`.

**Exemplos:**

- Estudante da UFC Benfica (`o=fortaleza&d=ufc_benfica&t=onibus&m=so&z=tanto_faz`): Fortitudine e Mandacaru empatam em tudo (65, 41 min, 7 itens). O Fortitudine fica na frente só por vir antes no arquivo.
- Sem nenhum critério ligado (trabalha de casa, bicicleta, "tanto faz", sem renda), os 16 ficam com 70 e o **Parque Marista é sempre o 1º** por ter a lista de lazer mais longa.
- No teste de combinações, 1º e 2º têm a mesma nota em 13% dos casos.
- A contagem de itens soma "Piscina Adulto" e "Piscina Infantil" como 2, e conta itens que a pessoa não pediu.

**Correção proposta:** ordenar pela nota sem arredondar; desempatar por algo explicável (ex.: número de grupos de lazer pedidos que o condomínio tem, depois vagas por apto); e, sem critérios, mostrar uma mensagem pedindo mais respostas em vez de um "Combina bem" igual para todos.

---

## 13. Decisão de lazer "pendente" já conta como certa (Forte Alencar) · Média

**Onde:** `data/curated/lazer.json` (Forte Alencar → academia `tem: true, pendente: true`); `scripts/lazer-regras.ts:233` só gera **aviso** para pendentes.

**O que acontece:** a academia do Forte Alencar entrou no quiz com base na informação do time MRV, mas a própria conferência registra que a lista oficial, a legenda da implantação e as buscas não citam academia. Se não houver academia, o quiz vai dizer "Tem academia, que você pediu" e pôr o Forte Alencar à frente de quem tem.

**Correção proposta:** reconferir na página oficial o quanto antes; até lá, decidir se "pendente" deve contar no ranking ou só na ficha.

---

## 14. Lazer "tem ou não tem"; família olha só playground · Baixa

**Onde:** `lib/scoring/score.ts:190-191` (fração dos grupos pedidos) e `:213` (filhos = só o grupo "kids").

**O que acontece:** "Academia Coberta" completa e uma sala pequena valem o mesmo; um condomínio com 18 itens de lazer e outro com 6 empatam se os dois têm o que foi pedido. Para "Família com crianças", piscina infantil e espaço kids extra não contam: sem playground, a nota de filhos fica em no máximo 50.

**Correção proposta:** manter simples, mas avaliar um bônus pequeno para piscina infantil no critério filhos; e documentar para o time comercial que a nota de lazer não mede tamanho nem qualidade.

---

## 15. Outros textos de lazer que dizem mais do que o dado · Baixa

**Onde:** `lib/quiz/types.ts:47-48`.

- `esportes: "quadra ou salão de jogos"`: o Ville de Lisboa entra no grupo só por ter **futmesa**.
- `festas: "espaço de festas e churrasco"`: Fortitudine, Flor do Sertão, Ville de Lisboa, La Serena, Ville de Porto e Valparaíso têm só **churrasqueira** (e às vezes happy hour), sem salão de festas. A frase com "e" sugere os dois.

**Correção proposta:** "quadra, jogos ou futmesa"; "churrasqueira ou espaço de festas".

---

## 16. Tempo estimado de Caucaia/Eusébio pesa igual a tempo medido · Baixa

**Onde:** `lib/scoring/score.ts:89` e `lib/scoring/config.ts:63` (23 + 4,49 × km, erro típico de 11 min).

**O que acontece:** a fórmula foi ajustada com ônibus **dentro de Fortaleza**. A viagem de Caucaia ou do Eusébio depende de linhas metropolitanas, que não estão na tabela da ETUFOR; o tempo real tende a ser maior. Com 11 min de erro típico, a nota de deslocamento pode variar cerca de 18 pontos. A tela avisa "(estimativa)", mas a nota não.

**Correção proposta:** buscar a tabela das linhas metropolitanas; enquanto isso, somar uma folga (ex.: +10 min) ou reduzir o peso do deslocamento estimado.

---

## 17. "Playground no condomínio e escolas no bairro" checa só escolas · Baixa

**Onde:** `lib/scoring/score.ts:221`. O texto é escolhido quando as escolas do bairro têm nota 70 ou mais, **sem conferir se há playground**.

**Hoje:** não aparece errado, porque sem playground a nota de filhos fica em no máximo 50 e não vira motivo. Mas basta mudar um peso para a frase aparecer num condomínio sem playground.

**Correção proposta:** exigir `e.lazer.includes("kids")` também nessa frase; sem playground, usar "Escolas no bairro".

---

## 18. Ícone de academia para o espaço funcional · Corrigido

**Onde:** `components/empreendimento/Blocos.tsx` (`ICONE_LAZER`). Antes, `/academia|funcional|crossfit/` mostrava um **haltere** para o "Espaço Funcional Descoberto", sugerindo academia. **Corrigido no commit 076c8b6:** funcional e crossfit ganharam outro ícone, o item aparece como "Espaço funcional ao ar livre" e deixou de contar como academia na nota. Fica aqui só como registro.

---

## 19. README e PLANO desatualizados · Baixa

- `README.md:3` fala em "os 3 empreendimentos"; o código mostra 5 (`TOP = 5`).
- `docs/spec/PLANO.md`, seção 11, traz números antigos: deslocamento peso 3 (hoje 4), 100 até 15 min e 0 em 75 min (hoje 20 e 80), selo 80/65 (hoje 75/60), diversidade de 8 pontos (hoje 5), 7 perguntas (hoje 9, com orçamento).

**Correção proposta:** apontar o README e o PLANO para `docs/criterios/COMO_ESCOLHEMOS.md` como referência atual dos critérios.
