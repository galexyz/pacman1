import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

function App() {
    const [position, setPosition] = useState<String>("");
    const [direction, setDirection] = useState<string>("EAST");
    const [gridItems, setGridItems] = useState<any[]>([]);
    const [errorMsg, setErrorMsg] = useState("");
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");

    // Render the pacman based on the direction set
    const handleChangeDirection = (direction: String) => {
        switch (direction) {
            case "EAST":
                return (
                    <div
                        data-testid="position"
                        className="w-7 h-5 rounded-full border-t-[20px] border-b-[20px] border-l-[20px] border-r-[20px] md:border-t-[30px] md:border-b-[30px] md:border-l-[30px] md:border-r-[30px] border-l-yellow-400 border-t-yellow-400 border-b-yellow-400 border-r-transparent"
                    />
                );
            case "WEST":
                return (
                    <div
                        data-testid="position"
                        className="w-7 h-5 rounded-full  border-t-[20px] border-b-[20px] border-l-[20px] border-r-[20px] md:border-t-[30px] md:border-b-[30px] md:border-l-[30px] md:border-r-[30px] border-r-yellow-400 border-t-yellow-400 border-b-yellow-400 border-l-transparent"
                    />
                );
            case "NORTH":
                return (
                    <div
                        data-testid="position"
                        className="w-7 h-5 rounded-full border-t-[20px] border-b-[20px] border-l-[20px] border-r-[20px] md:border-t-[30px] md:border-b-[30px] md:border-l-[30px] md:border-r-[30px] border-l-yellow-400 border-r-yellow-400 border-b-yellow-400 border-t-transparent"
                    />
                );
            case "SOUTH":
                return (
                    <div
                        data-testid="position"
                        className="w-7 h- rounded-full border-t-[20px] border-b-[20px] border-l-[20px] border-r-[20px] md:border-t-[30px] md:border-b-[30px] md:border-l-[30px] md:border-r-[30px] border-l-yellow-400 border-t-yellow-400 border-r-yellow-400 border-b-transparent"
                    />
                );
        }
    };

    // move the pacman
    const handleMove = useCallback(() => {
        let col = Number(position.split(",")[0]);
        let row = Number(position.split(",")[1]);
        switch (direction) {
            case "NORTH":
                row = row < 4 ? row + 1 : row;
                break;
            case "SOUTH":
                row = row > 0 ? row - 1 : row;
                break;
            case "WEST":
                col = col > 0 ? col - 1 : col;
                break;
            case "EAST":
                col = col < 4 ? col + 1 : col;
                break;
        }
        setPosition(`${col},${row}`);
    }, [direction, position]);

    // Generate grid items
    const renderGridItems = useCallback(() => {
        let rows = 5;
        let columns = 5;
        let gridItems = [];
        for (let row = rows - 1; row >= 0; row--) {
            for (let col = 0; col < columns; col++) {
                const key = `${col},${row}`;
                gridItems.push(
                    <div
                        key={key}
                        className="2xl:p-6 md:p-4 p-2 items-center border border-black">
                        {position === key && handleChangeDirection(direction)}
                    </div>
                );
            }
        }
        setGridItems(gridItems);
    }, [position, direction]);

    // re-render whenever position or direction changes
    useEffect(() => {
        renderGridItems();
    }, [position, direction, renderGridItems]);

    // handle rotating the pacman based on left/right input
    const handleRotate = useCallback(
        (clockwise: boolean) => {
            const directions = ["NORTH", "EAST", "SOUTH", "WEST"];
            const currentIndex = directions.indexOf(direction);
            const rotationOffset = clockwise ? 1 : -1;
            const nextIndex =
                (currentIndex + rotationOffset + directions.length) %
                directions.length;
            setDirection(directions[nextIndex]);
        },
        [direction]
    );

    // submit input
    const handleSubmit = useCallback(() => {
        if (input === "LEFT" && position) {
            handleRotate(false);
            return;
        }
        if (input === "RIGHT" && position) {
            handleRotate(true);
            return;
        }
        if (!input.startsWith("PLACE ")) {
            setErrorMsg("Input must start with 'PLACE ' ");
            return;
        }
        if (input.split(" ").length !== 2) {
            setErrorMsg("Incorrect amount of spaces");
            return;
        }
        let command = input.split(" ")[1];
        if (command.split(",").length !== 3) {
            setErrorMsg("Incorrectly formatted input");
            return;
        }
        let col = Number(command.split(",")[0]);
        let row = Number(command.split(",")[1]);
        let direction = command.split(",")[2];
        if (col > 4 || col < 0 || row > 4 || row < 0) {
            setErrorMsg("Coordinates out of bounds");
            return;
        }
        setPosition(`${col},${row}`);
        setDirection(direction);
    }, [handleRotate, input, position]);

    // report current position of pacman
    const reportCurrentPosition = useCallback(() => {
        let outputString = `${position},${direction}`;
        setOutput(outputString);
    }, [position, direction]);

    return (
        <div className="App">
            <div className="text-xl font-bold text-blue-400 pt-5">
                Pac-Man Game
            </div>
            <div className="flex flex-col h-screen items-center">
                <div className="lg:w-1/3 md:w-2/3 w-5/6 min-w-[300px] h-2/5 sm:h-2/3 bg-gray-200 border-2 grid grid-rows-5 grid-cols-5 my-5">
                    {gridItems}
                </div>
                <div className="flex flex-row justify-start sm:w-1/3 gap-x-3 sm:gap-x-5 items-center">
                    <div
                        className="py-2 px-4 bg-blue-200 rounded-2xl cursor-pointer my-3"
                        onClick={reportCurrentPosition}>
                        Report
                    </div>
                    <div
                        className="py-2 px-4 bg-blue-200 rounded-2xl cursor-pointer my-3"
                        onClick={handleMove}>
                        Move
                    </div>
                    <div data-testid="position">{`Output: ${output}`}</div>
                </div>
                <div className="flex flex-col sm:flex-row py-2 gap-x-10 items-center">
                    <div className="flex flex-row gap-x-8 pb-5">
                        <ArrowLeftIcon
                            data-testid="leftBtn"
                            className="w-10 h-10 text-black cursor-pointer"
                            onClick={() => handleRotate(false)}
                        />
                        <ArrowRightIcon
                            data-testid="rightBtn"
                            className="w-10 h-10 text-black cursor-pointer"
                            onClick={() => handleRotate(true)}
                        />
                    </div>
                    <input
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSubmit();
                            }
                        }}
                        value={input}
                        onChange={(e) => {
                            setErrorMsg("");
                            setInput(e.target.value.toUpperCase());
                        }}
                        placeholder="e.g. PLACE 1,2,EAST"
                        className="border rounded-xl border-black px-4 h-10"
                    />
                    <div
                        className="py-2 px-4 bg-blue-200 rounded-2xl cursor-pointer my-3"
                        onClick={handleSubmit}>
                        Submit
                    </div>
                </div>
                <div data-testid="errorMsg" className="text-red-500">
                    {errorMsg}
                </div>
            </div>
        </div>
    );
}

export default App;
