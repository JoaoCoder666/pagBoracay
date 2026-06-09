const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Solo actualiza img y stock — no toca precio ni ningún otro campo
const datos = {
  // ── IMPORTADAS ──────────────────────────────────────────
  A001: { img: 'imagenes/corona.png',        stock: 24 },
  A002: { img: 'imagenes/coronacero.png',    stock: 12 },
  A003: { img: 'imagenes/coronita.png',      stock: 18 },
  A004: { img: 'imagenes/heineken.png',      stock: 30 },
  A005: { img: 'imagenes/heinekencero.png',  stock: 10 },
  A006: { img: 'imagenes/budweiser.png',     stock: 20 },
  A007: { img: 'imagenes/michelob.png',      stock: 8  },
  A008: { img: 'imagenes/duff.png',          stock: 14 },
  A009: { img: 'imagenes/weisbier.png',      stock: 16 },
  A010: { img: 'imagenes/dunkel.png',        stock: 10 },
  A011: { img: 'imagenes/pikantus.png',      stock: 8  },
  A012: { img: 'imagenes/paulaner.png',      stock: 12 },
  A013: { img: 'imagenes/8.6.png',           stock: 20 },
  A014: { img: 'imagenes/peroni.png',        stock: 14 },
  A015: { img: 'imagenes/liefmans.png',      stock: 10 },
  A016: { img: 'imagenes/GuldenDrak.png',    stock: 6  },
  A017: { img: 'imagenes/innins.png',        stock: 8  },
  A018: { img: 'imagenes/modelo.png',        stock: 22 },
  A019: { img: 'imagenes/cusquena.png',      stock: 16 },
  A020: { img: 'imagenes/asahi.png',         stock: 12 },
  A021: { img: 'imagenes/duvel.png',         stock: 6  },
  A022: { img: 'imagenes/baltika.png',       stock: 10 },
  A023: { img: 'imagenes/weidman.png',       stock: 8  },
  A024: { img: 'imagenes/grolsch.png',       stock: 14 },
  A025: { img: 'imagenes/trooper.png',       stock: 10 },
  A026: { img: 'imagenes/acdc.png',          stock: 8  },
  A027: { img: 'imagenes/stella.png',        stock: 18 },

  // ── ARTESANALES ─────────────────────────────────────────
  B001: { img: 'imagenes/cordillera.png',    stock: 20 },
  B002: { img: 'imagenes/bruder.png',        stock: 15 },
  B003: { img: 'imagenes/santobeer.png',     stock: 12 },

  // ── VODKA ───────────────────────────────────────────────
  C001: { img: 'imagenes/absoluto.png',      stock: 5  },
  C002: { img: 'imagenes/21.png',            stock: 6  },
  C003: { img: 'imagenes/tamarindo.png',     stock: 6  },
  C004: { img: 'imagenes/lulo.png',          stock: 6  },
  C005: { img: 'imagenes/ice.png',           stock: 24 },
  C006: { img: 'imagenes/apple.png',         stock: 20 },
  C007: { img: 'imagenes/like.png',          stock: 10 },

  // ── VARIOS ──────────────────────────────────────────────
  D001: { img: 'imagenes/cuates.png',        stock: 18 },
  D002: { img: 'imagenes/fourloko.png',      stock: 14 },

  // ── SIN ALCOHOL ─────────────────────────────────────────
  E001: { img: 'imagenes/cocacola.png',      stock: 30 },
  E002: { img: 'imagenes/colombiana.png',    stock: 28 },
  E003: { img: 'imagenes/quatro.png',        stock: 20 },
  E004: { img: 'imagenes/canada.png',        stock: 18 },
  E005: { img: 'imagenes/agua.png',          stock: 40 },
  E006: { img: 'imagenes/mrtea.png',         stock: 16 },
  E007: { img: 'imagenes/gatorade.png',      stock: 22 },
  E008: { img: 'imagenes/vive.png',          stock: 20 },
  E009: { img: 'imagenes/pony.png',          stock: 24 },
  E010: { img: 'imagenes/electrolit.png',    stock: 18 },
  E011: { img: 'imagenes/sodahatsu.png',     stock: 12 },
  E012: { img: 'imagenes/teahatsu.png',      stock: 12 },
  E013: { img: 'imagenes/monster.png',       stock: 20 },
  E014: { img: 'imagenes/redbull.png',       stock: 18 },
};

async function actualizarImagenesStock() {
  console.log('⏳ Actualizando imágenes y stock en Firestore...');
  const batch = db.batch();

  for (const [id, campos] of Object.entries(datos)) {
    const ref = db.collection('productos').doc(id);
    batch.update(ref, campos); // solo toca img y stock
  }

  await batch.commit();
  console.log(`✅ Imágenes y stock actualizados para ${Object.keys(datos).length} productos.`);
  console.log('💰 Los precios no fueron tocados.');
}

actualizarImagenesStock().catch(console.error);
