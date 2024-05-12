import { forwardRef } from "react";

const Note = forwardRef(({ content, initialPos, ...props }, ref) => {
  console.log(initialPos);
  return (
    <div
      ref={ref}
      className={`absolute border-2 
      border-black select-none p-[10px] w-[200px] cursor-move bg-yellow-100`}
      style={{ left: `${initialPos?.x}px`, top: `${initialPos?.y}px` }}
      {...props}
    >
      📌<span className="ml-2">{content}</span>
    </div>
  );
});

Note.displayName = "Note";

export default Note;
