<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import {
        degreesToRadians,
        findMinAndMax,
        getNumbers,
        findXPosition,
    } from "../../utils";

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
    let { max, min } = findMinAndMax(data);

    function chart(ele: HTMLElement, options: Option) {
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
            let numbers = getNumbers(min, max);
            let revArr = [...numbers];
            numbers.reverse();

            for (let i = 0; i < numbers.length; i++) {
                // right text
                ctx.beginPath();
                ctx.fillStyle = options.fontColor;
                ctx.fillText(
                    numbers[i].toString(),
                    findXPosition(width, 180, (90 / numbers.length) * i) +
                        (i < 1 ? 6 : i * 8),
                    height / 2 - i * 35
                );
                ctx.closePath();

                // left text
                ctx.beginPath();
                ctx.fillStyle = options.fontColor;
                ctx.fillText(
                    numbers[i].toString(),
                    findXPosition(
                        width,
                        180,
                        360 - 180 - (90 / numbers.length) * i
                    ) -
                        (i < 1 ? 6 : i * 8) -
                        5,
                    height / 2 - i * 35
                );
                ctx.closePath();
            }

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
                            (indexOf === numbers.length
                                ? 0
                                : indexOf === 1
                                ? 90 - 90 / numbers.length
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
                            (indexOf === numbers.length
                                ? 0
                                : indexOf === 1
                                ? 90 - 90 / numbers.length
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

    let options: Option = {
        data,
        width: 500,
        height: 500,
        leftLabel: "Spent Time",
        rightLabel: "Estimate Time",
        rightArcColor: "palegreen",
        leftArcColorOnFailure: "palevioletred",
    };
    let interval = null;

    let generateRandomValues = () => {
        let values = [3, 4, 5, 6, 7, 8];
        let tempData = [];
        for (let i = 0; i < 5; i++) {
            tempData.push({
                name: "M" + i + 1,
                left: { name: "spent", value: values[Math.floor(Math.random() * values.length)]},
                right: { name: "estimate", value: values[Math.floor(Math.random() * values.length)] },
            });
        }
        options = {...options,data:tempData};
    };
    onMount(() => {
        options = { ...options, data: options.data.slice(0, 5) };
        isSlicing = false;
        interval = setInterval(generateRandomValues, 3000);
    });

    onDestroy(() => {
        clearInterval(interval);
    });
</script>

{#if !isSlicing}
    <div use:chart={options} />
{/if}
