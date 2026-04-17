import React from 'react'
import { HomeBlog } from '../../../modules/blog/home.blog'

export default function Page() {
  return (
    <HomeBlog />
  )
}

export const metadata = {
  title: "Blog",
  description:
    "Latest updates and news from snappin",
  keywords: ["snappin blog", "invoice extraction blog", "snappin"],
};
