const { createServer } = require('http');
const express = require('express');
const compression = require('compression');
const path = require('path');
const morgan = require('morgan');

const normalizedPort = port => parseInt(port, 10);

const PORT = normalizedPort(process.env.PORT || 5000);

const app = express();

const dev = app.get('env') !== 'production';

if (!dev) {
    // Reduce opportunity for security hole
    app.disable('x-powered-by');
    app.use(compression());
    app.use(morgan('common'));

    app.use(express.static(path.resolve(__dirname, 'build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
    });
}

if (dev) {
    app.use(morgan('dev'));
}

const server = createServer(app);

server.listen(PORT, err => {
    if (err) throw err;

    console.log('Server started!');
});

