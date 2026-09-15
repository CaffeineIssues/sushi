import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bike,
  Check,
  CheckCheck,
  Clock3,
  Home,
  MapPin,
  ReceiptText,
  Utensils,
} from "lucide-react";
import { getDeliveryProgress } from "./delivery";
const money = (n) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
function DeliveryMap({ progress }) {
  const points = [
    [48, 147],
    [108, 147],
    [108, 96],
    [226, 96],
    [226, 48],
    [318, 48],
  ];
  const position = progress.travel * (points.length - 1),
    segment = Math.min(points.length - 2, Math.floor(position)),
    fraction = position - segment;
  const x =
      points[segment][0] +
      (points[segment + 1][0] - points[segment][0]) * fraction,
    y =
      points[segment][1] +
      (points[segment + 1][1] - points[segment][1]) * fraction;
  return (
    <div className="delivery-map">
      <span className="map-label">Rota ilustrativa</span>
      <svg
        viewBox="0 0 370 195"
        role="img"
        aria-label={
          progress.complete
            ? "Rota simulada concluída"
            : progress.index < 2
              ? "Restaurante e destino da entrega simulada"
              : "Entregador avançando na rota simulada"
        }
      >
        <rect width="370" height="195" fill="#f3f0e9" />
        <g fill="#e8e5dc">
          <rect x="8" y="8" width="75" height="65" rx="9" />
          <rect x="126" y="12" width="73" height="60" rx="9" />
          <rect x="247" y="68" width="65" height="55" rx="9" />
          <rect x="128" y="119" width="76" height="57" rx="9" />
          <rect x="243" y="147" width="91" height="39" rx="9" />
        </g>
        <g fill="#dce7d5">
          <rect x="12" y="100" width="65" height="24" rx="12" />
          <rect x="268" y="8" width="55" height="23" rx="11" />
        </g>
        <g fill="none" stroke="#fff" strokeWidth="13">
          <path d="M0 87H370M0 137H370M98 0V195M216 0V195M339 0V195M240 39H370" />
        </g>
        <path
          d="M48 147H108V96H226V48H318"
          fill="none"
          stroke="#fac2b5"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="5 8"
        />
        <circle cx="48" cy="147" r="15" fill="#fff" />
        <Utensils x={39} y={138} width={18} height={18} color="#ff5b43" />
        <circle cx="318" cy="48" r="15" fill="#ff5b43" />
        <Home x={309} y={39} width={18} height={18} color="white" />
        {progress.index >= 2 && (
          <g transform={`translate(${x},${y})`}>
            <circle r="16" fill="#fff" stroke="#ff5b43" strokeWidth="2" />
            {progress.complete ? (
              <Check x={-9} y={-9} width={18} height={18} color="#ff5b43" />
            ) : (
              <Bike x={-10} y={-10} width={20} height={20} color="#ff5b43" />
            )}
          </g>
        )}
      </svg>
    </div>
  );
}
export function OrdersPage({ orders, menuLink, onAdvance }) {
  const [now, setNow] = useState(Date.now);
  const running = orders.some(
    (order) => !getDeliveryProgress(order, now).complete,
  );
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(interval);
  }, [running]);
  return (
    <section className="route-page orders-page">
      <div className="route-heading">
        <span className="eyebrow coral">CADA PEDIDO, UM BOM MOMENTO</span>
        <h1>
          Meus pedidos<span>.</span>
        </h1>
        <p>Da cozinha até você. Acompanhe cada etapa do seu pedido.</p>
      </div>
      {!orders.length ? (
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
            Entrega simulada: as etapas avançam automaticamente em até 40
            segundos. Nenhuma cobrança ou entrega real é realizada.
          </p>
          <div className="orders-list">
            {orders.map((order) => {
              const progress = getDeliveryProgress(order, now),
                table = order.mode === "table";
              const icons = [
                CheckCheck,
                Utensils,
                table ? Utensils : Bike,
                Check,
              ];
              return (
                <article className="order-card" key={order.id}>
                  <header className="order-card-heading">
                    <div>
                      <span className="eyebrow coral">
                        PEDIDO #{order.id.slice(-6)}
                      </span>
                      <h2>
                        {progress.complete
                          ? "Bom apetite!"
                          : table
                            ? `Preparando seu momento na mesa ${order.table}`
                            : "Seu sushi está chegando"}
                      </h2>
                      <time dateTime={order.createdAt}>
                        {new Date(order.createdAt).toLocaleString("pt-BR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </time>
                    </div>
                    <span
                      className={
                        "order-status " + (progress.complete ? "delivered" : "")
                      }
                      role="status"
                    >
                      <CheckCheck size={15} />
                      {progress.steps[progress.index].label}
                    </span>
                  </header>
                  <div className="order-card-body">
                    <div className="order-products">
                      {!table && <DeliveryMap progress={progress} />}
                      <div
                        className={
                          "delivery-eta " +
                          (progress.complete ? "complete" : "")
                        }
                      >
                        <div>
                          {progress.complete ? (
                            <CheckCheck size={23} />
                          ) : (
                            <Clock3 size={23} />
                          )}
                          <span>
                            <strong>
                              {progress.complete
                                ? table
                                  ? "Pedido servido na mesa"
                                  : "Pedido entregue"
                                : `${progress.remaining}s para ${table ? "servir" : "chegar"}`}
                            </strong>
                            <small>
                              {progress.complete
                                ? "Simulação concluída. Aproveite seu sushi!"
                                : "Tempo acelerado para demonstração"}
                            </small>
                          </span>
                        </div>
                        {!table && progress.index === 2 && (
                          <span className="courier-label">
                            Rafa · Entregador simulado
                          </span>
                        )}
                      </div>
                      <div className="delivery-destination">
                        <MapPin size={16} />
                        <span>
                          {table
                            ? `Mesa ${order.table}`
                            : order.address || "Endereço informado no pedido"}
                        </span>
                      </div>
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
                          {order.payment === "pix"
                            ? "Pix"
                            : "Cartão de crédito"}{" "}
                          · Simulado
                        </span>
                        <strong>Total {money(order.total)}</strong>
                      </div>
                    </div>
                    <div className="order-tracking">
                      <h3>
                        {progress.complete
                          ? "Tudo certo com seu pedido"
                          : "Acompanhe seu pedido"}
                      </h3>
                      <ol className="delivery-timeline">
                        {progress.steps.map((step, i) => {
                          const Icon = i < progress.index ? Check : icons[i];
                          return (
                            <li
                              key={step.at}
                              className={
                                i < progress.index
                                  ? "done"
                                  : i === progress.index
                                    ? "current"
                                    : "pending"
                              }
                              aria-current={
                                i === progress.index ? "step" : undefined
                              }
                            >
                              <span className="timeline-icon">
                                <Icon size={18} />
                              </span>
                              <div>
                                <strong>{step.label}</strong>
                                <small>{step.description}</small>
                              </div>
                            </li>
                          );
                        })}
                      </ol>
                      {progress.complete ? (
                        <div className="delivery-finish">
                          <span>Obrigado por escolher a Nori ♡</span>
                          <Link to={menuLink}>
                            Voltar ao cardápio <ArrowRight size={15} />
                          </Link>
                        </div>
                      ) : (
                        <button
                          className="advance-demo"
                          onClick={() => {
                            const at = Date.now();
                            setNow(at);
                            onAdvance(order.id, at);
                          }}
                        >
                          Avançar simulação <ArrowRight size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
