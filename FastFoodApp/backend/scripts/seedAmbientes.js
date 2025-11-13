import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Ambiente from '../models/Ambiente.js';

// Cargar variables de entorno
dotenv.config();

const ambientes = [
    {
        nombre: 'Salón Principal',
        descripcion: 'Ambiente elegante y espacioso perfecto para celebraciones grandes, con una atmósfera refinada y cómoda.',
        capacidadMin: 20,
        capacidadMax: 50,
        caracteristicas: [
            'Aire acondicionado',
            'Sistema de sonido',
            'Iluminación ambiental',
            'Decoración elegante'
        ],
        imagenUrl: 'images/promociones/salon-principal.jpg',
        badge: {
            icono: 'fa-star',
            texto: 'Popular',
            clase: 'badge-popular'
        },
        rating: {
            promedio: 4.8,
            totalResenas: 124
        },
        activo: true,
        orden: 1
    },
    {
        nombre: 'Terraza VIP',
        descripcion: 'Espacio al aire libre exclusivo con vista panorámica. Ideal para eventos íntimos bajo las estrellas.',
        capacidadMin: 10,
        capacidadMax: 30,
        caracteristicas: [
            'Vista panorámica',
            'Área al aire libre',
            'Servicio exclusivo',
            'Iluminación nocturna',
            'Calentadores'
        ],
        imagenUrl: 'images/promociones/terraza-vip.jpg',
        badge: {
            icono: 'fa-crown',
            texto: 'Premium',
            clase: 'badge-premium'
        },
        rating: {
            promedio: 4.9,
            totalResenas: 87
        },
        activo: true,
        orden: 2
    },
    {
        nombre: 'Salón Familiar',
        descripcion: 'Espacio acogedor diseñado para reuniones familiares, con ambiente cálido y zona de juegos para niños.',
        capacidadMin: 15,
        capacidadMax: 40,
        caracteristicas: [
            'Zona de juegos infantil',
            'Menú especial para niños',
            'Ambiente familiar',
            'Pantallas para entretenimiento'
        ],
        imagenUrl: 'images/promociones/salon-familiar.jpg',
        badge: {
            icono: 'fa-heart',
            texto: 'Familiar',
            clase: 'badge-family'
        },
        rating: {
            promedio: 4.7,
            totalResenas: 156
        },
        activo: true,
        orden: 3
    },
    {
        nombre: 'Bar Lounge',
        descripcion: 'Ambiente moderno y relajado con barra completa. Perfecto para reuniones casuales y after-office.',
        capacidadMin: 8,
        capacidadMax: 25,
        caracteristicas: [
            'Barra completa',
            'Música en vivo',
            'Coctelería premium',
            'Ambiente moderno',
            'WiFi alta velocidad'
        ],
        imagenUrl: 'images/promociones/bar-lounge.jpg',
        badge: {
            icono: 'fa-cocktail',
            texto: 'Nuevo',
            clase: 'badge-new'
        },
        rating: {
            promedio: 4.6,
            totalResenas: 93
        },
        activo: true,
        orden: 4
    }
];

const seedAmbientes = async () => {
    try {
        console.log('🔌 Conectando a MongoDB...');
        const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://jeancarlo:jean12345@cluster0.3ixvnnj.mongodb.net/FastFoodApp';
        await mongoose.connect(MONGO_URI);
        console.log('✅ Conectado a MongoDB\n');

        // Limpiar colección existente
        console.log('🗑️  Limpiando ambientes existentes...');
        await Ambiente.deleteMany({});
        console.log('✅ Ambientes eliminados\n');

        // Insertar nuevos ambientes
        console.log('📝 Insertando ambientes...');
        const ambientesCreados = await Ambiente.insertMany(ambientes);
        
        console.log('✅ Ambientes insertados exitosamente:\n');
        ambientesCreados.forEach((ambiente, index) => {
            console.log(`${index + 1}. ${ambiente.nombre}`);
            console.log(`   - Capacidad: ${ambiente.capacidadMin}-${ambiente.capacidadMax} personas`);
            console.log(`   - Rating: ${ambiente.rating.promedio} ⭐ (${ambiente.rating.totalResenas} reseñas)`);
            console.log(`   - Badge: ${ambiente.badge.texto}\n`);
        });

        console.log('========================================');
        console.log(`✨ Total de ambientes creados: ${ambientesCreados.length}`);
        console.log('========================================\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error al insertar ambientes:', error);
        process.exit(1);
    }
};

// Ejecutar el seed
seedAmbientes();
