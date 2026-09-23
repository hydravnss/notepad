const MODULE_NAME = 'notepad';

const DEFAULT_SETTINGS = {
    enabled: true,

    position: 'bottom-right',

    offsetX: 16,

    offsetY: 16,

    buttonSize: 42,

    noteWidth: 300,

    noteHeight: 240
};


function getContext() {
    return SillyTavern.getContext();
}


function getSettings() {

    const {
        extensionSettings,
        saveSettingsDebounced
    } = getContext();

    if (!extensionSettings[MODULE_NAME]) {

        extensionSettings[MODULE_NAME] = {
            ...DEFAULT_SETTINGS
        };

        saveSettingsDebounced();

    }

    return extensionSettings[MODULE_NAME];
}


/* =========================================
   INITIALISATION
   ========================================= */

async function init() {

    console.log('[Notepad] Initialisation...');

    const {
        renderExtensionTemplateAsync
    } = getContext();


    /* ================================
       SETTINGS
       ================================ */

    const settingsHtml =
        await renderExtensionTemplateAsync(
            'third-party/notepad',
            'settings'
        );


    $('#extensions_settings2').append(
        settingsHtml
    );


    const settings = getSettings();


    /* ================================
       VALEURS INITIALES
       ================================ */

    $('#notepad_enabled')
        .prop(
            'checked',
            settings.enabled
        );

    $('#notepad_position')
        .val(
            settings.position
        );

    $('#notepad_offset_x')
        .val(
            settings.offsetX
        );

    $('#notepad_offset_y')
        .val(
            settings.offsetY
        );

    $('#notepad_button_size')
        .val(
            settings.buttonSize
        );


    updateSettingsDisplay();

    createButton();

    createNotepad();

    applyButtonPosition();


    /* ================================
       ÉVÉNEMENTS
       ================================ */

    $('#notepad_enabled')
        .on('change', function () {

            settings.enabled =
                $(this).prop('checked');

            saveSettings();

            updateButton();

        });


    $('#notepad_position')
        .on('change', function () {

            settings.position =
                $(this).val();

            saveSettings();

            applyButtonPosition();

        });


    $('#notepad_offset_x')
        .on('input change', function () {

            settings.offsetX =
                Number($(this).val());

            updateSettingsDisplay();

            saveSettings();

            applyButtonPosition();

        });


    $('#notepad_offset_y')
        .on('input change', function () {

            settings.offsetY =
                Number($(this).val());

            updateSettingsDisplay();

            saveSettings();

            applyButtonPosition();

        });


    $('#notepad_button_size')
        .on('input change', function () {

            settings.buttonSize =
                Number($(this).val());

            updateSettingsDisplay();

            saveSettings();

            updateButtonSize();

        });


    console.log('[Notepad] Chargé.');

}


/* =========================================
   SAUVEGARDE
   ========================================= */

function saveSettings() {

    const {
        saveSettingsDebounced
    } = getContext();

    saveSettingsDebounced();

}


/* =========================================
   AFFICHAGE DES VALEURS
   ========================================= */

function updateSettingsDisplay() {

    const settings =
        getSettings();

    $('#notepad_offset_x_value')
        .text(
            settings.offsetX
        );

    $('#notepad_offset_y_value')
        .text(
            settings.offsetY
        );

    $('#notepad_button_size_value')
        .text(
            settings.buttonSize
        );


    $('#notepad_preview_button')
        .css({
            width:
                settings.buttonSize + 'px',

            height:
                settings.buttonSize + 'px',

            fontSize:
                Math.round(
                    settings.buttonSize * .52
                ) + 'px'
        });

}


/* =========================================
   CRÉATION DU BOUTON
   ========================================= */

function createButton() {

    if (
        document.getElementById(
            'st-notepad-button'
        )
    ) {

        return;

    }


    const button =
        document.createElement('button');


    button.id =
        'st-notepad-button';


    button.className =
        'st-notepad-button';


    button.innerHTML =
        '📑';


    button.title =
        'Notepad';


    button.addEventListener(
        'click',
        toggleNotepad
    );


    document.body.appendChild(
        button
    );

}


/* =========================================
   POSITION DU BOUTON
   ========================================= */

function applyButtonPosition() {

    const button =
        document.getElementById(
            'st-notepad-button'
        );

    if (!button) return;


    const settings =
        getSettings();


    button.style.top =
        'auto';

    button.style.bottom =
        'auto';

    button.style.left =
        'auto';

    button.style.right =
        'auto';


    if (
        settings.position ===
        'bottom-right'
    ) {

        button.style.right =
            settings.offsetX + 'px';

        button.style.bottom =
            settings.offsetY + 'px';

    }


    if (
        settings.position ===
        'bottom-left'
    ) {

        button.style.left =
            settings.offsetX + 'px';

        button.style.bottom =
            settings.offsetY + 'px';

    }


    if (
        settings.position ===
        'top-right'
    ) {

        button.style.right =
            settings.offsetX + 'px';

        button.style.top =
            settings.offsetY + 'px';

    }


    if (
        settings.position ===
        'top-left'
    ) {

        button.style.left =
            settings.offsetX + 'px';

        button.style.top =
            settings.offsetY + 'px';

    }

}


/* =========================================
   TAILLE DU BOUTON
   ========================================= */

function updateButtonSize() {

    const button =
        document.getElementById(
            'st-notepad-button'
        );

    if (!button) return;


    const settings =
        getSettings();


    button.style.width =
        settings.buttonSize + 'px';


    button.style.height =
        settings.buttonSize + 'px';


    button.style.fontSize =
        Math.round(
            settings.buttonSize * .52
        ) + 'px';

}


/* =========================================
   AFFICHER / CACHER
   ========================================= */

function updateButton() {

    const button =
        document.getElementById(
            'st-notepad-button'
        );

    if (!button) return;


    const settings =
        getSettings();


    button.style.display =
        settings.enabled
            ? 'flex'
            : 'none';

}


/* =========================================
   NOTEPAD
   ========================================= */

function createNotepad() {

    if (
        document.getElementById(
            'st-notepad'
        )
    ) {

        return;

    }


    const notepad =
        document.createElement('div');


    notepad.id =
        'st-notepad';


    notepad.className =
        'st-notepad';


    notepad.innerHTML = `

        <div class="st-notepad-header">

            <span>
                📑 Notepad
            </span>

            <div class="st-notepad-actions">

                <button
                    id="st-notepad-clear">
                    🗑️
                </button>

                <button
                    id="st-notepad-close">
                    ×
                </button>

            </div>

        </div>


        <textarea
            id="st-notepad-text"
            placeholder="Écris tes notes ici..."
            spellcheck="false"></textarea>

    `;


    document.body.appendChild(
        notepad
    );


    const textarea =
        document.getElementById(
            'st-notepad-text'
        );


    textarea.value =
        localStorage.getItem(
            'st_notepad_content'
        ) || '';


    textarea.addEventListener(
        'input',
        () => {

            localStorage.setItem(
                'st_notepad_content',
                textarea.value
            );

        }
    );


    $('#st-notepad-close')
        .on(
            'click',
            () => {

                notepad.classList.remove(
                    'visible'
                );

            }
        );


    $('#st-notepad-clear')
        .on(
            'click',
            () => {

                textarea.value = '';

                localStorage.removeItem(
                    'st_notepad_content'
                );

                textarea.focus();

            }
        );

}


/* =========================================
   OUVRIR
   ========================================= */

function toggleNotepad() {

    const notepad =
        document.getElementById(
            'st-notepad'
        );


    if (!notepad) return;


    notepad.classList.toggle(
        'visible'
    );


    if (
        notepad.classList.contains(
            'visible'
        )
    ) {

        document
            .getElementById(
                'st-notepad-text'
            )
            ?.focus();

    }

}


/* =========================================
   LANCEMENT
   ========================================= */

if (
    typeof SillyTavern !== 'undefined'
) {

    init();

}