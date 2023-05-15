import { useEffect } from "react"

export default function AdBanner(props) {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({})
        } catch (err) {
            console.log(err)
        }
    }, [])

    return (
        <ins
            className="adsbygoogle adbanner-customize"
            style={{ display: "block", overflow: "hidden", ...props.style }}
            data-ad-client={"ca-pub-4673351659658307"}
            {...props}
        />
    )
}