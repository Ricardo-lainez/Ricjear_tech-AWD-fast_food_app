const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Importamos la librería de encriptación

const app = express();
const port = 3000;

// --- Middlewares Esenciales ---
// 1. Para permitir peticiones desde tu frontend
app.use(cors());
// 1.5 Log simple de todas las peticiones entrantes (útil para depuración)
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url);
  next();
});
// 2. Para que Express pueda entender el JSON que envía el frontend
app.use(express.json()); 

// --- Configuración de la Base de Datos ---
// Pega tu cadena de conexión de MongoDB Atlas
// ¡RECUERDA CAMBIAR <password> POR TU CONTRASEÑA REAL!
const uri = "mongodb+srv://Ricjear:ricjear1234@database.elr1agz.mongodb.net/?appName=dataBase";
const client = new MongoClient(uri);

// Variable global para la colección de usuarios
let usersCollection;

async function run() {
  try {
    // Conecta el cliente al servidor
    await client.connect();
    console.log("¡Conectado exitosamente a MongoDB Atlas!");

    // Define la base de datos y la colección
    const database = client.db("DatabaseBocattoValley"); // El nombre de tu DB
    usersCollection = database.collection("usuarios"); // Creamos/Usamos la colección 'usuarios'

    // --- RUTAS DE TU API ---

    /**
     * @route   POST /api/register
     * @desc    Registra un nuevo usuario
     */
    app.post('/api/register', async (req, res) => {
        try {
      // Log del body recibido (ocultamos la contraseña por seguridad visual)
      const safeBody = Object.assign({}, req.body);
      if (safeBody.password) safeBody.password = '[REDACTED]';
      console.log('POST /api/register - body:', safeBody);
            // 1. Obtenemos los datos del cuerpo (body) de la petición
            const { name, surname, email, password, phone, address } = req.body;

            // 2. Verificación: ¿El email ya existe?
            const existingUser = await usersCollection.findOne({ email: email });
            if (existingUser) {
                // Si existe, enviamos un error 400 (Bad Request)
                return res.status(400).json({ message: "El correo electrónico ya está registrado." });
            }

            // 3. Encriptar la contraseña
            const saltRounds = 10; // Nivel de seguridad
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // 4. Crear el nuevo documento de usuario
            const newUser = {
                name,
                surname,
                email,
                password: hashedPassword, // ¡Guardamos la contraseña encriptada!
                phone,
                address,
                registrationDate: new Date(), // Campo solicitado
                isActive: true                // Campo solicitado
            };

            // 5. Insertar el nuevo usuario en la base de datos
            await usersCollection.insertOne(newUser);

            // 6. Enviar respuesta de éxito (201 - Created)
            res.status(201).json({ message: "¡Usuario registrado con éxito!" });

        } catch (err) {
            console.error("Error en el registro:", err);
            res.status(500).json({ message: "Error interno del servidor." });
        }
    });

    // --- FIN DE RUTAS ---

    // Inicia el servidor
    app.listen(port, () => {
      console.log(`Servidor backend corriendo en http://localhost:${port}`);
    });

  } catch (err) {
    console.error("Error al conectar a MongoDB:", err);
    process.exit(1); // Cierra la aplicación si no se puede conectar a la DB
  }
}

// Llama a la función principal
run();