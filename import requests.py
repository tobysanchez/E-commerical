import requests

# معلومات بوت التليجرام
BOT_TOKEN = '7703103368:AAExgkSsLOG3kacdjc9YcmqcPwNOa6VG_uk'
CHAT_ID = '7063804804'

# الرسالة التي تريد إرسالها
message = '🚀 هذه رسالة تجريبية من Python!'

# رابط API التليجرام
url = f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage'

# إرسال الرسالة
response = requests.post(url, json={'chat_id': CHAT_ID, 'text': message})

# التحقق من نجاح العملية
if response.status_code == 200:
    print('✅ تم الإرسال بنجاح!')
else:
    print('❌ حدث خطأ:', response.text)
