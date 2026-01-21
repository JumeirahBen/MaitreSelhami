document.addEventListener('DOMContentLoaded', function() {

    // ========================================
    // GESTION DU MENU HAMBURGER POUR MOBILE
    // ========================================
    const hamburger = document.getElementById('hamburger-menu');
    const nav = document.querySelector('.main-nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            nav.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Fermer le menu en cliquant sur un lien
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            });
        });
    }

    // ========================================
    // EFFET D'APPARITION AU DÉFILEMENT (FADE-IN)
    // ========================================
    const faders = document.querySelectorAll('.fade-in');
    
    const appearOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
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
    
    // ========================================
    // EFFET PHOTO DE PROFIL
    // ========================================
    document.body.classList.add('loaded');

    // ========================================
    // VALIDATION DU FORMULAIRE
    // ========================================
    const form = document.getElementById('contact-form');
    
    if (form) {
        const emailInput = document.getElementById('email');
        const nameInput = document.getElementById('name');
        const messageInput = document.getElementById('message');
        const rgpdCheckbox = document.getElementById('rgpd');
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        
        // Regex pour validation email stricte
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        // Domaines suspects à bloquer
        const suspiciousDomains = ['test.com', 'exemple.com', 'example.com', 'test.fr'];
        
        // ========================================
        // VALIDATION EMAIL EN TEMPS RÉEL
        // ========================================
        if (emailInput) {
            emailInput.addEventListener('input', function() {
                validateEmail();
                checkFormValidity();
            });
            
            emailInput.addEventListener('blur', function() {
                validateEmail();
            });
        }
        
        function validateEmail() {
            const email = emailInput.value.trim();
            
            // Supprimer les messages d'erreur précédents
            removeEmailError();
            
            // Si le champ est vide
            if (email === '') {
                emailInput.classList.remove('valid', 'invalid');
                return false;
            }
            
            // Vérifier le format
            if (!emailRegex.test(email)) {
                emailInput.classList.remove('valid');
                emailInput.classList.add('invalid');
                showEmailError('Format invalide. Exemple : nom@domaine.fr');
                return false;
            }
            
            // Vérifier les domaines suspects
            const emailDomain = email.split('@')[1];
            if (suspiciousDomains.includes(emailDomain)) {
                emailInput.classList.remove('valid');
                emailInput.classList.add('invalid');
                showEmailError('Veuillez utiliser une adresse email réelle');
                return false;
            }
            
            // Email valide
            emailInput.classList.remove('invalid');
            emailInput.classList.add('valid');
            return true;
        }
        
        function showEmailError(message) {
            removeEmailError();
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'email-error';
            errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
            
            emailInput.parentNode.appendChild(errorDiv);
        }
        
        function removeEmailError() {
            const existingError = emailInput.parentNode.querySelector('.email-error');
            if (existingError) {
                existingError.remove();
            }
        }
        
        // ========================================
        // VALIDATION DES AUTRES CHAMPS
        // ========================================
        
        // Validation du nom (au moins 2 caractères)
        if (nameInput) {
            nameInput.addEventListener('input', function() {
                validateName();
                checkFormValidity();
            });
        }
        
        function validateName() {
            const name = nameInput.value.trim();
            
            if (name === '') {
                nameInput.classList.remove('valid', 'invalid');
                return false;
            }
            
            if (name.length < 2) {
                nameInput.classList.add('invalid');
                nameInput.classList.remove('valid');
                return false;
            }
            
            nameInput.classList.remove('invalid');
            nameInput.classList.add('valid');
            return true;
        }
        
        // Validation du message (au moins 10 caractères)
        if (messageInput) {
            messageInput.addEventListener('input', function() {
                validateMessage();
                checkFormValidity();
            });
        }
        
        function validateMessage() {
            const message = messageInput.value.trim();
            
            if (message === '') {
                messageInput.classList.remove('valid', 'invalid');
                return false;
            }
            
            if (message.length < 10) {
                messageInput.classList.add('invalid');
                messageInput.classList.remove('valid');
                return false;
            }
            
            messageInput.classList.remove('invalid');
            messageInput.classList.add('valid');
            return true;
        }
        
        // Validation RGPD
        if (rgpdCheckbox) {
            rgpdCheckbox.addEventListener('change', function() {
                checkFormValidity();
            });
        }
        
        // ========================================
        // VÉRIFICATION GLOBALE DU FORMULAIRE
        // ========================================
        function checkFormValidity() {
            const isEmailValid = validateEmail();
            const isNameValid = nameInput.value.trim().length >= 2;
            const isMessageValid = messageInput.value.trim().length >= 10;
            const isRgpdChecked = rgpdCheckbox.checked;
            
            const isFormValid = isEmailValid && isNameValid && isMessageValid && isRgpdChecked;
            
            // Activer/désactiver le bouton en fonction de la validité
            submitBtn.disabled = !isFormValid;
            
            if (!isFormValid) {
                submitBtn.style.opacity = '0.5';
                submitBtn.style.cursor = 'not-allowed';
            } else {
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
            }
            
            return isFormValid;
        }
        
        // Vérification initiale au chargement
        checkFormValidity();

        // ========================================
        // SOUMISSION DU FORMULAIRE
        // ========================================
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            e.stopPropagation();

            // VALIDATION FINALE STRICTE
            const isEmailValid = validateEmail();
            const isNameValid = validateName();
            const isMessageValid = validateMessage();
            const isRgpdChecked = rgpdCheckbox.checked;
            
            // Vérifier chaque champ individuellement
            if (!isNameValid) {
                showAlert('error', '⚠ Le nom doit contenir au moins 2 caractères.');
                nameInput.focus();
                return false;
            }
            
            if (!isEmailValid) {
                showAlert('error', '⚠ Veuillez entrer une adresse email valide.');
                emailInput.focus();
                return false;
            }
            
            if (!isMessageValid) {
                showAlert('error', '⚠ Le message doit contenir au moins 10 caractères.');
                messageInput.focus();
                return false;
            }
            
            if (!isRgpdChecked) {
                showAlert('error', '⚠ Veuillez accepter les conditions RGPD.');
                return false;
            }

            // Vérification double de l'email
            const emailValue = emailInput.value.trim();
            if (!emailRegex.test(emailValue)) {
                showAlert('error', '⚠ Format d\'email invalide. Impossible d\'envoyer le formulaire.');
                emailInput.focus();
                return false;
            }
            
            const emailDomain = emailValue.split('@')[1];
            if (suspiciousDomains.includes(emailDomain)) {
                showAlert('error', '⚠ Veuillez utiliser une adresse email réelle, pas un email de test.');
                emailInput.focus();
                return false;
            }

            // SI TOUT EST VALIDE, ON ENVOIE
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            removeAlert();

            try {
                const formData = new FormData(form);

                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    showAlert('success', '✓ Votre message a été envoyé avec succès ! Nous vous répondrons dans les meilleurs délais.');
                    form.reset();
                    
                    // Réinitialiser toutes les classes
                    emailInput.classList.remove('valid', 'invalid');
                    nameInput.classList.remove('valid', 'invalid');
                    messageInput.classList.remove('valid', 'invalid');
                    
                    // Réinitialiser l'état du bouton
                    checkFormValidity();
                    
                    setTimeout(() => {
                        const alert = document.querySelector('.form-alert');
                        if (alert) {
                            alert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }
                    }, 100);
                } else {
                    const data = await response.json();
                    if (data.errors) {
                        showAlert('error', '✗ Erreur : ' + data.errors.map(error => error.message).join(', '));
                    } else {
                        showAlert('error', '✗ Une erreur s\'est produite lors de l\'envoi. Veuillez réessayer.');
                    }
                }
            } catch (error) {
                console.error('Erreur:', error);
                showAlert('error', '✗ Erreur de connexion. Veuillez réessayer ou nous contacter au 06 51 28 55 99.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                checkFormValidity();
            }
        });

        // ========================================
        // FONCTIONS D'ALERTE
        // ========================================
        function showAlert(type, message) {
            removeAlert();

            const alert = document.createElement('div');
            alert.className = `form-alert alert-${type}`;
            alert.innerHTML = `
                <span>${message}</span>
                <button class="alert-close" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            `;

            form.parentNode.insertBefore(alert, form);

            setTimeout(() => {
                alert.classList.add('show');
            }, 10);

            setTimeout(() => {
                if (alert && alert.parentNode) {
                    alert.classList.remove('show');
                    setTimeout(() => alert.remove(), 300);
                }
            }, 8000);
        }

        function removeAlert() {
            const existingAlert = document.querySelector('.form-alert');
            if (existingAlert) {
                existingAlert.remove();
            }
        }
    }
});

// ========================================
// EFFET MACHINE À ÉCRIRE
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const typedTextSpan = document.querySelector(".typing-text");
    
    if (!typedTextSpan) {
        console.warn('Élément .typing-text non trouvé');
        return;
    }
    
    console.log('Script typing initialized');
    
    const textArray = [
        "Défendre vos droits, bâtir votre stratégie.",
        "Votre experte en droit immobilier.",
        "Votre alliée en contentieux des affaires.",
        "Rigueur et stratégie pour votre défense."
    ];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            if (charIndex === 0) {
                typedTextSpan.textContent = '';
            }
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

    // Démarrer l'animation avec un délai léger pour s'assurer que le DOM est prêt
    if (textArray.length) {
        setTimeout(() => {
            type();
        }, 500);
    }
});