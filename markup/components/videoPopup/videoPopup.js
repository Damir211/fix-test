//Скрипт для видео плеера
document.addEventListener('DOMContentLoaded', () => {
    document.body.insertAdjacentHTML('beforeend', 
        `<div class="videopopup">
            <div class="videopopup__close"></div>
            <div class="videopopup__overlay"></div>
            <div class="videopopup__container"></div>
        </div>`
    );
    const closeButton = document.querySelector('.videopopup__close');
    const overlay = document.querySelector('.videopopup__overlay');
    closeButton.addEventListener('click', videoHide);
    overlay.addEventListener('click', videoHide);
});

const videoButtons = document.querySelectorAll('[data-youtubevideo-play]');

videoButtons.forEach(videoButton => {
    const source = videoButton.dataset.youtubevideoPlay;
    videoButton.addEventListener('click', (e) => {
        e.preventDefault();
        videoShow(source)
    });
});

function videoShow(source){
    const container = document.querySelector('.videopopup__container');
    const videopopup = document.querySelector('.videopopup');
    const resultSource = source.includes('?') 
                            ? (source.includes('autoplay') ? source : source + '&autoplay=1') 
                            : source + '?autoplay=1'
    const iframe = `<iframe width="560" height="315" 
    src="${resultSource}" 
    title="YouTube video player" frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; 
    encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen></iframe>`;
    container.insertAdjacentHTML('beforeend', iframe);
    videopopup.classList.add('active');
    document.body.classList.add('no-scroll');
}
function videoHide(){
    const container = document.querySelector('.videopopup__container');
    const videopopup = document.querySelector('.videopopup');
    container.innerHTML = "";
    videopopup.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

