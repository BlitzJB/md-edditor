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
        this.optionsEvents = new OptionEventEmitter()
        this.mountOptions()
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
}


document.addEventListener('DOMContentLoaded', () => new InputManager())