/**
 * Script para asignar productId secuencial a productos existentes
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Counter from '../models/Counter.js';

dotenv.config();

const updateProductIds = async () => {
    try {
        console.log('🔄 Conectando a MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado a MongoDB');

        // Obtener todos los productos sin productId
        const productos = await Product.find({ 
            $or: [
                { productId: { $exists: false } },
                { productId: 0 }
            ]
        }).sort({ creationDate: 1 });

        console.log(`📦 Productos a actualizar: ${productos.length}`);

        if (productos.length === 0) {
            console.log('✅ Todos los productos ya tienen productId');
            process.exit(0);
        }

        // Obtener el valor actual del contador
        let counter = await Counter.findById('productId');
        let currentId = counter ? counter.sequence_value : 0;

        console.log(`🔢 Iniciando desde ID: ${currentId + 1}`);

        // Actualizar cada producto
        for (const producto of productos) {
            currentId++;
            producto.productId = currentId;
            await producto.save({ validateBeforeSave: false });
            console.log(`  ✓ ${producto.name} → productId: ${currentId}`);
        }

        // Actualizar el contador
        await Counter.findByIdAndUpdate(
            'productId',
            { sequence_value: currentId },
            { upsert: true }
        );

        console.log(`\n✅ Actualización completa. ${productos.length} productos actualizados.`);
        console.log(`📊 Último ID asignado: ${currentId}`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

updateProductIds();
