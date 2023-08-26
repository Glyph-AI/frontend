import { useTheme } from "@mui/material";
import { Box } from "@mui/system"
import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import SyntaxHighlighter from 'react-syntax-highlighter';
import remarkGfm from 'remark-gfm'

export default function MessageContent({ content }) {
    const theme = useTheme()
    return (
        <Box className="messageContent" sx={{ fontSize: theme.typography.body2.fontSize, overflowWrap: "break-word" }}>
            <ReactMarkdown
                children={content}
                remarkPlugins={[remarkGfm]}
                // linkTarget="_blank"
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                            <SyntaxHighlighter
                                {...props}
                                wrapLongLines
                                children={String(children).replace(/\n$/, '')}
                                style={atomOneDark}
                                language={match[1]}
                                PreTag="div"
                            />
                        ) : (
                            <code {...props} className={className}>
                                {children}
                            </code>
                        )
                    }
                }}
            />
        </Box>
    )
}