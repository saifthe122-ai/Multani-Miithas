
"use client";

import { useEffect, useState } from "react";
import type { CSSProperties, FormEvent } from "react";

type PublishedMedia = {
  name?: string;
  url?: string;
  type?: string;
};

type PublishedProductSetting = {
  name?: string;
  enabled?: boolean;
  background?: string;
};

type PublishedSettings = {
  media?: PublishedMedia[];
  products?: PublishedProductSetting[];
  heroTitle?: string;
  heroSubtitle?: string;
  backgroundColor?: string;
  brandColor?: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  discount: number;
  weight: string;
  image: string;
  image_url: string;
  imageIcon: string;
  description: string;
  ingredients: string;
  rating: number;
  status: "Active" | "Inactive";
};

type CartItem = {
  productId: number;
  weight: number;
  quantity: number;
};

type PaymentMethod = {
  id: string;
  method_key: string;
  name: string;
  description?: string;
  payment_type?: string;
  instructions?: string;
  display_order?: number;
};

type PaymentAccount = {
  id: string;
  account_name: string;
  account_type: string;
  provider: string;
  account_title: string;
  account_number: string;
  iban?: string;
  currency: string;
  is_primary: boolean;
};

const WEIGHT_OPTIONS = [1, 1.5, 2, 5];

const cartKey = (productId: number, weight: number) =>
  `${productId}-${weight}`;

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

const BUSINESS_EMAIL =
  process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "";

const BUSINESS_PHONE =
  process.env.NEXT_PUBLIC_BUSINESS_PHONE || "";

const defaultProducts: Product[] = [
  {
    id: 1,
    name: "Multani Sohan Halwa",
    price: 1200,
    category: "Traditional Sweets",
    image:
      "https://images.unsplash.com/photo-1605197161470-5d6e5f7f2f4d?auto=format&fit=crop&w=700&q=85",
    image_url: "",
    imageIcon: "🍬",
    stock: 0,
    discount: 0,
    weight: "",
    description: "",
    ingredients: "",
    rating: 5,
    status: "Active",
  },
  {
    id: 2,
    name: "Premium Barfi",
    price: 900,
    category: "Traditional Sweets",
    image:
      "https://images.unsplash.com/photo-1601303516534-2b1c2d6f5f8e?auto=format&fit=crop&w=700&q=85",
    image_url: "",
    imageIcon: "🍬",
    stock: 0,
    discount: 0,
    weight: "",
    description: "",
    ingredients: "",
    rating: 5,
    status: "Active",
  },
  {
    id: 3,
    name: "Gulab Jamun",
    price: 650,
    category: "Traditional Sweets",
    image:
      "https://images.unsplash.com/photo-1666190094762-1e7f1a3e7e3b?auto=format&fit=crop&w=700&q=85",
    image_url: "",
    imageIcon: "🍬",
    stock: 0,
    discount: 0,
    weight: "",
    description: "",
    ingredients: "",
    rating: 5,
    status: "Active",
  },
  {
    id: 4,
    name: "Besan Ladoo",
    price: 750,
    category: "Traditional Sweets",
    image:
      "https://images.unsplash.com/photo-1606471191009-63994c53433b?auto=format&fit=crop&w=700&q=85",
    image_url: "",
    imageIcon: "🍬",
    stock: 0,
    discount: 0,
    weight: "",
    description: "",
    ingredients: "",
    rating: 5,
    status: "Active",
  },
  {
    id: 5,
    name: "Premium Gift Box",
    price: 2500,
    category: "Gift Boxes",
    image:
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=700&q=85",
    image_url: "",
    imageIcon: "🎁",
    stock: 0,
    discount: 0,
    weight: "",
    description: "",
    ingredients: "",
    rating: 5,
    status: "Active",
  },
  {
    id: 6,
    name: "Sweet Celebration Box",
    price: 3200,
    category: "Gift Boxes",
    image:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=700&q=85",
    image_url: "",
    imageIcon: "🎁",
    stock: 0,
    discount: 0,
    weight: "",
    description: "",
    ingredients: "",
    rating: 5,
    status: "Active",
  },
  {
    id: 7,
    name: "Traditional Patisa",
    price: 1100,
    category: "Traditional Sweets",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=85",
    image_url: "",
    imageIcon: "🍬",
    stock: 0,
    discount: 0,
    weight: "",
    description: "",
    ingredients: "",
    rating: 5,
    status: "Active",
  },
  {
    id: 8,
    name: "Bakery Special",
    price: 1800,
    category: "Bakery",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=85",
    image_url: "",
    imageIcon: "🎂",
    stock: 0,
    discount: 0,
    weight: "",
    description: "",
    ingredients: "",
    rating: 5,
    status: "Active",
  },
];

const money = (amount: number) =>
  "PKR " + amount.toLocaleString("en-PK");

const sectionStyle: CSSProperties = {
  padding: "65px 6%",
  scrollMarginTop: 25,
};

const goldButton: CSSProperties = {
  background: "var(--mm-brand-color, #D8AC55)",
  color: "#172E30",
  padding: "13px 23px",
  border: "1px solid #E8C77F",
  borderRadius: 3,
  cursor: "pointer",
  fontWeight: 700,
  textDecoration: "none",
  display: "inline-block",
};

const fallbackPaymentMethods: PaymentMethod[] = [
  {
    id: "cod-fallback",
    method_key: "cash_on_delivery",
    name: "Cash on Delivery",
    description: "Order receive karte waqt cash payment.",
    payment_type: "manual",
    instructions: "Delivery par cash ada karein.",
    display_order: 1,
  },
];

export default function Home() {
  const [products, setProducts] =
    useState<Product[]>(defaultProducts);

  const [cart, setCart] =
    useState<Record<string, CartItem>>({});

  const [selectedWeights, setSelectedWeights] =
    useState<Record<number, number>>({});

  const [availablePaymentMethods, setAvailablePaymentMethods] =
    useState<PaymentMethod[]>(fallbackPaymentMethods);
const [availablePaymentAccounts, setAvailablePaymentAccounts] =
  useState<PaymentAccount[]>([]);
  
  const [message, setMessage] = useState("");

  const [publishedSettings, setPublishedSettings] =
    useState<PublishedSettings | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("Cash on Delivery");

 const [submittingOrder, setSubmittingOrder] = useState(false);
const [savedOrderNumber, setSavedOrderNumber] = useState("");
const [savedOrderAmount, setSavedOrderAmount] = useState(0);
const [savedPaymentMethod, setSavedPaymentMethod] = useState("");
const [savedCustomerPhone, setSavedCustomerPhone] = useState("");
const [cartOpen, setCartOpen] = useState(false);

  // Products database se load karein.
  useEffect(() => {
    let cancelled = false;

    fetch("/api/products", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Products load nahi huay");
        }
        return response.json();
      })
      .then((result: unknown) => {
        if (
          !result ||
          typeof result !== "object" ||
          cancelled
        ) {
          return;
        }

        const payload = result as {
          success?: boolean;
          products?: unknown;
        };

        if (
          !payload.success ||
          !Array.isArray(payload.products)
        ) {
          return;
        }

        const databaseProducts: Product[] = payload.products
          .filter(
            (item): item is Record<string, unknown> =>
              Boolean(item) &&
              typeof item === "object" &&
              !Array.isArray(item)
          )
          .map((item) => {
            const name = String(item.name ?? "Product");

            const savedDefault = defaultProducts.find(
              (product) =>
                product.name.toLowerCase() === name.toLowerCase()
            );

            const imageUrl =
              typeof item.image_url === "string"
                ? item.image_url
                : "";

            return {
              id: Number(item.id),
              name,
              price: Number(item.price ?? 0),
              category: String(item.category ?? "Sweets"),
              stock: Number(item.stock ?? 0),
              discount: Number(item.discount ?? 0),
              weight: String(item.weight ?? ""),
              image:
                imageUrl ||
                savedDefault?.image ||
                defaultProducts[0].image,
              image_url: imageUrl,
              imageIcon:
                typeof item.image === "string"
                  ? item.image
                  : "🍬",
              description: String(item.description ?? ""),
              ingredients: String(item.ingredients ?? ""),
              rating: Number(item.rating ?? 5),
              status: (
                String(item.status ?? "").toLowerCase() === "inactive"
                  ? "Inactive"
                  : "Active"
              ) as "Active" | "Inactive",
            };
          })
          .filter(
            (product) =>
              Number.isSafeInteger(product.id) &&
              product.id > 0 &&
              Number.isFinite(product.price) &&
              product.price >= 0
          );

        if (!cancelled && databaseProducts.length > 0) {
          setProducts(databaseProducts);
        }
      })
      .catch((error: unknown) => {
        console.error("Products load error:", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Website media settings load karein.
  useEffect(() => {
    let cancelled = false;

    fetch("/api/site-media", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Media settings load nahi huin");
        }
        return response.json();
      })
      .then((result: unknown) => {
        if (
          cancelled ||
          !result ||
          typeof result !== "object"
        ) {
          return;
        }

        const payload = result as {
          success?: boolean;
          settings?: PublishedSettings;
        };

        if (payload.success && payload.settings) {
          setPublishedSettings(payload.settings);
        }
      })
      .catch((error: unknown) => {
        console.error("Media settings error:", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

// Admin mein enabled payment methods aur accounts load karein.
useEffect(() => {
  let cancelled = false;

  fetch("/api/payment-options", { cache: "no-store" })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Payment options load nahi huay");
      }
      return response.json();
    })
    .then((result: unknown) => {
      if (
        cancelled ||
        !result ||
        typeof result !== "object"
      ) {
        return;
      }

      const payload = result as {
        success?: boolean;
        methods?: unknown;
        accounts?: unknown;
      };

      if (!payload.success) {
        return;
      }

      // Payment accounts load karein.
      if (Array.isArray(payload.accounts)) {
        const accounts = payload.accounts.filter(
          (item): item is PaymentAccount => {
            if (
              !item ||
              typeof item !== "object" ||
              Array.isArray(item)
            ) {
              return false;
            }

            const account = item as Record<string, unknown>;

            return (
              typeof account.id === "string" &&
              typeof account.account_title === "string" &&
              typeof account.account_number === "string" &&
              typeof account.provider === "string"
            );
          }
        );

        if (!cancelled) {
          setAvailablePaymentAccounts(accounts);
        }
      }

      // Payment methods load karein.
      if (Array.isArray(payload.methods)) {
        const methods = payload.methods.filter(
          (item): item is PaymentMethod => {
            if (
              !item ||
              typeof item !== "object" ||
              Array.isArray(item)
            ) {
              return false;
            }

            const method = item as Record<string, unknown>;

            return (
              typeof method.id === "string" &&
              typeof method.name === "string" &&
              method.name.trim().length > 0
            );
          }
        );

        if (!cancelled && methods.length > 0) {
          const sortedMethods = [...methods].sort(
            (a, b) =>
              (a.display_order ?? 999) -
              (b.display_order ?? 999)
          );

          setAvailablePaymentMethods(sortedMethods);
          setPaymentMethod(sortedMethods[0].name);
        }
      }
    })
    .catch((error: unknown) => {
      console.error("Payment options error:", error);
      // COD fallback pehle se available hai.
    });

  return () => {
    cancelled = true;
  };
}, []);

  const publishedMedia = Array.isArray(
    publishedSettings?.media
  )
    ? publishedSettings.media
    : [];

  const normalizeName = (value: string) =>
    value
      .toLowerCase()
      .replace(/\.[a-z0-9]+$/i, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();

  const findPublishedMedia = (
    keywords: string[],
    type: "image" | "video",
    fallback: string
  ) => {
    const match = publishedMedia.find((item) => {
      if (!item.url || !item.name) return false;

      const savedType = String(item.type || "").toLowerCase();

      const typeMatches =
        type === "image"
          ? savedType === "image" ||
            savedType.startsWith("image/")
          : savedType === "video" ||
            savedType.startsWith("video/");

      if (!typeMatches) return false;

      const name = normalizeName(item.name);

      return keywords.some((keyword) =>
        name.includes(normalizeName(keyword))
      );
    });

    return match?.url || fallback;
  };

  const heroImage = findPublishedMedia(
    ["hero", "banner"],
    "image",
    "/images/multan-hero.jpg"
  );

  const heritageImage = findPublishedMedia(
    ["shrine", "heritage", "story"],
    "image",
    "/images/multan-shrine-story.jpg"
  );

  const giftBannerImage = findPublishedMedia(
    ["gift banner", "gift hamper", "hamper"],
    "image",
    "/images/multan-gift-hamper.jpg"
  );

  const promoVideo = findPublishedMedia(
    ["promo", "brand film", "homepage video", "multani mithas"],
    "video",
    "/videos/multani-mithas-promo.mp4"
  );

  const promoVideoType = /\.webm(?:$|[?#])/i.test(promoVideo)
    ? "video/webm"
    : "video/mp4";

  const heroTitle =
    publishedSettings?.heroTitle || "Multan Ki Mithas,";

  const heroSubtitle =
    publishedSettings?.heroSubtitle ||
    "Saraiki Wasib ki riwayat, har mithai ke saath. Discover the timeless taste and sweet heritage of Multan, Pakistan.";

  const backgroundColor =
    publishedSettings?.backgroundColor || "#F3E8D4";

  const brandColor =
    publishedSettings?.brandColor || "#D8AC55";

  const getProductSetting = (product: Product) =>
    publishedSettings?.products?.find(
      (item) =>
        normalizeName(String(item.name || "")) ===
        normalizeName(product.name)
    );

  const isProductEnabled = (product: Product) =>
    getProductSetting(product)?.enabled !== false;

  const getProductBackground = (product: Product) =>
    "#FFF8EA";

  const getProductImage = (product: Product) =>
    findPublishedMedia(
      [product.name],
      "image",
      product.image_url || product.image
    );

  const isGiftProduct = (product: Product) =>
    product.category === "Gift Boxes";

  const getSelectedWeight = (productId: number) =>
    selectedWeights[productId] ?? 1;

  // Product ko selected weight ke saath cart mein add karein.
  const addToCart = (id: number, weight = 1) => {
    setSavedOrderNumber("");

    const key = cartKey(id, weight);

    setCart((old) => ({
      ...old,
      [key]: {
        productId: id,
        weight,
        quantity: (old[key]?.quantity || 0) + 1,
      },
    }));

    setMessage("");
    setCartOpen(true);
  };

  // Cart se selected product/weight remove karein.
  const removeFromCart = (key: string) => {
    setSavedOrderNumber("");

    setCart((old) => {
      const next = { ...old };
      const item = next[key];

      if (!item) return old;

      if (item.quantity > 1) {
        next[key] = {
          ...item,
          quantity: item.quantity - 1,
        };
      } else {
        delete next[key];
      }

      return next;
    });

    setMessage("Cart update ho gaya.");
  };

  const cartItems = Object.values(cart);

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const total = cartItems.reduce((sum, item) => {
    const product = products.find(
      (p) => p.id === item.productId
    );

    if (!product) return sum;

    return (
      sum +
      product.price *
        (isGiftProduct(product) ? 1 : item.weight) *
        item.quantity
    );
  }, 0);

  const regularProducts = products.filter(
    (product) =>
      product.category !== "Gift Boxes" &&
      isProductEnabled(product)
  );

  const giftProducts = products.filter(
    (product) =>
      product.category === "Gift Boxes" &&
      isProductEnabled(product)
  );

  // Customer order submit karein.
  const placeOrder = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (submittingOrder) return;

    if (cartCount === 0) {
      setMessage("Pehle cart mein product add karein.");
      return;
    }

    if (
      !customerName.trim() ||
      !customerPhone.trim() ||
      !deliveryAddress.trim()
    ) {
      setMessage("Naam, phone aur address enter karein.");
      return;
    }

    if (
      !/^[0-9+\-()\s]{7,30}$/.test(customerPhone.trim())
    ) {
      setMessage("Valid phone number enter karein.");
      return;
    }

    const items = cartItems.map((item) => ({
      productId: String(item.productId),
      weight: isGiftProduct(
        products.find((p) => p.id === item.productId) ||
          defaultProducts[0]
      )
        ? 1
        : item.weight,
      quantity: item.quantity,
    }));

    if (items.length === 0) {
      setMessage("Cart mein valid products nahi hain.");
      return;
    }

    setSubmittingOrder(true);
    setSavedOrderNumber("");
    setMessage("");

    try {
    const response = await fetch("/api/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    customerName: customerName.trim(),
    phone: customerPhone.trim(),
    address: deliveryAddress.trim(),
    paymentMethod,
    items: items.map((item) => ({
      productId: String(item.productId),
      weight: Number(item.weight ?? 1),
      quantity: Number(item.quantity),
    })),
  }),
});

const result: unknown = await response.json();

      if (!result || typeof result !== "object") {
        throw new Error("Server se valid response nahi mila.");
      }

      const data = result as {
        success?: boolean;
        message?: string;
        order?: {
          orderNumber?: string;
        };
      };

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Order save nahi ho saka."
        );
      }
const orderNumber = data.order?.orderNumber || "";

setSavedOrderNumber(orderNumber);
setSavedOrderAmount(total);
setSavedPaymentMethod(paymentMethod);
setSavedCustomerPhone(customerPhone.trim());

setCart({});
setCustomerName("");
setCustomerPhone("");
setDeliveryAddress("");

      setMessage(
        orderNumber
          ? `Order ${orderNumber} successfully save ho gaya.`
          : "Order successfully save ho gaya."
      );
    } catch (error: unknown) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Order save nahi ho saka. Dobara try karein."
      );
    } finally {
      setSubmittingOrder(false);
    }
  };

  const contactEmail = BUSINESS_EMAIL.trim();

  const categories = [
    { name: "Sohan Halwa", symbol: "✦" },
    { name: "Barfi", symbol: "❖" },
    { name: "Gulab Jamun", symbol: "✧" },
    { name: "Ladoo", symbol: "❋" },
    { name: "Patisa", symbol: "✦" },
    { name: "Cakes & Bakery", symbol: "❖" },
    { name: "Gift Boxes", symbol: "✧" },
  ];

  return (
    <main
      style={
        {
          background: backgroundColor,
          color: "#243537",
          "--mm-brand-color": brandColor,
          fontFamily: "Georgia, 'Times New Roman', serif",
          lineHeight: 1.7,
          overflow: "hidden",
        } as CSSProperties
      }
    >
      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; }

        .mm-topbar {
          background: #092F32;
          color: #F6E9D0;
          border-bottom: 1px solid rgba(216,172,85,.55);
          padding: 13px 5%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .mm-brand {
          text-decoration: none;
          color: #E4BD69;
          min-width: 190px;
        }

        .mm-brand-title {
          margin: 0;
          font-size: 25px;
          letter-spacing: 2px;
          line-height: 1.3;
        }

        .mm-brand-subtitle {
          font-size: 10px;
          letter-spacing: 3px;
          color: #F3E8D4;
        }

        .mm-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 18px;
        }

        .mm-nav a {
          color: #F3E8D4;
          text-decoration: none;
          font-size: 13px;
        }

        .mm-nav a:hover { color: #E4BD69; }

        .mm-cart-link {
          color: #092F32 !important;
          background: var(--mm-brand-color, #D8AC55);
          padding: 9px 14px;
          font-weight: bold;
          border: 1px solid #E8C77F;
          border-radius: 2px;
          cursor: pointer;
          font-family: inherit;
          font-size: 13px;
        }

        .mm-hero {
          min-height: 540px;
          display: flex;
          align-items: center;
          padding: 65px 8%;
          color: #FFF4E0;
          background-color: #123638;
          background-size: cover;
          background-position: center;
          border-bottom: 4px solid #C89A43;
        }

        .mm-hero-content { max-width: 610px; }

        .mm-eyebrow {
          color: #B88A38;
          letter-spacing: 3px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .mm-hero .mm-eyebrow { color: #E6BD6C; }

        .mm-hero h1 {
          color: #FFF1D7;
          font-size: clamp(42px, 6vw, 76px);
          line-height: 1.08;
          margin: 17px 0;
          font-weight: normal;
        }

        .mm-hero-script {
          display: block;
          color: #E6BD6C;
          font-style: italic;
          font-size: .88em;
        }

        .mm-hero-description {
          font-size: 18px;
          max-width: 450px;
          color: #F5E7CE;
          margin: 20px 0 28px;
        }

        .mm-outline-button {
          display: inline-block;
          padding: 12px 22px;
          border: 1px solid #D8AC55;
          color: #F6E9D0;
          text-decoration: none;
          margin-left: 10px;
        }

        .mm-section-heading {
          text-align: center;
          color: #123F42;
          font-size: clamp(28px, 4vw, 39px);
          line-height: 1.2;
          font-weight: normal;
          margin: 0 0 12px;
        }

        .mm-section-intro {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 35px;
          color: #6C5A43;
          font-size: 15px;
        }

        .mm-ornament {
          text-align: center;
          color: #B88A38;
          font-size: 23px;
          margin: 0 auto 10px;
          letter-spacing: 8px;
        }

        .mm-category-grid {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 13px;
          margin-top: 35px;
        }

        .mm-category {
          display: flex;
          min-height: 105px;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 5px;
          text-align: center;
          text-decoration: none;
          color: #F6E9D0;
          background: linear-gradient(145deg, #145154, #082F32);
          border: 1px solid #C69A4A;
          padding: 14px 7px;
        }

        .mm-category:hover { background: #1A6263; }
        .mm-category-symbol { color: #E3BD70; font-size: 27px; }
        .mm-category-name { font-size: 12px; font-weight: bold; }

        .mm-card {
          background: #FFF8EA;
          border: 1px solid #D8C59F;
          overflow: hidden;
          box-shadow: 0 5px 16px rgba(47,38,22,.07);
          transition: transform .2s ease;
        }

        .mm-card:hover { transform: translateY(-3px); }

        .mm-product-image {
          display: block;
          width: 100%;
          height: 250px;
          padding: 10px;
          object-fit: contain;
          object-position: center;
          background: #FFF8EA;
        }

        .mm-card-body {
          padding: 20px 15px 23px;
          text-align: center;
          background: #FFF8EA;
        }

        .mm-card-category {
          color: #9A7132;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .mm-card-title {
          color: #153E40;
          font-size: 19px;
          line-height: 1.4;
          margin: 8px 0;
        }

        .mm-price {
          color: #8A5630;
          font-size: 20px;
          font-weight: bold;
          margin: 10px 0 16px;
        }

        .mm-gold-button {
          background: #D8AC55;
          color: #173639;
          border: 1px solid #BD8E36;
          border-radius: 2px;
          padding: 11px 18px;
          cursor: pointer;
          font-weight: bold;
          font-family: inherit;
        }

        .mm-gold-button:hover { background: #E7C77F; }
        .mm-gold-button:disabled { cursor: wait; opacity: .65; }

        .mm-heritage {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 45px;
          background: radial-gradient(ellipse at top left, #1B5251, transparent 50%), #092F32;
          color: #F3E8D4;
          border-top: 3px solid #C89A43;
          border-bottom: 3px solid #C89A43;
        }

        .mm-heritage-image {
          width: 100%;
          aspect-ratio: 4 / 3;
          object-fit: cover;
          border: 2px solid #D8AC55;
          display: block;
        }

        .mm-heritage h2 {
          font-size: clamp(30px, 4vw, 43px);
          font-weight: normal;
          line-height: 1.2;
          color: #FFF0D4;
          margin: 12px 0 20px;
        }

        .mm-heritage p { color: #E8DCC5; }

        .mm-video {
          width: 100%;
          display: block;
          aspect-ratio: 16 / 9;
          object-fit: cover;
          background: #061F21;
          border: 2px solid #C89A43;
        }

        .mm-benefits {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 15px;
          text-align: center;
        }

        .mm-benefit {
          padding: 8px;
          color: #244547;
          font-size: 13px;
        }

        .mm-benefit-symbol {
          color: #A87929;
          font-size: 27px;
          display: block;
          margin-bottom: 8px;
        }

        .mm-gift-banner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 25px;
          min-height: 300px;
          padding: 35px;
          color: #FFF1D8;
          background-size: cover;
          background-position: center;
          border: 2px solid #C99B4A;
        }

        .mm-gift-banner h2 {
          font-size: clamp(30px, 4vw, 45px);
          line-height: 1.2;
          font-weight: normal;
        }

        .mm-info-card {
          padding: 24px;
          background: #FFF8EA;
          border: 1px solid #D8C59F;
        }

        .mm-input {
          display: block;
          width: 100%;
          padding: 11px;
          margin-top: 6px;
          border: 1px solid #D8C59F;
          background: #FFFDF7;
          color: #243537;
          font: inherit;
          border-radius: 2px;
        }

        .mm-input:focus {
          outline: 2px solid #D8AC55;
          outline-offset: 1px;
        }

        .mm-footer {
          background: #082D30;
          color: #F3E8D4;
          padding: 45px 6% 25px;
          text-align: center;
          border-top: 3px solid #C89A43;
        }

        .mm-footer a {
          color: #E6BD6C;
          text-decoration: none;
        }

        .mm-toast {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3000;
          background: #092F32;
          color: #FFF5DF;
          border: 1px solid #D8AC55;
          padding: 12px 18px;
          width: max-content;
          max-width: 90%;
          box-shadow: 0 5px 20px rgba(0,0,0,.2);
        }

        .mm-cart-overlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          overflow-y: auto;
          overscroll-behavior: contain;
          background: rgba(4, 24, 26, .88);
          padding: 24px 14px;
        }

        .mm-cart-panel {
          max-width: 850px;
          width: 100%;
          margin: 0 auto;
          padding: 25px;
          background: #F3E8D4;
          border: 2px solid #D8AC55;
          box-shadow: 0 15px 50px rgba(0,0,0,.35);
          border-radius: 4px;
        }

        .mm-cart-close-row {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 8px;
        }

        @media (max-width: 1000px) {
          .mm-category-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          .mm-benefits { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .mm-heritage { gap: 25px; }
        }

        @media (max-width: 650px) {
          .mm-topbar { justify-content: center; text-align: center; }
          .mm-brand { width: 100%; }
          .mm-nav { gap: 13px; }
          .mm-nav a { font-size: 12px; }
          .mm-hero { min-height: 510px; padding: 50px 7%; background-position: 62% center; }
          .mm-hero h1 { font-size: 43px; }
          .mm-hero-description { font-size: 16px; }
          .mm-outline-button { margin: 12px 0 0; }
          .mm-category-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .mm-product-image { height: 210px; }
          .mm-heritage { grid-template-columns: 1fr; }
          .mm-benefits { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .mm-gift-banner { grid-template-columns: 1fr; padding: 25px; min-height: 350px; }
          .mm-cart-overlay { padding: 10px; }
          .mm-cart-panel { padding: 16px; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            scroll-behavior: auto !important;
            transition: none !important;
          }
        }
      `}</style>

      <header className="mm-topbar">
        <a href="#home" className="mm-brand">
          <h2 className="mm-brand-title">✧ MULTANI MITHAS ✧</h2>
          <span className="mm-brand-subtitle">
            MULTAN KI MITHAS, DIL SE
          </span>
        </a>

        <nav className="mm-nav">
          <a href="#home">Home</a>
          <a href="#products">Shop</a>
          <a href="#about">Our Story</a>
          <a href="#gallery">Gallery</a>
          <a href="#video">Our Video</a>
          <a href="#contact">Contact</a>
          <button
            type="button"
            className="mm-cart-link"
            onClick={() => setCartOpen(true)}
            aria-label={`Open shopping cart, ${cartCount} items`}
          >
            Cart ({cartCount})
          </button>
        </nav>
      </header>

      <section
        id="home"
        className="mm-hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(5,25,27,.92), rgba(5,25,27,.25)), url("${heroImage}")`,
        }}
      >
        <div className="mm-hero-content">
          <p className="mm-eyebrow">Authentic Multani Sweets</p>
          <h1>
            {heroTitle}
            {!heroTitle.toLowerCase().includes("dil se") && (
              <span className="mm-hero-script"> Dil Se</span>
            )}
          </h1>
          <p className="mm-hero-description">{heroSubtitle}</p>
          <a href="#products" style={goldButton}>
            Shop Our Mithai →
          </a>
          <a href="#about" className="mm-outline-button">
            Discover Our Story
          </a>
          <p style={{ fontSize: 12, color: "#E6BD6C", marginTop: 25 }}>
            TRADITION · HERITAGE · SWEETNESS
          </p>
        </div>
      </section>

      <section
        id="categories"
        style={{ ...sectionStyle, paddingTop: 45, paddingBottom: 48 }}
      >
        <div className="mm-ornament">❖ ✦ ❖</div>
        <h2 className="mm-section-heading">Our Signature Collection</h2>
        <p className="mm-section-intro">
          Traditional favourites inspired by the sweet heritage of Multan
          and the warmth of the Saraiki Wasib.
        </p>
        <div className="mm-category-grid">
          {categories.map((category) => (
            <a
              key={category.name}
              href={category.name === "Gift Boxes" ? "#gifts" : "#products"}
              className="mm-category"
            >
              <span className="mm-category-symbol">{category.symbol}</span>
              <span className="mm-category-name">{category.name}</span>
              <span style={{ color: "#E3BD70" }}>↗</span>
            </a>
          ))}
        </div>
      </section>

      <section
        id="products"
        style={{ ...sectionStyle, background: "#FFF8EA" }}
      >
        <div className="mm-ornament">✦ ❖ ✦</div>
        <h2 className="mm-section-heading">The Taste of Multan</h2>
        <p className="mm-section-intro">
          Explore our traditional sweets and bakery favourites. Prices
          are displayed in Pakistani rupees.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 22,
          }}
        >
          {regularProducts.map((product) => {
            const selectedWeight = getSelectedWeight(product.id);

            return (
              <article
                key={product.id}
                className="mm-card"
                style={{ background: getProductBackground(product) }}
              >
                <img
                  className="mm-product-image"
                  src={getProductImage(product)}
                  alt={product.name}
                  loading="lazy"
                />

                <div className="mm-card-body">
                  <span className="mm-card-category">
                    {product.category}
                  </span>

                  <h3 className="mm-card-title">{product.name}</h3>

                  {product.weight && <p>{product.weight}</p>}

                  <label
                    style={{
                      display: "block",
                      textAlign: "left",
                      fontSize: 13,
                      marginTop: 12,
                    }}
                  >
                    Select Weight
                    <select
                      className="mm-input"
                      value={selectedWeight}
                      onChange={(event) =>
                        setSelectedWeights((old) => ({
                          ...old,
                          [product.id]: Number(event.target.value),
                        }))
                      }
                    >
                      {WEIGHT_OPTIONS.map((weight) => (
                        <option key={weight} value={weight}>
                          {weight} kg
                        </option>
                      ))}
                    </select>
                  </label>

                  <p className="mm-price">
                    {money(product.price * selectedWeight)}
                  </p>

                  <p style={{ fontSize: 12, marginTop: -12 }}>
                    {money(product.price)} per kg
                  </p>

                  <button
                    type="button"
                    className="mm-gold-button"
                    onClick={() =>
                      addToCart(product.id, selectedWeight)
                    }
                  >
                    Add to Cart +
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section
        id="about"
        className="mm-heritage"
        style={sectionStyle}
      >
        <div>
          <img
            src={heritageImage}
            alt="Multan heritage and traditional architecture"
            className="mm-heritage-image"
            loading="lazy"
          />
          <p style={{ fontSize: 12, color: "#E6BD6C", textAlign: "center" }}>
            THE HERITAGE OF MULTAN
          </p>
        </div>
        <div>
          <p className="mm-eyebrow">Our Heritage</p>
          <h2>From the Heart of Multan</h2>
          <p>
            Multani Mithas is more than sweets. It is a celebration of
            tradition, family, hospitality and the cultural richness
            of South Punjab.
          </p>
          <p>
            Inspired by Multan&apos;s iconic blue tilework, historic
            architecture and the warmth of the Saraiki Wasib, we bring
            a taste of heritage to every special moment.
          </p>
          <a href="#video" style={goldButton}>Watch Our Story →</a>
        </div>
      </section>

      <section id="gallery" style={sectionStyle}>
        <div className="mm-ornament">❖ ✦ ❖</div>
        <h2 className="mm-section-heading">A Celebration of Sweetness</h2>
        <p className="mm-section-intro">
          From everyday treats to unforgettable gifts, discover the
          moments that bring families together.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: 20,
          }}
        >
          {[
            {
              image: products[0]
                ? getProductImage(products[0])
                : defaultProducts[0].image,
              title: "Our Traditional Sweets",
            },
            {
              image: products[4]
                ? getProductImage(products[4])
                : defaultProducts[4].image,
              title: "Gifts for Loved Ones",
            },
            {
              image: products[7]
                ? getProductImage(products[7])
                : defaultProducts[7].image,
              title: "Celebration Treats",
            },
          ].map((item) => (
            <article key={item.title} className="mm-card">
              <img
                src={item.image}
                alt={item.title}
                className="mm-product-image"
                loading="lazy"
                style={{ height: 260 }}
              />
              <div className="mm-card-body">
                <h3 className="mm-card-title">{item.title}</h3>
                <a href="#products" style={{ color: "#8B642B" }}>
                  Explore collection →
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="video"
        style={{ ...sectionStyle, background: "#092F32", color: "#F3E8D4" }}
      >
        <div className="mm-ornament">✦ ❖ ✦</div>
        <p className="mm-eyebrow" style={{ textAlign: "center" }}>
          Our Story · Our City · Our Tradition
        </p>
        <h2 className="mm-section-heading" style={{ color: "#FFF1D7" }}>
          Experience the Magic of Multan
        </h2>
        <p className="mm-section-intro" style={{ color: "#D9D0BE" }}>
          A visual journey through our heritage, traditional sweets
          and the city that inspires our story.
        </p>
        <div style={{ maxWidth: 950, margin: "auto" }}>
          <video
            className="mm-video"
            controls
            playsInline
            preload="metadata"
            poster={heritageImage}
          >
            <source src={promoVideo} type={promoVideoType} />
            Your browser does not support video playback.
          </video>
          <p style={{ textAlign: "center", fontSize: 13 }}>
            Our Multani Mithas brand film.
          </p>
        </div>
      </section>

      <section
        style={{
          ...sectionStyle,
          paddingTop: 32,
          paddingBottom: 32,
          background: "#E8D6B4",
        }}
      >
        <div className="mm-benefits">
          {[
            ["✿", "Traditional Taste", "Inspired by Multan"],
            ["❖", "Premium Quality", "Carefully presented"],
            ["♧", "Easy Ordering", "Simple shopping"],
            ["♧", "Delivery Enquiries", "Confirm before ordering"],
            ["♡", "Customer Care", "Here to help"],
          ].map(([symbol, title, subtitle]) => (
            <div key={title} className="mm-benefit">
              <span className="mm-benefit-symbol">{symbol}</span>
              <strong>{title}</strong>
              <br />
              <span>{subtitle}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="gifts" style={{ ...sectionStyle, background: "#FFF8EA" }}>
        <div
          className="mm-gift-banner"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(5,25,27,.92), rgba(5,25,27,.25)), url("${giftBannerImage}")`,
          }}
        >
          <div>
            <p className="mm-eyebrow">Special Collection</p>
            <h2>Gifts Filled with Tradition</h2>
            <p>
              Share the sweetness of Multan with family, friends
              and loved ones.
            </p>
            <a href="#gift-products" style={goldButton}>
              Explore Gift Boxes →
            </a>
          </div>
        </div>

        <h2 className="mm-section-heading" style={{ marginTop: 45 }}>
          Gift Boxes & Celebrations
        </h2>
        <p className="mm-section-intro">
          Thoughtful gifts for weddings, celebrations, family gatherings
          and special occasions.
        </p>

        <div
          id="gift-products"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: 22,
            maxWidth: 800,
            margin: "auto",
          }}
        >
          {giftProducts.map((product) => (
            <article
              key={product.id}
              className="mm-card"
              style={{ background: getProductBackground(product) }}
            >
              <img
                className="mm-product-image"
                src={getProductImage(product)}
                alt={product.name}
                loading="lazy"
              />
              <div className="mm-card-body">
                <h3 className="mm-card-title">{product.name}</h3>
                <p className="mm-price">{money(product.price)}</p>
                <p style={{ fontSize: 12 }}>Fixed price gift box</p>
                <button
                  type="button"
                  className="mm-gold-button"
                  onClick={() => addToCart(product.id, 1)}
                >
                  Add to Cart +
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Cart and checkout popup */}
      {cartOpen && (
        <div
          className="mm-cart-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mm-cart-heading"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setCartOpen(false);
            }
          }}
        >
          <section className="mm-cart-panel">
            <div className="mm-cart-close-row">
              <button
                type="button"
                className="mm-gold-button"
                onClick={() => setCartOpen(false)}
                aria-label="Close shopping cart"
              >
                Close ✕
              </button>
            </div>

            <div className="mm-ornament">❖ ✦ ❖</div>
            <h2
              id="mm-cart-heading"
              className="mm-section-heading"
            >
              Your Shopping Cart
            </h2>
            <p className="mm-section-intro">
              Review your selection and enter delivery details to place
              an order.
            </p>

            {cartCount === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: 30,
                  border: "1px solid #D8C59F",
                  background: "#FFF8EA",
                  maxWidth: 650,
                  margin: "auto",
                }}
              >
              {savedOrderNumber ? (
  <div role="status">
    <h3>Order submitted successfully!</h3>

    <p>Your order number:</p>
    <strong style={{ overflowWrap: "anywhere" }}>
      {savedOrderNumber}
    </strong>

    <h3 style={{ marginTop: "20px" }}>Payment Details</h3>

    <p>
      Payment method: <strong>{savedPaymentMethod}</strong>
    </p>

    <p>
      Payable product amount:{" "}
      <strong>{money(savedOrderAmount)}</strong>
    </p>

    <p>
      Delivery charges will be confirmed by our business.
    </p>

    {savedPaymentMethod.toLowerCase().includes("cash") ||
    savedPaymentMethod.toLowerCase().includes("cod") ? (
      <p>
        Cash on Delivery: payment delivery receive karte waqt
        ada karein.
      </p>
    ) : (
      <>
        <h3>Transfer to this account</h3>

        {availablePaymentAccounts
          .filter((account) => {
            const provider = account.provider.trim().toLowerCase();
            const method = savedPaymentMethod.trim().toLowerCase();

            return (
              provider === method ||
              method.includes(provider) ||
              provider.includes(method)
            );
          })
          .sort(
            (a, b) =>
              Number(b.is_primary) - Number(a.is_primary)
          )
          .map((account) => (
            <div
              key={account.id}
              style={{
                padding: "12px",
                marginTop: "10px",
                border: "1px solid #d6c7a1",
                borderRadius: "8px",
              }}
            >
              <p>
                Account title: <strong>{account.account_title}</strong>
              </p>
              <p>
                Account number: <strong>{account.account_number}</strong>
              </p>
              {account.iban && (
                <p>
                  IBAN: <strong>{account.iban}</strong>
                </p>
              )}
              <p>Currency: {account.currency}</p>
            </div>
          ))}

        {availablePaymentAccounts.filter((account) => {
          const provider = account.provider.trim().toLowerCase();
          const method = savedPaymentMethod.trim().toLowerCase();

          return (
            provider === method ||
            method.includes(provider) ||
            provider.includes(method)
          );
        }).length === 0 && (
          <p>
            Payment account details are not available right now.
            Please contact us on WhatsApp.
          </p>
        )}

        <p>
          Payment karne ke baad screenshot WhatsApp par bhejein.
          Admin payment verify karne ke baad status update karega.
        </p>

       {WHATSAPP_NUMBER && (
  <a
    href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(
      `Assalam-o-Alaikum, I have placed order ${savedOrderNumber}. Payment method: ${savedPaymentMethod}. Amount: ${money(savedOrderAmount)}. My phone: ${savedCustomerPhone}. I am sending my payment screenshot.`
    )}`}
    target="_blank"
    rel="noopener noreferrer"
    style={goldButton}
  >
    Send Payment Screenshot on WhatsApp
  </a>
        )}
      </>
    )}

    <p>Payment status: Pending verification</p>
    <p>Order status: Pending confirmation</p>
  </div>
) : (

                  <>
                    Your cart is empty. Explore our collection and choose
                    your favourite sweets.
                    <p>
                      <button
                        type="button"
                        className="mm-gold-button"
                        onClick={() => setCartOpen(false)}
                      >
                        Continue Shopping
                      </button>
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div
                style={{
                  maxWidth: 800,
                  margin: "auto",
                  padding: 25,
                  background: "#FFF8EA",
                  border: "1px solid #D8C59F",
                }}
              >
                {cartItems.map((item) => {
                  const product = products.find(
                    (p) => p.id === item.productId
                  );

                  if (!product) return null;

                  const gift = isGiftProduct(product);
                  const lineTotal =
                    product.price *
                    (gift ? 1 : item.weight) *
                    item.quantity;

                  const key = cartKey(
                    item.productId,
                    item.weight
                  );

                  return (
                    <div
                      key={key}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                        flexWrap: "wrap",
                        padding: "15px 0",
                        borderBottom: "1px solid #D8C59F",
                      }}
                    >
                      <div>
                        <strong>{product.name}</strong>
                        <div>
                          {gift
                            ? `Fixed price × ${item.quantity}`
                            : `${item.weight} kg × ${item.quantity}`}
                        </div>
                        <div style={{ fontSize: 13 }}>
                          {gift
                            ? "Gift box price"
                            : `${money(product.price)} per kg`}
                        </div>
                      </div>

                      <div>
                        <strong>{money(lineTotal)}</strong>
                        <button
                          type="button"
                          onClick={() => removeFromCart(key)}
                          style={{
                            padding: "7px 10px",
                            marginLeft: 8,
                            cursor: "pointer",
                            border: "1px solid #C8B48C",
                            background: "#F3E8D4",
                          }}
                        >
                          − Remove
                        </button>
                      </div>
                    </div>
                  );
                })}

                <h3 style={{ textAlign: "right", color: "#123F42" }}>
                  Subtotal: {money(total)}
                </h3>

                <p style={{ fontSize: 14 }}>
                  Delivery charges are not included. Final delivery cost
                  and payment arrangements must be confirmed by the business.
                </p>

                <form
                  onSubmit={placeOrder}
                  style={{ display: "grid", gap: 15, marginTop: 25 }}
                >
                  <h3>Delivery & Checkout Details</h3>

                  <label>
                    Customer Name
                    <input
                      className="mm-input"
                      value={customerName}
                      onChange={(event) =>
                        setCustomerName(event.target.value)
                      }
                      maxLength={120}
                      required
                      autoComplete="name"
                      placeholder="Apna poora naam"
                    />
                  </label>

                  <label>
                    Phone Number
                    <input
                      className="mm-input"
                      type="tel"
                      value={customerPhone}
                      onChange={(event) =>
                        setCustomerPhone(event.target.value)
                      }
                      maxLength={30}
                      required
                      autoComplete="tel"
                      placeholder="+92..."
                    />
                  </label>

                  <label>
                    Full Delivery Address (city, country, postal code)
                    <textarea
                      className="mm-input"
                      value={deliveryAddress}
                      onChange={(event) =>
                        setDeliveryAddress(event.target.value)
                      }
                      maxLength={500}
                      required
                      rows={3}
                      autoComplete="street-address"
                      placeholder="House, street, city, country"
                    />
                  </label>

                  <label>
                    Payment Method
                    <select
                      className="mm-input"
                      value={paymentMethod}
                      onChange={(event) =>
                        setPaymentMethod(event.target.value)
                      }
                      required
                    >
                      {availablePaymentMethods.map((method) => (
                        <option key={method.id} value={method.name}>
                          {method.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  {availablePaymentMethods.find(
                    (method) => method.name === paymentMethod
                  )?.description && (
                    <p style={{ fontSize: 13, marginTop: -8 }}>
                      {
                        availablePaymentMethods.find(
                          (method) => method.name === paymentMethod
                        )?.description
                      }
                    </p>
                  )}

                  {availablePaymentMethods.find(
                    (method) => method.name === paymentMethod
                  )?.instructions && (
                    <p style={{ fontSize: 13, marginTop: -8 }}>
                      {
                        availablePaymentMethods.find(
                          (method) => method.name === paymentMethod
                        )?.instructions
                      }
                    </p>
                  )}

                  {availablePaymentAccounts
                    .filter(
                      (account) =>
                        account.provider.trim().toLowerCase() ===
                        paymentMethod.trim().toLowerCase()
                    )
                    .sort(
                      (a, b) =>
                        Number(b.is_primary) - Number(a.is_primary)
                    )
                    .map((account) => (
                      <div
                        key={account.id}
                        style={{
                          border: "1px solid #c9a45c",
                          borderRadius: 10,
                          padding: 14,
                          marginTop: 12,
                        }}
                      >
                        <p><strong>Payment Account</strong></p>
                        <p>Account Title: {account.account_title}</p>
                        <p>Account Number: {account.account_number}</p>
                        {account.iban && <p>IBAN: {account.iban}</p>}
                        <p>Currency: {account.currency}</p>
                      </div>
                    ))}
                    
                  <p style={{ fontSize: 14 }}>
                    Online payment is not processed automatically. Payment
                    verification and delivery charges will be confirmed
                    by the business.
                  </p>

                  <button
                    type="submit"
                    className="mm-gold-button"
                    disabled={submittingOrder}
                    style={{ width: "100%" }}
                  >
                    {submittingOrder
                      ? "Saving Order..."
                      : "Place Order & Save"}
                  </button>
                </form>
              </div>
            )}
          </section>
        </div>
      )}

      <section id="delivery" style={{ ...sectionStyle, background: "#FFF8EA" }}>
        <h2 className="mm-section-heading">Delivery Information</h2>
        <p className="mm-section-intro">
          Contact us to confirm availability and delivery arrangements
          for your destination.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          <article className="mm-info-card">
            <p className="mm-eyebrow">Pakistan</p>
            <h3>Domestic Orders</h3>
            <p>
              Delivery areas, charges, estimated timing and payment
              arrangements must be confirmed before an order is accepted.
            </p>
          </article>
          <article className="mm-info-card">
            <p className="mm-eyebrow">Worldwide</p>
            <h3>International Enquiries</h3>
            <p>
              Overseas delivery depends on courier availability, food
              import rules, product eligibility and shipping costs.
            </p>
          </article>
        </div>
      </section>

      <section id="payments" style={{ ...sectionStyle, background: "#E8D6B4" }}>
        <h2 className="mm-section-heading">Payment Information</h2>
        <p style={{ maxWidth: 800, margin: "auto", textAlign: "center" }}>
          Payment methods shown at checkout depend on the methods enabled
          by the business. Transfer details and payment verification
          must be confirmed manually by the business. Do not send card
          details or passwords through WhatsApp.
        </p>
      </section>

      <section
        id="contact"
        style={{ ...sectionStyle, background: "#FFF8EA", textAlign: "center" }}
      >
        <div className="mm-ornament">✦ ❖ ✦</div>
        <h2 className="mm-section-heading">Contact Multani Mithas</h2>
        <p className="mm-section-intro">
          Product questions, bulk orders, gift collections and delivery
          enquiries — we are here to help.
        </p>

        {BUSINESS_PHONE ? (
          <p>
            Phone: <a href={`tel:${BUSINESS_PHONE}`}>{BUSINESS_PHONE}</a>
          </p>
        ) : (
          <p>Business phone number will be added soon.</p>
        )}

        {contactEmail ? (
          <p>
            Email: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </p>
        ) : (
          <p>Business email will be added soon.</p>
        )}

        {WHATSAPP_NUMBER ? (
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(
              "Assalam-o-Alaikum Multani Mithas, I have a question about your products and delivery."
            )}`}
            target="_blank"
            rel="noreferrer"
            style={goldButton}
          >
            Contact Us on WhatsApp
          </a>
        ) : (
          <p>WhatsApp contact will be activated after adding your number.</p>
        )}
      </section>

      <section id="policies" style={sectionStyle}>
        <h2 className="mm-section-heading">
          Customer Information & Policies
        </h2>
        <div style={{ maxWidth: 850, margin: "auto" }}>
          <h3>Orders and cancellations</h3>
          <p>
            An order is not confirmed until the business confirms product
            availability, final price, delivery and payment arrangements.
          </p>
          <h3>Shipping and customs</h3>
          <p>
            International shipping charges, customs duties, import
            restrictions and delivery times vary by destination.
          </p>
          <h3>Refunds and product issues</h3>
          <p>
            Contact the business about damaged, incorrect or missing items.
            Publish a complete refund policy before accepting online payments.
          </p>
          <h3>Privacy</h3>
          <p>
            Only provide the personal information needed to handle an order.
            Publish a complete privacy policy before collecting customer data.
          </p>
        </div>
      </section>

      <footer className="mm-footer">
        <div className="mm-ornament">✦ ❖ ✦</div>
        <h2
          style={{
            color: "#E6BD6C",
            letterSpacing: 3,
            fontSize: 26,
            marginBottom: 4,
          }}
        >
          MULTANI MITHAS
        </h2>
        <p style={{ fontStyle: "italic" }}>Multan Ki Mithas, Dil Se.</p>
        <p style={{ fontSize: 12, color: "#D9D0BE" }}>
          Inspired by the heritage and traditions of Multan,
          South Punjab, Pakistan.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 20,
            margin: "25px 0",
            fontSize: 13,
          }}
        >
          <a href="#policies">Customer Policies</a>
          <a href="#delivery">Delivery</a>
          <a href="#payments">Payments</a>
          <a href="#contact">Contact</a>
          <a href="#home">Back to Top ↑</a>
        </div>
        <div
          style={{
            borderTop: "1px solid rgba(216,172,85,.4)",
            paddingTop: 18,
            fontSize: 12,
          }}
        >
          © {new Date().getFullYear()} Multani Mithas. All rights reserved.
        </div>
      </footer>

      {message && (
        <div className="mm-toast" role="status">
          {message}
          <button
            type="button"
            onClick={() => setMessage("")}
            aria-label="Dismiss notification"
            style={{
              marginLeft: 15,
              cursor: "pointer",
              color: "#E6BD6C",
              background: "transparent",
              border: 0,
              fontSize: 18,
            }}
          >
            ×
          </button>
        </div>
      )}
    </main>
  );
}
