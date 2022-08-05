import {
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useSession, signOut } from "next-auth/react";
import { useRef, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
function Input() {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef(null);
  const sendPost = async () => {
    if (loading) return;
    setLoading(true);
    const docRef = await addDoc(collection(db, "posts"), {
      id: session.user.uid,
      text: input,
      userimg: session.user.image,
      timestamp: serverTimestamp(),
      name: session.user.name,
      username: session.user.username,
    });

    const imageRef = ref(storage, `posts/${docRef.id}/image`);
    if (selectedFile) {
      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
        });
      });
    }

    setInput("");
    setSelectedFile(null);
    setLoading(false);
  };

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

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
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            {selectedFile && (
              <div className="relative">
                <XIcon
                  className="h-7 text-black absolute cursor-pointer shadow-mdrounded-full border border-white m-1"
                  onClick={() => setSelectedFile(null)}
                />
                <img
                  src={selectedFile}
                  className={`${loading && "animate-pulse"}`}
                />
              </div>
            )}
            <div className="items-center pt-2.5 flex justify-between">
              {!loading && (
                <>
                  <div className="flex">
                    <div onClick={() => filePickerRef.current.click()}>
                      <PhotographIcon className="w-10 h-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                      <input
                        type="file"
                        className="hidden"
                        ref={filePickerRef}
                        onChange={addImageToPost}
                      />
                    </div>
                    <EmojiHappyIcon className="w-10 h-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                  </div>
                  <button
                    onClick={sendPost}
                    disabled={!input.trim()}
                    className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
                  >
                    Tweet
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Input;
