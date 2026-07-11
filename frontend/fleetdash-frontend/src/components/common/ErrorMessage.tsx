type Props = {
  message: string;
};

function ErrorMessage({ message }: Props) {
  return (
    <div className="rounded-lg bg-red-100 border border-red-300 p-4 text-red-700">
      {message}
    </div>
  );
}

export default ErrorMessage;