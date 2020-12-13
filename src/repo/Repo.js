import { useParams } from "react-router-dom";

export default function Repo() {
  const { org, repo } = useParams();
  return (
    <>
      {org}/{repo}
    </>
  );
}
