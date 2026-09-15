export function getDeliveryProgress(order, now = Date.now()) {
  const table = order.mode === "table";
  const steps = [
    {
      at: 0,
      label: "Pedido confirmado",
      description: "Pagamento simulado aprovado",
    },
    {
      at: 8000,
      label: "Em preparo",
      description: "A cozinha está preparando seus favoritos",
    },
    {
      at: 20000,
      label: table ? "A caminho da mesa" : "Saiu para entrega",
      description: table
        ? `Seu pedido está indo para a mesa ${order.table}`
        : "Rafa está levando seu sushi até você",
    },
    {
      at: table ? 30000 : 40000,
      label: table ? "Servido na mesa" : "Entregue",
      description: table
        ? "Tudo na mesa. Bom apetite!"
        : "Seu sushi chegou. Bom apetite!",
    },
  ];
  const start = order.simulationStartedAt ?? Date.parse(order.createdAt);
  const elapsed = Math.max(0, now - (Number.isFinite(start) ? start : now));
  const index = steps.reduce(
    (current, step, i) => (elapsed >= step.at ? i : current),
    0,
  );
  const duration = steps[3].at;
  return {
    steps,
    index,
    elapsed,
    complete: index === 3,
    remaining: Math.max(0, Math.ceil((duration - elapsed) / 1000)),
    travel: Math.max(
      0,
      Math.min(1, (elapsed - steps[2].at) / (duration - steps[2].at)),
    ),
  };
}
