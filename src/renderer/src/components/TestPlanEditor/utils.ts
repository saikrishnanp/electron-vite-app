/* eslint-disable prettier/prettier */
import { Step, TestStepSection } from "./types";

export const findIndex = <T extends { id: string }>(steps: T[], id: string): number => {
  return steps.findIndex((step) => step.id === id);
};

export const findStepIndices = (
  stepsData: TestStepSection[],
  activeId: string,
  overId: string,
): {
  sourceSection: TestStepSection | undefined;
  targetSection: TestStepSection | undefined;
  activeStepIndex: number | undefined;
  overStepIndex: number | undefined;
} => {
  let sourceSection: TestStepSection | undefined;
  let targetSection: TestStepSection | undefined;
  let activeStepIndex: number | undefined;
  let overStepIndex: number | undefined;

  stepsData.forEach((section) => {
    const activeIndex = findIndex(section.steps, activeId);
    const overIndex = findIndex(section.steps, overId);

    if (activeIndex !== -1) {
      sourceSection = section;
      activeStepIndex = activeIndex;
    }

    if (overIndex !== -1) {
      targetSection = section;
      overStepIndex = overIndex;
    }
  });

  return { sourceSection, targetSection, activeStepIndex, overStepIndex };
};

export const getMovedRowWithNestedLevel = (
  movedRow: Step,
  targetSection: TestStepSection,
  overStepIndex: number,
): Step => {
  const nestedLevel =
    overStepIndex - 1 >= 0 ? targetSection.steps[overStepIndex - 1].nestedLevel : 0;

  return { ...movedRow, nestedLevel };
};

export const isListOfTypeStep = (obj: unknown): obj is Step[] => {
  if (Array.isArray(obj)) {
    return obj.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        "name" in item &&
        "typeOfTest" in item &&
        "inOrOut" in item &&
        "onOrOff" in item &&
        "includedInDataSheet" in item &&
        "nestedLevel" in item,
    );
  }

  return false;
};

export const isStepVisible = (
  step: Step,
  index: number,
  steps: Step[],
  collapsedSteps: string[],
): boolean => {
  for (let i = index - 1; i >= 0; i--) {
    if (step.nestedLevel > steps[i].nestedLevel && collapsedSteps.includes(steps[i].id)) {
      return false;
    }
  }
  return true;
};
