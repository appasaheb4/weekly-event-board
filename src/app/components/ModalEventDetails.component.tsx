import React, {useEffect} from 'react';

export interface ModalEventDetailsProps {
  visible?: boolean;
  details?: any;
  onClick: (item?: any) => void;
  onClose: () => void;
}

function getRandomTime(): string {
  const hours = Math.floor(Math.random() * 12) + 1; // Random hour between 1 and 12
  const minutes = Math.floor(Math.random() * 60); // Random minutes between 0 and 59
  const period = Math.random() < 0.5 ? 'AM' : 'PM'; // Randomly choose am or pm

  // Format the time as hh:mm am/pm
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')} ${period}`;
  return formattedTime;
}

export const ModalEventDetails = ({
  visible,
  details,
  onClick,
  onClose,
}: ModalEventDetailsProps) => {
  const [isVisible, setVisible] = React.useState(visible);
  useEffect(() => {
    setVisible(visible);
  }, [visible]);

  console.log({details});

  return (
    <>
      {isVisible && (
        <>
          <div
            className="flex modal-overlay justify-center items-center  overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            onClick={() => {
              onClose();
              setVisible(false);
            }}
          >
            <div className="flex modal-content w-1/3">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-4 border-b border-solid border-gray-300 rounded-t bg-gradient-to-r from-indigo-500 to-purple-600">
                  <div>
                    <h3 className="text-3xl text-white font-semibold">
                      {details?.title}
                    </h3>
                    <div className="flex items-center mt-2 text-white/90 font-medium">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      {getRandomTime()}
                    </div>
                  </div>
                  <button
                    className="text-white/80 hover:text-white bg-white/10 backdrop-blur-sm p-2 rounded-full hover:bg-white/20 transition-all"
                    aria-label="Close"
                    onClick={() => {
                      onClose();
                      setVisible(false);
                    }}
                    type="button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </div>
                {/*body*/}
                <div
                  className="flex-grow overflow-auto bg-gray-50"
                  style={{opacity: 1}}
                >
                  <div className="p-6 sm:p-8 space-y-6">
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 transition-all hover:shadow-md">
                      <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-rose"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        Description
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        Discussion about new requirements for the mobile app
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                      <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-rose"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                        </svg>
                        Attendees (2)
                      </h3>
                      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <li className="flex items-center p-2">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white font-medium text-sm">
                            C
                          </div>
                          <span className="text-gray-700 ml-3 font-medium">
                            Client Team
                          </span>
                        </li>
                        <li className="flex items-center p-2">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white font-medium text-sm">
                            P
                          </div>
                          <span className="text-gray-700 ml-3 font-medium">
                            Product Manager
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/*footer*/}
                <div className="flex items-center justify-end p-2 border-t border-solid border-gray-300 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    style={{transition: 'all .15s ease'}}
                    onClick={() => {
                      onClose();
                      setVisible(false);
                    }}
                  >
                    Close
                  </button>
                  <button
                    className=" bg-gray-300 active:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    style={{transition: 'all .15s ease'}}
                    onClick={() => {
                      setVisible(false);
                      onClick('close');
                    }}
                  >
                    Add To Calender
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
    </>
  );
};
