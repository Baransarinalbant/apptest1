import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

 // 1. Supabase setup
    const supabaseUrl = 'https://oecugjtyhjhpthtzlmvb.supabase.co'; // Ersätt med din Supabase URL
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lY3VnanR5aGpocHRodHpsbXZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2ODY3MDIsImV4cCI6MjA0NzI2MjcwMn0.7xXoi8Yt2o_YGhh17lT8cWsIIDAM6aoA-nVG5H3TdIE'; // Ersätt med din Supabase public API key
    const supabase = createClient(supabaseUrl, supabaseKey);// Funktion för att hämta och visa leaderboard


    
async function displayLeaderboard() {
    try {
      // Hämta alla användare och deras poäng från databasen
      const { data, error } = await supabase
        .from('users')
        .select('id, username, points, avatar') // Hämta användarens id, namn, poäng och avatar
        .order('points', { ascending: false }); // Sortera efter poäng i fallande ordning
  
      if (error) throw error;
  
      // Skapa en leaderboard lista
      const leaderboardElement = document.getElementById('leaderboard'); // Elementet där leaderboarden ska visas
  
      // Töm leaderboard innan vi fyller på
      leaderboardElement.innerHTML = '';
  
      // Loopa genom alla användare och skapa listobjekt
      data.forEach((user, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add('leaderboard-item'); // Lägg till CSS-klass för styling om du vill
  
        // Skapa en sträng för att visa användarens info
        listItem.innerHTML = `
          <img src="assets/avatars/${user.avatar || 'default.png'}" alt="Avatar" class="avatar">
          <span class="rank">#${index + 1}</span>
          <span class="username">${user.username}</span>
          <span class="points">${user.points} poäng</span>
        `;
  
        // Lägg till listobjektet i leaderboarden
        leaderboardElement.appendChild(listItem);
      });
    } catch (err) {
      console.error('Fel vid hämtning av leaderboard:', err.message);
    }
  }
  
  // När sidan laddas, hämta och visa leaderboard
  document.addEventListener('DOMContentLoaded', displayLeaderboard);
  