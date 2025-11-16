import React, { useState, useEffect, useCallback } from 'react';
import { convertBase } from '../services/conversionService';
import { ArrowsRightLeftIcon, ChevronUpIcon, ChevronDownIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

const BaseSelector: React.FC<{ label: string; value: number; onChange: (val: number) => void; }> = ({ label, value, onChange }) => {
    const [inputValue, setInputValue] = useState<string>(value.toString());
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        setInputValue(value.toString());
    }, [value]);

    const increment = () => onChange(Math.min(36, value + 1));
    const decrement = () => onChange(Math.max(2, value - 1));

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);

        if (newValue === '') {
            setError(false);
            return;
        }

        const parsed = parseInt(newValue, 10);
        if (isNaN(parsed) || parsed < 2 || parsed > 36) {
            setError(true);
        } else {
            setError(false);
            onChange(parsed);
        }
    };

    const handleBlur = () => {
        if (inputValue === '' || error) {
            setInputValue(value.toString());
            setError(false);
        }
    };

    return (
        <div className="relative group flex flex-col items-center justify-center space-y-3 py-2 w-36 sm:w-44">
            <div className="w-full text-center font-display text-lg sm:text-xl text-slate-300 py-1 border-2 border-dotted border-slate-700/80 group-hover:border-cyan-400/60 rounded-lg bg-slate-900/50 transition-colors">
                {label}
            </div>
            <div className="flex items-center justify-center space-x-2 w-full pt-1">
                <div className={`bg-slate-900/70 border-2 rounded-xl w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${error ? 'border-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'border-slate-700 group-hover:border-cyan-400/80 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]'}`}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full h-full bg-transparent text-4xl sm:text-5xl md:text-6xl font-black text-center outline-none transition-colors ${error ? 'text-red-400' : 'text-slate-100 group-hover:text-cyan-400'}`}
                        aria-label={`Base value for ${label}`}
                    />
                </div>
                <div className="flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button onClick={increment} className="p-1 text-slate-500 hover:text-cyan-400 transition-colors" aria-label={`Increase base for ${label}`}>
                        <ChevronUpIcon className="w-6 h-6" />
                    </button>
                    <button onClick={decrement} className="p-1 text-slate-500 hover:text-cyan-400 transition-colors" aria-label={`Decrease base for ${label}`}>
                        <ChevronDownIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const presets = [
    { label: 'Bin → Dec', from: 2, to: 10, example: '1101.01' },
    { label: 'Dec → Bin', from: 10, to: 2, example: '13.25' },
    { label: 'Hex → Dec', from: 16, to: 10, example: 'D.4' },
    { label: 'Dec → Hex', from: 10, to: 16, example: '21.25' },
    { label: 'Bin → Hex', from: 2, to: 16, example: '11010100' },
    { label: 'Oct → Dec', from: 8, to: 10, example: '15.2' },
];


const BaseConverter: React.FC = () => {
    const [input, setInput] = useState<string>('1101.011');
    const [fromBase, setFromBase] = useState<number>(2);
    const [toBase, setToBase] = useState<number>(10);
    const [precision, setPrecision] = useState<number>(12);
    const [result, setResult] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        if (!input.trim()) {
            setResult('');
            setError(null);
            return;
        }
        try {
            setError(null);
            const conversionResult = convertBase(input, fromBase, toBase, precision);
            setResult(conversionResult);
        } catch (e: any) {
            setError(e.message);
            setResult('');
        }
    }, [input, fromBase, toBase, precision]);

    const swapBases = useCallback(() => {
        if (error) return;
        setFromBase(toBase);
        setToBase(fromBase);
        setInput(result);
    }, [fromBase, toBase, result, error]);
    
    const handlePresetSelect = (preset: { from: number, to: number, example: string }) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setFromBase(preset.from);
            setToBase(preset.to);
            setInput(preset.example);
            setIsTransitioning(false);
        }, 200); // Should be less than transition duration
    };

    const handleCopy = useCallback(() => {
        if (result && !error) {
            navigator.clipboard.writeText(result).then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            });
        }
    }, [result, error]);

    const resultKey = result + error;

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-2 md:space-y-4 p-2 sm:p-4">
            <header className="text-center w-full pb-2 md:pb-4 border-b border-slate-800/50">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold bg-gradient-to-r from-violet-400 to-purple-500 text-transparent bg-clip-text pb-1">
                    Hybrid Base Converter
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm md:text-base">A fluid, modern interface for number base conversion.</p>
            </header>
            
            <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-3 py-2">
                {presets.map((preset) => (
                    <button
                        key={preset.label}
                        onClick={() => handlePresetSelect(preset)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800/50 rounded-full transition-all duration-200 hover:bg-green-500/20 hover:text-green-300 hover:shadow-[0_0_10px_rgba(74,222,128,0.3)] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black"
                    >
                        {preset.label}
                    </button>
                ))}
            </div>

            <div className={`w-full flex justify-center transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                <div className="inline-flex flex-row items-end gap-x-2 sm:gap-x-4">
                    <BaseSelector label="From base:" value={fromBase} onChange={setFromBase} />

                    <div className="pb-8 sm:pb-10 md:pb-12">
                         <button
                            onClick={swapBases}
                            className="p-3 bg-slate-800/50 rounded-full hover:bg-green-500/20 hover:scale-110 hover:rotate-180 hover:shadow-[0_0_15px_rgba(74,222,128,0.5)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black"
                            aria-label="Swap bases"
                        >
                            <ArrowsRightLeftIcon className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
                        </button>
                    </div>

                    <BaseSelector label="To base:" value={toBase} onChange={setToBase} />
                </div>
            </div>


            <div className="w-full max-w-xl space-y-4">
                <div className={`w-full transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                     <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value.toUpperCase())}
                        placeholder="Enter number..."
                        className="w-full bg-transparent p-2 sm:p-4 border-b-2 border-slate-700 text-center text-2xl sm:text-3xl md:text-4xl font-mono text-white focus:outline-none focus:border-green-400 focus:shadow-[0_0_15px_rgba(74,222,128,0.5),inset_0_0_5px_rgba(74,222,128,0.2)] focus:scale-105 transition-all duration-300"
                    />
                </div>

                <div className="relative w-full bg-slate-900/50 p-4 border border-slate-800 rounded-lg text-2xl sm:text-3xl md:text-4xl font-mono text-green-400 min-h-[68px] break-words flex items-center justify-center text-center">
                    {error ? (
                         <span key={resultKey} className="text-red-500 text-sm sm:text-base animate-[fadeIn_0.5s_ease-in-out]">{error}</span>
                    ) : (
                         <span key={resultKey} className="animate-[fadeIn_0.5s_ease-in-out] animate-pulse-glow-green">{result || '...'}</span>
                    )}
                    {!error && result && (
                        <div className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-3">
                            <button onClick={handleCopy} className="p-2 text-slate-500 hover:text-green-400 transition-colors" aria-label="Copy result">
                                <ClipboardDocumentIcon className="w-5 h-5 sm:w-6 sm:h-6"/>
                            </button>
                        </div>
                    )}
                    {copySuccess && (
                        <div className="absolute top-2 right-2 px-2 py-1 text-xs bg-slate-700 text-green-300 rounded animate-[fadeIn_0.5s_ease-in-out]">
                            Copied!
                        </div>
                    )}
                </div>
            </div>

            <div className="w-full max-w-xl space-y-2 pt-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-medium text-slate-400">
                    <span>Fractional Precision</span>
                    <span className="font-bold text-violet-400 text-sm sm:text-base">{precision}</span>
                </div>
                <input
                    id="precision"
                    type="range"
                    min="0"
                    max="32"
                    value={precision}
                    onChange={(e) => setPrecision(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer custom-slider-obsidian"
                />
            </div>

            <footer className="w-full text-center pt-2 md:pt-4 border-t border-slate-800/50 mt-2">
                <p className="text-xs text-slate-600 tracking-wider">
                    Crafted for precision and fluidity.
                </p>
            </footer>
        </div>
    );
};

export default BaseConverter;