export enum ActionType {
  FIX_GRAMMAR = 'FIX_GRAMMAR',
  MAKE_FORMAL = 'MAKE_FORMAL',
  MAKE_FRIENDLY = 'MAKE_FRIENDLY',
  SUMMARIZE = 'SUMMARIZE',
  TRANSLATE_EN = 'TRANSLATE_EN'
}

export interface AnalysisResult {
  originalText: string;
  enhancedText: string;
  actionUsed: ActionType;
  timestamp: number;
}

export interface AIError {
  message: string;
}