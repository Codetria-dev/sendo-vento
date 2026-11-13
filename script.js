/* ==========================================================================
   Você Tem Jeito — comportamento da página
   ========================================================================== */

(function () {
    'use strict';

    var header = document.getElementById('site-header');
    var toggle = document.getElementById('menu-toggle');
    var menus = document.getElementById('menu-mobile');
    var navLinks = document.querySelectorAll('.header-nav a');
    var menuLinks = document.querySelectorAll('.header-menus a');
    var sections = document.querySelectorAll('main section[id]');

    /* --- Menu mobile ------------------------------------------------------
       O painel guarda a navegação inteira, então abrir/fechar é uma classe só.
       -------------------------------------------------------------------- */

    if (toggle && menus) {
        var setMenu = function (aberto) {
            menus.classList.toggle('is-open', aberto);
            toggle.setAttribute('aria-expanded', String(aberto));
            toggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
        };

        toggle.addEventListener('click', function () {
            setMenu(toggle.getAttribute('aria-expanded') !== 'true');
        });

        menuLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                setMenu(false);
            });
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && menus.classList.contains('is-open')) {
                setMenu(false);
                toggle.focus();
            }
        });

        /* Fecha ao clicar fora do painel, sem interferir no botão que abre */
        document.addEventListener('click', function (event) {
            if (!menus.classList.contains('is-open')) {
                return;
            }

            if (menus.contains(event.target) || toggle.contains(event.target)) {
                return;
            }

            setMenu(false);
        });
    }

    /* --- Sombra no header ao rolar --------------------------------------- */

    function updateHeaderShadow() {
        if (!header) {
            return;
        }

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

    /* --- Formulários ainda sem endpoint -----------------------------------
       Com `action` vazio, o POST iria para a própria página estática, que
       responde 405 e descarta o que foi digitado. Aqui o envio é barrado,
       nada é transmitido e os dados continuam nos campos. Basta preencher o
       `action` com o endpoint do Brevo para o bloqueio deixar de valer.
       -------------------------------------------------------------------- */

    document.querySelectorAll('form[action=""]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            var aviso = form.querySelector('.form-aviso');

            if (aviso) {
                aviso.hidden = false;
            }
        });
    });

    /* --- Listeners globais ------------------------------------------------ */

    window.addEventListener('scroll', updateHeaderShadow, { passive: true });
    updateHeaderShadow();
})();
