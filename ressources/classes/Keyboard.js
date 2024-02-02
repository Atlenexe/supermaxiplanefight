import keyBinds from '../config/keyBinds.json' assert { type: 'json' };

export class keyboard {
    keysPressed = {};
    keysTapped = {};

    constructor() {
        this.keyboardListeners();
    }

    keyboardListeners() {
        //Écouter les événements clavier (touches préssées et relâchées)
        document.addEventListener('keydown', (event) => this.handleKeyDown(event));
        document.addEventListener('keyup', (event) => this.handleKeyUp(event));
    }

    handleKeyDown(event) {
        if (!this.keysPressed[event.key]) {
            this.keysTapped[event.key] = true;
        }
        this.keysPressed[event.key] = true;
    }

    handleKeyUp(event) {
        this.keysPressed[event.key] = false;
        delete this.keysTapped[event.key];
    }

    checkTappedKey(key) {
        //Vérifier si une touche est tapée depuis le fichier config de touches (envoie vrai une seule fois)
        const binds = keyBinds[key] || [key];
        return binds.some(bind => {
            if (this.keysTapped[bind]) {
                delete this.keysTapped[bind];
                return true;
            }
            return false;
        });
    }

    checkFromKeyBinds(key) {
        //Vérifier si une touche est pressée depuis le fichier config de touches
        return keyBinds[key].some(bind => this.keysPressed[bind]);
    }
}