import { styled, useTheme } from "@mui/material";
import { Box } from "@mui/system"
import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import SyntaxHighlighter from 'react-syntax-highlighter';
import remarkGfm from 'remark-gfm'

const StyledBox = styled(Box)(({ theme }) => {
    return (
        {
            fontSize: theme.typography.body2.fontSize,
            overflowWrap: "break-word",
            "& p": {
                margin: 0
            }
        }
    )
})

export default function MessageContent({ content }) {
    const theme = useTheme()
    return (
        <StyledBox theme={theme}>
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
        </StyledBox>
    )
}