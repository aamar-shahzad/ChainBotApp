import ChatInput from "./input";
export const maxDuration = 300 
export default function Chat() {
  return (
    <div className="grow">
      <div className="flex flex-col items-start gap-4 pb-10 min-h-[75vh] sm:w-[95%]">
        <div className="text-xl font-medium dark:text-sky-200 text-sky-700">
          How can I help you to expolore blockchain?
        </div>
        <div className="dark:text-slate-300 text-slate-900">
          {process.env.APP_NAME} can make mistakes. Consider checking important information.
        </div>
      </div>
      <div className="mt-5 bottom-0 sticky pb-8 pt-1 bg-background">
        <ChatInput />
      </div>
    </div>
  );
}
