// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 600, // Reduced duration for faster animation
    once: true,
    offset: 50, // Reduced offset so animations start sooner
    easing: 'ease-out-cubic'
});

// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Check if the link is the CTA button to prevent closing on hash-link click that goes nowhere
            if (!link.classList.contains('btn-primary')) { 
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// NOTE: Navbar Scroll Effect logic removed as it's now handled by CSS

// Smooth Scroll for Anchor Links
// Get navbar reference *outside* the listener to avoid reflow/recalc
const navbar = document.querySelector('.navbar'); 

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                // Adjust for the new floating navbar height and position
                const navbarHeight = navbar ? navbar.offsetHeight + 20 : 80; // Estimate 80px if navbar not found
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
        const sectionTop = section.offsetTop - 150; 
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinksAll.forEach(link => {
                if (link.getAttribute('href') === `#${sectionId}`) {
                    // Set active style (color)
                    link.style.color = 'var(--primary)';
                    // Re-add the underline effect for active state
                    link.classList.add('active-link'); 
                } else if (link.getAttribute('href').startsWith('#')) {
                    // Remove active style
                    link.style.color = '';
                    link.classList.remove('active-link');
                }
            });
        }
        
        // Handle Home/Top case: If scrollY is near the top, ensure no links are active (or activate home if applicable)
        if (scrollY < 100) {
             navLinksAll.forEach(link => {
                link.style.color = '';
                link.classList.remove('active-link');
            });
        }
    });
}

window.addEventListener('scroll', activateNavLink); // No debounce, immediate response

// Animated Counter for Stats
function animateCounter(element, target, duration = 1500) { // Reduced duration for snappier count
    let start = 0;
    const increment = target / (duration / 16); // 60fps
    
    // Check if the target is already a string (e.g., 500+)
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
        const text = stat.textContent;
        let value, suffix = '';
        
        // Simplified parsing, assuming simple suffix at the end
        if (text.includes('+')) {
            value = parseInt(text.replace('+', ''));
            suffix = '+';
        } else if (text.includes('%')) {
            value = parseInt(text.replace('%', ''));
            suffix = '%';
        } else if (text.includes('x')) {
            value = parseInt(text.replace('x', ''));
            suffix = 'x';
        } else {
            value = parseInt(text);
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
    const defaultBorder = input.style.borderColor || '';
    
    input.addEventListener('blur', function() {
        if (this.value.trim() === '' && this.hasAttribute('required')) {
            this.style.borderColor = '#ef4444'; // Red for error
        } else {
            this.style.borderColor = defaultBorder;
        }
    });
    
    input.addEventListener('input', function() {
        // Reset to default border on input if it was red
        if (this.style.borderColor === 'rgb(239, 68, 68)') {
            this.style.borderColor = defaultBorder;
        }
    });
});

// Particle Background Effect (optional enhancement)
function createParticles() {
    const hero = document.querySelector('.hero-background');
    if (!hero) return;
    
    // Clear existing particles if any
    hero.querySelectorAll('.particle').forEach(p => p.remove()); 
    
    for (let i = 0; i < 60; i++) { // Increased particle count
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            /* Using a lighter color for better visibility against the new dark background */
            background: rgba(255, 255, 255, ${Math.random() * 0.4 + 0.3}); 
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s infinite ease-in-out;
            animation-delay: ${Math.random() * 5}s;
        `;
        hero.appendChild(particle);
    }
}

// Add particle animation CSS
// NOTE: I'll trust the CSS in style.css to handle the @keyframes float 
// but removing the inline style creation here as the CSS is now cleaner in style.css
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.7;
        }
        50% {
            transform: translateY(-100px) translateX(${Math.random() * 100 - 50}px) scale(1.2);
            opacity: 0.9;
        }
    }
    
    /* Ensure the active link styling is consistent */
    .nav-link.active-link {
        color: var(--primary) !important;
    }

    .nav-link.active-link::after {
        width: 100%;
        background: var(--primary);
    }
`;
document.head.appendChild(style);


// Initialize particles on load
window.addEventListener('load', createParticles);

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.6s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    }, { threshold: 0.1 }); // Lowered threshold for earlier loading

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// NOTE: Removed debounce on activateNavLink for better UX (snappier link highlight).

// Preload critical resources
const preloadLink = document.createElement('link');
preloadLink.rel = 'preload';
preloadLink.as = 'style';
preloadLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800&display=swap';
document.head.appendChild(preloadLink);

console.log('🚀 DaTock.com loaded successfully!');