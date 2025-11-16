import React, { useState, useEffect } from 'react';

const shapes = [
    // Original shapes enhanced
    { class: 'w-24 h-24 border-2 border-green-500/20 rotate-45', depth: 0.1, top: '15%', left: '10%' },
    { class: 'w-48 h-48 border-t-2 border-r-2 border-slate-500/20 rounded-full animate-spin-slow', depth: 0.2, top: '60%', left: '5%' },
    { class: 'w-12 h-12 bg-green-500/10 animate-pulse-slow', depth: 0.3, top: '10%', left: '85%' },
    { class: 'w-32 h-1 border-b-2 border-slate-500/20', depth: -0.1, top: '80%', left: '80%' },
    { class: 'w-2 h-24 border-l-2 border-green-500/20', depth: 0.15, top: '5%', left: '50%' },
    { class: 'w-40 h-40 border-dashed border-2 border-slate-500/10 rounded-full', depth: -0.2, top: '40%', left: '60%' },
    { class: 'w-16 h-16 border-4 border-slate-500/10', depth: -0.3, top: '85%', left: '20%' },
    { class: 'w-1 h-40 bg-gradient-to-b from-transparent via-green-500/10 to-transparent', depth: 0.25, top: '30%', left: '90%' },
    { class: 'w-64 h-64 rounded-full border border-slate-500/5', depth: 0.05, top: '5%', left: '20%' },

    // New abstract & surreal shapes
    { class: 'w-1 h-1 bg-white/50 rounded-full', depth: 0.6, top: '10%', left: '20%' },
    { class: 'w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse-slow', depth: 0.8, top: '80%', left: '60%' },
    { class: 'w-1 h-1 bg-white/50 rounded-full', depth: 0.7, top: '55%', left: '25%' },
    { class: 'w-40 h-40 rounded-full border-t-2 border-l-2 border-green-500/10 rotate-[120deg]', depth: -0.15, top: '75%', left: '30%'},
    { class: 'w-[1px] h-32 bg-slate-500/20 animate-pulse-slow', depth: 0.3, top: '20%', left: '70%'},
    { class: 'w-20 h-20 border-dotted border-2 border-green-500/20 rounded-full', depth: -0.25, top: '20%', left: '80%' },
    { class: 'w-36 h-36 rounded-full border-b-2 border-slate-500/5 animate-spin-slow [animation-direction:reverse;]', depth: 0.1, top: '45%', left: '35%' },
    { class: 'w-2 h-2 bg-white/30 rounded-full animate-pulse-slow', depth: 0.5, top: '90%', left: '90%' },
    { class: 'w-3 h-3 bg-white/30 rounded-full', depth: 0.4, top: '5%', left: '5%' },
];

const AnimatedBackground: React.FC = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            {shapes.map((shape, i) => {
                const offsetX = (window.innerWidth / 2 - position.x) * shape.depth;
                const offsetY = (window.innerHeight / 2 - position.y) * shape.depth;

                return (
                    <div
                        key={i}
                        className={`absolute transition-transform duration-700 ease-out ${shape.class}`}
                        style={{
                            top: shape.top,
                            left: shape.left,
                            transform: `translate(${offsetX}px, ${offsetY}px)`
                        }}
                    />
                );
            })}
        </div>
    );
};

export default AnimatedBackground;