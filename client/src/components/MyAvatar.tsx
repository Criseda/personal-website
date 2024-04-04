import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
  
  export function MyAvatar() {
    return (
      <Avatar>
        <AvatarImage src="https://github.com/criseda.png" alt="@criseda" />
        <AvatarFallback>CP</AvatarFallback>
      </Avatar>
    )
  }
  