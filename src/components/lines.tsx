import type { ReactNode } from "react";

export function Lines({ text }: { text: string }): ReactNode {
  return text.split("\n").map((line, index, all) => (
    <span key={index}>{line}{index < all.length - 1 ? <br/> : null}</span>
  ));
}

export function EmLines({ text }: { text: string }): ReactNode {
  const lines = text.split("\n");
  return <>{lines[0]}{lines[1] ? <><br/><em>{lines[1]}</em></> : null}{lines.slice(2).map(line => <span key={line}><br/>{line}</span>)}</>;
}

export function RichText({ html }: { html: string }): ReactNode {
  return <span dangerouslySetInnerHTML={{ __html: html }}/>;
}
