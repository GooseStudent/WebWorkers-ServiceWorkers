const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (ctx.method === 'OPTIONS') {
        ctx.status = 204;
        return;
    }
    await next();
});

app.use(async (ctx, next) => {
    if (ctx.path === '/api/posts') {
        console.log('Задержка 2 секунды...');
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    await next();
});

app.use(async (ctx) => {
    if (ctx.path === '/api/posts') {
        console.log('📡 Запрос к /api/posts');
        
        try {
            const https = require('https');
            
            const data = await new Promise((resolve, reject) => {
                https.get('https://jsonplaceholder.typicode.com/posts', (res) => {
                    let body = '';
                    res.on('data', chunk => body += chunk);
                    res.on('end', () => {
                        try {
                            resolve(JSON.parse(body));
                        } catch (e) {
                            reject(e);
                        }
                    });
                }).on('error', reject);
            });
            
            console.log(`Отправляем ${data.length} постов`);
            ctx.body = data;
            
        } catch (error) {
            console.error('Ошибка:', error.message);
            ctx.status = 500;
            ctx.body = { error: error.message };
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер: http://localhost:${PORT}`);
    console.log(`API: http://localhost:${PORT}/api/posts`);
});