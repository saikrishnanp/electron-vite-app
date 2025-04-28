/* eslint-disable prettier/prettier */
export enum StepsEnum {
  Step1 = "Step 1",
  Step2 = "Step 2",
  Step3 = "Step 3",
  Step4 = "Step 4",
};

export enum TypeOfTestEnum {
  NORMAL = "Normal",
  LOAD = "Load",
  STRESS = "Stress",
  PERFORMANCE = "Performance",
  FUNCTIONAL = "Functional",
  STATISTICAL = "Statistical",
  REGRESSION = "Regression",
};

export enum InOrOutEnum {
  INPUT = "Input",
  OUTPUT = "Output",
};

export interface Step {
  id: string;
  name: string;
  typeOfTest: TypeOfTestEnum;
  inOrOut: InOrOutEnum;
  nameUnit?: string;
  onOrOff: boolean | null;
  includedInDataSheet: boolean;
  nestedLevel: number;
};

export interface TestStepSection {
  id: string;
  descriptionPoints: string[];
  steps: Step[];
};
