interface ErrorPageProps {
  error: number;
  message?: string;
}

function ErrorPage({error, message}: ErrorPageProps) {
  return (
    <>
      <div className={'grid place-items-center h-screen'}>
        <div>
          <h1 className={'font-black text-6xl text-center'}>{error}</h1>
          <p>{message}</p>
        </div>
      </div>
    </>
  );

}

export default ErrorPage;