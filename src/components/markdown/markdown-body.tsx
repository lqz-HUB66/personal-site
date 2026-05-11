import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  content: string;
}

export default function MarkdownBody({ content }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        pre: ({ children, ...props }) => (
          <pre {...props} className="markdown-body pre">
            {children}
          </pre>
        ),
        code: ({ children, className, ...props }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code {...props} className="markdown-body code">
                {children}
              </code>
            );
          }
          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
