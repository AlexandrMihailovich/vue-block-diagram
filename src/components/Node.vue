<template>
    <svg :x="node.x" :y="node.y"
    >
        <filter id="dropshadow" height="130%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="2" dy="2" result="offsetblur"/>
            <feComponentTransfer>
                <feFuncA type="linear" slope="0.5"/>
            </feComponentTransfer>
            <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
        <g>
            <rect
                    rx="2" ry="2"
                    :fill="node.color"
                    stroke="rgba(0,0,0,0.25)"
                    :stroke-width="selected ? 2 : 0"
                    x="5" y="10"
                    :width="node.width" :height="node.height"
                    style="filter:url(#dropshadow)"
                    class="node-dark-background">
            </rect>
            <svg x="0" y="0" @mousedown="mouseDown($event, 'onStartDrag')"
                 @mouseenter="mouseenter"
                 @mouseleave="mouseleave">
                <rect
                        rx="2" ry="2"
                        fill="#111"
                        :fill-opacity="selected ? 0.5 : titleFillOpacity"
                        x="5" y="10"
                        :width="node.width" height="25"
                        class="node-dark-background"
                >
                </rect>
                <text :x="10" :y="27" font-size="14" fill="#fff" ref="title">{{node.title}}</text>
                <g v-if="node.deletable" @click="deleteNode"
                   @mouseenter="mouseenterClose"
                   @mouseleave="mouseleaveClose">
                    <circle :cx="node.width-8" cy="22" r="9"
                            fill="#ffffff"
                            :fill-opacity="closeOpacity"/>
                    <line
                            :x1="node.width-3" :y1="17"
                            :x2="node.width - 13" :y2="27"
                            style="stroke:#fff;"
                            stroke-width="2"
                    />
                    <line
                            :x1="node.width - 13" :y1="17"
                            :x2="node.width-3" :y2="27"
                            style="stroke:#fff;"
                            stroke-width="2"
                    />
                </g>
            </svg>
            <g>
                <rect
                        fill="#ffffff"
                        x="5" y="35"
                        :width="node.width" :height="node.height - 30"
                        class="node-light-background">
                </rect>
                <foreignObject :width="node.width - 8" :x="9" :y="40" font-size="14" fill="#000000" :height="node.height - 30">
                    <div xmlns="http://www.w3.org/1999/xhtml" class="node-text"
                         :style="{ height: (node.height - 30) + 'px' }">{{node.content}}</div>
                </foreignObject>
                <rect
                        fill="#ffffff"
                        rx="2" ry="2"
                        x="5" :y="node.height+2"
                        :width="node.width" height="8"
                        class="node-dark-background"
                >
                </rect>
            </g>
            <slot></slot>
        </g>
        <polygon class="node-resize" :points="points"
                 fill="#e0e0e0" fill-opacity="0.5" stroke="purple" rx="2" ry="2" stroke-width="0"
                 @mousedown="mouseDown($event, 'onStartResize')"
                 @mouseenter="mouseenter"
                 @mouseleave="mouseleave" />
    </svg>
</template>
<script>
    export default {
        name: 'Node',
        props: {
            selected: Boolean,
            node: Object
        },
        data () {
            return {
                nodeStrokeWidth: 0,
                titleFillOpacity: 0.0,
                closeOpacity: 0.0
            }
        },
        mounted: function () {
            this.node.minWidth = this.$refs.title.getBBox().width + 30
        },
        computed: {
            points: function () {
                let stats = [
                    {x: this.node.width + 5, y: this.node.height - 5},
                    {x: this.node.width + 5, y: this.node.height + 10},
                    {x: this.node.width - 10, y: this.node.height + 10}
                ]
                return stats.map(function (stat) {
                    let point = stat
                    return point.x + ',' + point.y
                }).join(' ')
            }
        },
        methods: {
            deleteNode: function () {
                this.$emit('delete')
            },
            mouseDown: function (event, type) {
                this.$emit(
                    type,
                    { type: type, node: this.node },
                    {mouse: event.pageX, node: this.node.x},
                    {mouse: event.pageY, node: this.node.y}
                )
            },
            mouseenter () {
                this.titleFillOpacity = 0.15
            },
            mouseleave () {
                this.titleFillOpacity = 0.0
            },
            mouseenterClose () {
                this.closeOpacity = 0.25
            },
            mouseleaveClose () {
                this.closeOpacity = 0.0
            }
        }
    }
</script>

<style>
    .node-text {
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .node-resize {
        cursor: nw-resize;
    }
</style>
