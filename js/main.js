/**
 * Antry.gg Website JavaScript
 * 
 * This file contains all the interactive functionality for the Antry.gg website.
 */

// Wait for the DOM to be fully loaded before executing scripts
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initNavigation();
  initParticles();
  initAnimations();
  initPricingToggle();
  initFaqAccordion();
  initTestimonials();
  initCtaAnimations();
  initDownloadOptions();
  initClientGUI();
  updateCopyrightYear();
  initFeatureCardModals();
  renderFeatures();
  initFeatureParticles();
});

/**
 * Navigation functionality
 * - Mobile menu toggle
 * - Scroll spy for active navigation links
 * - Sticky header on scroll
 */
function initNavigation() {
  const header = document.querySelector('.header');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Mobile menu toggle
  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenuBtn.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });
  }
  
  // Close mobile menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      mobileMenuBtn.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  });
  
  // Scroll spy for active navigation
  window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    
    // Add sticky class to header when scrolling down
    if (scrollPosition > 50) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
    
    // Update active navigation link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Generate and animate particles in the hero section
 */
function initParticles() {
  const heroSection = document.querySelector('.hero-section');
  if (!heroSection) return;
  
  // Create particles container if it doesn't exist
  let particlesContainer = document.querySelector('.particles-container');
  if (!particlesContainer) {
    particlesContainer = document.createElement('div');
    particlesContainer.classList.add('particles-container');
    heroSection.appendChild(particlesContainer);
  }
  
  // Number of particles to create
  const particleCount = 30;
  
  // Create particles
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Random position
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    
    // Random size
    const size = Math.random() * 5 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random opacity
    particle.style.opacity = Math.random() * 0.5 + 0.2;
    
    // Random animation duration and delay
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    
    // Random glow intensity
    const glowIntensity = Math.random() * 10 + 5;
    particle.style.boxShadow = `0 0 ${glowIntensity}px var(--primary-color)`;
    
    // Add some particles with different colors
    if (Math.random() > 0.7) {
      particle.style.backgroundColor = 'var(--accent-color)';
    }
    
    particlesContainer.appendChild(particle);
  }
  
  // Add mouse interaction with particles
  heroSection.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => {
      const rect = particle.getBoundingClientRect();
      const particleX = rect.left + rect.width / 2;
      const particleY = rect.top + rect.height / 2;
      
      const distX = mouseX - particleX;
      const distY = mouseY - particleY;
      const distance = Math.sqrt(distX * distX + distY * distY);
      
      // Only affect particles within 100px of the mouse
      if (distance < 100) {
        const strength = (100 - distance) / 100;
        const moveX = distX * strength * 0.1;
        const moveY = distY * strength * 0.1;
        
        particle.style.transform = `translate(${moveX}px, ${moveY}px)`;
        particle.style.opacity = Math.min(1, parseFloat(particle.style.opacity) + strength * 0.3);
      } else {
        particle.style.transform = '';
      }
    });
  });
}

/**
 * Initialize scroll animations
 */
function initAnimations() {
  // Add animation classes to elements when they come into view
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add a small delay to stagger animations but keep them quick
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 50); // Reduced from typical 100-200ms to just 50ms for snappier feel
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px' // Reduced from -50px to -30px to trigger animations sooner
  });
  
  animatedElements.forEach(element => {
    observer.observe(element);
  });
  
  // Special handling for pricing cards to ensure they animate properly
  const pricingCards = document.querySelectorAll('.pricing-card.animate-on-scroll');
  if (pricingCards.length > 0) {
    // Force recalculation of pricing card animations when the section comes into view
    const pricingSection = document.querySelector('.pricing-section');
    if (pricingSection) {
      const pricingSectionObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          pricingCards.forEach((card, index) => {
            // Reset any existing animations
            card.classList.remove('visible');
            
            // Force browser to recognize the removal
            void card.offsetWidth;
            
            // Add visible class with staggered delay
            setTimeout(() => {
              card.classList.add('visible');
            }, 100 * (index + 1));
          });
          
          pricingSectionObserver.unobserve(pricingSection);
        }
      }, {
        threshold: 0.2
      });
      
      pricingSectionObserver.observe(pricingSection);
    }
  }
  
  // Add smooth hover transitions to all interactive elements
  const interactiveElements = document.querySelectorAll('.feature-card, .testimonial-card, .pricing-card, .download-option, .faq-item, .social-link, .footer-link');
  
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
      this.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease, border-color 0.3s ease';
    });
    
    element.addEventListener('mouseleave', function() {
      this.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease';
    });
  });
  
  // Add animation to hero section elements
  const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .hero-buttons');
  
  heroElements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, 200 + (index * 150));
  });
}

/**
 * Initialize pricing toggle functionality
 */
function initPricingToggle() {
  const pricingCards = document.querySelectorAll('.pricing-card');
  
  // Remove any pricing toggle elements that might still be in the DOM
  const pricingToggle = document.querySelector('.pricing-toggle');
  if (pricingToggle) {
    pricingToggle.style.display = 'none';
  }
  
  // Set all pricing cards to show FREE
  pricingCards.forEach(card => {
    const priceElement = card.querySelector('.pricing-price');
    
    if (priceElement) {
      // Set the price to FREE
      priceElement.innerHTML = '<span class="currency">FREE</span>';
      
      // Remove any data attributes that might contain old pricing
      priceElement.removeAttribute('data-monthly');
      priceElement.removeAttribute('data-yearly');
    }
  });
}

/**
 * Initialize FAQ accordion functionality
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items
        faqItems.forEach(faqItem => {
          faqItem.classList.remove('active');
          const icon = faqItem.querySelector('.faq-icon');
          if (icon) {
            icon.textContent = '➕';
          }
        });
        
        // If the clicked item wasn't active, open it
        if (!isActive) {
          item.classList.add('active');
          const icon = item.querySelector('.faq-icon');
          if (icon) {
            icon.textContent = '➖';
          }
        }
      });
    }
  });
  
  // Add animation when FAQ section comes into view
  const faqSection = document.querySelector('.faq-section');
  if (faqSection) {
    const faqObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        faqItems.forEach(item => {
          item.classList.add('animate-visible');
        });
        faqObserver.unobserve(faqSection);
      }
    }, {
      threshold: 0.2
    });
    
    faqObserver.observe(faqSection);
  }
}

/**
 * Update copyright year to current year
 */
function updateCopyrightYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/**
 * Feature data with detailed modules
 */
const featuresData = [
  {
    icon: '⚔️',
    title: 'Combat Hacks',
    description: 'Gain the upper hand in PvP with advanced combat modifications.',
    modules: [
      {
        icon: '🎯',
        title: 'KillAura',
        description: 'Automatically attacks nearby players or entities within your configured range.'
      },
      {
        icon: '👆',
        title: 'AutoClicker',
        description: 'Simulates mouse clicks at configurable intervals for maximum attack speed.'
      },
      {
        icon: '📏',
        title: 'Reach',
        description: 'Extends your attack range beyond vanilla limits while remaining undetected.'
      },
      {
        icon: '🛡️',
        title: 'Criticals',
        description: 'Ensures every hit is a critical hit for maximum damage output.'
      },
      {
        icon: '⚡',
        title: 'Velocity',
        description: 'Reduces or eliminates knockback when you take damage from other players.'
      },
      {
        icon: '🔄',
        title: 'AntiKnockback',
        description: 'Prevents you from being pushed back when hit by players or mobs.'
      }
    ]
  },
  {
    icon: '🏃',
    title: 'Movement Hacks',
    description: 'Move faster, jump higher, and navigate any terrain with ease.',
    modules: [
      {
        icon: '💨',
        title: 'Speed',
        description: 'Move significantly faster than normal players while avoiding detection.'
      },
      {
        icon: '🦘',
        title: 'High Jump',
        description: 'Jump higher than vanilla limits allow, reaching previously inaccessible areas.'
      },
      {
        icon: '🧗',
        title: 'Spider',
        description: 'Climb any vertical surface as if it were a ladder.'
      },
      {
        icon: '🪂',
        title: 'NoFall',
        description: 'Eliminates fall damage regardless of height, keeping you safe from any drop.'
      },
      {
        icon: '🏊',
        title: 'Jesus',
        description: 'Walk on water and lava surfaces as if they were solid blocks.'
      },
      {
        icon: '✈️',
        title: 'Flight',
        description: 'Enables creative-like flying in survival mode with customizable speed and height.'
      }
    ]
  },
  {
    icon: '👁️',
    title: 'Visual Hacks',
    description: 'See through walls, locate valuable resources, and spot players from afar.',
    modules: [
      {
        icon: '🔍',
        title: 'ESP',
        description: 'Highlights players, mobs, and items through walls with customizable colors.'
      },
      {
        icon: '💎',
        title: 'X-Ray',
        description: 'See through blocks to locate valuable ores, hidden bases, and more.'
      },
      {
        icon: '🔆',
        title: 'Fullbright',
        description: 'Eliminates darkness, allowing you to see clearly even without torches.'
      },
      {
        icon: '📡',
        title: 'Tracers',
        description: 'Draws lines to important entities like players, making them easier to track.'
      },
      {
        icon: '🏷️',
        title: 'Nametags',
        description: 'Enhances and shows player nametags through walls with health information.'
      },
      {
        icon: '📦',
        title: 'ChestESP',
        description: 'Highlights storage containers through walls to quickly find valuable loot.'
      }
    ]
  }
];

/**
 * Testimonial data for dynamic rendering
 */
const testimonialsData = [
  {
    quote: 'Antry.gg completely changed my gameplay. The combat features are insanely smooth and the GUI is beautiful. I\'ve tried other clients but nothing comes close to this level of quality.',
    author: 'JDarkness',
    title: 'PvP Champion',
    avatar: 'JD',
    rating: 5
  },
  {
    quote: 'The client is flawless. I\'ve been using Antry for 6 months without any issues. The ESP and aimbot features give me perfect awareness in any situation.',
    author: 'Voxel_Master',
    title: 'Competitive Player',
    avatar: 'VX',
    rating: 5
  },
  {
    quote: 'Customer support is incredible. When I had an issue with a specific server, the team updated the client within hours. The movement hacks are so smooth that they\'re practically undetectable.',
    author: 'MineCrusher',
    title: 'Speedrunner',
    avatar: 'MC',
    rating: 5
  }
];

/**
 * Initialize testimonials functionality
 */
function initTestimonials() {
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  let interval; // Store interval reference for cleanup
  
  // Function to set up desktop behavior
  const setupDesktopBehavior = () => {
    // Clear any existing mobile interval
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    
    // Reset all cards
    testimonialCards.forEach(card => {
      card.classList.remove('expanded');
      card.classList.remove('active'); // Remove active class from all cards
    });
    
    // Remove the automatic selection of the first card
    // Testimonials will only become active on hover
  };
  
  // Function to set up mobile behavior
  const setupMobileBehavior = () => {
    // Clear any existing interval
    if (interval) {
      clearInterval(interval);
    }
    
    let currentIndex = 0;
    const cycleInterval = 5000;
    
    // Reset all cards initially
    testimonialCards.forEach(c => c.classList.remove('active'));
    
    // Don't set any card as active initially
    // Let the cycling function handle it
    
    const cycleTestimonials = () => {
      testimonialCards.forEach(c => c.classList.remove('active'));
      currentIndex = (currentIndex + 1) % testimonialCards.length;
      
      // Add active class with a smooth transition
      const card = testimonialCards[currentIndex];
      card.classList.add('active');
    };
    
    // Start the interval - run once immediately to set the first card active
    cycleTestimonials();
    interval = setInterval(cycleTestimonials, cycleInterval);
  };
  
  // Initial setup based on window width
  if (window.innerWidth < 768) {
    setupMobileBehavior();
  } else {
    setupDesktopBehavior();
  }
  
  // Handle window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
      setupMobileBehavior();
    } else {
      setupDesktopBehavior();
    }
  });
  
  // Add hover effect to testimonial cards with a small delay to prevent flickering
  testimonialCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      // Clear any existing timeouts
      clearTimeout(this.hoverTimeout);
      
      // Remove active class from all cards
      testimonialCards.forEach(c => c.classList.remove('active'));
      
      // Add active class to current card
      this.classList.add('active');
      
      // Pause the cycling on mobile
      if (interval) {
        clearInterval(interval);
      }
    });
    
    card.addEventListener('mouseleave', function() {
      // Set a small timeout to prevent flickering when moving between cards
      this.hoverTimeout = setTimeout(() => {
        if (!this.matches(':hover')) {
          this.classList.remove('active');
        }
      }, 100);
    });
  });
  
  // Add click event to expand testimonial on mobile
  testimonialCards.forEach(card => {
    card.addEventListener('click', function() {
      if (window.innerWidth < 768) {
        // Toggle expanded class
        const wasExpanded = this.classList.contains('expanded');
        
        // First collapse all cards
        testimonialCards.forEach(c => {
          c.classList.remove('expanded');
          c.classList.remove('active');
        });
        
        // Then expand the clicked card if it wasn't expanded before
        if (!wasExpanded) {
          this.classList.add('expanded');
          this.classList.add('active');
        }
        
        // Pause the cycling
        if (interval) {
          clearInterval(interval);
        }
      }
    });
  });
  
  // Resume the interval when leaving the testimonials section
  const testimonialsSection = document.querySelector('.testimonials-section');
  if (testimonialsSection) {
    testimonialsSection.addEventListener('mouseleave', () => {
      if (window.innerWidth < 768) {
        if (interval) {
          clearInterval(interval);
        }
        setupMobileBehavior();
      }
    });
  }
}

/**
 * Initialize CTA section animations
 */
function initCtaAnimations() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  // Function to animate counting
  function animateCounter(element, target, duration) {
    // Extract the numeric part from the target (e.g., "10,000+" -> 10000)
    let targetNum = parseInt(target.replace(/,/g, '').replace(/\+/g, ''));
    
    // Handle special case for "24/7"
    if (target === "24/7") {
      element.textContent = target;
      return;
    }
    
    // For percentage values
    const isPercentage = target.includes('%');
    if (isPercentage) {
      targetNum = parseFloat(target);
    }
    
    const startTime = performance.now();
    const startValue = 0;
    
    function updateNumber(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing function for smoother animation
      const easedProgress = 1 - Math.pow(1 - progress, 2); // Changed from cubic to quadratic for faster feel
      
      let currentValue = Math.floor(startValue + (targetNum - startValue) * easedProgress);
      
      // Format the number with commas
      let formattedValue = currentValue.toLocaleString();
      
      // Add percentage sign if needed
      if (isPercentage) {
        formattedValue = currentValue.toFixed(1) + '%';
      }
      
      // Add plus sign if original had it
      if (target.includes('+')) {
        formattedValue += '+';
      }
      
      element.textContent = formattedValue;
      
      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    }
    
    requestAnimationFrame(updateNumber);
  }
  
  // Intersection Observer to trigger animation when stats are visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetValue = entry.target.textContent;
        animateCounter(entry.target, targetValue, 1000); // Reduced from 2000ms to 1000ms
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });
  
  statNumbers.forEach(stat => {
    observer.observe(stat);
  });
}

/**
 * Initialize animations for download options
 */
function initDownloadOptions() {
  const downloadOptions = document.querySelectorAll('.download-option');
  const downloadSection = document.querySelector('.download-section');
  
  // Add intersection observer to trigger animations when section comes into view
  if (downloadSection) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        downloadOptions.forEach((option, index) => {
          // Reset any existing animations
          option.style.opacity = '0';
          option.style.transform = 'translateY(20px)';
          
          // Force browser to recognize the reset
          void option.offsetWidth;
          
          // Add animation with staggered delay
          setTimeout(() => {
            option.style.opacity = '1';
            option.style.transform = 'translateY(0)';
          }, 150 * (index + 1));
        });
        
        observer.unobserve(downloadSection);
      }
    }, {
      threshold: 0.2
    });
    
    observer.observe(downloadSection);
  }
  
  downloadOptions.forEach(option => {
    // Simple hover effects
    option.addEventListener('mouseenter', function() {
      // Ensure icon is displayed correctly
      const iconElement = this.querySelector('.download-option-icon');
      if (iconElement) {
        iconElement.style.transform = 'scale(1.1)';
      }
      
      // Animate the download button
      const downloadBtn = this.querySelector('.btn');
      if (downloadBtn) {
        downloadBtn.style.transform = 'scale(1.05)';
        downloadBtn.style.boxShadow = '0 0 10px var(--primary-color)';
      }
    });
    
    option.addEventListener('mouseleave', function() {
      // Reset icon
      const iconElement = this.querySelector('.download-option-icon');
      if (iconElement) {
        iconElement.style.transform = '';
      }
      
      // Reset the download button
      const downloadBtn = this.querySelector('.btn');
      if (downloadBtn) {
        downloadBtn.style.transform = '';
        downloadBtn.style.boxShadow = '';
      }
    });
  });
}

// Client GUI functionality
function initClientGUI() {
  // Client menu navigation
  const menuItems = document.querySelectorAll('.client-menu-item');
  
  if (menuItems.length) {
    menuItems.forEach(item => {
      item.addEventListener('click', function() {
        // Remove active class from all menu items
        menuItems.forEach(i => i.classList.remove('active'));
        
        // Add active class to clicked item
        this.classList.add('active');
        
        // Get the panel to show
        const panelId = this.getAttribute('data-panel');
        
        // Hide all panels
        const panels = document.querySelectorAll('.client-panel');
        panels.forEach(panel => panel.classList.remove('active'));
        
        // Show the selected panel
        const selectedPanel = document.getElementById(panelId);
        if (selectedPanel) {
          selectedPanel.classList.add('active');
        }
      });
    });
  }
  
  // Interactive sliders
  const sliders = document.querySelectorAll('.client-slider');
  
  if (sliders.length) {
    sliders.forEach(slider => {
      const sliderFill = slider.querySelector('.client-slider-fill');
      const sliderHandle = slider.querySelector('.client-slider-handle');
      const valueDisplay = slider.parentElement.querySelector('.client-value');
      
      // Make slider interactive
      slider.addEventListener('mousedown', startSliderDrag);
      slider.addEventListener('click', updateSliderValue);
      
      function startSliderDrag(e) {
        e.preventDefault();
        document.addEventListener('mousemove', moveSlider);
        document.addEventListener('mouseup', stopSliderDrag);
        
        moveSlider(e);
      }
      
      function moveSlider(e) {
        const sliderRect = slider.getBoundingClientRect();
        let percentage = (e.clientX - sliderRect.left) / sliderRect.width;
        
        // Clamp percentage between 0 and 1
        percentage = Math.max(0, Math.min(1, percentage));
        
        updateSlider(percentage);
      }
      
      function stopSliderDrag() {
        document.removeEventListener('mousemove', moveSlider);
        document.removeEventListener('mouseup', stopSliderDrag);
      }
      
      function updateSliderValue(e) {
        const sliderRect = slider.getBoundingClientRect();
        let percentage = (e.clientX - sliderRect.left) / sliderRect.width;
        
        // Clamp percentage between 0 and 1
        percentage = Math.max(0, Math.min(1, percentage));
        
        updateSlider(percentage);
      }
      
      function updateSlider(percentage) {
        // Update slider fill and handle position
        sliderFill.style.width = `${percentage * 100}%`;
        sliderHandle.style.left = `${percentage * 100}%`;
        
        // Update value display
        if (valueDisplay) {
          // Check if value should be displayed as percentage or number
          if (valueDisplay.textContent.includes('%')) {
            valueDisplay.textContent = `${Math.round(percentage * 100)}%`;
          } else {
            // For numeric values (like range), calculate based on a scale (e.g., 0-5)
            const min = 0;
            const max = 5;
            const value = min + percentage * (max - min);
            valueDisplay.textContent = value.toFixed(1);
          }
        }
      }
    });
  }
  
  // Toggle switches
  const toggles = document.querySelectorAll('.client-toggle input');
  
  if (toggles.length) {
    toggles.forEach(toggle => {
      toggle.addEventListener('change', function() {
        const moduleName = this.closest('.client-module-header').querySelector('.client-module-name').textContent;
        console.log(`${moduleName} is now ${this.checked ? 'enabled' : 'disabled'}`);
        
        // Add visual feedback when toggled
        const module = this.closest('.client-module');
        module.style.transition = 'all 0.2s ease';
        
        if (this.checked) {
          module.style.borderColor = 'var(--primary-color)';
          module.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.2)';
          
          setTimeout(() => {
            module.style.borderColor = '';
            module.style.boxShadow = '';
          }, 500);
        }
      });
    });
  }
  
  // Module headers (collapsible)
  const moduleHeaders = document.querySelectorAll('.client-module-header');
  
  if (moduleHeaders.length) {
    moduleHeaders.forEach(header => {
      header.addEventListener('click', function(e) {
        // Don't collapse if clicking on the toggle
        if (e.target.closest('.client-toggle')) return;
        
        const module = this.closest('.client-module');
        const settings = module.querySelector('.client-module-settings');
        
        // Toggle settings visibility
        if (settings.style.display === 'none') {
          settings.style.display = 'block';
        } else {
          settings.style.display = 'none';
        }
      });
    });
  }
  
  // Set current year in footer copyright
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// Feature Card Modal Functionality
function initFeatureCardModals() {
  // Get all feature cards
  const featureCards = document.querySelectorAll('.feature-card');
  const modalContainers = document.querySelectorAll('.modal-container');
  const modalCloseButtons = document.querySelectorAll('.modal-close');
  
  // Add click event to each feature card
  featureCards.forEach(card => {
    card.addEventListener('click', function() {
      const modalId = this.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      
      if (modal) {
        openModal(modal);
      }
    });
    
    // Add keyboard accessibility
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const modalId = this.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        
        if (modal) {
          openModal(modal);
        }
      }
    });
  });
  
  // Close modal when clicking the close button
  modalCloseButtons.forEach(button => {
    button.addEventListener('click', function() {
      const modal = this.closest('.modal-container');
      closeModal(modal);
    });
  });
  
  // Close modal when clicking outside the modal content
  modalContainers.forEach(container => {
    container.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal(this);
      }
    });
  });
  
  // Close modal when pressing ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-container.active');
      if (activeModal) {
        closeModal(activeModal);
      }
    }
  });
  
  // Function to open modal
  function openModal(modal) {
    // Open the modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    // Add staggered animation to module cards
    const moduleCards = modal.querySelectorAll('.module-card');
    moduleCards.forEach((card, index) => {
      card.style.animationDelay = `${0.1 + (index * 0.05)}s`;
      
      // Add keyboard navigation to module cards
      card.setAttribute('tabindex', '0');
    });
    
    // Focus the first module card after a short delay (for animation)
    setTimeout(() => {
      const firstModuleCard = modal.querySelector('.module-card');
      if (firstModuleCard) {
        firstModuleCard.focus();
      }
    }, 500);
    
    // Add keyboard navigation within the modal
    setupModalKeyboardNavigation(modal);
  }
  
  // Function to close modal
  function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
    
    // Return focus to the feature card that opened the modal
    const modalId = modal.id;
    const featureCard = document.querySelector(`.feature-card[data-modal="${modalId}"]`);
    if (featureCard) {
      featureCard.focus();
    }
  }
  
  // Function to setup keyboard navigation within the modal
  function setupModalKeyboardNavigation(modal) {
    const moduleCards = Array.from(modal.querySelectorAll('.module-card'));
    const closeButton = modal.querySelector('.modal-close');
    
    // Add keyboard navigation to module cards
    moduleCards.forEach((card, index) => {
      card.addEventListener('keydown', function(e) {
        switch (e.key) {
          case 'ArrowRight':
            e.preventDefault();
            if (index < moduleCards.length - 1) {
              moduleCards[index + 1].focus();
            }
            break;
          case 'ArrowLeft':
            e.preventDefault();
            if (index > 0) {
              moduleCards[index - 1].focus();
            }
            break;
          case 'ArrowUp':
            e.preventDefault();
            if (index >= 3) {
              moduleCards[index - 3].focus();
            } else {
              closeButton.focus();
            }
            break;
          case 'ArrowDown':
            e.preventDefault();
            if (index + 3 < moduleCards.length) {
              moduleCards[index + 3].focus();
            }
            break;
          case 'Escape':
            e.preventDefault();
            closeModal(modal);
            break;
        }
      });
    });
    
    // Add keyboard handling to close button
    if (closeButton) {
      closeButton.setAttribute('tabindex', '0');
      closeButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          closeModal(modal);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          moduleCards[0].focus();
        }
      });
    }
  }
}

/**
 * Renders feature cards in the features section
 */
function renderFeatures() {
  const featuresContainer = document.querySelector('.features-grid');
  if (!featuresContainer) return;

  // Check if we need to dynamically render the feature cards
  // If the container already has feature cards with data-modal attributes, we don't need to render them
  const existingCards = featuresContainer.querySelectorAll('.feature-card[data-modal]');
  if (existingCards.length > 0) {
    // Just add the animate-on-scroll class to existing cards if needed
    existingCards.forEach(card => {
      if (!card.classList.contains('animate-on-scroll')) {
        card.classList.add('animate-on-scroll');
      }
    });
    return;
  }

  // If no existing cards, render them dynamically
  featuresContainer.innerHTML = '';

  featuresData.forEach((feature, index) => {
    const featureCard = document.createElement('div');
    featureCard.className = 'feature-card animate-on-scroll';
    featureCard.setAttribute('data-modal', `${feature.title.toLowerCase().replace(/\s+/g, '-')}-modal`);
    
    featureCard.innerHTML = `
      <div class="feature-icon">${feature.icon}</div>
      <h3>${feature.title}</h3>
      <p>${feature.description}</p>
    `;
    
    featuresContainer.appendChild(featureCard);
  });
  
  // After rendering feature cards, update modals with current data
  updateFeatureModals();
}

/**
 * Updates existing modals with current module data or creates new ones if needed
 */
function updateFeatureModals() {
  // Check for existing modals
  featuresData.forEach(feature => {
    const modalId = `${feature.title.toLowerCase().replace(/\s+/g, '-')}-modal`;
    let modal = document.getElementById(modalId);
    
    // If modal exists, update its content
    if (modal) {
      const moduleGrid = modal.querySelector('.module-grid');
      if (moduleGrid && feature.modules) {
        // Only update if the module data structure exists
        moduleGrid.innerHTML = feature.modules.map(module => `
          <div class="module-card" data-title="${module.title}">
            <div class="module-icon">${module.icon}</div>
            <h4>${module.title}</h4>
            <p>${module.description}</p>
          </div>
        `).join('');
        
        // Add click event to module cards
        addModuleCardInteractivity(moduleGrid);
      }
    } else {
      // If modal doesn't exist, create it
      createFeatureModal(feature);
    }
  });
}

/**
 * Creates a single feature modal
 */
function createFeatureModal(feature) {
  const modalId = `${feature.title.toLowerCase().replace(/\s+/g, '-')}-modal`;
  
  // Create modal container
  const modalContainer = document.createElement('div');
  modalContainer.className = 'modal-container';
  modalContainer.id = modalId;
  
  // Create modal content
  modalContainer.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>${feature.icon} ${feature.title}</h3>
        <span class="modal-close">&times;</span>
      </div>
      <div class="modal-body">
        <div class="module-grid">
          ${feature.modules.map(module => `
            <div class="module-card" data-title="${module.title}">
              <div class="module-icon">${module.icon}</div>
              <h4>${module.title}</h4>
              <p>${module.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  
  // Append modal to body
  document.body.appendChild(modalContainer);
  
  // Add event listener to close button
  const closeButton = modalContainer.querySelector('.modal-close');
  if (closeButton) {
    closeButton.addEventListener('click', function() {
      modalContainer.classList.remove('active');
      document.body.style.overflow = ''; // Restore scrolling
    });
  }
  
  // Add event listener to close when clicking outside
  modalContainer.addEventListener('click', function(e) {
    if (e.target === this) {
      this.classList.remove('active');
      document.body.style.overflow = ''; // Restore scrolling
    }
  });
  
  // Add interactivity to module cards
  const moduleGrid = modalContainer.querySelector('.module-grid');
  if (moduleGrid) {
    addModuleCardInteractivity(moduleGrid);
  }
}

/**
 * Adds click and hover interactivity to module cards
 */
function addModuleCardInteractivity(moduleGrid) {
  const moduleCards = moduleGrid.querySelectorAll('.module-card');
  
  moduleCards.forEach(card => {
    // Add click effect
    card.addEventListener('click', function() {
      // Create a ripple effect
      const ripple = document.createElement('div');
      ripple.className = 'ripple-effect';
      this.appendChild(ripple);
      
      // Position the ripple at click position
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
      
      // Remove ripple after animation completes
      setTimeout(() => {
        ripple.remove();
      }, 600);
      
      // Toggle expanded state
      this.classList.toggle('expanded');
      
      // Reset other cards
      moduleCards.forEach(otherCard => {
        if (otherCard !== this) {
          otherCard.classList.remove('expanded');
        }
      });
    });
  });
}

/**
 * Initialize particles in the features section
 */
function initFeatureParticles() {
  const featuresSection = document.querySelector('.features-section');
  if (!featuresSection) return;
  
  // Number of particles to create
  const particleCount = 15;
  
  // Create particles
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Random position
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    
    // Random opacity
    particle.style.opacity = (Math.random() * 0.2 + 0.1).toString();
    
    // Random animation delay
    const delay = Math.random() * 10;
    particle.style.animationDelay = `${delay}s`;
    
    featuresSection.appendChild(particle);
  }
}
