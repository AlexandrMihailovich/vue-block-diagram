<template>
    <g
            @mouseenter="mouseEnter"
            @mouseleave="mouseLeave"
    >
        <g
                @mousedown="mouseDown($event, 0)"
        >
            <path
                    :d="curve"
                    :style="largeStrokeStyle"
                    stroke-width="8"
                    fill="none"
            />
            <path
                    :d="curve"
                    :style="isSelect ? selectedLinkStyle : freeLinkStyle"
                    stroke-width="2"
                    fill="none"
            />
        </g>
        <g v-if="isSelect" v-on:click="deleteLink">
            <circle :cx="x1 + 8" :cy="y1 - 22" r="9"
                    fill="#1867c0"
                    :fill-opacity="1"/>
            <line
                    :x1="x1 + 13" :y1="y1 - 27"
                    :x2="x1 + 3" :y2="y1 - 17"
                    style="stroke:#fff;"
                    stroke-width="2"
            />
            <line
                    :x1="x1 + 3" :y1="y1 - 27"
                    :x2="x1 + 13" :y2="y1 - 17"
                    style="stroke:#fff;"
                    stroke-width="2"
            />
        </g>
    </g>
</template>
<script>
    export default {
        name: 'Link',
        props: ['isSelect', 'link'],

        components: {
        },

        data () {
            return {
                largeStrokeStyle: 'stroke:rgba(255,0,0,0.0);',
                selectedLinkStyle: 'stroke:rgba(255,0,0,1.0);',
                freeLinkStyle: 'stroke:rgba(0,0,0,1.0);',
                mouseClick: {}
            }
        },
        methods: {
            deleteLink () {
                this.$emit('delete')
            },
            mouseEnter () {
                this.largeStrokeStyle = 'stroke:rgba(255,0,0,0.5);'
            },
            mouseLeave () {
                this.largeStrokeStyle = 'stroke:rgba(255,0,0,0.0);'
            },
            mouseDown (pos) {
                this.mouseClick = pos
                this.$emit('onLinkClick', this.link)
            }
        },
        computed: {
            x1 () {
                return this.link.positionFrom.x
            },

            y1 () {
                return this.link.positionFrom.y - 4
            },

            x2 () {
                return this.link.positionTo.x - 4
            },

            y2 () {
                return this.link.positionTo.y - 4
            },

            curve () {
                let x1 = Math.trunc(this.link.positionFrom.x)
                let y1 = Math.trunc(this.link.positionFrom.y - 4)
                let x2 = Math.trunc(this.link.positionTo.x - 4)
                let y2 = Math.trunc(this.link.positionTo.y - 4)

                let distance = Math.trunc(4 * Math.sqrt(Math.abs(x1 - x2)))
                let path = `M${x1},${y1} C${x1 + distance},${y1} ${x2 -
                distance},${y2} ${x2},${y2}`
                return path
            }
        }
    }
</script>
