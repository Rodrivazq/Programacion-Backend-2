export default class TicketDto {
  constructor({ code, purchaser, items = [], amount, purchasedAt }) {
    /** Código único del ticket */
    this.code = code || null;

    /** Comprador del ticket (siempre string) */
    this.purchaser =
      typeof purchaser === "object"
        ? purchaser._id?.toString() || null
        : purchaser?.toString() || null;

    /** Detalle de productos */
    this.items = Array.isArray(items)
      ? items.map((i) => {
          const titulo = i.title ?? i.titulo ?? "Producto desconocido";

          const precio = Number(i.price ?? i.precio);
          const precioOk = isFinite(precio) ? precio : 0;

          const qty = Number(i.quantity);
          const qtyOk = isFinite(qty) ? qty : 0;

          const sub = Number(i.subtotal);
          const subOk = isFinite(sub) ? sub : precioOk * qtyOk;

          return {
            product:
              typeof i.product === "object"
                ? i.product._id?.toString() || null
                : i.product || null,
            titulo,
            precio: precioOk,
            quantity: qtyOk,
            subtotal: subOk,
          };
        })
      : [];

    /** Monto total de la compra */
    const amt = Number(amount);
    this.amount = isFinite(amt) ? amt : 0;

    /** Fecha de emisión del ticket */
    this.purchasedAt = purchasedAt || new Date();
  }
}
