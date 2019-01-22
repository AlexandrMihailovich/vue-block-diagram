import Port from './Port'
import Item from './Item'

let generateId = function () {
    return Math.trunc(Math.random() * 1000)
}

/**
 * @class Node
 */
class Node extends Item {
    constructor (id, title, x, y, width, height) {
        super(id, '#1867c0')
        this.title = title
        this.x = x
        this.y = y
        this._width = width
        this.minWidth = 100
        this._height = height
        this.ports = []
        this.deletable = true
        this.it = 'node'
        this.content = ''
        this.inCount = 0
        this.outCount = 0
    }

    get width () {
        return this.minWidth > this._width ? this.minWidth : this._width
    }

    set width (newWidth) {
        if (newWidth > this.minWidth) { this._width = newWidth }
        return false
    }

    minHeight () {
        let max = this.inCount > this.outCount ? this.inCount : this.outCount
        return max * 20 + 55
    }

    get height () {
        return this.minHeight() > this._height ? this.minHeight() : this._height
    }

    set height (newHeight) {
        if (newHeight > this.minHeight()) { this._height = newHeight }
        return false
    }

    addInPort (name) {
        return this.addPort(generateId(), 'in', name)
    }

    addOutPort (name) {
        return this.addPort(generateId(), 'out', name)
    }

    addPort (id, type, name) {
        let newPort = new Port(id, type, name, this)

        this.ports.push(newPort)

        this.computePortsY()

        return newPort
    }

    computePortsY () {
        let ins = 0
        let outs = 0
        this.ports.forEach(port => {
            port.y = (port.type === 'in' ? ins++ : outs++) * 20
        })
        this.inCount = ins
        this.outCount = outs
    }

    getPortById (id) {
        return this.ports.find((port) => {
            if (port.id === id) { return port }
            return false
        })
    }

    deletePort (port) {
        const index = this.ports.indexOf(port)
        this.ports.splice(index, 1)
        this.computePortsY()
    }
}

export default Node
