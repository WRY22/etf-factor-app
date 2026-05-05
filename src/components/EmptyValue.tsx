// ============================================================
// EmptyValue.tsx
// 統一的缺值 Fallback 顯示元件
// 避免各 component 重複撰寫「暫無數據」的 fallback UI
// ============================================================

interface EmptyValueProps {
  /** 自訂顯示文字，預設為「暫無數據」 */
  text?: string;
}

/**
 * 顯示統一的缺值提示文字。
 * 當任何 API 欄位為 null / undefined / NaN / Infinity 時，
 * 由各 component 呼叫此元件取代空值，確保 UI 不崩潰。
 */
export function EmptyValue({ text = "暫無數據" }: EmptyValueProps) {
  return (
    <span className="text-sm text-gray-400 italic select-none">
      {text}
    </span>
  );
}
