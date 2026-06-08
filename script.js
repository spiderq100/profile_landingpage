/* ==========================================
   AI 디지털 강사 프로필 - INTERACTION SCRIPT
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Sticky Header Header scrolled effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Drawer Navigation Toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const drawerOverlay = document.querySelector('.drawer-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleDrawer() {
        mobileDrawer.classList.toggle('open');
        drawerOverlay.classList.toggle('active');
        document.body.style.overflow = mobileDrawer.classList.contains('open') ? 'hidden' : '';
    }

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', toggleDrawer);
    }
    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', toggleDrawer);
    }

    // Close drawer when link clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileDrawer.classList.contains('open')) {
                toggleDrawer();
            }
        });
    });

    // 3. Scroll Reveal Animation & Active Nav Link Highlight
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
            }
        });
    }, {
        threshold: 0.15
    });

    sections.forEach(section => {
        if (section.id !== 'home') {
            section.classList.add('scroll-reveal');
            revealOnScroll.observe(section);
        }
    });

    // Highlight active link in header based on scroll position
    window.addEventListener('scroll', () => {
        let currentSection = 'home';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });

        mobileLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // 4. Stats Counter Animation
    const statsSection = document.querySelector('.about-stats-area');
    const statNums = document.querySelectorAll('.stat-num');
    let counterTriggered = false;

    function startCounting() {
        statNums.forEach(num => {
            const target = parseInt(num.getAttribute('data-val'), 10);
            const duration = 2000; // 2 seconds
            const stepTime = Math.max(Math.floor(duration / target), 15);
            let current = 0;
            
            // Adjust step for large values to count smoother
            const increment = target > 500 ? Math.ceil(target / 100) : 1;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    num.innerText = target;
                    clearInterval(timer);
                } else {
                    num.innerText = current;
                }
            }, stepTime);
        });
    }

    if (statsSection && statNums.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counterTriggered) {
                    startCounting();
                    counterTriggered = true;
                }
            });
        }, {
            threshold: 0.3
        });
        
        statsObserver.observe(statsSection);
    }

    // 5. Toast Notification Helper
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');

    function showToast(message) {
        toastMsg.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // 6. Copy Email to Clipboard
    const btnCopyEmail = document.getElementById('btn-copy-email');
    const emailText = document.getElementById('email-text');

    if (btnCopyEmail && emailText) {
        btnCopyEmail.addEventListener('click', () => {
            const textToCopy = emailText.textContent;
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    showToast('이메일 주소가 클립보드에 복사되었습니다.');
                })
                .catch(err => {
                    console.error('복사 실패:', err);
                    // Fallback
                    const textArea = document.createElement('textarea');
                    textArea.value = textToCopy;
                    document.body.appendChild(textArea);
                    textArea.select();
                    try {
                        document.execCommand('copy');
                        showToast('이메일 주소가 복사되었습니다.');
                    } catch (e) {
                        showToast('복사에 실패했습니다. 직접 복사해 주세요.');
                    }
                    document.body.removeChild(textArea);
                });
        });
    }

    // 7. Interactive Inquiry Form & KakaoTalk Redirect
    const inquiryForm = document.getElementById('inquiry-form');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('form-name').value.trim();
            const contact = document.getElementById('form-contact').value.trim();
            const message = document.getElementById('form-message').value.trim();
            
            // Format a clean text summary of the inquiry
            const formattedMessage = `[AI/디지털 출강 문의]\n\n• 성함/단체명: ${name}\n• 연락처: ${contact}\n• 문의내용: ${message}`;
            
            // Copy message to clipboard first so they can paste it directly in open chat
            navigator.clipboard.writeText(formattedMessage)
                .then(() => {
                    showToast('문의 내용이 복사되었습니다! 오픈채팅방에 붙여넣기 해주세요.');
                    
                    // Delay openchat redirect slightly to let user read toast
                    setTimeout(() => {
                        window.open('https://open.kakao.com/o/sHBPvEyi', '_blank');
                    }, 1500);
                })
                .catch(err => {
                    console.error('클립보드 복사 실패:', err);
                    // Open anyway
                    window.open('https://open.kakao.com/o/sHBPvEyi', '_blank');
                });
        });
    }
});
