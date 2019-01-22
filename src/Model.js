import Node from './Node'
import Links from './Links'

let generateId = function () {
    return Math.trunc(Math.random() * 1000)
}

/**
 * @class Model
 */
class Model {
    constructor () {
        this._model = {
            nodes: [],
            links: []
        }

        this.currentItem = {}
    }

    setCurrentItem (item) {
        this.currentItem = item
        if (item.it === 'node') {
            const index = this._model.nodes.indexOf(item)
            this._model.nodes.splice(index, 1)
            this._model.nodes.push(item)
        }
    }

    addNode (title, x, y, width, height) {
        const newNode = new Node(generateId(), title, x, y, width, height)
        this._model.nodes.push(newNode)
        this.setCurrentItem(newNode)
        return newNode
    }

    deleteNode (node) {
        const index = this._model.nodes.indexOf(node)
        node.ports.forEach(port => this.deleteLinksByPort(port))
        this._model.nodes.splice(index, 1)
    }

    deleteLink (link) {
        const index = this._model.links.indexOf(link)
        this._model.links.splice(index, 1)
    }
    deletePort (port) {
        this.deleteLinksByPort(port)
        port.node.deletePort(port)
    }

    deleteLinksByPort (port) {
        let links = this.getLinksByPort(port)
        links.forEach((link) => {
            this.deleteLink(link)
        })
    }

    addLink (from, to, points = []) {
        let link
        if (to.port.type === 'in' && from.port.type === 'out') {
            link = new Links(generateId(), from, to, {}, {}, points)
        } else if (from.port.type === 'in' && to.port.type === 'out') {
            link = new Links(generateId(), to, from, {}, {}, points)
        } else {
            console.warn('You must link one out port and one in port')
            return false
        }
        this._model.links.push(link)
        return link
    }

    serialize () {
        let seen = []

        return JSON.stringify(this._model, function (key, val) {
            if (val != null && typeof val === 'object') {
                if (seen.indexOf(val) >= 0) {
                    return val.id
                }
                seen.push(val)
            }
            return val
        })
    }

    deserialize (serializedModel) {
        let data = JSON.parse(serializedModel)

        data.nodes.forEach((node) => {
            let nodeItem = new Node(node.id, node.title, node.x, node.y, node._width, node.height)
            nodeItem.content = node.content
            nodeItem.color = node.color
            this._model.nodes.push(nodeItem)
            node.ports.forEach((port) => {
                nodeItem.addPort(port.id, port.type, port.name).showName = port.showName
            })
        })

        data.links.forEach((link) => {
            let fromNode = this.getNodeById(link.from.node)
            let toNode = this.getNodeById(link.to.node)
            this._model.links.push(new Links(link.id,
                {node: fromNode, port: fromNode.getPortById(link.from.port)},
                {node: toNode, port: toNode.getPortById(link.to.port)}, {}, {}, link.points))
        })

        return data
    }

    getNodeById (id) {
        return this._model.nodes.find((node) => {
            if (node.id === id) { return node }
            return false
        })
    }

    getLinkById (id) {
        return this._model.links.find((link) => {
            if (link.id === id) { return link }
            return false
        })
    }

    getLinksByPort (port) {
        let type = (port.type === 'in') ? 'to' : 'from'
        return this._model.links.filter((link) => {
            if (link[type].port === port) { return link }
            return false
        })
    }

    getLink (index) {
        return this._model.links[index]
    }

    getNode (index) {
        return this._model.nodes[index]
    }
}

export default Model
