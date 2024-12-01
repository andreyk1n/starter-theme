export function currentPage() {
    const currentLink = document.querySelectorAll('.nav__link'); // клас посилання
    const currentPath = window.location.pathname.split('/').pop();
    currentLink.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('currentPage');
        }
    });
}