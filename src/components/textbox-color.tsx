import { TextboxColor } from "@create-figma-plugin/ui";
import { JSX, h } from "preact";
import { useState } from "preact/hooks";

interface ColorBoxProps {
    hexColor: string;
    onHexColorInput: (event: JSX.TargetedEvent<HTMLInputElement>) => void;
    onOpacityInput: (event: JSX.TargetedEvent<HTMLInputElement>) => void;
    opacity: string;
    variant: string;
}


export default function ColorBox(props: ColorBoxProps) {
    const [hexColor, setHexColor] = useState<string>(props.hexColor);
    const [opacity, setOpacity] = useState<string>(props.opacity);
    function handleHexColorInput(event: JSX.TargetedEvent<HTMLInputElement>) {
        const newHexColor = event.currentTarget.value;
        console.log(newHexColor);
        setHexColor(newHexColor);
        props.onHexColorInput(event);
    }
    function handleOpacityInput(event: JSX.TargetedEvent<HTMLInputElement>) {
        const newOpacity = event.currentTarget.value;
        console.log(newOpacity);
        setOpacity(newOpacity);
        props.onOpacityInput(event);
    }
    return <TextboxColor hexColor={hexColor} onHexColorInput={handleHexColorInput} onOpacityInput={handleOpacityInput} opacity={opacity} variant="border" />;
}