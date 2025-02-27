import Header from "@/components/widgets/header/Header.tsx";
import {SyncLoader} from "react-spinners";

function GenericLoader() {
  return (
    <>
      <Header/>
      <div className={'grid h-screen place-items-center'}>
        <SyncLoader className={'rotate-90'}/>
      </div>
    </>
  );
}

export default GenericLoader;