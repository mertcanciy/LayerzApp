import { Fragment, useState } from "react";
import Image from "next/image";
import { Listbox, Transition } from "@headlessui/react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { MetaHeader } from "~~/components/MetaHeader";
import { Spinner } from "~~/components/Spinner";
import { AddressInput } from "~~/components/scaffold-eth";
import { Address } from "~~/components/scaffold-eth/Address";
import { useScaffoldContractWrite, useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

const chains = [
  {
    id: 10109,
    name: "Polygon Mumbai",
    avatar: "/polygon-matic-logo.png",
  },
  {
    id: 10132,
    name: "Optimism Goerli",
    avatar: "/optimism-ethereum-op-logo.png",
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Home: NextPage = () => {
  const [typedMessage, setTypedMessage] = useState("");
  const [enteredAddress, setEnteredAddress] = useState("");
  const [selected, setSelected] = useState(chains[0]);
  const [nativeFee, setNativeFee] = useState("0");

  const { data: MessageEvents, isLoading: isMessageEventsLoading } = useScaffoldEventHistory({
    contractName: "LayerzApp",
    eventName: "Message",
    fromBlock: 0n,
  });

  const { writeAsync: sendMessageWrite } = useScaffoldContractWrite({
    contractName: "LayerzApp",
    functionName: "sendtheMessage",
    args: [selected.id, enteredAddress, typedMessage],
    value: nativeFee as `${number}`,
  });

  const { address: connectedWallet } = useAccount();

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-5xl font-bold">LayerzApp</span>
          </h1>
          <p className="text-center text-lg">Cross-Chain Messaging</p>
          <p className="text-center text-lg">Powered by Mertcan ahahaha</p>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <p className="mb-12 font-bold text-2xl text-center">SEND MESSAGE</p>
          <div className="flex flex-col justify-center sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center rounded-3xl shadow-md">
              <Listbox value={selected} onChange={setSelected}>
                {({ open }) => (
                  <>
                    <Listbox.Label className="block text-sm font-bold leading-6 text-gray-900">
                      Choose The Chain
                    </Listbox.Label>
                    <div className="relative mt-2">
                      <Listbox.Button className="relative w-full cursor-default rounded-xl font-medium bg-base-100 py-2 pl-3 pr-12 text-left text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                        <span className="flex items-center">
                          <Image
                            width={5}
                            height={5}
                            src={selected.avatar}
                            alt="crypto-logo"
                            className="h-5 w-5 flex-shrink-0 rounded-full"
                          />
                          <span className="ml-3 block truncate">{selected.name}</span>
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                      </Listbox.Button>

                      <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {chains.map(person => (
                            <Listbox.Option
                              key={person.id}
                              className={({ active }) =>
                                classNames(
                                  active ? "bg-indigo-600 text-white" : "text-gray-900",
                                  "relative cursor-default select-none py-2 pl-3 pr-9",
                                )
                              }
                              value={person}
                            >
                              {({ selected, active }) => (
                                <>
                                  <div className="flex items-center">
                                    <Image
                                      width={5}
                                      height={5}
                                      src={person.avatar}
                                      alt=""
                                      className="h-5 w-5 flex-shrink-0 rounded-full"
                                    />
                                    <span
                                      className={classNames(
                                        selected ? "font-semibold" : "font-normal",
                                        "ml-3 block truncate",
                                      )}
                                    >
                                      {person.name}
                                    </span>
                                  </div>

                                  {selected ? (
                                    <span
                                      className={classNames(
                                        active ? "text-white" : "text-indigo-600",
                                        "absolute inset-y-0 right-0 flex items-center pr-4",
                                      )}
                                    >
                                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>
              <div className="flex flex-col gap-6 mt-7">
                <div className="flex flex-row">
                  <p className="font-bold mx-3 my-auto">Destination: </p>
                  <AddressInput
                    value={enteredAddress}
                    onChange={value => setEnteredAddress(value)}
                    placeholder="Destination Address"
                  />
                </div>
                <div className="flex flex-row">
                  <p className="font-bold mx-3 my-auto">Message: </p>
                  <input
                    className="flex border-2 border-base-300 bg-base-200 rounded-full text-accent focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-5 py-4 my-1 w-full font-medium placeholder:text-accent/50 text-gray-400"
                    value={typedMessage}
                    onChange={event => setTypedMessage(event.target.value)}
                    placeholder="Type Message"
                  />
                </div>
                <div className="flex flex-row">
                  <p className="font-bold mx-3 my-auto">Fee: </p>
                  <input
                    className="flex border-2 border-base-300 bg-base-200 rounded-full text-accent focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-5 py-4 my-1 w-full font-medium placeholder:text-accent/50 text-gray-400"
                    value={nativeFee}
                    onChange={event => setNativeFee(event.target.value)}
                    placeholder="Native Fee Amount"
                  />
                </div>
                <button className="btn btn-primary px-12 mx-auto" onClick={() => sendMessageWrite()}>
                  SEND
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-base-100 px-10 py-10 mt-9 text-center items-center rounded-3xl shadow-md">
          {isMessageEventsLoading ? (
            <div className="flex justify-center items-center mt-10">
              <Spinner width="75" height="75" />
            </div>
          ) : (
            <div>
              <div className="text-center mb-4">
                <span className="block text-2xl font-bold">Your Messages</span>
              </div>
              <div className="overflow-x-auto shadow-lg">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr className="text-center">
                      <th className="bg-primary">Message</th>
                      <th className="bg-primary">From</th>
                      <th className="bg-primary">From Chain</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!MessageEvents || MessageEvents.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center">
                          No events found
                        </td>
                      </tr>
                    ) : (
                      MessageEvents?.map((event, index) => {
                        if (event.args._receivedMessage.split(".")[0] === connectedWallet?.toLowerCase()) {
                          return (
                            <tr key={index}>
                              <td>{event.args._receivedMessage.split(".")[1]}</td>
                              <td className="text-center">
                                <Address address={event.args._receivedMessage.split(".")[2]} />
                              </td>
                              <td>
                                {event.args._srcChain === 10109 ? (
                                  <Image
                                    className="mx-auto"
                                    width={40}
                                    height={40}
                                    alt="polygon-mumbai-logo"
                                    src="/polygon-matic-logo.png"
                                  />
                                ) : event.args._srcChain === 10132 ? (
                                  <Image
                                    className="mx-auto"
                                    width={40}
                                    height={40}
                                    alt="optimism-goerli-logo"
                                    src="/optimism-ethereum-op-logo.png"
                                  />
                                ) : (
                                  ""
                                )}
                              </td>
                            </tr>
                          );
                        }
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
