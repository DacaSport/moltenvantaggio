# Daca Sport Landing Page - Balón Molten Vantaggio

Landing page móvil, estática y lista para subir a hosting. Su objetivo es vender el Balón Molten Vantaggio y enviar el pedido directo a WhatsApp con mensaje automático según la selección del cliente.

## Estructura

```txt
index.html
assets/
  css/styles.css
  js/app.js
  img/
```

## Cómo usar

1. Sube la carpeta completa a tu hosting, cPanel, Netlify, Vercel o servidor.
2. Abre `assets/js/app.js`.
3. Cambia esta línea si el WhatsApp oficial es otro:

```js
const WHATSAPP_NUMBER = "584245329551";
```

Formato obligatorio: código de país + número, solo dígitos. Ejemplo Venezuela: `584245329551`.

## Lógica de venta incluida

- Producto: Balón Molten Vantaggio.
- Colores: rojo y azul.
- Tipos: número 4, número 5 y fútbol sala.
- Métodos de pago:
  - Divisas / Zelle / USDT / Wally: $25 por unidad, $20 desde 4 unidades.
  - Transferencia Bs / Pago móvil: $35 BCV por unidad, $28 BCV desde 4 unidades.
- Entrega:
  - Envío gratis por Zoom.
  - Envío gratis por Tealca.
  - Retiro en tienda física.
- Garantía de válvula.
- Ubicación: C.C. Girarma, local #2, Guanare Edo. Portuguesa.

## Mensaje automático de WhatsApp

Al presionar “Comprar por WhatsApp”, la página construye un mensaje con:

- Producto.
- Color.
- Tipo.
- Cantidad.
- Método de pago.
- Precio estimado.
- Entrega.
- Nombre del cliente, ciudad y nota opcional si fueron llenados.

## Edición rápida

- Textos principales: `index.html`.
- Diseño, colores, animaciones: `assets/css/styles.css`.
- Precio, número de WhatsApp y mensaje automático: `assets/js/app.js`.
