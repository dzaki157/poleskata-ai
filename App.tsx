import React, { useState } from 'react';
import { 
  Wand2, 
  Briefcase, 
  MessageCircle, 
  FileText, 
  Languages, 
  Eraser, 
  Sparkles,
  Copy,
  Check,
  ArrowRight
} from 'lucide-react';
import { ActionType } from './types';
import { processTextWithGemini } from './services/geminiService';
import { ActionButton } from './components/ActionButton';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeAction, setActiveAction] = useState<ActionType | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (action: ActionType) => {
    if (!inputText.trim()) {
      setError("Mohon masukkan teks terlebih dahulu.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setActiveAction(action);
    setOutputText(''); // Clear previous output to show loading state clearly

    try {
      const result = await processTextWithGemini(inputText, action);
      setOutputText(result);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan tidak dikenal.");
    } finally {
      setIsLoading(false);
      // Keep active action highlighted for a moment for visual feedback
      setTimeout(() => setActiveAction(null), 2000);
    }
  };

  const handleCopy = () => {
    if (outputText) {
      navigator.clipboard.writeText(outputText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2 tracking-tight">
            PolesKata AI
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Asisten cerdas bertenaga Gemini untuk memperbaiki, mengubah nada, dan menerjemahkan tulisan Anda secara instan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Input Section */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[400px]">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Input</span>
                {inputText && (
                  <button 
                    onClick={handleClear}
                    className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                  >
                    <Eraser className="w-3 h-3" /> Bersihkan
                  </button>
                )}
              </div>
              <textarea
                className="flex-1 w-full p-4 resize-none outline-none text-slate-700 placeholder:text-slate-300 leading-relaxed"
                placeholder="Tulis atau tempel teks Anda di sini... (Contoh: 'saya mau makan tpi gk punya duit tolongin dong')"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                maxLength={2000}
              />
              <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-xs text-slate-400 text-right">
                {inputText.length} / 2000 karakter
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 animate-pulse">
                {error}
              </div>
            )}
          </div>

          {/* Output Section */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[400px] relative">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-3 h-3" />
                  Hasil AI
                </span>
                {outputText && (
                  <button 
                    onClick={handleCopy}
                    className="text-xs flex items-center gap-1.5 font-medium transition-colors text-slate-500 hover:text-indigo-600"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {isCopied ? 'Tersalin' : 'Salin Teks'}
                  </button>
                )}
              </div>
              
              <div className="flex-1 w-full p-4 overflow-y-auto bg-slate-50/50 relative">
                {isLoading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-3">
                    <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <span className="text-sm font-medium animate-pulse">Sedang memoles kata...</span>
                  </div>
                ) : outputText ? (
                  <div className="prose prose-slate max-w-none leading-relaxed text-slate-800 whitespace-pre-wrap animate-in fade-in duration-500">
                    {outputText}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-2 select-none">
                    <ArrowRight className="w-8 h-8 opacity-20" />
                    <span className="text-sm">Hasil akan muncul di sini</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Actions Panel */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 ml-1">Pilih Tindakan</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <ActionButton 
              icon={Wand2} 
              label="Perbaiki Ejaan" 
              onClick={() => handleAction(ActionType.FIX_GRAMMAR)}
              disabled={isLoading || !inputText}
              isActive={activeAction === ActionType.FIX_GRAMMAR}
              colorClass="text-blue-500"
            />
            <ActionButton 
              icon={Briefcase} 
              label="Jadi Formal" 
              onClick={() => handleAction(ActionType.MAKE_FORMAL)}
              disabled={isLoading || !inputText}
              isActive={activeAction === ActionType.MAKE_FORMAL}
              colorClass="text-slate-700"
            />
            <ActionButton 
              icon={MessageCircle} 
              label="Jadi Santai" 
              onClick={() => handleAction(ActionType.MAKE_FRIENDLY)}
              disabled={isLoading || !inputText}
              isActive={activeAction === ActionType.MAKE_FRIENDLY}
              colorClass="text-green-500"
            />
            <ActionButton 
              icon={FileText} 
              label="Ringkas" 
              onClick={() => handleAction(ActionType.SUMMARIZE)}
              disabled={isLoading || !inputText}
              isActive={activeAction === ActionType.SUMMARIZE}
              colorClass="text-orange-500"
            />
            <ActionButton 
              icon={Languages} 
              label="Inggris" 
              onClick={() => handleAction(ActionType.TRANSLATE_EN)}
              disabled={isLoading || !inputText}
              isActive={activeAction === ActionType.TRANSLATE_EN}
              colorClass="text-purple-500"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;