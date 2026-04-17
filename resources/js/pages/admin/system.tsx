import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Shield, Server, Database, Activity, Code, Cpu, HardDrive, Terminal } from 'lucide-react';
import React, { useState, useRef } from 'react';
import AppLayout from '@/components/skorge/AppLayout';

interface SystemMetric {
    label: string;
    value: string;
    status: 'healthy' | 'warning' | 'critical';
}

const metrics: SystemMetric[] = [
    { label: 'Database Connection', value: 'Connected (PostgreSQL/MySQL)', status: 'healthy' },
    { label: 'Server Uptime', value: '99.99% (32 days)', status: 'healthy' },
    { label: 'CPU Usage', value: '18%', status: 'healthy' },
    { label: 'Memory Allocation', value: '4.2GB / 16GB', status: 'healthy' },
    { label: 'Query Response', value: '42ms avg', status: 'healthy' },
    { label: 'Active Sessions', value: '124', status: 'healthy' },
];

const constructorCode = `class ApplicationConstructor {
    /**
     * Initializes the core system architecture and boots service providers.
     * Connects to caching layer (Redis) and establishes primary database pool.
     */
    public function __construct(
        protected DatabaseManager $db,
        protected CacheManager $cache,
        protected EventDispatcher $events
    ) {
        $this->bootProviders();
        $this->verifyDatabaseIntegrity();
        $this->events->dispatch(new SystemBooted());
    }

    private function bootProviders(): void {
        // Registers Wayfinder routes, Inertia views, and Eloquent models
        ServiceProvider::initializeAll();
    }
}`;

function ZoomableImage({ src, alt }: { src: string, alt: string }) {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    return (
        <div className="relative border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden bg-slate-100 dark:bg-[#0B1120] flex flex-col items-center">
            
            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 z-20 flex gap-2">
                <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="w-10 h-10 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur border shadow-lg flex items-center justify-center font-bold pb-1 text-xl hover:scale-110 transition-transform">-</button>
                <div className="w-16 h-10 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur border shadow-lg flex items-center justify-center font-bold text-sm">{Math.round(scale * 100)}%</div>
                <button onClick={() => setScale(s => Math.min(3, s + 0.2))} className="w-10 h-10 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur border shadow-lg flex items-center justify-center font-bold pb-1 text-xl hover:scale-110 transition-transform">+</button>
                <button onClick={() => { setScale(1); setPosition({ x: 0, y: 0 }); }} className="px-4 h-10 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur border shadow-lg flex items-center justify-center font-bold text-xs hover:scale-105 transition-transform uppercase">Reset</button>
            </div>

            <div className="w-full h-[600px] overflow-hidden relative cursor-grab active:cursor-grabbing">
                <motion.div
                    drag
                    className="w-full h-full flex items-center justify-center"
                    animate={{ scale, x: position.x, y: position.y }}
                    onDrag={(_, info) => setPosition({ x: position.x + info.delta.x, y: position.y + info.delta.y })}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    <img 
                        src={src} 
                        alt={alt} 
                        className="max-w-none max-h-none object-contain pointer-events-none drop-shadow-2xl" 
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = `<div class="text-slate-400 font-medium">Please add image to ${src}</div>`;
                        }}
                    />
                </motion.div>
            </div>
            <div className="w-full bg-white dark:bg-slate-900 p-4 border-t dark:border-slate-800 text-center font-bold text-slate-700 dark:text-slate-300">
                {alt}
            </div>
        </div>
    );
}

export default function SystemPanel() {
    return (
        <AppLayout title="System Overview" description="Monitoring, Architecture, and Configurations">
            <div className="mb-8 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
                    <Shield className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">System Monitor & Architecture</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Real-time status and technical blueprints</p>
                </div>
            </div>

            {/* Server & DB Monitor */}
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-slate-800 dark:text-white mt-12">
                <Activity className="w-5 h-5 text-cyan-500" /> Real-time System Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {metrics.map((metric, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx}
                        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/20 dark:shadow-none flex items-start gap-4"
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                            idx === 0 ? 'bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-500/20 dark:border-blue-500/30' :
                            idx === 1 ? 'bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-500/20 dark:border-emerald-500/30' :
                            idx === 2 ? 'bg-rose-100 text-rose-600 border-rose-200 dark:bg-rose-500/20 dark:border-rose-500/30' :
                            'bg-amber-100 text-amber-600 border-amber-200 dark:bg-amber-500/20 dark:border-amber-500/30'
                        }`}>
                            {idx === 0 ? <Database /> : idx === 1 ? <Server /> : idx === 2 ? <Cpu /> : <HardDrive />}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{metric.label}</p>
                            <p className="text-lg font-black text-slate-800 dark:text-white mt-1">{metric.value}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Live & Healthy</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Constructor File */}
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-slate-800 dark:text-white mt-16">
                <Code className="w-5 h-5 text-fuchsia-500" /> Core Constructor & Initialization Function
            </h2>
            <div className="bg-[#0D1117] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl mb-16 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-800 bg-[#161B22]">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-rose-500" />
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                    <span className="ml-4 text-xs font-mono text-slate-400 flex items-center gap-2"><Terminal className="w-3 h-3" /> App/Core/SystemConstructor.php</span>
                </div>
                <div className="p-6 overflow-x-auto">
                    <pre className="text-sm font-mono leading-relaxed pointer-events-auto">
                        <code dangerouslySetInnerHTML={{ __html: constructorCode 
                            .replace(/class ApplicationConstructor/g, '<span class="text-fuchsia-400">class</span> <span class="text-amber-300">ApplicationConstructor</span>')
                            .replace(/public function __construct/g, '<span class="text-fuchsia-400">public function</span> <span class="text-blue-400">__construct</span>')
                            .replace(/protected|private/g, '<span class="text-fuchsia-400">$&</span>')
                            .replace(/void/g, '<span class="text-cyan-400">$&</span>')
                            .replace(/(\/\*\*[\s\S]*?\*\/|\/\/.*)/g, '<span class="text-slate-500">$&</span>')
                            .replace(/(\$this|-&gt;|\w+\(|::)/g, '<span class="text-cyan-300">$&</span>')
                        }} />
                    </pre>
                </div>
            </div>

            {/* Architecture Diagrams (DFD & ERD) */}
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-slate-800 dark:text-white mt-16">
                <Server className="w-5 h-5 text-orange-500" /> System Architecture & Data Flow
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
                Drag to pan and use controls to zoom into the architectural diagrams.
            </p>
            
            <div className="grid grid-cols-1 gap-12 mb-20">
                <ZoomableImage src="/images/dfd-level-0.svg" alt="Data Flow Diagram (Level 0) - Context Diagram" />
                <ZoomableImage src="/images/dfd-level-1.svg" alt="Data Flow Diagram (Level 1) - Process Decomposition" />
                <ZoomableImage src="/images/erd.svg" alt="Entity Relationship Diagram (ERD) - Database Schema" />
            </div>

        </AppLayout>
    );
}
