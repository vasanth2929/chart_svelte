<script lang="ts">
    // Import Core
    import { onMount, onDestroy } from "svelte";
    import { fade } from "svelte/transition";
    import Konva from "konva";
    // Import Types
    import type { Stage } from "konva/types/Stage";
    import type { Layer } from "konva/types/Layer";
    import type { Shape } from "konva/types/Shape";
    import type { Option } from "../../types";
    // Import Utils
    import { degreesToRadians, findMinAndMax, getNumbers } from "../../utils";

    export let data = [];

    let leftValue: number,
        rightValue: number,
        top: number,
        left: number,
        title: string;
    let showTooltip: boolean = false;

    let isSlicing = true;
    let { max, min } = findMinAndMax(data);

    let writeText = (text, x, y) => new Konva.Text({ text, x, y });

    function chart(ele: HTMLElement, options: Option) {
        let shapes: Array<Shape> = [];
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

            for (let i = 0; i < data.length; i++) {
                rightArc = new Konva.Shape({
                    name: JSON.stringify(data[i]),
                    strokeWidth: 30,
                    stroke: options.rightArcColor || "black",
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
                    name: JSON.stringify(data[i]),
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
                shapes.push(leftArc);
                shapes.push(rightArc);
            }

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

            // left side label
            let leftLabel = new Konva.Text({
                x: width / 2 - 180 - 40,
                y: height / 2 + 40,
                text: options.leftLabel,
            });

            //right side label
            let rightLabel = new Konva.Text({
                x: width / 2 + 180 - 40,
                y: height / 2 + 40,
                text: options.rightLabel,
            });

            let left1Text = writeText("1", 180, 70);
            let right1Text = writeText("1", 315, 70);
            let left2Text = writeText("2", 120, 110);
            let right2Text = writeText("2", 375, 110);
            let left3Text = writeText("3", 80, 160);
            let right3Text = writeText("3", 415, 160);
            let left4Text = writeText("4", 65, 200);
            let right4Text = writeText("4", 430, 200);
            let left5Text = writeText("5", 60, height / 2 - 5);
            let right5Text = writeText("5", 435, height / 2 - 5);

            layer.add(left1Text);
            layer.add(right1Text);
            layer.add(left2Text);
            layer.add(right2Text);
            layer.add(left3Text);
            layer.add(right3Text);
            layer.add(left4Text);
            layer.add(right4Text);
            layer.add(left5Text);
            layer.add(right5Text);

            layer.add(leftLabel);
            layer.add(rightLabel);
            layer.add(indicatorShape);
            shapes.forEach((shape) => {
                layer.add(shape);
            });
            layer.add(verticalLineShape);
            stage.add(layer);
            layer.draw();

            stage.on("click", function (e) {
                if (e.target.attrs?.name) {
                    showTooltip = true;
                    let obj = JSON.parse(e.target.attrs?.name);
                    leftValue = obj.left.value;
                    rightValue = obj.right.value;
                    left = e.evt.clientX;
                    top = e.evt.clientY;
                    title = obj.name;
                } else {
                    showTooltip = false;
                }
            });
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
    // to hide the tooltip
    let hideToolTip = (e: Event) => {
        if (e.target instanceof HTMLCanvasElement === false)
            showTooltip = false;
    };
    onMount(() => {
        options = { ...options, data: options.data.slice(0, 5) };
        isSlicing = false;
        document.addEventListener("click", hideToolTip);
    });

    onDestroy(() => {
        document.removeEventListener("click", hideToolTip);
    });
</script>

<style>
    .chart__tooltip {
        background-color: white;
        padding: 5px 10px;
        background: white;
        box-shadow: 1px 1px 5px black, -1px -1px 5px black;
        font-size: 14px;
        text-align: center;
    }
</style>

{#if !isSlicing}
    <div use:chart={options} />
{/if}

{#if showTooltip}
    <div
        transition:fade
        class="chart__tooltip"
        style={`position:absolute;top:${top}px ;left: ${left}px;`}>
        <p>{title}</p>
        <p>{data[0]?.left?.name} - {leftValue}</p>
        <p>{data[0]?.right?.name} - {rightValue}</p>
    </div>
{/if}
