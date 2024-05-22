document.addEventListener('DOMContentLoaded', function () {
    const btn_login = document.getElementById('btn-login')

    btn_login.addEventListener('click', () => {
        const username = document.getElementById('username').value
        const password = document.getElementById('password').value

        if (username && password) {
            fetch('/login/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include' // This ensures cookies are included in the request
            })
            .then(response => response.text())
            .then(data => {
                if (data === 'Login successful') {
                    alert('Login successful')

                    window.location.href = '/subscription' // Redirect to desired page
                } else {
                    alert(data)
                }
            })
            .catch(error => {
                console.error('Error:', error)
                alert('Error logging in')
            });
        } else {
            alert('Please enter both username and password')
        }
    })


});