import { env } from "@snappin/env"
import { Avatar, AvatarFallback, AvatarImage } from "@snappin/ui/components/avatar"

export const getLogoByDomain = (domain: string) => {
    return(
        <Avatar className="size-7 rounded-xl">
            <AvatarImage src={`https://img.logo.dev/${domain}?token=${env.logoDev.publicKey}`}/>
            <AvatarFallback>{domain.slice(0,1)}</AvatarFallback>
        </Avatar>
    )
}

export const getLogoByName = (companyName: string) => {
    return(
        <Avatar className="size-8 border border-slate-100 rounded-full">
            <AvatarImage src={`https://img.logo.dev/name/${companyName}?token=${env.logoDev.publicKey}`}/>
            <AvatarFallback>{companyName.slice(0,1)}</AvatarFallback>
        </Avatar>
    )
}