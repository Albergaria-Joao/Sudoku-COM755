function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  // Idem ao input, o classname é o mesmo em todos
  // props.children é o que será passado dentro do componente (nesse caso, o ícone ou o texto)
  return (
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 m-3"
      {...props}
    >
      {props.children}
    </button>
  );
}
export default Button;
