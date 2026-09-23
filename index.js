(() => {
    const STORAGE_KEY = 'st_notepad_content';
    const POS_KEY = 'st_notepad_position';
    const SIZE_KEY = 'st_notepad_size';

    function loadState() {
        return {
            content: localStorage.getItem(STORAGE_KEY) || '',
            position: JSON.parse(localStorage.getItem(POS_KEY) || 'null'),
            size: JSON.parse(localStorage.getItem(SIZE_KEY) || 'null')
        };
    }

    function saveContent() {
        localStorage.setItem(
            STORAGE_KEY,
            $('#st-notepad-text').val() || ''
        );
    }

    function savePosition() {
        const box = document.getElementById('st-notepad');

        if (!box) return;

        localStorage.setItem(
            POS_KEY,
            JSON.stringify({
                left: box.style.left,
                top: box.style.top
            })
        );
    }

    function saveSize() {
        const box = document.getElementById('st-notepad');

        if (!box) return;

        localStorage.setItem(
            SIZE_KEY,
            JSON.stringify({
                width: box.style.width,
                height: box.style.height
            })
        );
    }

    function createNotepad() {
        if (document.getElementById('st-notepad-button')) return;

        const state = loadState();

        $('body').append(`
            <button
                id="st-notepad-button"
                class="st-notepad-button"
                title="Notepad"
                aria-label="Ouvrir le Notepad">
                📑
            </button>

            <div id="st-notepad" class="st-notepad" hidden>

                <div class="st-notepad-header">

                    <span class="st-notepad-title">
                        📑 Notepad
                    </span>

                    <div class="st-notepad-actions">

                        <button
                            type="button"
                            id="st-notepad-clear"
                            title="Effacer">
                            🗑️
                        </button>

                        <button
                            type="button"
                            id="st-notepad-close"
                            title="Fermer">
                            ×
                        </button>

                    </div>

                </div>

                <textarea
                    id="st-notepad-text"
                    spellcheck="false"
                    placeholder="Écris tes notes ici..."></textarea>

                <div class="st-notepad-footer">
                    Sauvegarde automatique
                </div>

            </div>
        `);

        const box = document.getElementById('st-notepad');
        const textarea = document.getElementById('st-notepad-text');

        textarea.value = state.content;

        if (state.position) {
            box.style.left = state.position.left;
            box.style.top = state.position.top;
            box.style.right = 'auto';
            box.style.bottom = 'auto';
        }

        if (state.size) {
            box.style.width = state.size.width;
            box.style.height = state.size.height;
        }

        $('#st-notepad-button').on('click', () => {
            box.hidden = !box.hidden;

            if (!box.hidden) {
                textarea.focus();
            }
        });

        $('#st-notepad-close').on('click', () => {
            box.hidden = true;
        });

        $('#st-notepad-clear').on('click', () => {
            if (confirm('Effacer toutes les notes ?')) {
                textarea.value = '';
                saveContent();
                textarea.focus();
            }
        });

        $('#st-notepad-text').on('input', saveContent);

        makeDraggable(
            box,
            box.querySelector('.st-notepad-header')
        );

        makeResizable(box);
    }

    function makeDraggable(box, handle) {

        let dragging = false;
        let offsetX = 0;
        let offsetY = 0;

        handle.addEventListener('pointerdown', (event) => {

            if (event.target.closest('button')) return;

            const rect = box.getBoundingClientRect();

            dragging = true;

            offsetX = event.clientX - rect.left;
            offsetY = event.clientY - rect.top;

            box.style.left = rect.left + 'px';
            box.style.top = rect.top + 'px';

            box.style.right = 'auto';
            box.style.bottom = 'auto';

            handle.setPointerCapture?.(event.pointerId);

            box.classList.add('dragging');
        });

        handle.addEventListener('pointermove', (event) => {

            if (!dragging) return;

            const maxLeft =
                Math.max(0, window.innerWidth - box.offsetWidth);

            const maxTop =
                Math.max(0, window.innerHeight - box.offsetHeight);

            box.style.left =
                Math.min(
                    Math.max(0, event.clientX - offsetX),
                    maxLeft
                ) + 'px';

            box.style.top =
                Math.min(
                    Math.max(0, event.clientY - offsetY),
                    maxTop
                ) + 'px';
        });

        handle.addEventListener('pointerup', () => {

            if (!dragging) return;

            dragging = false;

            box.classList.remove('dragging');

            savePosition();
        });
    }

    function makeResizable(box) {

        if (typeof ResizeObserver === 'undefined') return;

        const observer = new ResizeObserver(() => {

            if (!box.hidden) {
                saveSize();
            }

        });

        observer.observe(box);
    }

    $(document).ready(() => {
        setTimeout(createNotepad, 500);
    });

})();