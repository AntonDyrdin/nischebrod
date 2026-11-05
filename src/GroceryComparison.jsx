import { useRef, useState } from "react";
import "./GroceryComparison.css";

function createSearchState(result) {
  return {
    result,
    selected: Object.fromEntries(
      STORES.map((store) => {
        const products = result[store.id] ?? [];

        return [store.id, products.length === 1 ? products[0] : null];
      }),
    ),
    loading: false,
    notFound: !hasProducts(result),
    error: null,
  };
}

const STORES = [
  { id: "pyaterochka", name: "Пятёрочка" },
  { id: "magnit", name: "Магнит" },
  { id: "perekrestok", name: "Перекрёсток" },
];

const imageUrl = (text) =>
  `https://placehold.co/96x96/f3f4f6/475467?text=${encodeURIComponent(text)}`;

const CATALOG = {
  pyaterochka: [
    {
      imageUrl: imageUrl("Orange"),
      name: "Апельсины 1 кг",
      price: 129.9,
    },
    {
      imageUrl: imageUrl("Orange"),
      name: "Апельсины фасованные 1,5 кг",
      price: 199.9,
    },
    {
      imageUrl: imageUrl("Juice"),
      name: "Апельсиновый сок 1 л",
      price: 119.9,
    },
    {
      imageUrl: imageUrl("Candy"),
      name: "Леденцы со вкусом апельсина 100 г",
      price: 59.9,
    },
    {
      imageUrl: imageUrl("Orange"),
      name: "Апельсины отборные 1 кг",
      price: 179.9,
    },
    {
      imageUrl: imageUrl("Milk"),
      name: "Молоко 3,2% 1 л",
      price: 89.9,
    },
    {
      imageUrl: imageUrl("Milk"),
      name: "Молоко безлактозное 1 л",
      price: 129.9,
    },
    {
      imageUrl: imageUrl("Milk"),
      name: "Молоко сгущённое 380 г",
      price: 109.9,
    },
    {
      imageUrl: imageUrl("Milk"),
      name: "Молоко топлёное 930 мл",
      price: 99.9,
    },
    {
      imageUrl: imageUrl("Bread"),
      name: "Хлеб пшеничный 400 г",
      price: 49.9,
    },
    {
      imageUrl: imageUrl("Bread"),
      name: "Хлеб ржаной 350 г",
      price: 54.9,
    },
    {
      imageUrl: imageUrl("Bread"),
      name: "Хлебцы цельнозерновые 100 г",
      price: 69.9,
    },
  ],

  magnit: [
    {
      imageUrl: imageUrl("Orange"),
      name: "Апельсины красные 1 кг",
      price: 189.9,
    },
    {
      imageUrl: imageUrl("Orange"),
      name: "Апельсины 1 кг",
      price: 119.9,
    },
    {
      imageUrl: imageUrl("Candy"),
      name: "Леденцы со вкусом апельсина 150 г",
      price: 79.9,
    },
    {
      imageUrl: imageUrl("Orange"),
      name: "Апельсины отборные 1 кг",
      price: 159.9,
    },
    {
      imageUrl: imageUrl("Juice"),
      name: "Апельсиновый сок с мякотью 950 мл",
      price: 139.9,
    },
    {
      imageUrl: imageUrl("Milk"),
      name: "Молоко 2,5% 900 мл",
      price: 84.9,
    },
    {
      imageUrl: imageUrl("Milk"),
      name: "Молоко 3,2% 1 л",
      price: 94.9,
    },
    {
      imageUrl: imageUrl("Milk"),
      name: "Молоко шоколадное 250 мл",
      price: 49.9,
    },
    {
      imageUrl: imageUrl("Bread"),
      name: "Хлеб бородинский 400 г",
      price: 44.9,
    },
    {
      imageUrl: imageUrl("Bread"),
      name: "Хлеб тостовый 500 г",
      price: 89.9,
    },
  ],

  perekrestok: [
    {
      imageUrl: imageUrl("Orange"),
      name: "Апельсины отборные 1 кг",
      price: 199.9,
    },
    {
      imageUrl: imageUrl("Orange"),
      name: "Апельсины красные фасованные 500 г",
      price: 169.9,
    },
    {
      imageUrl: imageUrl("Juice"),
      name: "Апельсиновый сок прямого отжима 1 л",
      price: 249.9,
    },
    {
      imageUrl: imageUrl("Orange"),
      name: "Апельсины фасованные 1 кг",
      price: 149.9,
    },
    {
      imageUrl: imageUrl("Candy"),
      name: "Леденцы со вкусом апельсина без сахара 60 г",
      price: 119.9,
    },
    {
      imageUrl: imageUrl("Milk"),
      name: "Молоко фермерское 3,5% 1 л",
      price: 139.9,
    },
    {
      imageUrl: imageUrl("Milk"),
      name: "Молоко безлактозное 1 л",
      price: 159.9,
    },
    {
      imageUrl: imageUrl("Milk"),
      name: "Молоко овсяное 1 л",
      price: 179.9,
    },
    {
      imageUrl: imageUrl("Bread"),
      name: "Хлеб на закваске 450 г",
      price: 129.9,
    },
    {
      imageUrl: imageUrl("Bread"),
      name: "Хлеб цельнозерновой 350 г",
      price: 99.9,
    },
    {
      imageUrl: imageUrl("Bread"),
      name: "Хлебцы ржаные 100 г",
      price: 89.9,
    },
  ],
};

const normalize = (value) => value.trim().toLocaleLowerCase("ru-RU");

const MAGNIT_SEARCH_URL = "/magnit-api/v2/goods/search";
const MAGNIT_STORE_CODE = "480057";

async function searchMagnitProducts(query) {
  const response = await fetch(MAGNIT_SEARCH_URL, {
    method: "POST",
    credentials: "include",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "x-app-version": "2026.11.3-14.45",
      "x-client-name": "magnit",
      "x-device-id": "8cb113a6-6d4d-419e-8651-cd426e46bce5",
      "x-device-platform": "Web",
      "x-device-tag": "disabled",
      "x-magnit-bff": "1",
      "x-new-magnit": "true",
    },
    body: JSON.stringify({
      includeAdultGoods: true,
      pagination: {
        offset: 0,
        limit: 36,
      },
      sort: {
        order: "desc",
        type: "popularity",
      },
      term: query.trim(),
      storeCode: MAGNIT_STORE_CODE,
      storeType: "express",
      catalogType: "3",
    }),
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`Ошибка API Магнита: HTTP ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data.items)) {
    throw new Error("Некорректный ответ API Магнита");
  }

  return data.items
    .filter(
      (item) =>
        typeof item.name === "string" &&
        typeof item.price === "number" &&
        Number.isFinite(item.price),
    )
    .map((item) => ({
      id: item.id,
      // Для весовых товаров указываем вес порции,
      // поскольку item.price — цена именно этой порции.
      name:
        item.weighted?.isWeighted && item.weighted.shelfLabel
          ? `${item.name} (${item.weighted.shelfLabel})`
          : item.name,
      price: item.price / 100, // API возвращает копейки.
      imageUrl:
        item.gallery?.find((media) => media.type === "IMAGE" && media.url)?.url ??
        imageUrl("Нет фото"),
    }));
}

async function searchStoreProducts(storeId, query) {
  if (!query.trim()) return [];

  if (storeId === "magnit") {
    return searchMagnitProducts(query);
  }

  // Остальные магазины пока используют локальный каталог.
  await new Promise((resolve) => setTimeout(resolve, 250));

  const words = normalize(query).split(/\s+/).filter(Boolean);

  return CATALOG[storeId].filter((product) => {
    const name = normalize(product.name);
    return words.every((word) => name.includes(word));
  });
}


async function findProducts(query) {
  const entries = await Promise.all(
    STORES.map(async (store) => [store.id, await searchStoreProducts(store.id, query)]),
  );

  return Object.fromEntries(entries);
}

function hasProducts(results) {
  return Object.values(results).some((products) => products.length > 0);
}

const money = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
});

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

function ProductRow({ row, placeholder, onChange, onSearch, onRemove, onSelect }) {
  const inputRef = useRef(null);

  return (
    <tr className={placeholder ? "placeholder-row" : undefined}>
      <td>
        <form
          className="product-search"
          onSubmit={(event) => {
            event.preventDefault();
            onSearch();
          }}
        >
          <div className="product-input">
            <input
              ref={inputRef}
              aria-label={placeholder ? "Добавить продукт" : "Название продукта"}
              aria-invalid={row.notFound || undefined}
              placeholder={placeholder ? "Добавить продукт…" : "Название продукта"}
              value={row.query}
              onChange={(event) => onChange(event.target.value)}
              disabled={row.loading}
            />

            {row.query && (
              <button
                type="button"
                className="clear-button"
                aria-label="Очистить название продукта"
                onClick={() => {
                  onChange("");
                  inputRef.current?.focus();
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            )}
          </div>

          <button
            className="search-button"
            type="submit"
            aria-label="Найти продукт"
            disabled={row.loading || !row.query.trim()}
          >
            <SearchIcon />
          </button>
        </form>

        {row.notFound && (
          <span className="search-error" role="status">
            Товар не найден
          </span>
        )}
        {row.error && (
          <span className="search-error" role="status">
            {row.error}
          </span>
        )}
      </td>

      {STORES.map((store) => {
        const products = row.result?.[store.id] ?? [];
        const selectedProduct = row.selected?.[store.id];

        return (
          <td className="product-results-cell" key={store.id}>
            {row.loading ? (
              <span className="muted" role="status">
                Поиск…
              </span>
            ) : products.length > 0 ? (
              <ul className="product-results" aria-label={`Товары магазина ${store.name}`}>
                {products.slice(0, 4).map((product, index) => {
                  const isSelected = selectedProduct === product;

                  return (
                    <li key={`${product.name}-${index}`}>
                      <button
                        type="button"
                        className={`product-card ${isSelected ? "product-card--selected" : ""}`}
                        aria-pressed={isSelected}
                        onClick={() => onSelect(store.id, product)}
                      >
                        <img
                          className="product-card-image"
                          src={product.imageUrl}
                          alt=""
                          loading="lazy"
                          width="48"
                          height="48"
                        />

                        <span className="product-card-info">
                          <span className="product-card-name">{product.name}</span>

                          <span className="product-card-price">{money.format(product.price)}</span>

                          {isSelected && (
                            <span className="product-card-selected-label">✓ Выбрано</span>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <span className="muted">{row.result ? "Нет товаров" : "—"}</span>
            )}
          </td>
        );
      })}

      <td className="row-actions">
        {!placeholder && (
          <button
            type="button"
            className="remove-button"
            onClick={onRemove}
            aria-label={`Удалить продукт: ${row.query || "без названия"}`}
            title="Удалить строку"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 6h18M9 6V4h6v2M5 6l1 14h12l1-14M10 10v6M14 10v6" />
            </svg>
          </button>
        )}
      </td>
    </tr>
  );
}

const emptyDraft = () => ({
  query: "",
  result: null,
  selected: {},
  notFound: false,
  loading: false,
  error: null,
});

export default function GroceryComparison() {
  const nextId = useRef(1);
  const [rows, setRows] = useState([]);
  const [draft, setDraft] = useState(emptyDraft);

  function updateRow(id, query) {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, ...emptyDraft(), query } : row)),
    );
  }

  function selectProduct(rowId, storeId, product) {
    setRows((current) =>
      current.map((row) =>
        row.id === rowId
          ? {
              ...row,
              selected: {
                ...row.selected,
                [storeId]: product,
              },
            }
          : row,
      ),
    );
  }

  async function searchRow(id) {
    const row = rows.find((item) => item.id === id);

    if (!row || row.loading || !row.query.trim()) return;

    setRows((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              result: null,
              selected: {},
              loading: true,
              notFound: false,
              error: null,
            }
          : item,
      ),
    );

    try {
      const result = await findProducts(row.query);

      setRows((current) =>
        current.map((item) => (item.id === id ? { ...item, ...createSearchState(result) } : item)),
      );
    } catch {
      setRows((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                loading: false,
                error: "Не удалось загрузить товары. Попробуйте ещё раз.",
              }
            : item,
        ),
      );
    }
  }

  async function searchDraft() {
    if (draft.loading || !draft.query.trim()) return;

    const query = draft.query.trim();

    setDraft((current) => ({
      ...current,
      loading: true,
      notFound: false,
      error: null,
    }));

    try {
      const result = await findProducts(query);
      const searchState = createSearchState(result);

      if (!hasProducts(result)) {
        setDraft((current) => ({
          ...current,
          ...searchState,
        }));
        return;
      }

      const id = nextId.current++;

      setRows((current) => [
        ...current,
        {
          id,
          query,
          ...searchState,
        },
      ]);

      setDraft(emptyDraft());
    } catch {
      setDraft((current) => ({
        ...current,
        loading: false,
        error: "Не удалось загрузить товары. Попробуйте ещё раз.",
      }));
    }
  }

  const totals = STORES.map((store) => {
    const selectedProducts = rows
      .map((row) => row.selected?.[store.id])
      .filter((product) => product != null);

    return {
      id: store.id,
      cents: selectedProducts.reduce((sum, product) => sum + Math.round(product.price * 100), 0),
      selectedCount: selectedProducts.length,
      complete: rows.length > 0 && selectedProducts.length === rows.length,
    };
  });

  const completeTotals = totals.filter((total) => total.complete);

  const minimum = completeTotals.length
    ? Math.min(...completeTotals.map((total) => total.cents))
    : null;

  function removeRow(id) {
    setRows((current) => current.filter((row) => row.id !== id));
  }

  return (
    <div className="grocery">
      <table className="grocery-table" aria-label="Сравнение цен на продукты">
        <thead>
          <tr>
            <th scope="col">Продукт</th>
            {STORES.map((store) => (
              <th scope="col" key={store.id}>
                {store.name}
              </th>
            ))}
            <th scope="col" aria-label="Действия" />
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <ProductRow
              key={row.id}
              row={row}
              onChange={(query) => updateRow(row.id, query)}
              onSearch={() => searchRow(row.id)}
              onRemove={() => removeRow(row.id)}
              onSelect={(storeId, product) => selectProduct(row.id, storeId, product)}
            />
          ))}

          <ProductRow
            row={draft}
            placeholder
            onChange={(query) => setDraft({ ...emptyDraft(), query })}
            onSearch={searchDraft}
          />
        </tbody>

        <tfoot>
          <tr>
            <th scope="row">Итого</th>

            {totals.map((total) => (
              <td
                key={total.id}
                className={`price ${total.complete && total.cents === minimum ? "best-price" : ""}`}
              >
                {money.format(total.cents / 100)}

                {rows.length > 0 && !total.complete && (
                  <span className="total-note">
                    Выбрано {total.selectedCount} из {rows.length}
                  </span>
                )}
              </td>
            ))}

            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
