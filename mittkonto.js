import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

 // 1. Supabase setup
    const supabaseUrl = 'https://oecugjtyhjhpthtzlmvb.supabase.co'; // Ersätt med din Supabase URL
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lY3VnanR5aGpocHRodHpsbXZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2ODY3MDIsImV4cCI6MjA0NzI2MjcwMn0.7xXoi8Yt2o_YGhh17lT8cWsIIDAM6aoA-nVG5H3TdIE'; // Ersätt med din Supabase public API key
    const supabase = createClient(supabaseUrl, supabaseKey);
    
// Logga ut användaren med getElementById
document.getElementById('logout-button').addEventListener('click', async () => {
    localStorage.removeItem('userSession'); // Ta bort sessionen från localStorage
    window.location.href = 'index.html'; // Omdirigera till login-sidan efter logout
}); 

// Kontrollera om sessionen finns och om användaren är inloggad
function checkSession() {
    const session = JSON.parse(localStorage.getItem('userSession'));

    if (!session) {
        // Om ingen session finns, omdirigera till login
        window.location.href = 'index.html';
        return;
    } 
    console.log('Inloggad som:', session.username);
    document.getElementById('username').innerText = session.username; // Visa användarnamn på sidan

}

// Kontrollera sessionen när sidan laddas
checkSession();









const avatarOptions = document.querySelectorAll('.avatar-option');
let selectedAvatar = null;

// Markera vald avatar
avatarOptions.forEach(avatar => {
  avatar.addEventListener('click', () => {
    // Ta bort markeringsklassen från tidigare val
    avatarOptions.forEach(a => a.classList.remove('selected'));

    // Lägg till markeringsklassen på vald avatar
    avatar.classList.add('selected');
    selectedAvatar = avatar.getAttribute('data-avatar');
  });
});

// Hantera sparandet av avatar
document.getElementById('save-avatar').addEventListener('click', async () => {
  if (!selectedAvatar) {
    alert('Vänligen välj en avatar.');
    return;
  }

  try {
    // Hämta användarens ID från localStorage
    const userSession = JSON.parse(localStorage.getItem('userSession'));
    const userId = userSession.userId;

    // Uppdatera användarens avatar i databasen
    const { data, error } = await supabase
      .from('users')
      .update({ avatar: selectedAvatar })
      .eq('id', userId);

    if (error) throw error;

    alert('Din avatar har sparats!');
    // Uppdatera sidan
    location.reload();
  } catch (err) {
    console.error('Fel vid sparandet av avatar:', err.message);
    alert('Kunde inte spara avatar. Försök igen senare.');
  }
});






 



  








// Funktion för att uppdatera poäng och nivå
async function updatePointsAndLevel(points) {
  try {
    const userSession = JSON.parse(localStorage.getItem('userSession'));
    const userId = userSession.userId;

    // Hämta användarens nuvarande data
    const { data, error } = await supabase
      .from('users')
      .select('points, level')
      .eq('id', userId)
      .single();

    if (error) throw error;

    // Uppdatera poäng
    const newPoints = data.points + points;

    // Beräkna ny nivå baserat på poängen (varje 1000 poäng ger en nivå)
    const newLevel = Math.floor(newPoints / 1000); // Exempel: 1500 poäng ger Level 1, 2500 ger Level 2, etc.

    // Uppdatera användarens poäng och nivå i databasen om de har förändrats
    const { error: updateError } = await supabase
      .from('users')
      .update({ points: newPoints, level: newLevel })
      .eq('id', userId);

    if (updateError) throw updateError;

    console.log(`Poäng och nivå uppdaterade: ${newPoints} poäng, Level: ${newLevel}`);
  } catch (err) {
    console.error('Fel vid uppdatering av poäng och nivå:', err.message);
  }
}

// När sidan laddas, hämta användardata och uppdatera poäng och nivå om användaren tjänat nya poäng
document.addEventListener('DOMContentLoaded', async () => {
  const userSession = JSON.parse(localStorage.getItem('userSession'));
  const userId = userSession ? userSession.userId : null;

  if (userId) {
    try {
      // Hämta användarens nuvarande avatar, poäng och level
      const { data, error } = await supabase
        .from('users')
        .select('avatar, points, level')
        .eq('id', userId)
        .single();

      if (error) throw error;

      // Visa användarens avatar
      const avatarUrl = data.avatar ? `assets/avatars/${data.avatar}` : 'assets/avatars/avatar-default.png';
      document.getElementById('user-avatar').src = avatarUrl;

      // Visa användarens poäng och level
      document.getElementById('user-points').textContent = ` ${data.points || 0}`;
      document.getElementById('levelDisplay').textContent = ` ${data.level || 0}`;

      // Lägg till logik för att uppdatera poäng och nivå om användaren tjänat nya poäng
      const earnedPoints = 0; // Lägg till logik för att få poäng här om det behövs

      // Uppdatera poäng och nivå
      await updatePointsAndLevel(earnedPoints);

    } catch (err) {
      console.error('Fel vid hämtning av användardata:', err.message);
    }
  }
});




//ÄNDRA LÖSENORD
document.getElementById('change-password-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const session = JSON.parse(localStorage.getItem('userSession'));
    
    if (!session) {
        alert('Du måste vara inloggad för att byta lösenord');
        return;
    }

    const oldPassword = document.getElementById('old-password').value;
    const newPassword = document.getElementById('new-password').value;

    // Kontrollera om det gamla lösenordet stämmer
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.userId)
        .single();

    if (error || !data) {
        console.error('Användare inte hittad:', error ? error.message : 'Okänt fel');
        alert('Felaktigt användarnamn eller användare.');
        return;
    }

    const isOldPasswordCorrect = (oldPassword === data.password);  // Kontrollera om gamla lösenordet är korrekt
    if (!isOldPasswordCorrect) {
        console.error('Felaktigt gamla lösenordet');
        alert('Felaktigt gamla lösenordet');
        return;
    }

    // Om det gamla lösenordet stämmer, uppdatera med nytt lösenord
    const { updateData, updateError } = await supabase
        .from('users')
        .update({ password: newPassword })
        .eq('id', session.userId);

    if (updateError) {
        console.error('Fel vid lösenordsbyte:', updateError.message);
        alert('Det gick inte att byta lösenord. Försök igen.');
    } else {
        console.log('Lösenordet har ändrats');
        alert('Lösenordet har ändrats');
    }
});

// Kontrollera sessionen när sidan laddas
checkSession();