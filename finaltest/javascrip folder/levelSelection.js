// levelSelection.js
const sidebar = document.querySelector('.nav-sidebar');
const hamburger = document.querySelector('.hamburger1');
const closeBtn = document.querySelector('.close-btn');
const navHeader = document.getElementById('navHeader');
const levelsContainer = document.getElementById('levelsContainer');
const pathCards = {
    beginner: document.getElementById('beginnerCard'),
    intermediate: document.getElementById('intermediateCard'),
    advanced: document.getElementById('advancedCard')
};

const levelsData = {
    beginner: Array.from({ length: 15 }, (_, i) => `Level ${i + 2}`),
    intermediate: Array.from({ length: 19 }, (_, i) => `Level ${i + 17}`),
    advanced: Array.from({ length: 15 }, (_, i) => `Level ${i + 36}`)
};

// Total questions for each path
const totalQuestions = {
    beginner: 150, // 15 levels * 10 questions each
    intermediate: 190, // 19 levels * 10 questions each
    advanced: 150 // 15 levels * 10 questions each
};

// Function to calculate progress for a path
function calculateProgress(path) {
    let totalCorrect = 0;
    levelsData[path].forEach(level => {
        const levelNumber = level.split(' ')[1];
        const score = parseInt(localStorage.getItem(`level_${levelNumber}_score`)) || 0;
        totalCorrect += score;
    });
    return (totalCorrect / totalQuestions[path]) * 100;
}

// Function to store progress data in localStorage
function storeProgressData() {
    const progressData = {
        beginner: calculateProgress('beginner'),
        intermediate: calculateProgress('intermediate'),
        advanced: calculateProgress('advanced')
    };
    localStorage.setItem('learningProgress', JSON.stringify(progressData));
}

// Update progress bars and store progress data when the page loads
function updateProgressBars() {
    const beginnerProgress = calculateProgress('beginner');
    const intermediateProgress = calculateProgress('intermediate');
    const advancedProgress = calculateProgress('advanced');

    document.getElementById('beginnerProgress').style.width = `${beginnerProgress}%`;
    document.getElementById('intermediateProgress').style.width = `${intermediateProgress}%`;
    document.getElementById('advancedProgress').style.width = `${advancedProgress}%`;

    storeProgressData();
}

// Call updateProgressBars when the page loads
updateProgressBars();

function updateSidebar(path) {
    navHeader.textContent = `${path.charAt(0).toUpperCase() + path.slice(1)} Path`;
    levelsContainer.innerHTML = levelsData[path].map(level => {
        const levelNumber = level.split(' ')[1];
        const totalQuestions = 10; // Assuming each level has 10 questions
        const score = localStorage.getItem(`level_${levelNumber}_score`) || 0;

        return `
            <div class="difficulty-section">
                <ul class="nav-levels">
                    <li class="nav-item" onclick="openQuizPage('${level}')">
                        ${level} (${score}/${totalQuestions})
                    </li>
                </ul>
            </div>
        `;
    }).join('');
}

function toggleSidebar(path) {
    sidebar.classList.toggle('active');
    if (path) {
        updateSidebar(path);
    }
}

function openQuizPage(level) {
    const levelNumber = level.split(' ')[1];
    window.location.href = `quiz.html?level=${levelNumber}`;
}

hamburger.addEventListener('click', () => toggleSidebar());
closeBtn.addEventListener('click', () => toggleSidebar());

Object.entries(pathCards).forEach(([path, card]) => {
    card.addEventListener('click', () => toggleSidebar(path));
});

document.addEventListener('click', (event) => {
    if (!sidebar.contains(event.target) && 
        !hamburger.contains(event.target) &&
        !Object.values(pathCards).some(card => card.contains(event.target))) {
        sidebar.classList.remove('active');
    }
});