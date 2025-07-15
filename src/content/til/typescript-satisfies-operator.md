---
author: Sathiyaseelan Ravi
pubDatetime: 2025-01-14T15:30:00Z
title: TypeScript satisfies operator
tags:
  - typescript
  - javascript
description: Using TypeScript's satisfies operator for better type inference
---

The `satisfies` operator in TypeScript (introduced in 4.9) lets you validate that an expression matches a type without widening the type.

## The Problem

With traditional type annotations, TypeScript widens the type:

```typescript
type Colors = "red" | "green" | "blue";
type RGB = [number, number, number];

const palette: Record<Colors, string | RGB> = {
  red: [255, 0, 0],
  green: "#00ff00",
  blue: [0, 0, 255]
};

// TypeScript doesn't know if palette.red is string or RGB
palette.red.toUpperCase(); // Error! Could be RGB array
```

## The Solution with satisfies

```typescript
const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
  blue: [0, 0, 255]
} satisfies Record<Colors, string | RGB>;

// Now TypeScript knows the exact types!
palette.red[0]; // Works! TypeScript knows it's [number, number, number]
palette.green.toUpperCase(); // Works! TypeScript knows it's string
```

## Another Example

```typescript
type Config = {
  host: string;
  port: string | number;
  protocol: "http" | "https";
};

// With type annotation - loses literal types
const config1: Config = {
  host: "localhost",
  port: 3000,
  protocol: "https"
};
// config1.protocol is type "http" | "https", not "https"

// With satisfies - keeps literal types
const config2 = {
  host: "localhost",
  port: 3000,
  protocol: "https"
} satisfies Config;
// config2.protocol is type "https"!
```

The `satisfies` operator gives you type checking without losing the precision of your actual values. Best of both worlds!