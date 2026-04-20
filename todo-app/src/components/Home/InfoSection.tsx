// src/components/sections/InfoSection.tsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const InfoSection = () => {
  const sections = [
    {
      to: "/tasks",
      icon: "📋",
      title: "Gestor de Tareas",
      description: "Crea, edita y organiza tus tareas con subtareas ilimitadas. Cada checklist te muestra el progreso visual en tiempo real.",
      features: ["Subtareas", "Progreso", "Prioridades"],
      color: "from-indigo-500 to-purple-500",
      bgLight: "from-indigo-50 to-purple-50",
      bgDark: "from-indigo-950/30 to-purple-950/30"
    },
    {
      to: "/completed",
      icon: "✅",
      title: "Logros Completados",
      description: "Celebra tus victorias. Aquí encontrarás todas las tareas que has finalizado con un diseño especial.",
      features: ["Logros", "Historial", "Celebración"],
      color: "from-emerald-500 to-green-500",
      bgLight: "from-emerald-50 to-green-50",
      bgDark: "from-emerald-950/30 to-green-950/30"
    },
    {
      to: "/trash",
      icon: "🗑️",
      title: "Papelera Inteligente",
      description: "¿Borraste algo por error? Las tareas eliminadas van a la papelera antes de desaparecer.",
      features: ["Recuperar", "Borrado final"],
      color: "from-orange-500 to-red-500",
      bgLight: "from-orange-50 to-red-50",
      bgDark: "from-orange-950/30 to-red-950/30"
    }
  ];

  return (
    <section id="info" className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">
            Todo lo que necesitas en un
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent"> solo lugar</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
            Diseñado para ser intuitivo y rápido. Sin complicaciones, solo productividad.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.to}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative h-full"
            >
              <Link to={section.to} className="block h-full">
                <div className={`h-full bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 
                  hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${section.bgLight} dark:bg-gradient-to-br ${section.bgDark}`}>
                  
                  {/* Icono */}
                  <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {section.icon}
                  </div>

                  {/* Título */}
                  <h3 className={`text-lg sm:text-xl font-bold mb-2 sm:mb-3 bg-gradient-to-r ${section.color} bg-clip-text text-transparent`}>
                    {section.title}
                  </h3>

                  {/* Descripción */}
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 leading-relaxed">
                    {section.description}
                  </p>

                  {/* Features en chips */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {section.features.map((feature, i) => (
                      <span
                        key={i}
                        className="px-2 sm:px-3 py-1 text-xs font-medium rounded-full 
                          bg-white/60 dark:bg-gray-900/60 text-gray-700 dark:text-gray-300 
                          border border-gray-300 dark:border-gray-600 backdrop-blur-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Flecha indicadora */}
                  <div className="absolute bottom-5 sm:bottom-6 right-5 sm:right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mini explicación del flujo */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 sm:mt-12 lg:mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm">
            <span>Crea → Completa → Celebra</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InfoSection;