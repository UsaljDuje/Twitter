import { EmojiHappyIcon, PhotographIcon } from "@heroicons/react/outline";
import { useSession, signOut } from "next-auth/react";
function Input() {
  const { data: session } = useSession();
  console.log(session);
  return (
    <>
      {session && (
        <div className="flex border-b border-gray-200 p-3 space-x-3">
          <img
            className="rounded-full h-11 w-11 cursor-pointer hover:brightness-95"
            src={session?.user?.image}
            onClick={signOut}
          />
          <div className="w-full divide-y divide-gray-200">
            <div className="">
              <textarea
                className="w-full border-none focus:ring-0 text-lg placeholder-gray-700 tracking-wide min-h-[50px] text-gray-7002"
                rows="2"
                placeholder="Whats happening"
              />
            </div>
            <div className="items-center pt-2.5 flex justify-between">
              <div className="flex">
                <PhotographIcon className="w-10 h-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                <EmojiHappyIcon className="w-10 h-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
              </div>
              <button className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50">
                Tweet
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Input;
