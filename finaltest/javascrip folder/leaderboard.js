document.addEventListener('DOMContentLoaded', () => {
      // Retrieve leaderboard data from localStorage
      const leaderboardData = JSON.parse(localStorage.getItem('leaderboardData')) || [
        { rank: 1, name: "John Doe", points: 1500, level: 50, accuracy: 95, badges: ["🏆 Quiz Master"] },
        { rank: 2, name: "Jane Smith", points: 1400, level: 45, accuracy: 88, badges: ["✅ Intermediate Pro", "👑 Top Performer"] },
        { rank: 3, name: "Alice Johnson", points: 1350, level: 42, accuracy: 92, badges: [] },
      ];

      const badges = [
        { title: "🏆 Quiz Master", description: "Awarded for completing all 50 levels of the quiz game." },
        { title: "✅ Beginner Challenger", description: "Awarded for completing all beginner levels." },
        { title: "🔥 Intermediate Pro", description: "Earned for completing all intermediate levels." },
        { title: "📢 Social Sharer", description: "Earned by sharing your leaderboard position on social media." },
        { title: "🎯 Accuracy Master", description: "Awarded for maintaining an accuracy rate of 90% or higher." },
      ];

      const leaderboardContainer = document.getElementById('leaderboardData');
      const badgesContainer = document.querySelector('.badges');

      // Populate leaderboard
      leaderboardData.forEach(player => {
        const tr = document.createElement('tr');

        // Award "Accuracy Master" badge if accuracy is 90% or higher
        if (player.accuracy >= 90 && !player.badges.includes("🎯 Accuracy Master")) {
          player.badges.push("🎯 Accuracy Master");
        }

        tr.innerHTML = `
          <td>${player.rank}</td>
          <td>${player.name}</td>
          <td>${player.points}</td>
          <td>${player.level}</td>
          <td>${player.accuracy}%</td>
          <td>${player.badges.length ? player.badges.join(", ") : "No badges yet"}</td>
        `;
        leaderboardContainer.appendChild(tr);
      });

      // Populate badges
      badges.forEach(badge => {
        const badgeDiv = document.createElement('div');
        badgeDiv.classList.add('badge');
        badgeDiv.innerHTML = `
          <h3>${badge.title}</h3>
          <p>${badge.description}</p>
          ${badge.title === "🎯 Accuracy Master" ? "" : ""}
        `;
        badgesContainer.appendChild(badgeDiv);
      });
    });

    function share(platform) {
      alert(`Sharing on ${platform}!`);
    }