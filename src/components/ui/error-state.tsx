type ErrorStateProps = {
  id?: string;
  title?: string;
  message: string;
};

export function ErrorState({ id, title = "Something went wrong", message }: ErrorStateProps) {
  return (
    <div id={id} className="alert alert-error" role="alert">
      <p className="alert-title">{title}</p>
      <p>{message}</p>
    </div>
  );
}
