<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auth Test - Halali Meat</title>
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { color: #333; margin-top: 0; }
        button {
            background: #22c55e;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            width: 100%;
            margin-top: 20px;
        }
        button:hover { background: #16a34a; }
        #result {
            margin-top: 20px;
            padding: 15px;
            border-radius: 6px;
            white-space: pre-wrap;
            font-family: monospace;
            font-size: 13px;
        }
        .success { background: #d1fae5; border: 1px solid #22c55e; }
        .error { background: #fee2e2; border: 1px solid #ef4444; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔐 Authentication Test</h1>
        <p>Click the button below to test authentication with the production database.</p>
        
        <button onclick="testAuth()">Test Login (kuzzi@halalimeat.co.ke)</button>
        
        <div id="result"></div>
    </div>

    <script>
        async function testAuth() {
            const resultDiv = document.getElementById('result');
            resultDiv.textContent = '⏳ Testing authentication...';
            resultDiv.className = '';
            
            try {
                const response = await fetch('/api/test-auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: 'kuzzi@halalimeat.co.ke',
                        password: 'Kuzzi123!'
                    })
                });
                
                const data = await response.json();
                
                resultDiv.textContent = JSON.stringify(data, null, 2);
                resultDiv.className = data.passwordMatch ? 'success' : 'error';
                
                if (data.passwordMatch) {
                    setTimeout(() => {
                        alert('✅ Password is correct! The issue is with NextAuth. Redirecting to login page to try again...');
                        window.location.href = '/login';
                    }, 2000);
                } else {
                    alert('❌ Password mismatch detected. We need to reset the admin password.');
                }
                
            } catch (error) {
                resultDiv.textContent = 'Error: ' + error.message;
                resultDiv.className = 'error';
            }
        }
    </script>
</body>
</html>
