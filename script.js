/* ==========================================================================
   Você Tem Jeito — comportamento da página
   ========================================================================== */

(function () {
    'use strict';

    var header = document.getElementById('site-header');
    var toggle = document.getElementById('menu-toggle');
    var menus = document.getElementById('menu-mobile');
    var navLinks = document.querySelectorAll('.header-nav a');
    var sections = document.querySelectorAll('main section[id]');

    /* --- Menu mobile ------------------------------------------------------
       O painel guarda a navegação inteira, então abrir/fechar é uma classe só.
       -------------------------------------------------------------------- */

    function setMenu(aberto) {
        menus.classList.toggle('is-open', aberto);
        toggle.setAttribute('aria-expanded', String(aberto));
        toggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    }

    toggle.addEventListener('click', function () {
        setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            setMenu(false);
        });
    });

    /* --- Sombra no header ao rolar --------------------------------------- */

    function updateHeaderShadow() {
        header.classList.toggle('is-scrolled', window.scrollY > 8);
    }

    /* --- Link ativo conforme a seção visível ------------------------------ */

    function setActiveLink(id) {
        navLinks.forEach(function (link) {
            var href = link.getAttribute('href');

            /* Links para outras páginas não participam do scroll spy — mantêm
               o .active definido no próprio HTML. */
            if (href.charAt(0) !== '#' || href === '#') {
                return;
            }

            link.classList.toggle('active', href === '#' + id);
        });
    }

    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    setActiveLink(entry.target.id);
                }
            });
        },
        { rootMargin: '-45% 0px -45% 0px' }
    );

    sections.forEach(function (section) {
        observer.observe(section);
    });

    /* --- Listeners globais ------------------------------------------------ */

    window.addEventListener('scroll', updateHeaderShadow, { passive: true });
    updateHeaderShadow();

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            setMenu(false);
        }
    });
})();
