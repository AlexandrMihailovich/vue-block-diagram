import Item from './Item'

/**
 * @class Links
 */
class Links extends Item {
    constructor (id, from, to, positionFrom, positionTo, points) {
        super(id, '#000000')
        this.from = from
        this.to = to
        this.positionFrom = {}
        this.positionTo = {}
        this.points = points
        this.it = 'link'
    }

    setFrom(from) {
        this.positionFrom = from
    }

    setTo(to) {
        this.positionTo = to
    }
}

export default Links
