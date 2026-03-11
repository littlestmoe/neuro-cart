# Internationalization (i18n) Setup

How Neuro Cart implements multi-language support (English & Arabic) with RTL layout compatibility.

## Tech Stack

- **Library**: `next-intl`
- **Pattern**: App Router internationalization with middleware/proxy
- **Formats**: JSON-based messages

## Languages Supported

| Language | Code | Direction |
| :------- | :--- | :-------- |
| English  | `en` | LTR       |
| Arabic   | `ar` | RTL       |

## Structure

Each app has its own translations:

```
apps/*/messages/en.json
apps/*/messages/ar.json
```

## Configuration

### 1. `i18n.ts`

Configures the loader for the messages:

```typescript
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
  timeZone: "UTC",
}));
```

### 2. Layout Integration

The `layout.tsx` detects the locale and applies the correct `dir` attribute:

```tsx
export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={direction}>
      <body>{children}</body>
    </html>
  );
}
```

## Adding New Translations

1. Add the key to `en.json`
1. Add the corresponding translation to `ar.json`
1. Use the `useTranslations` hook in your component:

```tsx
const t = useTranslations("common");
return <h1>{t("title")}</h1>;
```

## RTL Styling

Utility classes or conditional logic are used for direction-specific styling:

```css
.container {
  padding-left: 1rem; /* LTR */
}

[dir="rtl"] .container {
  padding-left: 0;
  padding-right: 1rem; /* RTL */
}
```

Neuro Cart primarily uses logical CSS properties (`padding-inline-start`, etc.) where possible for automatic support.
