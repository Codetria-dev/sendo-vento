/* ==========================================================================
   Sendo Vento — comportamento da página
   ========================================================================== */

(function () {
    'use strict';

    var header = document.getElementById('site-header');
    var toggle = document.getElementById('menu-toggle');
    var menus = document.getElementById('menu-mobile');
    var navLinks = document.querySelectorAll('.header-nav a');
    var sections = document.querySelectorAll('main section[id]');

    /* --- Menu mobile ------------------------------------------------------
       Um único painel guarda os dois grupos de navegação (esquerda e
       direita), então abrir/fechar é uma classe só.
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

            /* Links para outras páginas (# vazio, ebooks.html) não participam
               do scroll spy — mantêm o .active definido no próprio HTML. */
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

    /* --- Nome ao vento ----------------------------------------------------
       Quebra "Sendo Vento" em spans para dar a cada letra um delay próprio.
       O texto original vai para o aria-label e as letras ficam aria-hidden,
       para leitores de tela não soletrarem o nome.
       -------------------------------------------------------------------- */

    function soprarNome(elemento) {
        var texto = elemento.textContent.trim();

        elemento.setAttribute('aria-label', texto);
        elemento.textContent = '';

        var fragmento = document.createDocumentFragment();
        var indice = 0;

        texto.split('').forEach(function (letra) {
            if (letra === ' ') {
                fragmento.appendChild(document.createTextNode(' '));
                return;
            }

            var span = document.createElement('span');
            span.className = 'letra';
            span.setAttribute('aria-hidden', 'true');
            span.style.setProperty('--i', indice);
            span.textContent = letra;
            fragmento.appendChild(span);

            indice++;
        });

        elemento.appendChild(fragmento);
    }

    document.querySelectorAll('[data-vento]').forEach(soprarNome);

    /* --- Listeners globais ------------------------------------------------ */

    window.addEventListener('scroll', updateHeaderShadow, { passive: true });
    updateHeaderShadow();

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            setMenu(false);
        }
    });
})();
