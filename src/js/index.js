
class OptionEventEmitter {
    constructor() {
        this.currentState = {
            title: false,
            bold: false,
            italic: false,
            list: false,
            center: false
        }
        
        this.callbacks = {
            title: [],
            bold: [],
            italic: [],
            list: [],
            center: []
        }
    }

    addEventListener(event, cb) {
        this.validateEvent(event)
        this.callbacks[event].push(cb)
    }
    
    emit(event, val) {
        this.validateEvent(event)
        this.currentState[event] = val
        this.callbacks[event].forEach(cb => {
            cb(val)
        })
        console.log(`Emmiting ${event} setting ${val}`)
    }
    
    validateEvent(event) {
        if (!this.currentState.hasOwnProperty(event)) {
            throw Error(`${event} is not a valid event`)
        }        
    }
}



class InputManager {
    constructor() {
        this.activeNode = null
        this.indentLevel = 0
        this.$edditor = document.querySelector('.edditor')
        this.optionsEvents = new OptionEventEmitter()
        this.mountOptions()
        this.focusListeners()

        this.optionsEvents.addEventListener('title', (val) => {
            console.log('ww')
            const newElem = val ? 'h1' : 'p'
            this.replaceParentNode(this.activeNode, newElem)
        })

        

    }

    replaceParentNode(old, newName) {
        const newElem = document.createElement(newName);
        let index;
      
        while (old.firstChild) {
          newElem.appendChild(old.firstChild);
        }

        for (index = old.attributes.length - 1; index >= 0; --index) {
          newElem.attributes.setNamedItem(old.attributes[index].cloneNode());
        }

        old.parentNode.replaceChild(newElem, old);
    }

    handleKeydown(event) {
        if (!this.activeNode) {
            this.activeNode = document.createElement('p')
            this.$edditor.appendChild(this.activeNode)
        }
    }

    mountOptions() {
        document.querySelectorAll('.sidebar__options').forEach(option => {
            option.addEventListener('click', (e) => {
                const target = e.target
                if (target.classList.contains('sidebar__options__isengaged')) {
                    target.classList.remove('sidebar__options__isengaged')
                    this.optionsEvents.emit(target.getAttribute('data-name'), false)
                    return
                }
                document.querySelectorAll('.sidebar__options').forEach(elem => {
                    if (elem.classList.contains('sidebar__options__isengaged')) {
                        elem.classList.remove('sidebar__options__isengaged')
                        this.optionsEvents.emit(elem.getAttribute('data-name'), false)
                    }
                })
                target.classList.add('sidebar__options__isengaged')
                this.optionsEvents.emit(target.getAttribute('data-name'), true)
            })
        })
    }

    focusListeners() {
        document.querySelector('[contenteditable]').addEventListener('click', e => this.activeNode = e.target)
    }

    createTag(name) {
        const elem = document.createElement(name)
        elem.contenteditable = 'true'
        elem.addEventListener('click', e => this.activeNode = e.target)
        return elem
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new InputManager()
})