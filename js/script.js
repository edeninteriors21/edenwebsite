/* Eden Interiors - Premium Interactions */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Logic
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Animate toggle icon
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // 2. Scroll Animation (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-up').forEach(el => scrollObserver.observe(el));


    // 3. Project Modal Logic
    const modal = document.getElementById('project-modal');
    const modalImg = document.getElementById('modal-img');
    const modalClose = document.getElementById('modal-close');
    const modalTriggers = document.querySelectorAll('.project-modal-trigger');

    if (modal) {
        modalTriggers.forEach(btn => {
            btn.addEventListener('click', () => {
                const imgSrc = btn.getAttribute('data-img');
                if (imgSrc) {
                    modalImg.src = imgSrc;
                    modal.style.display = 'flex';
                    // Force reflow for transition
                    void modal.offsetWidth;
                    modal.style.opacity = '1';
                    document.body.style.overflow = 'hidden'; // Lock scroll
                }
            });
        });

        const closeModal = () => {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = ''; // Unlock scroll
            }, 300);
        };

        modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
        });
    }


    // 4. Particle System (Interactive & Leaf Vibe)
    const particleContainer = document.getElementById('particles-js');
    if (particleContainer) {
        const particleCount = 160; // Doubled again (Optimized)
        const particles = [];

        for (let i = 0; i < particleCount; i++) {
            particles.push(createParticle(particleContainer));
        }

        // Mouse Interaction (Optimized with requestAnimationFrame)
        let mouseX = 0, mouseY = 0;
        let isMoving = false;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!isMoving) {
                isMoving = true;
                requestAnimationFrame(updateParticles);
            }
        });

        function updateParticles() {
            particles.forEach(p => {
                // Get particle center position relative to viewport
                const rect = p.wrapper.getBoundingClientRect();
                const pX = rect.left + rect.width / 2;
                const pY = rect.top + rect.height / 2;

                const dx = pX - mouseX;
                const dy = pY - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                const repelDist = 150; // Interaction radius

                if (dist < repelDist) {
                    // Calculate repel vector
                    const angle = Math.atan2(dy, dx);
                    const force = (repelDist - dist) / repelDist; // Stronger closer to mouse
                    const moveX = Math.cos(angle) * force * 100; // Max 100px move
                    const moveY = Math.sin(angle) * force * 100;

                    // Apply transform to inner leaf
                    p.inner.style.transform = `translate(${moveX}px, ${moveY}px)`;
                } else {
                    // Reset
                    p.inner.style.transform = `translate(0, 0)`;
                }
            });
            isMoving = false;
        }
    }

    function createParticle(container) {
        // Wrapper for Float Animation
        const wrapper = document.createElement('div');
        wrapper.classList.add('particle-wrapper');

        // Inner for Leaf Shape & Interaction
        const leaf = document.createElement('div');
        leaf.classList.add('leaf-particle');

        wrapper.appendChild(leaf);

        // Random Properties
        const size = Math.random() * 20 + 10;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 15 + 10;
        const rotation = Math.random() * 360;

        // Styles on Wrapper
        wrapper.style.width = `${size}px`;
        wrapper.style.height = `${size}px`;
        wrapper.style.left = `${posX}%`;
        wrapper.style.top = `${posY}%`;

        // Float Animation on Wrapper
        wrapper.style.animation = `float ${duration}s linear infinite`;
        wrapper.style.animationDelay = `-${delay}s`;

        // Static rotation on inner leaf so it doesn't spin wildly with interaction
        leaf.style.transform = `rotate(${rotation}deg)`;

        container.appendChild(wrapper);

        return { wrapper, inner: leaf };
    }

    // Keyframes for floating leaves (tumbling effect)
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes float {
            0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.2; }
            33% { transform: translateY(-50px) translateX(30px) rotate(120deg); opacity: 0.5; }
            66% { transform: translateY(-100px) translateX(-20px) rotate(240deg); opacity: 0.3; }
            100% { transform: translateY(-150px) translateX(10px) rotate(360deg); opacity: 0.1; }
        }
    `;
    document.head.appendChild(styleSheet);


    // 5. Page Transition & Loader Logic (Scatter Effect)

    // Fade In on Load
    document.body.classList.add('fade-in');

    const loader = document.querySelector('.page-loader');
    if (loader) {
        // Generate Scatter Leaves
        const leafCount = 50;

        for (let i = 0; i < leafCount; i++) {
            const leaf = document.createElement('div');
            leaf.classList.add('scatter-leaf');

            // Random Start Position
            const startX = Math.random() * 100;
            const startY = Math.random() * 100;
            leaf.style.left = `${startX}%`;
            leaf.style.top = `${startY}%`;
            leaf.style.transform = `rotate(${Math.random() * 360}deg)`;

            // Random Scatter Destination (Fly outward significantly)
            // Calculate vector from center (50, 50) to start pos
            // If pos is 50,50, pick random.
            let dirX = startX - 50;
            let dirY = startY - 50;
            if (dirX === 0 && dirY === 0) dirX = 1;

            // Multiply direction to ensuring they fly off screen
            const tx = dirX * (5 + Math.random() * 5); // 500% movement roughly
            const ty = dirY * (5 + Math.random() * 5);
            const r = Math.random() * 720 - 360; // Spin

            leaf.style.setProperty('--tx', `${tx}vw`);
            leaf.style.setProperty('--ty', `${ty}vh`);
            leaf.style.setProperty('--r', `${r}deg`);

            loader.appendChild(leaf);
        }

        // Trigger Scatter Faster
        setTimeout(() => {
            loader.classList.add('loaded');
        }, 100); // 100ms delay: Instant effect
    }

    // Fade Out on Link Click
    // Fade Out on Link Click - Removed for instant navigation
    /*
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');

            // Only internal links, not anchors or js
            if (href && !href.startsWith('#') && !href.startsWith('mailto') && !href.startsWith('tel')) {
                e.preventDefault();
                document.body.style.opacity = '0';

                setTimeout(() => {
                    window.location.href = href;
                }, 500); // Wait for transition
            }
        });
    });
    */

    // 6. Hero Background Slideshow
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length > 0) {
        let currentSlide = 0;

        const nextSlide = () => {
            // Remove active from current
            slides[currentSlide].classList.remove('active');

            // Increment
            currentSlide = (currentSlide + 1) % slides.length;

            // Add active to new
            slides[currentSlide].classList.add('active');
        };

        setInterval(nextSlide, 5000);
    }

    /* --- Service Details Page Logic --- */
    const serviceData = {
        kitchen: {
            title: "Modular Kitchen",
            subtitle: "Transform your kitchen into a functional and beautiful space with our custom modular solutions",
            heading: "Revolutionize Your Cooking Space",
            desc: `
                <p>At Eden Interiors, we understand that the kitchen is the heart of your home. Our modular kitchen solutions combine innovative design, premium materials, and functional layouts to create a space that reflects your lifestyle and enhances your culinary experience.</p>
                <p>With years of expertise in kitchen design, we offer customized solutions that maximize space utilization while maintaining aesthetic appeal. From compact apartments to spacious villas, we create kitchens that are both beautiful and practical.</p>
                <p>Our team works closely with you to understand your needs, preferences, and budget, ensuring that the final result exceeds your expectations in both form and function.</p>
            `,
            features: [
                { icon: "fa-ruler-combined", title: "Customized Design", text: "Every kitchen is tailored to your space, preferences, and cooking habits for optimal functionality." },
                { icon: "fa-shield-alt", title: "Premium Materials", text: "We use high-quality, durable materials that withstand daily use and maintain their beauty for years." },
                { icon: "fa-tools", title: "Expert Craftsmanship", text: "Our skilled artisans pay attention to every detail, ensuring flawless execution of your kitchen design." },
                { icon: "fa-clock", title: "Timely Completion", text: "We respect your time and complete projects within the agreed timeline without compromising quality." },
                { icon: "fa-tags", title: "Competitive Pricing", text: "Get premium quality at competitive prices with transparent costing and no hidden charges." }
            ],
            images: ["assets/images/kitchen1.jpg", "assets/images/kitchen2.jpg", "assets/images/kitchen3.jpg", "assets/images/kitchen4.jpg", "assets/images/kitchen5.jpg"]
        },
        wardrobe: {
            title: "Wardrobe Solutions",
            subtitle: "Transform your storage spaces with beautifully designed, custom-made wardrobes that combine style and functionality",
            heading: "Elevate Your Storage Solutions",
            desc: `
                <p>At Eden Interiors, we believe that a well-organized wardrobe is essential for a clutter-free home. Our custom wardrobe solutions are designed to maximize your storage space while adding elegance to your interiors.</p>
                <p>With meticulous attention to detail and understanding of modern storage needs, we create wardrobes that are not just furniture but personal storage systems tailored to your lifestyle, clothing collection, and space constraints.</p>
                <p>From walk-in closets to compact bedroom wardrobes, our designs incorporate smart storage solutions, premium finishes, and functional layouts that make organization effortless and style undeniable.</p>
            `,
            features: [
                { icon: "fa-expand-arrows-alt", title: "Space Optimization", text: "Maximize every inch of your available space with custom-designed wardrobes that fit perfectly, even in awkward corners." },
                { icon: "fa-box-open", title: "Smart Organization", text: "Integrated shelves, hanging rods, drawers, and accessories designed specifically for your clothing and accessories." },
                { icon: "fa-paint-brush", title: "Custom Finishes", text: "Choose from a wide range of materials, colors, and finishes that complement your bedroom decor and personal style." },
                { icon: "fa-door-open", title: "Innovative Doors", text: "Sliding, hinged, or folding doors with premium hardware that ensures smooth operation and longevity." },
                { icon: "fa-lightbulb", title: "Integrated Lighting", text: "LED lighting solutions that illuminate your wardrobe interiors, making it easy to find what you need." },
                { icon: "fa-gem", title: "Premium Materials", text: "We use only high-quality, durable materials that withstand daily use and maintain their beauty for years to come." }
            ],
            images: ["assets/images/w1.jpg", "assets/images/w2.jpg", "assets/images/w3.jpg", "assets/images/w4.jpg", "assets/images/w5.jpg"]
        },
        study: {
            title: "Study Tables",
            subtitle: "Ergonomic and stylish study tables designed to enhance productivity and learning",
            heading: "Create Your Perfect Study Space",
            desc: `
                <p>At Eden Interiors, we believe that the right study environment significantly impacts learning and productivity. Our custom study tables are designed with both aesthetics and functionality in mind, creating spaces where creativity flows and concentration thrives.</p>
                <p>From students preparing for exams to professionals working from home, our study tables are engineered to support good posture, provide ample storage, and reduce clutter. We understand that every individual has unique needs, which is why we offer completely customizable solutions.</p>
                <p>Our designs incorporate smart storage solutions, cable management systems, and ergonomic considerations to create study tables that are not just furniture, but productivity partners.</p>
            `,
            features: [
                { icon: "fa-chair", title: "Ergonomic Design", text: "Tables designed with proper height, depth, and support to maintain good posture during long study sessions." },
                { icon: "fa-crop-alt", title: "Customizable Dimensions", text: "Available in various sizes and shapes to fit any room, from compact corners to spacious study rooms." },
                { icon: "fa-archive", title: "Smart Storage", text: "Integrated drawers, shelves, and compartments to keep study materials organized and accessible." },
                { icon: "fa-plug", title: "Cable Management", text: "Built-in cable organizers and charging ports to keep electronics tidy and functional." },
                { icon: "fa-palette", title: "Style Variety", text: "Multiple finishes, colors, and materials to match your room’s decor and personal style." },
                { icon: "fa-child", title: "Child-Friendly Designs", text: "Rounded edges, non-toxic finishes, and adjustable height options for growing children." }
            ],
            images: ["assets/images/st1.jpg", "assets/images/st2.jpg", "assets/images/st3.jpg", "assets/images/st4.jpg", "assets/images/st5.jpg"]
        },
        ceiling: {
            title: "False Ceiling & Electrical",
            subtitle: "Enhance your interiors with stylish, functional false ceiling designs that elevate the ambience of every room.",
            heading: "Elevate Your Living Spaces",
            desc: `
                <p>At Eden Interiors, we believe that a perfectly designed ceiling can completely transform the look and feel of your home. Our false ceiling solutions bring together creativity, precision, and modern engineering to create spaces that feel luxurious, well-lit, and architecturally refined.</p>
                <p>With expert craftsmanship and an understanding of contemporary interior trends, we design ceilings that do more than beautify your home—they improve acoustics, conceal wiring, balance lighting, and enhance the overall environment of your living spaces.</p>
                <p>From elegant living room ceilings to functional bedroom and kitchen ceilings, our designs incorporate premium materials, layered concepts, and integrated lighting that make your home feel spacious, modern, and effortlessly stylish.</p>
            `,
            features: [
                { icon: "fa-magic", title: "Enhanced Aesthetics", text: "Transform ordinary rooms into extraordinary spaces with beautifully crafted ceiling designs that add depth, character, and sophistication." },
                { icon: "fa-lightbulb", title: "Improved Lighting", text: "Integrated LED lights, cove lighting, spotlights, and mood lighting options that create a warm, inviting ambiance." },
                { icon: "fa-eye-slash", title: "Concealed Wiring & Fixtures", text: "Hide electrical wiring, AC ducts, speakers, and other elements for a clean and seamless interior finish." },
                { icon: "fa-thermometer-half", title: "Thermal & Acoustic Benefits", text: "False ceilings help reduce heat and improve sound insulation, making your home quieter and more energy-efficient." },
                { icon: "fa-pencil-ruler", title: "Custom Designs", text: "Choose from layered ceilings, POP designs, gypsum boards, wooden accents, 3D concepts, and more—all personalized to your style." },
                { icon: "fa-hard-hat", title: "Durable Materials", text: "We use only high-quality, moisture-resistant, and fire-resistant materials that ensure long-lasting performance." }
            ],
            images: ["assets/images/fe1.jpg", "assets/images/fe2.jpg", "assets/images/fe3.jpg", "assets/images/fe4.jpg", "assets/images/fe5.jpg"]
        },
        crockery: {
            title: "Crockery & Bar Units",
            subtitle: "Elegant and functional storage solutions to display and organize your dinnerware with style",
            heading: "Showcase Your Dinnerware in Style",
            desc: `
                <p>At Eden Interiors, we specialize in creating exquisite crockery units that combine functionality with aesthetic appeal. Our custom-designed crockery units are more than just storage solutions – they are statement pieces that enhance the beauty of your dining and living spaces.</p>
                <p>Whether you have a cherished collection of fine china, everyday dinnerware, or specialty glassware, our crockery units provide the perfect blend of protection and display. We design units that complement your interior style while offering practical storage solutions.</p>
                <p>With attention to detail and quality craftsmanship, we create crockery units that not only organize your items but also become a focal point in your home decor.</p>
            `,
            features: [
                { icon: "fa-star", title: "Premium Display", text: "Showcase your fine china and glassware elegantly with optimized lighting and visibility features." },
                { icon: "fa-th-large", title: "Customized Storage", text: "Adjustable shelves and compartments designed specifically for your collection of dinnerware." },
                { icon: "fa-shield-virus", title: "Dust Protection", text: "Glass doors and secure closures keep your crockery clean and protected from dust and damage." },
                { icon: "fa-gem", title: "Aesthetic Design", text: "Beautiful designs that complement your interior decor while providing functional storage." },
                { icon: "fa-compress-arrows-alt", title: "Space Optimization", text: "Maximize your available space with smart designs that fit perfectly in your home layout." },
                { icon: "fa-hammer", title: "Durable Construction", text: "Built with high-quality materials that ensure longevity and withstand daily use." }
            ],
            images: ["assets/images/cb1.jpg", "assets/images/cb2.jpg", "assets/images/cb3.jpg", "assets/images/cb4.jpg", "assets/images/cb5.jpg"]
        },
        painting: {
            title: "Painting & Wallpaper",
            subtitle: "Transform your walls with our premium painting and wallpaper solutions that add character and charm to your spaces",
            heading: "Elevate Your Interiors with Color & Texture",
            desc: `
                <p>At Eden Interiors, we believe that walls are not just structural elements but canvases that reflect your personality and style. Our professional painting and wallpaper services combine artistry with technical expertise to transform your spaces.</p>
                <p>Whether you’re looking for a fresh coat of paint to rejuvenate a room or want to make a bold statement with designer wallpapers, our team has the skills and experience to deliver exceptional results. We use only premium quality paints and wallpapers that ensure durability and visual appeal.</p>
                <p>From color consultation to flawless execution, we manage every aspect of the process, ensuring your walls become a stunning backdrop for your life’s moments.</p>
            `,
            features: [
                { icon: "fa-swatchbook", title: "Expert Color Consultation", text: "Our design experts help you choose the perfect colors and patterns that complement your space and personal style." },
                { icon: "fa-paint-roller", title: "Premium Quality Materials", text: "We use only high-grade paints and wallpapers from trusted brands that offer excellent coverage and durability." },
                { icon: "fa-user-tie", title: "Skilled Artisans", text: "Our experienced painters and installers deliver flawless finishes with attention to detail and precision." },
                { icon: "fa-hourglass-half", title: "Timely Completion", text: "We respect your schedule and complete projects efficiently without compromising on quality." },
                { icon: "fa-fill-drip", title: "Surface Preparation", text: "Proper surface preparation including filling, sanding, and priming ensures long-lasting results." },
                { icon: "fa-leaf", title: "Eco-Friendly Options", text: "We offer low-VOC and environmentally friendly paint options for healthier indoor air quality." }
            ],
            images: ["assets/images/pw1.jpg", "assets/images/pw2.jpg", "assets/images/pw3.jpg", "assets/images/pw4.jpg", "assets/images/pw5.jpg"]
        },
        tvunit: {
            title: "Entertainment Units",
            subtitle: "Transform your living space with beautifully designed entertainment units that combine technology, storage, and aesthetics",
            heading: "Your Entertainment Hub, Redefined",
            desc: `
                <p>At Eden Interiors, we understand that entertainment units are more than just TV stands – they’re the centerpiece of your living room. Our custom entertainment units are designed to seamlessly integrate your electronics, media collections, and decor into one elegant solution.</p>
                <p>From wall-mounted units that save floor space to elaborate entertainment walls with built-in shelving, we create designs that not only organize your media equipment but also enhance the aesthetic appeal of your living area.</p>
                <p>We consider cable management, ventilation for electronics, lighting options, and storage requirements to create entertainment units that are as functional as they are beautiful.</p>
            `,
            features: [
                { icon: "fa-tv", title: "TV Integration", text: "Perfectly sized compartments and mounts for TVs of all sizes, with consideration for viewing angles and cable management." },
                { icon: "fa-network-wired", title: "Cable Management", text: "Hidden channels and compartments to organize wires and cables, keeping your entertainment area clean and safe." },
                { icon: "fa-fan", title: "Proper Ventilation", text: "Designed with ventilation in mind to prevent overheating of electronics like gaming consoles, amplifiers, and streaming devices." },
                { icon: "fa-lightbulb", title: "Integrated Lighting", text: "LED strip lighting, spotlights, or ambient lighting to highlight decor and create the perfect viewing atmosphere." },
                { icon: "fa-hdd", title: "Smart Storage", text: "Customized shelving for media collections, gaming consoles, sound systems, and decorative items." },
                { icon: "fa-bezier-curve", title: "Aesthetic Designs", text: "Contemporary, traditional, or minimalist designs that complement your interior decor and personal style." }
            ],
            images: ["assets/images/te1.jpg", "assets/images/te2.jpg", "assets/images/te3.jpg", "assets/images/te4.jpg", "assets/images/te5.jpg"]
        },
        furniture: {
            title: "Furniture & Accessories",
            subtitle: "Complete your interior spaces with our exquisite furniture and decorative accessories",
            heading: "Complete Your Space with Style",
            desc: `
                <p>At Eden Interiors, we believe furniture and accessories are the soul of any interior space. Our curated collection combines functionality with aesthetic appeal to create environments that reflect your personality and lifestyle.</p>
                <p>From custom-made furniture that fits perfectly in your space to carefully selected accessories that add the finishing touches, we provide comprehensive solutions to complete your interior design vision.</p>
                <p>Our team of designers works with you to select pieces that complement your existing decor while adding character and functionality to every room.</p>
            `,
            features: [
                { icon: "fa-couch", title: "Custom Furniture", text: "Tailor-made furniture designed to fit your space perfectly and match your aesthetic preferences." },
                { icon: "fa-comments", title: "Design Consultation", text: "Expert guidance on selecting furniture and accessories that complement your interior design." },
                { icon: "fa-tree", title: "Quality Materials", text: "We use premium woods, fabrics, and materials that ensure durability and lasting beauty." },
                { icon: "fa-shipping-fast", title: "White Glove Delivery", text: "Careful delivery, assembly, and placement of your furniture with minimal disruption." },
                { icon: "fa-home", title: "Complete Styling", text: "From furniture to decorative accessories, we provide complete styling solutions for every room." },
                { icon: "fa-headset", title: "After-Sales Support", text: "Continued support and maintenance services to keep your furniture looking its best." }
            ],
            images: ["assets/images/fa1.jpg", "assets/images/fa2.jpg", "assets/images/fa3.jpg", "assets/images/fa4.jpg", "assets/images/fa5.jpg"]
        },
        bedroom: {
            title: "Bed Rooms",
            subtitle: "Create your perfect sanctuary with bespoke bedroom designs that blend comfort, style, and functionality",
            heading: "Your Personal Sanctuary Awaits",
            desc: `
                <p>At Eden Interiors, we understand that your bedroom is more than just a place to sleep—it’s your personal retreat, a sanctuary where you begin and end each day. Our custom bedroom designs are crafted to create spaces that promote relaxation, comfort, and rejuvenation.</p>
                <p>With a keen eye for detail and an understanding of how spaces affect wellbeing, we design bedrooms that balance aesthetic appeal with functional living. From master suites to guest rooms, we create environments that reflect your personality while maximizing comfort and utility.</p>
                <p>Our approach combines innovative storage solutions, ergonomic furniture, ambient lighting, and carefully selected materials to transform your bedroom into a haven of tranquility and style.</p>
            `,
            features: [
                { icon: "fa-bed", title: "Custom Bed Designs", text: "Ergonomic bed frames and headboards tailored to your comfort preferences and space requirements." },
                { icon: "fa-archive", title: "Integrated Storage", text: "Smart storage solutions including under-bed compartments, built-in wardrobes, and multi-functional furniture." },
                { icon: "fa-adjust", title: "Harmonious Color Schemes", text: "Expertly curated color palettes that promote relaxation and complement your personal style." },
                { icon: "fa-moon", title: "Ambient Lighting", text: "Layered lighting solutions including task, accent, and ambient lighting for different moods and activities." },
                { icon: "fa-wind", title: "Comfort-Optimized Layouts", text: "Thoughtfully arranged furniture that maximizes space flow and creates a calming, organized environment." },
                { icon: "fa-star", title: "Premium Materials", text: "High-quality fabrics, woods, and finishes that ensure durability while creating a luxurious atmosphere." }
            ],
            images: ["assets/images/br1.jpg", "assets/images/br2.jpg", "assets/images/br3.jpg", "assets/images/br4.jpg", "assets/images/br5.jpg"]
        },
        dining: {
            title: "Dining Rooms",
            subtitle: "Create memorable dining experiences with our bespoke dining room interiors",
            heading: "Where Meals Become Memories",
            desc: `
                <p>At Eden Interiors, we believe the dining room is more than just a place to eat—it’s where families gather, stories are shared, and memories are created. Our dining room designs combine elegance, comfort, and functionality to create spaces that inspire connection.</p>
                <p>With meticulous attention to detail and a deep understanding of spatial dynamics, we transform dining areas into luxurious yet welcoming environments. Whether you’re hosting intimate family dinners or grand celebrations, our designs adapt to your lifestyle.</p>
                <p>From selecting the perfect dining table to complementing lighting and storage solutions, we handle every aspect to create a cohesive and stunning dining experience.</p>
            `,
            features: [
                { icon: "fa-pencil-ruler", title: "Custom Design", text: "Each dining room is uniquely designed to reflect your personal style and accommodate your specific needs." },
                { icon: "fa-chair", title: "Premium Furniture", text: "We source and craft high-quality dining tables, chairs, and storage units that combine durability with style." },
                { icon: "fa-glass-cheers", title: "Ambient Lighting", text: "Expertly designed lighting solutions that create the perfect mood for every dining occasion." },
                { icon: "fa-boxes", title: "Smart Storage", text: "Innovative storage solutions to keep your dining essentials organized and within easy reach." },
                { icon: "fa-arrows-alt", title: "Space Optimization", text: "Maximize your dining area’s potential with clever layouts that enhance both aesthetics and functionality." },
                { icon: "fa-certificate", title: "Quality Materials", text: "We use only premium woods, finishes, and fabrics that stand the test of time while maintaining beauty." }
            ],
            images: ["assets/images/dr1.jpg", "assets/images/dr2.jpg", "assets/images/dr3.jpg", "assets/images/dr4.jpg", "assets/images/dr5.jpg"]
        },
        living: {
            title: "Living Rooms",
            subtitle: "Create inviting and stylish living spaces that reflect your personality and lifestyle",
            heading: "Transform Your Living Space",
            desc: `
                <p>At Eden Interiors, we believe the living room is the soul of your home—a place for relaxation, entertainment, and making memories. Our living room designs combine comfort, style, and functionality to create spaces that truly feel like home.</p>
                <p>Whether you prefer modern minimalism, classic elegance, or eclectic charm, our design team works with you to create a living room that matches your vision and enhances your daily life. We focus on creating harmonious spaces that balance aesthetics with practical living.</p>
                <p>From furniture selection and layout planning to lighting design and accessory placement, we handle every detail to ensure your living room becomes your favorite space in the house.</p>
            `,
            features: [
                { icon: "fa-couch", title: "Custom Furniture", text: "Tailor-made furniture that fits your space perfectly and reflects your personal style." },
                { icon: "fa-palette", title: "Color Consulting", text: "Expert color schemes that create the perfect mood and atmosphere for your living space." },
                { icon: "fa-lightbulb", title: "Lighting Design", text: "Strategic lighting plans that enhance both functionality and ambiance in your living room." },
                { icon: "fa-expand", title: "Space Optimization", text: "Intelligent layouts that maximize your available space while maintaining flow and comfort." },
                { icon: "fa-user-friends", title: "Personalized Service", text: "One-on-one consultation and ongoing support throughout your design journey." },
                { icon: "fa-check-circle", title: "Quality Assurance", text: "Premium materials and craftsmanship that ensure your living room stands the test of time." }
            ],
            images: ["assets/images/lr1.jpg", "assets/images/lr2.jpg", "assets/images/lr3.jpg", "assets/images/lr4.jpg", "assets/images/lr5.jpg"]
        },
        kids: {
            title: "Kids Rooms",
            subtitle: "Create magical and safe spaces for your children with our imaginative kids room designs",
            heading: "Where Imagination Comes to Life",
            desc: `
                <p>At Eden Interiors, we believe that a child’s room should be more than just a place to sleep. It should be a sanctuary for imagination, a space for learning, and a safe haven for play and rest.</p>
                <p>Our kids room designs combine creativity, functionality, and safety to create environments that grow with your child. From whimsical themes for toddlers to sophisticated spaces for teenagers, we craft rooms that reflect each child’s unique personality.</p>
                <p>We use child-friendly materials, non-toxic paints, and smart storage solutions to ensure that every kids room is not only beautiful but also practical and safe for daily use.</p>
            `,
            features: [
                { icon: "fa-rocket", title: "Creative Themes", text: "From fairy tales to space adventures, we bring your child’s imagination to life with captivating themes." },
                { icon: "fa-child", title: "Child-Safe Materials", text: "We use non-toxic paints, rounded edges, and secure furniture to ensure maximum safety for your child." },
                { icon: "fa-box", title: "Smart Storage", text: "Creative storage solutions that keep toys organized and make cleanup fun and easy for children." },
                { icon: "fa-ruler-vertical", title: "Grow-With-Me Designs", text: "Convertible furniture and adaptable layouts that evolve as your child grows from toddler to teen." },
                { icon: "fa-book-reader", title: "Learning Spaces", text: "Integrated study areas with proper lighting and ergonomic furniture to support your child’s education." },
                { icon: "fa-chalkboard", title: "Interactive Elements", text: "Chalkboard walls, reading nooks, and play zones that encourage creativity and active play." }
            ],
            images: ["assets/images/kr1.jpg", "assets/images/kr2.jpg", "assets/images/kr3.jpg", "assets/images/kr4.jpg", "assets/images/kr5.jpg"]
        }
    };

    let currentDetailSlide = 0;
    let currentDetailImages = [];

    // Function to Populate Service Details Page
    function loadServiceDetails(category) {
        const data = serviceData[category];
        if (!data) return;

        // Elements on service-details.html
        const heroEl = document.getElementById('serviceHero');
        const titleEl = document.getElementById('serviceTitle');
        const subtitleEl = document.getElementById('serviceSubtitle');
        const headingEl = document.getElementById('serviceHeading');
        const descEl = document.getElementById('serviceDesc');
        const featuresEl = document.getElementById('serviceFeatures');
        const catNameEl = document.getElementById('serviceCategoryName');
        const introImgEl = document.getElementById('introImage');
        const galleryGridEl = document.getElementById('galleryGrid');

        // Populate Text
        if (titleEl) titleEl.innerText = data.title;
        if (subtitleEl) subtitleEl.innerText = data.subtitle || "";
        if (headingEl) headingEl.innerText = data.heading || data.title;
        if (descEl) descEl.innerHTML = data.desc;
        if (catNameEl) catNameEl.innerText = data.title;

        // Hero Background (First image in array as hero)
        if (heroEl && data.images.length > 0) {
            heroEl.style.backgroundImage = `url('${data.images[0]}')`;
        }

        // Intro Image (Second image or reuse first)
        if (introImgEl && data.images.length > 0) {
            introImgEl.src = data.images[1] || data.images[0];
            introImgEl.onerror = function () { this.src = 'https://placehold.co/600x400?text=Service+Image'; };
        }

        // Populate Features Grid
        if (featuresEl && data.features) {
            featuresEl.innerHTML = '';
            data.features.forEach(feature => {
                const fDiv = document.createElement('div');
                fDiv.className = 'feature-card';

                fDiv.innerHTML = `
                    <div class="feature-icon"><i class="fas ${feature.icon || 'fa-check'}"></i></div>
                    <h4 class="feature-title">${feature.title}</h4>
                    <p class="feature-text">${feature.text}</p>
                `;
                featuresEl.appendChild(fDiv);
            });
        }

        // Populate Gallery Grid
        if (galleryGridEl && data.images) {
            galleryGridEl.innerHTML = '';
            data.images.forEach(imgSrc => {
                const gItem = document.createElement('div');
                gItem.className = 'gallery-item';
                gItem.innerHTML = `<img src="${imgSrc}" alt="${data.title} Project" onerror="this.src='https://placehold.co/400x300?text=Gallery+Image'">`;
                galleryGridEl.appendChild(gItem);
            });
        }
    }

    // Expose functions global
    window.loadServiceDetails = loadServiceDetails;
    // window.moveDetailSlide = moveDetailSlide; // Slider no longer used

});
