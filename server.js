const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;

app.use(bodyParser.json());

// كود الـ HTML الكامل مع خط الرقعة والافتتاحية 3D مدمج داخل السيرفر
const fullHtmlPage = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>منصة هاشم التاريخية | مستر خالد هاشم</title>
    <link rel="preconnect" href="https://googleapis.com">
    <link rel="preconnect" href="https://gstatic.com" crossorigin>
    <link href="https://googleapis.com/css2?family=Aref+Ruqaa:wght@700&display=swap" rel="stylesheet">
    <style>
        :root { --primary: #cda250; --dark: #111111; --light: #f4f4f4; --white: #ffffff; --ruqaa: 'Aref Ruqaa', serif; }
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; }
        body { background-color: var(--light); color: var(--dark); overflow-x: hidden; }
        #intro-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle, #222 0%, #000 100%); z-index: 9999; display: flex; flex-direction: column; justify-content: center; align-items: center; }
        .general-title-3d { font-family: var(--ruqaa); font-size: 90px; color: var(--primary); text-align: center; text-shadow: 0 1px 0 #997837, 0 2px 0 #886a30, 0 3px 0 #775c29, 0 4px 0 #664f22, 0 5px 0 #55411b, 0 6px 1px rgba(0,0,0,.1), 0 0 30px rgba(205, 162, 80, 0.6); animation: float 3s ease-in-out infinite; }
        .intro-sub { color: #888; font-size: 18px; margin-top: 10px; }
        .skip-btn { margin-top: 40px; padding: 12px 35px; background: var(--primary); border: none; color: #000; font-weight: bold; border-radius: 30px; cursor: pointer; font-size: 16px; box-shadow: 0 4px 15px rgba(205, 162, 80, 0.4); }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        header { background-color: #111; color: var(--white); padding: 25px; text-align: center; border-bottom: 4px solid var(--primary); }
        header h1 { font-family: var(--ruqaa); color: var(--primary); font-size: 45px; }
        .container { max-width: 1200px; margin: 20px auto; padding: 0 20px; margin-bottom: 100px; }
        .timeline { position: relative; border-right: 3px solid var(--primary); margin: 20px 10px; padding: 10px 0; }
        .timeline-item { position: relative; margin-bottom: 30px; padding-right: 30px; cursor: pointer; }
        .timeline-content { background: var(--white); padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .details { display: none; margin-top: 10px; padding-top: 10px; border-top: 1px dashed #ccc; color: #555; }
        #chat-widget { position: fixed; bottom: 20px; left: 20px; width: 350px; background: var(--white); border-radius: 12px; box-shadow: 0 5px 25px rgba(0,0,0,0.2); border: 2px solid var(--primary); display: flex; flex-direction: column; z-index: 1000; overflow: hidden; }
        .chat-header { background: #111; color: var(--primary); padding: 15px; font-weight: bold; font-family: var(--ruqaa); font-size: 18px; }
        .chat-body { height: 250px; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; background: #f9f9f9; }
        .msg { padding: 10px 12px; border-radius: 8px; max-width: 80%; }
        .msg.bot { background: #e9e9e9; align-self: flex-start; }
        .msg.user { background: var(--primary); color: #000; align-self: flex-end; }
        .chat-footer { display: flex; border-top: 1px solid #ddd; padding: 10px; }
        .chat-footer input { flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px; outline: none; }
        .chat-footer button { background: #111; color: var(--primary); border: none; padding: 0 15px; border-radius: 4px; cursor: pointer; }
    </style>
</head>
<body>
    <div id="intro-overlay">
        <div class="general-title-3d">الجنرال</div>
        <div class="intro-sub">مستر خالد هاشم - تاريخ الصف الثاني الثانوي</div>
        <button class="skip-btn" onclick="closeIntro()">دخول منصة التاريخ 🏛️</button>
    </div>
    <header><h1>منصة هاشم التاريخية</h1><p>التاريخ ليس للحفظ.. التاريخ عقل يفكر ويحلل</p></header>
    <div class="container">
        <h2>📍 خريطة الزمن التفاعلية</h2>
        <div class="timeline">
            <div class="timeline-item" onclick="toggleDetails()">
                <div class="timeline-content">
                    <h3>الحملة الفرنسية على مصر (1798 م)</h3>
                    <div id="event1" class="details"><p>تحليل البكالوريا: نابليون جاء لضرب اقتصاد إنجلترا في الهند.</p></div>
                </div>
            </div>
        </div>
    </div>
    <div id="chat-widget">
        <div class="chat-header">🤖 مساعد الجنرال الذكي</div>
        <div class="chat-body" id="chat-body"><div class="msg bot">مرحباً بك! أنا مساعد مستر خالد هاشم. اسألني أي سؤال في التاريخ!</div></div>
        <div class="chat-footer">
            <input type="text" id="chat-input" placeholder="اكتب سؤالك هنا..." onkeypress="if(event.key==='Enter') sendMessage()">
            <button onclick="sendMessage()">إرسال</button>
        </div>
    </div>
    <script>
        function closeIntro() { document.getElementById('intro-overlay').style.display = 'none'; }
        function toggleDetails() { const el = document.getElementById('event1'); el.style.display = el.style.display === 'block' ? 'none' : 'block'; }
        function sendMessage() {
            const input = document.getElementById('chat-input'); const query = input.value.trim(); if (!query) return;
            appendMessage(query, 'user'); input.value = '';
            fetch('/api/chatbot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: query }) })
            .then(res => res.json()).then(data => appendMessage(data.reply, 'bot'));
        }
        function appendMessage(text, sender) {
            const body = document.getElementById('chat-body'); const msgDiv = document.createElement('div');
            msgDiv.className = 'msg ' + sender; msgDiv.innerHTML = text; body.appendChild(msgDiv); body.scrollTop = body.scrollHeight;
        }
    </script>
</body>
</html>
`;

// تشغيل الصفحة مباشرة من السيرفر بدون ملفات خارجية
app.get('/', (req, res) => {
    res.send(fullHtmlPage);
});

app.post('/api/chatbot', (req, res) => {
    const userMessage = req.body.message ? req.body.message.toLowerCase() : '';
    let botReply = "أهلاً بك في منصة الجنرال. اسألني عن المنهج.";
    if (userMessage.includes('فرنسيه') || userMessage.includes('فرنسية')) {
        botReply = "💡 **تحليل الجنرال للحملة الفرنسية:** نابليون جاء لضرب اقتصاد إنجلترا في الهند بطريقة غير مباشرة عبر مصر.";
    } else if (userMessage.includes('محمد علي')) {
        botReply = "🏛️ **تحليل الجنرال لتولية محمد علي:** أول صك اجتماعي في تاريخ مصر الحديث باختيار الشعب عام 1805.";
    }
    res.json({ reply: botReply });
});

app.listen(PORT, () => {
    console.log(`✅ السيرفر شغال تمام جداً!`);
    console.log(`👉 افتح المتصفح واكتب هذا الرابط بدقة: http://localhost:5000`);
});
