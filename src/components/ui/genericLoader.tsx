import {SyncLoader} from "react-spinners";

function GenericLoader() {
  return (
    <>
      <div className={'grid h-screen place-items-center'}>
        <SyncLoader className={'rotate-90'}/>
      </div>
    </>
  );
}

export default GenericLoader;