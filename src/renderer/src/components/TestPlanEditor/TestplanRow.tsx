/* eslint-disable prettier/prettier */
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import clsx from "clsx";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { VscodeCheckbox } from "@vscode-elements/react-elements";

import chevron from "../../assets/chevronIcon.svg";

import { Step, TypeOfTestEnum } from "./types";

import "./TestPlanEditor.css";

interface ITestPlanRowProps {
  step: Step;
  sectionId: string;
  isRowActive: boolean;
  handleEditCell: (
    sectionId: string,
    stepId: string,
    key: string,
    value: string | boolean
  ) => void;
  handleDeleteRow: (sectionId: string, rowId: string) => void;
  handleDuplicateRow: (step: Step, sectionId: string) => void;
  handleRowClick: (row: Step, e: React.MouseEvent) => void;
}

export const TestPlanRow = ({
  step,
  sectionId,
  handleDeleteRow,
  handleDuplicateRow,
  handleEditCell,
  handleRowClick,
  isRowActive,
}: ITestPlanRowProps): JSX.Element => {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [typeOfTestfilter, setTOTFilter] = useState<string>("");

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: step.id,
      animateLayoutChanges: () => false,
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  };

  const nestedLevel = step.nestedLevel || 0;

  const filteredToTValues = Object.values(TypeOfTestEnum).filter((type) =>
    type.toLowerCase().includes(typeOfTestfilter.toLowerCase())
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx("flex items-center", "row")}
      onClick={(e) => {
        e.stopPropagation();
        handleRowClick(step, e);
      }}
      onBlur={() => setFocusedInput(null)}
    >
      <input
        type="checkbox"
        className={clsx("selectCheckbox")}
        checked={isRowActive}
        onChange={() => {}}
      />
      <div
        className={"nestedLevelGap"}
        style={{ width: `${nestedLevel * 10}px` }}
      >
        {" "}
      </div>
      <div {...listeners} {...attributes} className="cursor-grab" title="Drag">
        <span className="dragIcon">::</span>
      </div>
      <div
        className={clsx("flex flex-row rounded-sm", {
          ["border border-gray-400"]: focusedInput === "name" && isRowActive,
        })}
      >
        {focusedInput && isRowActive && <p>type</p>}
        <input
          defaultValue={step.name}
          onFocus={() => setFocusedInput("name")}
          onBlur={(e) => {
            handleEditCell(sectionId, step.id, "name", e.target.value);
          }}
          className={clsx("textField", {
            ["underline"]: focusedInput === "name" && isRowActive,
            ["edit"]: focusedInput === "name" && isRowActive,
          })}
        />
        {focusedInput && isRowActive && (
          <input
            onBlur={(e) => {
              handleEditCell(sectionId, step.id, "nameUnit", e.target.value);
            }}
            type="text"
            className={clsx("textField", "edit")}
            defaultValue={step.nameUnit}
          />
        )}
      </div>
      <div className={clsx("textFieldCont", "flex flex-row")}>
        <Combobox
          value={step.typeOfTest}
          onChange={(e) => {
            handleEditCell(sectionId, step.id, "typeOfTest", e!);
          }}
          onClose={() => setTOTFilter("")}
        >
          <ComboboxButton className="flex flex-row">
            <ComboboxInput
              displayValue={(step: string) => {
                return step;
              }}
              className={clsx("textField", "border-none")}
              onChange={(event) => setTOTFilter(event.target.value)}
            />
            <img className={"chevIcon"} src={chevron} alt="chevron" />
          </ComboboxButton>
          <ComboboxOptions
            anchor="bottom"
            className="border border-gray-400 bg-amber-50"
          >
            {filteredToTValues.map((type) => (
              <ComboboxOption
                key={type}
                value={type}
                className="data-[focus]:bg-blue-100"
              >
                {type}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
        {focusedInput && isRowActive && (
          <div className="flex flex-row">
            <p>
              Dropdown
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-row">
        <VscodeCheckbox
          className="pl-1 ml-2"
          checked={!!step.onOrOff}
          onFocus={() => setFocusedInput("onOrOff")}
          onChange={(e) =>
            handleEditCell(
              sectionId,
              step.id,
              "onOrOff",
              (e.target as HTMLInputElement).checked
            )
          }
        />
        {focusedInput && isRowActive && (
          <div className="flex flex-row">
            <p>
              Checkbox
            </p>
          </div>
        )}
      </div>
      <button
        className={"duplicateButton"}
        onClick={(e) => {
          e.stopPropagation();
          handleDuplicateRow(step, sectionId);
        }}
        color="info"
      >
        <span className="duplicateIcon">D</span>
      </button>
      <button
        className={"deleteButton"}
        onClick={() => handleDeleteRow(sectionId, step.id)}
        color="error"
      >
        <span className="deleteIcon">X</span>
      </button>
    </div>
  );
};
