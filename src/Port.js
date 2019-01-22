import Item from './Item'

/**
 * @class Port
 */
class Port extends Item {
    constructor (id, type, title, node) {
        super(id, '#000000')
        this.type = type
        this.title = title
        this.node = node
        this.y = 0
        this.it = 'port'
        this.showName = false
    }
}

export default Port
