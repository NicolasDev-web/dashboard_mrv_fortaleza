# Marcos 3D da maquete — diagnóstico e plano de fidelidade

Objetivo: cada miniatura em `components/empreendimento/maquete/marcos/` tem de ser reconhecível como o
lugar de verdade, ao ponto de quem é de Fortaleza bater o olho e saber o que é. A escala continua
"de maquete" (a pegada encolhe para ~50 m e as alturas são exageradas para ler de longe), mas forma,
proporção, cores, materiais e os detalhes que identificam o lugar seguem o real.

## Como conferir

- `npm run dev` e abrir `/previa-marco?id=<marco>&az=<graus>&el=<graus>&d=<metros>` (só em
  desenvolvimento). `az` = de onde a câmera olha (0 = do norte), `el` = elevação, `d` = distância.
- Comparar lado a lado com fotos do mesmo ângulo. As fotos e as plantas do OpenStreetMap citadas nos
  comentários dos modelos ficam em `pesquisa/marcos/<lugar>/`, que está no `.gitignore` e por isso
  **não está no repositório**.

## Situação em 17/out/2026

13 miniaturas registradas em `marcos/index.ts`. Todas já têm contorno tirado do OSM ou da vista aérea
e a assinatura principal do lugar; o que falta é acabamento e alguns elementos que identificam o
lugar.

| Marco | Já tem | Falta para ficar fiel |
|---|---|---|
| Castelão | planta em "almofada", 60 pórticos treliçados, cobertura branca com vazio, 2 anéis de arquibancada, gramado com linhas | fachada é vidro escuro, mas a real é uma **pele translúcida de malha metálica**; telhas trapezoidais da cobertura; anel de **policarbonato** (~20% da cobertura) translúcido; esplanada (o estacionamento foi para o subsolo e virou praça) sem vida |
| Lagoa de Messejana | contorno do OSM, calçadão com gradil, píer, igreja Matriz, mata, palmeiras | estátua "Banho de Iracema" feita de cápsulas e verde (desde o restauro de 2024 é **bronze envelhecido**); sem a água jorrando da cuia; sem a lança; água azul de piscina; palmeiras em "guarda-chuva"; sem quiosques e anfiteatro da requalificação de 2024 |
| Aeroporto | terminal em arco, pontes de embarque, pista 13/31, aviões, torre | conferir cores do terminal e da torre com fotos |
| Iguatemi | contorno do OSM, sheds da fachada sul, letreiro, mata do Cocó | conferir com fotos |
| North Shopping | caixa com o estacionamento, logo, BRT | conferir com fotos |
| RioMar Fortaleza / Kennedy | contornos do OSM, logo, torres comerciais, estacionamento | conferir com fotos |
| Unifor | campus com blocos, pista de atletismo, Bloco M com letreiro | conferir com fotos |
| Praia de Iracema | Ponte dos Ingleses, Iracema Guardiã, calçadão | Estoril e o Dragão do Mar (hoje é só pino) |
| Praia do Futuro | barracas com piscina, guarda-sóis | conferir com fotos |
| Centro | Catedral, Praça do Ferreira com a Coluna da Hora, Cine São Luiz, Mercado Central | **Theatro José de Alencar** (o marco mais conhecido do Centro) |
| Terminal Antônio Bezerra | três coberturas em pente, ônibus | conferir com fotos |
| Cambeba | prédios do OSM, brises, escultura da rotatória | conferir com fotos |

Código: `aleatorio()`, palmeiras e árvores instanciadas estão copiados em vários arquivos.

## Bloqueio de referência

Este ambiente de nuvem não acessa Wikimedia, OpenStreetMap nem sites de notícia (só busca textual),
e `pesquisa/` não está versionada. Os ajustes desta rodada usam dados técnicos e descrições
publicadas (fontes abaixo). Para chegar ao "idêntico" nos detalhes finos (cores exatas das cadeiras,
posição dos quiosques, pose exata da Iracema), o caminho é **mandar fotos de referência** de cada
lugar (ou versionar `pesquisa/marcos/`), de preferência de cima e de dois lados.

## Fases

1. **Castelão e Lagoa de Messejana** (pedido direto) — feita em 17/out/2026
   - Castelão: pele de malha metálica translúcida com a estrutura de concreto aparecendo atrás;
     cobertura com telhas trapezoidais radiais; anel de policarbonato translúcido junto ao vazio;
     esplanada com árvores e postes.
   - Messejana: Iracema refeita com corpo esculpido (sentada na pedra, cabelo longo, cuia erguida
     com a água caindo, lança na outra mão) em bronze envelhecido; água com cor de lagoa;
     palmeiras de folhas arqueadas; quiosques no calçadão e anfiteatro da requalificação.
2. **Centro e Praia de Iracema**: Theatro José de Alencar; Dragão do Mar e Estoril.
3. **Revisão dos demais** com fotos: cores, letreiros e proporções de cada um.
4. **Lugares que hoje são pino** e merecem miniatura: Parque do Cocó, Beira-Mar (feirinha e
   espigões), Centro de Eventos, Dragão do Mar, Lagoa da Parangaba.
5. **Código e desempenho**: extrair `aleatorio`, palmeiras e copas para `marcos/comum.ts`; medir
   draw calls com todas as miniaturas na cena; capturas automáticas da prévia para pegar regressão
   visual.
   Na página do empreendimento o console mostra "Attempted to synchronously unmount a root while React
   was already rendering" várias vezes; vem das etiquetas `<Html>` do drei e já existia antes desta
   rodada.

## Fontes desta rodada

- Castelão — 60 pórticos de aço em volta do anel original, cobertura de ~34 mil m² com ~6 mil m² de
  policarbonato (≈20%), balanço de ~60 m com tirantes: Martifer (martifer.pt/pt/projects/arena-castelao),
  revistaoe.com.br e tubonasa.com.br.
- Castelão — "external volume enclosed by a translucent skin", estacionamento levado ao subsolo e
  praia urbana no lugar: Domus (domusweb.it, 17/06/2014) e Vigliecca & Associados; fachada em malha
  de aço inox: estudo de caso da World Stainless Association.
- Iracema — "Banho de Iracema", 2004, 12 m e 16 t, fibra de vidro; sentada, com flecha/lança e cuia;
  restaurada em 2024 com acabamento "bronze envelhecido" e fonte religada (6h–9h e 17h–20h): Prefeitura
  de Fortaleza, Diário do Nordeste e O Povo (mar–abr/2024).
- Lagoa — requalificação entregue em abr/2024: piso novo em volta da lagoa, quiosques reformados,
  anfiteatro, areninha, pista de skate, píer de madeira restaurado e 65 árvores: O Povo (12–13/04/2024).
