const { io } = require('../index');

const Bands = require('../models/bands');
const Band = require('../models/band');

const bands = new Bands();

bands.addBand( new Band('Queen') );
bands.addBand( new Band('Bon Jovi') );
bands.addBand( new Band('Heroes del Silencio') );
bands.addBand( new Band('Metalica') );
console.log(bands);

// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');
    // Enviar las bandas activas al cliente que se conecta
    client.emit('active-bands', bands.getBands()); 
    // client.emit('mensaje', { admin: 'Bienvenido al servidor' }); 

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    client.on('mensaje', (payload) => {
        console.log('mensaje', payload);
        io.emit('mensaje', { admin: 'Nuevo mensaje' });
    });

    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands()); // Emitir las bandas actualizadas a todos los clientes
    });

    client.on('add-band', (payload) => {
        const newBand = new Band(payload.name);
        bands.addBand(newBand);
        io.emit('active-bands', bands.getBands()); // Emitir las bandas actualizadas a todos los clientes
    });

    client.on('delete-band', (payload) => {
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands()); // Emitir las bandas actualizadas a todos los clientes
    });

    // client.on('emitir-mensaje', (payload) => {
    //     // console.log('Emitir mensaje', payload);
    //     // io.emit('nuevo-mensaje', payload); // emitee a todos
    //     client.broadcast.emit('nuevo-mensaje', payload); // emitee a todos menos al que lo envia
    // });


});

