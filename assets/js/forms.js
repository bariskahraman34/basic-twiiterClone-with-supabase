const SUPABASE_URL = 'https://cbpagjrvjcgkxqffdvsa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNicGFnanJ2amNna3hxZmZkdnNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ4OTkyNzgsImV4cCI6MjAzMDQ3NTI3OH0.otY3cxo-_MStdGztovq4RCXiXyMwYBB9tBGptWNdeJw';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const signupForm = document.querySelector('#signup-form');
const loginForm = document.querySelector('#login-form');
const container = document.querySelector('.container');

const handleAuthStateChange = async (event, session) => {
    console.log(event, session);
    if (event === 'SIGNED_IN') {
        let counter = 2;
        setInterval(() => {
            container.innerHTML = `<div class="redirect"><h3>Anasayfaya Yönlendiriliyorsunuz... ${counter}</h3></div>`;
            counter--;
        },800)
        setTimeout(() => {
            window.location.href = "index.html";
        },2000)
    }
};

const { data } = _supabase.auth.onAuthStateChange(handleAuthStateChange);

if(signupForm){
    signupForm.addEventListener('submit',async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formObj = Object.fromEntries(formData);
        const { data, error } = await _supabase.auth.signUp({
            email: formObj.email,
            password: formObj.password,
            options: {
              data: {
                username: formObj.username
              },
            },
          })
        console.log(formObj);
        console.log(data);
        if(!error){
            window.location.href = "/login.html";
        }else{
            console.log(error);
        }
    })
}

if(loginForm){
    loginForm.addEventListener('submit',async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formObj = Object.fromEntries(formData);
        const { data, error } = await _supabase.auth.signInWithPassword(formObj)
        if(data.session !== null){
            window.location.href = "/index.html"
        }
    })
}

