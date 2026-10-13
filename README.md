# Guarida Store — cliente

Catálogo privado (*Private Shop*) de zapatos, gafas, gorras, lociones, bolsas y ropa, con carrito y pedido por WhatsApp. **Cliente** de Zerufy Studio. El catálogo se diseñó primero para la marca Underblock y después pasó a Guarida.

**En línea:** https://guaridaastore.com · panel en https://guaridaastore.com/admin

**Hosting:** Cloudflare Pages, proyecto `underblock` (también responde en https://underblock.pages.dev). El dominio `guaridaastore.com` (con doble "a") está en Namecheap con los nameservers de Cloudflare y conectado como dominio propio del proyecto.

| Archivo | Qué es |
|---|---|
| `index.html` | Catálogo: intro de cámara de seguridad con el logo en grafiti, pestañas por categoría, buscador, favoritos, ficha con tallas y colores, carrito y pedido por WhatsApp |
| `admin.html` | Panel del cliente: productos, fotos, carga rápida, precios y ofertas, tallas, colores, agotado/oculto, categorías y ajustes |
| `icon-512.png` | Imagen de vista previa al compartir el link |

**Supabase:** sistema de Tiendas, `store_id = 7` (slug `guarida-store`). Tablas `stores`, `categories` y `products`. Fotos en el bucket `store-products`, carpeta `7/`. Solo se usa la llave pública.

**WhatsApp, Instagram, TikTok y nota de entrega** se cambian desde el panel (Ajustes). Lo que hay en `CONFIG` dentro de `index.html` solo se usa si el panel no tiene nada guardado.

**Precios:** precio `0` sale como "A consultar". Si hay precio en oferta, sale el precio tachado. Los productos destacados salen primero.

**Acceso al panel:** `/admin.html` con la cuenta del cliente (Supabase Auth, enlazada con `stores.owner_user_id` de la tienda 7). La contraseña no va en este repo.

---
Hecho por **Zerufy Studio** · zerufystudio.com · El mapa de todos los repos está en el README de `Zerufy-Studio-`.
