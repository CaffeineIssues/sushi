import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bike,
  CheckCheck,
  Clock3,
  ReceiptText,
  Utensils,
} from "lucide-react";
const money = (n) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export function OrdersPage({ orders, menuLink }) {
  return (
    <section className="route-page orders-page">
      <div className="route-heading">
        <span className="eyebrow coral">CADA PEDIDO, UM BOM MOMENTO</span>
        <h1>
          Meus pedidos<span>.</span>
        </h1>
        <p>Seus pedidos e todos os detalhes, sempre por aqui.</p>
      </div>
      {orders.length === 0 ? (
        <div className="empty route-empty">
          <ReceiptText size={42} />
          <h2>Seu primeiro pedido está te esperando.</h2>
          <p>Escolha seu sushi favorito e acompanhe seu pedido nesta página.</p>
          <Link className="primary" to={menuLink}>
            Explorar cardápio <ArrowRight size={17} />
          </Link>
        </div>
      ) : (
        <>
          <p className="orders-demo">
            Pedidos demonstrativos salvos neste navegador. Nenhuma cobrança ou
            entrega real é realizada.
          </p>
          <div className="orders-list">
            {orders.map((order) => (
              <article className="order-card" key={order.id}>
                <header className="order-card-heading">
                  <div>
                    <span className="eyebrow coral">
                      PEDIDO #{order.id.slice(-6)}
                    </span>
                    <h2>
                      {order.mode === "table"
                        ? `Na mesa ${order.table}`
                        : "Seu sushi a caminho"}
                    </h2>
                    <time dateTime={order.createdAt}>
                      {new Date(order.createdAt).toLocaleString("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </time>
                  </div>
                  <span className="order-status">
                    <CheckCheck size={15} /> Confirmado
                  </span>
                </header>
                <div className="order-card-body">
                  <div className="order-products">
                    {order.items.map((item, index) => (
                      <div className="order-product" key={index}>
                        <img src={item.image} alt={item.name} />
                        <div>
                          <h3>
                            {item.qty}× {item.name}
                          </h3>
                          {item.note && <p>{item.note}</p>}
                        </div>
                        <strong>{money(item.price * item.qty)}</strong>
                      </div>
                    ))}
                    <div className="order-payment">
                      <span>
                        {order.payment === "pix" ? "Pix" : "Cartão de crédito"}{" "}
                        · Simulado
                      </span>
                      <strong>Total {money(order.total)}</strong>
                    </div>
                  </div>
                  <div className="order-tracking">
                    <h3>Acompanhamento ilustrativo</h3>
                    <div className="order-progress">
                      <div>
                        <CheckCheck size={20} />
                        <span>
                          <strong>Pedido confirmado</strong>
                          <small>Pagamento simulado aprovado</small>
                        </span>
                      </div>
                      <div>
                        <Utensils size={20} />
                        <span>
                          <strong>Preparando seu sushi</strong>
                          <small>Feito na hora, com carinho</small>
                        </span>
                      </div>
                      <div>
                        {order.mode === "table" ? (
                          <Utensils size={20} />
                        ) : (
                          <Bike size={20} />
                        )}
                        <span>
                          <strong>
                            {order.mode === "table"
                              ? `Entrega na mesa ${order.table}`
                              : "Entrega no endereço informado"}
                          </strong>
                          <small>
                            {order.mode === "table"
                              ? "20–30 minutos"
                              : "35–50 minutos"}
                          </small>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
