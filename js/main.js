document.addEventListener('DOMContentLoaded', function() {
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

    // Búsqueda Tabs
    const searchTabs = document.querySelectorAll('.search-tab');
    const searchForms = document.querySelectorAll('.search-form');

    searchTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Desactivar todas las pestañas y formularios
            searchTabs.forEach(t => t.classList.remove('active'));
            searchForms.forEach(form => form.classList.remove('active'));
            
            // Activar la pestaña seleccionada
            this.classList.add('active');
            
            // Activar el formulario correspondiente
            const formId = `${this.getAttribute('data-tab')}-form`;
            document.getElementById(formId).classList.add('active');
        });
    });

    // Validación de formularios de búsqueda
    const allSearchForms = document.querySelectorAll('.search-form');
    
    allSearchForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Verificar campos requeridos
            let isValid = true;
            const inputs = this.querySelectorAll('input[type="text"], input[type="date"]');
            
            inputs.forEach(input => {
                if (!input.value) {
                    isValid = false;
                    input.style.borderColor = '#ff3860';
                    
                    // Crear mensaje de error si no existe
                    let errorMsg = input.parentElement.querySelector('.error-message');
                    if (!errorMsg) {
                        errorMsg = document.createElement('p');
                        errorMsg.classList.add('error-message');
                        errorMsg.style.color = '#ff3860';
                        errorMsg.style.fontSize = '0.8rem';
                        errorMsg.style.marginTop = '5px';
                        input.parentElement.appendChild(errorMsg);
                    }
                    errorMsg.textContent = 'Este campo es obligatorio';
                } else {
                    input.style.borderColor = '#ddd';
                    const errorMsg = input.parentElement.querySelector('.error-message');
                    if (errorMsg) errorMsg.remove();
                }
            });
            
            // Validar fechas (la fecha de regreso debe ser posterior a la de salida)
            if (this.id === 'flights-form' || this.id === 'packages-form') {
                const departDate = this.querySelector(`#${this.id.split('-')[0]}-date-depart`).value;
                const returnDate = this.querySelector(`#${this.id.split('-')[0]}-date-return`).value;
                
                if (departDate && returnDate && new Date(departDate) >= new Date(returnDate)) {
                    isValid = false;
                    const returnInput = this.querySelector(`#${this.id.split('-')[0]}-date-return`);
                    returnInput.style.borderColor = '#ff3860';
                    
                    // Crear mensaje de error para la fecha
                    let errorMsg = returnInput.parentElement.querySelector('.error-message');
                    if (!errorMsg) {
                        errorMsg = document.createElement('p');
                        errorMsg.classList.add('error-message');
                        errorMsg.style.color = '#ff3860';
                        errorMsg.style.fontSize = '0.8rem';
                        errorMsg.style.marginTop = '5px';
                        returnInput.parentElement.appendChild(errorMsg);
                    }
                    errorMsg.textContent = 'La fecha de regreso debe ser posterior a la de salida';
                }
            }
            
            // Si todo es válido, mostrar un mensaje de éxito
            if (isValid) {
                // Opcional: Mostrar mensaje de éxito o redirigir a resultados de búsqueda
                showSearchResults(this.id);
            }
        });
    });

    // Establecer fechas mínimas en campos de fecha (hoy para salida, mañana para regreso)
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    const allDateInputs = document.querySelectorAll('input[type="date"]');
    
    allDateInputs.forEach(input => {
        const inputId = input.id;
        
        // Si es un campo de fecha de salida/entrada
        if (inputId.includes('depart') || inputId.includes('check-in')) {
            input.setAttribute('min', formatDate(today));
            if (!input.value) input.value = formatDate(today);
        }
        // Si es un campo de fecha de regreso/salida
        else if (inputId.includes('return') || inputId.includes('check-out')) {
            input.setAttribute('min', formatDate(tomorrow));
            if (!input.value) input.value = formatDate(tomorrow);
        }
        // Para actividades, usar la fecha actual como mínimo
        else {
            input.setAttribute('min', formatDate(today));
            if (!input.value) input.value = formatDate(today);
        }
    });

    // Función para simular resultados de búsqueda
    function showSearchResults(formId) {
        // Crear un elemento para mostrar un mensaje de "buscando"
        const searchingMessage = document.createElement('div');
        searchingMessage.classList.add('searching-message');
        searchingMessage.style.textAlign = 'center';
        searchingMessage.style.padding = '1rem';
        searchingMessage.style.marginTop = '1rem';
        searchingMessage.innerHTML = '<p style="margin-bottom: 10px;">Buscando las mejores opciones para ti...</p>' +
                                    '<div class="spinner" style="display: inline-block; width: 30px; height: 30px; border: 3px solid rgba(0, 85, 164, 0.3); border-radius: 50%; border-top-color: #0055a4; animation: spin 1s linear infinite;"></div>';
        
        // Agregar estilos para la animación del spinner
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        // Agregar el mensaje al formulario
        const form = document.getElementById(formId);
        const existingMessage = form.querySelector('.searching-message, .success-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        form.appendChild(searchingMessage);
        
        // Simular tiempo de carga
        setTimeout(() => {
            searchingMessage.remove();
            
            // Mostrar mensaje de éxito
            const successMessage = document.createElement('div');
            successMessage.classList.add('success-message');
            successMessage.style.backgroundColor = 'rgba(0, 85, 164, 0.1)';
            successMessage.style.borderLeft = '4px solid #0055a4';
            successMessage.style.padding = '1rem';
            successMessage.style.marginTop = '1rem';
            successMessage.style.borderRadius = '5px';
            
            switch (formId) {
                case 'flights-form':
                    successMessage.innerHTML = '<p>¡Hemos encontrado <strong>32 vuelos</strong> que coinciden con tu búsqueda!</p>';
                    break;
                case 'hotels-form':
                    successMessage.innerHTML = '<p>¡Hemos encontrado <strong>56 hoteles</strong> disponibles para tus fechas!</p>';
                    break;
                case 'packages-form':
                    successMessage.innerHTML = '<p>¡Hemos encontrado <strong>18 paquetes</strong> que se ajustan a tus necesidades!</p>';
                    break;
                case 'activities-form':
                    successMessage.innerHTML = '<p>¡Hemos encontrado <strong>24 actividades</strong> para disfrutar en tu destino!</p>';
                    break;
            }
            
            form.appendChild(successMessage);
        }, 2000);
    }

    // Implementar modo oscuro
    const createThemeToggle = () => {
        // Crear el botón de cambio de tema
        const themeToggle = document.createElement('div');
        themeToggle.classList.add('theme-toggle');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        document.body.appendChild(themeToggle);
        
        // Verificar si hay una preferencia guardada
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        
        // Evento para cambiar el tema
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                localStorage.setItem('theme', 'light');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
        });
    };
    
    createThemeToggle();

    // Autocomplete para destinos populares
    const popularDestinations = [
        'Madrid, España', 'Barcelona, España', 'Sevilla, España', 'Valencia, España',
        'Nueva York, USA', 'París, Francia', 'Londres, Reino Unido', 'Roma, Italia',
        'Tokio, Japón', 'Cancún, México', 'Punta Cana, República Dominicana',
        'Buenos Aires, Argentina', 'Río de Janeiro, Brasil', 'Sídney, Australia'
    ];

    function setupAutocomplete(inputId) {
        const input = document.getElementById(inputId);
        if (!input) return;
        
        // Crear contenedor de sugerencias
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.classList.add('suggestions-container');
        suggestionsContainer.style.position = 'absolute';
        suggestionsContainer.style.width = '100%';
        suggestionsContainer.style.maxHeight = '200px';
        suggestionsContainer.style.overflowY = 'auto';
        suggestionsContainer.style.backgroundColor = 'white';
        suggestionsContainer.style.boxShadow = '0 5px 10px rgba(0,0,0,0.2)';
        suggestionsContainer.style.zIndex = '10';
        suggestionsContainer.style.borderRadius = '0 0 5px 5px';
        suggestionsContainer.style.display = 'none';
        
        input.parentElement.style.position = 'relative';
        input.parentElement.appendChild(suggestionsContainer);
        
        // Evento de input para mostrar sugerencias
        input.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            if (query.length < 2) {
                suggestionsContainer.style.display = 'none';
                return;
            }
            
            // Filtrar destinos que coincidan con la consulta
            const matches = popularDestinations.filter(dest => 
                dest.toLowerCase().includes(query)
            );
            
            if (matches.length > 0) {
                suggestionsContainer.innerHTML = '';
                matches.forEach(match => {
                    const suggestion = document.createElement('div');
                    suggestion.classList.add('suggestion-item');
                    suggestion.textContent = match;
                    suggestion.style.padding = '10px 15px';
                    suggestion.style.cursor = 'pointer';
                    suggestion.style.borderBottom = '1px solid #eee';
                    
                    suggestion.addEventListener('mouseenter', function() {
                        this.style.backgroundColor = '#f5f9ff';
                    });
                    
                    suggestion.addEventListener('mouseleave', function() {
                        this.style.backgroundColor = 'white';
                    });
                    
                    suggestion.addEventListener('click', function() {
                        input.value = this.textContent;
                        suggestionsContainer.style.display = 'none';
                    });
                    
                    suggestionsContainer.appendChild(suggestion);
                });
                suggestionsContainer.style.display = 'block';
            } else {
                suggestionsContainer.style.display = 'none';
            }
        });
        
        // Cerrar sugerencias al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (e.target !== input) {
                suggestionsContainer.style.display = 'none';
            }
        });
    }
    
    // Configurar autocompletado para campos de destino/origen
    setupAutocomplete('flight-origin');
    setupAutocomplete('flight-destination');
    setupAutocomplete('hotel-destination');
    setupAutocomplete('package-origin');
    setupAutocomplete('package-destination');
    setupAutocomplete('activity-destination');
});