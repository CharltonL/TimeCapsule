import type { FC } from "react";
export interface TestPage2Props {}

export const TestPage2: FC<TestPage2Props> = () => {
  return (
    <div className="flex flex-col items-center w-full bg-amber-200 p-2 h-full ">
      <iframe
        src="https://charltonl.github.io/tour/"
        width="100%"
        height="100%"
        className="flex-1 rounded-lg shadow-lg"
      />
    </div>
  );
};
