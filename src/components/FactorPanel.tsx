// ============================================================
// FactorPanel.tsx
// 通用區塊卡片元件
// 責任：只負責 layout，不做任何金融計算
// ============================================================

import type { ReactNode } from "react";

interface FactorPanelProps {
  /** 區塊標題，例如「市場與規模」 */
  title: string;
  /** 區塊副標題，例如英文對照「Market & Size」 */
  subtitle?: string;
  /** 區塊內部內容（MetricRow、BetaGauge 等子元件） */
  children: ReactNode;
}

/**
 * 通用因子面板卡片。
 * 用於 Dashboard 的四個主要區塊，僅負責外觀框架與標題排版，
 * 金融邏輯計算全部交由子元件或 utils 處理。
 */
export function FactorPanel({ title, subtitle, children }: FactorPanelProps) {
  return (
    <section className="
      flex flex-col gap-4
      rounded-2xl border border-white/10
      bg-white/5 backdrop-blur-sm
      p-5
      shadow-[0_2px_16px_rgba(0,0,0,0.3)]
      transition-shadow duration-300
      hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)]
    ">
      {/* 標題列 */}
      <header className="flex flex-col gap-0.5 border-b border-white/10 pb-3">
        <h2 className="text-base font-semibold tracking-wide text-white">
          {title}
        </h2>
        {subtitle && (
          <span className="text-xs text-gray-500 tracking-wider uppercase">
            {subtitle}
          </span>
        )}
      </header>

      {/* 內容區 */}
      <div className="flex flex-col">
        {children}
      </div>
    </section>
  );
}
