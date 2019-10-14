// #######################
// Puerto
// #######################

process.env.PORT = process.env.PORT || 3000;

// #######################
// SEED
// #######################

process.env.SEED = process.env.SEED || 'SEED-DESARROLLO';

// #######################
// CADUCIDAD
// #######################

process.env.CADUCIDAD = process.env.CADUCIDAD || '30d';


// #######################
// Base de datos
// #######################

process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cafe';