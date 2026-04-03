import httpx
client = httpx.Client(verify=False)
r = client.get('https://vtopcc.vit.ac.in/vtop/login/error')
with open('error2.html', 'w', encoding='utf-8') as f:
    f.write(r.text)
