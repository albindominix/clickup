"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Avatar from "react-avatar";
import { useBoardStore } from "@/store/BoardStore";
import fetchSuggestion from "@/lib/fetchSuggestion";
function Header() {
  const [board, searchString, setSearchString] = useBoardStore((state) => [
    state.board,
    state.searchString,
    state.setSearchString,
  ]);

  const [isLoading, setisLoading] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<string>("");
  useEffect(() => {
    if (board.columns.size === 0) return;
    setisLoading(true);
    const fetchSuggestionFunc = async () => {
      const suggestion = await fetchSuggestion(board);
      setSuggestion(suggestion);
      setisLoading(false);
    };
    fetchSuggestionFunc();
  }, [board]);
  return (
    <header>
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-pink-400 to-[#0055D1]  rounded-md blur-3xl opacity-50 -z-50" />
        <Image
          src="https://links.papareact.com/c2cdd5"
          alt="trello logo"
          width={300}
          height={100}
          className="w-44 md:w-56 pb-10 md:pb-0 object-contain "
        />

        <div className="flex items-center space-x-5 flex-1 justify-end w-full">
          {/* Seacrh box */}
          <form className="flex items-center  space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-gray-400" />
            <input
              type="text"
              placeholder="search"
              className="flex-1 outline-none p-2"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
            />
            <button type="submit" hidden>
              Search
            </button>
          </form>
          {/* Avatar */}
          <Avatar name="Albin Antony" round size="50" color="#0055D1" />
        </div>
      </div>

      <div className="flex p-2 items-center justify-center px-5 md:py-5 ">
        <p className="flex items-center text-sm  font-light p-5 shadow-xl italic text-[#0055D1] rounded-xl w-fit bg-white mx-w-3xl ">
          <UserCircleIcon
            className={`inline-block h-10 w-10 text-[#0055D1] mr-1 ${
              isLoading && "animate-spin"
            }`}
          />
          {suggestion && !isLoading
            ? suggestion
            : "GPT is summarising your task for the day..."}
        </p>
      </div>
    </header>
  );
}

export default Header;
