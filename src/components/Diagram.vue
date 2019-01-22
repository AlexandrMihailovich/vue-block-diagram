<template>
    <div>
        <SvgPanZoom
                :style="{ width: width + 'px', height: height + 'px'}"
                xmlns="http://www.w3.org/2000/svg"
                :zoomEnabled="zoomEnabled"
                id="svgroot"
                :panEnabled="panEnabled"
                :controlIconsEnabled="true"
                :fit="false"
                :center="true"
                viewportSelector="#svgroot2"
                :preventMouseEventsDefault="false"
                :beforePan="beforePan">
            <svg
                    id="svgroot2"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    :viewBox="'0 0 ' + width + ' ' + height"
                    :width="width"
                    :height="height"
                    preserveAspectRatio="xMinYMin meet"
                    class="svg-content"
                    ref="dragramRoot"
                    @mousemove="mouseMove($event)"
                    @mouseup="mouseUp">

                <rect x="-5000px" y="-5000px" width="10000px" height="10000px" fill="#eee"
                      @mousedown="clearSelection" ref="grid" class="svg-pan-zoom_viewport"/>
                <g ref="viewPort" id="viewport" x="50" y="50">

                    <Link
                            :key="link.id"
                            :link="link"
                            :isSelect="link.id === model.currentItem.id"
                            v-for="link in model._model.links"
                            @onLinkClick="selectLink"
                            @delete="model.deleteLink(link)"
                    />
                    <line
                            :x1="getPortHandlePosition(newLink.startPort).x"
                            :y1="getPortHandlePosition(newLink.startPort).y"
                            :x2="convertXYtoViewPort(mouseX, 0).x"
                            :y2="convertXYtoViewPort(0, mouseY).y"
                            style="stroke:rgb(255,0,0);stroke-width:2"
                            v-if="newLink"
                    />
                    <Node
                            :node="node"
                            :key="node.id"
                            :selected="model.currentItem.id === node.id"
                            v-for="node in model._model.nodes"
                            @onStartDrag="startDragItem"
                            @onStartResize="startDragItem"
                            @delete="model.deleteNode(node)"
                    >
                        <Port
                                v-for="port in node.ports"
                                :ref="'port-' + port.id"
                                :key="port.id"
                                :nodeWidth="node.width"
                                :port="port"
                                @onStartDragNewLink="startDragNewLink"
                                @mouseUpPort="mouseUpPort"
                        />
                    </Node>

                </g>
            </svg>
        </SvgPanZoom>
    </div>
</template>
<script>
    import SvgPanZoom from 'vue-svg-pan-zoom'

    import Model from './../Model'
    import Node from './Node'
    import Link from './Link'
    import Port from './Port'

    function getAbsoluteXY (element) {
        let viewportElement = document.documentElement
        let box = element.getBoundingClientRect()
        let scrollLeft = viewportElement.scrollLeft
        let scrollTop = viewportElement.scrollTop
        let x = box.left + scrollLeft
        let y = box.top + scrollTop
        return { x: x, y: y }
    }

    export default {
        name: 'Diagram',
        Model: Model,

        props: {
            model: {
                required: true
            },
            width: {
                default: 500
            },
            height: {
                default: 500
            }
        },

        data () {
            this.updateLinksPositions()

            return {
                document,
                zoomEnabled: true,
                panEnabled: true,
                draggedItem: undefined,
                selectedItem: {},
                initialDragX: 0,
                initialDragY: 0,
                newLink: undefined,
                mouseX: 0,
                mouseY: 0
            }
        },
        components: {
            Node,
            Link,
            Port,
            SvgPanZoom
        },

        methods: {
            convertXYtoViewPort (x, y) {
                let rootelt = document.getElementById('svgroot2')
                let rec = document.getElementById('viewport')
                let point = rootelt.createSVGPoint()
                let rooteltPosition = getAbsoluteXY(rootelt)
                point.x = x - rooteltPosition.x
                point.y = y - rooteltPosition.y
                let ctm = rec.getCTM().inverse()
                return point.matrixTransform(ctm)
            },
            beforePan () {
                if (this.selectedItem.type || this.draggedItem || this.newLink) { return false } else return true
            },

            clearSelection () {
                this.model.setCurrentItem({})
            },

            updateLinksPositions () {
                let links = []

                if (this.model && this.model._model) links = this.model._model.links

                this.$nextTick(() => {
                    setTimeout(() => {
                        for (let i = 0; i < links.length; i++) {
                            let coords
                            coords = this.getPortHandlePosition(links[i].from.port)
                            links[i].setFrom({ x: coords.x, y: coords.y })
                            coords = this.getPortHandlePosition(links[i].to.port)
                            links[i].setTo({ x: coords.x, y: coords.y })

                        }
                    }, 100)
                })
            },

            startDragNewLink (startPort) {
                this.clearSelection()
                this.model.setCurrentItem(startPort)
                this.panEnabled = false
                this.newLink = {
                    startPort
                }
            },

            getPortHandlePosition (port) {
                if (this.$refs['port-' + port.id]) {
                    let node = port.node
                    let x
                    let y
                    if (port.type === 'in') {
                        x = node.x + 10
                        y = node.y + port.y + 64
                    } else {
                        x = node.x + node.width + 10
                        y = node.y + port.y + 64
                    }

                    return { x, y }
                } else {
                    console.warn(
                        `port "${port.id}" not found. you must call this method after the first render`
                    )
                    return 0
                }
            },

            resize (mouseX, mouseY, node) {
                node.width = mouseX - node.x

                node.height = mouseY - node.y
            },

            mouseMove (pos) {
                this.mouseX = pos.pageX
                this.mouseY = pos.pageY
                if (this.draggedItem) {
                    let type = this.draggedItem.type
                    let coords = this.convertXYtoViewPort(this.mouseX, this.mouseY)

                    if (type === 'onStartResize') {
                        this.resize(coords.x, coords.y, this.draggedItem.node)
                    } else {
                        this.draggedItem.node.x = coords.x - this.initialDragX
                        this.draggedItem.node.y = coords.y - this.initialDragY
                    }
                    this.updateLinksPositions()
                }
            },

            mouseUp () {
                this.draggedItem = undefined
                this.newLink = undefined
            },

            mouseUpPort (port) {
                if (this.newLink !== undefined) {
                    let port1 = this.newLink.startPort
                    let port2 = port

                    this.model.addLink(
                        {node: port1.node, port: port1},
                        {node: port2.node, port: port2},
                        [])

                    this.updateLinksPositions()
                }
            },

            selectLink (link) {
                this.model.setCurrentItem(link)
            },

            startDragItem (item, x, y) {
                let initialDrag = this.convertXYtoViewPort(x.mouse, y.mouse)
                this.panEnabled = false
                this.draggedItem = item
                this.model.setCurrentItem(item.node)
                this.initialDragX = (initialDrag.x - x.node)
                this.initialDragY = (initialDrag.y - y.node)
            }
        },
        watch: {
            'model._model.links': function () {
                this.updateLinksPositions()
            }
        }
    }
</script>
