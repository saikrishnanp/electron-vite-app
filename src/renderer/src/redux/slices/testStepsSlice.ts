/* eslint-disable prettier/prettier */
import { v4 as uuid } from "uuid";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {InOrOutEnum,Step,TestStepSection,TypeOfTestEnum} from "../../components/TestPlanEditor/types";
import {findStepIndices,getMovedRowWithNestedLevel} from "../../components/TestPlanEditor/utils";
const placeHolderStep = {
  id: uuid(),
  name: "New Step",
  typeOfTest: TypeOfTestEnum.NORMAL,
  inOrOut: InOrOutEnum.INPUT,
  onOrOff: false,
  includedInDataSheet: true,
  nestedLevel: 0
};

const dummySteps = new Array(1000).fill(null).map((_, index) => ({
  ...placeHolderStep,
  id: uuid(),
  name: `Step ${index++}`,
  typeOfTest: index % 3 == 0 ? TypeOfTestEnum.NORMAL : TypeOfTestEnum.LOAD,
  inOrOut: InOrOutEnum.INPUT,
  onOrOff: index % 2 == 0,
  includedInDataSheet: index % 4 == 0,
  nestedLevel: 0
}));

const initialState: TestStepSection[] = [
  {
    id: "constant-data-test",
    descriptionPoints: ["Test that the data is constant"],
    steps: [
      {
        id: "1.1",
        name: "Step 1 - Constant Data",
        typeOfTest: TypeOfTestEnum.NORMAL,
        inOrOut: InOrOutEnum.INPUT,
        onOrOff: null,
        includedInDataSheet: true,
        nestedLevel: 0,
      },
      {
        id: "2.1",
        name: "Step 2 - CD",
        typeOfTest: TypeOfTestEnum.LOAD,
        inOrOut: InOrOutEnum.INPUT,
        onOrOff: true,
        includedInDataSheet: true,
        nestedLevel: 1,
      },
      {
        id: "2.1cd",
        name: "Step 2.1 - CD",
        typeOfTest: TypeOfTestEnum.LOAD,
        inOrOut: InOrOutEnum.INPUT,
        onOrOff: true,
        includedInDataSheet: true,
        nestedLevel: 2,
      },
      {
        id: "2.2cd",
        name: "Step 2.2 - CD",
        typeOfTest: TypeOfTestEnum.LOAD,
        inOrOut: InOrOutEnum.INPUT,
        onOrOff: true,
        includedInDataSheet: true,
        nestedLevel: 1,
      },
    ],
  },
  {
    id: "variable-data-test",
    descriptionPoints: [
      "Test that the data is variable",
      "This will act as the load test",
    ],
    steps: [
      {
        id: "3cd",
        name: "Step 3003",
        typeOfTest: TypeOfTestEnum.NORMAL,
        inOrOut: InOrOutEnum.INPUT,
        onOrOff: null,
        includedInDataSheet: true,
        nestedLevel: 2,
      },
      {
        id: "4cd",
        name: "Step 4",
        typeOfTest: TypeOfTestEnum.NORMAL,
        inOrOut: InOrOutEnum.INPUT,
        onOrOff: true,
        includedInDataSheet: false,
        nestedLevel: 0,
      },
      ...dummySteps,
    ],
  }
];

const testStepsSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    deleteStep: (
      state,
      action: PayloadAction<{ sectionId: string; rowId: string }>
    ) => {
      const { sectionId, rowId } = action.payload;

      return state.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              steps: section.steps.filter((step) => step.id !== rowId),
            }
          : section
      );
    },
    addStepToSection: (
      state,
      action: PayloadAction<{
        sectionId: string;
        stepData: Step | null;
        insertNextToRowId: string | null;
      }>
    ) => {
      const { sectionId, stepData, insertNextToRowId } = action.payload;

      const stepToAdd = stepData ?? {
        ...placeHolderStep,
        id: uuid(),
      };

      return state.map((section) => {
        if (section.id === sectionId) {
          const activeRowIndex = section.steps.findIndex(
            (step) => step.id === insertNextToRowId
          );

          if (activeRowIndex !== -1) {
            const updatedSteps = [...section.steps];
            const previousStep = updatedSteps[activeRowIndex];
            const nestedLevel = previousStep.nestedLevel;

            updatedSteps.splice(activeRowIndex + 1, 0, {
              ...stepToAdd,
              nestedLevel,
            });

            return {
              ...section,
              steps: updatedSteps,
            };
          }

          return {
            ...section,
            steps: [...section.steps, stepToAdd],
          };
        }
        return section;
      });
    },
    editStep: (
      state,
      action: PayloadAction<{
        sectionId: string;
        rowId: string;
        key: string;
        value: string | boolean;
      }>
    ) => {
      const { sectionId, rowId, key, value } = action.payload;

      return state.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              steps: section.steps.map((step) =>
                step.id === rowId ? { ...step, [key]: value } : step
              ),
            }
          : section
      );
    },
    moveStep: (
      state,
      action: PayloadAction<{
        activeId: string;
        overId: string;
      }>
    ) => {
      const { activeId, overId } = action.payload;

      const { sourceSection, targetSection, activeStepIndex, overStepIndex } =
        findStepIndices(state, activeId, overId);

      if (
        !sourceSection ||
        !targetSection ||
        activeStepIndex === undefined ||
        overStepIndex === undefined
      ) {
        return state;
      }

      const [movedRow] = sourceSection.steps.splice(activeStepIndex, 1);

      const updatedOverStepIdx =
        sourceSection.id === targetSection.id
          ? overStepIndex
          : overStepIndex + 1;

      const movedRowWithNestedLevel = getMovedRowWithNestedLevel(
        movedRow,
        targetSection,
        updatedOverStepIdx
      );

      targetSection.steps.splice(
        updatedOverStepIdx,
        0,
        movedRowWithNestedLevel
      );

      return state;
    },
  },
});

export const { deleteStep, addStepToSection, editStep, moveStep } =
  testStepsSlice.actions;

export default testStepsSlice.reducer;
