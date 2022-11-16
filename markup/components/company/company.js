//Скролл до элементов
const anchorLinksElements = document.querySelectorAll('[data-scroll-to]');
anchorLinksElements.forEach(link => {
    const selector = link.dataset.scrollTo;
    link.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToElement(selector);
    });
})

function scrollToElement(selector) {
    const targetElement = document.querySelector(selector)
    if(!targetElement) return;
    targetElement.scrollIntoView({block: "center", behavior: "smooth"});
}