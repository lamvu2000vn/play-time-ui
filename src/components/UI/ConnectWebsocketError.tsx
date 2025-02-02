import {TbPlugConnectedX} from "react-icons/tb";
import Container from "./Container";

export default function ConnectWebsocketError() {
    return (
        <div className="fixed left-0 top-0 w-full h-full bg-base-100 flex items-center justify-center">
            <Container>
                <div className="flex flex-col items-center gap-8 text-gray-500">
                    <TbPlugConnectedX className="w-28 h-28 animate-pulse" />
                    <h1 className="font-semibold text-lg text-center">
                        Không thể kết nối tới server.
                        <br />
                        Vui lòng kiểm tra hoặc thử lại sau.
                    </h1>
                </div>
            </Container>
        </div>
    );
}
