if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

window.addEventListener('scroll', () => {
    const header = document.querySelector('header');

    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }

    });

}, {
    threshold: 0.03
});

document.querySelectorAll('.reveal').forEach(section => {
    observer.observe(section);
});

const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.menu');

hamburger.addEventListener('click', () => {
    menu.classList.toggle('active');
});

document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.remove('active');
    });
});

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {

    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {

        item.classList.toggle('active');

    });

});

const instaSection = document.querySelector('#imoveis');

let instagramCarregado = false;

window.addEventListener('scroll', () => {

    if (!instagramCarregado) {

        const posicao = instaSection.getBoundingClientRect().top;

        if (posicao < window.innerHeight) {

            const script = document.createElement('script');

            script.src = "https://www.instagram.com/embed.js";

            document.body.appendChild(script);

            instagramCarregado = true;

        }

    }

});