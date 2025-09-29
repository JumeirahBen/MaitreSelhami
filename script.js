document.addEventListener('DOMContentLoaded', function() {

    // Gestion du menu Hamburger pour mobile
    const hamburger = document.getElementById('hamburger-menu');
    const nav = document.querySelector('.main-nav');

    hamburger.addEventListener('click', () => {
        nav.classList.toggle('active');
    });

    // Fermer le menu en cliquant sur un lien
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
            }
        });
    });

    // Effet d'apparition au défilement (fade-in)
    const faders = document.querySelectorAll('.fade-in');
    
    const appearOptions = {
        threshold: 0.2, // Se déclenche quand 20% de l'élément est visible
        rootMargin: "0px 0px -50px 0px" // Un peu de marge pour que ça se déclenche plus tôt
    };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });
    
    // Ajoute la classe 'loaded' au body une fois la page chargée pour l'effet sur la photo
    document.body.classList.add('loaded');
});

// ... (code existant pour le menu et le fade-in) ...


// --- EFFET MACHINE À ÉCRIRE ---
document.addEventListener('DOMContentLoaded', () => {
    const typedTextSpan = document.querySelector(".typing-text");
    const textArray = [
        "Défendre vos droits, bâtir votre stratégie.",
        "Votre experte en droit immobilier.",
        "Votre alliée en contentieux des affaires.",
        "Rigueur et stratégie pour votre défense."
    ];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000; // Délai avant de commencer à taper un nouveau texte
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }

    // Démarrer l'effet au chargement de la page
    if (textArray.length) setTimeout(type, newTextDelay + 250);
});