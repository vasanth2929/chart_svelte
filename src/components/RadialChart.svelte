<script lang="ts">
    // Import Core Modules
    import { onMount } from "svelte";
    // Import Types
    export let width: number = 500;
    export let height: number = 500;
    export let data = [];
    let strokeWidth: number = 20;
    let startRadius: number = 150;
    let radiusGap: number = 40;
    let max: number, min: number;
    let rightValues: any[] = [];
    let leftValues = [];

    let hintboxVisible : boolean = false;
    let hintBoxTop : number = 0;
    let hintBoxLeft : number = 0;
    let name : string = '';
    let spent : string = '';
    let estimate : string = '';

    let handleMouseEnter = (e,milestone)=>{
      hintBoxTop = e.clientY;	
		  hintBoxLeft = e.clientX;
		  hintboxVisible=true;
		  spent = milestone.left.value;
		  estimate = milestone.right.value;
		  name = milestone.name;
	}
	let handleMouseLeave = ()=>{hintboxVisible=false};

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
            return { ...item, radius: startRadius - i * radiusGap };
        });
        for (let i = max; i >= min; i = i - 1) {
            rightValues = [...rightValues, { text: i }];
            leftValues = [...leftValues, { text: i }];
        }
        rightValues = rightValues.map((item, i) => {
            return {
                ...item,
                x: findXPosition(150, (90 / rightValues.length) * i),
                y: height / 2 - i * 30,
                angle: 90/rightValues.length * i
            };
        });
        leftValues = leftValues.map((item, i) => {
            return {
                ...item,
                x: findXPosition(
                    150,
                    360 - 180 - (90 / rightValues.length) * i
                ),
                y: height / 2 - i * 30,
                angle: 360 - 180 - (90 / rightValues.length) * i
            };
        });
        leftValues.reverse();
        rightValues.reverse();
    });
    
    let findXPosition = (radius: number, angle: number) => {
        let angleInRadians = (angle * Math.PI) / 180;
        return width / 2 + radius * Math.cos(angleInRadians);
    };
    
    let findItem = (val)=>{
        let item = rightValues.find(item=>item.text === val);
        return item;
    }

    let getPoints = (d)=>{
       return `
            ${width/2} ${height/2},
            ${findItem(d.right.value).x - strokeWidth/2 - radiusGap/2} ${findItem(d.right.value).y} ,
            ${width/2 + d.radius+strokeWidth/2} ${height/2} 
       `;
    } 
</script>

<style>
    svg {
        border: 1px dashed red;
        overflow: visible;
    }
    text {
        font-size: 14px !important;
    }
    /* .right-value {
        transform: translateX(20px);
    } */
    .left-value {
        transform: translateX(-25px);
    }
    .hint__box {
		padding:8px;
		position:absolute;
		background:white;
		box-shadow:1px 1px 5px black,-1px -1px 5px black
	}
	.hint__box p {
    font-size:14px;
		text-align:center
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
            on:mouseenter={(e)=>handleMouseEnter(e,d)}
            on:mouseleave={handleMouseLeave}
            cx={width / 2}
            cy={height / 2}
            r={d.radius}
            stroke={d.left.value <= d.right.value ? "#AAF092" : "url(#mygradient)"}
            stroke-width={strokeWidth}
            fill="none" />
        
        <!-- right slice     -->
        {#if d.right.value < max}
        <polyline 
        points= {getPoints(d)}
        fill="green"
        />
        {/if}
         
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


<!-- tooltip -->
{#if hintboxVisible}
<div class="hint__box" style={`top:${hintBoxTop}px;left:${hintBoxLeft}px`}>
    <p style="text-align:center">
        {name}
    </p>
    <p>
        Spent : {spent}
    </p>
    <p>
        Estimate : {estimate}
    </p>
</div>
{/if}