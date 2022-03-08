import { Fragment, useState, useContext } from "react";
import { TrackContext } from "../context/trackContext";
import Image from "next/image";

import { Dialog, Transition, Disclosure } from "@headlessui/react";

//ICONS
import { FiPlay } from "react-icons/fi";
import { FiChevronDown } from "react-icons/fi";

export default function Playlist({ track }) {
  console.log(track);
  const { setSelectedTrack } = useContext(TrackContext);
  const [clicked, setClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const URL = `http://localhost:3000/mixtapes/${track.number}`;

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <div className="w-full  mx-auto text-[#444444] dark:text-[#f1f1f1]  ">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="relative flex flex-col justify-between items-center w-full px-4 py-4  text-sm  text-left border-t border-stone-400">
              <div className="grid grid-cols-12 w-full items-center ">
                <div className=" col-span-12 md:col-span-2">
                  <span>{track.number}</span>
                </div>
                <div className=" col-span-12 md:col-span-7">
                  <span>{track.title}</span>
                </div>
                <div className=" col-span-12 md:col-span-2">
                  <span>{track.duration}</span>
                </div>

                <FiChevronDown
                  className={`${
                    open ? "transform rotate-180" : ""
                  } w-6 h-6 text-[#1500FF] dark:text-[#84858C] text-right absolute right-4 `}
                />
              </div>
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 ">
              <div className="grid grid-cols-12 w-full items-start py-4">
                <div className=" col-span-12 md:col-span-2">
                  <Image
                    src={track.image}
                    alt="track image"
                    layout="fixed"
                    objectFit="cover"
                    width={100}
                    height={100}
                    priority
                    className="cursor-pointer"
                    onClick={openModal}
                  />
                </div>
                <div className=" col-span-12 md:col-span-9 text-sm">
                  <div className="flex items-center py-2">
                    <FiPlay
                      onClick={() => {
                        setSelectedTrack(track);
                      }}
                      className="hover:text-blue-600 mr-2 cursor-pointer"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(URL);
                        setClicked(true);
                      }}
                    >
                      {clicked ? "Copied" : "Copy mix"}
                    </button>
                  </div>
                  <span>{track.description}</span>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={closeModal}
          >
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay
                  className="fixed inset-0 bg-black opacity-30"
                  onClick={closeModal}
                />
              </Transition.Child>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div
                  className="flex flex-col min-h-screen justify-center items-center w-full overflow-auto transition-all transform "
                  onClick={closeModal}
                >
                  <div className="h-72 w-72 md:h-[32rem] md:w-[32rem]">
                    <Image
                      src={track.image}
                      alt="avatar"
                      layout="responsive"
                      objectFit="cover"
                      width={300}
                      height={300}
                    />
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </>
    </div>
  );
}
