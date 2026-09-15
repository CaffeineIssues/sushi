# Nori Sushi

Site React responsivo em português brasileiro, com cardápio, busca, categorias, favoritos, sacola persistente e checkout demonstrativo.

## Executar

```sh
npm install
npm run dev
```

## Publicar na Vercel

Importe este repositório na Vercel. Selecione Vite, comando de build `npm run build` e diretório de saída `dist`. Não são necessárias variáveis de ambiente.

## Pedidos na mesa

Gere um QR code físico para cada mesa apontando para `https://seu-site.vercel.app/?mesa=01` (troque o número para cada mesa). Ao abrir esse link, o aplicativo seleciona automaticamente o atendimento na mesa. A modalidade e a mesa ficam fixas durante o pedido, sem controles para alterá-las. O acesso sem uma mesa válida abre delivery. Nesta demonstração, o QR code usa um parâmetro de URL; em produção, use um token de mesa validado pelo servidor. Um navegador não consegue distinguir um link escaneado de um link digitado ou compartilhado.

## Demonstração

O checkout tem fluxos de Pix e cartão. Use dados fictícios no cartão, como `4242 4242 4242 4242`, validade `12/30` e CVV `123`. O Pix exibido é ilustrativo e não pagável. Nenhuma cobrança é feita e nenhum pedido é transmitido a um restaurante. Sacola e endereço ficam no armazenamento local do navegador; dados de cartão não são persistidos.

Para produção, integrar um backend de pedidos, catálogo e disponibilidade reais, autenticação da equipe e um provedor de pagamentos com confirmação no servidor por webhook. O status de funcionamento, as avaliações, as taxas e os tempos são ilustrativos. Imagens via Unsplash, avatares via Pravatar e fontes via Google Fonts exigem conexão.
