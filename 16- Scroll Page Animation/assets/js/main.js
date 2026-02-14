const observerOptions = {
    root: null,
    threshold: 0.20,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver ((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');

            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const scrollElements = document.querySelectorAll('.left, .right, .up, .scale');

scrollElements.forEach(el => {
    observer.observe(el);
});