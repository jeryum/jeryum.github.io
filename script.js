/**
 * PORTFOLIO SCRIPT
 * Handles SPA navigation, animations, and dynamic content
 */

// Initialize AOS (Animate On Scroll) library
AOS.init({
    duration: 800,
    offset: 100,
    easing: 'ease-in-out',
    once: false // Changed to false for section switching
});

// DOM Ready event listener
document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== NAVIGATION MANAGEMENT ====================
    const navItems = document.querySelectorAll('.nav-item');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Set default active section (Home)
    showSection('home');
    
    // Navigation click handlers
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            showSection(target);
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
    
    // ==================== SECTION MANAGEMENT ====================
    function showSection(sectionId) {
        // Hide all sections
        const sections = document.querySelectorAll('.page-section');
        sections.forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });
        
        // Show selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.style.display = 'block';
            
            // Scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Reinitialize AOS for new content
            setTimeout(() => {
                AOS.refresh();
                // Animate skill bars if in About section
                if (sectionId === 'about') {
                    // Reset and animate skill bars
                    resetSkillBars();
                    setTimeout(() => {
                        animateSkillBars();
                    }, 300);
                }
            }, 100);
            
            // Update browser history
            history.pushState(null, null, `#${sectionId}`);
        }
    }
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        const hash = window.location.hash.substring(1) || 'home';
        const targetItem = document.querySelector(`.nav-item[data-target="${hash}"]`);
        if (targetItem) {
            navItems.forEach(nav => nav.classList.remove('active'));
            targetItem.classList.add('active');
            showSection(hash);
        }
    });
    
    // ==================== CONTACT FORM HANDLING ====================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // In a real application, you would send this to a server
            // For now, we'll show a success message
            showNotification('Message sent successfully! (This is a demo)', 'success');
            
            // Clear form
            contactForm.reset();
            
            // Reset labels
            const labels = contactForm.querySelectorAll('label');
            labels.forEach(label => {
                label.style.top = '1rem';
                label.style.fontSize = '1rem';
                label.style.color = 'var(--color-text-2)';
            });
        });
    }
    
    // Form input label animation
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            const label = this.nextElementSibling;
            if (label && label.tagName === 'LABEL') {
                label.style.top = '-0.5rem';
                label.style.fontSize = '0.8rem';
                label.style.color = '#2080aa';
            }
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                const label = this.nextElementSibling;
                if (label && label.tagName === 'LABEL') {
                    label.style.top = '1rem';
                    label.style.fontSize = '1rem';
                    label.style.color = 'var(--color-text-2)';
                }
            }
        });
    });
    
    // ==================== SET CURRENT YEAR IN FOOTER ====================
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // ==================== PARTICLES.JS CONFIGURATION ====================
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: ["#2080aa", "#8020aa"]
                },
                shape: {
                    type: "circle",
                    stroke: {
                        width: 0,
                        color: "#000000"
                    }
                },
                opacity: {
                    value: 0.5,
                    random: false
                },
                size: {
                    value: 3,
                    random: true
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#444",
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
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
                        mode: "grab"
                    },
                    onclick: {
                        enable: true,
                        mode: "push"
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
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }
    
    // ==================== COPY CONTACT INFO ON CLICK ====================
    function setupContactCopy() {
        const contactItems = document.querySelectorAll('.info-value a, .contact-link, .contact-item a');
        
        contactItems.forEach(item => {
            item.addEventListener('click', function(e) {
                // Only copy on middle-click or Ctrl+Click
                if (e.ctrlKey || e.button === 1) {
                    e.preventDefault();
                    
                    const textToCopy = this.textContent;
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        showNotification(`Copied: ${textToCopy}`);
                    });
                }
            });
            
            // Add title for copy hint
            item.setAttribute('title', 'Ctrl+Click to copy');
        });
    }
    
    // ==================== SKILL BARS ANIMATION ====================
    
    // Function to reset skill bars to 0%
    function resetSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            // Store original width if not already stored
            if (!bar.getAttribute('data-original-width')) {
                const computedWidth = getComputedStyle(bar).width;
                if (computedWidth !== '0px') {
                    bar.setAttribute('data-original-width', computedWidth);
                }
            }
            bar.style.width = '0%';
            bar.style.transition = 'none'; // Disable transition for reset
        });
    }
    
    // Function to animate skill bars
    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        const aboutSection = document.getElementById('about');
        
        // Check if we're in the about section
        if (!aboutSection || getComputedStyle(aboutSection).display === 'none') {
            return;
        }
        
        skillBars.forEach((bar, index) => {
            // Enable transition
            bar.style.transition = 'width 1s ease-in-out';
            
            // Get original width
            let targetWidth = bar.getAttribute('data-original-width');
            
            // If no data-original-width, try to get from inline style
            if (!targetWidth || targetWidth === '0px') {
                const inlineStyle = bar.getAttribute('style');
                if (inlineStyle) {
                    const widthMatch = inlineStyle.match(/width:\s*(\d+%)/);
                    if (widthMatch) {
                        targetWidth = widthMatch[1];
                        bar.setAttribute('data-original-width', targetWidth);
                    }
                }
            }
            
            // If still no width, use default based on skill level
            if (!targetWidth || targetWidth === '0px') {
                const skillItem = bar.closest('.skill-item');
                if (skillItem) {
                    const skillLevel = skillItem.querySelector('.skill-level');
                    if (skillLevel) {
                        const levelText = skillLevel.textContent.toLowerCase();
                        const levelMap = {
                            'beginner': '30%',
                            'basic': '40%',
                            'intermediate': '70%',
                            'advanced': '85%',
                            'expert': '95%',
                            'master': '100%'
                        };
                        
                        for (const [level, percentage] of Object.entries(levelMap)) {
                            if (levelText.includes(level)) {
                                targetWidth = percentage;
                                bar.setAttribute('data-original-width', targetWidth);
                                break;
                            }
                        }
                    }
                }
            }
            
            // Ensure we have a target width
            if (!targetWidth || targetWidth === '0px') {
                targetWidth = '50%'; // Default fallback
                bar.setAttribute('data-original-width', targetWidth);
            }
            
            // Animate with delay for staggered effect
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, index * 100); // Stagger animation
        });
    }
    
    // Observe skills section for animation
    function observeSkillsSection() {
        const skillsSection = document.querySelector('.skills-section');
        if (!skillsSection) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    resetSkillBars();
                    setTimeout(() => {
                        animateSkillBars();
                    }, 300);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });
        
        observer.observe(skillsSection);
    }
    
    // ==================== NOTIFICATION SYSTEM ====================
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #4CAF50, #45a049)' : 'linear-gradient(135deg, #2080aa, #8020aa)'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 1000;
            animation: slideIn 0.3s ease;
            font-size: 0.9rem;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Add animation styles for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Skill bar transition override */
        .skill-progress {
            transition: width 1s ease-in-out !important;
        }
    `;
    document.head.appendChild(style);
    
    // ==================== INITIALIZE FEATURES ====================
    setupContactCopy();
    observeSkillsSection();
    
    // Initialize skill bars if About section is active on load
    setTimeout(() => {
        const activeSection = document.querySelector('.page-section.active');
        if (activeSection && activeSection.id === 'about') {
            resetSkillBars();
            setTimeout(() => {
                animateSkillBars();
            }, 500);
        }
    }, 1000);
    
    // Add keyboard navigation for sections
    document.addEventListener('keydown', function(e) {
        if (e.altKey) {
            switch(e.key) {
                case '1':
                    showSection('home');
                    break;
                case '2':
                    showSection('about');
                    break;
                case '3':
                    showSection('projects');
                    break;
                case '4':
                    showSection('contact');
                    break;
            }
        }
    });
    
    // Console greeting
    console.log('🚀 Single Page Portfolio loaded successfully!');
    console.log('👨‍💻 Developer: Jerome M Abanda');
    console.log('🎮 Navigation: Alt + 1/2/3/4 to switch sections');
    console.log('📧 Email: jeromeabanda79@gmail.com');
});