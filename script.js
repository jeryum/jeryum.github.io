/**
 * PORTFOLIO SCRIPT
 * Handles animations, interactions, and dynamic content
 */

// Initialize AOS (Animate On Scroll) library
AOS.init({
    duration: 800,        // Animation duration in ms
    offset: 100,          // Offset (in px) from the original trigger point
    easing: 'ease-in-out', // Default easing for AOS animations
    once: true            // Whether animation should happen only once
});

// DOM Ready event listener
document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== SMOOTH SCROLL FUNCTIONALITY ====================
    const scrollArrow = document.getElementById('scroll-arrow');
    const targetSection = document.getElementById('target');
    
    // Add click event to scroll arrow
    if (scrollArrow && targetSection) {
        scrollArrow.addEventListener('click', function() {
            targetSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
    }
    
    // ==================== SET CURRENT YEAR IN FOOTER ====================
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // ==================== PARTICLES.JS CONFIGURATION ====================
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,                      // Number of particles
                density: {
                    enable: true,
                    value_area: 800             // Area density
                }
            },
            color: {
                value: ["#2080aa", "#8020aa"]   // Particle colors
            },
            shape: {
                type: "circle",                 // Particle shape
                stroke: {
                    width: 0,
                    color: "#000000"
                }
            },
            opacity: {
                value: 0.5,                     // Particle opacity
                random: false
            },
            size: {
                value: 3,                       // Particle size
                random: true
            },
            line_linked: {
                enable: true,
                distance: 150,                  // Distance between linked particles
                color: "#444",                  // Connection line color
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,                       // Particle movement speed
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out"
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "grab"                // Interaction on hover
                },
                onclick: {
                    enable: true,
                    mode: "push"                // Interaction on click
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 1
                    }
                },
                push: {
                    particles_nb: 4             // Number of particles to push
                }
            }
        },
        retina_detect: true                     // Detect retina display
    });
    
    // ==================== ADDITIONAL ENHANCEMENTS ====================
    
    // Add keyboard accessibility to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'article');
        
        // Add keyboard navigation
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const links = this.querySelectorAll('.project-links a');
                if (links.length > 0) {
                    links[0].click();
                }
            }
        });
    });
    
    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
    
    // Console greeting (for fun)
    console.log('🚀 Portfolio loaded successfully!');
    console.log('👨‍💻 Developer: Jerome M Abanda');
    console.log('🌐 Visit: https://github.com/jeryum');
});