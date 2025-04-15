        // Testimonial Slider
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        const sliderDots = document.querySelectorAll('.slider-dot');
        let currentIndex = 0;
        
        function showTestimonial(index) {
            testimonialCards.forEach(card => {
                card.classList.remove('active');
            });
            
            sliderDots.forEach(dot => {
                dot.classList.remove('active');
            });
            
            testimonialCards[index].classList.add('active');
            sliderDots[index].classList.add('active');
            currentIndex = index;
        }
        
        sliderDots.forEach(dot => {
            dot.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                showTestimonial(parseInt(index));
            });
        });
        
        // Auto-rotate testimonials
        setInterval(() => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= testimonialCards.length) {
                nextIndex = 0;
            }
            showTestimonial(nextIndex);
        }, 5000);
        
        // Mobile Menu Toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
        
        // Smooth Scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70,
                        behavior: 'smooth'
                    });
                    
                    // Update active link
                    document.querySelectorAll('.nav-links a').forEach(link => {
                        link.classList.remove('active');
                    });
                    this.classList.add('active');
                    
                    // Hide mobile menu if open
                    if (window.innerWidth <= 768) {
                        navLinks.classList.remove('show');
                    }
                }
            });
        });
        
        // Highlight active navigation item on scroll
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section');
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });
            
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
        
        // Animation on scroll
        function checkVisibility() {
            const featureCards = document.querySelectorAll('.feature-card');
            const platformFeatures = document.querySelectorAll('.platform-feature');
            
            [...featureCards, ...platformFeatures].forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.3;
                
                if (elementPosition < screenPosition) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        }
        
        window.addEventListener('scroll', checkVisibility);
        window.addEventListener('load', checkVisibility);