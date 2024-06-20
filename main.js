document.addEventListener('DOMContentLoaded', function () {
    const menuIcon = document.getElementById('menu-icon');
    const navLinks = document.getElementById('nav-links');

    menuIcon.addEventListener('click', function () {
        navLinks.classList.toggle('active');
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('.slide-in');

    function checkVisibility() {
        images.forEach(image => {
            const rect = image.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                image.classList.add('visible');
            } else {
                image.classList.remove('visible');
            }
        });
    }

    window.addEventListener('scroll', checkVisibility);
    window.addEventListener('resize', checkVisibility);

    checkVisibility();
});