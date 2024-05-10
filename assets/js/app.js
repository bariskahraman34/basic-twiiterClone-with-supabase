const SUPABASE_URL = 'https://cbpagjrvjcgkxqffdvsa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNicGFnanJ2amNna3hxZmZkdnNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ4OTkyNzgsImV4cCI6MjAzMDQ3NTI3OH0.otY3cxo-_MStdGztovq4RCXiXyMwYBB9tBGptWNdeJw';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const signOut = document.querySelector('#log-out-btn');
const userContainer = document.querySelector('.user-container');
const textarea = document.querySelector('#textarea');
const postsContainer = document.querySelector('.posts');
const userPostForm = document.querySelector('#user-post-form');

function setNewSize() {
   this.style.height = "1px";
   this.style.height = this.scrollHeight + "px";
}
textarea.addEventListener('keyup', setNewSize);
userPostForm.addEventListener('submit',(e) => sendPost(e));

function createCreatedAt(){
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
    const day = (date.getDate()) < 10 ?  `0${date.getDate()}` : `${date.getDate()}`;
    const created_at = `${year}-${month}-${day}`;
    return created_at;
}

async function insertData(from,entries){
    const { data, error } = await _supabase
    .from(from)
    .insert(entries)
    .select()
    return listPosts();
}

async function sendPost(e){
    e.preventDefault();
    const entries = [];
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);
    const userSession = await getLoggedUser();
    entries.push({content:formObj.post,user_id:userSession.session.user.id,likes:0,username:userSession.session.user.user_metadata.username,created_at:createCreatedAt()});
    insertData("posts",entries);
    e.target.reset();
}

document.addEventListener('DOMContentLoaded',async () => {
    const { data, error } = await _supabase.auth.getSession();
    if(data.session === null){
        return window.location.href = "/login.html";
    }
})

if(signOut){
    signOut.addEventListener('click',async () => {
        const { error } = await _supabase.auth.signOut();
        window.location.href = "/login.html"
    })
}

async function getData(tableName){
    const { data, error } = await _supabase.from(`${tableName}`).select()
    if(error){
        return error
    }
    return data
}

async function getLoggedUser(){
    const { data, error } = await _supabase.auth.getSession();
    return data;
}


async function listPosts(){
    const posts = await getData("posts");
    const replies = await getData("replies");
    const userSession = await getLoggedUser();
    userContainer.innerHTML = `<h3>Hoşgeldin @${userSession.session.user.user_metadata.username}!</h3>`;
    postsContainer.innerHTML = "<h3>Gönderiler</h3>";
    if(posts.length > 0){
        posts.sort(function(a,b){
            return b.id - a.id;
        })
        posts.forEach(post => {
            postsContainer.innerHTML += 
            `
            <div class="post-container" data-commentid="${post.id}">
                <div class="post">
                    <div class="comment-rating">
                        <a href="#" class="comment-rating-btn" data-commentid="${post.id}" data-value="up">
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                                <path d="M6.33018 10.896C6.46674 10.896 6.58468 10.8463 6.684 10.747C6.78331 10.6477 6.83297 10.5298 6.83297 10.3932V7.004H10.1477C10.2842 7.004 10.4022 6.95434 10.5015 6.85503C10.6008 6.75571 10.6505 6.63777 10.6505 6.50121V5.27216C10.6505 5.1356 10.6008 5.01766 10.5015 4.91834C10.4022 4.81903 10.2842 4.76937 10.1477 4.76937H6.83297V1.39879C6.83297 1.26223 6.78331 1.14429 6.684 1.04497C6.58468 0.945655 6.46674 0.895996 6.33018 0.895996H4.91491C4.77835 0.895996 4.66041 0.945655 4.56109 1.04497C4.46177 1.14429 4.41212 1.26223 4.41212 1.39879V4.76937H1.07878C0.942221 4.76937 0.824282 4.81903 0.724965 4.91834C0.625647 5.01766 0.575989 5.1356 0.575989 5.27216V6.50121C0.575989 6.63777 0.625647 6.75571 0.724965 6.85503C0.824282 6.95434 0.942221 7.004 1.07878 7.004H4.41212V10.3932C4.41212 10.5298 4.46177 10.6477 4.56109 10.747C4.66041 10.8463 4.77835 10.896 4.91491 10.896H6.33018Z" fill="#C5C6EF"/>
                            </svg>
                        </a>
                        <strong>${post.likes ? post.likes : "0"}</strong>
                        <a href="#" class="comment-rating-btn" data-commentid="${post.id}" data-value="down">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="3" viewBox="0 0 10 3" fill="none">
                                <path d="M9.25591 2.66C9.46018 2.66 9.63659 2.60445 9.78515 2.49334C9.93371 2.38223 10.008 2.25028 10.008 2.0975V0.722504C10.008 0.569726 9.93371 0.437781 9.78515 0.32667C9.63659 0.215559 9.46018 0.160004 9.25591 0.160004H0.760085C0.555814 0.160004 0.379398 0.215559 0.230837 0.32667C0.082276 0.437781 0.00799561 0.569726 0.00799561 0.722504V2.0975C0.00799561 2.25028 0.082276 2.38223 0.230837 2.49334C0.379398 2.60445 0.555814 2.66 0.760085 2.66H9.25591Z" fill="#C5C6EF"/>
                            </svg>
                        </a>
                    </div>
                    <div class="comment-body">
                        <div class="comment-header">
                            <div class="profile-info">
                                <strong>@${userSession.session.user.id == post.user_id ? userSession.session.user.user_metadata.username : post.username}</strong>
                                ${userSession.session.user.id == post.user_id ? '<span class = "current-user">sen</span>' : ""}
                                    
                                <span>${post.created_at}</span>
                            </div>
                            <div class="btns-container">                            
                                <a href="#" class="reply-btn" data-commentid="${post.id}">
                                    <i class="fa-solid fa-reply"></i><span>Cevap Yaz</span>
                                </a>
                                ${userSession.session.user.id == post.user_id ? `<a href="#" data-commentid="${post.id}" class="del-btn post-del"><i class="fa-solid fa-trash-can"></i></a>`: ""}
                            </div>
                        </div>
                        <div class="content-container">
                        <p class="content" data-commentid="">${post.content}</p>
                        </div>
                    </div>
                </div>
                ${replies.map(reply => {
                    if(reply.post_id == post.id){
                        return`
                                <div class="replies-container">
                                    <div class="reply">
                                        <div class="comment-rating" data-replyid="${reply.id}">
                                            <a href="#" class="reply-rating-btn" data-value="up" data-replyid="${reply.id}">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                                                    <path d="M6.33018 10.896C6.46674 10.896 6.58468 10.8463 6.684 10.747C6.78331 10.6477 6.83297 10.5298 6.83297 10.3932V7.004H10.1477C10.2842 7.004 10.4022 6.95434 10.5015 6.85503C10.6008 6.75571 10.6505 6.63777 10.6505 6.50121V5.27216C10.6505 5.1356 10.6008 5.01766 10.5015 4.91834C10.4022 4.81903 10.2842 4.76937 10.1477 4.76937H6.83297V1.39879C6.83297 1.26223 6.78331 1.14429 6.684 1.04497C6.58468 0.945655 6.46674 0.895996 6.33018 0.895996H4.91491C4.77835 0.895996 4.66041 0.945655 4.56109 1.04497C4.46177 1.14429 4.41212 1.26223 4.41212 1.39879V4.76937H1.07878C0.942221 4.76937 0.824282 4.81903 0.724965 4.91834C0.625647 5.01766 0.575989 5.1356 0.575989 5.27216V6.50121C0.575989 6.63777 0.625647 6.75571 0.724965 6.85503C0.824282 6.95434 0.942221 7.004 1.07878 7.004H4.41212V10.3932C4.41212 10.5298 4.46177 10.6477 4.56109 10.747C4.66041 10.8463 4.77835 10.896 4.91491 10.896H6.33018Z" fill="#C5C6EF"/>
                                                </svg>
                                            </a>
                                            <strong class="like-counter">${reply.likes}</strong>
                                            <a href="#" class="reply-rating-btn" data-value="down" data-replyid="${reply.id}">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="3" viewBox="0 0 10 3" fill="none">
                                                    <path d="M9.25591 2.66C9.46018 2.66 9.63659 2.60445 9.78515 2.49334C9.93371 2.38223 10.008 2.25028 10.008 2.0975V0.722504C10.008 0.569726 9.93371 0.437781 9.78515 0.32667C9.63659 0.215559 9.46018 0.160004 9.25591 0.160004H0.760085C0.555814 0.160004 0.379398 0.215559 0.230837 0.32667C0.082276 0.437781 0.00799561 0.569726 0.00799561 0.722504V2.0975C0.00799561 2.25028 0.082276 2.38223 0.230837 2.49334C0.379398 2.60445 0.555814 2.66 0.760085 2.66H9.25591Z" fill="#C5C6EF"/>
                                                </svg>
                                            </a>
                                        </div>
                                        <div class="comment-body">
                                            <div class="comment-header">
                                                <div class="profile-info">
                                                    <div class="user-infos">                                              
                                                        <strong>@${reply.username}</strong>
                                                        ${userSession.session.user.id == reply.user_id ? '<span class = "current-user">sen</span>' : ""}
                                                        <span>${reply.created_at}</span>
                                                    </div>
                                                    <div class="right-side-container">
                                                        <div class="replying-to">
                                                            <span>Yanıtlandı:</span>
                                                            <strong>@${post.username}</strong>
                                                        </div>
                                                        <div class="del-reply">
                                                            ${userSession.session.user.id == reply.user_id ? `<a href="#" data-replyid="${reply.id}" class="del-btn reply-del"><i class="fa-solid fa-trash-can"></i></a>`: ""}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="content-container">
                                                <p class="content" data-commentid="">${reply.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `
                    }
                }).join('')}
                
            `;
        })
        const replyBtns = document.querySelectorAll('.reply-btn');
        const postBtns = document.querySelectorAll('.comment-rating-btn');
        const replyDelBtns = document.querySelectorAll('.reply-del');
        const postDelBtns = document.querySelectorAll('.post-del');
        postBtns.forEach(btn => btn.addEventListener('click',ratePost))
        replyBtns.forEach(btn => btn.addEventListener('click',createReplyForm));
        replyDelBtns.forEach(btn => btn.addEventListener('click',delReply));
        postDelBtns.forEach(btn => btn.addEventListener('click',delPost));
        const rateReplyBtns = document.querySelectorAll('.reply-rating-btn');
        rateReplyBtns.forEach(btn => btn.addEventListener('click',rateReply));
    }else{
        postsContainer.innerHTML = `<h3>Henüz burada gönderi bulunmuyor.</h3>`
    }
}

async function delReply(e){
    e.preventDefault();
    console.log(this.dataset.replyid);
    const confirmBtns = document.querySelectorAll('.confirm-btn');
    const overlay = document.querySelector('.overlay');
    overlay.classList.remove('d-none');
    confirmBtns.forEach(btn => btn.addEventListener('click', async () => {
        if(btn.value == "yes"){
            overlay.classList.add('d-none');
            const { error } = await _supabase
            .from('replies')
            .delete()
            .eq('id', Number(this.dataset.replyid));
            console.log(error);
            return listPosts();
        }else{
            overlay.classList.add('d-none');
            return;
        }
    }));
}

async function delPost(e){
    e.preventDefault();
    const confirmBtns = document.querySelectorAll('.confirm-btn');
    const overlay = document.querySelector('.overlay');
    overlay.classList.remove('d-none');
    confirmBtns.forEach(btn => btn.addEventListener('click', async () => {
        if(btn.value == "yes"){
            overlay.classList.add('d-none');
            const { error } = await _supabase
            .from('posts')
            .delete()
            .eq('id', Number(this.dataset.commentid));
            console.log(error);
            return listPosts();
        }else{
            overlay.classList.add('d-none');
            return;
        }
    }));
}

async function updateLikeData({tableName,value,eqCol,eqVal}){
    const { data , error } = await _supabase
    .from(tableName)
    .update({likes: value})
    .eq(eqCol, eqVal)
    .select()
    return listPosts();
}

async function rateReply(e){
    e.preventDefault();
    const replies = await getData("replies");
    if(this.dataset.value == "up"){
        updateLikeData({tableName:'replies',value:replies.find(reply => reply.id == this.dataset.replyid).likes + 1,eqCol:'id',eqVal:Number(this.parentElement.dataset.replyid)});
    }else{
        updateLikeData({tableName:'replies',value: replies.find(reply => reply.id == this.dataset.replyid).likes - 1,eqCol:'id',eqVal:Number(this.parentElement.dataset.replyid)});
    }
}

async function ratePost(e){
    e.preventDefault();
    const posts = await getData("posts");
    if(this.dataset.value == "up"){
        updateLikeData({tableName:'posts',value: posts.find(post => post.id == this.dataset.commentid).likes + 1,eqCol:'id',eqVal:Number(this.dataset.commentid)});
    }else{
        updateLikeData({tableName:'posts',value: posts.find(post => post.id == this.dataset.commentid).likes - 1,eqCol:'id',eqVal:Number(this.dataset.commentid)});
    }
}

function createReplyForm(e){
    e.preventDefault();
    const replyFormHTML =
    `
    <div class="new-reply-comment">
        <div class="new-comment reply-form">
            <form id="reply-form" data-commentid="${this.dataset.commentid}" required>
                <textarea required name="content" rows="3" required></textarea>
                <button>Gönder</button>
            </form>
        </div>
    </div>
    `;
    if(document.querySelector('.new-reply-comment')){
        document.querySelector('.new-reply-comment').remove();
    }
    const currentComment = document.querySelector(`.post-container[data-commentid="${this.dataset.commentid}"]`);
    currentComment.insertAdjacentHTML('afterend',replyFormHTML);
    const replyForm = document.querySelector('#reply-form');
    replyForm.addEventListener('submit',sendReply);
}

async function sendReply(e){
    e.preventDefault();
    const entries = [];
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);
    const userSession = await getLoggedUser();
    entries.push({content:formObj.content,user_id:userSession.session.user.id,likes:0,username:userSession.session.user.user_metadata.username,created_at:createCreatedAt(),post_id:Number(e.target.dataset.commentid)});
    insertData("replies",entries);
}

listPosts();