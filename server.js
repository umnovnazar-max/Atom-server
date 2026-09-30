const express = require('express');
const cors = require('cors');

const app = express();

// Разрешаем абсолютно любые запросы (CORS)
app.use(cors());
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Добавим главную страницу, чтобы не было "Cannot GET /"
app.get('/', (req, res) => {
    res.send('Atom Server is running successfully!');
});

app.post('/api/chat', async (req, res) => {
    try {
        if (!GROQ_API_KEY) {
            return res.status(500).json({ error: 'Ошибка: Переменная GROQ_API_KEY не задана на Render!' });
        }

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: req.body.messages
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data.error?.message || 'Ошибка Groq API' });
        }

        res.json(data);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера: ' + error.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
