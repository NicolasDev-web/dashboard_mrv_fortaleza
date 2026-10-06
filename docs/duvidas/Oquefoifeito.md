Seu limite de uso foi atingido, então parei aqui. O núcleo do app já funciona de ponta a ponta: Home → quiz → resultado → detalhe do empreendimento. Os tipos passam no TypeScript, os 14 testes do ranking passam e conferi as telas em celular e desktop com Playwright (no detalhe, só confirmei que a página carrega). Nada foi

O que está pronto
- Base: Next.js 16.3, TypeScript, Tailwind v4 com os tokens MRV, fonte Manrope provisória, noindex e robots.txt bloqueando tudo (produto interno).
- Dados:
  - Script que extrai as 16 páginas oficiais.
  - Importação do projeto de bairros, só com notas desem segurança e sem renda).
  - Mapa das 5 regiões e o data/empreendimentos.json final, montado a partir da curadoria.
  - Um único comando roda tudo: npm run data.
- Imagens: as 279 fotos foram convertidas para AVIF e WebP com placeholder de carregamento, somando 44,8 MB em public/img. O zip de 252
  MB e as originais ficam fora do git.
- Ranking: pesos todos em lib/scoring/config.ts, com motivos e pontos de atenção em texto. Calibrei com perfis reais:
  - quem vai à Unifor recebe o Cocó;
  - quem vai à UFC Benfica recebe o Centro ou a Jacar
  - quem vai ao Pici recebe o Antônio Bezerra.
- Caucaia e Eusébio: como não há tempo de ônibus calculado para essas cidades, usei uma estimativa pela distância (erro típico de cerca de 11 min). A tela sempre avisa que é estimativa.
- Telas:
  - Home.
  - Quiz de 7 perguntas, com respostas na URL, avanço automático só no toque e transições.
  - Resultado com 3 cards, motivos, região sugerida, parar.
  - Detalhe com galeria, "Por que combina com você", tempos até os polos, lazer, plantas em tela cheia e botão de contato.
- docs/duvidas/Dúvidas.md: criado no repositório, com

O que falta
- As páginas /empreendimentos (lista com filtros), /r links para elas existem, mas hoje dão 404.
- Testes de ponta a ponta com Playwright, Lighthouse no CI, imagem de compartilhamento (Open Graph) do resultado e deploy na Vercel.
- Limpeza: apagar o arquivo temporário shot.tmp.mjs e encerrar o servidor de desenvolvimento, que ainda está rodando na porta 3100.

Decisões que tomei sem você
- Renomeei a pasta MRV DESIGN SYSTEM/ para design-system/.
- O botão de WhatsApp só aparece se você definir NEXTcontato leva apenas à página oficial.
- O logo não aparece: até a MRV enviar o arquivo, o cabeçalho mostra só o nome do produto.