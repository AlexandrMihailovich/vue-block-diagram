<template>
    <g>
        <svg :y="port.y + 55" v-if="port.type === 'in'">
            <rect
                    :fill="fill"
                    ref="handle"
                    x="0" y="0"
                    width="10" height="10"
                    @mouseenter="enter" @mouseleave="leave" @mousedown="startDragNewLink" @mouseup="mouseup">
            </rect>
            <text v-if="port.showName"  x="12" y="9" font-size="8pt" fill="#000000">{{port.name}}</text>
        </svg>
        <svg :y="port.y + 55" v-else>
            <rect
                    :fill="fill"
                    ref="handle"
                    :x="nodeWidth" y="0"
                    rx="5" ry="5"
                    width="10" height="10"
                    @mouseenter="enter" @mouseleave="leave" @mousedown="startDragNewLink" @mouseup="mouseup">
            </rect>
            <text v-if="port.showName" :x="nodeWidth - 6" y="9" text-anchor="end" font-size="8pt" fill="#000000">{{port.name}}</text>
        </svg>
    </g>
</template>
<script>
    export default {
        name: 'Port',
        props: ['nodeWidth', 'port'],
        data () {
            return {
                fill: '#444444'
            }
        },
        methods: {
            mouseup () {
                this.$emit('mouseUpPort', this.port)
            },

            enter () {
                this.fill = '#888888'
            },

            leave () {
                this.fill = '#444444'
            },
            startDragNewLink () {
                this.$emit('onStartDragNewLink', this.port)
            }
        }
    }
</script>
