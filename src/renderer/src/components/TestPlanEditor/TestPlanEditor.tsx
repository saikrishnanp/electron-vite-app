/* eslint-disable prettier/prettier */
import { DndContext, closestCenter, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import clsx from "clsx";
import { v4 as uuid } from "uuid";
import copy from "copy-to-clipboard";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";

import { deleteStep, addStepToSection, editStep, moveStep } from "../../redux/slices/testStepsSlice";
import { RootState } from "../../redux/store";

import { TestPlanOverlay } from "./TestPlanOverlay";
import { TestPlanSection } from "./TestPlanSection";

import { isListOfTypeStep } from "./utils";

import { Step } from "./types";

import "./TestPlanEditor.css";

export const TestPlanEditor = (): JSX.Element => {
  const [draggedItem, setDraggedItem] = useState<Step | null>(null);
  const [collapsedSteps, setCollapsedSteps] = useState<string[]>([]);
  const [activeRows, setActiveRows] = useState<Step[]>([]);
  const [rowIdToShowBorder, setRowIdToShowBorder] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const copiedRowRef = useRef<Step[]>([]);

  const dispatch = useDispatch();

  const stepsData = useSelector((state: RootState) => {
    return state.testSteps;
  });

  const handleDeleteRow = (sectionId: string, rowId: string): void => {
    dispatch(
      deleteStep({
        sectionId,
        rowId,
      }),
    );
  };

  const handleAddRow = (
    sectionId: string,
    stepData: Step | null,
    insertNextToRowId: string | null = null,
  ): void => {
    const insertNextToRow = insertNextToRowId ?? activeRows[activeRows.length - 1]?.id ?? null;

    dispatch(
      addStepToSection({
        sectionId,
        stepData,
        insertNextToRowId: insertNextToRow,
      }),
    );
  };

  const handleEditCell = (
    sectionId: string,
    rowId: string,
    key: string,
    value: string | boolean,
  ): void => {
    dispatch(editStep({ sectionId, rowId, key, value }));
  };

  const handleDragStart = (event: DragStartEvent): void => {
    const id = event.active.id;
    const item = stepsData.flatMap((section) => section.steps).find((step) => step.id === id);
    setDraggedItem(item ?? null);
  };

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      dispatch(moveStep({ activeId: String(active.id), overId: String(over.id) }));
    }

    setDraggedItem(null);
    setRowIdToShowBorder(null);
  };

  const toggleCollapse = (sectionId: string): void => {
    setCollapsedSteps((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    );
  };

  const handleRowClick = (row: Step, e: React.MouseEvent): void => {
    if (!e.ctrlKey) {
      return setActiveRows((prev) => {
        if (prev.map((item) => item.id).includes(row.id)) {
          return prev.filter((item) => item.id !== row.id);
        }
        return [row];
      });
    }

    setActiveRows((prev) => {
      if (prev.map((item) => item.id).includes(row.id)) {
        return prev.filter((item) => item.id !== row.id);
      }
      return [...prev, row];
    });
  };

  const handlePaste = (event: React.ClipboardEvent, sectionId: string): void => {
    event.preventDefault();

    const pastedText = event.clipboardData.getData("text/plain");

    try {
      const pastedData = JSON.parse(pastedText) as Step[];

      if (isListOfTypeStep(pastedData)) {
        pastedData.forEach((step) => {
          handleAddRow(sectionId, { ...step, id: uuid() });
        });
      }
    } catch (error) {
      console.error("Error parsing pasted data:", error);
    }
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "c" && activeRows) {
        copiedRowRef.current = [...activeRows];

        copy(JSON.stringify(activeRows));
      }
    },
    [activeRows],
  );

  const handleDuplicateRow = (step: Step, sectionId: string): void => {
    const newStep = { ...step, id: uuid() };
    handleAddRow(sectionId, newStep, step.id);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return (): void => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeRows, handleKeyDown]);

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={(e) => {
        handleDragStart(e);
      }}
      onDragOver={(e) => {
        setRowIdToShowBorder(String(e.over!.id));
      }}
      onDragEnd={handleDragEnd}
    >
      <div
        className={clsx(
          "container",
          {
            ["fullScreen"]: isFullScreen,
          },
          "p-10",
        )}
        onClick={() => {
          setActiveRows([]);
        }}
      >
        <button
          type="button"
          className={"expandButton"}
          onClick={() => setIsFullScreen((prev) => !prev)}
        >
          {isFullScreen ? (
            <span className={"screenIcon"}>CFS</span>
          ) : (
            <span className={"screenIcon"}>FS</span>
          )}
        </button>
        {stepsData.map((section) => (
          <TestPlanSection
            key={section.id}
            section={section}
            activeRows={activeRows}
            isFullScreen={isFullScreen}
            collapsedSteps={collapsedSteps}
            rowIdToShowBorder={rowIdToShowBorder}
            handleAddRow={handleAddRow}
            handlePaste={handlePaste}
            handleDeleteRow={handleDeleteRow}
            handleDuplicateRow={handleDuplicateRow}
            handleRowClick={handleRowClick}
            handleEditCell={handleEditCell}
            toggleCollapse={toggleCollapse}
          />
        ))}
      </div>
      <TestPlanOverlay draggedItem={draggedItem} />
    </DndContext>
  );
};
