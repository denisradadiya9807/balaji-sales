const app = require('./app');

const PORT = process.env.PORT || 10000;
const HOST = '0.0.0.0'; // important for Render

app.listen(PORT, HOST, () => {
    console.log(`🚀 Server running on http://${HOST}:${PORT}`);
});
