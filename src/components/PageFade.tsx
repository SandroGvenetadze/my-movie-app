// src/components/PageFade.tsx
// Tiny wrapper that applies a fade-in on route change using a key.

import React from 'react';

type Props = { children: React.ReactNode };

export default function PageFade({ children }: Props) {
  return <div className="page-fade">{children}</div>;
}
