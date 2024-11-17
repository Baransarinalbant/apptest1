import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';


    // 1. Supabase setup
    const supabaseUrl = 'https://oecugjtyhjhpthtzlmvb.supabase.co'; // Ersätt med din Supabase URL
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lY3VnanR5aGpocHRodHpsbXZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2ODY3MDIsImV4cCI6MjA0NzI2MjcwMn0.7xXoi8Yt2o_YGhh17lT8cWsIIDAM6aoA-nVG5H3TdIE'; // Ersätt med din Supabase public API key
    const supabase = createClient(supabaseUrl, supabaseKey);

   // Inloggningslogik
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Kontrollera om användaren finns i databasen
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

    if (error || !data) {
        console.error('Användare inte funnen:', error ? error.message : 'Okänt fel');
        alert('Felaktigt användarnamn eller lösenord');
        return;
    }

    // Kontrollera lösenordet
    const isPasswordCorrect = (password === data.password);  // Här jämför vi lösenord direkt, använd bcrypt i en riktig applikation!

    if (isPasswordCorrect) {
        console.log('Lösenord är korrekt.');

        // Skapa session i localStorage
        localStorage.setItem('userSession', JSON.stringify({
            username: data.username,
            userId: data.id
        }));

        // Omdirigera till home
        window.location.href = 'home.html';
    } else {
        console.error('Felaktigt lösenord');
        alert('Felaktigt användarnamn eller lösenord');
    }

    
});

