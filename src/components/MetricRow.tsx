// ============================================================
// MetricRow.tsx
// 單列指標顯示元件
// 責任：顯示 label、raw value、description、star rating，保持 layout 可讀
// ============================================================

import type { StarRatingValue } from "../types/etf";
import { StarRating } from "./StarRating";
import { EmptyValue } from "./EmptyValue";

interface MetricRowProps {
  /** 指標名稱，例如「獲利能力因子 RMW」 */
  title: string;
  /** 格式化後的數值字串，例如「0.28」；缺值時傳 null 或 undefined */
  value?: string | null;
  /** 補充說明文字，例如「正值代表強獲利能力」 */
  description?: string;
  /** 星等評分，null 表示資料無效 */
  rating?: StarRatingValue;
}

/**
 * 單列指標顯示元件。
 * 可同時顯示指標名稱、原始數值、補充說明與星等評分。
 * value 缺失時自動渲染 EmptyValue，不會造成 UI 崩潰。
 */
export function MetricRow({ title, value, description, rating }: MetricRowProps) {
  const hasRating = rating !== undefined;

  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-white/10 last:border-0">
      {/* 左側：指標名稱 + 說明 */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-medium text-gray-200 leading-snug">
          {title}
        </span>
        {description && (
          <span className="text-xs text-gray-500 leading-snug">
            {description}
          </span>
        )}
      </div>

      {/* 右側：數值 + 星等 */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        {/* 原始數值 */}
        <div className="text-sm font-mono tabular-nums text-gray-300">
          {value != null && value !== "" ? (
            value
          ) : (
            <EmptyValue />
          )}
        </div>

        {/* 星等評分（選填） */}
        {hasRating && (
          <StarRating rating={rating ?? null} />
        )}
      </div>
    </div>
  );
}
