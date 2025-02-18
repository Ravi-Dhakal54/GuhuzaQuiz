document.addEventListener("DOMContentLoaded", function() {
    // Retrieve progress data from localStorage
    const progressData = JSON.parse(localStorage.getItem('learningProgress')) || {
        beginner: 0,
        intermediate: 0,
        advanced: 0
    };
    
    // Calculate the average progress
    const averageProgress = (
        progressData.beginner + 
        progressData.intermediate + 
        progressData.advanced
    ) / 3;

    const progressCircle = document.querySelector('.progress-circle');
    const progressPercent = document.querySelector('.progress-percent');
    const progressText = document.getElementById('progressText');
    let currentProgress = 0;

    const updateProgress = () => {
        if(currentProgress < averageProgress) {
            currentProgress += 0.5;
            progressCircle.style.background = `conic-gradient(
                #6c5ce7 ${currentProgress}%,
                #8e44ad ${currentProgress}%,
                #e0e0e0 ${currentProgress}%
            )`;
            progressPercent.textContent = `${Math.round(currentProgress)}%`;
            requestAnimationFrame(updateProgress);
        }
    };

    // Rest of the code remains the same...

            setTimeout(() => {
                updateProgress();
                if(averageProgress > 0) {
                    progressText.innerHTML = `
                        <strong>${averageProgress.toFixed(1)}% Complete!</strong>
                        ${getMotivationalMessage(averageProgress)}
                    `;
                }
            }, 500);

            function getMotivationalMessage(progress) {
                if(progress < 25) return "Keep going! Every step counts! 💪";
                if(progress < 50) return "You're getting there! Stay motivated! 🔥";
                if(progress < 75) return "Amazing progress! Keep pushing! 🚀";
                return "Almost there! You're crushing it! 🎯";
            }

            progressCircle.addEventListener('mouseenter', () => {
                progressCircle.style.transform = 'rotate(360deg)';
                progressCircle.style.transition = 'transform 1.5s ease-in-out';
            });

            progressCircle.addEventListener('mouseleave', () => {
                progressCircle.style.transform = 'rotate(0deg)';
                progressCircle.style.transition = 'transform 0.5s ease-in-out';
            });
        });