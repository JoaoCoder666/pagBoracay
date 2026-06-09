const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Solo precios — no toca img, stock, ni ningún otro campo
const precios = {
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
  B001: 12000,  // Tres cordilleras
  B002: 11000,  // Bruder
  B003: 11000,  // Santo beer
  C001: 85000,  // Absolut
  C002: 75000,  // Smirnoff No 21
  C003: 78000,  // Smirnoff tamarindo
  C004: 78000,  // Smirnoff lulo
  C005: 8000,   // Smirnoff ice
  C006: 8000,   // Smirnoff Apple
  C007: 60000,  // Like
  D001: 9000,   // Cuates
  D002: 12000,  // Four Loko
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

async function actualizarPrecios() {
  console.log('⏳ Actualizando solo precios en Firestore...');
  const batch = db.batch();

  for (const [id, precio] of Object.entries(precios)) {
    const ref = db.collection('productos').doc(id);
    // update() solo modifica el campo precio, todo lo demás queda intacto
    batch.update(ref, { precio });
  }

  await batch.commit();
  console.log(`✅ Precios actualizados para ${Object.keys(precios).length} productos.`);
  console.log('📸 Las imágenes y el stock no fueron tocados.');
}

actualizarPrecios().catch(console.error);
