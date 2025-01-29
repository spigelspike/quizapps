document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const userData = {
        name: document.getElementById('name').value,
        age: parseInt(document.getElementById('age').value)
    };

    // Store user data in sessionStorage
    sessionStorage.setItem('quizUserData', JSON.stringify(userData));

    // Redirect to quiz page
    window.location.href = 'quiz.html';
});