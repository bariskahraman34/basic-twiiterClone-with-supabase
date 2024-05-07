const SUPABASE_URL = 'https://cbpagjrvjcgkxqffdvsa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNicGFnanJ2amNna3hxZmZkdnNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ4OTkyNzgsImV4cCI6MjAzMDQ3NTI3OH0.otY3cxo-_MStdGztovq4RCXiXyMwYBB9tBGptWNdeJw';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const signOut = document.querySelector('#logout');

document.addEventListener('DOMContentLoaded',async () => {
    const { data, error } = await _supabase.auth.getSession();
    if(data.session === null){
        window.location.href = "/login.html";
    }
})

if(signOut){
    signOut.addEventListener('click',async () => {
        const { error } = await _supabase.auth.signOut();
        window.location.href = "/login.html"
        console.log(error);
    })
}