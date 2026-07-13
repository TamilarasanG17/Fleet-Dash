type Props = {
  title?: string;
  message: string;
};

function ErrorFallback({
  title = "Something went wrong",
  message,
}: Props) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6">
      <h2 className="text-lg font-bold text-red-700">
        {title}
      </h2>

      <p className="mt-2 text-red-600">
        {message}
      </p>
    </div>
  );
}

export default ErrorFallback;