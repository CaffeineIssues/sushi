# Nori Sushi

Aplicativo React responsivo em português brasileiro, exclusivo para clientes. Delivery, pedidos na mesa via QR code, cardápio, favoritos, histórico de pedidos e pagamentos simulados.

## Executar

```sh
npm install
npm run dev
```

## Páginas

- `/`: início, delivery e seletor **Delivery / Presencial**.
- `/cardapio`: cardápio completo.
- `/pedidos`: histórico de pedidos deste navegador.
- `/favoritos`: pratos favoritados.

Navegação por URLs próprias, com suporte a voltar/avançar e recarregar. Pedidos, favoritos, sacola e endereço ficam no armazenamento local. Dados de cartão não são persistidos.

## Preview no celular

Toque no logo Nori para ativar a tela cheia sem sair da página atual. A função depende do suporte do navegador à Fullscreen API; se indisponível, o aplicativo informa isso.

## QR code da mesa

O QR code abre `/cardapio?mesa=<UID>`. O cliente pode escanear com a câmera do celular, selecionar **Presencial** no aplicativo ou selecionar uma foto do código. Não há campo para digitar mesa ou página para gerar códigos no aplicativo do cliente.

Os UIDs opacos de demonstração estão em `src/tables.js`. Os números das mesas não são aceitos como códigos. Códigos desconhecidos mostram uma mensagem e não liberam pedidos na mesa. As páginas preservam o UID na navegação; a mesa fica bloqueada no checkout. O seletor Delivery remove o contexto da mesa; Presencial exige a leitura de um QR válido. Para testar um link, use o UID de uma das fixtures em `src/tables.js`.

A câmera exige HTTPS (ou localhost). Em outro celular, use o domínio publicado ou configure acesso HTTPS na rede. Os códigos lidos pelo aplicativo devem apontar para o mesmo domínio.

**Etapa futura:** o sistema do sushi bar deverá gerar os QR codes e validar/resolver UIDs no servidor. As fixtures deste frontend demonstrativo não são uma barreira de segurança: podem ser inspecionadas no código entregue ao navegador. UIDs evitam a simples alteração sequencial de números, mas não impedem compartilhamento de links.

## Pagamento demonstrativo

Pix ilustrativo, sem valor pagável. Para cartão, use dados fictícios como `4242 4242 4242 4242`, validade `12/30`, CVV `123`. Nenhuma cobrança ou pedido real é enviado. Status, avaliações, preços, taxas e tempos são ilustrativos.

## Publicar na Vercel

Importe o repositório, selecione Vite, build `npm run build` e saída `dist`. O `vercel.json` permite abrir e recarregar as rotas diretamente. Não são necessárias variáveis de ambiente.

## Verificar

```sh
npx playwright install chromium
npm test
npm run build
```

Imagens via Unsplash, avatares via Pravatar e fontes via Google Fonts exigem conexão.
