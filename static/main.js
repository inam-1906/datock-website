// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 700, // Slightly longer duration for a smoother feel
    once: true,
    offset: 80, // Offset so animations start slightly later
    easing: 'ease-out-cubic'
});

// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll'); // Added class to prevent background scroll
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Check if the link is the CTA button or an anchor link
            if (link.getAttribute('href').startsWith('/') || link.getAttribute('href').startsWith('#')) { 
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });
}

// Smooth Scroll for Anchor Links
const navbar = document.querySelector('.navbar'); 

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                // Adjust for the new floating navbar height and position
                const navbarHeight = navbar ? navbar.offsetHeight + 40 : 100; // Increased offset for better spacing
                const targetPosition = target.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-link');

function activateNavLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        // Use a smaller offset for section highlighting
        const sectionTop = section.offsetTop - 200; // Increased offset for more accurate highlighting
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinksAll.forEach(link => {
                if (link.getAttribute('href') === `#${sectionId}`) {
                    // This is the correct way to toggle the class based on new CSS
                    link.classList.add('active-link'); 
                } else if (link.getAttribute('href').startsWith('#')) {
                    link.classList.remove('active-link');
                }
            });
        }
    });
    
    // Handle Home/Top case: If scrollY is near the top, ensure no links are active, except for Home link if it's there
    if (scrollY < 100) {
        navLinksAll.forEach(link => {
            link.classList.remove('active-link');
        });
        // Optionally activate Home link if it points to '/'
        const homeLink = document.querySelector('.nav-link[href="/"]');
        if (homeLink) {
             // Home link is active only on the homepage at the top
        }
    }
}

window.addEventListener('scroll', activateNavLink);
window.addEventListener('load', activateNavLink); // Run once on load for initial state

// Animated Counter for Stats
function animateCounter(element, target, duration = 1200) { // Reduced duration for snappier count
    let start = 0;
    const increment = target / (duration / 16); 
    
    const targetIsString = isNaN(target);
    const numericTarget = targetIsString ? parseInt(element.textContent) : target;

    const timer = setInterval(() => {
        start += increment;
        if (start >= numericTarget) {
            element.textContent = numericTarget + (element.dataset.suffix || '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (element.dataset.suffix || '');
        }
    }, 16);
}

// Trigger counters when they come into view
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const target = parseInt(entry.target.dataset.target);
            animateCounter(entry.target, target);
        }
    });
}, observerOptions);

// Set up stat counters
document.addEventListener('DOMContentLoaded', () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach((stat, index) => {
        const text = stat.textContent.trim();
        let value, suffix = '';
        
        // Use regex for a more robust check of number and suffix
        const match = text.match(/(\d+)(.*)/); 

        if (match) {
            value = parseInt(match[1]);
            suffix = match[2].trim();
        } else {
            value = parseInt(text) || 0;
        }
        
        stat.dataset.target = value;
        stat.dataset.suffix = suffix;
        stat.textContent = '0' + suffix;
        
        counterObserver.observe(stat);
    });
});

// Form Validation - Enhanced visual feedback
const inputs = document.querySelectorAll('input, textarea');
inputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.hasAttribute('required') && this.value.trim() === '') {
            this.classList.add('input-error');
        } else {
            this.classList.remove('input-error');
        }
    });
    
    input.addEventListener('input', function() {
        if (this.classList.contains('input-error') && this.value.trim() !== '') {
            this.classList.remove('input-error');
        }
    });
});

// Particle Background Effect
function createParticles() {
    const hero = document.querySelector('.hero-background');
    if (!hero) return;
    
    hero.querySelectorAll('.particle').forEach(p => p.remove()); 
    
    for (let i = 0; i < 80; i++) { // Increased particle count for richer background
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.4 + 0.3}); 
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 15 + 15}s infinite ease-in-out;
            animation-delay: ${Math.random() * 5}s;
        `;
        hero.appendChild(particle);
    }
}

// Add necessary CSS for active link and error state
const style = document.createElement('style');
style.textContent = `
    .nav-link.active-link {
        color: var(--white) !important; /* Ensure white text for active link */
    }

    .nav-link.active-link::after {
        width: 100%;
    }
    
    .input-error {
        border-color: #ef4444 !important; /* Red border for validation error */
    }

    /* Prevent body scroll when mobile menu is open */
    .no-scroll {
        overflow: hidden;
    }
`;
document.head.appendChild(style);

window.addEventListener('load', createParticles);

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) { // Check if data-src exists
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            }
        });
    }, { threshold: 0.1 }); 

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

console.log('🚀 DaTock.com loaded successfully!');