import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  ArrowUpRight,
  Bike,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  Clock3,
  CreditCard,
  Heart,
  Leaf,
  MapPin,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  Utensils,
  X,
  Flame,
  Copy,
  QrCode,
  Home,
  ReceiptText,
} from "lucide-react";
import {
  BrowserRouter,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { OrdersPage } from "./pages";
import { QrScanner } from "./QrScanner";
import { resolveTable } from "./tables";
import "./styles.css";
const readStored = (key, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
};
const money = (n) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const photos = {
  combo:
    "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1000&q=85",
  salmon:
    "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=900&q=85",
  sushi:
    "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=900&q=85",
  poke: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=85",
  tea: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=85",
};
const products = [
  {
    id: 1,
    name: "Combinado Nori",
    description:
      "O melhor da casa em um só combinado. Salmão, cream cheese e muito sabor.",
    pieces: "32 peças",
    price: 89.9,
    old: 109.9,
    category: "Combos",
    image: photos.combo,
    badge: "Mais pedido",
    rating: "4,9",
    details:
      "8 sashimis de salmão, 8 uramakis de salmão, 8 hossomakis e 8 hot rolls. Acompanha shoyu, gengibre e wasabi.",
  },
  {
    id: 2,
    name: "Uramaki Philadelphia",
    description:
      "Salmão fresquinho, cream cheese e gergelim. Um clássico irresistível.",
    pieces: "8 peças",
    price: 29.9,
    category: "Uramakis",
    image: photos.salmon,
    rating: "4,9",
    details:
      "Arroz japonês, alga nori, salmão cru, cream cheese e gergelim. Acompanha shoyu.",
  },
  {
    id: 3,
    name: "Hot Roll Crocante",
    description:
      "Crocante por fora, cremoso por dentro. Finalizado com molho tarê.",
    pieces: "10 peças",
    price: 32.9,
    category: "Hot rolls",
    image: photos.sushi,
    badge: "Favorito da galera",
    rating: "4,8",
    details:
      "Rolinho empanado com salmão e cream cheese, finalizado com tarê e cebolinha.",
  },
  {
    id: 4,
    name: "Sashimi de Salmão",
    description:
      "Cortes delicados de salmão selecionado. Simplesmente especial.",
    pieces: "10 peças",
    price: 42.9,
    category: "Sashimis",
    image: photos.salmon,
    rating: "4,9",
    details:
      "10 fatias de salmão cru selecionado. Acompanha gengibre, wasabi e shoyu.",
  },
  {
    id: 5,
    name: "Poke Tropical",
    description: "Uma combinação leve de arroz, vegetais frescos e manga.",
    pieces: "400 g",
    price: 39.9,
    category: "Pokes",
    image: photos.poke,
    badge: "Vegetariano",
    rating: "4,8",
    details:
      "Arroz japonês, folhas, manga, pepino, cenoura, abacate e gergelim. Molho cítrico à parte.",
  },
  {
    id: 6,
    name: "Combinado a Dois",
    description:
      "Seu encontro tem sabor de sushi. Uma seleção para compartilhar.",
    pieces: "48 peças",
    price: 129.9,
    category: "Combos",
    image: photos.combo,
    rating: "5,0",
    details:
      "16 uramakis, 12 sashimis, 12 hot rolls e 8 niguiris. Acompanha 2 pares de hashis, shoyu, gengibre e wasabi.",
  },
  {
    id: 7,
    name: "Temaki de Salmão",
    description:
      "Alga crocante, salmão e cream cheese, feito na hora para você.",
    pieces: "1 unidade",
    price: 28.9,
    category: "Temakis",
    image: photos.sushi,
    rating: "4,8",
    details:
      "Cone de alga nori recheado com arroz, salmão cru, cream cheese e cebolinha.",
  },
  {
    id: 8,
    name: "Chá Gelado da Casa",
    description:
      "Chá de limão com um toque de hortelã. Refrescante de verdade.",
    pieces: "400 ml",
    price: 12.9,
    category: "Bebidas",
    image: photos.tea,
    rating: "4,9",
    details:
      "Chá preto com limão e hortelã. Preparado na casa e servido gelado.",
  },
];
const categories = [
  ["Todos", "✦"],
  ["Combos", "🍱"],
  ["Uramakis", "🍣"],
  ["Hot rolls", "🥢"],
  ["Sashimis", "🐟"],
  ["Temakis", "🍙"],
  ["Pokes", "🥗"],
  ["Bebidas", "🥤"],
];
function App() {
  const route = useLocation();
  const navigate = useNavigate();
  const page = route.pathname.replace(/\/$/, "") || "/";
  const onlyFavorites = page === "/favoritos";
  const pageLink = (path) => path + route.search;
  const query = new URLSearchParams(route.search);
  const rawTable = query.get("mesa");
  const tableRecord = resolveTable(rawTable);
  const table = tableRecord?.number || null;
  const invalidTable = query.has("mesa") && !tableRecord;
  const mode = tableRecord ? "table" : "delivery";
  const scanTable = (text) => {
    let url;
    try {
      url = new URL(text);
    } catch {
      return "Este QR code não é um link de mesa da Nori.";
    }
    if (
      url.origin !== window.location.origin ||
      !["/", "/cardapio"].includes(url.pathname) ||
      !resolveTable(url.searchParams.get("mesa"))
    )
      return "QR code não reconhecido. Escaneie o código da sua mesa na Nori.";
    setModal(null);
    navigate(
      "/cardapio?mesa=" + encodeURIComponent(url.searchParams.get("mesa")),
    );
    return null;
  };
  const [category, setCategory] = useState("Todos"),
    [search, setSearch] = useState(""),
    [cart, setCart] = useState(() => {
      try {
        return JSON.parse(localStorage.getItem("nori-cart")) || [];
      } catch {
        return [];
      }
    }),
    [favorites, setFavorites] = useState(() =>
      readStored("nori-favorites", []),
    ),
    [orders, setOrders] = useState(() => readStored("nori-orders", [])),
    [modal, setModal] = useState(null),
    [selected, setSelected] = useState(null),
    [qty, setQty] = useState(1),
    [note, setNote] = useState(""),
    [step, setStep] = useState(1),
    [payment, setPayment] = useState("pix"),
    [paid, setPaid] = useState(false),
    [copied, setCopied] = useState(false),
    [sort, setSort] = useState(false),
    [address, setAddress] = useState(
      () => localStorage.getItem("nori-address") || "",
    ),
    [toast, setToast] = useState(""),
    [order, setOrder] = useState(null),
    [customer, setCustomer] = useState("");
  useEffect(() => {
    setModal(null);
    setSearch("");
    setCategory("Todos");
    window.scrollTo(0, 0);
    document.title =
      ({
        "/": "Início",
        "/cardapio": "Cardápio",
        "/pedidos": "Meus pedidos",
        "/favoritos": "Meus favoritos",
      }[page] || "Página não encontrada") + " · Nori Sushi";
  }, [page]);
  useEffect(() => {
    localStorage.setItem("nori-favorites", JSON.stringify(favorites));
  }, [favorites]);
  useEffect(() => {
    if (!modal) return;
    const previous = document.activeElement;
    document.body.style.overflow = "hidden";
    const dialog = document.querySelector("[role=dialog]");
    dialog?.querySelector("button,input")?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") setModal(null);
      if (e.key === "Tab" && dialog) {
        const items = [
          ...dialog.querySelectorAll(
            "button:not(:disabled),input,textarea,a[href]",
          ),
        ];
        const first = items[0],
          last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [modal]);
  const count = cart.reduce((a, b) => a + b.qty, 0),
    subtotal = cart.reduce((a, b) => a + b.qty * b.price, 0),
    fee = mode === "delivery" ? 5.9 : 0;
  const updateCart = (next) => {
    setCart(next);
    localStorage.setItem("nori-cart", JSON.stringify(next));
  };
  const notify = (t) => {
    setToast(t);
    setTimeout(() => setToast(""), 2700);
  };
  const enterFullscreen = async () => {
    if (document.fullscreenElement || document.webkitFullscreenElement) return;
    const root = document.documentElement;
    const request = root.requestFullscreen || root.webkitRequestFullscreen;
    if (!request) {
      notify("Tela cheia indisponível neste navegador.");
      return;
    }
    try {
      await request.call(root);
    } catch {
      notify("Não foi possível ativar a tela cheia neste navegador.");
    }
  };
  const add = (p, q = 1, n = "") => {
    const old = cart.find((i) => i.id === p.id && i.note === n);
    updateCart(
      old
        ? cart.map((i) => (i === old ? { ...i, qty: i.qty + q } : i))
        : [...cart, { ...p, qty: q, note: n, key: Date.now() }],
    );
    notify("Adicionado à sua sacola");
    setModal(null);
  };
  const change = (key, delta) =>
    updateCart(
      cart
        .map((i) => (i.key === key ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0),
    );
  const favorite = (id) =>
    setFavorites(
      favorites.includes(id)
        ? favorites.filter((i) => i !== id)
        : [...favorites, id],
    );
  const openProduct = (p) => {
    setSelected(p);
    setQty(1);
    setNote("");
    setModal("product");
  };
  const checkout = () => {
    setStep(1);
    setPaid(false);
    setModal("checkout");
  };
  const complete = () => {
    const nextOrder = {
      id: String(Date.now()),
      total: subtotal + fee,
      mode,
      table,
      tableUid: tableRecord?.uid || null,
      payment,
      items: cart.map((i) => ({
        name: i.name,
        qty: i.qty,
        price: i.price,
        image: i.image,
        note: i.note,
      })),
      createdAt: new Date().toISOString(),
    };
    setOrder(nextOrder);
    const nextOrders = [nextOrder, ...orders];
    setOrders(nextOrders);
    localStorage.setItem("nori-orders", JSON.stringify(nextOrders));
    setPaid(true);
    updateCart([]);
  };
  let filtered = products.filter(
    (p) =>
      (category === "Todos" || p.category === category) &&
      (!onlyFavorites || favorites.includes(p.id)) &&
      (p.name + " " + p.description)
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  if (sort) filtered = [...filtered].sort((a, b) => a.price - b.price);
  return (
    <>
      <header className="header">
        <div className="header-inner">
          <button
            className="logo"
            onClick={enterFullscreen}
            aria-label="Nori — ativar tela cheia"
            title="Ativar tela cheia"
          >
            <span className="logo-mark">の</span>nori
            <span className="logo-dot">.</span>
            <span className="logo-caption">SUSHI FEITO NA HORA</span>
          </button>
          <nav aria-label="Navegação do site">
            {[
              ["/", "Início"],
              ["/cardapio", "Cardápio"],
              ["/pedidos", "Pedidos"],
              ["/favoritos", "Favoritos"],
            ].map(([path, label]) => (
              <Link
                key={path}
                to={pageLink(path)}
                className={page === path ? "active" : ""}
                aria-current={page === path ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <span className="open-status">
              <i /> Aberto agora
            </span>
            <button
              className="bag-button"
              onClick={() => setModal("cart")}
              disabled={invalidTable}
            >
              <ShoppingBag size={19} />
              <span>Minha sacola</span>
              <b>{count}</b>
            </button>
          </div>
        </div>
      </header>
      <main>
        <div className="service-bar">
          <div
            className="mode-switch"
            role="group"
            aria-label="Modalidade do pedido"
          >
            <button
              className={mode === "delivery" && !invalidTable ? "selected" : ""}
              aria-pressed={mode === "delivery" && !invalidTable}
              onClick={() => {
                const params = new URLSearchParams(route.search);
                params.delete("mesa");
                setModal(null);
                navigate(page + (params.size ? "?" + params.toString() : ""));
              }}
            >
              <Bike size={19} /> Delivery
            </button>
            <button
              className={mode === "table" ? "selected" : ""}
              aria-pressed={mode === "table"}
              onClick={() => {
                if (mode !== "table") setModal("scan");
              }}
            >
              <Utensils size={17} /> Presencial
            </button>
          </div>
          <button
            className="location"
            disabled={mode === "table" || invalidTable}
            onClick={() => setModal("address")}
          >
            <MapPin size={18} />
            <span>
              {mode === "delivery" ? (
                <>
                  <small>Entregar em</small>
                  <strong>{address || "Onde vai ser o seu sushi?"}</strong>
                </>
              ) : (
                <>
                  <small>Você está na Nori</small>
                  <strong>Mesa {table} · pedir por aqui</strong>
                </>
              )}
            </span>
            {mode === "delivery" && <ChevronDown size={16} />}
          </button>
          <span className="delivery-time">
            <Clock3 size={16} />
            {mode === "delivery" ? "35–50 min" : "20–30 min"}
            <span>•</span>
            {mode === "delivery"
              ? "Entrega a partir de R$ 5,90"
              : "Preparado na hora"}
          </span>
        </div>
        {invalidTable && (
          <section className="empty invalid-table">
            <QrCode size={40} />
            <h2>Este QR code não foi reconhecido.</h2>
            <p>
              Escaneie novamente o código da sua mesa ou continue com um pedido
              para entrega.
            </p>
            <button className="primary" onClick={() => setModal("scan")}>
              Ler QR code
            </button>
            <button
              className="back-button"
              onClick={() => navigate("/cardapio")}
            >
              Pedir delivery
            </button>
          </section>
        )}
        {!invalidTable && page === "/" && (
          <>
            <section className="hero">
              <div className="app-promo">
                <span>SEU FAVORITO, FEITO NA HORA</span>
                <h2>
                  Uma pausa.
                  <br />
                  Muito sushi.
                </h2>
                <p>
                  Seu combinado favorito a partir de <b>R$ 89,90</b>
                </p>
                <button onClick={() => openProduct(products[0])}>
                  Quero experimentar <ArrowRight size={15} />
                </button>
                <img src={photos.combo} alt="Combinado de sushi da casa" />
              </div>
              <div className="hero-copy">
                <div className="eyebrow">
                  <span />
                  FEITO NA HORA. FEITO COM ALMA.
                </div>
                <h1>
                  Seu momento
                  <br />
                  pede <span>sushi.</span>
                  <svg viewBox="0 0 225 15" aria-hidden="true">
                    <path d="M5 10Q105 -4 218 7M30 14Q120 2 198 11" />
                  </svg>
                </h1>
                <p>
                  Ingredientes frescos, combinações que surpreendem
                  <br className="desktop" /> e aquele sabor que faz você querer
                  mais.
                </p>
                <Link className="primary hero-cta" to={pageLink("/cardapio")}>
                  Explorar cardápio <ArrowRight size={18} />
                </Link>
                <div className="hero-proof">
                  <div className="avatar-stack">
                    <img src="https://i.pravatar.cc/60?img=47" alt="" />
                    <img src="https://i.pravatar.cc/60?img=12" alt="" />
                    <img src="https://i.pravatar.cc/60?img=44" alt="" />
                  </div>
                  <div>
                    <span className="stars">★★★★★</span>
                    <span>
                      <strong>4,9</strong> · Mais de 1.200 momentos felizes
                    </span>
                  </div>
                </div>
              </div>
              <div className="hero-visual">
                <img
                  className="hero-food"
                  src={photos.combo}
                  alt="Seleção de sushis de salmão com arroz e ingredientes frescos"
                />
                <div className="hero-image-shade" />
                <span className="vertical-japanese" aria-hidden="true">
                  新鮮でおいしい
                </span>
                <div className="fresh-stamp">
                  <Leaf size={22} />
                  <span>
                    SEMPRE
                    <br />
                    <strong>fresquinho</strong>
                  </span>
                </div>
                <div className="hero-product">
                  <div>
                    <span>SEU NOVO FAVORITO</span>
                    <h3>Combinado Nori</h3>
                    <p>32 peças de pura felicidade</p>
                  </div>
                  <button
                    onClick={() => openProduct(products[0])}
                    aria-label="Ver Combinado Nori"
                  >
                    <ArrowUpRight size={25} />
                  </button>
                </div>
              </div>
            </section>
            <div className="benefits">
              <span>
                <Leaf />
                Ingredientes selecionados
              </span>
              <span>
                <Utensils />
                Feito na hora, com carinho
              </span>
              <span>
                <ShieldCheck />
                Pagamento seguro
              </span>
              <span>
                <Heart />
                Sabor que aproxima
              </span>
            </div>
          </>
        )}
        {!invalidTable && ["/", "/cardapio", "/favoritos"].includes(page) && (
          <section
            id="cardapio"
            className={
              "menu-section " + (page !== "/" ? "standalone-menu" : "")
            }
          >
            <div className="section-heading">
              <div>
                <div className="eyebrow coral">
                  ESCOLHA O SEU PRÓXIMO FAVORITO
                </div>
                <h2>
                  {onlyFavorites ? (
                    "Meus favoritos"
                  ) : page === "/cardapio" ? (
                    "Cardápio"
                  ) : (
                    <>
                      Um match com a sua fome<span>.</span>
                    </>
                  )}
                </h2>
                {page !== "/" && (
                  <p className="page-description">
                    {onlyFavorites
                      ? "Os sabores que você ama, guardados em um só lugar."
                      : "Escolha seus favoritos. A gente prepara cada peça na hora."}
                  </p>
                )}
              </div>
              <label className="search">
                <Search size={19} />
                <input
                  placeholder="O que você está com vontade?"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    aria-label="Limpar busca"
                  >
                    <X size={16} />
                  </button>
                )}
              </label>
            </div>
            <div className="category-row">
              <div className="categories">
                {categories.map(([name, emoji]) => (
                  <button
                    key={name}
                    className={category === name ? "current" : ""}
                    onClick={() => setCategory(name)}
                  >
                    <span>{emoji}</span>
                    {name}
                  </button>
                ))}
              </div>
              <button
                className={"filter-button " + (sort ? "enabled" : "")}
                onClick={() => setSort(!sort)}
                title="Ordenar por menor preço"
              >
                <SlidersHorizontal size={18} />
                <span>{sort ? "Menor preço" : "Filtros"}</span>
              </button>
            </div>
            <div className="menu-label">
              <h3>
                {onlyFavorites
                  ? "Seus favoritos"
                  : category === "Todos"
                    ? "Os queridinhos da casa"
                    : category}{" "}
                {!onlyFavorites && category === "Todos" && <Flame size={20} />}
              </h3>
              <span>
                {filtered.length} opções para você{" "}
                {onlyFavorites && (
                  <Link to={pageLink("/cardapio")}>Ver cardápio completo</Link>
                )}
              </span>
            </div>
            <div className="product-grid">
              {filtered.map((p) => (
                <article className="product-card" key={p.id}>
                  <div className="product-image" onClick={() => openProduct(p)}>
                    <img src={p.image} alt={p.name} loading="lazy" />
                    {p.badge && (
                      <span
                        className={
                          "product-badge " +
                          (p.badge === "Vegetariano" ? "green" : "")
                        }
                      >
                        {p.badge === "Vegetariano" ? (
                          <Leaf size={12} />
                        ) : (
                          <Flame size={12} />
                        )}{" "}
                        {p.badge}
                      </span>
                    )}
                    <button
                      className={
                        "favorite " + (favorites.includes(p.id) ? "liked" : "")
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        favorite(p.id);
                      }}
                      aria-label={`${favorites.includes(p.id) ? "Remover" : "Adicionar"} ${p.name} ${favorites.includes(p.id) ? "dos" : "aos"} favoritos`}
                    >
                      <Heart
                        size={18}
                        fill={
                          favorites.includes(p.id) ? "currentColor" : "none"
                        }
                      />
                    </button>
                  </div>
                  <div className="product-info">
                    <div className="product-meta">
                      <span>{p.pieces}</span>
                      <span>
                        <Star size={12} fill="currentColor" />
                        {p.rating}
                      </span>
                    </div>
                    <button
                      className="product-title"
                      onClick={() => openProduct(p)}
                    >
                      {p.name}
                    </button>
                    <p>{p.description}</p>
                    <div className="product-bottom">
                      <div>
                        {p.old && <del>{money(p.old)}</del>}
                        <strong>{money(p.price)}</strong>
                      </div>
                      <button
                        className="add-button"
                        aria-label={`Adicionar ${p.name}`}
                        onClick={() => add(p)}
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {!filtered.length && (
              <div className="empty">
                <Search size={32} />
                <h3>
                  {onlyFavorites
                    ? "Seus favoritos moram aqui"
                    : "Nenhum prato encontrado"}
                </h3>
                <p>
                  {onlyFavorites
                    ? "Toque no coração dos pratos que você ama."
                    : "Tente outro nome ou escolha outra categoria."}
                </p>
                <button
                  className="primary"
                  onClick={() => {
                    if (onlyFavorites) navigate(pageLink("/cardapio"));
                    setSearch("");
                    setCategory("Todos");
                  }}
                >
                  Explorar cardápio
                </button>
              </div>
            )}
          </section>
        )}
        {page === "/pedidos" && (
          <OrdersPage orders={orders} menuLink={pageLink("/cardapio")} />
        )}
        {!["/", "/cardapio", "/pedidos", "/favoritos"].includes(page) && (
          <section className="empty">
            <h1>Página não encontrada</h1>
            <Link className="primary" to={pageLink("/")}>
              Voltar ao início
            </Link>
          </section>
        )}
        {page === "/" && (
          <section className="table-banner">
            <div className="banner-icon">
              <QrCode size={30} />
            </div>
            <div>
              <span>JÁ ESTÁ POR AQUI?</span>
              <h3>Sua mesa. Seu tempo. Seu sushi.</h3>
              <p>
                Escaneie o QR code da mesa, escolha seus favoritos e pague pelo
                app.
              </p>
            </div>
            {mode === "delivery" && (
              <button className="qr-page-link" onClick={() => setModal("scan")}>
                <QrCode size={17} /> Ler QR code da mesa{" "}
                <ArrowRight size={16} />
              </button>
            )}
            <span className="banner-japanese" aria-hidden="true">
              寿司
            </span>
          </section>
        )}
      </main>
      <footer>
        <button
          className="logo"
          onClick={enterFullscreen}
          aria-label="Nori — ativar tela cheia"
          title="Ativar tela cheia"
        >
          <span className="logo-mark">の</span>nori
          <span className="logo-dot">.</span>
        </button>
        <p>Feito com carinho. Compartilhado com quem você ama.</p>
        <span>
          © {new Date().getFullYear()} Nori Sushi{" "}
          <span className="footer-dot">•</span> Experiência demonstrativa
        </span>
      </footer>
      <nav className="bottom-nav" aria-label="Navegação principal">
        {[
          ["/", "Início", Home],
          ["/cardapio", "Cardápio", Utensils],
          ["/pedidos", "Pedidos", ReceiptText],
          ["/favoritos", "Favoritos", Heart],
        ].map(([path, label, Icon]) => (
          <Link
            key={path}
            to={pageLink(path)}
            className={page === path ? "active" : ""}
            aria-current={page === path ? "page" : undefined}
          >
            <Icon size={20} />
            <span>{label}</span>
            {path === "/pedidos" && orders.length > 0 && <i />}
          </Link>
        ))}
      </nav>
      {count > 0 && (
        <button
          className="mobile-cart primary"
          onClick={() => setModal("cart")}
        >
          <ShoppingBag size={19} />
          <span>
            Ver sacola · {count} {count === 1 ? "item" : "itens"}
          </span>
          <strong>{money(subtotal)}</strong>
        </button>
      )}
      {toast && (
        <div className="toast" role="status">
          <Check size={18} />
          {toast}
        </div>
      )}
      {modal && (
        <div className="overlay" onClick={() => setModal(null)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-label={
              modal === "cart"
                ? "Minha sacola"
                : modal === "checkout"
                  ? "Finalizar pedido"
                  : "Informações do pedido"
            }
            className={
              "modal " +
              (modal === "cart" ? "drawer" : "") +
              (modal === "product" ? " product-modal" : "")
            }
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close"
              onClick={() => setModal(null)}
              aria-label="Fechar"
            >
              <X size={21} />
            </button>
            {modal === "scan" && <QrScanner onDetect={scanTable} />}
            {modal === "product" && (
              <>
                <img
                  className="detail-image"
                  src={selected.image}
                  alt={selected.name}
                />
                <div className="modal-padding">
                  <span className="eyebrow coral">
                    {selected.category} · {selected.pieces}
                  </span>
                  <h2>{selected.name}</h2>
                  <p>{selected.details}</p>
                  <p className="allergens">
                    Atenção a alergênicos: os pratos podem conter peixe, soja,
                    leite, gergelim e glúten. Consulte a equipe em caso de
                    restrições.
                  </p>
                  <label className="field">
                    Alguma observação?
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Ex.: sem cebolinha"
                      maxLength={200}
                    />
                  </label>
                  <div className="detail-bottom">
                    <div className="quantity">
                      <button
                        disabled={qty <= 1}
                        onClick={() => setQty(qty - 1)}
                        aria-label="Diminuir quantidade"
                      >
                        <Minus size={16} />
                      </button>
                      <b>{qty}</b>
                      <button
                        onClick={() => setQty(qty + 1)}
                        aria-label="Aumentar quantidade"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      className="primary"
                      onClick={() => add(selected, qty, note)}
                    >
                      Adicionar <span>{money(selected.price * qty)}</span>
                    </button>
                  </div>
                </div>
              </>
            )}
            {modal === "cart" && (
              <div className="modal-padding cart-content">
                <span className="eyebrow coral">SEU MOMENTO NORI</span>
                <h2>
                  Minha sacola <span className="count">{count}</span>
                </h2>
                <div className="cart-mode">
                  {mode === "delivery" ? (
                    <Bike size={18} />
                  ) : (
                    <Utensils size={18} />
                  )}{" "}
                  {mode === "delivery"
                    ? "Delivery · 35–50 min"
                    : `Na mesa ${table} · 20–30 min`}
                </div>
                {!cart.length ? (
                  <div className="empty">
                    <ShoppingBag size={42} />
                    <h3>Falta um pouco de sushi por aqui</h3>
                    <p>Escolha seus favoritos e deixe o resto com a gente.</p>
                    <button className="primary" onClick={() => setModal(null)}>
                      Ver cardápio
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="cart-items">
                      {cart.map((i) => (
                        <div className="cart-item" key={i.key}>
                          <img src={i.image} alt={i.name} />
                          <div>
                            <h4>{i.name}</h4>
                            <small>
                              {i.pieces}
                              {i.note && ` · ${i.note}`}
                            </small>
                            <strong>{money(i.price * i.qty)}</strong>
                          </div>
                          <div className="quantity">
                            <button
                              onClick={() => change(i.key, -1)}
                              aria-label={`Diminuir ${i.name}`}
                            >
                              <Minus size={14} />
                            </button>
                            <b>{i.qty}</b>
                            <button
                              onClick={() => change(i.key, 1)}
                              aria-label={`Aumentar ${i.name}`}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="cart-summary">
                      <div>
                        <span>Subtotal</span>
                        <span>{money(subtotal)}</span>
                      </div>
                      <div>
                        <span>
                          {mode === "delivery"
                            ? "Taxa de entrega"
                            : "Serviço na mesa"}
                        </span>
                        <span>{fee ? money(fee) : "Grátis"}</span>
                      </div>
                      <div className="total">
                        <strong>Total</strong>
                        <strong>{money(subtotal + fee)}</strong>
                      </div>
                      <button className="primary full" onClick={checkout}>
                        Continuar para pagamento <ArrowRight size={18} />
                      </button>
                      <p className="secure">
                        <ShieldCheck size={14} /> Pagamento simulado · nenhum
                        valor será cobrado
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
            {modal === "address" && (
              <form
                className="modal-padding"
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  const value = `${f.get("street")}, ${f.get("number")} · ${f.get("district")}, ${f.get("city")}${f.get("extra") ? " · " + f.get("extra") : ""}`;
                  setAddress(value);
                  localStorage.setItem("nori-address", value);
                  setModal(null);
                }}
              >
                <div className="modal-icon">
                  <MapPin />
                </div>
                <h2>Seu sushi vai até você.</h2>
                <p>Adicione o endereço de entrega.</p>
                <label className="field">
                  Rua / avenida
                  <input name="street" required placeholder="Rua das Flores" />
                </label>
                <div className="form-row">
                  <label className="field">
                    Número
                    <input name="number" required placeholder="123" />
                  </label>
                  <label className="field">
                    Bairro
                    <input name="district" required placeholder="Centro" />
                  </label>
                </div>
                <label className="field">
                  Cidade / UF
                  <input name="city" required placeholder="Fortaleza / CE" />
                </label>
                <label className="field">
                  Complemento (opcional)
                  <input
                    name="extra"
                    placeholder="Apartamento, bloco, referência"
                  />
                </label>
                <button className="primary full">
                  Salvar endereço <Check size={18} />
                </button>
              </form>
            )}
            {modal === "about" && (
              <div className="modal-padding">
                <div className="modal-icon">
                  <Leaf />
                </div>
                <h2>Prazer, somos a Nori.</h2>
                <p>
                  Acreditamos que comida boa cria momentos especiais. Por isso,
                  cada peça é preparada na hora, com ingredientes selecionados e
                  uma boa dose de carinho.
                </p>
                <div className="about-note">
                  <h3>Uma experiência para experimentar</h3>
                  <p>
                    Esta é uma loja demonstrativa. Você pode montar um pedido,
                    experimentar o pagamento por Pix ou cartão. Nenhum pedido
                    real será enviado e nenhum valor será cobrado.
                  </p>
                </div>
                <button className="primary full" onClick={() => setModal(null)}>
                  Vamos de sushi <ArrowRight size={18} />
                </button>
              </div>
            )}
            {modal === "checkout" && (
              <div className="modal-padding">
                {paid ? (
                  <div className="success">
                    <div className="success-icon">
                      <CheckCheck size={34} />
                    </div>
                    <span className="eyebrow coral">DEU MATCH!</span>
                    <h2>Seu pedido está confirmado.</h2>
                    <p>
                      {order.mode === "delivery"
                        ? "Seu sushi será preparado e entregue no endereço informado."
                        : `Agora é só relaxar. Vamos levar seu sushi até a mesa ${order.table}.`}
                    </p>
                    <div className="order-receipt">
                      <div>
                        <span>Pedido</span>
                        <strong>#{order.id}</strong>
                      </div>
                      <div>
                        <span>Previsão</span>
                        <strong>
                          {order.mode === "delivery"
                            ? "35–50 minutos"
                            : "20–30 minutos"}
                        </strong>
                      </div>
                      <div>
                        <span>Pagamento</span>
                        <strong>
                          {order.payment === "pix" ? "Pix" : "Cartão"} ·{" "}
                          {money(order.total)}
                        </strong>
                      </div>
                    </div>
                    <p className="demo-notice">
                      Pedido demonstrativo. Nenhuma cobrança ou entrega real foi
                      realizada.
                    </p>
                    <button
                      className="primary full"
                      onClick={() => {
                        setModal(null);
                        navigate(pageLink("/pedidos"));
                      }}
                    >
                      Acompanhar pedido <ArrowRight size={18} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="eyebrow coral">
                      QUASE NA HORA DO SUSHI
                    </span>
                    <h2>Finalizar pedido</h2>
                    <div className="checkout-steps">
                      <span className={step === 1 ? "active" : ""}>
                        1. Seus dados
                      </span>
                      <ChevronRight size={15} />
                      <span className={step === 2 ? "active" : ""}>
                        2. Pagamento
                      </span>
                    </div>
                    <p className="demo-notice">
                      Ambiente de demonstração. Use apenas dados fictícios.
                      Nenhum valor será cobrado.
                    </p>
                    {step === 1 ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          setStep(2);
                        }}
                      >
                        <label className="field">
                          Como podemos chamar você?
                          <input
                            required
                            value={customer}
                            onChange={(e) => setCustomer(e.target.value)}
                            placeholder="Seu primeiro nome"
                          />
                        </label>
                        {mode === "delivery" ? (
                          <label className="field">
                            Endereço completo de entrega
                            <textarea
                              required
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              placeholder="Rua, número, bairro, cidade e complemento"
                            />
                          </label>
                        ) : (
                          <label className="field">
                            Número da mesa
                            <input
                              type="number"
                              required
                              min="1"
                              max="99"
                              value={table}
                              readOnly
                              aria-describedby="table-origin"
                            />
                            <small id="table-origin">
                              Mesa identificada pelo QR code.
                            </small>
                          </label>
                        )}
                        <div className="checkout-total">
                          <span>
                            {count} itens ·{" "}
                            {mode === "delivery" ? "delivery" : `mesa ${table}`}
                          </span>
                          <strong>{money(subtotal + fee)}</strong>
                        </div>
                        <button className="primary full">
                          Escolher pagamento <ArrowRight size={18} />
                        </button>
                      </form>
                    ) : (
                      <>
                        <div className="payment-options">
                          <button
                            className={payment === "pix" ? "chosen" : ""}
                            onClick={() => setPayment("pix")}
                          >
                            <QrCode />
                            Pix <small>Aprovação na hora</small>
                            {payment === "pix" && <Check size={16} />}
                          </button>
                          <button
                            className={payment === "card" ? "chosen" : ""}
                            onClick={() => setPayment("card")}
                          >
                            <CreditCard />
                            Cartão <small>Crédito</small>
                            {payment === "card" && <Check size={16} />}
                          </button>
                        </div>
                        {payment === "pix" ? (
                          <>
                            <div className="pix-box">
                              <QrCode size={105} strokeWidth={1.2} />
                              <strong>Pix demonstrativo</strong>
                              <p>
                                Este código é apenas ilustrativo.
                                <br />
                                Simule a confirmação para concluir seu pedido.
                              </p>
                              <button
                                className="copy-button"
                                onClick={async () => {
                                  try {
                                    await navigator.clipboard.writeText(
                                      "NORI-DEMO-SEM-VALOR-PAGAMENTO-SIMULADO",
                                    );
                                    setCopied(true);
                                  } catch {
                                    notify("Código: NORI-DEMO-SEM-VALOR");
                                  }
                                }}
                              >
                                {copied ? (
                                  <Check size={16} />
                                ) : (
                                  <Copy size={16} />
                                )}{" "}
                                {copied
                                  ? "Código copiado"
                                  : "Copiar código de demonstração"}
                              </button>
                            </div>
                            <button className="primary full" onClick={complete}>
                              Simular pagamento Pix · {money(subtotal + fee)}
                            </button>
                          </>
                        ) : (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              complete();
                            }}
                          >
                            <label className="field">
                              Nome no cartão (fictício)
                              <input
                                required
                                placeholder="MARIA SILVA"
                                autoComplete="off"
                              />
                            </label>
                            <label className="field">
                              Número do cartão de teste
                              <input
                                required
                                inputMode="numeric"
                                pattern="[0-9 ]{16,23}"
                                placeholder="4242 4242 4242 4242"
                                maxLength={23}
                                autoComplete="off"
                              />
                            </label>
                            <div className="form-row">
                              <label className="field">
                                Validade
                                <input
                                  required
                                  placeholder="12/30"
                                  pattern="(0[1-9]|1[0-2])/[0-9]{2}"
                                  maxLength={5}
                                  autoComplete="off"
                                />
                              </label>
                              <label className="field">
                                CVV fictício
                                <input
                                  required
                                  placeholder="123"
                                  pattern="[0-9]{3,4}"
                                  maxLength={4}
                                  inputMode="numeric"
                                  autoComplete="off"
                                />
                              </label>
                            </div>
                            <button className="primary full">
                              Simular pagamento · {money(subtotal + fee)}
                            </button>
                          </form>
                        )}
                        <button
                          className="back-button"
                          onClick={() => setStep(1)}
                        >
                          Voltar aos meus dados
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
