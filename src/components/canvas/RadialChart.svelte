<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { degreesToRadians } from "../../utils";
    let ticks = [1, 2, 3, 4, 5];

    interface Option {
        width?: number;
        height?: number;
        data: any[];
        fontColor?: string;
        leftLabel?: string;
        rightLabel?: string;
        valueInticatorColor?: string;
        verticalLineColor?: string;
        rightArcColor?: string;
        leftArcColorOnFailure?: string;
        backgroundColor?: string;
    }
    export let data = [];
    let isSlicing = true;
    // let { max, min } = findMinAndMax(data);

    function chart(ele: HTMLElement, options: Option) {
        let writeText = (ctx, text, x, y) => {
            ctx.beginPath();
            ctx.fillStyle = options.fontColor;
            ctx.fillText(text, x, y);
            ctx.closePath();
        };
        function draw(options) {
            let canvas = document.createElement("canvas");
            canvas.classList.add("radial-chart");
            let startRadius = 150;
            let radiusGap = 30;
            let indexOf;
            let { data } = options;
            let width = options.width || 500;
            let height = options.height || 500;
            canvas.width = width;
            canvas.height = height;
            canvas.setAttribute(
                "style",
                `background-color:${options.backgroundColor || "transparent"}`
            );

            let ctx = canvas.getContext("2d");

            // right text
            let revArr = [...ticks];

            writeText(ctx, "1", 180, 80);
            writeText(ctx, "1", 315, 80);

            writeText(ctx, "2", 120, 110);
            writeText(ctx, "2", 375, 110);

            writeText(ctx, "3", 80, 160);
            writeText(ctx, "3", 415, 160);

            writeText(ctx, "4", 65, 200);
            writeText(ctx, "4", 430, 200);

            writeText(ctx, "5", 60, height / 2);
            writeText(ctx, "5", 435, height / 2);

            // arc
            for (let i = 0; i < data.length; i++) {
                // right arc
                ctx.beginPath();
                ctx.strokeStyle = options.rightArcColor || "black";
                ctx.lineWidth = 30;
                indexOf = revArr.indexOf(data[i].right.value) + 1;
                ctx.arc(
                    width / 2,
                    height / 2,
                    startRadius - i * radiusGap,
                    degreesToRadians(
                        360 -
                            (indexOf === ticks.length
                                ? 0
                                : indexOf === 1
                                ? 90 - 90 / ticks.length
                                : 90 / indexOf)
                    ),
                    degreesToRadians(270),
                    true
                );
                ctx.stroke();
                ctx.closePath();

                // left arc
                ctx.beginPath();
                ctx.strokeStyle =
                    data[i].left.value <= data[i].right.value
                        ? options.rightArcColor || "black"
                        : options.leftArcColorOnFailure || "black";
                ctx.lineWidth = 30;
                indexOf = revArr.indexOf(data[i].left.value) + 1;
                ctx.arc(
                    width / 2,
                    height / 2,
                    startRadius - i * radiusGap,
                    degreesToRadians(270),
                    degreesToRadians(
                        180 +
                            (indexOf === ticks.length
                                ? 0
                                : indexOf === 1
                                ? 90 - 90 / ticks.length
                                : 90 / indexOf)
                    ),
                    true
                );
                ctx.stroke();
                ctx.closePath();
            }

            // indicator
            ctx.beginPath();
            ctx.strokeStyle = options.valueInticatorColor || "orange";
            ctx.lineWidth = 2;
            ctx.arc(
                width / 2,
                height / 2,
                180,
                degreesToRadians(360),
                degreesToRadians(180),
                true
            );
            ctx.stroke();
            ctx.closePath();

            // vertical line
            ctx.beginPath();
            ctx.moveTo(width / 2, height / 2);
            ctx.strokeStyle = options.verticalLineColor || "black";
            ctx.lineWidth = 3;
            ctx.lineTo(width / 2, height / 2 - startRadius - 15);
            ctx.stroke();

            // left side label
            ctx.font = "14px Arial";
            ctx.fillText(
                options.leftLabel,
                width / 2 - 180 - 40,
                height / 2 + 40
            );
            ctx.closePath();

            // right side label
            ctx.font = "14px Arial";
            ctx.fillText(
                options.rightLabel,
                width / 2 + 180 - 40,
                height / 2 + 40
            );
            ctx.closePath();

            // appending canvas to the div
            ele.appendChild(canvas);
        }
        draw(options);
        return {
            update(param) {
                let canvas = document.querySelector(".radial-chart");
                canvas.remove();
                draw(param);
            },
        };
    }
    let interval;

    let options: Option = {
        data,
        leftLabel: "Spent Time",
        rightLabel: "Estimate Time",
        rightArcColor: "palegreen",
        leftArcColorOnFailure: "palevioletred",
    };

    let randomize = () => {
        interval = setInterval(() => {
            let tempData = [];
            for (let i = 0; i < 5; i++) {
                tempData.push({
                    name: "M" + i + 1,
                    left: {
                        name: "spent",
                        value: ticks[Math.floor(Math.random() * ticks.length)],
                    },
                    right: {
                        name: "estimate",
                        value: ticks[Math.floor(Math.random() * ticks.length)],
                    },
                });
            }
            options = { ...options, data: tempData };
        }, 3000);
    };
    onMount(() => {
        options = { ...options, data: options.data.slice(0, 5) };
        isSlicing = false;
    });

    onDestroy(() => {
        clearInterval(interval);
    });
</script>

{#if !isSlicing}
    <div use:chart={options} />
{/if}

<button on:click={randomize}>Randomize Value</button>


<style>
    div {
        display: flex;
        justify-content: center;
    }
    @media screen and (min-width:720px){
        div {
            margin-left: -150px;
        }
    }
</style>