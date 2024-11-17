import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';


    // 1. Supabase setup
    const supabaseUrl = 'https://oecugjtyhjhpthtzlmvb.supabase.co'; // Ersätt med din Supabase URL
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lY3VnanR5aGpocHRodHpsbXZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2ODY3MDIsImV4cCI6MjA0NzI2MjcwMn0.7xXoi8Yt2o_YGhh17lT8cWsIIDAM6aoA-nVG5H3TdIE'; // Ersätt med din Supabase public API key
    const supabase = createClient(supabaseUrl, supabaseKey);
    
  // Registrera användaren
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Kontrollera om användarnamnet redan finns
    const { data: existingUser, error: userCheckError, count } = await supabase
        .from('users')
        .select('username', { count: 'exact' }) // Lägg till count för att kontrollera antalet resultat
        .eq('username', username);

    if (userCheckError) {
        console.error('Fel vid användarkontroll:', userCheckError.message);
        alert('Ett fel inträffade. Försök igen senare.');
        return;
    }

    if (count > 0) { // Om det finns fler än 0 användare med samma användarnamn
        alert('Användarnamnet är redan taget. Välj ett annat.');
        return;
    }

    // Skapa användaren i tabellen och returnera den skapade användaren
    const { data, error } = await supabase
        .from('users')
        .insert([{ username, password }])
        .select() // Lägg till select() för att få tillbaka det insatta objektet
        .single(); // För att säkerställa att vi bara får en rad tillbaka (singel)

    if (error) {
        console.error('Fel vid skapande av användare:', error.message);
        alert('Det gick inte att skapa kontot. Försök igen senare.');
        return;
    }

    if (data) { // Om vi får tillbaka den skapade användaren
        console.log('Användare skapad:', data);

        // Skapa en session i localStorage
        localStorage.setItem('userSession', JSON.stringify({
            username: data.username,
            userId: data.id
        }));

        // Omdirigera till home efter registrering
        window.location.href = 'home.html';
    } else {
        console.error('Ingen användare skapades:', data);
        alert('Det gick inte att skapa användaren.');
    }
});