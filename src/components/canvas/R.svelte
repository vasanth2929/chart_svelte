<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import Konva from "konva";
    import type { Stage } from "konva/types/Stage";
    import type { Layer } from "konva/types/Layer";
    import {
        degreesToRadians,
        findMinAndMax,
        getNumbers,
        findXPosition,
    } from "../../utils";
    import type { Shape } from "konva/types/Shape";
    let left, right;
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
    let shapes: Shape[] = [];
    export let data = [];
    let isSlicing = true;
    let { max, min } = findMinAndMax(data);

    function chart(ele: HTMLElement, options: Option) {
        let layer: Layer, stage: Stage, rightArc: Shape, leftArc: Shape;
        function draw(options: Option) {
            let wrapper = document.createElement("div");
            wrapper.id = "radial-chart";
            ele.appendChild(wrapper);
            let width = options.width || 500;
            let height = options.height || 500;
            stage = new Konva.Stage({
                container: "radial-chart",
                width,
                height,
            });
            layer = new Konva.Layer();
            let startRadius = 150;
            let radiusGap = 30;
            let indexOf;
            let { data } = options;

            let numbers = getNumbers(min, max);
            let revArr = [...numbers];
            numbers.reverse();
            // right text
            // for (let i = 0; i < numbers.length; i++) {
            //     // right text
            //     ctx.beginPath();
            //     ctx.fillStyle = options.fontColor;
            //     ctx.fillText(
            //         numbers[i].toString(),
            //         findXPosition(width, 180, (90 / numbers.length) * i) +
            //             (i < 1 ? 6 : i * 8),
            //         height / 2 - i * 35
            //     );
            //     ctx.closePath();
            //     // left text
            //     ctx.beginPath();
            //     ctx.fillStyle = options.fontColor;
            //     ctx.fillText(
            //         numbers[i].toString(),
            //         findXPosition(
            //             width,
            //             180,
            //             360 - 180 - (90 / numbers.length) * i
            //         ) -
            //             (i < 1 ? 6 : i * 8) -
            //             5,
            //         height / 2 - i * 35
            //     );
            //     ctx.closePath();
            // }
            // // arc
            for (let i = 0; i < data.length; i++) {
                rightArc = new Konva.Shape({
                    strokeWidth: 30,
                    stroke: "palegreen",
                    sceneFunc: (c, shape) => {
                        c.moveTo(width / 2, height / 2);
                        c.beginPath();
                        indexOf = revArr.indexOf(data[i].right.value) + 1;
                        c.arc(
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
                        c.fillStrokeShape(shape);
                        c.closePath();
                    },
                });
                leftArc = new Konva.Shape({
                    strokeWidth: 30,
                    stroke:
                        data[i].left.value <= data[i].right.value
                            ? options.rightArcColor
                            : options.leftArcColorOnFailure,
                    sceneFunc: (c, shape) => {
                        c.moveTo(width / 2, height / 2);
                        c.beginPath();
                        indexOf = revArr.indexOf(data[i].left.value) + 1;
                        c.arc(
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
                        c.fillStrokeShape(shape);
                        c.closePath();
                    },
                });

                layer.add(rightArc);
                layer.add(leftArc);
            }
            stage.add(layer);

            let indicatorShape = new Konva.Shape({
                stroke: options.valueInticatorColor || "orange",
                strokeWidth: 2,
                sceneFunc: (c, shape) => {
                    c.beginPath();
                    c.arc(
                        width / 2,
                        height / 2,
                        180,
                        degreesToRadians(360),
                        degreesToRadians(180),
                        true
                    );
                    c.fillStrokeShape(shape);
                },
            });

            layer.add(indicatorShape);

            let verticalLineShape = new Konva.Shape({
                stroke: options.verticalLineColor || "black",
                strokeWidth: 3,
                sceneFunc: (c, shape) => {
                    c.beginPath();
                    c.moveTo(width / 2, height / 2);
                    c.lineTo(width / 2, height / 2 - startRadius - 15);
                    c.stroke();
                    c.fillStrokeShape(shape);
                },
            });

            layer.add(verticalLineShape);

            // left side label
            let leftLabel = new Konva.Text({
                x: width / 2 - 180 - 40,
                y: height / 2 + 40,
                text: options.leftLabel,
            });
            layer.add(leftLabel);

            //right side label
            let rightLabel = new Konva.Text({
                x: width / 2 + 180 - 40,
                y: height / 2 + 40,
                text: options.rightLabel,
            });
            layer.add(leftLabel);
            layer.add(rightLabel);

            layer.on("click", function (e) {
                console.log(e);
            });
            layer.draw();
        }
        draw(options);
        return {
            update(param) {
                ele.innerHTML = "";
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
        // let values = [3, 4, 5, 6, 7, 8];
        // let tempData = [];
        // for (let i = 0; i < 5; i++) {
        //     tempData.push({
        //         name: "M" + (i + 1),
        //         left: {
        //             name: "spent",
        //             value: values[Math.floor(Math.random() * values.length)],
        //         },
        //         right: {
        //             name: "estimate",
        //             value: values[Math.floor(Math.random() * values.length)],
        //         },
        //     });
        // }
        // options = { ...options, data: tempData };
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

<style>
    .chart__tooltip {
        position: absolute;
    }
</style>

{#if !isSlicing}
    <div use:chart={options} />
{/if}

<div class="chart__tooltip">
    <p>{data[0]?.left?.name} - {left}</p>
    <p>{data[0]?.right?.name} - {right}</p>
</div>
