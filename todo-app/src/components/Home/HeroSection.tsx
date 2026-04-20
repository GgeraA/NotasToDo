// src/components/sections/HeroSection.tsx
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const textItem: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
        filter: 'blur(8px)',
    },
    show: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
};

const textContainer = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.12,
        },
    },
};

const HeroSection = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        const handleMouseMove = (e: MouseEvent) => {
            if (!isMobile) {
                setMousePosition({
                    x: (e.clientX / window.innerWidth - 0.5) * 15,
                    y: (e.clientY / window.innerHeight - 0.5) * 15
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', checkMobile);
        };
    }, [isMobile]);

    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950">

            {/* FONDO CON PATRONES */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 opacity-10 dark:opacity-20"
                    style={{
                        backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(255,255,255,0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(255,255,255,0.2) 0%, transparent 50%),
              linear-gradient(90deg, transparent 95%, rgba(255,255,255,0.1) 100%),
              linear-gradient(0deg, transparent 95%, rgba(255,255,255,0.1) 100%)
            `,
                        backgroundSize: '100% 100%, 100% 100%, 40px 40px, 40px 40px'
                    }}
                />
            </div>

            {/* GRADIENTE ANIMADO */}
            <motion.div
                className="absolute inset-0"
                animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: 'linear',
                }}
                style={{
                    background: `
            linear-gradient(
              135deg,
              rgba(99, 102, 241, 0.3) 0%,
              rgba(168, 85, 247, 0.3) 50%,
              rgba(236, 72, 153, 0.3) 100%
            )
          `,
                    backgroundSize: '300% 300%',
                }}
            />

            {/* ELEMENTOS FLOTANTES - Solo en desktop */}
            {!isMobile && (
                <div className="absolute inset-0 overflow-hidden">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-xl bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10"
                            initial={{
                                x: Math.random() * 100 + 'vw',
                                y: Math.random() * 100 + 'vh',
                                width: Math.random() * 50 + 30 + 'px',
                                height: Math.random() * 50 + 30 + 'px',
                                rotate: Math.random() * 20 - 10
                            }}
                            animate={{
                                y: [null, `-${Math.random() * 120 + 40}px`],
                                x: [null, `${Math.random() * 50 - 25}px`],
                                rotate: [null, Math.random() * 15 - 7.5],
                                opacity: [0.15, 0.35, 0.15],
                            }}
                            transition={{
                                duration: Math.random() * 20 + 15,
                                repeat: Infinity,
                                ease: 'linear',
                                delay: Math.random() * 5,
                            }}
                        >
                            <div className="w-full h-full flex items-center justify-center">
                                <div className={`w-3 h-3 rounded border-2 border-white/40 ${i % 3 === 0 ? 'bg-white/30' : ''}`} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* CONTENIDO PRINCIPAL */}
            <div className="relative z-10 h-screen flex flex-col lg:flex-row items-center justify-center lg:justify-between px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 lg:py-12">

                {/* COLUMNA IZQUIERDA - TEXTO */}
                <motion.div
                    className="w-full lg:w-1/2 max-w-3xl mx-auto lg:mx-0 text-center lg:text-left"
                    variants={textContainer}
                    initial="hidden"
                    animate="show"
                >
                    {/* BADGE */}
                    <motion.div
                        variants={textItem}
                        className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10 mb-4 sm:mb-6 group hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 mt-6"
                    >
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></div>
                        <span className="text-xs sm:text-sm font-medium text-white/90 tracking-wide">
                            Organiza • Prioriza • Completa
                        </span>
                    </motion.div>

                    {/* TÍTULO PRINCIPAL */}
                    <motion.h1
                        variants={textItem}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-3 sm:mb-4"
                    >
                        <span className="bg-gradient-to-r from-white via-indigo-100 to-purple-100 bg-clip-text text-transparent">
                            Domina tus
                        </span>
                        <br className="hidden sm:block" />
                        <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
                            Tareas Diarias
                        </span>
                    </motion.h1>

                    {/* SUBTÍTULO */}
                    <motion.p
                        variants={textItem}
                        className="text-lg sm:text-xl md:text-2xl text-white/80 font-light mb-4 sm:mb-6"
                    >
                        Un gestor de tareas <span className="text-emerald-300 font-medium">inteligente</span> con
                        seguimiento visual
                    </motion.p>

                    {/* DESCRIPCIÓN */}
                    <motion.p
                        variants={textItem}
                        className="text-sm sm:text-base md:text-lg text-white/70 leading-relaxed mb-6 sm:mb-8 max-w-2xl lg:max-w-xl mx-auto lg:mx-0"
                    >
                        Crea listas, divide objetivos en subtareas y observa cómo tu productividad
                        crece con cada checkbox completado.
                    </motion.p>

                    {/* CTA BUTTONS */}
                    <motion.div
                        variants={textItem}
                        className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
                    >
                        <Link
                            to="/tasks"
                            className="px-4 sm:px-2 py-3 sm:py-4 rounded-full bg-white text-indigo-600 font-medium text-sm tracking-wide flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                        >
                            <span>Comenzar Ahora</span>
                        </Link>

                        <a
                            href="#info"
                            className="px-4 sm:px-2 py-3 sm:py-4 rounded-full border border-white/40 text-white font-medium text-sm tracking-wide flex items-center justify-center space-x-2 hover:border-white hover:bg-white/10 transition-all"
                        >
                            <span>Descubre más</span>
                        </a>
                    </motion.div>
                </motion.div>

                {/* COLUMNA DERECHA - VISUAL DE TASKS */}
                <motion.div
                    className="w-full lg:w-1/2 mt-8 lg:mt-0 flex justify-center lg:justify-end ml-2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        x: isMobile ? 0 : mousePosition.x * 0.3,
                        y: isMobile ? 0 : mousePosition.y * 0.3
                    }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
                        {/* Tarjeta de ejemplo */}
                        <div className="bg-white/10 dark:bg-gray-800/40 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 dark:border-white/10 shadow-2xl">

                            {/* Header */}
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400"></div>
                                    <span className="text-white text-sm sm:text-base font-semibold">Proyecto Web</span>
                                </div>
                                <span className="px-2 sm:px-3 py-1 rounded-full bg-orange-400/20 text-orange-200 text-xs font-medium border border-orange-400/30">
                                    Alta
                                </span>
                            </div>

                            {/* Barra de progreso */}
                            <div className="mb-3 sm:mb-4">
                                <div className="flex justify-between text-white/80 text-xs sm:text-sm mb-1">
                                    <span>Progreso</span>
                                    <span>65%</span>
                                </div>
                                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '65%' }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"
                                    />
                                </div>
                            </div>

                            {/* Subtareas */}
                            <div className="space-y-2">
                                {[
                                    { text: 'Diseñar interfaz', done: true },
                                    { text: 'Implementar lógica', done: true },
                                    { text: 'Conectar API', done: false },
                                ].map((subtask, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + i * 0.1 }}
                                        className="flex items-center gap-2 sm:gap-3 text-white/90"
                                    >
                                        <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center transition-all
                      ${subtask.done
                                                ? 'bg-emerald-400 border-emerald-400'
                                                : 'border-white/40'}`}
                                        >
                                            {subtask.done && (
                                                <motion.span
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="text-white text-xs"
                                                >
                                                    ✓
                                                </motion.span>
                                            )}
                                        </div>
                                        <span className={`text-sm sm:text-base ${subtask.done ? 'line-through text-white/50' : ''}`}>
                                            {subtask.text}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/20">
                                <span className="text-white/50 text-xs sm:text-sm">📅 Creada hoy</span>
                            </div>
                        </div>

                        {/* Efectos de luz - Solo desktop */}
                        {!isMobile && (
                            <>
                                <motion.div
                                    className="absolute -top-4 -right-4 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full opacity-20 blur-2xl"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.2, 0.3, 0.2],
                                    }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                />
                                <motion.div
                                    className="absolute -bottom-4 -left-4 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full opacity-20 blur-2xl"
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        opacity: [0.15, 0.25, 0.15],
                                    }}
                                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                                />
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;