# falcon

A static site generator running on Bun

To install dependencies:

```bash
bun install
```

Dev mode:

```bash
bun index.ts --dev
```

Build:

```bash
bun index.ts --build
```

## Routing

- File based routing (inspired by Next.js).
- Every page is under `/pages` directory
- Live reload - ⏳
- Top level pages routing - ✅
- CSS inline styles - ✅
- CSS modules - ⏳
- Layouts - ⏳

## Inline styling

```tsx
interface Props {
  styles: any;
}

export const styles = {
  text: {
    backgroundColor: "red",
    fontSize: "20px",
  },
};

export default function Page({ styles }: Props) {
  return <div style={styles.text}>Page</div>;
}
```

## Data loading

```tsx
interface Props {
  data: {
    phone: number;
  };
}

export const loader = (): Omit<Props, "styles"> => {
  const data = {
    phone: 81234567,
  };

  return { data };
};

export default function About({ data, styles }: Props) {
  const { phone } = data;
  return <div>Phone number: {phone}</div>;
}
```

MIT
