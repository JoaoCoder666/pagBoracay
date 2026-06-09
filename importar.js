const admin = require('firebase-admin');
const fs = require('fs');
const csv = require('csv-parser');
const serviceAccount = require('./serviceAccountKey.json'); 

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const resultados = [];

console.log("⏳ Leyendo el archivo CSV y limpiando datos...");
fs.createReadStream('inventario.csv')
  // Esta línea limpia los nombres de las columnas (quita espacios o saltos de línea invisibles)
  .pipe(csv({ mapHeaders: ({ header }) => header.trim() }))
  .on('data', (data) => {
    resultados.push(data);
  })
  .on('end', async () => {
    console.log(`✅ Se leyeron ${resultados.length} filas. Preparando subida a Firestore...`);
    
    const batch = db.batch();
    const coleccionRef = db.collection('productos'); 

    // Precios por producto en pesos colombianos
    const precios = {
      // Importadas
      A001: 8000,   // Corona
      A002: 8500,   // Corona cero
      A003: 6000,   // Coronita
      A004: 9000,   // Heineken
      A005: 9000,   // Heineken cero
      A006: 7500,   // Budweiser
      A007: 10000,  // Michelob
      A008: 9500,   // Duff
      A009: 14000,  // Erdinger Weissbier
      A010: 14000,  // Erdinger Dunkel
      A011: 15000,  // Erdinger Pikantus
      A012: 14000,  // Paulaner Weisbier
      A013: 8000,   // 8.6
      A014: 12000,  // Peroni
      A015: 13000,  // Liefmans
      A016: 18000,  // Gulden Drak
      A017: 15000,  // Innins & guns
      A018: 8000,   // Modelo
      A019: 10000,  // Cusqueña
      A020: 13000,  // Asahi
      A021: 16000,  // Duvel
      A022: 9000,   // Baltika
      A023: 11000,  // Weidman
      A024: 10000,  // Grolsch
      A025: 14000,  // Trooper
      A026: 14000,  // Ac dc
      A027: 9000,   // Stella
      // Artesanales
      B001: 12000,  // Tres cordilleras
      B002: 11000,  // Bruder
      B003: 11000,  // Santo beer
      // Vodka
      C001: 85000,  // Absolut
      C002: 75000,  // Smirnoff No 21
      C003: 78000,  // Smirnoff tamarindo
      C004: 78000,  // Smirnoff lulo
      C005: 8000,   // Smirnoff ice (lata)
      C006: 8000,   // Smirnoff Apple (lata)
      C007: 60000,  // Like
      // Varios
      D001: 9000,   // Cuates
      D002: 12000,  // Four Loko
      // Sin Alcohol
      E001: 4500,   // Coca cola
      E002: 3500,   // Colombiana
      E003: 4000,   // Quatro
      E004: 4500,   // Canadá dry
      E005: 3000,   // Agua
      E006: 5000,   // Mr tea
      E007: 5500,   // Gatorade
      E008: 4500,   // Vive 100
      E009: 3500,   // Pony malta
      E010: 5000,   // Electrolite
      E011: 7000,   // Soda hatsu
      E012: 7000,   // Tea hatsu
      E013: 8500,   // Monster
      E014: 9000,   // Red Bull
    };

    resultados.forEach((item) => {
      const idDoc = item.ID ? item.ID.trim() : null;
      
      if (idDoc) {
        const producto = {
          nombre: item.Nombre ? item.Nombre.trim() : "Sin nombre",
          categoria: item.Categoria ? item.Categoria.trim() : "Sin categoría",
          precio: precios[idDoc] || Number(item.Precio) || 0,
          stock: Number(item.Stock) || 0,
          vendidos: Number(item.Vendidos) || 0
        };

        const docRef = coleccionRef.doc(idDoc);
        batch.set(docRef, producto);
      }
    });

    try {
      await batch.commit();
      console.log("🚀 ¡Éxito total! Todos los productos se subieron a Firestore.");
    } catch (error) {
      console.error("❌ Error al subir los datos:", error);
    }
  });