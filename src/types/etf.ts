// ============================================================
// ETFRegressionSlopes
// 後端正式 contract：所有因子斜率皆為 number，不允許缺值
// ============================================================

/**
 * Fama-French Five-Factor Model 的 ETF 迴歸斜率。
 * 此為後端 API 的嚴格合約型別，所有欄位皆必須存在且為有限數值。
 */
export interface ETFRegressionSlopes {
  /** 市場 Beta，衡量 ETF 對整體市場的敏感度 */
  mkt: number;
  /** 規模因子 Small Minus Big，正值偏向小型股 */
  smb: number;
  /** 正交化價值因子 Orthogonal High Minus Low，正值偏向價值股 */
  hml_o: number;
  /** 獲利能力因子 Robust Minus Weak，正值代表強獲利能力 */
  rmw: number;
  /** 投資因子 Conservative Minus Aggressive，正值代表保守投資 */
  cma: number;
}

/**
 * ETF 完整資料結構（後端嚴格合約）。
 * 此型別假設 API 傳入資料完整無缺，適用於已驗證的資料層。
 */
export interface ETFData {
  /** ETF 代號，例如 "0050" */
  etfId: string;
  /** ETF 名稱，例如 "元大台灣50" */
  etfName: string;
  /** Fama-French 五因子迴歸斜率 */
  slopes: ETFRegressionSlopes;
  /** 動能分數，範圍 0–100 */
  momentum_score: number;
  /** 歷史波動度（百分比），例如 15.3 代表 15.3% */
  volatility: number;
}

// ============================================================
// UI 安全輸入型別
// 防呆層：允許 null / undefined，避免 API 異常導致 UI 崩潰
// ============================================================

/**
 * 允許 null 或 undefined 的數值型別。
 * 用於 UI 防呆層，任何來自 API 的數值欄位都應透過此型別保護。
 */
export type NullableNumber = number | null | undefined;

/**
 * UI 安全版本的 ETF 迴歸斜率型別。
 * 所有欄位皆為可選，且允許 null / undefined。
 */
export interface ETFRegressionSlopesInput {
  mkt?: NullableNumber;
  smb?: NullableNumber;
  hml_o?: NullableNumber;
  rmw?: NullableNumber;
  cma?: NullableNumber;
}

/**
 * UI 安全版本的 ETF 資料型別。
 * component props 建議使用此型別，以避免 API 異常導致畫面崩潰。
 *
 * 設計原則：
 * - `ETFData` 是後端正式 contract。
 * - `ETFDataInput` 是 UI 防呆層使用。
 */
export interface ETFDataInput {
  etfId?: string | null;
  etfName?: string | null;
  slopes?: ETFRegressionSlopesInput | null;
  momentum_score?: NullableNumber;
  volatility?: NullableNumber;
}

// ============================================================
// StarRatingValue
// 所有因子評分函式的回傳型別
// ============================================================

/**
 * 星等評分值，範圍 1–5。
 * `null` 代表資料無效或不足以評分，UI 應顯示「暫無數據」。
 */
export type StarRatingValue = 1 | 2 | 3 | 4 | 5 | null;
