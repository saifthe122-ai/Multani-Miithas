"use client";

import Link from "next/link";
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

type PublishedOffer = {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  enabled: boolean;
};

type PublishedSettings = {
  aboutUs?: { heading?: string; story?: string; mission?: string; promise?: string };
  media?: PublishedMedia[];
  products?: PublishedProductSetting[];
  offers?: PublishedOffer[];
  heroTitle?: string;
  heroSubtitle?: string;
  backgroundColor?: string;
  brandColor?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    whatsapp?: string;
  };
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
    price_type?: "per_kg" | "fixed";
  weight_options?: Array<{
    weight: number | string;
    price: number | string;
    deliveryFee?: number | string;
    packagingFee?: number | string | null;
    salesTaxRate?: number | string | null;
    packagingType?: string;
    salesTaxBase?: string;
  }>;
};

type CartItem = {
  productId: number;
  weight: number;
  quantity: number;
};

type PaymentMethod = {
  id: string | number;
  method_key: string;
  name: string;
  description?: string;
  payment_type?: string;
  provider?: string;
  instructions?: string;
  display_order?: number;
};

type PaymentAccount = {
  id: string | number;
  account_name: string;
  account_type: string;
  provider: string;
  account_title: string;
  account_number: string;
  iban?: string;
  currency: string;
  is_primary: boolean;
  wallet_owner_type?: string;
  qr_image_url?: string;
  app_link?: string;
};

type CheckoutSettings = {
  deliveryFee: number;
  freeDeliveryMinimum: number;
  packagingFee: number;
  salesTaxEnabled: boolean;
  salesTaxRate: number;
};

const WEIGHT_OPTIONS = [0.5, 1, 1.5, 2, 5];

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

const normalizePaymentName = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

export default function Home() {
  const [products, setProducts] =
    useState<Product[]>([]);
  const [productsLoadError, setProductsLoadError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [offersOnly, setOffersOnly] = useState(false);

  const [cart, setCart] =
    useState<Record<string, CartItem>>({});

  const [selectedWeights, setSelectedWeights] =
    useState<Record<number, number>>({});

  const [availablePaymentMethods, setAvailablePaymentMethods] =
    useState<PaymentMethod[]>([]);

  const [availablePaymentAccounts, setAvailablePaymentAccounts] =
    useState<PaymentAccount[]>([]);
  const [selectedPaymentAccountId, setSelectedPaymentAccountId] = useState("");

  const [message, setMessage] = useState("");

  const [publishedSettings, setPublishedSettings] =
    useState<PublishedSettings | null>(null);

  const [checkoutSettings, setCheckoutSettings] = useState<CheckoutSettings>({
    deliveryFee: 0,
    freeDeliveryMinimum: 0,
    packagingFee: 0,
    salesTaxEnabled: false,
    salesTaxRate: 0,
  });
  const [checkoutSettingsLoaded, setCheckoutSettingsLoaded] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("Cash on Delivery");
const [paymentMethodOpen, setPaymentMethodOpen] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [checkoutRequestKey, setCheckoutRequestKey] = useState("");
  const [savedOrderNumber, setSavedOrderNumber] = useState("");
  const [savedOrderAmount, setSavedOrderAmount] = useState(0);
  const [savedPaymentMethod, setSavedPaymentMethod] = useState("");
  const [savedCustomerPhone, setSavedCustomerPhone] = useState("");

  const [savedPaymentAccounts, setSavedPaymentAccounts] =
    useState<PaymentAccount[]>([]);

  const [savedPaymentInstructions, setSavedPaymentInstructions] =
    useState("");

  const [copiedPaymentDetail, setCopiedPaymentDetail] =
    useState("");

  const [cartOpen, setCartOpen] = useState(false);

  // Category pages se aane wali selection ko homepage par restore karein.
  useEffect(() => {
    const requestedCategory = new URLSearchParams(window.location.search).get("category");
    if (requestedCategory) setSelectedCategory(requestedCategory);
  }, []);

  // Server checkout settings load karein taa-ke customer estimate final server total se match kare.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/checkout-settings", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Checkout settings load nahi huin.");
        return response.json();
      })
      .then((payload: unknown) => {
        if (!payload || typeof payload !== "object" || cancelled) return;
        const data = payload as { success?: boolean; settings?: Record<string, unknown> };
        if (!data.success || !data.settings) throw new Error("Checkout settings available nahi.");
        setCheckoutSettings({
          deliveryFee: Math.max(0, Number(data.settings.deliveryFee) || 0),
          freeDeliveryMinimum: Math.max(0, Number(data.settings.freeDeliveryMinimum) || 0),
          packagingFee: Math.max(0, Number(data.settings.packagingFee) || 0),
          salesTaxEnabled: data.settings.salesTaxEnabled === true,
          salesTaxRate: Math.min(100, Math.max(0, Number(data.settings.salesTaxRate) || 0)),
        });
        setCheckoutSettingsLoaded(true);
      })
      .catch((error) => {
        console.error("Checkout settings load failed:", error);
        if (!cancelled) setCheckoutSettingsLoaded(false);
      });
    return () => { cancelled = true; };
  }, []);

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
            price_type:
  String(item.price_type ?? "per_kg") === "fixed"
    ? ("fixed" as const)
    : ("per_kg" as const),
weight_options: Array.isArray(item.weight_options)
  ? (item.weight_options as NonNullable<Product["weight_options"]>)
  : [],
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

        if (!cancelled) {
          setProducts(databaseProducts.filter((product) => product.status === "Active"));
          setProductsLoadError("");
        }
      })
      .catch((error: unknown) => {
        console.error("Products load error:", error);
        if (!cancelled) {
          setProducts([]);
          setProductsLoadError("Products abhi load nahi ho sake. Barah-e-karam kuch dair baad dobara try karein.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Honour collection links coming from /shop/[slug] and keep the selected
  // collection focused after the customer returns to the main storefront.
  useEffect(() => {
    const requestedCategory = new URLSearchParams(window.location.search).get("category");
    if (!requestedCategory || products.length === 0) return;
    const matchingProduct = products.find(
      (product) => normalizeName(product.category) === normalizeName(requestedCategory)
    );
    if (matchingProduct) setSelectedCategory(matchingProduct.category);
  }, [products]);

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

  // Admin ke enabled payment methods aur active accounts load karein.
  useEffect(() => {
    let cancelled = false;

    const loadPaymentOptions = async () => {
      try {
        const response = await fetch("/api/payment-options", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Payment options load nahi huay");
        }

        const result: unknown = await response.json();

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

        if (!payload.success) return;

        const accounts: PaymentAccount[] = Array.isArray(
          payload.accounts
        )
          ? payload.accounts
              .filter(
                (item): item is Record<string, unknown> =>
                  Boolean(item) &&
                  typeof item === "object" &&
                  !Array.isArray(item)
              )
              .filter(
                (item) =>
                  (typeof item.id === "string" ||
                    typeof item.id === "number") &&
                  typeof item.provider === "string" &&
                  typeof item.account_title === "string" &&
                  typeof item.account_number === "string"
              )
              .map((item) => ({
                id: item.id as string | number,
                account_name: String(item.account_name ?? ""),
                account_type: String(item.account_type ?? ""),
                provider: String(item.provider ?? ""),
                account_title: String(item.account_title ?? ""),
                account_number: String(item.account_number ?? ""),
                iban: String(item.iban ?? ""),
                currency: String(item.currency ?? "PKR"),
                is_primary: Boolean(item.is_primary),
               wallet_owner_type: String(
  item.wallet_owner_type ?? "personal"
),
qr_image_url: String(item.qr_image_url ?? ""),
app_link: String(item.app_link ?? ""),
              }))
          : [];

        const methods: PaymentMethod[] = Array.isArray(
          payload.methods
        )
          ? payload.methods
              .filter(
                (item): item is Record<string, unknown> =>
                  Boolean(item) &&
                  typeof item === "object" &&
                  !Array.isArray(item)
              )
              .filter(
                (item) =>
                  (typeof item.id === "string" ||
                    typeof item.id === "number") &&
                  typeof item.name === "string" &&
                  item.name.trim().length > 0
              )
              .map((item) => ({
                id: item.id as string | number,
                method_key: String(item.method_key ?? ""),
                name: String(item.name ?? ""),
                description: String(item.description ?? ""),
                payment_type: String(item.payment_type ?? ""),
                provider: String(item.provider ?? ""),
                instructions: String(item.instructions ?? ""),
                display_order: Number(item.display_order ?? 999),
              }))
              .sort(
                (a, b) =>
                  (a.display_order ?? 999) -
                  (b.display_order ?? 999)
              )
          : [];

        if (cancelled) return;

        setAvailablePaymentAccounts(accounts);

        if (methods.length > 0) {
          setAvailablePaymentMethods(methods);

          setPaymentMethod((current) =>
            methods.some((method) => method.name === current)
              ? current
              : methods[0].name
          );
        } else {
          setAvailablePaymentMethods([]);
          setPaymentMethod("");
        }
      } catch (error: unknown) {
        console.error("Payment options error:", error);
      }
    };

    loadPaymentOptions();

    return () => {
      cancelled = true;
    };
  }, []);

  const activeWhatsAppNumber = WHATSAPP_NUMBER || (publishedSettings?.socialLinks?.whatsapp || "").replace(/\D/g, "");
  const brandLogo = publishedSettings?.media?.find((media) => /logo/i.test(media.name || ""))?.url || "";
  const aboutUs = publishedSettings?.aboutUs;

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
    defaultProducts[0].image
  );

  const heritageImage = findPublishedMedia(
    ["shrine", "heritage", "story"],
    "image",
    defaultProducts[6].image
  );

  const giftBannerImage = findPublishedMedia(
    ["gift banner", "gift hamper", "hamper"],
    "image",
    defaultProducts[4].image
  );

  const promoVideo = findPublishedMedia(
    ["promo", "brand film", "homepage video", "multani mithas"],
    "video",
    ""
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
    product.status === "Active" &&
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

  const parseWeightKg = (value: number | string): number | null => {
    if (typeof value === "number") {
      return Number.isFinite(value) && value > 0 ? value : null;
    }
    const match = value.trim().toLowerCase().match(/^([0-9]+(?:\.[0-9]+)?)\s*(kg|kgs|kilogram|kilograms|g|gm|gms|gram|grams)?$/);
    if (!match) return null;
    const amount = Number(match[1]);
    if (!Number.isFinite(amount) || amount <= 0) return null;
    return ["g", "gm", "gms", "gram", "grams"].includes(match[2] || "") ? amount / 1000 : amount;
  };

  const getProductWeightOptions = (product: Product): number[] => {
    const configured = (product.weight_options || [])
      .map((option) => parseWeightKg(option.weight))
      .filter((weight): weight is number => weight !== null);
    return configured.length > 0 ? Array.from(new Set(configured)) : WEIGHT_OPTIONS;
  };

  const getSelectedWeight = (productId: number) => {
    const product = products.find((item) => item.id === productId);
    const options = product ? getProductWeightOptions(product) : WEIGHT_OPTIONS;
    const selected = selectedWeights[productId];
    return selected !== undefined && options.includes(selected) ? selected : options[0];
  };

    const getProductPrice = (
    product: Product,
    weight: number
  ): number | null => {
    let basePrice: number;

    if (product.price_type === "fixed") {
      const option = product.weight_options?.find(
        (item) => parseWeightKg(item.weight) === weight
      );

      if (!option) return null;

      basePrice = Number(option.price);
    } else {
      basePrice = Number(product.price) * weight;
    }

    if (!Number.isFinite(basePrice)) return null;

    const discount = Math.min(
      100,
      Math.max(0, Number(product.discount) || 0)
    );

    return Math.round(basePrice * (1 - discount / 100) * 100) / 100;
  };
  const getWeightOption = (product: Product, weight: number) =>
    product.weight_options?.find((option) => parseWeightKg(option.weight) === weight);

  const getUnitCharges = (product: Product, weight: number, priceOverride?: number) => {
    const option = getWeightOption(product, weight);
    const unitPrice = priceOverride ?? getProductPrice(product, weight) ?? 0;
    const deliveryFee = Math.max(0, Number(option?.deliveryFee ?? 0) || 0);
    const packagingFee = Math.max(0, Number(option?.packagingFee ?? checkoutSettings.packagingFee) || 0);
    const configuredTaxRate = option?.salesTaxRate ?? (
      checkoutSettings.salesTaxEnabled ? checkoutSettings.salesTaxRate : 0
    );
    const salesTaxRate = Math.min(100, Math.max(0, Number(configuredTaxRate) || 0));
    const salesTaxBase = option?.salesTaxBase === "all_charges" ? "all_charges" : "product";
    const packagingType = String(option?.packagingType ?? "");
    const taxableAmount = salesTaxBase === "all_charges" ? unitPrice + deliveryFee + packagingFee : unitPrice;
    const taxAmount = Math.round(taxableAmount * salesTaxRate) / 100;
    return { unitPrice, deliveryFee, packagingFee, packagingType, salesTaxRate, salesTaxBase, taxAmount, unitTotal: unitPrice + deliveryFee + packagingFee + taxAmount };
  };

  const isCashOnDelivery = (methodName: string) => {
    const method = normalizePaymentName(methodName);

    return (
      method.includes("cashondelivery") ||
      method === "cod"
    );
  };

  const isJazzCash = (methodName: string) =>
    normalizePaymentName(methodName).includes("jazzcash");

  const getSelectedPaymentMethod = (methodName: string) =>
    availablePaymentMethods.find(
      (method) => method.name === methodName
    );

 const getMatchingPaymentAccounts = (
  methodName: string,
  methods: PaymentMethod[] = availablePaymentMethods,
  accounts: PaymentAccount[] = availablePaymentAccounts
) => {
  const selectedMethod = methods.find(
    (method) => method.name === methodName
  );

  const methodNames = [
    methodName,
    selectedMethod?.method_key || "",
    selectedMethod?.provider || "",
    selectedMethod?.name || "",
  ]
    .filter(Boolean)
    .map(normalizePaymentName);

  const isMethod = (value: string, names: string[]) =>
    names.includes(normalizePaymentName(value));

  const isCashOnDelivery = methodNames.some((name) =>
    ["cashondelivery", "cod"].includes(name)
  );

  if (isCashOnDelivery) return [];

  const isJazzCash = methodNames.includes("jazzcash");
  const isEasypaisa = methodNames.includes("easypaisa");
  const isRaast = methodNames.some((name) =>
    ["raast", "raastid"].includes(name)
  );
  const isBankTransfer = methodNames.includes("banktransfer");
  const isPayoneer = methodNames.includes("payoneer");

  return accounts
    .filter((account) => {
      const provider = normalizePaymentName(account.provider);
      const accountType = normalizePaymentName(account.account_type);

      if (isJazzCash) {
        return provider === "jazzcash";
      }

      if (isEasypaisa) {
        return provider === "easypaisa";
      }

      if (isRaast) {
        return (
          provider === "raast" ||
          accountType === "raast" ||
          accountType === "raastid"
        );
      }

      if (isBankTransfer) {
        return accountType === "bank";
      }

      if (isPayoneer) {
        return provider === "payoneer";
      }

      return isMethod(provider, methodNames);
    })
    .sort(
      (a, b) =>
        Number(b.is_primary) - Number(a.is_primary)
    );
};
  
  // Admin-configured payment links may use provider-supported placeholders.
  // A wallet will prefill the amount only if its own deep-link format supports it.
  const getPaymentAppUrl = (account: PaymentAccount) => {
    const template = account.app_link?.trim();
    if (!template) return "";
    return template
      .replaceAll("{amount}", encodeURIComponent(savedOrderAmount.toFixed(2)))
      .replaceAll("{amount_pkr}", encodeURIComponent(String(Math.round(savedOrderAmount * 100) / 100)))
      .replaceAll("{orderNumber}", encodeURIComponent(savedOrderNumber))
      .replaceAll("{accountNumber}", encodeURIComponent(account.account_number))
      .replaceAll("{accountTitle}", encodeURIComponent(account.account_title));
  };

  const copyPaymentDetail = async (
    value: string,
    label: string
  ) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedPaymentDetail(label);

      window.setTimeout(() => {
        setCopiedPaymentDetail("");
      }, 2000);
    } catch {
      setMessage("Copy nahi ho saka. Detail manually copy karein.");
    }
  };

  // Product ko selected weight ke saath cart mein add karein.
  const addToCart = (id: number, weight = 1) => {
    setSavedOrderNumber("");
    const product = products.find((item) => item.id === id);
    if (!product || product.status !== "Active" || product.stock <= 0) {
      setMessage("Ye product filhal stock mein available nahi hai.");
      return;
    }
    const existingQuantity = cart[cartKey(id, weight)]?.quantity || 0;
    if (existingQuantity >= product.stock) {
      setMessage("Available stock se zyada quantity add nahi kar sakte.");
      return;
    }

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

  // Buy Now: selected item cart mein add karke checkout kholein.
  const buyNow = (id: number, weight = 1) => {
    setSavedOrderNumber("");
    const product = products.find((item) => item.id === id);
    if (!product || product.status !== "Active" || product.stock <= 0) {
      setMessage("Ye product filhal stock mein available nahi hai.");
      return;
    }
    const key = cartKey(id, weight);
    setCart({
      [key]: { productId: id, weight, quantity: 1 },
    });
    setMessage("");
    setCartOpen(true);
  };

  // Quantity ko plus karein.
  const increaseCartItem = (key: string) => {
    setCart((old) => {
      const item = old[key];
      if (!item || item.quantity >= 100) return old;
      const product = products.find((entry) => entry.id === item.productId);
      if (!product || item.quantity >= product.stock) {
        setMessage("Available stock se zyada quantity add nahi kar sakte.");
        return old;
      }
      return { ...old, [key]: { ...item, quantity: item.quantity + 1 } };
    });
  };

  // Cart se item bilkul remove karein.
  const deleteCartItem = (key: string) => {
    setCart((old) => {
      const next = { ...old };
      delete next[key];
      return next;
    });
  };

  // Cart se selected product/weight ki quantity kam karein.
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

  const getCartUnitCharges = (product: Product, weight: number) => {
  const giftPrice = isGiftProduct(product)
    ? Math.round(product.price * (1 - Math.min(100, Math.max(0, Number(product.discount) || 0)) / 100) * 100) / 100
    : getProductPrice(product, weight);
  return getUnitCharges(product, weight, giftPrice ?? 0);
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

  const unitPrice = isGiftProduct(product)
    ? Math.round(
        product.price *
          (1 -
            Math.min(
              100,
              Math.max(0, Number(product.discount) || 0)
            ) /
              100) * 100
      ) / 100
    : getProductPrice(product, item.weight);

  if (unitPrice === null) return sum;

  return sum + unitPrice * item.quantity;
}, 0);

  const productDeliveryFee = cartItems.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return sum + (product ? getCartUnitCharges(product, item.weight).deliveryFee * item.quantity : 0);
  }, 0);
  const productPackagingFee = cartItems.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return sum + (product ? getCartUnitCharges(product, item.weight).packagingFee * item.quantity : 0);
  }, 0);
  const deliveryBeforeDiscount = productDeliveryFee > 0 ? productDeliveryFee : checkoutSettings.deliveryFee;
  const deliveryFee = checkoutSettings.freeDeliveryMinimum > 0 && total >= checkoutSettings.freeDeliveryMinimum
    ? 0
    : deliveryBeforeDiscount;
  const packagingFee = productPackagingFee;
  const taxAmount = cartItems.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return sum + (product ? getCartUnitCharges(product, item.weight).taxAmount * item.quantity : 0);
  }, 0);
  const estimatedGrandTotal = total + deliveryFee + packagingFee + taxAmount;

  const regularProducts = products.filter((product) =>
    normalizeName(product.category) !== "giftboxes" &&
    isProductEnabled(product) &&
    (selectedCategory === "All" || product.category === selectedCategory) &&
    (!offersOnly || Number(product.discount || 0) > 0)
  );
  const homeRegularProducts = selectedCategory === "All" && !offersOnly ? regularProducts.slice(0, 4) : regularProducts;

  const giftProducts = products.filter(
    (product) =>
      normalizeName(product.category) === "giftboxes" &&
      isProductEnabled(product) &&
      (!offersOnly || Number(product.discount || 0) > 0)
  );
  const homeGiftProducts = selectedCategory === "Gift Boxes" || offersOnly ? giftProducts : giftProducts.slice(0, 3);

  // Customer order submit karein.
  const placeOrder = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (submittingOrder) return;

    if (!checkoutSettingsLoaded) {
      setMessage("Checkout charges load ho rahe hain. Thori dair baad dobara try karein.");
      return;
    }

    if (cartCount === 0) {
      setMessage("Pehle cart mein product add karein.");
      return;
    }
    if (!availablePaymentMethods.some((method) => method.name === paymentMethod)) {
      setMessage("Payment methods load nahi huay. Dobara try karein ya support se rabta karein.");
      return;
    }

    const matchingAccountsForOrder = getMatchingPaymentAccounts(paymentMethod);
    const accountRequired = !isCashOnDelivery(paymentMethod);
    const accountIdForOrder = selectedPaymentAccountId ||
      (matchingAccountsForOrder.length === 1 ? String(matchingAccountsForOrder[0].id) : "");
    if (accountRequired && (!matchingAccountsForOrder.length || !accountIdForOrder)) {
      setMessage("Payment ke liye available business account select karein, ya Cash on Delivery choose karein.");
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

    const items = cartItems.map((item) => {
      const product = products.find(
        (p) => p.id === item.productId
      );

      return {
        productId: String(item.productId),
        weight: product && isGiftProduct(product) ? 1 : item.weight,
        quantity: item.quantity,
      };
    });

    if (items.length === 0) {
      setMessage("Cart mein valid products nahi hain.");
      return;
    }

    setSubmittingOrder(true);
    setSavedOrderNumber("");
    setMessage("");

    try {
      const requestKey = checkoutRequestKey || crypto.randomUUID();
      if (!checkoutRequestKey) setCheckoutRequestKey(requestKey);
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": requestKey,
        },
        body: JSON.stringify({
          customerName: customerName.trim(),
          email: customerEmail.trim(),
          phone: customerPhone.trim(),
          address: deliveryAddress.trim(),
          paymentMethod,
          paymentAccountId: accountRequired ? accountIdForOrder : null,
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
          subtotal?: number;
          total?: number;
        };
      };

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Order save nahi ho saka."
        );
      }

      const orderNumber = data.order?.orderNumber || "";
      const selectedMethod = getSelectedPaymentMethod(paymentMethod);
      const matchingAccounts = getMatchingPaymentAccounts(paymentMethod).filter(
        (account) => !accountRequired || String(account.id) === accountIdForOrder
      );

      if (typeof data.order?.total !== "number" || !Number.isFinite(data.order.total)) {
        throw new Error("Server ne final order total return nahi kiya. Support se rabta karein.");
      }
      setSavedOrderNumber(orderNumber);
      setSavedOrderAmount(data.order.total);
      setCheckoutRequestKey("");
      setSavedPaymentMethod(paymentMethod);
      setSavedCustomerPhone(customerPhone.trim());
      setSavedPaymentAccounts(matchingAccounts);
      setSavedPaymentInstructions(
        selectedMethod?.instructions || ""
      );

      setCart({});
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setDeliveryAddress("");
      setCartOpen(true);

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

  const getSocialHref = (platform: string, rawValue?: string) => {
    const value = String(rawValue || "").trim();
    if (!value) return "";
    if (/^https:\/\//i.test(value)) return value;
    if (/^http:\/\//i.test(value)) return value.replace(/^http:\/\//i, "https://");
    if (platform === "WhatsApp") {
      const digits = value.replace(/\D/g, "");
      return digits.length >= 8 ? `https://wa.me/${digits}` : `https://${value.replace(/^\/+/, "")}`;
    }
    const clean = value.replace(/^\/+/, "");
    if (platform === "YouTube") {
      const path = clean.replace(/^(https?:\/\/)?(www\.)?youtube\.com\//i, "");
      return `https://www.youtube.com/${path}`;
    }
    const host = platform === "Facebook" ? "facebook.com/" : platform === "Instagram" ? "instagram.com/" : "www.tiktok.com/";
    const hasPlatformDomain = /^(www\.)?(facebook|instagram|tiktok)\.com\//i.test(clean);
    return `https://${hasPlatformDomain ? clean : host + clean.replace(/^@/, platform === "Facebook" ? "" : "@")}`;
  };

  const contactEmail = BUSINESS_EMAIL.trim();

  // Customer-facing collections: only the main collection names appear in navigation.
  const mainCollections = [
    { title: "Mithai", slug: "mithai", symbol: "🍬" },
    { title: "Barfi", slug: "barfi", symbol: "◇" },
    { title: "Sohan Halwa", slug: "sohan-halwa", symbol: "✦" },
    { title: "Desi Ghee", slug: "desi-ghee", symbol: "🫙" },
    { title: "Honey & Dry Fruits", slug: "honey-dry-fruits", symbol: "🍯" },
  ];
  const hasGiftBoxes = products.some(
    (product) => normalizeName(product.category) === "giftboxes" && isProductEnabled(product)
  );
  const packagingChoices = products
    .flatMap((product) => (product.weight_options || []).map((option) => ({
      name: String(option.packagingType || "Standard Packaging"),
      fee: Math.max(0, Number(option.packagingFee ?? checkoutSettings.packagingFee) || 0),
    })))
    .reduce<Array<{ name: string; fee: number }>>((choices, choice) => {
      if (!choices.some((saved) => normalizeName(saved.name) === normalizeName(choice.name) && saved.fee === choice.fee)) {
        choices.push(choice);
      }
      return choices;
    }, []);

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
        .mm-buy-button { display:block; width:100%; margin-top:9px; padding:11px 18px; border:1px solid #173F3E; border-radius:2px; background:#103F3D; color:#FFF4DE; font:inherit; font-weight:700; cursor:pointer; }
        .mm-buy-button:hover { background:#1B5B55; }
        .mm-product-rating { margin:5px 0; color:#9A7132; font-weight:700; font-size:13px; }
        .mm-stock-note { margin:5px 0 10px; color:#42645B; font-size:12px; }
        .mm-discount-note { color:#A13D2D; font-size:12px; font-weight:700; }
        .mm-quantity-controls { display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-top:8px; }
        .mm-quantity-controls button { min-width:36px; min-height:36px; border:1px solid #C8B48C; background:#F3E8D4; color:#173639; border-radius:6px; cursor:pointer; font-weight:700; }
        .mm-quantity-controls .mm-remove-button { padding:0 10px; width:auto; color:#8B342B; }
        .mm-cart-totals { margin:20px 0; padding:16px; background:#F7EEDC; border:1px solid #D8C59F; border-radius:8px; }
        .mm-cart-totals > div { display:flex; justify-content:space-between; gap:12px; padding:5px 0; }
        .mm-cart-totals p { margin:8px 0 0; font-size:12px; color:#665A45; }

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
          justify-content: flex-end;
          align-items: stretch;
          overflow-y: auto;
          overscroll-behavior: contain;
          background: rgba(4, 24, 26, .88);
          padding: 24px 14px;
        }

        .mm-cart-panel {
          max-width: 760px;
          width: min(760px, 100%);
          height: 100%;
          overflow-y: auto;
          margin: 0;
          padding: 25px;
          background: #F3E8D4;
          border-left: 2px solid #D8AC55;
          box-shadow: 0 15px 50px rgba(0,0,0,.35);
          border-radius: 14px 0 0 14px;
          animation: mm-slide-in .22s ease-out;
        }
        @keyframes mm-slide-in { from { transform: translateX(24px); opacity:.7; } to { transform:translateX(0); opacity:1; }
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
          .mm-cart-overlay { padding: 0; align-items: flex-end; }
          .mm-cart-panel { width:100%; max-width:none; max-height:92dvh; height:auto; padding:16px; border-radius:18px 18px 0 0; border:2px solid #D8AC55; border-bottom:0; }
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
          <a href="#categories">Collections</a>
          <a href="#packaging-costs">Packaging</a>
          {publishedSettings?.offers?.some((offer) => offer.enabled) && products.some((product) => isProductEnabled(product) && Number(product.discount || 0) > 0) && (
            <a href="#offers" onClick={() => { setOffersOnly(true); setSelectedCategory("All"); }}>Offers</a>
          )}
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
          {brandLogo && <img src={brandLogo} alt="Multani Mithas logo" fetchPriority="high" style={{ width: "clamp(110px, 17vw, 190px)", height: "auto", maxHeight: 100, objectFit: "contain", display: "block", margin: "0 0 16px", filter: "drop-shadow(0 2px 10px rgba(0,0,0,.22))" }} />}
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
          Browse collections by category. Product prices are shown in PKR; delivery, packaging and applicable tax are itemised before checkout.
        </p>
        <div className="mm-category-grid">
          {mainCollections.map((collection) => (
            <Link key={collection.slug} href={`/shop/${collection.slug}`} className="mm-category">
              <span className="mm-category-symbol">{collection.symbol}</span>
              <span className="mm-category-name">{collection.title}</span>
              <span style={{ color: "#E3BD70" }}>Explore ↗</span>
            </Link>
          ))}
          {hasGiftBoxes && (
            <Link href="/shop/gift-boxes" className="mm-category" aria-label="Explore Gift Boxes collection">
              <span className="mm-category-symbol">🎁</span>
              <span className="mm-category-name">Gift Boxes</span>
              <span style={{ color: "#E3BD70" }}>Explore ↗</span>
            </Link>
          )}
        </div>
      </section>
      {publishedSettings?.offers?.some((offer) => offer.enabled) && products.some((product) => isProductEnabled(product) && Number(product.discount || 0) > 0) && (
        <section
          id="offers"
          style={{
            ...sectionStyle,
            background: "#092F32",
            color: "#F3E8D4",
          }}
        >
          <div className="mm-ornament">✦ ❖ ✦</div>

          <p className="mm-eyebrow" style={{ textAlign: "center" }}>
            Special Deals · Limited Promotions
          </p>

          <h2
            className="mm-section-heading"
            style={{ color: "#FFF1D7" }}
          >
            Offers & Promotions
          </h2>

          <p
            className="mm-section-intro"
            style={{ color: "#D9D0BE" }}
          >
            Discover our latest special offers from Multani Mithas.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 22,
              maxWidth: 1000,
              margin: "auto",
            }}
          >
            {publishedSettings.offers
              .filter((offer) => offer.enabled)
              .map((offer) => (
                <article
                  key={offer.id}
                  style={{
                    background: "#FFF8EA",
                    color: "#123F42",
                    padding: 25,
                    border: "1px solid #D8AC55",
                    borderRadius: 8,
                    textAlign: "center",
                  }}
                >
                  <div style={{ color: "#A16B16", fontSize: 22 }}>
                    ✦ SPECIAL OFFER ✦
                  </div>

                  <h3
                    style={{
                      fontSize: 23,
                      margin: "15px 0",
                      color: "#123F42",
                    }}
                  >
                    {offer.title}
                  </h3>

                  <p style={{ lineHeight: 1.7 }}>
                    {offer.description}
                  </p>

                  <a
                    href={products.some((product) => isProductEnabled(product) && normalizeName(product.category) !== "giftboxes" && Number(product.discount || 0) > 0) ? "#products" : "#gift-products"}
                    onClick={() => { setOffersOnly(true); setSelectedCategory("All"); }}
                    style={{
                      ...goldButton,
                      display: "inline-block",
                      marginTop: 15,
                    }}
                  >
                    {offer.buttonText || "Shop Offers"} →
                  </a>
                </article>
              ))}
          </div>
        </section>
      )}
      <section
        id="products"
        style={{ ...sectionStyle, background: "#FFF8EA" }}
      >
        <div className="mm-ornament">✦ ❖ ✦</div>
        <h2 className="mm-section-heading">{offersOnly ? "Special Offer Products" : "The Taste of Multan"}</h2>
        {offersOnly && <div style={{ textAlign: "center", marginBottom: 18 }}><p>Sirf woh products jin par active discount laga hua hai.</p><button type="button" className="mm-outline-button" onClick={() => setOffersOnly(false)}>Show All Products</button></div>}
        <p className="mm-section-intro">
          Explore our traditional sweets and bakery favourites. Prices
          are displayed in Pakistani rupees.
        </p>
        {productsLoadError && (
          <p role="alert" style={{ textAlign: "center", color: "#9A3B32", margin: "18px 0" }}>
            {productsLoadError}
          </p>
        )}
        {!productsLoadError && products.length === 0 && (
          <p role="status" style={{ textAlign: "center", margin: "18px 0" }}>
            Products are being updated. Please check back shortly.
          </p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 22,
          }}
        >
          {homeRegularProducts.map((product) => {
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

         {brandLogo && <img src={brandLogo} alt="Multani Mithas logo" loading="lazy" style={{ width: 54, height: 38, objectFit: "contain", display: "block", margin: "0 auto 8px" }} />}
         <h3 className="mm-card-title">{product.name}</h3>

{product.description && (
  <p
    style={{
      color: "#665B4A",
      fontSize: 13,
      lineHeight: 1.6,
      margin: "8px 0",
    }}
  >
    {product.description}
  </p>
)}

{product.weight && <p>{product.weight}</p>}
<p className="mm-product-rating" aria-label={`Rated ${product.rating} out of 5`}>
  ★ {Number.isFinite(product.rating) ? product.rating.toFixed(1) : "5.0"} / 5
</p>

  <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", margin: "12px 0" }}>
    {getProductWeightOptions(product).map((weight) => (
      <div key={weight} style={{ background: "#F3E8D4", padding: "9px 14px", borderRadius: 8, border: selectedWeight === weight ? "1px solid #B58A43" : "1px solid transparent" }}>
        <strong>{weight < 1 ? weight * 1000 + "g" : weight + "kg"}</strong>
        <div style={{ color: "#8A5630", fontWeight: 700 }}>
          {getProductPrice(product, weight) === null ? "Price unavailable" : money(getProductPrice(product, weight) as number)}
        </div>
      </div>
    ))}
  </div>
  
                  <div style={{ textAlign: "left", background: "#F8F0E2", border: "1px solid #D8C59F", borderRadius: 10, padding: 12, margin: "12px 0", fontSize: 13 }}>
                    <strong>Price breakdown · {selectedWeight < 1 ? selectedWeight * 1000 + "g" : selectedWeight + "kg"}</strong>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span>Product price</span><strong>{money(getUnitCharges(product, selectedWeight).unitPrice)}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span>Delivery</span><strong>{money(getUnitCharges(product, selectedWeight).deliveryFee)}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span>Packaging {getUnitCharges(product, selectedWeight).packagingType ? "· " + getUnitCharges(product, selectedWeight).packagingType : ""}</span><strong>{money(getUnitCharges(product, selectedWeight).packagingFee)}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span>Sales tax ({getUnitCharges(product, selectedWeight).salesTaxRate}%)</span><strong>{money(getUnitCharges(product, selectedWeight).taxAmount)}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, borderTop: "1px solid #D8C59F", marginTop: 7, paddingTop: 7 }}><strong>Price per selected pack</strong><strong>{money(getUnitCharges(product, selectedWeight).unitTotal)}</strong></div>
                  </div>
                  {product.discount > 0 && (
                    <p className="mm-discount-note">{product.discount}% discount</p>
                  )}
                  <p className="mm-stock-note">
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </p>

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
                      {getProductWeightOptions(product).map((weight) => (
                        <option key={weight} value={weight}>
                          {weight < 1 ? `${weight * 1000}g` : `${weight}kg`}
                        </option>
                      ))}
                    </select>
                  </label>

                  <p className="mm-price">
                    {getProductPrice(product, selectedWeight) === null
                      ? "Price unavailable"
                      : money(getProductPrice(product, selectedWeight) as number)}
                  </p>

                  {product.price_type !== "fixed" && (
                    <p style={{ fontSize: 12, marginTop: -12 }}>
                      {money(product.price)} per kg
                    </p>
                  )}

                  <button
                    type="button"
                    className="mm-gold-button"
                    disabled={product.stock <= 0 || getProductPrice(product, selectedWeight) === null}
                    onClick={() =>
                      addToCart(product.id, selectedWeight)
                    }
                  >
                    {product.stock <= 0 ? "Out of Stock" : "Add to Cart +"}
                  </button>
                 <button type="button" className="mm-buy-button" disabled={product.stock <= 0 || getProductPrice(product, selectedWeight) === null} onClick={() => buyNow(product.id, selectedWeight)}>Instant Checkout →</button>

{activeWhatsAppNumber && (
  <a
    href={`https://wa.me/${activeWhatsAppNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
      `Assalam-o-Alaikum Multani Mithas. I am interested in ${product.name}. Please confirm availability and delivery details.`
    )}`}
    target="_blank"
    rel="noopener noreferrer"
    className="mm-buy-button"
    style={{
      display: "block",
      textAlign: "center",
      textDecoration: "none",
      marginTop: 8,
    }}
  >
    WhatsApp
  </a>
)}
</div>
</article>
);
})}
</div>
        {regularProducts.length > 4 && selectedCategory === "All" && (
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Link href="/shop" style={goldButton}>View All Products & Categories →</Link>
          </div>
        )}
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
          <h2>{aboutUs?.heading || "From the Heart of Multan"}</h2>
          <p>{aboutUs?.story || "Multani Mithas is more than sweets. It is a celebration of tradition, family, hospitality and the cultural richness of South Punjab."}</p>
          <p>{aboutUs?.mission || "Inspired by Multan’s iconic blue tilework, historic architecture and the warmth of the Saraiki Wasib, we bring a taste of heritage to every special moment."}</p>
          {aboutUs?.promise && <p>{aboutUs.promise}</p>}
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
          {promoVideo ? (
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
          ) : (
            <div
              role="status"
              style={{
                minHeight: 220,
                display: "grid",
                placeItems: "center",
                padding: 24,
                textAlign: "center",
                border: "1px solid rgba(230,189,108,.35)",
                background: "rgba(255,255,255,.04)",
              }}
            >
              Our Multani Mithas brand film is coming soon.
            </div>
          )}
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

      <section id="gifts" style={{ ...sectionStyle, background: "#FFF8EA", display: offersOnly && giftProducts.length === 0 ? "none" : undefined }}>
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
            <Link href="/shop/gift-boxes" style={goldButton}>
              Explore Gift Boxes →
            </Link>
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
          {homeGiftProducts.map((product) => (
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
                decoding="async"
              />
              <div className="mm-card-body">
                <h3 className="mm-card-title">{product.name}</h3>
                <p className="mm-product-rating">★ {product.rating.toFixed(1)} / 5</p>
                <p className="mm-stock-note">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</p>
                <div style={{ background: "#F8F0E2", border: "1px solid #D8C59F", borderRadius: 10, padding: 12, margin: "12px 0", fontSize: 13, textAlign: "left" }}>
                  <strong>Exact gift box price breakdown</strong>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Product price</span><strong>{money(getCartUnitCharges(product, 1).unitPrice)}</strong></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Delivery</span><strong>{money(getCartUnitCharges(product, 1).deliveryFee)}</strong></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Packaging {getCartUnitCharges(product, 1).packagingType ? "· " + getCartUnitCharges(product, 1).packagingType : ""}</span><strong>{money(getCartUnitCharges(product, 1).packagingFee)}</strong></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Sales tax ({getCartUnitCharges(product, 1).salesTaxRate}%)</span><strong>{money(getCartUnitCharges(product, 1).taxAmount)}</strong></div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #D8C59F", paddingTop: 7, marginTop: 7 }}><strong>Final price</strong><strong>{money(getCartUnitCharges(product, 1).unitTotal)}</strong></div>
                </div>
                {product.discount > 0 && (
                  <p className="mm-discount-note">{product.discount}% discount</p>
                )}
                <p style={{ fontSize: 12 }}>Fixed price gift box</p>
                <button
                  type="button"
                  className="mm-gold-button"
                  disabled={product.stock <= 0}
                  onClick={() => addToCart(product.id, 1)}
                >
                  {product.stock <= 0 ? "Out of Stock" : "Add to Cart +"}
                </button>
              <button
  type="button"
  className="mm-buy-button"
  disabled={product.stock <= 0}
  onClick={() => buyNow(product.id, 1)}
>
  Instant Checkout →
</button>

{activeWhatsAppNumber && (
  <a
    href={`https://wa.me/${activeWhatsAppNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
      `Assalam-o-Alaikum Multani Mithas. I am interested in ${product.name}. Please share details about gift packaging and availability.`
    )}`}
    target="_blank"
    rel="noopener noreferrer"
    className="mm-buy-button"
    style={{
      display: "block",
      textAlign: "center",
      textDecoration: "none",
      marginTop: 8,
    }}
  >
    WhatsApp
  </a>
)}
</div>
</article>
))}
</div>
        {giftProducts.length > 3 && selectedCategory !== "Gift Boxes" && (
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <Link href="/shop/gift-boxes" style={goldButton}>Explore All Gift Boxes →</Link>
          </div>
        )}
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
                  <div role="status" style={{ textAlign: "left" }}>
                    {brandLogo && <img src={brandLogo} alt="Multani Mithas" style={{ display: "block", width: "100%", maxWidth: 180, maxHeight: 100, objectFit: "contain", margin: "0 auto 18px" }} />}
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 42, color: "#237A4B" }}>
                        ✓
                      </div>

                      <h2 style={{ color: "#123F42" }}>
                        Order Successfully Submitted
                      </h2>

                      <p>Your order number:</p>

                      <h3
                        style={{
                          color: "#8A5630",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {savedOrderNumber}
                      </h3>
                    </div>

                    <div
                      style={{
                        padding: 16,
                        marginTop: 20,
                        background: "#FFF8EA",
                        border: "1px solid #D8C59F",
                        borderRadius: 6,
                      }}
                    >
                      <h3 style={{ color: "#123F42", marginTop: 0 }}>
                        Order Payment Summary
                      </h3>

                      <p>
                        Payment Method:{" "}
                        <strong>{savedPaymentMethod}</strong>
                      </p>

                    <p>
  Total Payable (including delivery, packaging and applicable tax):{" "}
  <strong>{money(savedOrderAmount)}</strong>
</p>
                      

                  
                    </div>

                    {isCashOnDelivery(savedPaymentMethod) ? (
                      <div
                        style={{
                          padding: 16,
                          marginTop: 16,
                          background: "#FFF8EA",
                          border: "1px solid #D8C59F",
                          borderRadius: 6,
                        }}
                      >
                        <h3>Cash on Delivery</h3>

                        <p>
                          Aap delivery receive karte waqt cash payment
                          ada kar sakte hain.
                        </p>

                        <p>
                          Hamari team order availability aur delivery
                          arrangements confirm karegi.
                        </p>

                        <p>
                          Order Status:{" "}
                          <strong>Pending Confirmation</strong>
                        </p>
                      </div>
                    ) : (
                      <div
                        style={{
                          padding: 16,
                          marginTop: 16,
                          background: "#FFF8EA",
                          border: "1px solid #D8C59F",
                          borderRadius: 6,
                        }}
                      >
                        <h3 style={{ color: "#123F42" }}>
                          Payment Instructions
                        </h3>
                       <div
  style={{
    background: "#123F42",
    color: "#FFF8EA",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    textAlign: "center",
  }}
>
  <p style={{ margin: 0 }}>Exact Amount to Transfer</p>
  <h2 style={{ color: "#E6BD6C", margin: "8px 0 0" }}>
    {money(savedOrderAmount)}
  </h2>
</div>
                        {savedPaymentInstructions && (
                          <p>{savedPaymentInstructions}</p>
                        )}

{savedPaymentAccounts.length > 0 && (
  <>
    {savedPaymentAccounts.map((account) => (
    <div
                              key={String(account.id)}
                              style={{
                               border: "1px solid #D8B66A",
                                padding: 20,
                                marginTop: 16,
                                borderRadius: 12,
                                background: "linear-gradient(145deg, #123F42, #1B5555)",
                                color: "#FFF8EA",
                        boxShadow: "0 8px 22px rgba(18, 63, 66, 0.16)",
                              }}
                            >
                             
                          
                             <div style={{ lineHeight: 1.8 }}>
                             <p style={{ margin: "8px 0", color: "#FFF8EA" }}>
                              Account Title:{" "}
                                  <strong>{account.account_title}</strong>
                                  </p>

                                  <p style={{ margin: "8px 0", color: "#E6BD6C" }}>
                            Amount to Transfer:{" "}
                    <strong>{money(savedOrderAmount)}</strong>
                   </p>

                  <p style={{ margin: "8px 0", color: "#FFF8EA" }}>
               Account Number:{" "}
                <strong style={{ overflowWrap: "anywhere" }}>
                   {account.account_number}
                      </strong>
                          </p>
                         </div>
                              <button
                                type="button"
                           className="mm-buy-button"
                                onClick={() =>
                                  copyPaymentDetail(
                                    account.account_number,
                                    `Account ${String(account.id)}`
                                  )
                                }
                              >
                                {copiedPaymentDetail ===
                                `Account ${String(account.id)}`
                                  ? "Copied ✓"
                                  : "Copy Account Number"}
                              </button>

                              {account.iban && (
                                <>
                                  <p style={{ overflowWrap: "anywhere" }}>
                                    IBAN: <strong>{account.iban}</strong>
                                  </p>

                                  <button
                                    type="button"
                                    className="mm-gold-button"
                                    onClick={() =>
                                      copyPaymentDetail(
                                        account.iban || "",
                                        `IBAN ${String(account.id)}`
                                      )
                                    }
                                  >
                                    {copiedPaymentDetail ===
                                    `IBAN ${String(account.id)}`
                                      ? "Copied ✓"
                                      : "Copy IBAN"}
                                  </button>
                                </>
                              )}

                       
                    {account.qr_image_url && (
                            <div
                             style={{
                             marginTop: 18,
                            padding: 16,
                        background: "#FFF8EA",
                       border: "1px solid #D8B66A",
                         borderRadius: 10,
                     textAlign: "center",
                 }}
                           >   
                              <p><strong>Scan QR to Pay</strong></p>

    <img
      src={account.qr_image_url}
      alt={`${account.provider} payment QR code`}
      loading="lazy"
    style={{
  display: "block",
  width: "100%",
  maxWidth: 260,
  height: "auto",
  margin: "10px auto",
  border: "1px solid #D8B66A",
  borderRadius: 8,
  padding: 12,
  background: "#FFFFFF",
  boxShadow: "0 4px 14px rgba(18, 63, 66, 0.12)",
}}
    />
  </div>
)}

{getPaymentAppUrl(account).startsWith("https://") && (
    <a
      href={getPaymentAppUrl(account)}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-block",
        padding: "12px 20px",
        marginTop: 12,
        textDecoration: "none",
        background: "linear-gradient(145deg, #123F42, #1B5555)",
        color: "#E6BD6C",
        border: "1px solid #D8B66A",
        borderRadius: 9,
        fontWeight: 700,
      }}
    >
      Open {account.provider} Payment App
    </a>
  )}
  <button
    type="button"
    className="mm-gold-button"
    onClick={() => copyPaymentDetail(String(savedOrderAmount.toFixed(2)), `Amount ${String(account.id)}`)}
    style={{ marginTop: 12, marginLeft: 8 }}
  >
    {copiedPaymentDetail === `Amount ${String(account.id)}` ? "Amount Copied ✓" : "Copy Exact Payable Amount"}
  </button>
</div>
                         ))}
                    
                       {isJazzCash(savedPaymentMethod) &&
  !getMatchingPaymentAccounts(savedPaymentMethod).some(
    (account) => Boolean(account.app_link && account.app_link.startsWith("https://"))
  ) && (
    <p style={{ marginTop: 16, fontSize: 13 }}>
      JazzCash ka payment-app link Admin → Payments mein configure nahi hai.
      Neeche diye gaye account number ya QR se payment karein. Admin mein
      provider ka verified payment link add karne ke baad yahan app button show hoga.
    </p>
  )}
                      </>
                    )}

                    <div
                      style={{
                        borderTop: "1px solid #D8B66A",
                        marginTop: 24,
                        paddingTop: 20,
                      }}
                    >
                      <h3 style={{ color: "#E6BD6C", marginTop: 0 }}>
                        Payment Verification
                      </h3>
                          <p>
                            Payment transfer karne ke baad screenshot business ko
                 WhatsApp par bhej sakte hain. Screenshot payment ka
                    proof nahi hai. Admin asal account mein payment verify
                     karne ke baad status update karega.
                                 </p>

                          <p>
                            Payment Status:{" "}
                            <strong style={{ color: "#A16B16" }}>
                              Pending Verification
                            </strong>
                          </p>

                          <p>
                            Order Status:{" "}
                            <strong>Pending Confirmation</strong>
                          </p>

                          {activeWhatsAppNumber && (
                            <a
                              href={`https://wa.me/${activeWhatsAppNumber.replace(
                                /\D/g,
                                ""
                              )}?text=${encodeURIComponent(
                                `Assalam-o-Alaikum Multani Mithas. My order number is ${savedOrderNumber}. Payment method: ${savedPaymentMethod}. Total payable: ${money(savedOrderAmount)}. My phone: ${savedCustomerPhone}. I am sending my payment screenshot for verification.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                         style={{
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  padding: "15px 18px",
  marginTop: 16,
  textAlign: "center",
  textDecoration: "none",
  background: "linear-gradient(145deg, #123F42, #1B5555)",
  color: "#E6BD6C",
  border: "1px solid #D8B66A",
  borderRadius: 10,
  fontWeight: 700,
  boxShadow: "0 6px 18px rgba(18, 63, 66, 0.18)",
}}
                            >
                             Open WhatsApp & Attach Payment Screenshot
                            </a>
                          )}

                          {!activeWhatsAppNumber && (
                            <p>
                              WhatsApp screenshot option business number
                              configure hone ke baad available hoga.
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div style={{ textAlign: "center", marginTop: 22 }}>
                      <button
                        type="button"
                        className="mm-gold-button"
                        onClick={() => setCartOpen(false)}
                      >
                        Continue Shopping
                      </button>
                    </div>
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

const itemCharges = getCartUnitCharges(product, item.weight);
const lineTotal = itemCharges.unitTotal * item.quantity;

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
                        <img src={getProductImage(product)} alt={product.name} style={{ width: 76, height: 76, objectFit: "cover", borderRadius: 8, border: "1px solid #D8C59F", marginRight: 12 }} />
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
                        <div style={{ fontSize: 12, marginTop: 7, lineHeight: 1.7 }}>
                          Product {money(itemCharges.unitPrice)} · Delivery {money(itemCharges.deliveryFee)} · Packaging {itemCharges.packagingType ? itemCharges.packagingType + " " : ""}{money(itemCharges.packagingFee)} · Tax ({itemCharges.salesTaxRate}%) {money(itemCharges.taxAmount)}
                          <br /><strong>Per item total: {money(itemCharges.unitTotal)}</strong>
                        </div>
                      </div>

                      <div>
                        <strong>{money(lineTotal)}</strong>
                        <div className="mm-quantity-controls" aria-label={`Quantity for ${product.name}`}>
                          <button type="button" onClick={() => removeFromCart(key)} aria-label="Decrease quantity">−</button>
                          <strong>{item.quantity}</strong>
                          <button type="button" onClick={() => increaseCartItem(key)} aria-label="Increase quantity">+</button>
                          <button type="button" className="mm-remove-button" onClick={() => deleteCartItem(key)}>Remove</button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="mm-cart-totals" style={{ display: "grid", gap: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Products subtotal</span><strong>{money(total)}</strong></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Delivery fee</span><strong>{deliveryFee === 0 ? "Free" : money(deliveryFee)}</strong></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Packaging</span><strong>{money(packagingFee)}</strong></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Sales tax (product-specific rates)</span><strong>{money(taxAmount)}</strong></div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #D8C59F", paddingTop: 12, fontSize: 18 }}><strong>Estimated total</strong><strong>{money(estimatedGrandTotal)}</strong></div>
                  <p style={{ fontSize: 12, margin: 0 }}>Each product weight has its own editable delivery, packaging and tax rate. Final charges are recalculated securely when the order is submitted.</p>
                </div>

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
                    Email Address (optional)
                    <input
                      className="mm-input"
                      type="email"
                      value={customerEmail}
                      onChange={(event) => setCustomerEmail(event.target.value)}
                      maxLength={254}
                      autoComplete="email"
                      placeholder="name@example.com"
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

               <div>
  <button
    type="button"
    className="mm-gold-button"
    onClick={() => setPaymentMethodOpen((open) => !open)}
    style={{ width: "100%" }}
  >
    Payment Method: {paymentMethod} {paymentMethodOpen ? "▲" : "▼"}
  </button>

  {paymentMethodOpen && (
    <div
      style={{
  marginTop: 14,
  padding: 18,
  background: "linear-gradient(145deg, #123F42, #1B5555)",
  border: "1px solid #D8B66A",
  borderRadius: 12,
  boxShadow: "0 8px 22px rgba(18, 63, 66, 0.16)",
}}
    >
      {availablePaymentMethods.map((method) => (
        <button
          key={String(method.id)}
          type="button"
          className="mm-buy-button"
style={{
  width: "100%",
  marginBottom: 8,
  padding: "13px 16px",
  borderRadius: 8,
  border: paymentMethod === method.name
    ? "2px solid #E6BD6C"
    : "1px solid rgba(255,255,255,0.35)",
  background: paymentMethod === method.name
    ? "#E6BD6C"
    : "rgba(255,255,255,0.08)",
  color: paymentMethod === method.name ? "#123F42" : "#FFF8EA",
  fontWeight: 600,
}}          onClick={() => {
            setPaymentMethod(method.name);
            const accountsForMethod = getMatchingPaymentAccounts(method.name);
            setSelectedPaymentAccountId(
              accountsForMethod.length === 1 ? String(accountsForMethod[0].id) : ""
            );
            setPaymentMethodOpen(false);
          }}
        >
          {method.name}
        </button>
      ))}
    </div>
  )}
</div>
  {!isCashOnDelivery(paymentMethod) && (
    <section style={{ marginTop: 14, padding: 16, borderRadius: 12, border: "1px solid #D8B66A", background: "#FFF8EA", color: "#123F42" }}>
      <h3 style={{ marginTop: 0 }}>{paymentMethod} Wallet / Account</h3>
      <p style={{ margin: "6px 0" }}>Payable amount after placing this order:</p>
      <strong style={{ display: "block", fontSize: 25, color: "#8A5630", marginBottom: 12 }}>{money(estimatedGrandTotal)}</strong>
      {getMatchingPaymentAccounts(paymentMethod).length > 0 ? getMatchingPaymentAccounts(paymentMethod).map((account) => (
        <div key={String(account.id)} style={{ padding: 12, border: String(selectedPaymentAccountId) === String(account.id) ? "2px solid #A77B31" : "1px solid #D8C59F", borderRadius: 9, marginTop: 10, overflowWrap: "anywhere" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer", fontWeight: 700 }}>
            <input
              type="radio"
              name="paymentAccount"
              value={String(account.id)}
              checked={String(selectedPaymentAccountId) === String(account.id)}
              onChange={() => setSelectedPaymentAccountId(String(account.id))}
            />
            Use this account
          </label>
          <strong>{account.provider} · {account.account_name}</strong>
          <p style={{ margin: "6px 0" }}>Account title: <strong>{account.account_title}</strong></p>
          <p style={{ margin: "6px 0" }}>Wallet / Account number: <strong>{account.account_number}</strong></p>
          {account.iban && <p style={{ margin: "6px 0" }}>IBAN: <strong>{account.iban}</strong></p>}
          {account.qr_image_url && <img src={account.qr_image_url} alt={account.provider + " payment QR"} style={{ display: "block", width: "100%", maxWidth: 230, height: "auto", margin: "12px auto", background: "#fff", padding: 8, borderRadius: 8 }} /> }
          {account.app_link && account.app_link.startsWith("https://") && <a href={account.app_link} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "10px 14px", borderRadius: 8, background: "#123F42", color: "#E6BD6C", textDecoration: "none" }}>Open {account.provider}</a>}
        </div>
      )) : <p role="status">Is payment method ka official wallet/account abhi admin ne configure nahi kiya. Payment details available hone tak transfer na karein.</p>}
      <p style={{ fontSize: 12, marginBottom: 0 }}>Order place hone ke baad order number aur exact final amount ke saath screenshot bhejne ka WhatsApp button milega. Screenshot akela payment confirmation nahi hota.</p>
    </section>
  )}
 

        

                  {isCashOnDelivery(paymentMethod) && (
                    <p style={{ fontSize: 13 }}>
                      Cash on Delivery select kiya gaya hai. Payment
                      delivery receive karte waqt ada karein.
                    </p>
                  )}

                 
                  <button
                    type="submit"
                    className="mm-gold-button"
                    disabled={submittingOrder}
                    style={{ width: "100%" }}
                  >
                    {submittingOrder
                      ? "Submitting Your Order..."
                      : "Confirm & Place Order"}
                  </button>
                  {activeWhatsAppNumber && (
                    <a href={"https://wa.me/" + activeWhatsAppNumber.replace(/\D/g, "") + "?text=" + encodeURIComponent("Assalam-o-Alaikum Multani Mithas. I need help with my checkout.")} target="_blank" rel="noopener noreferrer" className="mm-buy-button" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
                      Need Help? Chat on WhatsApp
                    </a>
                  )}
                </form>
              </div>
            )}
          </section>
        </div>
      )}

      <section id="packaging-costs" style={{ ...sectionStyle, background: "#E8D6B4" }}>
        <div className="mm-ornament">✦ ❖ ✦</div>
        <h2 className="mm-section-heading">Packaging Options & Cost</h2>
        <p className="mm-section-intro">Har product aur selected weight ke mutabiq packaging charge checkout se pehle alag show hota hai. Gift-style packaging aur simple packaging ka rate product settings mein manage hota hai.</p>
        <div style={{ maxWidth: 760, margin: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
          {packagingChoices.length > 0 ? packagingChoices.map((choice) => (
            <article key={`${choice.name}-${choice.fee}`} className="mm-info-card">
              <h3 style={{ marginTop: 0 }}>{choice.name}</h3>
              <strong style={{ fontSize: 22, color: "#8A5630" }}>{money(choice.fee)}</strong>
              <p style={{ marginBottom: 0, fontSize: 12 }}>Per selected product / weight option. Final fee cart mein item-wise detail ke saath nazar aayegi.</p>
            </article>
          )) : (
            <article className="mm-info-card" style={{ gridColumn: "1 / -1" }}>
              <h3 style={{ marginTop: 0 }}>Simple & Gift Packaging</h3>
              <p style={{ marginBottom: 0 }}>Packaging rates abhi configure ho rahe hain. Final amount order confirm karne se pehle cart mein show hoga.</p>
            </article>
          )}
        </div>
      </section>

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

        {activeWhatsAppNumber ? (
          <a
            href={`https://wa.me/${activeWhatsAppNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
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
    <h3>Orders and Cancellations</h3>
    <p>
      Orders are subject to product availability, final pricing,
      delivery arrangements and business confirmation. For details,
      please read our{" "}
      <a href="/order-cancellation">Order Cancellation Policy</a>.
    </p>

    <h3>Shipping and Customs</h3>
    <p>
      International shipping charges, customs duties, import
      restrictions and delivery times vary depending on the destination.
    </p>

    <h3>Refunds and Returns</h3>
    <p>
      For information about damaged, incorrect or missing items
      and refund requests, please read our{" "}
      <a href="/refund-return">Refund & Return Policy</a>.
    </p>

    <h3>Privacy</h3>
    <p>
      To understand how customer information is collected and
      handled, please read our{" "}
      <a href="/privacy-policy">Privacy Policy</a>.
    </p>
  </div>
</section>

      <footer className="mm-footer">
        {brandLogo && <img src={brandLogo} alt="Multani Mithas" style={{ display: "block", width: 120, height: 70, objectFit: "contain", margin: "0 auto 10px" }} />}
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
          <a href="#about">About Us</a>
          <a href="#policies">Customer Policies</a>
          <a href="#delivery">Delivery</a>
          <a href="#payments">Payments</a>
          <a href="#contact">Contact</a>
          <a href="#home">Back to Top ↑</a>
          <a href="/admin-login">Business Admin</a>
        </div>
        {publishedSettings?.socialLinks && (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: 14,
      margin: "20px 0 25px",
    }}
  >
    {[
      {
        name: "Facebook",
        label: "f",
        url: getSocialHref("Facebook", publishedSettings.socialLinks.facebook),
      },
      {
        name: "Instagram",
        label: "◎",
        url: getSocialHref("Instagram", publishedSettings.socialLinks.instagram),
      },
      {
        name: "TikTok",
        label: "♪",
        url: getSocialHref("TikTok", publishedSettings.socialLinks.tiktok),
      },
      {
        name: "YouTube",
        label: "▶",
        url: getSocialHref("YouTube", publishedSettings.socialLinks.youtube),
      },
      {
        name: "WhatsApp",
        label: "☏",
        url: getSocialHref("WhatsApp", publishedSettings.socialLinks.whatsapp),
      },
    ]
      .filter((social) => social.url?.trim())
      .map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.name}
          title={social.name}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 42,
            height: 42,
            border: "1px solid #E6BD6C",
            borderRadius: "50%",
            color: "#E6BD6C",
            fontSize: 20,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          {social.label}
        </a>
      ))}
  </div>
)}
      {activeWhatsAppNumber && (
  <a
    href={`https://wa.me/${activeWhatsAppNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
      "Assalam-o-Alaikum Multani Mithas. I would like to know more about your sweets and products."
    )}`}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: "inline-block",
      background: "#168B52",
      color: "#FFFFFF",
      padding: "12px 25px",
      borderRadius: 30,
      fontWeight: 700,
      textDecoration: "none",
      margin: "0 auto 25px",
    }}
  >
    ☎ WhatsApp Us
  </a>
)}  
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
