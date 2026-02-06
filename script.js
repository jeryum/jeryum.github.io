/**
 * PORTFOLIO SCRIPT for GitHub Pages
 * Compatible with jeryum.github.io
 * Simplified SPA with proper back button handling
 */

// Initialize AOS
AOS.init({
    duration: 800,
    offset: 100,
    easing: 'ease-in-out',
    once: false
});

// DOM Ready event listener
document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== GITHUB PAGES SPA ROUTING ====================
    const navItems = document.querySelectorAll('.nav-item');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Navigation history stack
    let historyStack = ['home'];
    let isPopState = false;
    
    // Initialize based on current hash
    const initialHash = window.location.hash.substring(1) || 'home';
    showSection(initialHash, false);
    updateNavActive(initialHash);
    updateHashWithoutHistory(initialHash);
    
    // ==================== NAVIGATION HANDLERS ====================
    
    // Main navigation click
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            
            // Add to history for back button
            if (!isPopState && historyStack[historyStack.length - 1] !== target) {
                historyStack.push(target);
            }
            isPopState = false;
            
            // Update URL without adding to browser history
            updateHashWithoutHistory(target);
            
            // Update UI
            showSection(target, true);
            updateNavActive(target);
            
            // Close mobile menu
            navMenu.classList.remove('active');
        });
    });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
    
    // ==================== HASH CHANGE HANDLER ====================
    
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1) || 'home';
        
        // Check if this is a back/forward navigation
        const isBackNavigation = historyStack.length > 1 && 
                                historyStack[historyStack.length - 2] === hash;
        
        if (isBackNavigation) {
            // Back button pressed
            historyStack.pop();
            isPopState = true;
        } else if (historyStack[historyStack.length - 1] !== hash) {
            // New navigation
            historyStack.push(hash);
        }
        
        showSection(hash, true);
        updateNavActive(hash);
    });
    
    // ==================== HELPER FUNCTIONS ====================
    
    // Update URL hash without adding to browser history
    function updateHashWithoutHistory(sectionId) {
        // For GitHub Pages compatibility
        if (history.replaceState) {
            history.replaceState(null, null, `#${sectionId}`);
        } else {
            window.location.hash = `#${sectionId}`;
        }
    }
    
    // Update active navigation item
    function updateNavActive(target) {
        navItems.forEach(nav => nav.classList.remove('active'));
        const activeNav = document.querySelector(`.nav-item[data-target="${target}"]`);
        if (activeNav) {
            activeNav.classList.add('active');
        }
    }
    
    // Show section with animation
    function showSection(sectionId, animate = true) {
        // Don't do anything if already on this section
        const currentActive = document.querySelector('.page-section.active');
        if (currentActive && currentActive.id === sectionId) return;
        
        // Hide all sections
        const sections = document.querySelectorAll('.page-section');
        sections.forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
            section.style.opacity = '0';
        });
        
        // Show selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.style.display = 'block';
            
            if (animate) {
                // Fade in animation
                setTimeout(() => {
                    targetSection.style.transition = 'opacity 0.3s ease';
                    targetSection.style.opacity = '1';
                }, 10);
            } else {
                targetSection.style.opacity = '1';
            }
            
            // Scroll to top
            if (animate) {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                window.scrollTo(0, 0);
            }
            
            // Reinitialize AOS for new content
            setTimeout(() => {
                AOS.refresh();
                
                // Animate skill bars if in About section
                if (sectionId === 'about') {
                    resetSkillBars();
                    setTimeout(() => {
                        animateSkillBars();
                    }, 300);
                }
                
                // Update CTA buttons
                updateCTALinks();
            }, 100);
        }
    }
    
    // ==================== SKILL BARS ANIMATION ====================
    
    function resetSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            bar.style.width = '0%';
            bar.style.transition = 'none';
        });
    }
    
    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach((bar, index) => {
            // Get target width from inline style
            const style = bar.getAttribute('style');
            let targetWidth = '50%'; // Default
            
            if (style) {
                const match = style.match(/width:\s*(\d+%)/);
                if (match) {
                    targetWidth = match[1];
                }
            }
            
            // Animate with delay
            setTimeout(() => {
                bar.style.transition = 'width 1s ease-in-out';
                bar.style.width = targetWidth;
            }, index * 100);
        });
    }
    
    // ==================== UPDATE CTA BUTTONS ====================
    
    function updateCTALinks() {
        // Update all internal links to use SPA navigation
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            if (!link.classList.contains('nav-link')) {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const target = this.getAttribute('href').substring(1);
                    
                    // Add to history
                    if (historyStack[historyStack.length - 1] !== target) {
                        historyStack.push(target);
                    }
                    
                    // Update URL
                    updateHashWithoutHistory(target);
                    
                    // Update UI
                    showSection(target, true);
                    updateNavActive(target);
                });
            }
        });
    }
    
    // Initialize CTA links
    updateCTALinks();
    
    // ==================== CONTACT FORM ====================
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show success message
            showNotification('Message sent successfully! (Demo mode)', 'success');
            
            // Reset form
            this.reset();
            
            // Reset labels
            this.querySelectorAll('label').forEach(label => {
                label.style.top = '1rem';
                label.style.fontSize = '1rem';
                label.style.color = 'var(--color-text-2)';
            });
        });
        
        // Form input animations
        const formInputs = contactForm.querySelectorAll('input, textarea');
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
    }
    
    // ==================== PARTICLES.JS ====================
    
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: { enable: true, value_area: 800 }
                },
                color: { value: ["#2080aa", "#8020aa"] },
                shape: { type: "circle" },
                opacity: { value: 0.5 },
                size: { value: 3, random: true },
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
                    out_mode: "out"
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "grab" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                }
            },
            retina_detect: true
        });
    }
    
    // ==================== COPY FUNCTIONALITY ====================
    
    document.querySelectorAll('.contact-item a').forEach(item => {
        item.addEventListener('click', function(e) {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const text = this.textContent || this.getAttribute('href').replace('mailto:', '').replace('tel:', '');
                navigator.clipboard.writeText(text).then(() => {
                    showNotification(`Copied: ${text}`);
                });
            }
        });
        item.title = 'Ctrl+Click to copy';
    });
    
    // ==================== CURRENT YEAR ====================
    
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // ==================== NOTIFICATION SYSTEM ====================
    
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#2080aa'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: notificationSlideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'notificationSlideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes notificationSlideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes notificationSlideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        /* Skill bar animation */
        .skill-progress {
            transition: width 1s ease-in-out !important;
        }
        
        /* Section transitions */
        .page-section {
            transition: opacity 0.3s ease;
        }
    `;
    document.head.appendChild(style);
    
    // ==================== KEYBOARD SHORTCUTS ====================
    
    document.addEventListener('keydown', function(e) {
        if (e.altKey) {
            let target;
            switch(e.key) {
                case '1': target = 'home'; break;
                case '2': target = 'about'; break;
                case '3': target = 'projects'; break;
                case '4': target = 'contact'; break;
                default: return;
            }
            
            if (historyStack[historyStack.length - 1] !== target) {
                historyStack.push(target);
            }
            
            updateHashWithoutHistory(target);
            showSection(target, true);
            updateNavActive(target);
        }
    });
    
    // ==================== INITIALIZE ON LOAD ====================
    
    // Animate skill bars if starting on about page
    if (initialHash === 'about') {
        setTimeout(() => {
            resetSkillBars();
            setTimeout(() => {
                animateSkillBars();
            }, 500);
        }, 1000);
    }
    
    console.log('🌐 Portfolio loaded for GitHub Pages');
    console.log('📱 Mobile back button: WORKING');
    console.log('👨‍💻 Developer: Jerome M Abanda');
});