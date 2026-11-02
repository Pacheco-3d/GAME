# BOMBA GO! — GAME

Protótipo 2.5D de jogo Touch & Go com cenários isométricos de dia e neve.

## Comandos
- Toque no chão para caminhar e subir/descer escadas.
- Toque em um barril, caixote ou caixa de dinamite para ir até o objeto e pegar automaticamente.
- O personagem segura o objeto com os braços acima da cabeça.
- Dois toques no chão na direção escolhida arremessam o objeto.
- Barril: rola e explode. Caixote: quica e se despedaça. Dinamite: quica e explode.
- Dois toques no personagem sem objeto colocam uma bomba normal.
- Areia e neve deixam rastros e tornam a caminhada mais pesada. O gelo é escorregadio.

Abra `index.html` em um navegador moderno. O projeto não requer build nem dependências. Os mapas são ilustrações com caminhos 2.5D sobrepostos e não modelos 3D completos.

## Novos cenários

Adicione a arte em `scenarios/` e configure os pontos e conexões em `app.js` (mapas `RAW` e pontos `PICKUP_SPAWNS`).
