import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import App from "./App";

const setupInitialState = () => {
    const utils = render(<App />);
    return utils;
};

describe("App", () => {
    let inputField: HTMLElement;
    let submitButton: HTMLElement;
    let reportButton: HTMLElement;
    let rightButton: HTMLElement;
    let leftButton: HTMLElement;
    let positionElement: HTMLElement;
    let errorMsg: HTMLElement;
    let moveButton: HTMLElement;

    beforeEach(() => {
        setupInitialState();
        inputField = screen.getByPlaceholderText("e.g. PLACE 1,2,EAST");
        submitButton = screen.getByText("Submit");
        reportButton = screen.getByText("Report");
        rightButton = screen.getByTestId("rightBtn");
        leftButton = screen.getByTestId("leftBtn");
        moveButton = screen.getByText("Move");
        positionElement = screen.getByTestId("position");
        errorMsg = screen.getByTestId("errorMsg");
    });

    test("renders correctly", () => {
        const gameText = screen.getByText("Pac-Man Game");
        expect(gameText).toBeInTheDocument();
    });

    test("updates position and direction correctly when valid input is submitted", () => {
        fireEvent.change(inputField, { target: { value: "PLACE 1,2,EAST" } });
        fireEvent.click(submitButton);
        fireEvent.click(reportButton);

        expect(positionElement.textContent).toBe("Output: 1,2,EAST");
    });

    test("displays relevant error message for invalid inputs", () => {
        fireEvent.change(inputField, { target: { value: "INVALID COMMAND" } });
        fireEvent.click(submitButton);

        expect(errorMsg.textContent).toBe("Input must start with 'PLACE ' ");

        fireEvent.change(inputField, { target: { value: "PLACE 1,2" } });
        fireEvent.click(submitButton);

        expect(errorMsg.textContent).toBe("Incorrectly formatted input");

        fireEvent.change(inputField, { target: { value: "PLACE 10,2,EAST" } });
        fireEvent.click(submitButton);

        expect(errorMsg.textContent).toBe("Coordinates out of bounds");
    });

    test("changes direction correctly when arrow icons are clicked", () => {
        fireEvent.change(inputField, {
            target: { value: "PLACE 0,0,NORTH" },
        });
        fireEvent.click(submitButton);

        fireEvent.click(reportButton);
        expect(positionElement.textContent).toBe("Output: 0,0,NORTH");

        fireEvent.click(rightButton);
        fireEvent.click(reportButton);
        expect(positionElement.textContent).toBe("Output: 0,0,EAST");

        fireEvent.click(rightButton);
        fireEvent.click(reportButton);
        expect(positionElement.textContent).toBe("Output: 0,0,SOUTH");

        fireEvent.click(rightButton);
        fireEvent.click(reportButton);
        expect(positionElement.textContent).toBe("Output: 0,0,WEST");

        fireEvent.click(rightButton);
        fireEvent.click(reportButton);
        expect(positionElement.textContent).toBe("Output: 0,0,NORTH");

        fireEvent.click(leftButton);
        fireEvent.click(reportButton);
        expect(positionElement.textContent).toBe("Output: 0,0,WEST");

        fireEvent.click(leftButton);
        fireEvent.click(reportButton);
        expect(positionElement.textContent).toBe("Output: 0,0,SOUTH");

        fireEvent.click(leftButton);
        fireEvent.click(reportButton);
        expect(positionElement.textContent).toBe("Output: 0,0,EAST");

        fireEvent.click(leftButton);
        fireEvent.click(reportButton);
        expect(positionElement.textContent).toBe("Output: 0,0,NORTH");
    });

    test("Pac-Man moves as expected 1 space north", () => {
        fireEvent.change(inputField, { target: { value: "PLACE 0,0,NORTH" } });
        fireEvent.click(submitButton);
        fireEvent.click(moveButton);
        fireEvent.click(reportButton);
        expect(positionElement?.textContent).toBe("Output: 0,1,NORTH");
    });

    test("Pac-Man moves from 1,2,EAST to 3,3,NORTH", () => {
        fireEvent.change(inputField, {
            target: { value: "PLACE 1,2,EAST" },
        });
        fireEvent.click(submitButton);

        fireEvent.click(moveButton);
        fireEvent.click(moveButton);
        fireEvent.click(leftButton);
        fireEvent.click(moveButton);

        fireEvent.click(reportButton);

        expect(positionElement.textContent).toBe("Output: 3,3,NORTH");
    });
    test("Pac-Man attempts to move off grid", () => {
        fireEvent.change(inputField, {
            target: { value: "PLACE 4,0,NORTH" },
        });
        fireEvent.click(submitButton);
        fireEvent.click(rightButton);
        fireEvent.click(moveButton);
        fireEvent.click(reportButton);
        expect(positionElement.textContent).toBe("Output: 4,0,EAST");
    });
});
