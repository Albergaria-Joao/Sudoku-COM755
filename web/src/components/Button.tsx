function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  // Idem ao input, o classname é o mesmo em todos
  // props.children é o que será passado dentro do componente (nesse caso, o ícone ou o texto)
  return (
    <button
      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 
                 transition-all rounded-lg font-semibold shadow-md text-white"
      {...props}
    >
      {props.children}
    </button>
  );
}
export default Button;
