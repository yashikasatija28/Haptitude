// js/app.js - MindBloom Core Application Logic
// Jaipur Engineering College and Research Centre (JECRC)

function generateUID() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function showNotification(message, type) {
    type = type || 'is-info';
    var id = 'notif-' + Date.now();
    var html = '<div class="notification ' + type + ' notification-toast" id="' + id + '">' +
        '<button class="delete" onclick="document.getElementById(\'' + id + '\').remove()"></button>' +
        message + '</div>';
    var container = document.getElementById('notification-container');
    if (container) {
        container.insertAdjacentHTML('beforeend', html);
        setTimeout(function () {
            var el = document.getElementById(id);
            if (el) el.remove();
        }, 4000);
    }
}

function checkAuth() {
    var user = JSON.parse(localStorage.getItem('currentUser'));
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (!user && currentPage !== 'login.html') {
        window.location.href = 'login.html';
        return false;
    }
    if (user) {
        var greetingEl = document.getElementById('user-greeting');
        if (greetingEl) {
            var greeting = user.role === 'student' ? 'Hi, ' + user.name + '! 👋' : 'Welcome, ' + user.role + '! 👋';
            greetingEl.textContent = greeting;
        }
    }
    return true;
}

function logout() {
    localStorage.removeItem('currentUser');
    showNotification('Logged out successfully! 👋', 'is-info');
    setTimeout(function () { window.location.href = 'login.html'; }, 1000);
}

function saveQuizResult(result) {
    var allResults = JSON.parse(localStorage.getItem('allQuizResults') || '[]');
    allResults.push(result);
    localStorage.setItem('allQuizResults', JSON.stringify(allResults));
}

function saveSurveyResult(result) {
    var allResults = JSON.parse(localStorage.getItem('allQuizResults') || '[]');
    allResults.push(result);
    localStorage.setItem('allQuizResults', JSON.stringify(allResults));
}

function getAggregateStats() {
    var allResults = JSON.parse(localStorage.getItem('allQuizResults') || '[]');
    var schoolsSet = {}, statesSet = {};
    allResults.forEach(function (r) {
        if (r.school) schoolsSet[r.school] = true;
        if (r.state) statesSet[r.state] = true;
    });
    var totalStudents = allResults.length;
    var avgScore = allResults.length > 0 ?
        Math.round(allResults.reduce(function (sum, r) { return sum + (r.overallPercentage || 0); }, 0) / allResults.length) : 0;
    return {
        totalStudents: totalStudents || 25,
        totalSchools: Math.max(Object.keys(schoolsSet).length, 3),
        totalStates: Math.max(Object.keys(statesSet).length, 3),
        avgScore: avgScore || 72
    };
}

var dailyTips = [
    "🌟 Start your day with a smile! Smiling can actually make you feel happier.",
    "💧 Drink a glass of water first thing in the morning. Your brain needs it!",
    "🤗 Give someone a hug today. Hugs release happy chemicals in your brain!",
    "🎨 Try something creative today - draw, paint, write, or build something!",
    "🏃 Move your body for at least 30 minutes today. Your mind will thank you!",
    "📝 Write down one thing you're proud of. You're doing better than you think!",
    "🌿 Spend some time outside in nature. Fresh air is good for your soul!",
    "👂 Be a good listener today. Sometimes people just need someone to listen.",
    "🎵 Listen to your favorite song and sing along. Music heals!",
    "😴 Get enough sleep tonight. Your brain needs 8-10 hours to recharge!",
    "🤝 Do something kind for someone without expecting anything in return.",
    "📚 Learn something new today. Your brain loves new challenges!",
    "🧘 Take 5 deep breaths right now. In through your nose, out through your mouth.",
    "🌈 After every storm, there's a rainbow. Tough times don't last forever!",
    "💪 You are stronger than you think. Believe in yourself!"
];

function loadDailyTip() {
    var today = new Date().getDate();
    var tip = dailyTips[today % dailyTips.length];
    var el = document.getElementById('daily-tip');
    if (el) el.textContent = tip;
}
