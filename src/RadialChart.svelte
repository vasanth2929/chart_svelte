<script lang="ts">
    // Import Core Modules
    import { onMount } from "svelte";
    // Import Types
    export let width: number = 500;
    export let height: number = 500;
    export let data = [];
    let strokeWidth: number = 20;
    let startRadius: number = 30;
    let radiusGap: number = 30;
    let max: number, min: number;
    let rightValues: any[] = [];
    let leftValues = [];

    // on mounting
    onMount(() => {
        // assuming min and max value
        max = data[0].left.value;
        min = data[0].left.value;
        data = data.map((item, i) => {
            // finding min and max value
            if (item.left.value < min) min = item.left.value;
            if (item.right.value < min) min = item.right.value;
            if (item.left.value > max) max = item.left.value;
            if (item.right.value > max) max = item.right.value;
            // adding radius key
            i = i + 1;
            return { ...item, radius: startRadius + i * radiusGap };
        });
        for (let i = min; i <= max; i = i + 1) {
            rightValues = [...rightValues, { text: i }];
            leftValues = [...leftValues, { text: i }];
        }
        rightValues = rightValues.map((item, i) => {
            return {
                ...item,
                x: findXPosition(150, (90 / rightValues.length) * i),
                y: height / 2 - i * 30,
            };
        });
        leftValues = leftValues.map((item, i) => {
            return {
                ...item,
                x: findXPosition(150, (90 / rightValues.length) * i),
                y: height / 2 - i * 30,
            };
        });
        leftValues.reverse();
        rightValues.reverse();
    });

    let findXPosition = (radius: number, angle: number) => {
        let angleInRadians = (angle * Math.PI) / 180;
        return width / 2 + radius * Math.cos(angleInRadians);
    };
</script>

<style>
    svg {
        border: 1px dashed red;
        overflow: visible;
    }
    text {
        font-size: 14px !important;
    }
    .right-value {
        transform: translateX(20px);
    }
</style>

<svg {width} {height}>
    <!--    color -->
    <defs>
        <linearGradient id="mygradient">
            <stop offset="50%" stop-color="#ED8C8C
" />
            <stop offset="50%" stop-color="#AAF092
" />
        </linearGradient>
    </defs>
    {#each data as d, i}
        <!--    actual circle -->
        <circle
            cx={width / 2}
            cy={height / 2}
            r={d.radius}
            stroke="url(#mygradient)"
            stroke-width={strokeWidth}
            fill="none" />

        <!--    left side slice -->
        <!-- <rect
            x={-d.radius + 20}
            y={height / 2 - d.radius - strokeWidth}
            width="50%"
            height="60%"
            fill="white" /> -->

        <!--    right side slice -->
        <!-- <rect
            x={width / 2 + d.radius - strokeWidth / 2}
            y={height / 2 - d.radius - strokeWidth}
            width="50%"
            height="60%"
            fill="red" /> -->
    {/each}

    <!--   value indicator -->
    <circle
        cx={width / 2}
        cy={height / 2}
        r="150"
        fill="none"
        stroke="orange"
        stroke-dasharray="5"
        stroke-width="1" />

    <!-- value text -->
    {#each rightValues as value, i}
        <!-- right side value -->
        <text class="right-value" x={value.x} y={value.y}>{value.text}</text>
    {/each}

    {#each leftValues as value}
        <!-- left side value -->
        <text class="left-value" x={value.x} y={value.y}>{value.text}</text>
    {/each}

    <!--    to make semi circle -->
    <rect y="50%" height="50%" width="100%" fill="white" />

    <!--    center vertical line -->
    <rect width="5" y={120} height="50%" x={width / 2} />
</svg>
