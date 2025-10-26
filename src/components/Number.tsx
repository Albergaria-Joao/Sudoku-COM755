function Number(props) {
  // Idem ao input, o classname é o mesmo em todos
  // props.children é o que será passado dentro do componente (nesse caso, o ícone ou o texto)
  return <td className="bg-slate-100 p-10 solid-border">{props.children}</td>;
}
export default Number;
