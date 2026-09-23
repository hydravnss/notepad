const NOTEPAD_KEY = 'st_notepad_content';

function init() {
    // Évite les doublons
    if (document.getElementById('st-notepad-button')) {
        return;
    }

    // =========================
    // BOUTON 📑
    // =========================

    const button = document.createElement('button');

    button.id = 'st-notepad-button';
    button.className = 'st-notepad-button';
    button.innerHTML = '📑';
    button.title = 'Notepad';

    document.body.appendChild(button);


    // =========================
    // FENÊTRE
    // =========================

    const notepad = document.createElement('div');

    notepad.id = 'st-notepad';
    notepad.className = 'st-notepad';
    notepad.style.display = 'none';

    notepad.innerHTML = `
        <div class="st-notepad-header">

            <span class="st-notepad-title">
                📑 Notepad
            </span>

            <div class="st-notepad-buttons">

                <button
                    id="st-notepad-clear"
                    title="Effacer">
                    🗑️
                </button>

                <button
                    id="st-notepad-close"
                    title="Fermer">
                    ×
                </button>

            </div>

        </div>

        <textarea
            id="st-notepad-text"
            placeholder="Écris tes notes ici..."
            spellcheck="false"></textarea>

    `;

    document.body.appendChild(notepad);


    // =========================
    // CHARGER LES NOTES
    // =========================

    const textarea =
        document.getElementById('st-notepad-text');

    textarea.value =
        localStorage.getItem(NOTEPAD_KEY) || '';


    // =========================
    // OUVRIR / FERMER
    // =========================

    button.addEventListener('click', () => {

        if (notepad.style.display === 'none') {

            notepad.style.display = 'flex';

            textarea.focus();

        } else {

            notepad.style.display = 'none';

        }

    });


    document
        .getElementById('st-notepad-close')
        .addEventListener('click', () => {

            notepad.style.display = 'none';

        });


    // =========================
    // SAUVEGARDE AUTOMATIQUE
    // =========================

    textarea.addEventListener('input', () => {

        localStorage.setItem(
            NOTEPAD_KEY,
            textarea.value
        );

    });


    // =========================
    // EFFACER
    // =========================

    document
        .getElementById('st-notepad-clear')
        .addEventListener('click', () => {

            textarea.value = '';

            localStorage.removeItem(
                NOTEPAD_KEY
            );

            textarea.focus();

        });


    // =========================
    // DÉPLACER LA FENÊTRE
    // =========================

    const header =
        notepad.querySelector('.st-notepad-header');

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    header.addEventListener('pointerdown', (event) => {

        if (event.target.closest('button')) {
            return;
        }

        dragging = true;

        const rect =
            notepad.getBoundingClientRect();

        offsetX =
            event.clientX - rect.left;

        offsetY =
            event.clientY - rect.top;

        notepad.style.right = 'auto';
        notepad.style.bottom = 'auto';

        notepad.style.left =
            rect.left + 'px';

        notepad.style.top =
            rect.top + 'px';

        header.setPointerCapture(
            event.pointerId
        );

    });


    header.addEventListener('pointermove', (event) => {

        if (!dragging) {
            return;
        }

        let x =
            event.clientX - offsetX;

        let y =
            event.clientY - offsetY;

        const maxX =
            window.innerWidth -
            notepad.offsetWidth;

        const maxY =
            window.innerHeight -
            notepad.offsetHeight;

        x = Math.max(
            0,
            Math.min(x, maxX)
        );

        y = Math.max(
            0,
            Math.min(y, maxY)
        );

        notepad.style.left =
            x + 'px';

        notepad.style.top =
            y + 'px';

    });


    header.addEventListener('pointerup', () => {

        dragging = false;

    });
}