# Conferência do lazer dos 16 empreendimentos

Conferido em 08/10/2026. O motivo foi uma reclamação do time MRV: o Forte Alencar aparecia sem academia, e o site oficial, segundo o time, diz que tem.

## Por que o erro passou

- `scripts/extract-mrv.ts` guardava só a lista `diferenciaisNew` da página oficial e descartava o resto do JSON.
- `scripts/build-data.ts` montava o `lazer` só a partir dessa lista. Não havia nenhuma conferência com a descrição, a implantação ou as fotos.
- Itens de lazer cadastrados em outra categoria ficavam de fora. Exemplo: o Playground do Ville de Lisboa vem como "Diferenciais de Card".
- "Espaço Funcional Descoberto" contava como academia.

## O que mudou no pipeline

| Onde | Mudança |
| --- | --- |
| `scripts/extract-mrv.ts` | Além do resumo `NN.json`, grava o item inteiro da página em `data/raw/mrv/NN.completo.json`. Isso vale a partir da próxima extração, porque hoje não há acesso ao site. |
| `data/curated/lazer.json` (novo) | Decisões revisadas à mão, por empreendimento e por grupo: `{ tem, fonte, trecho, conferidoEm, pendente?, obs? }`. Também guarda `itensExtras`, que aparecem na lista de itens, e correções de tipo e alt de fotos. A `fonte` é obrigatória em tudo. |
| `scripts/lazer-regras.ts` (novo) | Contém as regras e as travas, usadas pelo build e pelos testes. |
| `scripts/build-data.ts` | Aplica `lazer.json` por cima do automático e **falha** em três casos: (1) um termo de lazer aparece nos textos oficiais (descrição, apresentação, qualquer diferencial e, quando existir, o `NN.completo.json`) sem o grupo no lazer e sem decisão em `lazer.json`; (2) existe foto de tipo piscina, fitness, kids, pet, gourmet ou festas sem o grupo correspondente e sem decisão; (3) uma decisão, item extra ou correção de foto não tem fonte. Uma decisão `pendente: true` só gera aviso. |
| Grupos | `academia` agora reconhece só `academia` e `fitness`. "Funcional" e "crossfit" saíram. Itens com nome de lazer em outra categoria agora entram (Playground, Playbaby, Mini Quadra, Pet Care). "Espaço Funcional Descoberto" aparece na tela como **"Espaço funcional ao ar livre"**. |
| Entorno | O campo `proximoA` ("Próximo a…") **nunca** entra no lazer. Há um teste para isso em `tests/dados.test.ts`. |
| UI | Em `components/empreendimento/Blocos.tsx`, o ícone de haltere fica só para academia e fitness. Espaço funcional e crossfit usam outro ícone. |

## Matriz final (16 × lazer)

Legenda: ✔ tem · ✖ não tem · ▲ passou a ter · ▼ deixou de ter. As fontes de cada linha estão na tabela seguinte.

| # | Empreendimento | Piscina | Academia | Kids/playground | Festas/gourmet | Esportes | Verde | Pet |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Residencial Fortitudine | ✔ | ✖ ▼ | ✔ | ✔ | ✖ | ✖ | ✔ |
| 2 | Residencial Flor do Sertão | ✔ | ✔ | ✔ | ✔ | ✖ | ✔ | ✔ |
| 3 | Ville de Lisboa | ✔ | ✖ ▼ | ✔ ▲ | ✔ | ✔ | ✔ | ✔ |
| 4 | Reserva da Lagoa | ✔ | ✖ | ✔ | ✔ | ✖ | ✖ | ✔ |
| 5 | Residencial La Serena | ✔ | ✖ | ✔ | ✔ | ✖ | ✔ | ✔ |
| 6 | Forte Alencar | ✔ | ✔ ▲ (pendente) | ✔ | ✔ | ✖ | ✔ | ✔ |
| 7 | Parque Marista | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| 8 | Residencial Farol do Atlântico | ✔ | ✔ | ✔ | ✔ | ✖ | ✖ | ✔ |
| 9 | Sensia Reserva Vila do Sol | ✔ | ✔ ▲ | ✔ | ✔ | ✖ | ✔ | ✔ |
| 10 | Ville de Porto | ✔ | ✖ ▼ | ✔ | ✔ | ✖ | ✔ | ✔ |
| 11 | Torre do Mar | ✔ ▲ | ✖ | ✔ | ✔ | ✖ | ✖ | ✔ |
| 12 | Porto das Marés | ✔ | ✖ | ✔ | ✔ | ✖ | ✔ | ✔ |
| 13 | Residencial Mandacaru | ✔ | ✔ | ✔ | ✔ | ✖ | ✖ | ✔ |
| 14 | Reserva Brisa do Mar | ✔ | ✖ | ✔ | ✔ | ✖ | ✔ | ✔ |
| 15 | Residencial Valparaíso | ✔ | ✖ | ✔ | ✔ | ✖ | ✔ | ✔ |
| 16 | Eco Park | ✔ | ✖ | ✔ | ✔ | ✖ | ✖ | ✔ |

### Fontes por empreendimento

Siglas: **L** é a lista oficial (`data/raw/mrv/NN.json`, extraída em 05/10/2026), **D** a descrição oficial, **I** a legenda da implantação oficial (foto `NN-xx`), **F** as fotos da galeria e **W** a busca na web.

| # | Empreendimento | Fontes e observações |
| --- | --- | --- |
| 1 | Fortitudine | L + D. **Não há imagem de implantação.** A foto F 01-07 (antes "Espaço fitness") mostra barras e rampa ao ar livre, ou seja, o espaço funcional. Ela foi reclassificada como lazer. W: anúncios chamam o espaço de "academia ao ar livre" e um deles cita piquenique (não é fonte oficial, não foi aplicado). |
| 2 | Flor do Sertão | L ("Academia Coberta") + I 02-17 (8 Academia, 11 Espaço Funcional, 14 Horta, 16 Piquenique). A foto F 02-03 (antes "Espaço fitness") é o espaço funcional ao ar livre e foi reclassificada. A academia continua, porque vem de L e de I. |
| 3 | Ville de Lisboa | L (o Playground vem como "Diferenciais de Card"; Playbaby, Futmesa, Happy Hour e Espaço Zen vêm sem tipo) + I 03-19 (1 Playground, 2 Playbaby, 8 Funcional, 18 Pista de Caminhada) + D. A foto F 03-08 é o funcional ao ar livre e foi reclassificada. |
| 4 | Reserva da Lagoa | L + I 04-17. Confere. |
| 5 | La Serena | L + I 05-12 (inclui Pista de Cooper). Confere. |
| 6 | Forte Alencar | L + I 06-05 (19 itens, **sem academia**; inclui Previsão de Pomar). **A academia entra por decisão do time MRV** (site oficial, informado em 07/10/2026), com `pendente: true`. Veja as pendências abaixo. |
| 7 | Parque Marista | L + I 07-11 (5 Academia, 18 Sala de Jogos, 19 Fitness, 20 Mini Quadra) + D. A foto F 07-05 (antes "Espaço fitness") mostra uma **quadra** e foi reclassificada como lazer ("Quadra recreativa"). |
| 8 | Farol do Atlântico | L ("Academia Coberta" e "Espaço Funcional Descoberto") + I 08-17 (10 Crossfit, 12 Academia Coberta) + D ("academia coberta e espaço crossfit"). Confere. |
| 9 | Sensia Reserva Vila do Sol | L (sem academia) + **D ("lazer premium: piscina, espaço gourmet, academia…")** + **I 09-15 (19 Academia)**. W: anúncios citam "Academia" ou "Fitness coberto". A academia entra. |
| 10 | Ville de Porto | L + I 10-16 (3 Espaço Funcional, 8 Piscina Infantil, 11 Pista de Caminhada, 12 Piquenique) + D ("piscinas adulto e infantil… espaço funcional"). A academia sai. Piscina Infantil e Pista de Caminhada entram como itens extras. |
| 11 | Torre do Mar | L (Espaço Gourmet, Pet Place, Playground, Salão de festas, **sem piscina**) + **D ("piscina adulto e infantil")** + **I 11-15 (14 Piscina Infantil, 15 Piscina Adulto)** + **F 11-06 e 11-07 (piscinas)**. W: anúncios confirmam as piscinas. A piscina entra. |
| 12 | Porto das Marés | L + I 12-02 (inclui Previsão de Pomar). Confere. |
| 13 | Mandacaru | L ("Academia Coberta") + D ("duas áreas fitness") + I 13-16 (2 Crossfit, 3 Academia Coberta). F 13-07 mostra o crossfit ao ar livre com a academia ao fundo e F 13-08 a academia coberta; só o texto alternativo foi corrigido. |
| 14 | Reserva Brisa do Mar | L + I 14-22 (inclui Pomar). Confere. |
| 15 | Valparaíso | L + I 15-01 (Pista de Cooper) + D ("área verde", "pista de cooper"). Confere. |
| 16 | Eco Park | L + I 16-17. Confere. |

## O que mudou em relação ao dado anterior

| Empreendimento | Antes | Agora | Fonte |
| --- | --- | --- | --- |
| Forte Alencar | sem academia | **com academia (pendente)**, item "Academia" na lista | Time MRV (site oficial, informado em 07/10/2026). Ainda não confirmado. |
| Sensia Reserva Vila do Sol | sem academia | **com academia**, item "Academia" | D + I 09-15 (item 19) |
| Torre do Mar | sem piscina | **com piscina**, itens "Piscina Adulto" e "Piscina Infantil" | D + I 11-15 (itens 14 e 15) + F 11-06 e 11-07 |
| Ville de Lisboa | sem kids | **com kids**, itens "Playground" e "Playbaby" | L ("Diferenciais de Card") + I 03-19 (itens 1 e 2) + F 03-11 |
| Residencial Fortitudine | academia (pelo funcional) | **sem academia** | Decisão do time MRV: funcional não é academia |
| Ville de Lisboa | academia (pelo funcional) | **sem academia** | Idem + I 03-19 (item 8, "Funcional") |
| Ville de Porto | academia (pelo funcional) | **sem academia**, mais os itens "Piscina Infantil" e "Pista de Caminhada" | Idem + I 10-16 (itens 3, 8 e 11) |
| Farol, Fortitudine, Lisboa, Porto | item "Espaço Funcional Descoberto" | "Espaço funcional ao ar livre" | Decisão do time MRV |
| Parque Marista | Playbaby, Mini Quadra e Pet Care como "outros diferenciais" | Na lista de lazer (grupos sem mudança) | L |
| Fotos | 01-07, 02-03 e 03-08 como "Espaço fitness"; 07-05 como "Espaço fitness" | 01-07, 02-03 e 03-08: "Espaço funcional ao ar livre" (tipo lazer); 07-05: "Quadra recreativa" (tipo lazer); 13-07 e 13-08: textos alternativos mais precisos | Conferência visual (correções em `data/curated/lazer.json` → `fotos`) |

Efeito no quiz: quem marca "academia" agora vê o Sensia Reserva Vila do Sol e o Forte Alencar subirem, e o Fortitudine, o Ville de Lisboa e o Ville de Porto caírem. Os perfis de referência de `tests/scoring.test.ts` não mudaram, e nenhum teste precisou de ajuste.

## Conflitos encontrados

1. **Forte Alencar × academia.** Três fontes contradizem a afirmação do time: a lista oficial (05/10/2026), a legenda oficial da implantação (06-05, 19 itens) e a busca na web de 08/10/2026. As páginas encontradas (MRV, apto.vc, Memude, imobiliárias) citam "academias" **só no entorno** ("supermercados, academias, farmácias…"), que é o mesmo texto do campo "Próximo a". Pode ser que o "tem academia" lido no site seja exatamente esse trecho do entorno. **Hoje está como tem academia, `pendente: true`**, por decisão do time.
2. **Torre do Mar × piscina.** A lista oficial omite as piscinas. Descrição, implantação e fotos mostram piscina adulto e infantil.
3. **Sensia Reserva Vila do Sol × academia.** A lista oficial omite a academia. Descrição e implantação (item 19) a mostram.
4. **Ville de Porto.** A lista oficial traz só "Piscina Adulto". Descrição e implantação mostram também piscina infantil e pista de caminhada.
5. **Ville de Lisboa.** O Playground está cadastrado como "Diferenciais de Card", e o Playbaby está sem tipo.
6. **Fotos com tipo errado.** O nome de arquivo com FITNESS, FUNCIONAL ou QUADRA virava "Espaço fitness": 01-07, 02-03 e 03-08 são espaços funcionais ao ar livre, e 07-05 é uma quadra.

## Pendências para a MRV

- [ ] **Forte Alencar:** confirmar se há academia **dentro** do condomínio e em qual item da implantação ela aparece. Se não houver, troque `tem` para `false` em `data/curated/lazer.json`, apague o item extra "Academia" e rode `npm run data:build`. Ajuste também o teste "Forte Alencar tem academia" em `tests/dados.test.ts`.
- [ ] **Torre do Mar:** corrigir a lista de diferenciais do site para incluir Piscina Adulto e Piscina Infantil.
- [ ] **Sensia Reserva Vila do Sol:** incluir "Academia" na lista de diferenciais do site.
- [ ] **Ville de Porto:** incluir "Piscina Infantil" e "Pista de Caminhada" na lista do site.
- [ ] **Ville de Lisboa:** recadastrar o Playground (e o Playbaby) como "Diferenciais de Lazer".
- [ ] **Residencial Fortitudine:** enviar a imagem de implantação, que não está no pacote de fotos. A descrição diz "mais de 9 itens", mas a lista tem 7. Anúncios de terceiros citam piquenique.
- [ ] **Critério:** gazebo, redário, praça e horta hoje não contam como "área verde". Confirmar se devem contar. Se sim, Farol, Torre do Mar e Mandacaru (gazebo) passariam a ter verde.
- [ ] **Reconferir tudo no site** quando o acesso for liberado. Rodar `npm run data:mrv`, que agora também grava `NN.completo.json`, e depois `npm run data:build`, que procura termos de lazer na página inteira (exceto o entorno).

## O que não foi possível verificar

- As páginas oficiais (`mrv.com.br`) estão bloqueadas neste ambiente (HTTP 403 no proxy). A conferência usou o JSON já extraído em 05/10/2026, as imagens oficiais de implantação e da galeria, e resumos de busca na web, que vêm de páginas de terceiros e de trechos da página da MRV.
- Os arquivos `NN.completo.json` ainda não existem. A trava sobre a página inteira só passa a valer na próxima extração.
