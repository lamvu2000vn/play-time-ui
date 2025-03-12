import ChatSidebar from "./Chat/ChatSidebar";
import NavBar from "./Navbar/Navbar";
import Header from "./Header/Header";
import WaitingMatchResults from "./WaitingMatchResults";
import {useAppSelector} from "@/libs/redux/hooks";
import {selectStopTheMatchState} from "@/libs/redux/features/inMatchData/inMatchDataSlice";

interface Props {
    children: React.ReactNode;
}

export default function Layout(props: Props) {
    const {children} = props;

    const isStopTheMatch = useAppSelector(selectStopTheMatchState);

    return (
        <div className="relative w-full h-full flex items-stretch divide-x-2 divide-gray-300">
            <div className="flex-1">
                <div className="w-full h-full flex flex-col items-stretch divide-y-2 divide-gray-300">
                    <div className="flex-1 bg-base-100 overflow-hidden">
                        <div className="w-full h-full flex flex-col items-stretch">
                            <div className="basis-14 md:basis-16 xl:basis-20 shrink-0">
                                <Header />
                            </div>
                            <div className="flex-1">{children}</div>
                        </div>
                    </div>
                    <div className="basis-16 shrink-0">
                        <NavBar />
                    </div>
                </div>
            </div>
            <div className="shrink-0 hidden xl:block w-[20rem] 2xl:w-[25rem]">
                <ChatSidebar />
            </div>
            {isStopTheMatch && <WaitingMatchResults />}
        </div>
    );
}
