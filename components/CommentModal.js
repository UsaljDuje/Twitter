import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../atom/modalAtom";
import Modal from "react-modal";
import { useRouter } from "next/router";
import {
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import Moment from "react-moment";
function CommentModal() {
  const [open, setOpen] = useRecoilState(modalState);
  const [postId, setpostId] = useRecoilState(postIdState);
  const [post, setPost] = useState({});
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const router = useRouter();
  useEffect(() => {
    onSnapshot(doc(db, "posts", postId), (snapshot) => {
      setPost(snapshot);
    });
  }, [postId, db]);
  async function sendComment() {
    await addDoc(collection(db, "posts", postId, "comments"), {
      comment: input,
      name: session?.user?.name,
      username: session?.user?.username,
      userImg: session?.user?.image,
      timestamp: serverTimestamp(),
      userId: session?.user?.uid,
    });
    console.log("TUsam hahaha");
    setOpen(false);
    setInput("");
    router.push(`/posts/${postId}`);
  }

  return (
    <div>
      {open && (
        <Modal
          isOpen={open}
          onRequestClose={() => setOpen(false)}
          className="max-w-lg w-[90%] absolute top-24 left-[50%] translate-x-[-50%] bg-white border-2 outline-none border-gray-200 rounded-xl shadow-md"
        >
          <div className="p-1">
            <div className="border-b border-gray-200 py-2 px-1.5">
              <div
                onClick={() => setOpen(false)}
                className="hoverEffect w-10 h-10 flex items-center justify-center"
              >
                <XIcon className="h-[23px] text-gray-700" />
              </div>
            </div>
            <div className="p-2 flex items-center space-x-1 relative">
              <span className="w-0.5 h-full z-[-1] absolute left-8 top-11 bg-gray-300" />
              <img
                className="h-11 w-11 rounded-full mr-4"
                src={post?.data()?.userimg}
              />
              <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
                {post?.data()?.name}
              </h4>
              <span className="text-sm sm:text-[15px]">
                @{post?.data()?.username} -
              </span>
              <span className="text-sm sm:text-[15px] hover:underline">
                <Moment fromNow>{post?.data()?.timestamp?.toDate()}</Moment>
              </span>
            </div>
            <p className="text-gray-500 text-[15ox] sm:text-[16px] ml-16 mb-2">
              {post?.data()?.text}
            </p>

            <div className="flex border-gray-200 p-3 space-x-3">
              <img
                className="rounded-full h-11 w-11 cursor-pointer hover:brightness-95"
                src={session?.user?.image}
              />
              <div className="w-full divide-y divide-gray-200">
                <div className="">
                  <textarea
                    className="w-full border-none focus:ring-0 text-lg placeholder-gray-500 tracking-wide min-h-[50px] text-gray-7002"
                    rows="2"
                    placeholder="Tweet your reply"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </div>
                <div className="items-center pt-2.5 flex justify-between">
                  <div className="flex">
                    <div
                    // onClick={() => filePickerRef.current.click()}
                    >
                      <PhotographIcon className="w-10 h-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                      {/* <input
                        type="file"
                        className="hidden"
                        ref={filePickerRef}
                        onChange={addImageToPost} 
                      /> */}
                    </div>
                    <EmojiHappyIcon className="w-10 h-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                  </div>
                  <button
                    onClick={sendComment}
                    disabled={!input.trim()}
                    className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default CommentModal;
