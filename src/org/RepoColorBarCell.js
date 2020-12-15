export default function RepoColorBarCell(props) {
  return (
    <td className="py-1 px-2 sm:px-4 relative z-0">
      <span
        className={`absolute top-0 left-0 h-full ${props.barClass}`}
        style={{
          width: (100 * Math.sqrt(props.value)) / Math.sqrt(props.max) + "%",
        }}
      ></span>
      {props.link ? (
        <a className="relative z-10 hover:underline" href={props.link}>
          {props.value}
        </a>
      ) : (
        <span className="relative z-10">{props.value}</span>
      )}
    </td>
  );
}
