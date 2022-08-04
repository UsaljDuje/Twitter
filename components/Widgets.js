import { SearchIcon } from "@heroicons/react/outline";
import { useState } from "react";
import News from "./News";

function Widgets({ newsResults, randomUserResults }) {
  const [articleNumber, setArticleNumber] = useState(3);
  const [randomUserNumber, setRandomUserNumber] = useState(3);
  return (
    <div className="xl:w-[600px] hidden lg:inline ml-8 space-y-5">
      <div className="w-[90%] xl:w-[75%] sticky top-0 bg-white py-1.5 z-50">
        <div className="flex items-center p-3 rounded-full bg-red-300 relative">
          <SearchIcon className="h-5 text-gray-500 z-50" />
          <input
            type="text"
            placeholder="Search Twitter"
            className="absolute inset-0 rounded-full pl-11 border-gray-500 text-gray-700 focus:shadow-lg focus:bg-white bg-gray-100"
          />
        </div>
      </div>
      <div className="text-gray-700 space-y-3 bg-gray-100 rounded-xl pt-2 w-[90%] xl:w-[75%]">
        <h4 className="font-bold text-xl px-4">Whats happening</h4>
        {newsResults.slice(0, articleNumber).map((article) => (
          <News key={article.title} article={article} />
        ))}
        <button
          onClick={() => setArticleNumber(articleNumber + 3)}
          className="text-blue-300 pl-4 pb-3 hover:text-blue-400"
        >
          Show more
        </button>
      </div>

      <div className="text-gray-700 space-y-3 bg-gray-100 rounded-xl pt-2 w-[90%] xl:w-[75%] sticky top-16">
        <h4 className="font-bold text-xl px-4">Who to follow</h4>
        {randomUserResults.slice(0, randomUserNumber).map((user) => (
          <div
            key={user.login.username}
            className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-200"
          >
            <img
              width="40"
              className="rounded-full"
              src={user.picture.thumbnail}
            />
            <div className="truncate ml-4 leading-5">
              <h4 className="font-bold hover:underline text-[14px] truncate">
                {user.login.username}
              </h4>
              <h5 className="text-[13px] text-gray-500 truncate">
                {user.name.first + " " + user.name.last}
              </h5>
            </div>
            <button className="ml-auto bg-black text-white text:sm rounded-full px-3.5 py-1.5 font-bold">
              Follow
            </button>
          </div>
        ))}
        <button
          onClick={() => setRandomUserNumber(randomUserNumber + 3)}
          className="text-blue-300 pl-4 pb-3 hover:text-blue-400"
        >
          Show more
        </button>
      </div>
    </div>
  );
}

export default Widgets;
