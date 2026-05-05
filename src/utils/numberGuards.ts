// ============================================================
// numberGuards.ts
// 數值防呆工具函式
// 不引入 React，純 TypeScript，可用於任何層（utils / tests）
// ============================================================

/**
 * 型別守衛：判斷一個未知值是否為有限數值（排除 NaN、Infinity、-Infinity）。
 *
 * 使用場景：
 * - 在金融評分函式中作為 early return 判斷條件
 * - 在 UI 渲染前確認 API 回傳值可安全使用
 *
 * @param value - 任意未知型別的輸入值
 * @returns 若為有限數值則回傳 true，同時收窄型別為 number
 *
 * @example
 * isFiniteNumber(0.32)      // true
 * isFiniteNumber(null)      // false
 * isFiniteNumber(undefined) // false
 * isFiniteNumber(NaN)       // false
 * isFiniteNumber(Infinity)  // false
 * isFiniteNumber("0.5")     // false（字串不接受）
 */
export function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/**
 * 格式化一個未知值為固定小數位數的字串，若無效則回傳 fallback 文字。
 *
 * 此函式是所有 raw value 顯示的統一入口，確保 NaN / null / undefined / Infinity
 * 都不會直接渲染到 UI，而是改以可讀的 fallback 字串取代。
 *
 * @param value   - 任意未知型別的輸入值
 * @param digits  - 小數位數，預設為 2
 * @param fallback - 無效值時的替代文字，預設為「暫無數據」
 * @returns 格式化後的數值字串，或 fallback 字串
 *
 * @example
 * formatNumberOrFallback(0.3245)        // "0.32"
 * formatNumberOrFallback(0.3245, 4)     // "0.3245"
 * formatNumberOrFallback(null)          // "暫無數據"
 * formatNumberOrFallback(NaN)           // "暫無數據"
 * formatNumberOrFallback(undefined, 2, "N/A") // "N/A"
 */
export function formatNumberOrFallback(
  value: unknown,
  digits = 2,
  fallback = "暫無數據"
): string {
  if (!isFiniteNumber(value)) return fallback;
  return value.toFixed(digits);
}

/**
 * 將數值限制在 [min, max] 區間內（inclusive）。
 *
 * 用途：
 * - Momentum score 超出 0–100 時，先 clamp 再轉換星等
 * - 防止極端值破壞評分邏輯
 *
 * @param value - 欲限制的數值
 * @param min   - 最小值（包含）
 * @param max   - 最大值（包含）
 * @returns 限制後的數值
 *
 * @example
 * clamp(120, 0, 100)  // 100
 * clamp(-5, 0, 100)   // 0
 * clamp(72, 0, 100)   // 72
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
